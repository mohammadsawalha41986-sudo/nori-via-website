import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';
import { fontVars } from './fonts';

/**
 * This page renders outside the locale layout, so it declares its own icon and
 * metadata rather than inheriting them.
 */
export const metadata: Metadata = {
  title: 'Page not found — Noriva',
  robots: { index: false, follow: true },
  icons: { icon: '/icon.svg', shortcut: '/favicon.ico', apple: '/icon.svg' },
};

/** Root-level 404 for paths outside any locale segment. */
export default function NotFound() {
  return (
    <html lang="en" dir="ltr" className={fontVars}>
      <body className="flex min-h-screen items-center bg-ink-900 text-white">
        <div className="shell py-32">
          <p className="mb-6 font-mono text-xs tracking-[0.3em] text-brand-300">404</p>
          <h1 className="font-display text-display-md uppercase">
            THIS PAGE GOT LOST.
            <br />
            <span className="text-white/45">LET&apos;S GET YOU BACK TO NORIVA.</span>
          </h1>
          <div className="mt-11 flex flex-wrap gap-3">
            <Link href="/en" className="inline-flex rounded-full bg-brand px-7 py-4 font-semibold text-white hover:bg-brand-600">
              Back Home →
            </Link>
            <Link href="/en/work" className="inline-flex rounded-full border border-white/35 px-7 py-4 font-semibold hover:bg-white hover:text-ink-900">
              Explore Our Work →
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
