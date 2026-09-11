import type { Metadata } from 'next';
import { env } from './env';
import { pick, defaultLocale, type Locale } from './i18n';
import { BRAND, BRAND_DESCRIPTION, BRAND_LOGO, BRAND_TOPICS, SCHEMA_IDS, stripBrandSuffix } from './brand';

/**
 * Turns a stored media path into an absolute URL.
 *
 * Structured data is read out of context by a crawler, so a relative `/img/…`
 * in a JSON-LD `image` resolves against nothing and the image is dropped.
 * Metadata does not need this — Next resolves those against `metadataBase` —
 * but JSON-LD is hand-built and does.
 */
export function absoluteMediaUrl(path: string | null | undefined): string | undefined {
  if (!path) return undefined;
  if (/^https?:\/\//i.test(path)) return path;
  return `${env.siteUrl}${path.startsWith('/') ? path : `/${path}`}`;
}

/** Absolute URL for a locale-prefixed path, with no trailing slash. */
export function absoluteUrl(locale: Locale, path = '/') {
  return `${env.siteUrl}/${locale}${path === '/' ? '' : path}`;
}

/**
 * Canonical plus the full hreflang cluster for one page.
 *
 * Every page emits the same shape, so the reciprocal references can never
 * disagree between the layout and an individual route. `ar-SA` is listed
 * alongside the bare `ar` because the audience is Saudi, and `x-default`
 * points at Arabic because that is where an unrecognised visitor is actually
 * sent — an `x-default` that contradicts the redirect is a crawl trap.
 */
export function alternatesFor(locale: Locale, path = '/'): Metadata['alternates'] {
  return {
    canonical: absoluteUrl(locale, path),
    languages: {
      en: absoluteUrl('en', path),
      ar: absoluteUrl('ar', path),
      'ar-SA': absoluteUrl('ar', path),
      'x-default': absoluteUrl(defaultLocale, path),
    },
  };
}

type SeoSource = Record<string, unknown> & {
  noindex?: boolean;
  ogImage?: string | null;
  /** Editor-set canonical override. Only the Page model carries one. */
  canonical?: string | null;
};

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
  fallbackImage,
  type = 'website',
  publishedTime,
}: {
  row?: SeoSource | null;
  locale: Locale;
  path: string;
  fallbackTitle: string;
  fallbackDescription?: string;
  /**
   * Used for the share card when the row has no dedicated social image — the
   * page's own main image, so a shared link is never blank. The dedicated
   * social image always wins, and is never rendered on the page itself.
   */
  fallbackImage?: string | null;
  type?: 'website' | 'article';
  publishedTime?: string;
}): Metadata {
  /*
    The stored title may already end in the brand — the content scripts used to
    append it — and the layout's `%s — NORIVA GLOBAL` template appends it again,
    which is how "… — نوريفا — NORIVA GLOBAL" reaches the SERP. Strip whatever
    is stored and let the template add the one canonical form.
  */
  const title = stripBrandSuffix((row && pick(row, 'seoTitle', locale)) || fallbackTitle);
  const description =
    (row && pick(row, 'seoDescription', locale)) || fallbackDescription || BRAND_DESCRIPTION[locale];
  const url = absoluteUrl(locale, path);
  const stored = typeof row?.canonical === 'string' ? row.canonical.trim() : '';
  const canonicalOverride = /^https?:\/\/\S+$/i.test(stored) ? stored : undefined;
  const image = row?.ogImage || fallbackImage || undefined;

  return {
    title,
    description,
    /*
      Admin offers a "Canonical URL — leave empty to use the default" field on
      pages, and until now nothing read it: the control silently did nothing.
      An explicit value wins, but only when it is a real absolute URL, so a
      half-typed one cannot point the canonical at nowhere.
    */
    alternates: canonicalOverride
      ? { ...alternatesFor(locale, path), canonical: canonicalOverride }
      : alternatesFor(locale, path),
    robots: row?.noindex ? { index: false, follow: false } : undefined,
    openGraph: {
      type,
      url,
      title,
      description,
      // Stated on every page, so the brand a crawler reads never depends on
      // which page it happened to land on first.
      siteName: BRAND.name,
      images: image ? [{ url: image }] : undefined,
      publishedTime,
      locale: locale === 'ar' ? 'ar_SA' : 'en_US',
    },
    twitter: { card: 'summary_large_image', title, description, images: image ? [image] : undefined },
  };
}

/**
 * The company, as a single reusable node.
 *
 * Referenced by `@id` from every other node rather than repeated inline, so a
 * crawler resolves one organisation instead of a dozen near-duplicates. Only
 * facts the site already publishes are included: contact details and social
 * profiles come from Admin and are omitted entirely when unset — an invented
 * profile or address is worse than an absent one.
 */
export function organizationSchema({
  locale,
  description,
  email,
  telephone,
  sameAs,
  logoUrl,
}: {
  locale: Locale;
  description?: string;
  email?: string | null;
  telephone?: string | null;
  sameAs?: string[];
  logoUrl?: string | null;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': SCHEMA_IDS.organization,
    name: BRAND.name,
    // Both the short form and the Arabic spellings resolve to this entity.
    alternateName: [BRAND.shortName, BRAND.nameAr, BRAND.shortNameAr],
    url: env.siteUrl,
    description: description || BRAND_DESCRIPTION[locale],
    logo: {
      '@type': 'ImageObject',
      url: `${env.siteUrl}${logoUrl || BRAND_LOGO.path}`,
      width: BRAND_LOGO.width,
      height: BRAND_LOGO.height,
    },
    image: `${env.siteUrl}${BRAND_LOGO.path}`,
    email: email || undefined,
    telephone: telephone || undefined,
    areaServed: { '@type': 'Country', name: BRAND.areaServed },
    knowsAbout: BRAND_TOPICS[locale],
    sameAs: sameAs && sameAs.length ? sameAs : undefined,
  };
}

/**
 * The site itself.
 *
 * `name` here is what Google reads for the site name shown above a result, and
 * `publisher` ties the site back to the one organisation node.
 */
export function websiteSchema(locale: Locale) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': SCHEMA_IDS.website,
    name: BRAND.name,
    alternateName: [BRAND.shortName, BRAND.nameAr],
    url: env.siteUrl,
    description: BRAND_DESCRIPTION[locale],
    inLanguage: locale === 'ar' ? 'ar-SA' : 'en',
    publisher: { '@id': SCHEMA_IDS.organization },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${absoluteUrl(locale, '/search')}?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
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
      item: absoluteUrl(locale, t.path),
    })),
  };
}
