'use client';

import { useMemo, useState } from 'react';
import clsx from 'clsx';
import { ProjectCard, type ProjectCardData } from './ProjectCard';
import { EmptyState } from './EmptyState';
import type { Locale } from '@/lib/i18n';

export type WorkFilter = { slug: string; label: string };

/**
 * Client-side category filtering — no navigation, no refetch, and the full set
 * is already in the payload so switching is instant.
 */
export function WorkGrid({
  projects,
  filters,
  locale,
  labels,
}: {
  projects: (ProjectCardData & { categorySlug: string | null })[];
  filters: WorkFilter[];
  locale: Locale;
  labels: { all: string; view: string; emptyTitle: string; emptyBody: string; start: string };
}) {
  const [active, setActive] = useState('all');

  const visible = useMemo(
    () => (active === 'all' ? projects : projects.filter((p) => p.categorySlug === active)),
    [projects, active],
  );

  const used = useMemo(() => {
    const set = new Set(projects.map((p) => p.categorySlug).filter(Boolean));
    return filters.filter((f) => set.has(f.slug));
  }, [projects, filters]);

  if (!projects.length) {
    return (
      <EmptyState
        title={labels.emptyTitle}
        body={labels.emptyBody}
        ctaHref={`/${locale}/start-a-project`}
        ctaLabel={labels.start}
      />
    );
  }

  return (
    <div>
      {used.length > 1 && (
        <div className="mb-12 flex flex-wrap gap-2" role="tablist" aria-label="Filter work">
          {[{ slug: 'all', label: labels.all }, ...used].map((f) => (
            <button
              key={f.slug}
              type="button"
              role="tab"
              aria-selected={active === f.slug}
              onClick={() => setActive(f.slug)}
              className={clsx(
                'rounded-full border px-5 py-2.5 text-sm font-medium transition-all duration-300 ease-noriva',
                active === f.slug
                  ? 'border-ink-900 bg-ink-900 text-white'
                  : 'border-ink-900/15 text-ink-500 hover:border-ink-900/40 hover:text-ink-900',
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      )}

      {visible.length === 0 ? (
        <EmptyState title={labels.emptyTitle} body={labels.emptyBody} />
      ) : (
        <div className="grid gap-x-6 gap-y-14 lg:grid-cols-12 lg:gap-y-20">
          {visible.map((p, i) => (
            <ProjectCard key={p.id} project={p} locale={locale} index={i} viewLabel={labels.view} />
          ))}
        </div>
      )}
    </div>
  );
}
