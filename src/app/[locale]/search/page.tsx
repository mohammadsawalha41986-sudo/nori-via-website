import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PageHero } from '@/components/public/PageHero';
import { CTASection } from '@/components/public/CTASection';
import { EmptyState } from '@/components/public/EmptyState';
import { Reveal } from '@/components/ui/Reveal';
import { getDictionary } from '@/lib/dictionary';
import { isLocale, type Locale } from '@/lib/i18n';
import { searchContent, recordSearch } from '@/lib/search';
import { env } from '@/lib/env';

/** Results depend on the query string, so this route is never cached. */
export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: raw } = await params;
  if (!isLocale(raw)) return {};
  const locale = raw as Locale;
  const dict = getDictionary(locale);
  return {
    title: dict.search.title,
    // A search results page has no business being indexed.
    robots: { index: false, follow: true },
    alternates: { canonical: `${env.siteUrl}/${locale}/search` },
  };
}

export default async function SearchPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ q?: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const dict = getDictionary(locale);

  const { q } = await searchParams;
  const query = (q ?? '').trim().slice(0, 120);
  const results = query ? await searchContent(query, locale) : [];

  // Search terms are the cheapest signal for what the Library and Insights are
  // missing. Stored without any visitor identifier.
  if (query) await recordSearch(query, locale, results.length);

  return (
    <>
      <PageHero eyebrow={dict.nav.search} title={dict.search.title} />

      <section className="bg-bone section-y">
        <div className="shell">
          <form action={`/${locale}/search`} method="get" className="flex flex-wrap gap-3">
            <label className="min-w-[16rem] flex-1">
              <span className="sr-only">{dict.search.placeholder}</span>
              <input
                type="search"
                name="q"
                defaultValue={query}
                autoFocus
                placeholder={dict.search.placeholder}
                className="w-full rounded-input border border-ink-900/15 bg-white px-5 py-4 text-[0.9375rem] text-ink-900 outline-none transition-colors placeholder:text-ink-300 focus:border-brand"
              />
            </label>
            <button
              type="submit"
              className="rounded-btn bg-ink-900 px-7 py-4 text-[0.9375rem] font-semibold text-white transition-colors hover:bg-brand"
            >
              {dict.search.submit}
            </button>
          </form>

          {query && (
            <p className="mt-8 text-sm text-ink-400" role="status" aria-live="polite">
              {results.length} {dict.search.count} · {dict.search.resultsFor} “{query}”
            </p>
          )}

          {query && results.length === 0 && (
            <div className="mt-10">
              <EmptyState
                title={dict.search.noResults}
                body={dict.search.hint}
                ctaHref={`/${locale}/library`}
                ctaLabel={dict.nav.library}
              />
            </div>
          )}

          {results.length > 0 && (
            <ul className="mt-10 border-t border-ink-900/10">
              {results.map((item, i) => (
                <Reveal as="li" key={`${item.type}-${item.id}`} delay={Math.min(i, 8) * 40} y={12} className="border-b border-ink-900/10">
                  <Link href={item.href} className="group block py-7">
                    <span className="text-[0.6875rem] font-bold uppercase tracking-[0.2em] text-brand">
                      {item.badge}
                    </span>
                    <span className="mt-2 block font-display text-xl font-display-soft uppercase text-ink-900 transition-colors group-hover:text-brand sm:text-2xl">
                      {item.title}
                    </span>
                    {item.summary && (
                      <span className="mt-2.5 block max-w-3xl text-[0.9375rem] leading-relaxed text-ink-400 line-clamp-2">
                        {item.summary}
                      </span>
                    )}
                  </Link>
                </Reveal>
              ))}
            </ul>
          )}
        </div>
      </section>

      <CTASection headline={dict.nav.start} label={dict.nav.start} href={`/${locale}/start-a-project`} />
    </>
  );
}
