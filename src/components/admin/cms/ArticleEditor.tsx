'use client';
/* eslint-disable @next/next/no-img-element */
import type { BlogPost } from '@/types';
import { CustomSelect } from '@/components/ui/CustomSelect';
import React, { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Eye,
  Save,
  Settings2,
  Plus,
  Upload,
  Check,
  AlertCircle,
} from 'lucide-react';
import {
  db,
  editorUser,
  taxonomy,
  slugOf,
  uploadMedia,
  errorText,
  type TaxonomyItem,
  type TaxonomyKind,
} from '@/lib/cms/client';
import { toArticleHtml, cleanArticleHtml } from '@/lib/cms/html';

import { RichTextEditor } from './RichTextEditor';
import { TaxonomyManager } from './TaxonomyManager';
import { CmsDialog } from './CmsDialog';
import './cms.css';
import { useEditorSession } from './useEditorSession';

function formatIndiaDate(value?: string): string {
  const d = value ? new Date(value) : new Date();
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(d);
}

function formatIndiaDateTime(value?: string): string {
  const d = value ? new Date(value) : new Date();
  const ist = new Date(d.getTime() + 330 * 60000);
  return ist.toISOString().slice(0, 16);
}

export function ArticleEditor({ id }: { id?: string }) {
  const [ready, setReady] = useState(false);
  const [allowed, setAllowed] = useState(false);
  const denyAccess = useCallback(() => setAllowed(false), []);
  useEditorSession(denyAccess);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [preview, setPreview] = useState(false);
  const [manager, setManager] = useState<TaxonomyKind | null>(null);

  // Article state
  const [articleId, setArticleId] = useState(id || '');
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [html, setHtml] = useState('');
  const [initialHtml, setInitialHtml] = useState('');
  const [cover, setCover] = useState('');
  const [category, setCategory] = useState('');
  const [author, setAuthor] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [tagSearch, setTagSearch] = useState('');

  // SEO state
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');
  const [keywords, setKeywords] = useState('');
  const [featured, setFeatured] = useState(false);

  // Publishing state
  const [status, setStatus] = useState<'draft' | 'published' | 'scheduled'>('published');
  const [articleDate, setArticleDate] = useState('');
  const [schedule, setSchedule] = useState('');

  // Taxonomies
  const [categories, setCategories] = useState<TaxonomyItem[]>([]);
  const [authors, setAuthors] = useState<TaxonomyItem[]>([]);
  const [tags, setTags] = useState<TaxonomyItem[]>([]);

  async function refreshTaxonomies() {
    const [c, a, t] = await Promise.all([
      taxonomy('categories'),
      taxonomy('authors'),
      taxonomy('tags'),
    ]);
    setCategories(c);
    setAuthors(a);
    setTags(t);

    setCategory((v) => (c.some((x) => x.id === v) ? v : c.find((x) => x.is_default)?.id || c[0]?.id || ''));
    setAuthor((v) => (a.some((x) => x.id === v) ? v : a.find((x) => x.is_default)?.id || a[0]?.id || ''));
    setSelectedTags((v) => v.filter((tid) => t.some((x) => x.id === tid)));
  }

  // Load article on mount
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const user = await editorUser();
        if (!user) {
          setReady(true);
          return;
        }
        if (!active) return;
        setAllowed(true);

        // Populate default article date on client mount
        setArticleDate(formatIndiaDate());

        await refreshTaxonomies();

        if (id) {
          const result = await db().from('blog_posts').select('*, blog_post_tags(tag_id)').eq('id', id).single();
          if (result.error) throw result.error;
          const p = result.data as BlogPost & { blog_post_tags?: { tag_id: string }[] };
          if (!p) throw new Error('Article not found or you do not have access.');
          if (p) {
            setTitle(p.title || '');
            setSlug(p.slug || '');
            setExcerpt(p.excerpt || '');
            const content = toArticleHtml(p.content, p.content_format);
            setHtml(content);
            setInitialHtml(content);
            setCover(p.cover_image || '');
            setCategory(p.category_id || '');
            setAuthor(p.author_id || '');

            if (p.blog_post_tags) {
              setSelectedTags(p.blog_post_tags.map((t: { tag_id: string }) => t.tag_id));
            } else if (p.tags && Array.isArray(p.tags)) {
              // Map tag names to tag ids if available
              const tagList = await taxonomy('tags');
              const matched = tagList.filter((t) => p.tags.includes(t.name)).map((t) => t.id);
              setSelectedTags(matched);
            }

            setSeoTitle(p.seo_title || '');
            setSeoDescription(p.seo_description || '');
            setKeywords((p.seo_keywords || []).join(', '));
            setFeatured(Boolean(p.is_featured));

            const isSched =
              p.publication_status === 'scheduled' && p.publish_at && new Date(p.publish_at) > new Date();
            setStatus(isSched ? 'scheduled' : p.is_published ? 'published' : (p.publication_status || 'draft'));
            setArticleDate(formatIndiaDate(p.published_at));
            if (p.publish_at) {
              setSchedule(formatIndiaDateTime(p.publish_at));
            }
          }
        }
      } catch (e) {
        setError(errorText(e));
      } finally {
        if (active) setReady(true);
      }
    })();

    return () => {
      active = false;
    };
  }, [id]);

  // Unload warning if dirty
  useEffect(() => {
    if (!dirty) return;
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [dirty]);

  async function handleSave(mode: 'draft' | 'published' | 'scheduled') {
    setBusy(true);
    setError('');
    setMessage('');

    try {
      if (!title.trim()) throw new Error('Please add an article title (H1).');
      if (!slug.trim()) throw new Error('Please specify a URL slug for the article.');
      if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
        throw new Error('Slug should contain only lowercase letters, numbers, and hyphens (e.g. "my-article").');
      }
      if (!excerpt.trim()) throw new Error('Please add a short subtitle / excerpt.');
      if (!category) throw new Error('Please select an article category.');
      if (!author) throw new Error('Please select an author.');

      const cleanContent = cleanArticleHtml(html);
      if (!cleanContent.replace(/<[^>]*>/g, '').trim() && !cleanContent.includes('<img')) {
        throw new Error('Please add some content to your article.');
      }

      // Compute publication timing
      let publishAtIso = new Date().toISOString();
      if (mode === 'scheduled') {
        if (!schedule) throw new Error('Please choose a schedule date and time.');
        publishAtIso = new Date(schedule + '+05:30').toISOString();
        if (new Date(publishAtIso) <= new Date()) {
          throw new Error('Scheduled time must be in the future. Or choose "Publish now" to publish immediately.');
        }
      }

      // Displayed article date (supports past dates)
      const dateToUse = articleDate ? new Date(articleDate + 'T12:00:00+05:30').toISOString() : new Date().toISOString();

      const savedId = articleId || crypto.randomUUID();
      const wordCount = cleanContent.replace(/<[^>]*>/g, ' ').split(/\s+/).filter(Boolean).length;
      const readingTime = `${Math.max(1, Math.ceil(wordCount / 200))} min read`;
      const kwList = keywords.split(',').map((x) => x.trim()).filter(Boolean);

      const client = db();
      const r = await client.rpc('save_cms_article', {
        article: {
          id: savedId,
          title: title.trim(),
          slug: slug.trim(),
          excerpt: excerpt.trim(),
          content: cleanContent,
          cover_image: cover,
          category_id: category,
          author_id: author,
          reading_time: readingTime,
          published_at: dateToUse,
          is_published: mode !== 'draft',
          is_featured: featured,
          seo_title: seoTitle || title.trim(),
          seo_description: seoDescription || excerpt.trim(),
          seo_keywords: kwList,
          publication_status: mode,
          publish_at: publishAtIso,
        },
        selected_tags: selectedTags,
      });
      if (r.error) throw r.error;

      setArticleId(savedId);
      setStatus(mode);
      setDirty(false);
      setMessage(
        mode === 'scheduled'
          ? 'Article scheduled successfully. It will automatically publish at the scheduled time.'
          : mode === 'draft'
          ? 'Draft saved successfully.'
          : 'Article published live!'
      );

      if (!articleId && typeof window !== 'undefined') {
        window.history.replaceState(null, '', `/admin/articles/${savedId}`);
      }
    } catch (e) {
      setError(errorText(e));
    } finally {
      setBusy(false);
    }
  }

  if (!ready) {
    return (
      <main className="cms-page">
        <p role="status" className="text-slate-600">
          Loading your article workspace…
        </p>
      </main>
    );
  }

  if (!allowed) {
    return (
      <main className="cms-page">
        <div className="max-w-md mx-auto py-20 text-center space-y-4">
          <h1 className="text-2xl font-bold text-slate-900">Sign in to your workspace.</h1>
          <p className="text-sm text-slate-600">Admin authorization is required to edit articles.</p>
          <Link
            className="cms-primary"
            href={`/admin?next=${encodeURIComponent(id ? '/admin/articles/' + id : '/admin/articles/new')}`}
          >
            Admin sign in
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="cms-page">
      {/* Top Header */}
      <header className="cms-page-header">
        <div>
          <Link
            className="cms-link"
            href="/admin"
            onClick={(e) => {
              if (dirty && !confirm('You have unsaved changes. Leave without saving?')) {
                e.preventDefault();
              }
            }}
          >
            <ArrowLeft size={16} /> Back to admin dashboard
          </Link>
          <span className="cms-eyebrow">
            DOCTORS AT DOOR / {id ? 'EDIT ARTICLE' : 'NEW PERSPECTIVE'}
          </span>
          <h1>
            Your next <em>perspective.</em>
          </h1>
        </div>

        <div className="cms-header-actions">
          <span>{dirty ? 'Unsaved changes' : message ? 'Saved' : 'Ready'}</span>
          <button
            type="button"
            onClick={() => setPreview(true)}
            className="cms-secondary"
          >
            <Eye size={17} /> Preview
          </button>
          <button
            disabled={busy}
            type="button"
            className="cms-primary"
            onClick={() => handleSave(status)}
          >
            <Save size={17} />
            {busy ? 'Saving…' : status === 'draft' ? 'Save draft' : 'Save article'}
          </button>
        </div>
      </header>

      {error && (
        <div role="alert" className="cms-error-box mb-6">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}
      {message && (
        <p role="status" className="cms-success mb-6">
          <Check size={16} className="inline mr-2 text-emerald-600" />
          {message}
        </p>
      )}

      {/* 75% / 25% Grid Layout */}
      <div className="cms-editor-layout">
        {/* 75% MAIN COLUMN */}
        <div className="cms-editor-main" onChange={() => setDirty(true)}>
          {/* Article Title & Subtitle */}
          <section className="cms-title-section">
            <label className="cms-field">
              <span className="text-xs uppercase tracking-wider text-slate-500 font-bold">
                Article Title (H1)
              </span>
              <input
                className="cms-title-input"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (!articleId) setSlug(slugOf(e.target.value));
                  setDirty(true);
                }}
                placeholder="Give your story a meaningful title"
              />
            </label>

            <label className="cms-field">
              <span className="text-xs uppercase tracking-wider text-slate-500 font-bold">
                Subtitle / Excerpt
              </span>
              <textarea
                rows={2}
                value={excerpt}
                onChange={(e) => {
                  setExcerpt(e.target.value);
                  setDirty(true);
                }}
                placeholder="A compelling one or two-sentence introduction for this perspective..."
              />
            </label>
          </section>

          {/* Real-time Rich Text Editor with Toolbar & Inline "+" Block Add */}
          <RichTextEditor
            initialHtml={initialHtml}
            onChange={(val) => {
              setHtml(val);
              setDirty(true);
            }}
          />

          {/* SEO Details Section */}
          <section className="cms-panel">
            <span className="cms-eyebrow">SEARCH ENGINE OPTIMIZATION</span>
            <h2>SEO & discovery details</h2>

            <label className="cms-field">
              SEO Title
              <input
                value={seoTitle}
                onChange={(e) => {
                  setSeoTitle(e.target.value);
                  setDirty(true);
                }}
                placeholder={title || 'Primary search title'}
              />
              <small>{(seoTitle || title).length}/60 recommended characters</small>
            </label>

            <label className="cms-field">
              Article Slug (URL path)
              <input
                value={slug}
                onChange={(e) => {
                  setSlug(e.target.value);
                  setDirty(true);
                }}
                placeholder="my-article-slug"
                required
              />
              <small>
                Public URL:{' '}
                <span className="font-mono text-indigo-600">
                  doctorsatdoor.com/blog/{slug || 'your-article'}
                </span>
              </small>
            </label>

            <label className="cms-field">
              SEO Meta Description
              <textarea
                rows={3}
                value={seoDescription}
                onChange={(e) => {
                  setSeoDescription(e.target.value);
                  setDirty(true);
                }}
                placeholder={excerpt || 'Search engine summary snippet'}
              />
              <small>
                {(seoDescription || excerpt).length}/160 recommended characters
              </small>
            </label>

            <label className="cms-field">
              Targeted Keywords
              <input
                value={keywords}
                onChange={(e) => {
                  setKeywords(e.target.value);
                  setDirty(true);
                }}
                placeholder="health records, medical fragmentation, connected care, DAD Report"
              />
              <small>Separate keywords with commas.</small>
            </label>

            {/* Google Search Snippet Preview */}
            <div className="cms-search-preview">
              <small className="text-slate-500 font-mono text-xs">
                https://www.doctorsatdoor.com › blog › {slug || 'article'}
              </small>
              <h3 className="text-lg font-semibold text-indigo-900 mt-1">
                {seoTitle || title || 'Your Article Title'}
              </h3>
              <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                {seoDescription || excerpt || 'Your search description will appear in search results.'}
              </p>
            </div>
          </section>
        </div>

        {/* 25% SIDEBAR COLUMN */}
        <aside className="cms-editor-sidebar" onChange={() => setDirty(true)}>
          {/* 1. Publishing Card: Publish now vs Schedule vs Draft */}
          <section className="cms-panel">
            <span className="cms-eyebrow">PUBLISHING CONTROLS</span>
            <h3>Visibility & Date</h3>

            <div className="cms-mode-options">
              {[
                ['published', 'Publish now'],
                ['scheduled', 'Schedule for later'],
                ['draft', 'Draft'],
              ].map(([val, lbl]) => (
                <label key={val} className="cms-radio-label">
                  <input
                    type="radio"
                    name="publication_mode"
                    value={val}
                    checked={status === val}
                    onChange={() => {
                      setStatus(val as 'draft' | 'published' | 'scheduled');
                      setDirty(true);
                    }}
                  />
                  <span>{lbl}</span>
                </label>
              ))}
            </div>

            {/* Article Date (can be past date, backdating allowed) */}
            <label className="cms-field">
              Article Date
              <input
                type="date"
                required
                value={articleDate}
                onChange={(e) => {
                  setArticleDate(e.target.value);
                  setDirty(true);
                }}
              />
              <small>
                Displayed publication date on the article. Past dates are allowed.
              </small>
            </label>

            {/* If Scheduled: select future time */}
            {status === 'scheduled' && (
              <label className="cms-field">
                Scheduled Publish Time (IST)
                <input
                  type="datetime-local"
                  required
                  value={schedule}
                  onChange={(e) => {
                    setSchedule(e.target.value);
                    setDirty(true);
                  }}
                />
                <small>Article remains hidden until this time.</small>
              </label>
            )}

            <button
              disabled={busy}
              type="button"
              className="cms-primary w-full mt-2"
              onClick={() => handleSave(status)}
            >
              {busy
                ? 'Saving…'
                : status === 'draft'
                ? 'Save draft'
                : status === 'scheduled'
                ? 'Schedule article'
                : 'Publish article now'}
            </button>
          </section>

          {/* 2. Category Selector + 50/50 Popup Trigger */}
          <section className="cms-panel">
            <div className="cms-form-heading">
              <h3>Category</h3>
              <button
                type="button"
                className="cms-icon"
                title="Manage categories"
                aria-label="Manage categories"
                onClick={() => setManager('categories')}
              >
                <Settings2 size={16} />
              </button>
            </div>

            <CustomSelect
              aria-label="Select article category"
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setDirty(true);
              }}
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} {c.is_default ? '(Default)' : ''}
                </option>
              ))}
            </CustomSelect>

            <button
              type="button"
              className="cms-link text-xs mt-2"
              onClick={() => setManager('categories')}
            >
              <Plus size={14} /> Add new category
            </button>
          </section>

          {/* 3. Author Selector + 50/50 Popup Trigger */}
          <section className="cms-panel">
            <div className="cms-form-heading">
              <h3>Author</h3>
              <button
                type="button"
                className="cms-icon"
                title="Manage authors"
                aria-label="Manage authors"
                onClick={() => setManager('authors')}
              >
                <Settings2 size={16} />
              </button>
            </div>

            <CustomSelect
              aria-label="Select article author"
              value={author}
              onChange={(e) => {
                setAuthor(e.target.value);
                setDirty(true);
              }}
            >
              {authors.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
            </CustomSelect>

            <button
              type="button"
              className="cms-link text-xs mt-2"
              onClick={() => setManager('authors')}
            >
              <Plus size={14} /> Add new author
            </button>
          </section>

          {/* 4. Topics & Tags Multi-select + Inline Create + 50/50 Popup */}
          <section className="cms-panel">
            <div className="cms-form-heading">
              <h3>Topics & Tags</h3>
              <button
                type="button"
                className="cms-link text-xs"
                onClick={() => setManager('tags')}
              >
                See all tags
              </button>
            </div>

            {/* Instant Tag Search & Inline Create */}
            <input
              aria-label="Search or type tag"
              placeholder="Search or type to add tag..."
              value={tagSearch}
              onChange={(e) => setTagSearch(e.target.value)}
            />

            {/* Inline Create Button if not matching */}
            {tagSearch.trim() &&
              !tags.some((x) => x.name.toLowerCase() === tagSearch.trim().toLowerCase()) && (
                <button
                  disabled={busy}
                  type="button"
                  className="cms-link text-xs mt-2 font-semibold text-indigo-600"
                  onClick={async () => {
                    setBusy(true);
                    try {
                      const r = await db()
                        .from('blog_tags')
                        .insert({ name: tagSearch.trim(), slug: slugOf(tagSearch) })
                        .select('*')
                        .single();
                      if (r.error) throw r.error;
                      setTags([...tags, r.data]);
                      setSelectedTags([...selectedTags, r.data.id]);
                      setDirty(true);
                      setTagSearch('');
                      setDirty(true);
                    } catch (err) {
                      setError(errorText(err));
                    } finally {
                      setBusy(false);
                    }
                  }}
                >
                  <Plus size={14} /> Create tag “{tagSearch.trim()}”
                </button>
              )}

            <div className="cms-tag-options">
              {tags
                .filter((x) => x.name.toLowerCase().includes(tagSearch.toLowerCase()))
                .map((x) => (
                  <label key={x.id} className="cms-tag-checkbox">
                    <input
                      type="checkbox"
                      checked={selectedTags.includes(x.id)}
                      onChange={(e) => {
                        setSelectedTags(
                          e.target.checked
                            ? [...selectedTags, x.id]
                            : selectedTags.filter((tid) => tid !== x.id)
                        );
                        setDirty(true);
                      }}
                    />
                    <span>{x.name}</span>
                  </label>
                ))}
            </div>
          </section>

          {/* 5. Featured Image (Cover) */}
          <section className="cms-panel">
            <h3>Featured image</h3>
            <label className="cms-cover-upload" title="Upload cover image">
              {cover ? (
                <img src={cover} alt="Article cover preview" />
              ) : (
                <span>
                  <Upload size={22} />
                  Upload cover photo (16:9)
                </span>
              )}
              <input
                aria-label="Upload featured image"
                type="file"
                accept="image/png,image/jpeg,image/webp"
                disabled={busy}
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  setBusy(true);
                  try {
                    const url = await uploadMedia(file);
                    setCover(url);
                    setDirty(true);
                  } catch (err) {
                    setError(errorText(err));
                  } finally {
                    setBusy(false);
                  }
                }}
              />
            </label>

            {cover && (
              <button
                type="button"
                className="cms-link text-xs text-rose-600 mt-2"
                onClick={() => {
                  setCover('');
                  setDirty(true);
                }}
              >
                Remove image
              </button>
            )}

            <label className="cms-check mt-4">
              <input
                type="checkbox"
                checked={featured}
                onChange={(e) => {
                  setFeatured(e.target.checked);
                  setDirty(true);
                }}
              />
              <span>Feature prominently on journal homepage</span>
            </label>
          </section>
        </aside>
      </div>

      {/* 50/50 Popups for Categories, Authors, and Tags */}
      {manager && (
        <TaxonomyManager
          kind={manager}
          onClose={() => setManager(null)}
          onChange={() => {
            refreshTaxonomies().catch((e) => setError(errorText(e)));
          }}
        />
      )}

      {/* Article Preview Modal */}
      {preview && (
        <CmsDialog wide title="Article Preview" onClose={() => setPreview(false)}>
          <article className="cms-preview">
            <span className="text-xs uppercase font-bold tracking-wider text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full">
              {categories.find((c) => c.id === category)?.name || 'Journal'}
            </span>
            <h1 className="mt-4">{title || 'Untitled Article'}</h1>
            <p className="text-lg text-slate-600 mt-2">{excerpt}</p>
            {cover && <img src={cover} alt="Cover preview" className="rounded-2xl my-6" />}
            <div
              className="cms-prose mt-6"
              dangerouslySetInnerHTML={{ __html: cleanArticleHtml(html) }}
            />
          </article>
        </CmsDialog>
      )}
    </main>
  );
}
