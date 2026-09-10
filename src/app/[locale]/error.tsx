'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { getDictionary } from '@/lib/dictionary';
import { localeFromPath } from '@/lib/i18n';

export default function LocaleError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const dict = getDictionary(localeFromPath(usePathname()));

  useEffect(() => {
    // The digest is safe to log; the message itself is never shown to visitors.
    console.error('[noriva] render error', error.digest);
  }, [error]);

  return (
    <section className="flex min-h-[80svh] items-center bg-ink-900 py-32 text-white">
      <div className="shell">
        <h1 className="font-display text-display-sm uppercase">{dict.error.title}</h1>
        <p className="mt-5 max-w-lg text-lg text-white/50">{dict.error.body}</p>
        <button
          type="button"
          onClick={reset}
          className="mt-10 inline-flex rounded-full bg-brand px-7 py-4 text-sm font-semibold text-white transition-colors hover:bg-brand-600"
        >
          {dict.error.retry}
        </button>
      </div>
    </section>
  );
}
