import Link from 'next/link';
import { JsonLd, breadcrumbs } from '@/lib/seo';
import { localePath, type Locale } from '@/lib/i18n';

export type Crumb = { name: string; path: string };

/**
 * The trail from the homepage down to the current page.
 *
 * Renders the visible trail and its `BreadcrumbList` from one array, so the
 * markup a visitor sees and the structured data a crawler reads can never
 * describe different paths. The final crumb is the current page and is not a
 * link, which is both the accessible pattern and the one Google expects.
 */
export function Breadcrumbs({ locale, trail }: { locale: Locale; trail: Crumb[] }) {
  const last = trail.length - 1;

  return (
    <>
      <JsonLd data={breadcrumbs(locale, trail)} />
      <nav aria-label="Breadcrumb" className="border-b border-ink-900/10 bg-bone">
        <ol className="shell flex flex-wrap items-center gap-x-2 gap-y-1 py-3.5 text-xs text-ink-400">
          {trail.map((crumb, i) => (
            <li key={crumb.path} className="flex items-center gap-2">
              {i > 0 && (
                <span aria-hidden className="text-ink-300 rtl:-scale-x-100">
                  ›
                </span>
              )}
              {i === last ? (
                <span aria-current="page" className="font-medium text-ink-600">
                  {crumb.name}
                </span>
              ) : (
                <Link href={localePath(locale, crumb.path)} className="transition-colors hover:text-brand">
                  {crumb.name}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}
