'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import clsx from 'clsx';

/** Drag-and-drop upload panel for the media library screen. */
export function MediaUploader() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState('');

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
      router.refresh();
    }
    setBusy(false);
  }

  return (
    <div>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          void upload(e.dataTransfer.files);
        }}
        className={clsx(
          'rounded-lg border-2 border-dashed px-6 py-8 text-center transition-colors',
          dragging ? 'border-slate-900 bg-slate-50' : 'border-slate-300 bg-white',
        )}
      >
        <p className="text-sm text-slate-600">Drag files here, or</p>
        <label className="mt-3 inline-flex cursor-pointer rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800">
          {busy ? 'Uploading…' : 'Choose files'}
          <input
            type="file"
            multiple
            disabled={busy}
            className="sr-only"
            onChange={(e) => {
              void upload(e.target.files);
              e.target.value = '';
            }}
          />
        </label>
        <p className="mt-2.5 text-xs text-slate-400">JPG, PNG, WEBP, AVIF, PDF, MP4 or WEBM · up to 50 MB each</p>
      </div>

      {error && (
        <p role="alert" className="mt-3 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}
    </div>
  );
}
