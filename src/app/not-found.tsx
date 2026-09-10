import type { Metadata } from 'next';
import Link from 'next/link';
import { cookies } from 'next/headers';
import './globals.css';
import { fontVars } from './fonts';
import { getDictionary } from '@/lib/dictionary';
import { LOCALE_COOKIE, dirOf, localePath, resolveLocale } from '@/lib/i18n';

/**
 * This page renders outside the locale layout, so it declares its own icon and
 * metadata rather than inheriting them.
 */
export const metadata: Metadata = {
  title: 'Page not found — Noriva',
  robots: { index: false, follow: true },
  icons: { icon: '/icon.svg', shortcut: '/favicon.ico', apple: '/icon.svg' },
};

/**
 * Root-level 404 for paths outside any locale segment. There is no segment to
 * read the language from, so it follows the same rule as the middleware: the
 * remembered choice, otherwise the default locale.
 */
export default async function NotFound() {
  const locale = resolveLocale((await cookies()).get(LOCALE_COOKIE)?.value);
  const dict = getDictionary(locale);

  return (
    <html lang={locale} dir={dirOf(locale)} className={fontVars}>
      <body className="flex min-h-screen items-center bg-ink-900 text-white">
        <div className="shell py-32">
          <p className="mb-6 font-mono text-xs tracking-[0.3em] text-brand-300">404</p>
          <h1 className="font-display text-display-md uppercase">
            {dict.notFound.title}
            <br />
            <span className="text-white/45">{dict.notFound.subtitle}</span>
          </h1>
          <div className="mt-11 flex flex-wrap gap-3">
            <Link
              href={localePath(locale)}
              className="inline-flex rounded-full bg-brand px-7 py-4 font-semibold text-white hover:bg-brand-600"
            >
              {dict.common.backHome} →
            </Link>
            <Link
              href={localePath(locale, '/work')}
              className="inline-flex rounded-full border border-white/35 px-7 py-4 font-semibold hover:bg-white hover:text-ink-900"
            >
              {dict.common.exploreWork} →
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
