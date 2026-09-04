import { cache } from 'react';
import type { ContentType } from '@prisma/client';
import { prisma } from './db';
import { pick, type Locale } from './i18n';

/**
 * Universal content relationships.
 *
 * An editor attaches related content on one side only; links are read in both
 * directions, so an article that references a tool automatically appears on
 * that tool's page. Because the edge is polymorphic it carries no foreign key,
 * so `deleteContentLinksFor` must run whenever an entity is deleted.
 */

export type ContentRef = { type: ContentType; id: string };

export type RelatedItem = {
  type: ContentType;
  id: string;
  title: string;
  summary: string;
  href: string;
  image: string | null;
  badge: string;
};

export const CONTENT_TYPES = ['INSIGHT', 'RESOURCE', 'TOOL', 'SERVICE', 'CASE_STUDY', 'PROJECT', 'PAGE'] as const;

const BADGES: Record<ContentType, { en: string; ar: string }> = {
  INSIGHT: { en: 'Article', ar: 'مقال' },
  RESOURCE: { en: 'Resource', ar: 'مورد' },
  TOOL: { en: 'Tool', ar: 'أداة' },
  SERVICE: { en: 'Solution', ar: 'خدمة' },
  CASE_STUDY: { en: 'Case study', ar: 'دراسة حالة' },
  PROJECT: { en: 'Work', ar: 'عمل' },
  PAGE: { en: 'Page', ar: 'صفحة' },
};

/**
 * Editable pages are addressed by their key rather than a slug column, and a
 * couple of them live at a path that does not match the key.
 */
const PAGE_PATHS: Record<string, string> = {
  home: '',
  about: '/about',
  contact: '/contact',
  'start-here': '/start-here',
  'start-a-project': '/start-a-project',
  'restaurant-growth': '/restaurant-growth',
  insights: '/insights',
  library: '/library',
  tools: '/tools',
  work: '/work',
  services: '/services',
  privacy: '/privacy',
  terms: '/terms',
};

export function pagePath(key: string) {
  return PAGE_PATHS[key];
}

export function badgeFor(type: ContentType, locale: Locale) {
  return locale === 'ar' ? BADGES[type].ar : BADGES[type].en;
}

/** `"TOOL:abc123"` is the wire format used by the admin relation picker. */
export function parseRef(value: string): ContentRef | null {
  const [type, id] = value.split(':');
  if (!type || !id) return null;
  if (!(CONTENT_TYPES as readonly string[]).includes(type)) return null;
  return { type: type as ContentType, id };
}

export function serialiseRef(ref: ContentRef) {
  return `${ref.type}:${ref.id}`;
}

/**
 * Replaces the outgoing links of one entity. Incoming links authored on the
 * other entity are deliberately left alone — each side owns what it attached.
 */
export async function setContentLinks(fromType: ContentType, fromId: string, refs: ContentRef[]) {
  const unique = new Map<string, ContentRef>();
  for (const ref of refs) {
    if (ref.type === fromType && ref.id === fromId) continue;
    unique.set(serialiseRef(ref), ref);
  }

  await prisma.$transaction([
    prisma.contentLink.deleteMany({ where: { fromType, fromId } }),
    prisma.contentLink.createMany({
      data: [...unique.values()].map((ref, order) => ({
        fromType,
        fromId,
        toType: ref.type,
        toId: ref.id,
        order,
      })),
      skipDuplicates: true,
    }),
  ]);
}

export async function deleteContentLinksFor(type: ContentType, id: string) {
  await prisma.contentLink.deleteMany({
    where: { OR: [{ fromType: type, fromId: id }, { toType: type, toId: id }] },
  });
}

export const getOutgoingRefs = cache(async (fromType: ContentType, fromId: string): Promise<ContentRef[]> => {
  const rows = await prisma.contentLink.findMany({
    where: { fromType, fromId },
    orderBy: { order: 'asc' },
    select: { toType: true, toId: true },
  });
  return rows.map((r) => ({ type: r.toType, id: r.toId }));
});

/** Both directions, de-duplicated, in authoring order. */
async function neighbourRefs(type: ContentType, id: string): Promise<ContentRef[]> {
  const [outgoing, incoming] = await Promise.all([
    prisma.contentLink.findMany({
      where: { fromType: type, fromId: id },
      orderBy: { order: 'asc' },
      select: { toType: true, toId: true },
    }),
    prisma.contentLink.findMany({
      where: { toType: type, toId: id },
      orderBy: { order: 'asc' },
      select: { fromType: true, fromId: true },
    }),
  ]);

  const seen = new Map<string, ContentRef>();
  for (const r of outgoing) seen.set(`${r.toType}:${r.toId}`, { type: r.toType, id: r.toId });
  for (const r of incoming) seen.set(`${r.fromType}:${r.fromId}`, { type: r.fromType, id: r.fromId });
  return [...seen.values()];
}

/**
 * Loads the published entities behind a set of refs, one query per content
 * type rather than one per ref.
 */
export async function loadRefs(refs: ContentRef[], locale: Locale): Promise<RelatedItem[]> {
  if (refs.length === 0) return [];

  const byType = new Map<ContentType, string[]>();
  for (const ref of refs) byType.set(ref.type, [...(byType.get(ref.type) ?? []), ref.id]);

  const published = { status: 'PUBLISHED' as const };
  const items = new Map<string, RelatedItem>();

  const add = (type: ContentType, id: string, item: Omit<RelatedItem, 'type' | 'id' | 'badge'>) =>
    items.set(`${type}:${id}`, { type, id, badge: badgeFor(type, locale), ...item });

  await Promise.all([
    (async () => {
      const ids = byType.get('INSIGHT');
      if (!ids) return;
      for (const row of await prisma.insight.findMany({ where: { id: { in: ids }, ...published } })) {
        add('INSIGHT', row.id, {
          title: pick(row, 'title', locale),
          summary: pick(row, 'excerpt', locale),
          href: `/${locale}/insights/${row.slug}`,
          image: row.coverImage,
        });
      }
    })(),
    (async () => {
      const ids = byType.get('RESOURCE');
      if (!ids) return;
      for (const row of await prisma.resource.findMany({ where: { id: { in: ids }, ...published } })) {
        add('RESOURCE', row.id, {
          title: pick(row, 'title', locale),
          summary: pick(row, 'summary', locale),
          href: `/${locale}/library/${row.slug}`,
          image: row.thumbnail,
        });
      }
    })(),
    (async () => {
      const ids = byType.get('TOOL');
      if (!ids) return;
      for (const row of await prisma.tool.findMany({ where: { id: { in: ids }, ...published } })) {
        add('TOOL', row.id, {
          title: pick(row, 'name', locale),
          summary: pick(row, 'summary', locale),
          href: `/${locale}/tools/${row.slug}`,
          image: row.thumbnail,
        });
      }
    })(),
    (async () => {
      const ids = byType.get('SERVICE');
      if (!ids) return;
      for (const row of await prisma.service.findMany({ where: { id: { in: ids }, ...published } })) {
        add('SERVICE', row.id, {
          title: pick(row, 'name', locale),
          summary: pick(row, 'summary', locale),
          href: `/${locale}/services/${row.slug}`,
          image: row.featuredImage,
        });
      }
    })(),
    (async () => {
      const ids = byType.get('PROJECT');
      if (!ids) return;
      for (const row of await prisma.project.findMany({ where: { id: { in: ids }, ...published } })) {
        add('PROJECT', row.id, {
          title: pick(row, 'title', locale),
          summary: pick(row, 'description', locale).split('\n')[0] ?? '',
          href: `/${locale}/work/${row.slug}`,
          image: row.heroMediaUrl,
        });
      }
    })(),
    (async () => {
      const ids = byType.get('PAGE');
      if (!ids) return;
      for (const row of await prisma.page.findMany({ where: { id: { in: ids } } })) {
        // A page with no public route of its own is not a destination.
        const path = pagePath(row.key);
        if (path === undefined) continue;
        add('PAGE', row.id, {
          title: pick(row, 'title', locale) || row.key,
          summary: pick(row, 'body', locale).split('\n')[0] ?? '',
          href: `/${locale}${path}`,
          image: row.ogImage,
        });
      }
    })(),
    (async () => {
      const ids = byType.get('CASE_STUDY');
      if (!ids) return;
      const rows = await prisma.caseStudy.findMany({
        where: { id: { in: ids }, ...published },
        include: { project: { select: { slug: true, status: true } } },
      });
      for (const row of rows) {
        // Case studies are read at their project's URL; one without a published
        // project has nowhere to link to, so it is skipped rather than 404ing.
        if (row.project?.status !== 'PUBLISHED') continue;
        add('CASE_STUDY', row.id, {
          title: pick(row, 'title', locale),
          summary: pick(row, 'outcome', locale),
          href: `/${locale}/work/${row.project.slug}`,
          image: row.heroMediaUrl,
        });
      }
    })(),
  ]);

  return refs.map((ref) => items.get(serialiseRef(ref))).filter((i): i is RelatedItem => Boolean(i));
}

/** Everything published that links to or from this entity, ready to render. */
export async function getRelatedContent(type: ContentType, id: string, locale: Locale): Promise<RelatedItem[]> {
  return loadRefs(await neighbourRefs(type, id), locale);
}

/** Groups related items by type for sectioned rendering. */
export function groupRelated(items: RelatedItem[]) {
  const groups = new Map<ContentType, RelatedItem[]>();
  for (const item of items) groups.set(item.type, [...(groups.get(item.type) ?? []), item]);
  return groups;
}
