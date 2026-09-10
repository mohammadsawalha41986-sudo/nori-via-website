'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { getDictionary } from '@/lib/dictionary';
import { localeFromPath, localePath } from '@/lib/i18n';

/**
 * Locale-segment 404.
 *
 * Next does not hand route params to a `not-found` boundary, so the language
 * comes from the URL the visitor is actually on.
 */
export default function LocaleNotFound() {
  const locale = localeFromPath(usePathname());
  const dict = getDictionary(locale);

  return (
    <section className="flex min-h-[80svh] items-center bg-ink-900 py-32 text-white">
      <div className="shell">
        <p className="mb-6 font-mono text-xs tracking-[0.3em] text-brand-300">404</p>
        <h1 className="font-display text-display-md uppercase">
          {dict.notFound.title}
          <br />
          <span className="text-white/45">{dict.notFound.subtitle}</span>
        </h1>

        <div className="mt-11 flex flex-wrap gap-3">
          <Link
            href={localePath(locale)}
            className="inline-flex items-center gap-2 rounded-full bg-brand px-7 py-4 text-sm font-semibold text-white transition-colors hover:bg-brand-600"
          >
            {dict.common.backHome} →
          </Link>
          <Link
            href={localePath(locale, '/work')}
            className="inline-flex items-center gap-2 rounded-full border border-white/35 px-7 py-4 text-sm font-semibold text-white transition-colors hover:bg-white hover:text-ink-900"
          >
            {dict.common.exploreWork} →
          </Link>
        </div>
      </div>
    </section>
  );
}
