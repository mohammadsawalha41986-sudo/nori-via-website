'use client';

import { useState } from 'react';

/**
 * Read-only URL field with copy-to-clipboard.
 *
 * This lives in its own client component because the Media Library page is a
 * Server Component, and a Server Component cannot pass event handlers to DOM
 * elements — doing so throws at render time.
 */
export function CopyField({ value, label }: { value: string; label: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      // Clipboard access can be blocked; selecting the text is enough.
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  }

  return (
    <div className="flex gap-1">
      <input
        readOnly
        value={value}
        aria-label={label}
        dir="ltr"
        onFocus={(e) => e.currentTarget.select()}
        className="min-w-0 flex-1 rounded border border-slate-200 bg-slate-50 px-2 py-1 text-[0.6875rem] text-slate-500"
      />
      <button
        type="button"
        onClick={copy}
        className="shrink-0 rounded border border-slate-200 px-2 py-1 text-[0.6875rem] font-medium text-slate-600 transition-colors hover:bg-slate-50"
      >
        {copied ? 'Copied' : 'Copy'}
      </button>
    </div>
  );
}
