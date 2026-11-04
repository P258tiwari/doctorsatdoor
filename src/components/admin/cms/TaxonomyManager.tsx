'use client';
/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Upload, AlertCircle } from 'lucide-react';
import { CmsDialog } from './CmsDialog';
import {
  taxonomy,
  saveTaxonomyItem,
  deleteTaxonomyItem,
  uploadMedia,
  errorText,
  type TaxonomyKind,
  type TaxonomyItem,
} from '@/lib/cms/client';

const labels: Record<TaxonomyKind, { singular: string; plural: string }> = {
  categories: { singular: 'category', plural: 'Categories' },
  authors: { singular: 'author', plural: 'Authors' },
  tags: { singular: 'tag', plural: 'Tags' },
  apps: { singular: 'live app', plural: 'Live apps' },
};

export function TaxonomyManager({
  kind,
  onClose,
  onChange,
}: {
  kind: TaxonomyKind;
  onClose: () => void;
  onChange: () => void;
}) {
  const [items, setItems] = useState<TaxonomyItem[]>([]);
  const [selected, setSelected] = useState<TaxonomyItem | null>(null);
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [bio, setBio] = useState('');
  const [image, setImage] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [search, setSearch] = useState('');

  const load = async () => {
    try {
      const data = await taxonomy(kind);
      setItems(data);
    } catch (e) {
      setError(errorText(e));
    }
  };

  useEffect(() => {
    let active = true;
    taxonomy(kind)
      .then((v) => {
        if (active) setItems(v);
      })
      .catch((e) => {
        if (active) setError(errorText(e));
      });
    return () => {
      active = false;
    };
  }, [kind]);

  function choose(item: TaxonomyItem | null) {
    setSelected(item);
    setName(item?.name || '');
    setRole(item?.role || '');
    setBio(item?.bio || '');
    setImage(item?.avatar_url || item?.logo_url || '');
    setError('');
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      if (!name.trim()) throw new Error(`Enter a ${labels[kind].singular} name.`);

      const payload: Partial<TaxonomyItem> = {
        name: name.trim(),
      };
      if (selected) payload.id = selected.id;

      if (kind === 'authors') {
        payload.role = role.trim();
        payload.bio = bio.trim();
        payload.avatar_url = image;
      }
      if (kind === 'apps') {
        payload.logo_url = image;
      }

      await saveTaxonomyItem(kind, payload);
      await load();
      choose(null);
      onChange();
    } catch (e) {
      setError(errorText(e));
    } finally {
      setBusy(false);
    }
  }

  async function handleRemove(item: TaxonomyItem) {
    if (item.is_default) {
      alert('The default entry cannot be deleted.');
      return;
    }
    const hint =
      kind === 'categories'
        ? 'All its articles will be automatically reassigned to "DAD General".'
        : kind === 'authors'
        ? 'All its articles will be automatically reassigned to the default author.'
        : kind === 'apps'
        ? 'Live apps with linked release notes should not be deleted.'
        : 'This tag will be unlinked from existing articles.';

    if (!confirm(`Are you sure you want to delete "${item.name}"?\n${hint}`)) {
      return;
    }

    setBusy(true);
    setError('');
    try {
      await deleteTaxonomyItem(kind, item.id);
      if (selected?.id === item.id) choose(null);
      await load();
      onChange();
    } catch (e) {
      setError(errorText(e));
    } finally {
      setBusy(false);
    }
  }

  const filteredItems = items.filter((i) =>
    i.name.toLowerCase().includes(search.toLowerCase().trim())
  );

  return (
    <CmsDialog wide title={`Manage ${labels[kind].plural}`} onClose={onClose}>
      <div className="cms-manager">
        {/* LEFT 50%: Available List with Edit & Delete & Post Count */}
        <section className="cms-manager-col-left">
          <div className="cms-field">
            <label htmlFor="tax-search">Search {labels[kind].plural.toLowerCase()}</label>
            <input
              id="tax-search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={`Filter ${labels[kind].plural.toLowerCase()}...`}
            />
          </div>

          <div className="cms-manager-list" role="list">
            {filteredItems.map((item) => (
              <div
                className={`cms-manager-item ${selected?.id === item.id ? 'selected' : ''}`}
                key={item.id}
                role="listitem"
              >
                {/* 1:1 Circle for Authors, 1:1 Rounded for Apps */}
                {kind === 'authors' && (
                  <div className="cms-item-avatar-circle">
                    {item.avatar_url ? (
                      <img src={item.avatar_url} alt={item.name} />
                    ) : (
                      <span>{item.name[0] || 'A'}</span>
                    )}
                  </div>
                )}
                {kind === 'apps' && (
                  <div className="cms-item-app-logo">
                    {item.logo_url ? (
                      <img src={item.logo_url} alt={item.name} />
                    ) : (
                      <span>{item.name[0] || 'L'}</span>
                    )}
                  </div>
                )}

                <div className="cms-item-info">
                  <strong>{item.name}</strong>
                  {item.role && <span className="cms-item-sub">{item.role}</span>}
                  <small>
                    {item.count ?? 0} {kind === 'apps' ? 'release notes' : 'posts'}
                    {item.is_default && (
                      <span className="cms-badge-default"> · Default</span>
                    )}
                  </small>
                </div>

                <div className="cms-item-actions">
                  <button
                    type="button"
                    className="cms-icon"
                    title={`Edit ${item.name}`}
                    aria-label={`Edit ${item.name}`}
                    onClick={() => choose(item)}
                  >
                    <Pencil size={15} />
                  </button>
                  <button
                    type="button"
                    className="cms-icon cms-icon-delete"
                    title={item.is_default ? 'Default item cannot be deleted' : `Delete ${item.name}`}
                    aria-label={`Delete ${item.name}`}
                    disabled={busy || item.is_default}
                    onClick={() => handleRemove(item)}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
            {filteredItems.length === 0 && (
              <p className="cms-empty-note">No {labels[kind].plural.toLowerCase()} found.</p>
            )}
          </div>
        </section>

        {/* RIGHT 50%: Edit or Add Form */}
        <form onSubmit={handleSave} className="cms-manager-col-right">
          <div className="cms-form-heading">
            <h3>{selected ? `Edit ${labels[kind].singular}` : `Add new ${labels[kind].singular}`}</h3>
            {selected && (
              <button
                type="button"
                className="cms-link"
                onClick={() => choose(null)}
              >
                <Plus size={14} /> Create new instead
              </button>
            )}
          </div>

          {selected && (
            <div className="cms-selected-card">
              <span>Currently editing:</span>
              <strong>{selected.name}</strong>
              {selected.is_default && (
                <small className="cms-notice">This is the default entry used for fallback.</small>
              )}
            </div>
          )}

          {/* Author 1:1 Circle Photo Upload */}
          {kind === 'authors' && (
            <div className="cms-avatar-row">
              <label className="cms-avatar-upload circle" title="Click to upload author photo">
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  disabled={busy}
                  aria-label="Upload author profile picture 1:1"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    setBusy(true);
                    setError('');
                    try {
                      const url = await uploadMedia(file, true);
                      setImage(url);
                    } catch (err) {
                      setError(errorText(err));
                    } finally {
                      setBusy(false);
                    }
                  }}
                />
                {image ? (
                  <img src={image} alt="Author avatar" className="circle" />
                ) : (
                  <div className="cms-upload-prompt">
                    <Upload size={22} />
                    <span>Upload 1:1</span>
                  </div>
                )}
              </label>
              <div className="cms-avatar-hint">
                <strong>Profile image</strong>
                <small>1:1 aspect ratio circle. Uploaded directly as center-aligned preview.</small>
                {image && (
                  <button
                    type="button"
                    className="cms-link text-xs text-rose-600"
                    onClick={() => setImage('')}
                  >
                    Remove photo
                  </button>
                )}
              </div>
            </div>
          )}

          {/* App 1:1 Rounded Logo Upload */}
          {kind === 'apps' && (
            <div className="cms-avatar-row">
              <label className="cms-avatar-upload rounded" title="Click to upload live app logo">
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  disabled={busy}
                  aria-label="Upload app logo 1:1"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    setBusy(true);
                    setError('');
                    try {
                      const url = await uploadMedia(file, true);
                      setImage(url);
                    } catch (err) {
                      setError(errorText(err));
                    } finally {
                      setBusy(false);
                    }
                  }}
                />
                {image ? (
                  <img src={image} alt="App logo" className="rounded-xl" />
                ) : (
                  <div className="cms-upload-prompt">
                    <Upload size={22} />
                    <span>App Logo</span>
                  </div>
                )}
              </label>
              <div className="cms-avatar-hint">
                <strong>App logo</strong>
                <small>1:1 rounded square logo showing beside release notes.</small>
                {image && (
                  <button
                    type="button"
                    className="cms-link text-xs text-rose-600"
                    onClick={() => setImage('')}
                  >
                    Remove logo
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Name Field */}
          <label className="cms-field">
            {kind === 'categories'
              ? selected
                ? 'Change category name'
                : 'Category name'
              : kind === 'authors'
              ? 'Author name'
              : kind === 'apps'
              ? 'Live app name'
              : selected
              ? 'Change tag name'
              : 'Tag name'}
            <input
              required
              maxLength={100}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={`e.g. ${
                kind === 'categories'
                  ? 'DAD General'
                  : kind === 'authors'
                  ? 'Doctors At Door'
                  : kind === 'apps'
                  ? 'DAD Report'
                  : 'Health Records'
              }`}
            />
          </label>

          {/* Additional Author Fields: Designation & Bio */}
          {kind === 'authors' && (
            <>
              <label className="cms-field">
                Designation / title
                <input
                  required
                  maxLength={100}
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="e.g. DAD Editorial Team"
                />
              </label>

              <label className="cms-field">
                Bio
                <textarea
                  rows={3}
                  maxLength={180}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Ideas and perspectives from the team building a more connected healthcare journey."
                />
                <small>{bio.length}/180 characters</small>
              </label>
            </>
          )}

          {error && (
            <div role="alert" className="cms-error-box">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <button disabled={busy} className="cms-primary" type="submit">
            {busy
              ? 'Saving…'
              : selected
              ? `Save ${labels[kind].singular} changes`
              : `Add ${labels[kind].singular}`}
          </button>
        </form>
      </div>
    </CmsDialog>
  );
}
