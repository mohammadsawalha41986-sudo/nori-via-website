import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Hero } from '@/components/public/Hero';
import { BrandStatement } from '@/components/public/BrandStatement';
import { SystemStages, type Stage } from '@/components/public/SystemStages';
import { ProjectCard } from '@/components/public/ProjectCard';
import { ResourceCard } from '@/components/public/ResourceCard';
import { EmptyState } from '@/components/public/EmptyState';
import { CTASection } from '@/components/public/CTASection';
import { QuestionList } from '@/components/public/QuestionList';
import { FaqSection } from '@/components/public/FaqAccordion';
import { ServiceShowcase } from '@/components/public/ServiceShowcase';
import { FeatureBanner } from '@/components/public/FeatureBanner';
import { Metrics } from '@/components/public/Metrics';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal } from '@/components/ui/Reveal';
import { TextLink } from '@/components/ui/Button';
import { getDictionary } from '@/lib/dictionary';
import { isLocale, pick, type Locale } from '@/lib/i18n';
import {
  getHomepage,
  getHomepageFaqs,
  getSystemStages,
  getFeaturedProjects,
  getStatistics,
  getPublishedServices,
  getFeaturedTools,
  getFeaturedResources,
  getPublishedInsights,
  asStringList,
  asObjectList,
} from '@/lib/content';
import { prisma } from '@/lib/db';
import { getSettings } from '@/lib/content';
import { JsonLd } from '@/lib/seo';
import { env } from '@/lib/env';

export const revalidate = 60;

type LocalisedItem = { labelEn?: string; labelAr?: string };

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const dict = getDictionary(locale);

  const [
    home,
    settings,
    stageRows,
    projects,
    stats,
    services,
    tools,
    resources,
    insights,
    numberedQuestions,
    faqQuestions,
  ] = await Promise.all([
    getHomepage(),
    getSettings(),
    getSystemStages(),
    getFeaturedProjects(4),
    getStatistics(),
    getPublishedServices(),
    getFeaturedTools(3),
    getFeaturedResources(3),
    getPublishedInsights(),
    getHomepageFaqs('NUMBERED'),
    getHomepageFaqs('ACCORDION'),
  ]);

  const featuredInsights = insights.slice(0, 3);

  const featuredCase = home.featuredCaseStudyId
    ? await prisma.caseStudy.findFirst({
        where: { id: home.featuredCaseStudyId, status: 'PUBLISHED' },
        include: { project: true },
      })
    : null;

  /** A question is only worth a row once it actually asks something. */
  const toQuestions = (rows: typeof numberedQuestions) =>
    rows
      .map((row) => ({
        id: row.id,
        question: pick(row, 'question', locale),
        answer: pick(row, 'answer', locale),
      }))
      .filter((row) => row.question);

  const questions = toQuestions(numberedQuestions);
  const faqs = toQuestions(faqQuestions);

  // The promoted services card, if the chosen service is still published.
  const featuredService = home.featuredServiceId
    ? services.find((service) => service.id === home.featuredServiceId) ?? null
    : null;

  const toShowcase = (service: (typeof services)[number]) => ({
    id: service.id,
    slug: service.slug,
    name: pick(service, 'name', locale),
    summary: pick(service, 'summary', locale),
    image: service.featuredImage,
  });

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

  const socials = [settings.instagram, settings.tiktok, settings.linkedin, settings.x, settings.youtube].filter(Boolean);

  return (
    <>
      {/* Organization identity, including the logo uploaded in Admin. */}
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: pick(settings, 'companyName', locale) || 'Noriva',
          url: env.siteUrl,
          description: pick(settings, 'description', locale) || undefined,
          logo: settings.logoUrl ? `${env.siteUrl}${settings.logoUrl}` : undefined,
          email: settings.contactEmail || settings.inquiryEmail || undefined,
          telephone: settings.phone || undefined,
          sameAs: socials.length ? socials : undefined,
        }}
      />

      {/* Homepage FAQs are eligible for rich results, so they are described too. */}
      {faqs.length > 0 && (
        <JsonLd
          data={{
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: faqs
              .filter((f) => f.answer)
              .map((f) => ({
                '@type': 'Question',
                name: f.question,
                acceptedAnswer: { '@type': 'Answer', text: f.answer },
              })),
          }}
        />
      )}

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

      {/* The questions an owner is usually left carrying on their own. */}
      <QuestionList
        eyebrow={pick(home, 'questionsEyebrow', locale)}
        headline={pick(home, 'questionsHeadline', locale)}
        body={pick(home, 'questionsBody', locale)}
        items={questions}
      />

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
                    <span className="mt-2.5 block font-display text-base font-display-soft uppercase sm:text-lg">
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

      {/* Services, as cards with one of them promoted. Falls back to the
          navigation label so the section survives an empty headline. */}
      <ServiceShowcase
        locale={locale}
        headline={pick(home, 'servicesHeadline', locale) || dict.nav.services}
        body={pick(home, 'servicesBody', locale)}
        allLabel={dict.common.allServices}
        services={services.filter((service) => service.id !== featuredService?.id).map(toShowcase)}
        featured={featuredService ? toShowcase(featuredService) : null}
      />

      {/* Featured tools — only what the CMS has actually published */}
      {tools.length > 0 && (
        <section className="bg-white section-y">
          <div className="shell">
            <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
              <SectionHeading eyebrow={dict.tools.title} title={dict.tools.title} description={dict.tools.intro} className="mb-0" />
              <TextLink href={`/${locale}/tools`}>{dict.tools.title}</TextLink>
            </div>

            <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {tools.map((tool, i) => (
                <Reveal as="li" key={tool.id} delay={Math.min(i, 6) * 55} y={14} className="h-full">
                  <Link
                    href={`/${locale}/tools/${tool.slug}`}
                    className="group flex h-full flex-col rounded-card border border-ink-900/10 bg-bone p-8 transition-colors duration-300 hover:border-brand"
                  >
                    <span className="font-mono text-[0.6875rem] text-brand">{String(i + 1).padStart(2, '0')}</span>
                    <span className="mt-4 font-display text-xl font-display-soft uppercase text-ink-900 transition-colors group-hover:text-brand">
                      {pick(tool, 'name', locale)}
                    </span>
                    {pick(tool, 'summary', locale) && (
                      <span className="mt-3 text-[0.9375rem] leading-relaxed text-ink-400">
                        {pick(tool, 'summary', locale)}
                      </span>
                    )}
                  </Link>
                </Reveal>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* Featured library resources */}
      {resources.length > 0 && (
        <section className="bg-bone section-y">
          <div className="shell">
            <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
              <SectionHeading eyebrow={dict.library.title} title={dict.library.title} description={dict.library.intro} className="mb-0" />
              <TextLink href={`/${locale}/library`}>{dict.library.title}</TextLink>
            </div>

            <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {resources.map((r, i) => (
                <ResourceCard
                  key={r.id}
                  locale={locale}
                  dict={dict}
                  index={i}
                  resource={{
                    id: r.id,
                    slug: r.slug,
                    title: pick(r, 'title', locale),
                    summary: pick(r, 'summary', locale),
                    type: r.type,
                    category: r.category ? pick(r.category, 'name', locale) : '',
                    thumbnail: r.thumbnail,
                    fileMime: r.fileMime,
                    fileSize: r.fileSize,
                    external: !r.fileKey && Boolean(r.externalUrl),
                  }}
                />
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* Featured insights */}
      {featuredInsights.length > 0 && (
        <section className="bg-white section-y">
          <div className="shell">
            <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
              <SectionHeading eyebrow={dict.nav.insights} title={dict.nav.insights} className="mb-0" />
              <TextLink href={`/${locale}/insights`}>{dict.nav.insights}</TextLink>
            </div>

            <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {featuredInsights.map((article, i) => (
                <Reveal as="li" key={article.id} delay={Math.min(i, 6) * 55} y={14}>
                  <Link href={`/${locale}/insights/${article.slug}`} className="group block">
                    {article.category && (
                      <span className="text-[0.6875rem] font-bold uppercase tracking-[0.2em] text-brand">
                        {pick(article.category, 'name', locale)}
                      </span>
                    )}
                    <span className="mt-2 block font-display text-xl font-display-soft uppercase text-ink-900 transition-colors group-hover:text-brand">
                      {pick(article, 'title', locale)}
                    </span>
                    {pick(article, 'excerpt', locale) && (
                      <span className="mt-2.5 block line-clamp-3 text-[0.9375rem] leading-relaxed text-ink-400">
                        {pick(article, 'excerpt', locale)}
                      </span>
                    )}
                  </Link>
                </Reveal>
              ))}
            </ul>
          </div>
        </section>
      )}

      <FeatureBanner
        eyebrow={pick(home, 'bannerEyebrow', locale)}
        headline={pick(home, 'bannerHeadline', locale)}
        body={pick(home, 'bannerBody', locale)}
        ctaLabel={pick(home, 'bannerCtaLabel', locale)}
        ctaHref={home.bannerCtaHref ? `/${locale}${home.bannerCtaHref === '/' ? '' : home.bannerCtaHref}` : ''}
        imageUrl={home.bannerImageUrl}
      />

      <FaqSection
        eyebrow={pick(home, 'faqEyebrow', locale)}
        headline={pick(home, 'faqHeadline', locale) || (faqs.length ? dict.common.faq : '')}
        body={pick(home, 'faqBody', locale)}
        items={faqs}
      />

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
