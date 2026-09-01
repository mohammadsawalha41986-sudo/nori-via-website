import type { Metadata } from 'next';
import { env } from './env';
import { pick, locales, type Locale } from './i18n';

type SeoSource = Record<string, unknown> & { noindex?: boolean; ogImage?: string | null };

/**
 * Builds page metadata from any CMS row that carries the standard
 * seoTitle/seoDescription/ogImage/noindex fields.
 */
export function buildMetadata({
  row,
  locale,
  path,
  fallbackTitle,
  fallbackDescription,
  type = 'website',
  publishedTime,
}: {
  row?: SeoSource | null;
  locale: Locale;
  path: string;
  fallbackTitle: string;
  fallbackDescription?: string;
  type?: 'website' | 'article';
  publishedTime?: string;
}): Metadata {
  const title = (row && pick(row, 'seoTitle', locale)) || fallbackTitle;
  const description = (row && pick(row, 'seoDescription', locale)) || fallbackDescription || '';
  const url = `${env.siteUrl}/${locale}${path === '/' ? '' : path}`;
  const image = row?.ogImage || undefined;

  const languages = Object.fromEntries(
    locales.map((l) => [l, `${env.siteUrl}/${l}${path === '/' ? '' : path}`]),
  ) as Record<string, string>;

  return {
    title,
    description,
    alternates: { canonical: url, languages: { ...languages, 'x-default': languages.en! } },
    robots: row?.noindex ? { index: false, follow: false } : undefined,
    openGraph: {
      type,
      url,
      title,
      description,
      images: image ? [{ url: image }] : undefined,
      publishedTime,
      locale: locale === 'ar' ? 'ar_SA' : 'en_US',
    },
    twitter: { card: 'summary_large_image', title, description, images: image ? [image] : undefined },
  };
}

/** Renders a JSON-LD block. Values are serialised, so nothing is interpolated raw. */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  );
}

export function breadcrumbs(locale: Locale, trail: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((t, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: t.name,
      item: `${env.siteUrl}/${locale}${t.path === '/' ? '' : t.path}`,
    })),
  };
}
