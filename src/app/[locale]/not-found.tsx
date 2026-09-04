import Link from 'next/link';

/**
 * Locale-segment 404. It cannot read the route params, so it stays bilingual
 * and links to the default locale.
 */
export default function LocaleNotFound() {
  return (
    <section className="flex min-h-[80svh] items-center bg-ink-900 py-32 text-white">
      <div className="shell">
        <p className="mb-6 font-mono text-xs tracking-[0.3em] text-brand-300">404</p>
        <h1 className="font-display text-display-md uppercase">
          THIS PAGE GOT LOST.
          <br />
          <span className="text-white/45">LET&apos;S GET YOU BACK TO NORIVA.</span>
        </h1>
        <p className="mt-6 text-lg text-white/45">هذه الصفحة ضاعت. لنعُد بك إلى نوريفا.</p>

        <div className="mt-11 flex flex-wrap gap-3">
          <Link
            href="/en"
            className="inline-flex items-center gap-2 rounded-full bg-brand px-7 py-4 text-[0.9375rem] font-semibold text-white transition-colors hover:bg-brand-600"
          >
            Back Home →
          </Link>
          <Link
            href="/en/work"
            className="inline-flex items-center gap-2 rounded-full border border-white/35 px-7 py-4 text-[0.9375rem] font-semibold text-white transition-colors hover:bg-white hover:text-ink-900"
          >
            Explore Our Work →
          </Link>
        </div>
      </div>
    </section>
  );
}
