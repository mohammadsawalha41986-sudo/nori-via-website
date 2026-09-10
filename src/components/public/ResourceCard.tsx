import Link from 'next/link';
import Image from 'next/image';
import type { ResourceType } from '@prisma/client';
import { Reveal } from '../ui/Reveal';
import { documentLabel, formatBytes } from '@/lib/storage';
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
}: {
  resource: ResourceCardData;
  locale: Locale;
  dict: Dictionary;
  index?: number;
}) {
  const format = resource.external ? dict.library.openResource : documentLabel(resource.fileMime);
  const size = formatBytes(resource.fileSize);

  return (
    <Reveal as="li" delay={Math.min(index, 8) * 50} y={14} className="h-full">
      <Link
        href={`/${locale}/library/${resource.slug}`}
        className="group flex h-full flex-col overflow-hidden rounded-card border border-ink-900/10 bg-white transition-colors duration-300 hover:border-brand"
      >
        <span className="relative block aspect-[16/10] overflow-hidden bg-ink-50">
          {resource.thumbnail ? (
            <Image
              src={resource.thumbnail}
              alt=""
              fill
              sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
              className="object-cover transition-transform duration-700 ease-noriva group-hover:scale-105"
            />
          ) : (
            <span className="flex h-full w-full items-center justify-center">
              <span className="font-display text-3xl uppercase text-ink-200">
                {format}
              </span>
            </span>
          )}
          <span className="absolute top-3 flex items-center gap-2 start-3">
            <span className="rounded-btn bg-ink-900/85 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-white">
              {dict.library.types[resource.type]}
            </span>
            <span className="rounded-btn bg-white/90 px-3 py-1 text-xs font-bold tracking-[0.08em] text-ink-700">
              EN / العربية
            </span>
          </span>
        </span>

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
              {size && !resource.external && <span>{size}</span>}
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
