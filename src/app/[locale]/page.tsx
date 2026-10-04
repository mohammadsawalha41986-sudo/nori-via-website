import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Hero } from '@/components/public/Hero';
import { SystemStages, type Stage } from '@/components/public/SystemStages';
import { ProjectCard } from '@/components/public/ProjectCard';
import { WorkCarousel } from '@/components/public/WorkCarousel';
import { ResourceCard } from '@/components/public/ResourceCard';
import { CTASection } from '@/components/public/CTASection';
import { ServiceShowcase } from '@/components/public/ServiceShowcase';
import { BusinessEvidence } from '@/components/public/BusinessEvidence';
import { RestaurantProblems } from '@/components/public/RestaurantProblems';
import { Metrics } from '@/components/public/Metrics';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { TextLink } from '@/components/ui/Button';
import { getDictionary } from '@/lib/dictionary';
import { isLocale, pick } from '@/lib/i18n';
import {
  getHomepage,
  getPage,
  getSettings,
  getSystemStages,
  getFeaturedProjects,
  getStatistics,
  getPublishedServices,
  getFeaturedTools,
  getFeaturedResources,
  asStringList,
} from '@/lib/content';
import { PRACTICES, practiceEntryPoint } from '@/lib/service-discovery';
import type { Metadata } from 'next';
import { JsonLd, webpageSchema, buildMetadata } from '@/lib/seo';
import { BRAND_DESCRIPTION } from '@/lib/brand';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const [settings, page] = await Promise.all([getSettings(), getPage('home')]);
  return buildMetadata({ row: { ...settings, ...page,
    seoTitleEn: page?.seoTitleEn || settings.seoTitleEn,
    seoTitleAr: page?.seoTitleAr || settings.seoTitleAr,
    seoDescriptionEn: page?.seoDescriptionEn || settings.seoDescriptionEn,
    seoDescriptionAr: page?.seoDescriptionAr || settings.seoDescriptionAr,
  }, locale, path: '/',
    fallbackTitle: locale === 'ar' ? 'إدارة وتطوير وتسويق المطاعم في السعودية' : 'Restaurant Consulting & Growth in Saudi Arabia',
    fallbackDescription: BRAND_DESCRIPTION[locale], fallbackImage: settings.defaultOgImage || '/img/noriva-photo-dining.webp' });
}
export const revalidate = 60;
export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const ar = locale === 'ar';
  const dict = getDictionary(locale);
  const [home, stageRows, projects, stats, services, tools, resources] =
    await Promise.all([
      getHomepage(),
      getSystemStages(),
      getFeaturedProjects(3),
      getStatistics(),
      getPublishedServices(),
      getFeaturedTools(3),
      getFeaturedResources(3),
    ]);
  const pillars = PRACTICES.filter((p) => p.id !== 'finance').flatMap((p) => {
    const service = practiceEntryPoint(p.id, services);
    return service
      ? [
          {
            id: p.id,
            slug: service.slug,
            name: ar ? p.ar : p.en,
            summary: ar ? p.summaryAr : p.summaryEn,
            image: service.featuredImage,
          },
        ]
      : [];
  });
  const stages: Stage[] = stageRows.map((s) => ({
    id: s.id,
    step: s.step,
    title: pick(s, 'title', locale),
    description: pick(s, 'description', locale),
    services: asStringList(s.services),
    mediaUrl: s.mediaUrl,
  }));
  return (
    <>
      <JsonLd data={webpageSchema(locale, '/', locale === 'ar' ? 'نوريفا — حلول المطاعم' : 'NORIVA — Restaurant solutions')} />
      <Hero
        locale={locale}
        eyebrow={pick(home, 'heroEyebrow', locale)}
        headline={(() => {
          const text = pick(home, 'heroHeadline', locale);
          return /^(من فكرة مطعمك|Your restaurant\.|نبني مشاريع|WE BUILD BETTER)/i.test(text) || !text
            ? (ar ? 'حلول متكاملة لنمو وإدارة المطاعم' : 'Restaurant consulting, operations and growth') : text;
        })()}
        subtitle={pick(home, 'heroSubtitle', locale) || BRAND_DESCRIPTION[locale]}
        primaryCta={pick(home, 'heroPrimaryCta', locale) || dict.nav.start}
        secondaryCta={pick(home, 'heroSecondaryCta', locale) || dict.common.allServices}
        mediaUrl={home.heroMediaUrl}
        mediaKind={home.heroMediaKind}
      />
      <section className="trust-strip bg-ink-900 text-white">
        <div className="shell flex flex-wrap items-center justify-between gap-4">
          <p>
            {ar
              ? 'تخصصنا المطاعم والمقاهي. من الفكرة إلى التوسع.'
              : 'Restaurants and cafés are our discipline. From idea to expansion.'}
          </p>
          <p className="text-xs text-white/60">
            {ar
              ? 'الاستراتيجية · التشغيل · القائمة · العلامة · التسويق · النمو'
              : 'Strategy · Operations · Menu · Brand · Marketing · Growth'}
          </p>
        </div>
      </section>
      <section className="bg-bone home-intro"><div className="shell">
        <h2 className="font-display text-2xl">{ar ? 'نوريفا: من تشخيص المطعم إلى تحسين الأداء' : 'NORIVA: from restaurant diagnosis to better performance'}</h2>
        <p className="mt-4 max-w-3xl leading-8 text-ink-700">{ar ? 'نخدم أصحاب المطاعم والمقاهي وفرق الأغذية والمشروبات في السعودية. نحلل المبيعات وتكلفة الوصفات والتشغيل والمنيو لنحدد أين يتراجع هامش الربح، ثم نبني خطة تحسين قابلة للتنفيذ. نربط الاستشارات بالتشغيل والتسويق والمحتوى، وفق احتياج المشروع وبياناته.' : 'We work with restaurant and café owners and F&B teams in Saudi Arabia. We review sales, recipe costs, operations and menus to identify where margin is lost, then build a practical improvement plan. Consulting, operations, marketing and content are connected to your project’s needs and data.'}</p>
        <Link href={`/${locale}/contact`} className="mt-4 inline-block font-semibold text-ink-700">{ar ? 'ناقش تحديات مطعمك معنا' : 'Discuss your restaurant with us'} →</Link>
      </div></section>
      <RestaurantProblems locale={locale} published={services.map((s) => s.slug)} />
      <ServiceShowcase
        locale={locale}
        headline={ar ? 'خبرة مترابطة. حلول واضحة.' : 'Connected expertise. Clear solutions.'}
        body={
          ar
            ? 'اختر نقطة البداية. نربط القرارات التجارية بالتنفيذ داخل مطعمك.'
            : 'Choose a starting point. We connect business decisions to implementation inside your restaurant.'
        }
        allLabel={dict.common.allServices}
        services={pillars}
      />
      <SystemStages
        headline={pick(home, 'systemHeadline', locale) || (ar ? 'كيف نعمل' : 'How NORIVA works')}
        stages={stages}
      />
      {projects.length > 0 && (
        <section className="bg-bone section-y">
          <div className="shell">
            <div className="mb-10 flex flex-wrap items-end justify-between gap-5">
              <SectionHeading
                eyebrow={dict.nav.work}
                title={ar ? 'من التحدي إلى خطة التنفيذ' : 'From challenge to implementation'}
                className="mb-0"
              />
              <TextLink href={`/${locale}/work`}>{dict.common.allWork}</TextLink>
            </div>
            <WorkCarousel locale={locale}>
              {projects.map((p, i) => (
                <ProjectCard
                  key={p.id}
                  locale={locale}
                  index={i}
                  layout="slide"
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
            </WorkCarousel>
          </div>
        </section>
      )}
      <BusinessEvidence locale={locale} />
      {stats.length > 0 && (
        <section className="bg-bone py-14">
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
      {tools.length > 0 && (
        <section className="bg-white section-y">
          <div className="shell">
            <div className="mb-10 flex flex-wrap items-end justify-between gap-5">
              <SectionHeading
                eyebrow={dict.tools.title}
                title={ar ? 'ابدأ بأرقامك' : 'Start with your numbers'}
                description={
                  ar
                    ? 'أدوات تعمل هنا مباشرة. تقديرات تساعدك على طرح السؤال الصحيح.'
                    : 'Interactive tools that work here. Estimates that help you ask the right question.'
                }
                className="mb-0"
              />
              <TextLink href={`/${locale}/tools`}>{dict.tools.title}</TextLink>
            </div>
            <ul className="grid gap-6 md:grid-cols-3">
              {tools.map((t, i) => (
                <li key={t.id}>
                  <Link href={`/${locale}/tools/${t.slug}`} className="tool-editorial group">
                    <span className="font-mono text-xs text-ink-600">
                      0{i + 1} / {ar ? 'أداة تفاعلية' : 'INTERACTIVE'}
                    </span>
                    <h3 className="mt-5 font-display text-2xl">{pick(t, 'name', locale)}</h3>
                    <p className="mt-4 text-sm text-ink-600">{pick(t, 'summary', locale)}</p>
                    <span className="mt-8 block text-sm font-semibold text-ink-700">
                      {ar ? 'استخدم الأداة' : 'Run the calculator'} →
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
      {resources.length > 0 && (
        <section className="bg-bone section-y">
          <div className="shell">
            <div className="mb-10 flex flex-wrap items-end justify-between gap-5">
              <SectionHeading
                eyebrow={dict.library.title}
                title={ar ? 'معرفة يمكنك تطبيقها' : 'Knowledge you can put to work'}
                className="mb-0"
              />
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
      <CTASection
        headline={
          pick(home, 'ctaHeadline', locale) ||
          (ar ? 'جاهز لتحسين أداء مطعمك؟' : 'Ready to build a stronger restaurant?')
        }
        description={pick(home, 'ctaDescription', locale)}
        label={pick(home, 'ctaLabel', locale) || dict.nav.start}
        href={`/${locale}/start-a-project`}
        secondaryLabel={dict.nav.contact}
        secondaryHref={`/${locale}/contact`}
      />
    </>
  );
}
