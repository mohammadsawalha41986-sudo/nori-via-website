import type { Locale } from '@/lib/i18n';
import { practiceFor, resourcePurpose, resourcePurposeLabel } from '@/lib/service-discovery';

/** Purpose-led cover. Document title and methodology, never unrelated stock art. */
export function ResourceCover({
  title,
  slug,
  type,
  locale,
}: {
  title: string;
  slug: string;
  type: string;
  locale: Locale;
}) {
  const p = practiceFor(slug);
  return (
    <div className={`resource-cover resource-cover-${p.id}`}>
      <div className="flex items-center justify-between gap-4 text-xs">
        <span>{locale === 'ar' ? 'نوريڤا / المعرفة' : 'NORIVA / KNOWLEDGE'}</span>
        <span>
          {type === 'ARTICLE'
            ? locale === 'ar'
              ? 'مقال'
              : 'Article'
            : resourcePurposeLabel(resourcePurpose(slug, type), locale)}
        </span>
      </div>
      <p className="my-auto max-w-md py-8 font-display text-2xl leading-snug">{title}</p>
      <div className="flex justify-between border-t border-white/25 pt-4 text-xs">
        <span>{locale === 'ar' ? p.ar : p.en}</span>
        <span aria-hidden>↗</span>
      </div>
    </div>
  );
}
