import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { CTASection } from '@/components/public/CTASection';
import { PageHero } from '@/components/public/PageHero';
import { RelatedContent } from '@/components/public/RelatedContent';
import { DownloadButton } from '@/components/public/DownloadButton';
import { Prose } from '@/components/ui/Prose';
import { Reveal } from '@/components/ui/Reveal';
import { getDictionary } from '@/lib/dictionary';
import { formatDate, isLocale, pick, type Locale } from '@/lib/i18n';
import { asObjectList, getResourceBySlug } from '@/lib/content';
import { getRelatedContent } from '@/lib/relations';
import { getSessionUser } from '@/lib/auth';
import { documentLabel, formatBytes } from '@/lib/storage';
import { buildMetadata, JsonLd, breadcrumbs } from '@/lib/seo';
import { env } from '@/lib/env';

export const revalidate = 60;

type Bullet = { labelEn?: string; labelAr?: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale: raw, slug } = await params;
  if (!isLocale(raw)) return {};
  const locale = raw as Locale;
  const resource = await getResourceBySlug(slug);
  if (!resource) return {};
  return buildMetadata({
    row: resource,
    locale,
    path: `/library/${slug}`,
    fallbackTitle: pick(resource, 'title', locale),
    fallbackDescription: pick(resource, 'summary', locale),
    type: 'article',
  });
}

export default async function ResourcePage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string; slug: string }>;
  searchParams: Promise<{ preview?: string }>;
}) {
  const { locale: raw, slug } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const dict = getDictionary(locale);

  // A draft is readable only by a signed-in admin following a preview link.
  const { preview } = await searchParams;
  const isPreview = preview === '1' && Boolean(await getSessionUser());

  const resource = await getResourceBySlug(slug, isPreview);
  if (!resource) notFound();

  const related = await getRelatedContent('RESOURCE', resource.id, locale);

  const bullet = (item: Bullet) => (locale === 'ar' ? item.labelAr || item.labelEn : item.labelEn || item.labelAr) || '';
  const includes = asObjectList<Bullet>(resource.includes).map(bullet).filter(Boolean);
  const audience = asObjectList<Bullet>(resource.audience).map(bullet).filter(Boolean);

  const isExternal = !resource.fileKey && Boolean(resource.externalUrl);
  const format = isExternal ? dict.library.openResource : documentLabel(resource.fileMime);
  const size = formatBytes(resource.fileSize);

  return (
    <>
      <JsonLd
        data={breadcrumbs(locale, [
          { name: dict.library.title, path: '/library' },
          { name: pick(resource, 'title', locale), path: `/library/${resource.slug}` },
        ])}
      />
      {resource.status === 'PUBLISHED' && (
        <JsonLd
          data={{
            '@context': 'https://schema.org',
            '@type': 'DigitalDocument',
            name: pick(resource, 'title', locale),
            description: pick(resource, 'summary', locale) || undefined,
            url: `${env.siteUrl}/${locale}/library/${resource.slug}`,
            encodingFormat: resource.fileMime || undefined,
            datePublished: resource.publishedAt?.toISOString(),
            inLanguage: locale,
          }}
        />
      )}

      {isPreview && resource.status !== 'PUBLISHED' && (
        <p className="bg-amber-400 px-4 py-2 text-center text-sm font-semibold text-ink-900">{dict.draft.badge}</p>
      )}

      <PageHero
        eyebrow={resource.category ? pick(resource.category, 'name', locale) : dict.library.title}
        title={pick(resource, 'title', locale)}
        description={pick(resource, 'summary', locale)}
        meta={
          <ul className="mt-10 flex flex-wrap gap-x-10 gap-y-4 text-sm text-white/55">
            <li>
              <span className="block text-[0.6875rem] font-bold uppercase tracking-[0.2em] text-white/35">
                {dict.library.fileType}
              </span>
              <span className="mt-1 block font-semibold text-white">{format}</span>
            </li>
            {size && !isExternal && (
              <li>
                <span className="block text-[0.6875rem] font-bold uppercase tracking-[0.2em] text-white/35">
                  {dict.library.fileSize}
                </span>
                <span className="mt-1 block font-semibold text-white">{size}</span>
              </li>
            )}
            {resource.publishedAt && (
              <li>
                <span className="block text-[0.6875rem] font-bold uppercase tracking-[0.2em] text-white/35">
                  {dict.library.updated}
                </span>
                <span className="mt-1 block font-semibold text-white">
                  {formatDate(resource.updatedAt, locale)}
                </span>
              </li>
            )}
          </ul>
        }
      />

      <section className="bg-bone section-y">
        <div className="shell grid gap-14 lg:grid-cols-[1.6fr_1fr] lg:gap-20">
          <div>
            {resource.thumbnail && (
              <Reveal className="relative mb-12 block aspect-[16/9] overflow-hidden rounded-card bg-ink-100">
                <Image
                  src={resource.thumbnail}
                  alt={pick(resource, 'title', locale)}
                  fill
                  sizes="(min-width:1024px) 60vw, 100vw"
                  className="object-cover"
                  priority
                />
              </Reveal>
            )}

            {pick(resource, 'description', locale) && (
              <Prose text={pick(resource, 'description', locale)} className="text-lg" />
            )}

            {includes.length > 0 && (
              <div className="mt-14">
                <h2 className="font-display text-xl font-extrabold uppercase tracking-tight text-ink-900">
                  {dict.library.whatsIncluded}
                </h2>
                <ul className="mt-6 space-y-3">
                  {includes.map((item) => (
                    <li key={item} className="flex gap-3 text-[0.9375rem] leading-relaxed text-ink-600">
                      <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {audience.length > 0 && (
              <div className="mt-12">
                <h2 className="font-display text-xl font-extrabold uppercase tracking-tight text-ink-900">
                  {dict.library.whoFor}
                </h2>
                <ul className="mt-6 flex flex-wrap gap-2">
                  {audience.map((item) => (
                    <li
                      key={item}
                      className="rounded-btn border border-ink-900/15 px-4 py-2 text-sm text-ink-600"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-card border border-ink-900/10 bg-white p-8">
              <p className="font-display text-lg font-extrabold uppercase tracking-tight text-ink-900">
                {dict.library.download}
              </p>
              <dl className="mt-6 space-y-3 text-sm text-ink-500">
                <div className="flex justify-between gap-4">
                  <dt>{dict.library.fileType}</dt>
                  <dd className="font-semibold text-ink-900">{format}</dd>
                </div>
                {size && !isExternal && (
                  <div className="flex justify-between gap-4">
                    <dt>{dict.library.fileSize}</dt>
                    <dd className="font-semibold text-ink-900">{size}</dd>
                  </div>
                )}
                {resource.downloadCount > 0 && (
                  <div className="flex justify-between gap-4">
                    <dt>{dict.library.downloads}</dt>
                    <dd className="font-semibold text-ink-900">{resource.downloadCount}</dd>
                  </div>
                )}
              </dl>

              <div className="mt-8">
                <DownloadButton
                  href={`/api/library/${resource.slug}/download`}
                  slug={resource.slug}
                  label={isExternal ? dict.library.openResource : dict.library.downloadFile}
                  disabled={resource.status !== 'PUBLISHED'}
                />
              </div>
            </div>
          </aside>
        </div>
      </section>

      <RelatedContent items={related} title={dict.related.title} eyebrow={dict.library.title} tone="white" />

      <CTASection
        headline={dict.nav.start}
        label={dict.nav.start}
        href={`/${locale}/start-a-project`}
        secondaryLabel={dict.nav.library}
        secondaryHref={`/${locale}/library`}
      />
    </>
  );
}
