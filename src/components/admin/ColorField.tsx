'use client';

import { useId, useState } from 'react';
import { Field, inputClass } from './ui';

/**
 * A colour token control.
 *
 * The swatch and the hex box are two views of one value, and only one named
 * input is submitted. They were previously two separate inputs sharing a
 * `name`: the form kept the last duplicate, so a colour picked with the swatch
 * was silently replaced by the untouched hex box on save.
 */
const HEX = /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;

/** Accepts `f0f`, `#F0F` or `ff00ff` and returns the canonical `#RRGGBB`. */
function normalise(value: string): string | null {
  const raw = value.trim().replace(/^#/, '');
  if (!/^(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(raw)) return null;
  const full = raw.length === 3 ? raw.split('').map((c) => c + c).join('') : raw;
  return `#${full.toUpperCase()}`;
}

export function ColorField({
  name,
  label,
  defaultValue,
  fallback,
}: {
  name: string;
  label: string;
  defaultValue: string;
  /** The shipped value, shown as the hint and used when the box is cleared. */
  fallback: string;
}) {
  const id = useId();
  const [value, setValue] = useState(normalise(defaultValue) ?? fallback);
  const [text, setText] = useState(normalise(defaultValue) ?? fallback);

  const valid = HEX.test(value);

  return (
    <Field label={label} htmlFor={id} hint={valid ? `Default ${fallback}` : 'Enter a hex colour such as #F5106E'}>
      <div className="flex gap-2">
        <input
          type="color"
          value={valid ? value : fallback}
          aria-label={`${label} colour picker`}
          onChange={(e) => {
            const next = normalise(e.target.value) ?? fallback;
            setValue(next);
            setText(next);
          }}
          className="h-[38px] w-12 shrink-0 cursor-pointer rounded-md border border-slate-300 bg-white p-1"
        />
        {/* The only submitted input, so the value can never be shadowed. */}
        <input
          id={id}
          name={name}
          value={text}
          dir="ltr"
          spellCheck={false}
          aria-invalid={valid ? undefined : true}
          onChange={(e) => {
            setText(e.target.value);
            const next = normalise(e.target.value);
            if (next) setValue(next);
          }}
          onBlur={() => {
            const next = normalise(text);
            setText(next ?? fallback);
            setValue(next ?? fallback);
          }}
          className={valid ? inputClass : `${inputClass} border-red-400 focus:border-red-500`}
        />
      </div>
    </Field>
  );
}
