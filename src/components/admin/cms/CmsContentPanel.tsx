'use client';
/* eslint-disable @next/next/no-img-element */
import React, { useState } from 'react';
import { CustomSelect } from '@/components/ui/CustomSelect';
import Link from 'next/link';
import {
  Plus,
  Pencil,
  Trash2,
  Eye,
  Settings2,
  Sparkles,
  AlertCircle,
  Tag,
} from 'lucide-react';
import { CmsDialog } from './CmsDialog';
import { TaxonomyManager } from './TaxonomyManager';
import { errorText, type TaxonomyKind } from '@/lib/cms/client';
import {
  saveFaq,
  deleteFaq,
  deleteBlogPost,
  deleteChangelogEntry,
} from '@/lib/supabase/data-service';
import type { BlogPost, ChangelogEntry, FAQItem } from '@/types';
import './cms.css';

export function CmsContentPanel({
  kind,
  posts,
  releases,
  faqs,
  onChange,
}: {
  kind: 'blog' | 'changelog' | 'faqs';
  posts: BlogPost[];
  releases: ChangelogEntry[];
  faqs: FAQItem[];
  onChange: () => Promise<void>;
}) {
  const [manager, setManager] = useState<TaxonomyKind | null>(null);
  const [faqModal, setFaqModal] = useState<FAQItem | null>(null);
  const [viewRelease, setViewRelease] = useState<ChangelogEntry | null>(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  // Remove handler
  async function handleRemove(type: 'blog' | 'changelog' | 'faqs', id: string, title?: string) {
    if (!confirm(`Are you sure you want to delete "${title || 'this entry'}"?`)) return;
    setBusy(true);
    setError('');
    try {
      if (type === 'blog') {
        await deleteBlogPost(id);
      } else if (type === 'faqs') {
        await deleteFaq(id);
      } else if (type === 'changelog') {
        await deleteChangelogEntry(id);
      }
      await onChange();
    } catch (e) {
      setError(errorText(e));
    } finally {
      setBusy(false);
    }
  }

  // Save FAQ handler
  async function handleSaveFaq(e: React.FormEvent) {
    e.preventDefault();
    if (!faqModal) return;
    setBusy(true);
    setError('');
    try {
      if (!faqModal.question.trim() || !faqModal.answer.trim()) {
        throw new Error('Both question and answer are required.');
      }
      await saveFaq(faqModal);
      await onChange();
      setFaqModal(null);
    } catch (e) {
      setError(errorText(e));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="cms-content-panel">
      {/* Panel Top Header */}
      <header className="cms-page-header">
        <div>
          <span className="cms-eyebrow">
            {kind === 'blog'
              ? 'THE DAD JOURNAL'
              : kind === 'changelog'
              ? 'PRODUCT RELEASE LOG'
              : 'COMMUNITY & PRODUCT QUESTIONS'}
          </span>
          <h1>
            {kind === 'blog'
              ? 'The DAD journal.'
              : kind === 'changelog'
              ? 'Every update, in one place.'
              : 'Good questions. Clear answers.'}
          </h1>
          <p>
            {kind === 'blog'
              ? 'Create, edit, schedule, and refine your perspectives.'
              : kind === 'changelog'
              ? 'Product releases, new AI features, improvements, and fixes.'
              : 'Update answers for homepage and product accordions.'}
          </p>
        </div>

        <div className="cms-header-actions">
        {kind === 'changelog' && (
          <button
            type="button"
            className="cms-secondary"
            onClick={() => setManager('apps')}
          >
            <Settings2 size={15} /> Manage Live Apps
          </button>
        )}
          {kind === 'faqs' ? (
            <button
              type="button"
              className="cms-primary"
              onClick={() =>
                setFaqModal({
                  id: crypto.randomUUID(),
                  question: '',
                  answer: '',
                  category: 'general',
                  order_index: faqs.length + 1,
                })
              }
            >
              <Plus size={17} /> Add FAQ
            </button>
          ) : kind === 'blog' ? (
            <Link className="cms-primary" href="/admin/articles/new">
              <Plus size={17} /> Write article
            </Link>
          ) : (
            <Link className="cms-primary" href="/admin/releases/new">
              <Plus size={17} /> Add release
            </Link>
          )}
        </div>
      </header>

      {/* Taxonomies quick actions */}
      {kind === 'blog' && <div className="cms-management-links">
        {kind === 'blog' && (
          <>
            <button
              type="button"
              className="cms-secondary"
              onClick={() => setManager('categories')}
            >
              <Settings2 size={15} /> Manage Categories
            </button>
            <button
              type="button"
              className="cms-secondary"
              onClick={() => setManager('authors')}
            >
              <Settings2 size={15} /> Manage Authors
            </button>
            <button
              type="button"
              className="cms-secondary"
              onClick={() => setManager('tags')}
            >
              <Tag size={15} /> Manage Tags
            </button>
          </>
        )}

      </div>}

      {error && (
        <div role="alert" className="cms-error-box mb-6">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {/* 1. BLOG ARTICLES LIST */}
      {kind === 'blog' && (
        <div className="cms-entry-list">
          {posts.map((p) => {
            const isSched =
              p.publication_status === 'scheduled' &&
              p.publish_at &&
              new Date(p.publish_at) > new Date();
            const statusLabel = isSched
              ? 'Scheduled'
              : p.is_published
              ? 'Published'
              : 'Draft';

            return (
              <article key={p.id} className="cms-card-row">
                {p.cover_image && (
                  <img
                    src={p.cover_image}
                    alt={p.title}
                    className="cms-article-thumb"
                  />
                )}
                <div className="cms-card-main">
                  <div className="cms-entry-meta">
                    <span className="cms-badge-category">{p.category}</span>
                    <span
                      className={`cms-badge-status ${
                        isSched ? 'status-scheduled' : p.is_published ? 'status-published' : 'status-draft'
                      }`}
                    >
                      {statusLabel}
                    </span>
                    <time dateTime={p.published_at}>
                      {new Date(p.published_at).toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </time>
                    {p.author?.name && (
                      <span className="text-slate-500">by {p.author.name}</span>
                    )}
                  </div>
                  <h3>{p.title}</h3>
                  <p>{p.excerpt}</p>
                </div>
                <div className="cms-entry-actions">
                  <Link
                    className="cms-icon"
                    aria-label={`Edit ${p.title}`}
                    title="Edit article"
                    href={`/admin/articles/${p.id}`}
                  >
                    <Pencil size={17} />
                  </Link>
                  <Link
                    className="cms-icon"
                    href={`/blog/${p.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`View ${p.title}`}
                    title="View live article"
                  >
                    <Eye size={17} />
                  </Link>
                  <button
                    type="button"
                    className="cms-icon cms-icon-delete"
                    disabled={busy}
                    aria-label={`Delete ${p.title}`}
                    title="Delete article"
                    onClick={() => handleRemove('blog', p.id, p.title)}
                  >
                    <Trash2 size={17} />
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* 2. CHANGELOG RELEASES LIST */}
      {kind === 'changelog' && (
        <div className="cms-entry-list">
          {releases.map((r) => (
            <article key={r.id} className="cms-card-row">
              {r.app?.logo_url ? (
                <img
                  className="cms-app-logo"
                  src={r.app.logo_url}
                  alt={r.app.name}
                />
              ) : (
                <div className="cms-app-logo-fallback">
                  <Sparkles size={20} />
                </div>
              )}
              <div className="cms-card-main">
                <div className="cms-entry-meta">
                  <span className="cms-badge-version">{r.version}</span>
                  <span className="font-semibold text-slate-800">
                    {r.app?.name || r.product_name}
                  </span>
                  <time dateTime={r.release_date}>
                    {new Date(r.release_date + 'T12:00:00').toLocaleDateString(
                      'en-IN',
                      { year: 'numeric', month: 'short', day: 'numeric' }
                    )}
                  </time>
                  {r.is_major && <span className="cms-badge-major">Major release</span>}
                </div>
                <h3>{r.title}</h3>
                {r.key_feature && (
                  <p className="font-medium text-indigo-700 text-xs mt-1">
                    ★ Key Feature: {r.key_feature}
                  </p>
                )}
                <p className="text-slate-600 mt-1">{r.summary}</p>
              </div>
              <div className="cms-entry-actions">
                <button
                  type="button"
                  className="cms-icon"
                  aria-label={`View release details ${r.version}`}
                  title="View details"
                  onClick={() => setViewRelease(r)}
                >
                  <Eye size={17} />
                </button>
                <Link
                  className="cms-icon"
                  aria-label={`Edit ${r.version}`}
                  title="Edit release note"
                  href={`/admin/releases/${r.id}`}
                >
                  <Pencil size={17} />
                </Link>
                <button
                  type="button"
                  className="cms-icon cms-icon-delete"
                  disabled={busy}
                  aria-label={`Delete ${r.version}`}
                  title="Delete release note"
                  onClick={() => handleRemove('changelog', r.id, r.title)}
                >
                  <Trash2 size={17} />
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* 3. FAQS LIST: Every question has EDIT button & DELETE button */}
      {kind === 'faqs' && (
        <div className="cms-entry-list">
          {faqs.map((f) => (
            <article key={f.id} className="cms-card-row">
              <div className="cms-card-main">
                <div className="cms-entry-meta">
                  <span className="cms-badge-category">
                    {f.category.replaceAll('_', ' ')}
                  </span>
                  <span className="text-slate-400 text-xs font-mono">
                    Order: #{f.order_index}
                  </span>
                </div>
                <h3 className="text-base font-semibold text-slate-900 mt-1">
                  {f.question}
                </h3>
                <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                  {f.answer}
                </p>
              </div>
              <div className="cms-entry-actions">
                {/* EDIT BUTTON (Opens FAQ Dialog pre-filled) */}
                <button
                  type="button"
                  className="cms-icon"
                  title="Edit FAQ"
                  aria-label={`Edit ${f.question}`}
                  onClick={() => setFaqModal({ ...f })}
                >
                  <Pencil size={17} />
                </button>
                {/* DELETE BUTTON */}
                <button
                  type="button"
                  className="cms-icon cms-icon-delete"
                  disabled={busy}
                  title="Delete FAQ"
                  aria-label={`Delete ${f.question}`}
                  onClick={() => handleRemove('faqs', f.id, f.question)}
                >
                  <Trash2 size={17} />
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Empty State */}
      {(kind === 'blog' ? posts : kind === 'changelog' ? releases : faqs).length === 0 && (
        <div className="cms-empty">
          <p>No entries yet. Click the button above to create your first one.</p>
        </div>
      )}

      {/* Taxonomy 50/50 Popups */}
      {manager && (
        <TaxonomyManager
          kind={manager}
          onClose={() => setManager(null)}
          onChange={() => {
            onChange().catch((e) => setError(errorText(e)));
          }}
        />
      )}

      {/* Release Note Details Modal */}
      {viewRelease && (
        <CmsDialog wide title={viewRelease.title} onClose={() => setViewRelease(null)}>
          <div className="cms-form space-y-4">
            <div className="cms-entry-meta">
              <span className="cms-badge-version">{viewRelease.version}</span>
              <span className="font-semibold text-slate-800">
                {viewRelease.app?.name || viewRelease.product_name}
              </span>
              <span>{viewRelease.release_date}</span>
            </div>

            {viewRelease.key_feature && (
              <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-xl">
                <span className="text-xs uppercase font-bold text-indigo-700">
                  Key Feature
                </span>
                <p className="font-medium text-slate-800 text-sm mt-1">
                  {viewRelease.key_feature}
                </p>
              </div>
            )}

            <p className="text-slate-600 text-sm leading-relaxed">{viewRelease.summary}</p>

            <div className="cms-release-changes mt-4">
              <h4 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-2">
                What Changed
              </h4>
              {(viewRelease.changes || []).map((c, i) => (
                <div key={i} className="cms-change-item">
                  <span className={`cms-change-chip cms-change-${c.type}`}>
                    {c.type}
                  </span>
                  <p className="text-sm text-slate-700">{c.text}</p>
                </div>
              ))}
            </div>

            <div className="pt-4 flex justify-end">
              <Link className="cms-primary" href={`/admin/releases/${viewRelease.id}`}>
                <Pencil size={15} /> Edit Release Note
              </Link>
            </div>
          </div>
        </CmsDialog>
      )}

      {/* FAQ Add & Edit Dialog (Opens in a popup with prefilled fields) */}
      {faqModal && (
        <CmsDialog
          title={faqModal.id && faqs.some((f) => f.id === faqModal.id) ? 'Edit FAQ' : 'Add FAQ'}
          onClose={() => {
            if (!busy) setFaqModal(null);
          }}
        >
          <form className="cms-form" onSubmit={handleSaveFaq}>
            <label className="cms-field">
              Question
              <input
                required
                value={faqModal.question}
                onChange={(e) =>
                  setFaqModal({ ...faqModal, question: e.target.value })
                }
                placeholder="What is Doctors At Door (DAD)?"
              />
            </label>

            <label className="cms-field">
              Answer
              <textarea
                rows={5}
                required
                value={faqModal.answer}
                onChange={(e) =>
                  setFaqModal({ ...faqModal, answer: e.target.value })
                }
                placeholder="Enter clear, helpful answer text..."
              />
            </label>

            <div className="cms-two-fields">
              <label className="cms-field">
                Category
                <CustomSelect
                  aria-label="FAQ category"
                  value={faqModal.category}
                  onChange={(e) =>
                    setFaqModal({
                      ...faqModal,
                      category: e.target.value as FAQItem['category'],
                    })
                  }
                >
                  <option value="general">General</option>
                  <option value="dad_report">DAD Report</option>
                  <option value="ecosystem">Ecosystem</option>
                  <option value="partnerships">Partnerships</option>
                  <option value="privacy">Privacy & Security</option>
                </CustomSelect>
              </label>

              <label className="cms-field">
                Display Order
                <input
                  type="number"
                  min={0}
                  value={faqModal.order_index}
                  onChange={(e) =>
                    setFaqModal({
                      ...faqModal,
                      order_index: Number(e.target.value),
                    })
                  }
                />
              </label>
            </div>

            {error && (
              <div role="alert" className="cms-error-box">
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                className="cms-secondary"
                disabled={busy}
                onClick={() => setFaqModal(null)}
              >
                Cancel
              </button>
              <button className="cms-primary" type="submit" disabled={busy}>
                {busy ? 'Saving…' : 'Save FAQ'}
              </button>
            </div>
          </form>
        </CmsDialog>
      )}
    </div>
  );
}
