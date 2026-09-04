import Link from 'next/link';
import { Reveal } from '../ui/Reveal';

export type PathCard = { title: string; body: string; href: string; label: string };

/**
 * The "what do you need?" router used by Start Here and the solution-area
 * pages. Cards come from the page's CMS content, so the routes an editor
 * offers can change without a deployment.
 */
export function PathCards({ items }: { items: PathCard[] }) {
  if (items.length === 0) return null;

  return (
    <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item, i) => (
        <Reveal as="li" key={`${item.href}-${i}`} delay={Math.min(i, 8) * 55} y={14} className="h-full">
          <Link
            href={item.href}
            className="group flex h-full flex-col rounded-card border border-ink-900/10 bg-white p-8 transition-colors duration-300 hover:border-brand"
          >
            <span className="font-mono text-[0.6875rem] text-brand">{String(i + 1).padStart(2, '0')}</span>
            <span className="mt-4 font-display text-xl font-bold uppercase tracking-tight text-ink-900 transition-colors group-hover:text-brand">
              {item.title}
            </span>
            {item.body && <span className="mt-3 flex-1 text-[0.9375rem] leading-relaxed text-ink-400">{item.body}</span>}
            <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-ink-900">
              {item.label}
              <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1 rtl:rotate-180">
                →
              </span>
            </span>
          </Link>
        </Reveal>
      ))}
    </ul>
  );
}

type RawPath = {
  titleEn?: string; titleAr?: string;
  bodyEn?: string; bodyAr?: string;
  href?: string;
  labelEn?: string; labelAr?: string;
};

/**
 * Normalises CMS path entries for one locale. Only internal paths and absolute
 * URLs are accepted, so a mistyped link cannot produce a broken route.
 */
export function toPathCards(raw: unknown, locale: 'en' | 'ar', fallbackLabel: string): PathCard[] {
  if (!Array.isArray(raw)) return [];

  return raw
    .filter((item): item is RawPath => Boolean(item) && typeof item === 'object')
    .map((item) => {
      const href = (item.href ?? '').trim();
      const title = (locale === 'ar' ? item.titleAr || item.titleEn : item.titleEn || item.titleAr) ?? '';
      const body = (locale === 'ar' ? item.bodyAr || item.bodyEn : item.bodyEn || item.bodyAr) ?? '';
      const label = (locale === 'ar' ? item.labelAr || item.labelEn : item.labelEn || item.labelAr) || fallbackLabel;
      const resolved = href.startsWith('http') ? href : href.startsWith('/') ? `/${locale}${href}` : '';
      return { title, body, href: resolved, label };
    })
    .filter((item) => item.title && item.href);
}
