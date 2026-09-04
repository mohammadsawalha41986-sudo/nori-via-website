import { cache } from 'react';
import { prisma } from './db';

/** Defaults used the first time the site boots, before anything is edited in Admin. */
const SETTINGS_DEFAULTS = {
  companyNameEn: 'Noriva',
  companyNameAr: 'نوريفا',
  taglineEn: 'Restaurant · Creative · Growth',
  taglineAr: 'مطاعم · إبداع · نمو',
};

export const getSettings = cache(async () => {
  const existing = await prisma.siteSettings.findUnique({ where: { id: 'singleton' } });
  if (existing) return existing;
  return prisma.siteSettings.create({ data: { id: 'singleton', ...SETTINGS_DEFAULTS } });
});

export const getHomepage = cache(async () => {
  const existing = await prisma.homepageContent.findUnique({ where: { id: 'singleton' } });
  if (existing) return existing;
  return prisma.homepageContent.create({ data: { id: 'singleton' } });
});

export const getNavigation = cache(async (location = 'header') =>
  prisma.navigationItem.findMany({ where: { location, visible: true }, orderBy: { order: 'asc' } }),
);

export const getSystemStages = cache(async () =>
  prisma.systemStage.findMany({ where: { visible: true }, orderBy: { order: 'asc' } }),
);

export const getStatistics = cache(async () =>
  prisma.statistic.findMany({ where: { visible: true }, orderBy: { order: 'asc' } }),
);

export const getTestimonials = cache(async () =>
  prisma.testimonial.findMany({ where: { published: true }, orderBy: { order: 'asc' } }),
);

export const getPublishedServices = cache(async () =>
  prisma.service.findMany({
    where: { status: 'PUBLISHED' },
    orderBy: [{ order: 'asc' }, { nameEn: 'asc' }],
    include: { category: true },
  }),
);

export const getServiceCategories = cache(async () =>
  prisma.serviceCategory.findMany({ where: { visible: true }, orderBy: { order: 'asc' } }),
);

export const getServiceBySlug = cache(async (slug: string) =>
  prisma.service.findFirst({
    where: { slug, status: 'PUBLISHED' },
    include: {
      category: true,
      projects: { include: { project: true } },
    },
  }),
);

export const getPublishedProjects = cache(async () =>
  prisma.project.findMany({
    where: { status: 'PUBLISHED' },
    orderBy: [{ featured: 'desc' }, { order: 'asc' }, { createdAt: 'desc' }],
    include: { category: true, services: { include: { service: true } }, caseStudy: { select: { slug: true, status: true } } },
  }),
);

export const getFeaturedProjects = cache(async (take = 5) => {
  const all = await getPublishedProjects();
  return all.slice(0, take);
});

export const getProjectBySlug = cache(async (slug: string) =>
  prisma.project.findFirst({
    where: { slug, status: 'PUBLISHED' },
    include: {
      category: true,
      services: { include: { service: true } },
      caseStudy: true,
    },
  }),
);

export const getWorkCategories = cache(async () =>
  prisma.workCategory.findMany({ where: { visible: true }, orderBy: { order: 'asc' } }),
);

export const getPublishedCaseStudies = cache(async () =>
  prisma.caseStudy.findMany({
    where: { status: 'PUBLISHED' },
    orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    include: { project: true, services: { include: { service: true } } },
  }),
);

export const getCaseStudyBySlug = cache(async (slug: string) =>
  prisma.caseStudy.findFirst({
    where: { slug, status: 'PUBLISHED' },
    include: { project: { include: { category: true } }, services: { include: { service: true } } },
  }),
);

/**
 * A published row dated in the future is scheduled, not live: the public
 * queries exclude it until its publication date arrives. `revalidate` on the
 * public pages is what brings it in without a deployment.
 */
export const publishedNow = () => ({
  status: 'PUBLISHED' as const,
  // Wrapped in AND, not a bare OR: callers add their own OR for text search,
  // and a second `OR` key would silently replace this one.
  AND: [{ OR: [{ publishedAt: null }, { publishedAt: { lte: new Date() } }] }],
});

export const getPublishedInsights = cache(async () =>
  prisma.insight.findMany({
    where: publishedNow(),
    orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
    include: { category: true },
  }),
);

export const getInsightBySlug = cache(async (slug: string, includeDrafts = false) =>
  prisma.insight.findFirst({
    where: { slug, ...(includeDrafts ? {} : publishedNow()) },
    include: { category: true },
  }),
);

export const getInsightCategories = cache(async () =>
  prisma.insightCategory.findMany({ where: { visible: true }, orderBy: { order: 'asc' } }),
);

export const getPage = cache(async (key: string) => prisma.page.findUnique({ where: { key } }));

/** JSON columns are `unknown` at the type level; these keep call sites tidy. */
export function asStringList(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((v): v is string => typeof v === 'string') : [];
}

export function asObjectList<T = Record<string, unknown>>(value: unknown): T[] {
  return Array.isArray(value) ? (value.filter((v) => v && typeof v === 'object') as T[]) : [];
}

export type MetricItem = { value?: string; labelEn?: string; labelAr?: string; label?: string };
export type FaqItem = { questionEn?: string; questionAr?: string; answerEn?: string; answerAr?: string };
export type ProcessItem = { titleEn?: string; titleAr?: string; bodyEn?: string; bodyAr?: string };
export type GalleryItem = { url?: string; altEn?: string; altAr?: string };
export type DownloadItem = { url?: string; labelEn?: string; labelAr?: string };

// ------------------------------------------------- contact & social channels

export const getSocialLinks = cache(async () =>
  prisma.socialLink.findMany({ where: { enabled: true }, orderBy: { order: 'asc' } }),
);

export const getFloatingActions = cache(async () =>
  prisma.floatingAction.findMany({ where: { enabled: true }, orderBy: { order: 'asc' } }),
);

// --------------------------------------------------------------- library

export const getResourceCategories = cache(async () =>
  prisma.resourceCategory.findMany({ where: { visible: true }, orderBy: { order: 'asc' } }),
);

export const getFeaturedResources = cache(async (take = 3) =>
  prisma.resource.findMany({
    where: publishedNow(),
    orderBy: [{ featured: 'desc' }, { order: 'asc' }, { publishedAt: 'desc' }],
    include: { category: true },
    take,
  }),
);

export const getResourceBySlug = cache(async (slug: string, includeDrafts = false) =>
  prisma.resource.findFirst({
    where: { slug, ...(includeDrafts ? {} : publishedNow()) },
    include: { category: true },
  }),
);

// ----------------------------------------------------------------- tools

export const getPublishedTools = cache(async () =>
  prisma.tool.findMany({
    where: { status: 'PUBLISHED' },
    orderBy: [{ featured: 'desc' }, { order: 'asc' }, { nameEn: 'asc' }],
  }),
);

export const getFeaturedTools = cache(async (take = 3) => (await getPublishedTools()).slice(0, take));

export const getToolBySlug = cache(async (slug: string, includeDrafts = false) =>
  prisma.tool.findFirst({ where: { slug, ...(includeDrafts ? {} : { status: 'PUBLISHED' as const }) } }),
);

export type LocalisedBullet = { titleEn?: string; titleAr?: string; bodyEn?: string; bodyAr?: string };
