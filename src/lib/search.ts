import { prisma } from './db';
import { pick, type Locale } from './i18n';
import { badgeFor, type RelatedItem } from './relations';

/**
 * Global search across every published content type.
 *
 * Each type is queried with a case-insensitive `contains` over both language
 * columns — real queries against the database rather than a filtered
 * in-memory list. Results are capped per type so one content type cannot
 * crowd out the rest.
 */
const PER_TYPE = 8;

export async function searchContent(query: string, locale: Locale): Promise<RelatedItem[]> {
  const q = query.trim();
  if (q.length < 2) return [];

  const match = { contains: q, mode: 'insensitive' as const };
  const published = { status: 'PUBLISHED' as const };

  const [insights, resources, tools, services, projects, caseStudies] = await Promise.all([
    prisma.insight.findMany({
      where: {
        ...published,
        OR: [
          { titleEn: match }, { titleAr: match },
          { excerptEn: match }, { excerptAr: match },
          { contentEn: match }, { contentAr: match },
        ],
      },
      orderBy: { publishedAt: 'desc' },
      take: PER_TYPE,
    }),
    prisma.resource.findMany({
      where: {
        ...published,
        OR: [
          { titleEn: match }, { titleAr: match },
          { summaryEn: match }, { summaryAr: match },
          { descriptionEn: match }, { descriptionAr: match },
        ],
      },
      orderBy: { publishedAt: 'desc' },
      take: PER_TYPE,
    }),
    prisma.tool.findMany({
      where: {
        ...published,
        OR: [
          { nameEn: match }, { nameAr: match },
          { summaryEn: match }, { summaryAr: match },
          { descriptionEn: match }, { descriptionAr: match },
        ],
      },
      orderBy: { order: 'asc' },
      take: PER_TYPE,
    }),
    prisma.service.findMany({
      where: {
        ...published,
        OR: [
          { nameEn: match }, { nameAr: match },
          { summaryEn: match }, { summaryAr: match },
          { whatWeDoEn: match }, { whatWeDoAr: match },
        ],
      },
      orderBy: { order: 'asc' },
      take: PER_TYPE,
    }),
    prisma.project.findMany({
      where: {
        ...published,
        OR: [
          { titleEn: match }, { titleAr: match },
          { descriptionEn: match }, { descriptionAr: match },
          { client: match },
        ],
      },
      orderBy: { order: 'asc' },
      take: PER_TYPE,
    }),
    prisma.caseStudy.findMany({
      where: {
        ...published,
        OR: [
          { titleEn: match }, { titleAr: match },
          { challengeEn: match }, { challengeAr: match },
          { outcomeEn: match }, { outcomeAr: match },
        ],
      },
      include: { project: { select: { slug: true, status: true } } },
      orderBy: { order: 'asc' },
      take: PER_TYPE,
    }),
  ]);

  const results: RelatedItem[] = [];
  const add = (item: Omit<RelatedItem, 'badge'>) =>
    results.push({ ...item, badge: badgeFor(item.type, locale) });

  for (const row of insights) {
    add({
      type: 'INSIGHT', id: row.id,
      title: pick(row, 'title', locale),
      summary: pick(row, 'excerpt', locale),
      href: `/${locale}/insights/${row.slug}`,
      image: row.coverImage,
    });
  }
  for (const row of resources) {
    add({
      type: 'RESOURCE', id: row.id,
      title: pick(row, 'title', locale),
      summary: pick(row, 'summary', locale),
      href: `/${locale}/library/${row.slug}`,
      image: row.thumbnail,
    });
  }
  for (const row of tools) {
    add({
      type: 'TOOL', id: row.id,
      title: pick(row, 'name', locale),
      summary: pick(row, 'summary', locale),
      href: `/${locale}/tools/${row.slug}`,
      image: row.thumbnail,
    });
  }
  for (const row of services) {
    add({
      type: 'SERVICE', id: row.id,
      title: pick(row, 'name', locale),
      summary: pick(row, 'summary', locale),
      href: `/${locale}/services/${row.slug}`,
      image: row.featuredImage,
    });
  }
  for (const row of projects) {
    add({
      type: 'PROJECT', id: row.id,
      title: pick(row, 'title', locale),
      summary: pick(row, 'description', locale).split('\n')[0] ?? '',
      href: `/${locale}/work/${row.slug}`,
      image: row.heroMediaUrl,
    });
  }
  for (const row of caseStudies) {
    // Case studies live at their project's URL.
    if (row.project?.status !== 'PUBLISHED') continue;
    add({
      type: 'CASE_STUDY', id: row.id,
      title: pick(row, 'title', locale),
      summary: pick(row, 'outcome', locale),
      href: `/${locale}/work/${row.project.slug}`,
      image: row.heroMediaUrl,
    });
  }

  return results;
}
