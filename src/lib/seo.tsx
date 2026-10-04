import { summarise } from './seo-text';
import { sectionHero, SECTION_HERO_IMAGES, type SectionKey } from './section-images';
import type { Metadata } from 'next';
import { env } from './env';
import { pick, defaultLocale, type Locale } from './i18n';
import { BRAND, BRAND_DESCRIPTION, BRAND_LOGO, BRAND_TOPICS, SCHEMA_IDS, stripBrandSuffix, withBrand } from './brand';

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
      'en-SA': absoluteUrl('en', path),
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
  const storedTitle = row && pick(row, 'seoTitle', locale);
  const localTitle = locale === 'ar' && storedTitle && !/[\u0600-\u06ff]/.test(storedTitle) ? '' : storedTitle;
  const title = stripBrandSuffix(localTitle || fallbackTitle);
  const description =
    (row && pick(row, 'seoDescription', locale)) || summarise(fallbackDescription || BRAND_DESCRIPTION[locale]);
  const url = absoluteUrl(locale, path);
  const stored = typeof row?.canonical === 'string' ? row.canonical.trim() : '';
  // Canonicals remain on the official origin and in this language.
  let canonicalOverride: string | undefined;
  try {
    const candidate = new URL(stored);
    if (candidate.origin === env.siteUrl && (candidate.pathname === `/${locale}` || candidate.pathname.startsWith(`/${locale}/`))) {
      canonicalOverride = `${env.siteUrl}${candidate.pathname.replace(/\/+$/, '')}`;
    }
  } catch { /* An incomplete CMS override uses the page URL. */ }
  const section = path.split('/')[1] as SectionKey;
  const image = absoluteMediaUrl(row?.ogImage || fallbackImage ||
    (section in SECTION_HERO_IMAGES ? sectionHero(section) : BRAND_LOGO.path));

  // A layout title template does not apply to its own segment's page.
  const shareTitle = path === '/' ? withBrand(title, locale) : title;
  return {
    title: path === '/' ? { absolute: shareTitle } : title,
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
      title: shareTitle,
      description,
      // Stated on every page, so the brand a crawler reads never depends on
      // which page it happened to land on first.
      siteName: BRAND.name,
      images: image ? [{ url: image }] : undefined,
      publishedTime,
      locale: locale === 'ar' ? 'ar_SA' : 'en_SA',
    },
    twitter: { card: 'summary_large_image', title: shareTitle, description, images: image ? [image] : undefined },
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
  address,
}: {
  locale: Locale;
  description?: string;
  email?: string | null;
  telephone?: string | null;
  sameAs?: string[];
  logoUrl?: string | null;
  address?: string | null;
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
      url: absoluteMediaUrl(logoUrl || BRAND_LOGO.path),
    },
    image: `${env.siteUrl}${BRAND_LOGO.path}`,
    address: address || undefined,
    email: email || undefined,
    telephone: telephone || undefined,
    areaServed: { '@type': 'Country', name: BRAND.areaServed },
    knowsAbout: BRAND_TOPICS[locale],
    sameAs: sameAs?.filter((url) => /^https:\/\//i.test(url)),
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
    inLanguage: locale === 'ar' ? 'ar-SA' : 'en-SA',
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

/** A page node tied to the same stable publisher and site entities. */
export function webpageSchema(locale: Locale, path: string, name: string) {
  return {
    '@context': 'https://schema.org', '@type': 'WebPage',
    '@id': `${absoluteUrl(locale, path)}#webpage`, url: absoluteUrl(locale, path), name,
    inLanguage: locale === 'ar' ? 'ar-SA' : 'en-SA',
    isPartOf: { '@id': SCHEMA_IDS.website },
    publisher: { '@id': SCHEMA_IDS.organization },
  };
}
