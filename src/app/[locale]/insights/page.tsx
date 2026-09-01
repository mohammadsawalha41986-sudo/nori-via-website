import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PageHero } from '@/components/public/PageHero';
import { CTASection } from '@/components/public/CTASection';
import { EmptyState } from '@/components/public/EmptyState';
import { Reveal } from '@/components/ui/Reveal';
import { getDictionary } from '@/lib/dictionary';
import { isLocale, pick, formatDate, type Locale } from '@/lib/i18n';
import { getPublishedInsights, getPage } from '@/lib/content';
import { buildMetadata, JsonLd, breadcrumbs } from '@/lib/seo';

export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: raw } = await params;
  if (!isLocale(raw)) return {};
  const locale = raw as Locale;
  const page = await getPage('insights');
  return buildMetadata({
    row: page,
    locale,
    path: '/insights',
    fallbackTitle: getDictionary(locale).nav.insights,
    fallbackDescription: page ? pick(page, 'body', locale) : '',
  });
}

export default async function InsightsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const dict = getDictionary(locale);

  const [insights, page] = await Promise.all([getPublishedInsights(), getPage('insights')]);

  return (
    <>
      <JsonLd
        data={breadcrumbs(locale, [
          { name: 'Noriva', path: '/' },
          { name: dict.nav.insights, path: '/insights' },
        ])}
      />

      <PageHero
        eyebrow={dict.nav.insights}
        title={page ? pick(page, 'title', locale) : dict.nav.insights}
        description={page ? pick(page, 'body', locale) : undefined}
      />

      <section className="bg-bone py-24 sm:py-32">
        <div className="shell">
          {insights.length ? (
            <ul className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
              {insights.map((a, i) => (
                <Reveal as="li" key={a.id} delay={Math.min(i, 6) * 60}>
                  <Link href={`/${locale}/insights/${a.slug}`} className="group block">
                    <div className="relative aspect-[3/2] overflow-hidden rounded-xl bg-ink-100">
                      {a.coverImage ? (
                        <Image
                          src={a.coverImage}
                          alt={pick(a, 'title', locale)}
                          fill
                          sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
                          className="object-cover transition-transform duration-700 ease-noriva group-hover:scale-105"
                        />
                      ) : (
                        <div
                          className="h-full w-full"
                          style={{ background: `linear-gradient(${120 + i * 45}deg,#16213C,#0B1225 60%,rgba(245,16,110,0.45))` }}
                        />
                      )}
                    </div>

                    <div className="mt-5">
                      {a.category && (
                        <span className="text-[0.6875rem] font-bold uppercase tracking-[0.2em] text-brand">
                          {pick(a.category, 'name', locale)}
                        </span>
                      )}
                      <h2 className="mt-2 font-display text-xl font-bold uppercase tracking-tight text-ink-900 transition-colors group-hover:text-brand">
                        {pick(a, 'title', locale)}
                      </h2>
                      {pick(a, 'excerpt', locale) && (
                        <p className="mt-2.5 line-clamp-3 text-[0.9375rem] leading-relaxed text-ink-400">
                          {pick(a, 'excerpt', locale)}
                        </p>
                      )}
                      <p className="mt-4 text-xs text-ink-300">
                        {[a.author, formatDate(a.publishedAt, locale)].filter(Boolean).join(' · ')}
                      </p>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </ul>
          ) : (
            <EmptyState title={dict.common.empty} body={dict.common.emptyInsights} />
          )}
        </div>
      </section>

      <CTASection headline={dict.nav.start} label={dict.nav.start} href={`/${locale}/start-a-project`} />
    </>
  );
}
