import type { MetadataRoute } from 'next';
import { env } from '@/lib/env';
import { locales } from '@/lib/i18n';
import {
  getPublishedServices,
  getPublishedProjects,
  getPublishedInsights,
  getPublishedTools,
} from '@/lib/content';
import { prisma } from '@/lib/db';

/**
 * Built from CMS content, so it must not be generated during `next build`.
 * It is produced on request and cached for an hour; publishing content calls
 * `revalidatePath('/sitemap.xml')`, so it refreshes immediately on a change.
 */
export const dynamic = 'force-dynamic';
export const revalidate = 3600;

const STATIC_PATHS = [
  '',
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
      where: { status: 'PUBLISHED', noindex: false },
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
          languages: Object.fromEntries(locales.map((l) => [l, `${env.siteUrl}/${l}${path}`])),
        },
      });
    }
  };

  for (const path of STATIC_PATHS) push(path, undefined, path === '' ? 1 : 0.7);
  for (const s of services) push(`/services/${s.slug}`, s.updatedAt, 0.8);
  for (const p of projects) push(`/work/${p.slug}`, p.updatedAt, 0.8);
  for (const a of insights) push(`/insights/${a.slug}`, a.updatedAt, 0.6);
  for (const t of tools) push(`/tools/${t.slug}`, t.updatedAt, 0.7);
  for (const r of resources) push(`/library/${r.slug}`, r.updatedAt, 0.7);

  return entries;
}
