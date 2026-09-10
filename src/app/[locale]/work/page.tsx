import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PageHero } from '@/components/public/PageHero';
import { sectionHero } from '@/lib/section-images';
import { WorkGrid } from '@/components/public/WorkGrid';
import { CTASection } from '@/components/public/CTASection';
import { getDictionary } from '@/lib/dictionary';
import { isLocale, pick, type Locale } from '@/lib/i18n';
import { getPublishedProjects, getWorkCategories, getPage } from '@/lib/content';
import { buildMetadata, JsonLd, breadcrumbs } from '@/lib/seo';
import { summarise } from '@/lib/seo-text';
import { brandName } from '@/lib/brand';

export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: raw } = await params;
  if (!isLocale(raw)) return {};
  const locale = raw as Locale;
  const page = await getPage('work');
  return buildMetadata({
    row: page,
    locale,
    path: '/work',
    fallbackTitle: getDictionary(locale).nav.work,
    fallbackDescription: page ? summarise(pick(page, 'body', locale)) : '',
  });
}

export default async function WorkPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const dict = getDictionary(locale);

  const [projects, categories, page] = await Promise.all([
    getPublishedProjects(),
    getWorkCategories(),
    getPage('work'),
  ]);

  return (
    <>
      <JsonLd
        data={breadcrumbs(locale, [
          { name: brandName(locale), path: '/' },
          { name: dict.nav.work, path: '/work' },
        ])}
      />

      <PageHero
        eyebrow={dict.nav.work}
        title={page ? pick(page, 'title', locale) : dict.common.relatedWork}
        description={page ? pick(page, 'body', locale) : undefined}
        image={sectionHero('work')}
      />

      <section className="bg-bone py-24 sm:py-32">
        <div className="shell">
          <WorkGrid
            locale={locale}
            filters={categories.map((c) => ({ slug: c.slug, label: pick(c, 'name', locale) }))}
            labels={{
              all: dict.common.all,
              view: dict.common.viewCaseStudy,
              emptyTitle: dict.common.empty,
              emptyBody: dict.common.emptyWork,
              start: dict.nav.start,
            }}
            projects={projects.map((p) => ({
              id: p.id,
              slug: p.slug,
              title: pick(p, 'title', locale),
              client: p.client,
              category: p.category ? pick(p.category, 'name', locale) : '',
              categorySlug: p.category?.slug ?? null,
              services: p.services.map((s) => pick(s.service, 'name', locale)),
              year: p.year,
              heroMediaUrl: p.heroMediaUrl,
              caseStudySlug: p.caseStudy?.status === 'PUBLISHED' ? p.caseStudy.slug : null,
            }))}
          />
        </div>
      </section>

      <CTASection
        headline={dict.nav.start}
        label={dict.nav.start}
        href={`/${locale}/start-a-project`}
        secondaryLabel={dict.common.allServices}
        secondaryHref={`/${locale}/services`}
      />
    </>
  );
}
