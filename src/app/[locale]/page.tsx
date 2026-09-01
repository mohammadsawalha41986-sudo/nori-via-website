import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Hero } from '@/components/public/Hero';
import { BrandStatement } from '@/components/public/BrandStatement';
import { SystemStages, type Stage } from '@/components/public/SystemStages';
import { ProjectCard } from '@/components/public/ProjectCard';
import { EmptyState } from '@/components/public/EmptyState';
import { CTASection } from '@/components/public/CTASection';
import { Metrics } from '@/components/public/Metrics';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal } from '@/components/ui/Reveal';
import { TextLink } from '@/components/ui/Button';
import { getDictionary } from '@/lib/dictionary';
import { isLocale, pick, type Locale } from '@/lib/i18n';
import {
  getHomepage,
  getSystemStages,
  getFeaturedProjects,
  getStatistics,
  getPublishedServices,
  asStringList,
  asObjectList,
} from '@/lib/content';
import { prisma } from '@/lib/db';

export const revalidate = 60;

type LocalisedItem = { labelEn?: string; labelAr?: string };

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const dict = getDictionary(locale);

  const [home, stageRows, projects, stats, services] = await Promise.all([
    getHomepage(),
    getSystemStages(),
    getFeaturedProjects(4),
    getStatistics(),
    getPublishedServices(),
  ]);

  const featuredCase = home.featuredCaseStudyId
    ? await prisma.caseStudy.findFirst({
        where: { id: home.featuredCaseStudyId, status: 'PUBLISHED' },
        include: { project: true },
      })
    : null;

  const stages: Stage[] = stageRows.map((s) => ({
    id: s.id,
    step: s.step,
    title: pick(s, 'title', locale),
    description: pick(s, 'description', locale),
    services: asStringList(s.services),
    mediaUrl: s.mediaUrl,
  }));

  const intelligenceItems = asObjectList<LocalisedItem>(home.intelligenceItems)
    .map((i) => (locale === 'ar' ? i.labelAr || i.labelEn : i.labelEn || i.labelAr) || '')
    .filter(Boolean);

  return (
    <>
      <Hero
        locale={locale}
        eyebrow={pick(home, 'heroEyebrow', locale)}
        headline={pick(home, 'heroHeadline', locale) || 'WE MAKE RESTAURANTS\nIMPOSSIBLE TO IGNORE.'}
        subtitle={pick(home, 'heroSubtitle', locale)}
        primaryCta={pick(home, 'heroPrimaryCta', locale) || dict.nav.start}
        secondaryCta={pick(home, 'heroSecondaryCta', locale) || dict.common.exploreWork}
        mediaUrl={home.heroMediaUrl}
        mediaKind={home.heroMediaKind}
      />

      <BrandStatement
        statement={pick(home, 'statement', locale)}
        support={pick(home, 'statementSupport', locale)}
      />

      <SystemStages headline={pick(home, 'systemHeadline', locale)} stages={stages} />

      {/* Selected work */}
      <section className="bg-bone py-24 sm:py-32">
        <div className="shell">
          <div className="mb-14 flex flex-wrap items-end justify-between gap-6">
            <SectionHeading eyebrow={dict.nav.work} title={dict.common.relatedWork} className="mb-0" />
            <TextLink href={`/${locale}/work`}>{dict.common.allWork}</TextLink>
          </div>

          {projects.length ? (
            <div className="grid gap-x-6 gap-y-14 lg:grid-cols-12 lg:gap-y-20">
              {projects.map((p, i) => (
                <ProjectCard
                  key={p.id}
                  locale={locale}
                  index={i}
                  viewLabel={dict.common.viewCaseStudy}
                  project={{
                    id: p.id,
                    slug: p.slug,
                    title: pick(p, 'title', locale),
                    client: p.client,
                    category: p.category ? pick(p.category, 'name', locale) : '',
                    services: p.services.map((s) => pick(s.service, 'name', locale)),
                    year: p.year,
                    heroMediaUrl: p.heroMediaUrl,
                    caseStudySlug: p.caseStudy?.status === 'PUBLISHED' ? p.caseStudy.slug : null,
                  }}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              title={dict.common.empty}
              body={dict.common.emptyWork}
              ctaHref={`/${locale}/services`}
              ctaLabel={dict.common.allServices}
            />
          )}
        </div>
      </section>

      {/* Restaurant intelligence */}
      {(pick(home, 'intelligenceHeadline', locale) || intelligenceItems.length > 0) && (
        <section className="relative overflow-hidden bg-ink-900 py-24 text-white sm:py-32">
          <div aria-hidden className="grain absolute inset-0" />
          <div className="shell relative grid gap-14 lg:grid-cols-2 lg:gap-20">
            <div>
              <SectionHeading
                eyebrow={dict.nav.growth}
                tone="light"
                title={pick(home, 'intelligenceHeadline', locale)}
                description={pick(home, 'intelligenceBody', locale)}
              />
              <Reveal delay={200} className="mt-10">
                <TextLink href={`/${locale}/restaurant-growth`} className="text-white hover:text-brand-300">
                  {dict.nav.growth}
                </TextLink>
              </Reveal>
            </div>

            {intelligenceItems.length > 0 && (
              <ul className="grid grid-cols-2 gap-px self-start overflow-hidden rounded-xl bg-white/12">
                {intelligenceItems.map((label, i) => (
                  <Reveal
                    as="li"
                    key={label}
                    delay={i * 55}
                    y={14}
                    className="bg-ink-900 px-6 py-8 transition-colors duration-300 hover:bg-ink-800"
                  >
                    <span className="block font-mono text-[0.6875rem] text-brand-300">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="mt-2.5 block font-display text-base font-bold uppercase tracking-tight sm:text-lg">
                      {label}
                    </span>
                  </Reveal>
                ))}
              </ul>
            )}
          </div>
        </section>
      )}

      {/* Statistics — only rendered when real values exist */}
      {stats.length > 0 && (
        <section className="bg-bone py-20 sm:py-28">
          <div className="shell">
            <Metrics
              items={stats.map((s) => ({
                value: s.value,
                label: pick(s, 'label', locale),
                description: pick(s, 'description', locale),
              }))}
            />
          </div>
        </section>
      )}

      {/* Featured case study */}
      {featuredCase && (
        <section className="bg-white py-24 sm:py-32">
          <div className="shell">
            <SectionHeading eyebrow={dict.common.viewCaseStudy} title={pick(featuredCase, 'title', locale)} />
            {pick(featuredCase, 'outcome', locale) && (
              <Reveal delay={140}>
                <p className="mt-8 max-w-2xl text-lg leading-relaxed text-ink-500">
                  {pick(featuredCase, 'outcome', locale)}
                </p>
              </Reveal>
            )}
            <Reveal delay={220} className="mt-10">
              <TextLink href={`/${locale}/work/${featuredCase.project?.slug ?? featuredCase.slug}`}>
                {dict.common.viewCaseStudy}
              </TextLink>
            </Reveal>
          </div>
        </section>
      )}

      {/* Services index preview */}
      {services.length > 0 && (
        <section className="bg-bone py-24 sm:py-32">
          <div className="shell">
            <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
              <SectionHeading eyebrow={dict.nav.services} title={dict.nav.services} className="mb-0" />
              <TextLink href={`/${locale}/services`}>{dict.common.allServices}</TextLink>
            </div>

            <ul className="flex flex-wrap gap-2">
              {services.map((s, i) => (
                <Reveal as="li" key={s.id} delay={Math.min(i, 12) * 30} y={12}>
                  <Link
                    href={`/${locale}/services/${s.slug}`}
                    className="inline-flex rounded-full border border-ink-900/15 px-5 py-3 text-sm font-medium text-ink-600 transition-all duration-300 ease-noriva hover:border-brand hover:bg-brand hover:text-white"
                  >
                    {pick(s, 'name', locale)}
                  </Link>
                </Reveal>
              ))}
            </ul>
          </div>
        </section>
      )}

      <CTASection
        headline={pick(home, 'ctaHeadline', locale) || dict.nav.start}
        description={pick(home, 'ctaDescription', locale)}
        label={pick(home, 'ctaLabel', locale) || dict.nav.start}
        href={`/${locale}/start-a-project`}
        secondaryLabel={dict.nav.contact}
        secondaryHref={`/${locale}/contact`}
      />
    </>
  );
}
