'use client';
import type { ChangelogEntry } from '@/types';
import { CustomSelect } from '@/components/ui/CustomSelect';
import React, { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Plus,
  Trash2,
  Settings2,
  Check,
  AlertCircle,
} from 'lucide-react';
import {
  db,
  editorUser,
  taxonomy,
  errorText,
  type TaxonomyItem,
} from '@/lib/cms/client';
import { saveChangelogEntry } from '@/lib/supabase/data-service';
import { TaxonomyManager } from './TaxonomyManager';
import './cms.css';
import { useEditorSession } from './useEditorSession';

type Change = { type: 'new' | 'upgrade' | 'fix'; text: string };

export function ReleaseEditor({ id }: { id?: string }) {
  const [ready, setReady] = useState(false);
  const [allowed, setAllowed] = useState(false);
  const denyAccess = useCallback(() => setAllowed(false), []);
  useEditorSession(denyAccess);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [manager, setManager] = useState(false);
  const [apps, setApps] = useState<TaxonomyItem[]>([]);
  const [app, setApp] = useState('');
  const [version, setVersion] = useState('');
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [keyFeature, setKeyFeature] = useState('');
  const [date, setDate] = useState('');
  const [changes, setChanges] = useState<Change[]>([
    { type: 'new', text: '' },
  ]);
  const [entryId, setEntryId] = useState(id);
  const [dirty, setDirty] = useState(false);

  const refreshApps = async () => {
    const list = await taxonomy('apps');
    setApps(list);
    setApp((v) => (list.some((x) => x.id === v) ? v : list[0]?.id || ''));
  };

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

        setDate(new Date().toISOString().slice(0, 10));

        await refreshApps();

        if (id) {
          const result = await db().from('changelog_entries').select('*').eq('id', id).single();
          if (result.error) throw result.error;
          const c = result.data as ChangelogEntry;
          if (!c) throw new Error('Release not found or you do not have access.');
          if (c) {
            setApp(c.app_id || '');
            setVersion(c.version || '');
            setTitle(c.title || '');
            setSummary(c.summary || '');
            setKeyFeature(c.key_feature || '');
            setDate(c.release_date || '');
            if (c.changes?.length) {
              setChanges(c.changes);
            } else {
              const reconstructed: Change[] = [
                ...(c.features || []).map((t: string) => ({ type: 'new' as const, text: t })),
                ...(c.improvements || []).map((t: string) => ({ type: 'upgrade' as const, text: t })),
                ...(c.fixes || []).map((t: string) => ({ type: 'fix' as const, text: t })),
              ];
              setChanges(reconstructed.length ? reconstructed : [{ type: 'new', text: '' }]);
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

  useEffect(() => {
    if (!dirty) return;
    const beforeUnload = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener('beforeunload', beforeUnload);
    return () => window.removeEventListener('beforeunload', beforeUnload);
  }, [dirty]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError('');
    setMessage('');

    try {
      if (!version.trim()) throw new Error('Please enter a version string (e.g. V 1.0.0 or v2.5.0).');
      if (!title.trim()) throw new Error('Please enter a release title.');
      if (!summary.trim()) throw new Error('Please provide a brief summary of this release.');
      if (!app) throw new Error('Please select a live app.');
      if (!changes.length || changes.some((x) => !x.text.trim())) {
        throw new Error('Please provide text for all changes, or remove empty change rows.');
      }

      const selectedApp = apps.find((x) => x.id === app) || apps[0];
      const savedId = entryId || crypto.randomUUID();

      const newFeatures = changes.filter((x) => x.type === 'new').map((x) => x.text.trim());
      const newUpgrades = changes.filter((x) => x.type === 'upgrade').map((x) => x.text.trim());
      const newFixes = changes.filter((x) => x.type === 'fix').map((x) => x.text.trim());

      const payload = {
        id: savedId,
        app_id: app,
        app: {
          id: selectedApp?.id || 'app-report',
          name: selectedApp?.name || 'DAD Report',
          logo_url: selectedApp?.logo_url || '/images/dad-reports-logo.webp',
        },
        product_id: (selectedApp?.name || 'dad-report').toLowerCase().replace(/\s+/g, '-'),
        product_name: selectedApp?.name || 'DAD Report',
        version: version.trim(),
        title: title.trim(),
        summary: summary.trim(),
        key_feature: keyFeature.trim(),
        release_date: date,
        changes,
        features: newFeatures,
        improvements: newUpgrades,
        fixes: newFixes,
        is_major: changes.some((x) => x.type === 'new'),
      };

      await saveChangelogEntry(payload);

      setEntryId(savedId);
      setDirty(false);
      setMessage('Release note saved successfully.');

      if (!entryId && typeof window !== 'undefined') {
        window.history.replaceState(null, '', `/admin/releases/${savedId}`);
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
        <p className="text-slate-600">Loading release note editor…</p>
      </main>
    );
  }

  if (!allowed) {
    return (
      <main className="cms-page">
        <div className="max-w-md mx-auto py-20 text-center space-y-4">
          <h1 className="text-2xl font-bold">Sign in to manage product updates.</h1>
          <Link
            className="cms-primary"
            href={`/admin?next=${encodeURIComponent(id ? '/admin/releases/' + id : '/admin/releases/new')}`}
          >
            Admin sign in
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="cms-page">
      <header className="cms-page-header">
        <div>
          <Link
            className="cms-link"
            href="/admin"
            onClick={(e) => {
              if (dirty && !confirm('You have unsaved changes. Leave?')) e.preventDefault();
            }}
          >
            <ArrowLeft size={16} /> Back to admin workspace
          </Link>
          <span className="cms-eyebrow">
            DOCTORS AT DOOR / {id ? 'EDIT RELEASE' : 'NEW RELEASE'}
          </span>
          <h1>
            Every update.<br />
            <em>A step forward.</em>
          </h1>
        </div>
      </header>

      <form onSubmit={handleSave} onChange={() => setDirty(true)} className="cms-release-form">
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

        {/* Version String & Date */}
        <div className="cms-two-fields">
          <label className="cms-field">
            Version String (e.g. V 1.0.0 or v2.5.0)
            <input
              value={version}
              onChange={(e) => setVersion(e.target.value)}
              placeholder="V 1.0.0"
              required
            />
          </label>

          <label className="cms-field">
            Release Date
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </label>
        </div>

        {/* Live App Selector + 50/50 popup trigger */}
        <div className="cms-field">
          <div className="cms-form-heading">
            <label htmlFor="app-select">Target Live App</label>
            <button
              type="button"
              className="cms-link text-xs"
              onClick={() => setManager(true)}
            >
              <Settings2 size={15} /> Manage / Add Live Apps
            </button>
          </div>
          <CustomSelect
            id="app-select"
            value={app}
            onChange={(e) => { setApp(e.target.value); setDirty(true); }}
            required
          >
            {apps.map((x) => (
              <option key={x.id} value={x.id}>
                {x.name}
              </option>
            ))}
          </CustomSelect>
        </div>

        {/* Release Title */}
        <label className="cms-field">
          Release Title
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Multilingual OCR & Faster Timeline Load"
            required
          />
        </label>

        {/* One Line Key Feature */}
        <label className="cms-field">
          Key Feature (One line summary)
          <input
            maxLength={180}
            value={keyFeature}
            onChange={(e) => setKeyFeature(e.target.value)}
            placeholder="e.g. Real-time diagnostic appointments sync and regional voice summaries"
          />
        </label>

        {/* Release Summary */}
        <label className="cms-field">
          Summary
          <textarea
            rows={3}
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            placeholder="Brief overview of this release for patient and clinic users..."
            required
          />
        </label>

        {/* What Changed Repeater Field */}
        <div className="cms-panel mt-6">
          <div className="cms-form-heading">
            <div>
              <span className="cms-eyebrow">DETAILED CHANGELOG</span>
              <h2 className="text-xl font-bold">What changed</h2>
            </div>
            <button
              type="button"
              className="cms-primary text-xs py-2 px-3"
              onClick={() => {
                setChanges([...changes, { type: 'new', text: '' }]);
                setDirty(true);
              }}
            >
              <Plus size={15} /> Add change row
            </button>
          </div>

          <div className="cms-repeater space-y-3 mt-4">
            {changes.map((change, i) => (
              <div key={i} className="cms-change-row">
                {/* Change Type Selector */}
                <CustomSelect
                  aria-label={`Change ${i + 1} type`}
                  value={change.type}
                  onChange={(e) => {
                    setDirty(true);
                    setChanges(
                      changes.map((x, n) =>
                        n === i ? { ...x, type: e.target.value as Change['type'] } : x
                      )
                    );
                  }}
                  className="font-medium"
                >
                  <option value="new">New</option>
                  <option value="upgrade">Upgrade</option>
                  <option value="fix">Fix</option>
                </CustomSelect>

                {/* Change Description */}
                <input
                  aria-label={`Change ${i + 1} text`}
                  required
                  value={change.text}
                  placeholder="Describe the update (e.g. Support for Gujarati and Tamil AI report narration)"
                  onChange={(e) =>
                    setChanges(
                      changes.map((x, n) =>
                        n === i ? { ...x, text: e.target.value } : x
                      )
                    )
                  }
                />

                {/* Delete Row Button */}
                <button
                  type="button"
                  className="cms-icon cms-icon-delete"
                  title="Remove this change"
                  aria-label={`Remove change ${i + 1}`}
                  onClick={() => {
                    if (changes.length === 1) {
                      setChanges([{ type: 'new', text: '' }]);
                    } else {
                      setChanges(changes.filter((_, n) => n !== i));
                    }
                    setDirty(true);
                  }}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>

          <button
            type="button"
            className="cms-link text-xs mt-4"
            onClick={() => {
              setChanges([...changes, { type: 'new', text: '' }]);
              setDirty(true);
            }}
          >
            <Plus size={15} /> Add another change
          </button>
        </div>

        <button className="cms-primary mt-6" disabled={busy}>
          {busy ? 'Saving…' : 'Publish release note'}
        </button>
      </form>

      {/* 50/50 Live Apps Manager Dialog */}
      {manager && (
        <TaxonomyManager
          kind="apps"
          onClose={() => setManager(false)}
          onChange={() => {
            refreshApps().catch((e) => setError(errorText(e)));
          }}
        />
      )}
    </main>
  );
}
