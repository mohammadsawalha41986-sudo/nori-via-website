import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { PageHero } from '@/components/public/PageHero';
import { CTASection } from '@/components/public/CTASection';
import { ProjectCard } from '@/components/public/ProjectCard';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal } from '@/components/ui/Reveal';
import { Prose } from '@/components/ui/Prose';
import { getDictionary } from '@/lib/dictionary';
import { isLocale, pick, type Locale } from '@/lib/i18n';
import {
  getServiceBySlug,
  asObjectList,
  type FaqItem,
  type ProcessItem,
  type GalleryItem,
} from '@/lib/content';
import { buildMetadata, JsonLd, breadcrumbs } from '@/lib/seo';
import { env } from '@/lib/env';

export const revalidate = 60;

/**
 * No `generateStaticParams`: the slugs live in the CMS, so enumerating them
 * would require a database connection during `next build`. Pages are rendered
 * on first request and cached for `revalidate` seconds instead.
 */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale: raw, slug } = await params;
  if (!isLocale(raw)) return {};
  const locale = raw as Locale;
  const service = await getServiceBySlug(slug);
  if (!service) return {};
  return buildMetadata({
    row: service,
    locale,
    path: `/services/${slug}`,
    fallbackTitle: pick(service, 'name', locale),
    fallbackDescription: pick(service, 'summary', locale),
  });
}

function localised(item: Record<string, unknown>, field: string, locale: Locale) {
  return pick(item, field, locale);
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: raw, slug } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const dict = getDictionary(locale);

  const service = await getServiceBySlug(slug);
  if (!service) notFound();

  const name = pick(service, 'name', locale);
  const deliverables = asObjectList<{ labelEn?: string; labelAr?: string }>(service.deliverables);
  const benefits = asObjectList<{ labelEn?: string; labelAr?: string }>(service.benefits);
  const process = asObjectList<ProcessItem>(service.process);
  const faqs = asObjectList<FaqItem>(service.faqs);
  const gallery = asObjectList<GalleryItem>(service.gallery);
  const relatedProjects = service.projects.map((p) => p.project).filter((p) => p.status === 'PUBLISHED');

  const sections = [
    { key: 'whatWeDo', label: dict.service.whatWeDo, body: pick(service, 'whatWeDo', locale) },
    { key: 'whyItMatters', label: dict.service.whyItMatters, body: pick(service, 'whyItMatters', locale) },
    { key: 'approach', label: dict.service.approach, body: pick(service, 'approach', locale) },
  ].filter((s) => s.body);

  const faqEntries = faqs
    .map((f) => ({ q: localised(f, 'question', locale), a: localised(f, 'answer', locale) }))
    .filter((f) => f.q && f.a);

  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Service',
          name,
          description: pick(service, 'summary', locale),
          serviceType: service.category ? pick(service.category, 'name', locale) : undefined,
          provider: { '@type': 'Organization', name: 'Noriva', url: env.siteUrl },
          areaServed: 'SA',
          url: `${env.siteUrl}/${locale}/services/${slug}`,
        }}
      />
      <JsonLd
        data={breadcrumbs(locale, [
          { name: 'Noriva', path: '/' },
          { name: dict.nav.services, path: '/services' },
          { name, path: `/services/${slug}` },
        ])}
      />
      {faqEntries.length > 0 && (
        <JsonLd
          data={{
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: faqEntries.map((f) => ({
              '@type': 'Question',
              name: f.q,
              acceptedAnswer: { '@type': 'Answer', text: f.a },
            })),
          }}
        />
      )}

      <PageHero
        eyebrow={service.category ? pick(service.category, 'name', locale) : dict.nav.services}
        title={pick(service, 'heroHeadline', locale) || name}
        description={pick(service, 'heroDescription', locale) || pick(service, 'summary', locale)}
      />

      {sections.length > 0 && (
        <section className="bg-bone py-24 sm:py-32">
          <div className="shell space-y-20 sm:space-y-28">
            {sections.map((s, i) => (
              <div key={s.key} className="grid gap-8 lg:grid-cols-[minmax(0,18rem)_minmax(0,1fr)] lg:gap-16">
                <Reveal>
                  <h2 className="font-display text-xl font-extrabold uppercase tracking-tight text-ink-900 sm:text-2xl">
                    <span className="me-3 font-mono text-xs text-brand">{String(i + 1).padStart(2, '0')}</span>
                    {s.label}
                  </h2>
                </Reveal>
                <Reveal delay={80}>
                  <Prose text={s.body} className="max-w-2xl text-lg" />
                </Reveal>
              </div>
            ))}
          </div>
        </section>
      )}

      {(deliverables.length > 0 || benefits.length > 0) && (
        <section className="bg-white py-24 sm:py-32">
          <div className="shell">
            <SectionHeading eyebrow={dict.nav.services} title={dict.service.whatYouGet} />
            <ul className="mt-12 grid gap-px overflow-hidden rounded-xl bg-ink-900/10 sm:grid-cols-2 lg:grid-cols-3">
              {[...deliverables, ...benefits].map((d, i) => {
                const label = localised(d, 'label', locale);
                if (!label) return null;
                return (
                  <Reveal as="li" key={`${label}-${i}`} delay={i * 45} y={14} className="bg-white px-7 py-8">
                    <span className="font-mono text-[0.6875rem] text-brand">{String(i + 1).padStart(2, '0')}</span>
                    <span className="mt-2.5 block text-[0.9375rem] font-semibold leading-snug text-ink-800">{label}</span>
                  </Reveal>
                );
              })}
            </ul>
          </div>
        </section>
      )}

      {process.length > 0 && (
        <section className="bg-bone py-24 sm:py-32">
          <div className="shell">
            <SectionHeading eyebrow={dict.service.approach} title={dict.service.approach} />
            <ol className="mt-12 border-t border-ink-900/10">
              {process.map((p, i) => {
                const title = localised(p, 'title', locale);
                const body = localised(p, 'body', locale);
                if (!title) return null;
                return (
                  <Reveal as="li" key={`${title}-${i}`} delay={i * 60} y={16} className="border-b border-ink-900/10 py-7">
                    <div className="grid gap-4 sm:grid-cols-[4rem_minmax(0,1fr)] sm:gap-8">
                      <span className="font-mono text-xs text-brand">{String(i + 1).padStart(2, '0')}</span>
                      <div>
                        <h3 className="font-display text-lg font-bold uppercase tracking-tight text-ink-900">{title}</h3>
                        {body && <p className="mt-2 max-w-2xl text-[0.9375rem] leading-relaxed text-ink-400">{body}</p>}
                      </div>
                    </div>
                  </Reveal>
                );
              })}
            </ol>
          </div>
        </section>
      )}

      {gallery.length > 0 && (
        <section className="bg-white py-20">
          <div className="shell grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {gallery.map((g, i) =>
              g.url ? (
                <Reveal key={g.url + i} delay={i * 60} className="relative aspect-[4/3] overflow-hidden rounded-xl bg-ink-100">
                  <Image
                    src={g.url}
                    alt={localised(g, 'alt', locale) || name}
                    fill
                    sizes="(min-width:1024px) 33vw, 100vw"
                    className="object-cover"
                  />
                </Reveal>
              ) : null,
            )}
          </div>
        </section>
      )}

      {relatedProjects.length > 0 && (
        <section className="bg-bone py-24 sm:py-32">
          <div className="shell">
            <SectionHeading eyebrow={dict.nav.work} title={dict.common.relatedWork} />
            <div className="mt-14 grid gap-x-6 gap-y-14 lg:grid-cols-12 lg:gap-y-20">
              {relatedProjects.slice(0, 4).map((p, i) => (
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
                    category: '',
                    services: [],
                    year: p.year,
                    heroMediaUrl: p.heroMediaUrl,
                    caseStudySlug: null,
                  }}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {faqEntries.length > 0 && (
        <section className="bg-white py-24 sm:py-32">
          <div className="shell max-w-3xl">
            <SectionHeading title={dict.common.faq} />
            <div className="mt-10 border-t border-ink-900/10">
              {faqEntries.map((f, i) => (
                <Reveal key={i} delay={i * 50} y={14}>
                  <details className="group border-b border-ink-900/10 py-5">
                    <summary className="flex cursor-pointer list-none items-start justify-between gap-6 text-start font-semibold text-ink-900 marker:hidden">
                      {f.q}
                      <span
                        aria-hidden
                        className="mt-1 shrink-0 text-brand transition-transform duration-300 group-open:rotate-45"
                      >
                        +
                      </span>
                    </summary>
                    <div className="pt-4">
                      <Prose text={f.a} />
                    </div>
                  </details>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      <CTASection
        headline={dict.nav.start}
        description={pick(service, 'summary', locale)}
        label={dict.nav.start}
        href={`/${locale}/start-a-project`}
        secondaryLabel={dict.common.allServices}
        secondaryHref={`/${locale}/services`}
      />
    </>
  );
}
