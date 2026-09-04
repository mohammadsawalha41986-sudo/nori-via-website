'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useState, useTransition } from 'react';
import clsx from 'clsx';
import type { Dictionary } from '@/lib/dictionary';

export type FilterOption = { value: string; label: string };

/**
 * Filtering lives in the URL, so the server does the querying, results are
 * shareable and deep-linkable, and the list scales past a hard-coded grid.
 */
export function LibraryFilters({
  dict,
  types,
  categories,
  activeType,
  activeCategory,
  activeSort,
  query,
}: {
  dict: Dictionary;
  types: FilterOption[];
  categories: FilterOption[];
  activeType: string;
  activeCategory: string;
  activeSort: string;
  query: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();
  const [term, setTerm] = useState(query);

  useEffect(() => setTerm(query), [query]);

  function apply(changes: Record<string, string>) {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(changes)) {
      if (value) params.set(key, value);
      else params.delete(key);
    }
    params.delete('page');
    startTransition(() => router.replace(`${pathname}?${params.toString()}`, { scroll: false }));
  }

  // Debounced so typing does not fire a request per keystroke.
  useEffect(() => {
    if (term === query) return;
    const timer = setTimeout(() => apply({ q: term.trim() }), 350);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [term]);

  const hasFilters = Boolean(query || activeType || activeCategory || (activeSort && activeSort !== 'newest'));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <label className="relative min-w-[16rem] flex-1">
          <span className="sr-only">{dict.library.searchPlaceholder}</span>
          <input
            type="search"
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            placeholder={dict.library.searchPlaceholder}
            className="w-full rounded-input border border-ink-900/15 bg-white px-5 py-3.5 text-[0.9375rem] text-ink-900 outline-none transition-colors placeholder:text-ink-300 focus:border-brand"
          />
        </label>

        {categories.length > 0 && (
          <label className="min-w-[12rem]">
            <span className="sr-only">{dict.common.category}</span>
            <select
              value={activeCategory}
              onChange={(e) => apply({ category: e.target.value })}
              className="w-full rounded-input border border-ink-900/15 bg-white px-4 py-3.5 text-[0.9375rem] text-ink-900 outline-none focus:border-brand"
            >
              <option value="">{dict.library.allCategories}</option>
              {categories.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </label>
        )}

        <label className="min-w-[11rem]">
          <span className="sr-only">{dict.library.sort}</span>
          <select
            value={activeSort}
            onChange={(e) => apply({ sort: e.target.value === 'newest' ? '' : e.target.value })}
            className="w-full rounded-input border border-ink-900/15 bg-white px-4 py-3.5 text-[0.9375rem] text-ink-900 outline-none focus:border-brand"
          >
            <option value="newest">{dict.library.sortNewest}</option>
            <option value="popular">{dict.library.sortPopular}</option>
            <option value="az">{dict.library.sortAZ}</option>
          </select>
        </label>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => apply({ type: '' })}
          aria-pressed={!activeType}
          className={clsx(
            'rounded-btn border px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] transition-colors duration-300',
            !activeType ? 'border-ink-900 bg-ink-900 text-white' : 'border-ink-900/15 text-ink-500 hover:border-ink-900',
          )}
        >
          {dict.library.allTypes}
        </button>

        {types.map((t) => (
          <button
            key={t.value}
            type="button"
            onClick={() => apply({ type: t.value })}
            aria-pressed={activeType === t.value}
            className={clsx(
              'rounded-btn border px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] transition-colors duration-300',
              activeType === t.value
                ? 'border-ink-900 bg-ink-900 text-white'
                : 'border-ink-900/15 text-ink-500 hover:border-ink-900',
            )}
          >
            {t.label}
          </button>
        ))}

        {hasFilters && (
          <button
            type="button"
            onClick={() => apply({ q: '', type: '', category: '', sort: '' })}
            className="ms-1 text-xs font-semibold text-brand underline underline-offset-4"
          >
            {dict.library.reset}
          </button>
        )}
      </div>
    </div>
  );
}
