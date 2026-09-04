'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import clsx from 'clsx';
import { inputClass } from './ui';

/**
 * Search-and-status filter for the admin list screens. The state lives in the
 * URL so a filtered list can be shared, bookmarked and restored on back.
 */
export function ListFilter({ placeholder = 'Search…' }: { placeholder?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const query = searchParams.get('q') ?? '';
  const status = searchParams.get('status') ?? '';
  const [term, setTerm] = useState(query);

  useEffect(() => setTerm(query), [query]);

  function apply(changes: Record<string, string>) {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(changes)) {
      if (value) params.set(key, value);
      else params.delete(key);
    }
    router.replace(`${pathname}?${params.toString()}`);
  }

  useEffect(() => {
    if (term === query) return;
    const timer = setTimeout(() => apply({ q: term.trim() }), 300);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [term]);

  const statuses = [
    ['', 'All'],
    ['PUBLISHED', 'Published'],
    ['DRAFT', 'Drafts'],
  ] as const;

  return (
    <div className="mb-4 flex flex-wrap items-center gap-2">
      <input
        type="search"
        value={term}
        onChange={(e) => setTerm(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className={clsx(inputClass, 'max-w-xs')}
      />
      <div className="flex rounded-md border border-slate-200 p-0.5" role="group" aria-label="Status">
        {statuses.map(([value, label]) => (
          <button
            key={value || 'all'}
            type="button"
            onClick={() => apply({ status: value })}
            aria-pressed={status === value}
            className={clsx(
              'rounded px-3 py-1.5 text-xs font-medium transition-colors',
              status === value ? 'bg-slate-900 text-white' : 'text-slate-500 hover:text-slate-900',
            )}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
