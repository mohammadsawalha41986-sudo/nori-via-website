import type { MetadataRoute } from 'next';
import { env } from '@/lib/env';

/**
 * Crawl rules.
 *
 * Everything a visitor can see is crawlable, including `/media`, which serves
 * the CMS's uploaded images: blocking it would stop those images being indexed
 * and stop Google rendering the pages that depend on them. Only surfaces with
 * nothing to index are excluded.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          // The CMS and every API surface stay out of the index.
          '/admin',
          '/admin/',
          '/api/',
          // On-site search results: already `noindex`, listed here so they do
          // not consume crawl budget in the first place.
          '/ar/search',
          '/en/search',
          // Draft previews are reachable by link for editors only.
          '/*?preview=1',
        ],
      },
    ],
    sitemap: `${env.siteUrl}/sitemap.xml`,
    host: env.siteUrl,
  };
}
