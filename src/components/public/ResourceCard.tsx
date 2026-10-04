import Link from 'next/link';
import { isShippedImage } from '@/lib/curated-media';
import Image from 'next/image';
import { ResourceCover } from './ResourceCover';
import type { ResourceType } from '@prisma/client';
import { Reveal } from '../ui/Reveal';
import { resourcePurpose, resourcePurposeLabel } from '@/lib/service-discovery';
import type { Locale } from '@/lib/i18n';
import type { Dictionary } from '@/lib/dictionary';

export type ResourceCardData = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  type: ResourceType;
  category: string;
  thumbnail: string | null;
  fileMime: string;
  fileSize: number;
  external: boolean;
};

export function ResourceCard({
  resource,
  locale,
  dict,
  index = 0,
  as = 'li',
}: {
  resource: ResourceCardData;
  locale: Locale;
  dict: Dictionary;
  index?: number;
  as?: 'li' | 'article';
}) {
  const format = resourcePurposeLabel(resourcePurpose(resource.slug, resource.type), locale);

  return (
    <Reveal as={as} delay={Math.min(index, 8) * 50} y={14} className="h-full">
      <Link
        href={`/${locale}/library/${resource.slug}`}
        className="group flex h-full flex-col overflow-hidden rounded-card border border-ink-900/10 bg-white transition-colors duration-300 hover:border-brand"
      >
        <div className="relative min-h-64 overflow-hidden bg-ink-50">
          {resource.thumbnail && !isShippedImage(resource.thumbnail) ? <Image src={resource.thumbnail} alt={resource.title} fill sizes="(min-width:1024px) 33vw, 100vw" className="object-cover" /> : <ResourceCover title={resource.title} slug={resource.slug} type={resource.type} locale={locale} />}
        </div>

        <span className="flex flex-1 flex-col p-6">
          {resource.category && (
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-brand">{resource.category}</span>
          )}
          <span className="mt-2 font-display text-lg font-display-soft uppercase text-ink-900 transition-colors group-hover:text-brand">
            {resource.title}
          </span>
          {resource.summary && (
            <span className="mt-2.5 line-clamp-3 text-sm leading-relaxed text-ink-400">{resource.summary}</span>
          )}
          <span className="mt-5 flex items-center justify-between gap-3 pt-1 text-xs text-ink-300">
            <span className="flex items-center gap-3">
              <span className="font-semibold text-ink-500">{format}</span>
            </span>
            <span className="font-semibold text-brand">
              {dict.library.openResource} <span aria-hidden>→</span>
            </span>
          </span>
        </span>
      </Link>
    </Reveal>
  );
}
