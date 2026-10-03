import { cache } from 'react';
import { prisma } from './db';
import type { Locale } from './i18n';
export type MediaMetadata = {
  title?: string;
  category?: string;
  usage?: string;
  focalX?: number;
  focalY?: number;
};
export const getMediaCatalog = cache(async () => {
  const [rows, page] = await Promise.all([
    prisma.media.findMany({ where: { kind: 'IMAGE' } }),
    prisma.page.findUnique({ where: { key: 'media-metadata' } }),
  ]);
  const metadata = (
    page?.content && typeof page.content === 'object' && !Array.isArray(page.content)
      ? page.content
      : {}
  ) as Record<string, MediaMetadata>;
  return { rows: new Map(rows.map((m) => [m.url, m])), metadata };
});
export async function publicImage(url: string, locale: Locale, fallbackAlt: string) {
  const { rows, metadata } = await getMediaCatalog();
  const row = rows.get(url);
  const meta = metadata[url];
  const x = Number.isFinite(meta?.focalX) ? meta!.focalX! : 50;
  const y = Number.isFinite(meta?.focalY) ? meta!.focalY! : 50;
  return {
    alt: (locale === 'ar' ? row?.altAr || row?.altEn : row?.altEn || row?.altAr) || fallbackAlt,
    title: meta?.title,
    objectPosition: `${Math.min(100, Math.max(0, x))}% ${Math.min(100, Math.max(0, y))}%`,
  };
}
