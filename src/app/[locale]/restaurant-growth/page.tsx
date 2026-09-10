import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { PageHero } from '@/components/public/PageHero';
import { sectionHero } from '@/lib/section-images';
import { PathCards, toPathCards } from '@/components/public/PathCards';
import { RelatedContent } from '@/components/public/RelatedContent';
import { CTASection } from '@/components/public/CTASection';
import { Reveal } from '@/components/ui/Reveal';
import { Prose } from '@/components/ui/Prose';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { getDictionary } from '@/lib/dictionary';
import { isLocale, pick, type Locale } from '@/lib/i18n';
import { getPage, getPublishedServices } from '@/lib/content';
import { getRelatedContent } from '@/lib/relations';
import { buildMetadata, JsonLd, breadcrumbs } from '@/lib/seo';
import { summarise } from '@/lib/seo-text';
import { brandName } from '@/lib/brand';

export const revalidate = 60;

type Pillar = { titleEn?: string; titleAr?: string; bodyEn?: string; bodyAr?: string };

const GROWTH_CATEGORIES = ['restaurant-menu', 'growth-profitability'];

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: raw } = await params;
  if (!isLocale(raw)) return {};
  const locale = raw as Locale;
  const page = await getPage('restaurant-growth');
  return buildMetadata({
    row: page,
    locale,
    path: '/restaurant-growth',
    fallbackTitle: getDictionary(locale).nav.growth,
    fallbackDescription: page ? summarise(pick(page, 'body', locale)) : '',
  });
}

export default async function RestaurantGrowthPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const dict = getDictionary(locale);

  const [page, services] = await Promise.all([getPage('restaurant-growth'), getPublishedServices()]);
  const content = (page?.content ?? {}) as { pillars?: Pillar[]; paths?: unknown };
  const pillars = (content.pillars ?? []).filter((p) => pick(p, 'title', locale));
  const paths = toPathCards(content.paths, locale, dict.common.readMore);

  const related = services.filter((s) => s.category && GROWTH_CATEGORIES.includes(s.category.slug));

  // Tools, resources, articles and work attached to this page in Admin.
  const relatedContent = page ? await getRelatedContent('PAGE', page.id, locale) : [];

  return (
    <>
      <JsonLd
        data={breadcrumbs(locale, [
          { name: brandName(locale), path: '/' },
          { name: dict.nav.growth, path: '/restaurant-growth' },
        ])}
      />

      <PageHero
        eyebrow={dict.nav.growth}
        title={page ? pick(page, 'title', locale) : dict.nav.growth}
        description={page ? pick(page, 'body', locale) : undefined}
        image={sectionHero('restaurant-growth')}
      />

      {pillars.length > 0 && (
        <section className="bg-bone py-24 sm:py-32">
          <div className="shell">
            <SectionHeading eyebrow={dict.nav.growth} title={dict.service.approach} />
            <ul className="mt-14 grid gap-px overflow-hidden rounded-2xl bg-ink-900/10 sm:grid-cols-2 lg:grid-cols-4">
              {pillars.map((p, i) => (
                <Reveal as="li" key={i} delay={i * 55} y={16} className="bg-bone px-7 py-9">
                  <span className="font-mono text-xs text-brand">{String(i + 1).padStart(2, '0')}</span>
                  <h3 className="mt-3 font-display text-lg uppercase text-ink-900">
                    {pick(p, 'title', locale)}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-ink-400">{pick(p, 'body', locale)}</p>
                </Reveal>
              ))}
            </ul>
          </div>
        </section>
      )}

      {paths.length > 0 && (
        <section className="bg-white section-y">
          <div className="shell">
            <SectionHeading eyebrow={dict.startHere.eyebrow} title={dict.startHere.title} />
            <div className="mt-12">
              <PathCards items={paths} />
            </div>
          </div>
        </section>
      )}

      {page && pick(page, 'body', locale) && (
        <section className="bg-white py-20 sm:py-28">
          <div className="shell max-w-3xl">
            <Prose text={pick(page, 'body', locale)} className="text-lg" />
          </div>
        </section>
      )}

      {related.length > 0 && (
        <section className="bg-bone py-24 sm:py-32">
          <div className="shell">
            <SectionHeading eyebrow={dict.nav.services} title={dict.nav.services} />
            <ul className="mt-12 border-t border-ink-900/10">
              {related.map((s, i) => (
                <Reveal as="li" key={s.id} delay={i * 45} y={14} className="border-b border-ink-900/10">
                  <Link href={`/${locale}/services/${s.slug}`} className="group flex items-start gap-6 py-6 sm:gap-10">
                    <span className="mt-2 shrink-0 font-mono text-xs text-ink-300">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="flex-1">
                      <span className="block font-display text-xl font-display-soft uppercase text-ink-900 transition-colors group-hover:text-brand sm:text-2xl">
                        {pick(s, 'name', locale)}
                      </span>
                      <span className="mt-2 block max-w-2xl text-sm leading-relaxed text-ink-400">
                        {pick(s, 'summary', locale)}
                      </span>
                    </span>
                    <span aria-hidden className="mt-2 text-ink-300 transition-transform group-hover:translate-x-1 rtl:rotate-180">
                      →
                    </span>
                  </Link>
                </Reveal>
              ))}
            </ul>
          </div>
        </section>
      )}

      <RelatedContent items={relatedContent} title={dict.related.title} eyebrow={dict.nav.growth} tone="white" />

      <CTASection
        headline={dict.nav.start}
        label={dict.nav.start}
        href={`/${locale}/start-a-project`}
        secondaryLabel={dict.nav.contact}
        secondaryHref={`/${locale}/contact`}
      />
    </>
  );
}
