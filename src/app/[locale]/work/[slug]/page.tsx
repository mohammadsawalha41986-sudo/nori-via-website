import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { CTASection } from '@/components/public/CTASection';
import { RelatedContent } from '@/components/public/RelatedContent';
import { Metrics } from '@/components/public/Metrics';
import { PageHero } from '@/components/public/PageHero';
import { TrackView } from '@/components/public/TrackView';
import { Gallery } from '@/components/public/Gallery';
import { Reveal } from '@/components/ui/Reveal';
import { Prose } from '@/components/ui/Prose';
import { TextLink } from '@/components/ui/Button';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { getDictionary } from '@/lib/dictionary';
import { dirOf, isLocale, pick, type Locale } from '@/lib/i18n';
import {
  getProjectBySlug,
  asObjectList,
  type GalleryItem,
  type DownloadItem,
  type MetricItem,
} from '@/lib/content';
import { buildMetadata, JsonLd, breadcrumbs } from '@/lib/seo';
import { env } from '@/lib/env';
import { EVENTS } from '@/lib/track';
import { getRelatedContent } from '@/lib/relations';

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
  const project = await getProjectBySlug(slug);
  if (!project) return {};
  return buildMetadata({
    row: project,
    locale,
    path: `/work/${slug}`,
    fallbackTitle: pick(project, 'title', locale),
    fallbackDescription: pick(project, 'description', locale),
    fallbackImage: project.heroMediaKind === 'IMAGE' ? project.heroMediaUrl : null,
    type: 'article',
  });
}

export default async function ProjectPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale: raw, slug } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const dict = getDictionary(locale);

  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  const title = pick(project, 'title', locale);
  const gallery = asObjectList<GalleryItem>(project.gallery);
  const videos = asObjectList<GalleryItem>(project.videos);
  const downloads = asObjectList<DownloadItem>(project.downloads);
  const results = asObjectList<MetricItem>(project.results);
  const cs = project.caseStudy?.status === 'PUBLISHED' ? project.caseStudy : null;

  // A case study is read at its project's URL, so both sets of links belong here.
  const projectRelated = await getRelatedContent('PROJECT', project.id, locale);
  const caseStudyRelated = cs ? await getRelatedContent('CASE_STUDY', cs.id, locale) : [];
  const seen = new Set<string>();
  const related = [...projectRelated, ...caseStudyRelated].filter((item) => {
    const key = `${item.type}:${item.id}`;
    if (seen.has(key) || (item.type === 'PROJECT' && item.id === project.id)) return false;
    seen.add(key);
    return true;
  });

  const meta = [
    project.client && { label: dict.common.client, value: project.client },
    project.category && { label: dict.common.category, value: pick(project.category, 'name', locale) },
    project.year && { label: dict.common.year, value: String(project.year) },
    project.location && { label: dict.common.location, value: project.location },
  ].filter(Boolean) as { label: string; value: string }[];

  const chapters = cs
    ? ([
        ['challenge', dict.caseStudy.challenge],
        ['strategy', dict.caseStudy.strategy],
        ['idea', dict.caseStudy.idea],
        ['creative', dict.caseStudy.creative],
        ['campaign', dict.caseStudy.campaign],
        ['result', dict.caseStudy.result],
        ['outcome', dict.caseStudy.outcome],
      ] as const)
        .map(([field, label]) => ({ label, body: pick(cs, field, locale) }))
        .filter((c) => c.body)
    : [];

  const csMetrics = cs ? asObjectList<MetricItem>(cs.metrics) : [];
  const csGallery = cs ? asObjectList<GalleryItem>(cs.gallery) : [];
  const csFiles = cs ? asObjectList<DownloadItem>(cs.files) : [];

  const localisedLabel = (item: Record<string, unknown>, field: string) => pick(item, field, locale);

  return (
    <>
      <TrackView event={cs ? EVENTS.caseStudyView : EVENTS.workView} slug={slug} />

      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'CreativeWork',
          name: title,
          description: pick(project, 'description', locale),
          url: `${env.siteUrl}/${locale}/work/${slug}`,
          datePublished: project.year ? `${project.year}` : undefined,
          creator: { '@type': 'Organization', name: 'Noriva', url: env.siteUrl },
        }}
      />
      <JsonLd
        data={breadcrumbs(locale, [
          { name: 'Noriva', path: '/' },
          { name: dict.nav.work, path: '/work' },
          { name: title, path: `/work/${slug}` },
        ])}
      />

      <PageHero
        eyebrow={project.category ? pick(project.category, 'name', locale) : dict.nav.work}
        title={title}
        description={pick(project, 'description', locale)}
        meta={
          meta.length > 0 ? (
            <dl className="mt-12 grid max-w-3xl grid-cols-2 gap-x-8 gap-y-6 sm:grid-cols-4">
              {meta.map((m) => (
                <div key={m.label}>
                  <dt className="text-xs font-bold uppercase tracking-[0.2em] text-white/35">{m.label}</dt>
                  <dd className="mt-2 text-sm font-medium text-white">{m.value}</dd>
                </div>
              ))}
            </dl>
          ) : null
        }
      />

      {project.heroMediaUrl && (
        <section className="bg-bone">
          <div className="shell -mt-12 sm:-mt-20">
            <div className="relative aspect-[16/9] overflow-hidden rounded-2xl bg-ink-100 shadow-2xl shadow-ink-900/15">
              {project.heroMediaKind === 'VIDEO' ? (
                <video src={project.heroMediaUrl} controls playsInline className="h-full w-full object-cover" />
              ) : (
                <Image src={project.heroMediaUrl} alt={title} fill priority sizes="100vw" className="object-cover" />
              )}
            </div>
          </div>
        </section>
      )}

      {project.services.length > 0 && (
        <section className="bg-bone pt-16">
          <div className="shell">
            <h2 className="text-xs font-bold uppercase tracking-[0.24em] text-ink-400">{dict.common.services}</h2>
            <ul className="mt-4 flex flex-wrap gap-2">
              {project.services.map((s) => (
                <li key={s.serviceId}>
                  <a
                    href={`/${locale}/services/${s.service.slug}`}
                    className="inline-flex rounded-full border border-ink-900/15 px-4 py-2 text-sm text-ink-600 transition-colors duration-300 hover:border-brand hover:text-brand"
                  >
                    {pick(s.service, 'name', locale)}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* Verified results only */}
      {results.length > 0 && (
        <section className="bg-bone py-20 sm:py-24">
          <div className="shell">
            <SectionHeading eyebrow={dict.common.results} title={dict.common.results} className="mb-12" />
            <Metrics
              items={results
                .map((r) => ({ value: r.value || '', label: localisedLabel(r, 'label') || r.label || '' }))
                .filter((r) => r.value && r.label)}
            />
          </div>
        </section>
      )}

      {/* Case study narrative */}
      {chapters.length > 0 && (
        <section className="bg-white py-24 sm:py-32">
          <div className="shell space-y-16 sm:space-y-24">
            {chapters.map((c, i) => (
              <div key={c.label} className="grid gap-6 lg:grid-cols-[minmax(0,16rem)_minmax(0,1fr)] lg:gap-16">
                <Reveal>
                  <h2 className="font-display text-xl uppercase text-ink-900">
                    <span className="me-3 font-mono text-xs text-brand">{String(i + 1).padStart(2, '0')}</span>
                    {c.label}
                  </h2>
                </Reveal>
                <Reveal delay={80}>
                  <Prose text={c.body} className="max-w-2xl text-lg" />
                </Reveal>
              </div>
            ))}
          </div>
        </section>
      )}

      {csMetrics.length > 0 && (
        <section className="bg-ink-900 py-20 text-white sm:py-28">
          <div className="shell">
            <Metrics
              tone="light"
              items={csMetrics
                .map((m) => ({ value: m.value || '', label: localisedLabel(m, 'label') || m.label || '' }))
                .filter((m) => m.value && m.label)}
            />
          </div>
        </section>
      )}

      {(gallery.length > 0 || csGallery.length > 0) && (
        <section className="bg-bone py-20 sm:py-28">
          <Gallery
            dir={dirOf(locale)}
            images={[...gallery, ...csGallery]
              .filter((g): g is GalleryItem & { url: string } => Boolean(g.url))
              .map((g) => ({ url: g.url, alt: localisedLabel(g, 'alt') || title }))}
            labels={{
              title,
              open: dict.gallery.open,
              close: dict.gallery.close,
              previous: dict.gallery.previous,
              next: dict.gallery.next,
            }}
          />
        </section>
      )}

      {videos.length > 0 && (
        <section className="bg-bone pb-20">
          <div className="shell grid gap-6 sm:grid-cols-2">
            {videos.map((v, i) =>
              v.url ? (
                <Reveal key={v.url + i} className="overflow-hidden rounded-xl bg-ink-900">
                  <video src={v.url} controls playsInline preload="metadata" className="aspect-video w-full" />
                </Reveal>
              ) : null,
            )}
          </div>
        </section>
      )}

      {[...downloads, ...csFiles].length > 0 && (
        <section className="bg-white py-20">
          <div className="shell max-w-3xl">
            <h2 className="font-display text-xl uppercase text-ink-900">
              {dict.common.downloads}
            </h2>
            <ul className="mt-6 border-t border-ink-900/10">
              {[...downloads, ...csFiles].map((d, i) =>
                d.url ? (
                  <li key={d.url + i} className="border-b border-ink-900/10 py-4">
                    <a
                      href={d.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center justify-between gap-6 text-sm font-medium text-ink-700 transition-colors hover:text-brand"
                    >
                      {localisedLabel(d, 'label') || d.url.split('/').pop()}
                      <span aria-hidden className="text-ink-300 transition-transform group-hover:translate-y-0.5">↓</span>
                    </a>
                  </li>
                ) : null,
              )}
            </ul>
          </div>
        </section>
      )}

      <section className="bg-bone py-16">
        <div className="shell">
          <TextLink href={`/${locale}/work`}>{dict.common.allWork}</TextLink>
        </div>
      </section>

      <RelatedContent items={related} title={dict.related.title} eyebrow={dict.nav.work} />

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
