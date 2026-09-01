'use client';

import { useCallback, useEffect, useState } from 'react';
import clsx from 'clsx';

export type MediaItem = {
  id: string;
  filename: string;
  url: string;
  kind: 'IMAGE' | 'VIDEO' | 'DOCUMENT';
  mimeType: string;
  size: number;
  width: number | null;
  height: number | null;
};

/** Modal media browser with inline upload. Shared by every media field. */
export function MediaPicker({
  open,
  onClose,
  onSelect,
  kind,
}: {
  open: boolean;
  onClose: () => void;
  onSelect: (item: MediaItem) => void;
  kind?: MediaItem['kind'];
}) {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [query, setQuery] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (kind) params.set('kind', kind);
    const res = await fetch(`/api/admin/media?${params}`);
    if (!res.ok) return;
    const json = (await res.json()) as { media: MediaItem[] };
    setItems(json.media);
  }, [query, kind]);

  useEffect(() => {
    if (open) void load();
  }, [open, load]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  async function upload(files: FileList | null) {
    if (!files?.length) return;
    setBusy(true);
    setError('');
    const body = new FormData();
    Array.from(files).forEach((f) => body.append('files', f));

    const res = await fetch('/api/admin/media', { method: 'POST', body });
    if (!res.ok) {
      const json = (await res.json().catch(() => ({}))) as { error?: string };
      setError(json.error || 'Upload failed.');
    } else {
      await load();
    }
    setBusy(false);
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
      <div role="dialog" aria-modal="true" aria-label="Media library" className="flex max-h-[85vh] w-full max-w-4xl flex-col rounded-lg bg-white shadow-xl">
        <header className="flex shrink-0 items-center gap-3 border-b border-slate-200 p-4">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search files…"
            className="flex-1 rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900"
          />
          <label className="cursor-pointer rounded-md bg-slate-900 px-3.5 py-2 text-sm font-medium text-white hover:bg-slate-800">
            {busy ? 'Uploading…' : 'Upload'}
            <input
              type="file"
              multiple
              className="sr-only"
              disabled={busy}
              onChange={(e) => {
                void upload(e.target.files);
                e.target.value = '';
              }}
            />
          </label>
          <button type="button" onClick={onClose} aria-label="Close" className="rounded-md border border-slate-300 px-3 py-2 text-sm">
            ✕
          </button>
        </header>

        {error && <p className="shrink-0 bg-red-50 px-4 py-2 text-sm text-red-700">{error}</p>}

        <div className="min-h-0 flex-1 overflow-y-auto p-4">
          {items.length === 0 ? (
            <p className="py-16 text-center text-sm text-slate-400">
              No files yet. Upload images, PDFs or video to get started.
            </p>
          ) : (
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-5">
              {items.map((m) => (
                <li key={m.id}>
                  <button
                    type="button"
                    onClick={() => {
                      onSelect(m);
                      onClose();
                    }}
                    className="group w-full overflow-hidden rounded-md border border-slate-200 text-left transition-colors hover:border-slate-900"
                  >
                    <span
                      className={clsx(
                        'flex aspect-square items-center justify-center bg-slate-100',
                        m.kind !== 'IMAGE' && 'text-xs font-medium text-slate-500',
                      )}
                    >
                      {m.kind === 'IMAGE' ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={m.url} alt="" className="h-full w-full object-cover" loading="lazy" />
                      ) : (
                        m.kind
                      )}
                    </span>
                    <span className="block truncate px-2 py-1.5 text-xs text-slate-600">{m.filename}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
