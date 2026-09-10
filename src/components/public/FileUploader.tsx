'use client';

import { useRef, useState } from 'react';
import clsx from 'clsx';
import type { Dictionary } from '@/lib/dictionary';

const ACCEPT = 'image/jpeg,image/png,image/webp,application/pdf';
const MAX_BYTES = 10 * 1024 * 1024;
const MAX_FILES = 8;

function kb(size: number) {
  return size < 1024 * 1024 ? `${Math.round(size / 1024)} KB` : `${(size / 1024 / 1024).toFixed(1)} MB`;
}

export function FileUploader({
  files,
  onChange,
  dict,
}: {
  files: File[];
  onChange: (files: File[]) => void;
  dict: Dictionary;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [rejected, setRejected] = useState<string[]>([]);

  /** Client-side filtering is a convenience only — the server re-validates. */
  function accept(list: FileList | null) {
    if (!list) return;
    const bad: string[] = [];
    const good: File[] = [];

    for (const file of Array.from(list)) {
      if (!ACCEPT.split(',').includes(file.type)) {
        bad.push(`${file.name} — unsupported type`);
      } else if (file.size > MAX_BYTES) {
        bad.push(`${file.name} — over 10 MB`);
      } else {
        good.push(file);
      }
    }

    const merged = [...files, ...good].slice(0, MAX_FILES);
    if (files.length + good.length > MAX_FILES) bad.push(`Only ${MAX_FILES} files can be attached`);

    setRejected(bad);
    onChange(merged);
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
          accept(e.dataTransfer.files);
        }}
        className={clsx(
          'rounded-xl border-2 border-dashed px-6 py-12 text-center transition-colors duration-300',
          dragging ? 'border-brand bg-brand/[0.05]' : 'border-ink-900/15 bg-white',
        )}
      >
        <p className="text-sm text-ink-500">{dict.form.s6Sub}</p>
        <p className="mt-1.5 text-xs text-ink-300">{dict.form.maxFiles}</p>

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="mt-6 inline-flex rounded-full border border-ink-900/20 px-6 py-3 text-sm font-semibold text-ink-900 transition-colors duration-300 hover:border-brand hover:bg-brand hover:text-white"
        >
          {dict.form.addFiles}
        </button>

        <input
          ref={inputRef}
          type="file"
          multiple
          accept={ACCEPT}
          className="sr-only"
          onChange={(e) => {
            accept(e.target.files);
            e.target.value = '';
          }}
        />
      </div>

      {rejected.length > 0 && (
        <ul role="alert" className="mt-4 space-y-1 text-sm text-brand-700">
          {rejected.map((r) => (
            <li key={r}>{r}</li>
          ))}
        </ul>
      )}

      {files.length > 0 && (
        <ul className="mt-5 space-y-2">
          {files.map((f, i) => (
            <li
              key={`${f.name}-${i}`}
              className="flex items-center justify-between gap-4 rounded-lg border border-ink-900/10 bg-white px-4 py-3"
            >
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium text-ink-800">{f.name}</span>
                <span className="text-xs text-ink-300">{kb(f.size)}</span>
              </span>
              <button
                type="button"
                onClick={() => onChange(files.filter((_, j) => j !== i))}
                className="shrink-0 text-xs font-semibold text-ink-400 underline transition-colors hover:text-brand"
              >
                {dict.form.removeFile}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
