'use client';

import { useState } from 'react';
import { MediaPicker, type MediaItem } from './MediaPicker';
import { Field, inputClass } from './ui';

/** A URL input backed by the media library, with a live thumbnail preview. */
export function MediaField({
  name,
  label,
  defaultValue = '',
  hint,
  kind,
}: {
  name: string;
  label: string;
  defaultValue?: string;
  hint?: string;
  kind?: MediaItem['kind'];
}) {
  const [value, setValue] = useState(defaultValue);
  const [open, setOpen] = useState(false);

  const isImage = /\.(jpe?g|png|webp|avif|gif|svg)$/i.test(value) || value.startsWith('/media/');

  return (
    <Field label={label} htmlFor={name} hint={hint}>
      <div className="flex gap-2">
        <input
          id={name}
          name={name}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          dir="ltr"
          placeholder="/media/… or https://…"
          className={inputClass}
        />
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="shrink-0 rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Browse
        </button>
        {value && (
          <button
            type="button"
            onClick={() => setValue('')}
            aria-label={`Clear ${label}`}
            className="shrink-0 rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-500 hover:bg-slate-50"
          >
            ✕
          </button>
        )}
      </div>

      {value && isImage && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={value} alt="" className="mt-2 h-24 w-auto rounded border border-slate-200 object-cover" />
      )}

      <MediaPicker open={open} kind={kind} onClose={() => setOpen(false)} onSelect={(m) => setValue(m.url)} />
    </Field>
  );
}
