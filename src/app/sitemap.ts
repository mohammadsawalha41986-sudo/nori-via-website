import type { MetadataRoute } from 'next';
import { env } from '@/lib/env';
import { locales, defaultLocale } from '@/lib/i18n';
import {
  getPublishedServices,
  getPublishedProjects,
  getPublishedInsights,
  getPublishedTools,
} from '@/lib/content';
import { prisma } from '@/lib/db';
import { publishedNow } from '@/lib/content';

/**
 * Built from CMS content, so it must not be generated during `next build`.
 * It is produced on request and cached for an hour; publishing content calls
 * `revalidatePath('/sitemap.xml')`, so it refreshes immediately on a change.
 */
export const dynamic = 'force-dynamic';
export const revalidate = 3600;

const STATIC_PATHS = [
  '',
  '/start-here',
  '/about',
  '/services',
  '/work',
  '/restaurant-growth',
  '/insights',
  '/library',
  '/tools',
  '/contact',
  '/start-a-project',
  '/privacy',
  '/terms',
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [services, projects, insights, tools, resources] = await Promise.all([
    getPublishedServices(),
    getPublishedProjects(),
    getPublishedInsights(),
    getPublishedTools(),
    prisma.resource.findMany({
      where: { ...publishedNow(), noindex: false },
      select: { slug: true, updatedAt: true },
    }),
  ]);

  const entries: MetadataRoute.Sitemap = [];

  const push = (path: string, lastModified?: Date, priority = 0.6) => {
    for (const locale of locales) {
      entries.push({
        url: `${env.siteUrl}/${locale}${path}`,
        lastModified,
        priority,
        changeFrequency: path === '' ? 'weekly' : 'monthly',
        alternates: {
          languages: {
            ...Object.fromEntries(locales.map((l) => [l, `${env.siteUrl}/${l}${path}`])),
            'ar-SA': `${env.siteUrl}/ar${path}`,
            // Matches the `x-default` the pages themselves declare; a sitemap
            // that disagrees with the page is a signal Google discards.
            'x-default': `${env.siteUrl}/${defaultLocale}${path}`,
          },
        },
      });
    }
  };

  /*
    Rows marked `noindex` in Admin are skipped.

    Listing a URL in the sitemap asks Google to index it while the page itself
    says not to — a direct contradiction that costs crawl budget and shows up
    in Search Console as "excluded by noindex". The sitemap therefore carries
    only what the site is actually willing to have indexed.
  */
  const indexable = <T extends { noindex: boolean }>(rows: T[]) => rows.filter((row) => !row.noindex);

  for (const path of STATIC_PATHS) push(path, undefined, path === '' ? 1 : 0.7);
  for (const s of indexable(services)) push(`/services/${s.slug}`, s.updatedAt, 0.8);
  for (const p of indexable(projects)) push(`/work/${p.slug}`, p.updatedAt, 0.8);
  for (const a of indexable(insights)) push(`/insights/${a.slug}`, a.updatedAt, 0.6);
  for (const t of indexable(tools)) push(`/tools/${t.slug}`, t.updatedAt, 0.7);
  for (const r of resources) push(`/library/${r.slug}`, r.updatedAt, 0.7);

  return entries;
}
