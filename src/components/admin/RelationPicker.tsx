'use client';

import { useMemo, useState } from 'react';
import clsx from 'clsx';
import type { ContentType } from '@prisma/client';

export type RelationOption = { type: ContentType; id: string; label: string; group: string };

/**
 * Attaches any content to any other content. The selection is submitted as
 * `related[]` values of the form `TYPE:id`, which the server actions turn into
 * ContentLink rows — no per-type join table, and no hard-coded relationships.
 */
export function RelationPicker({
  options,
  selected,
  label = 'Related content',
  hint = 'Shown on the public page, and on the related item in return.',
}: {
  options: RelationOption[];
  selected: string[];
  label?: string;
  hint?: string;
}) {
  const [chosen, setChosen] = useState<string[]>(selected);
  const [query, setQuery] = useState('');

  const groups = useMemo(() => {
    const term = query.trim().toLowerCase();
    const filtered = term
      ? options.filter((o) => o.label.toLowerCase().includes(term) || o.group.toLowerCase().includes(term))
      : options;

    const map = new Map<string, RelationOption[]>();
    for (const option of filtered) map.set(option.group, [...(map.get(option.group) ?? []), option]);
    return [...map.entries()];
  }, [options, query]);

  const toggle = (value: string) =>
    setChosen((current) =>
      current.includes(value) ? current.filter((v) => v !== value) : [...current, value],
    );

  return (
    <div>
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <span className="text-xs font-medium text-slate-700">{label}</span>
        <span className="text-xs text-slate-400">{chosen.length} selected</span>
      </div>

      {chosen.map((value) => (
        <input key={value} type="hidden" name="related[]" value={value} />
      ))}

      {options.length === 0 ? (
        <p className="rounded-md border border-dashed border-slate-300 px-4 py-6 text-center text-xs text-slate-400">
          Publish articles, resources, tools, solutions or work first — then you can connect them here.
        </p>
      ) : (
        <>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter…"
            className="mb-3 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-slate-900"
          />

          <div className="max-h-80 space-y-4 overflow-y-auto rounded-md border border-slate-200 p-3">
            {groups.length === 0 && <p className="py-6 text-center text-xs text-slate-400">Nothing matches that filter.</p>}

            {groups.map(([group, items]) => (
              <div key={group}>
                <p className="mb-1.5 text-[0.6875rem] font-semibold uppercase tracking-wider text-slate-400">{group}</p>
                <ul className="space-y-1">
                  {items.map((option) => {
                    const value = `${option.type}:${option.id}`;
                    const active = chosen.includes(value);
                    return (
                      <li key={value}>
                        <button
                          type="button"
                          onClick={() => toggle(value)}
                          aria-pressed={active}
                          className={clsx(
                            'flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-start text-sm transition-colors',
                            active ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100',
                          )}
                        >
                          <span
                            aria-hidden
                            className={clsx(
                              'inline-flex h-4 w-4 shrink-0 items-center justify-center rounded border text-[0.625rem]',
                              active ? 'border-white bg-white text-slate-900' : 'border-slate-300',
                            )}
                          >
                            {active ? '✓' : ''}
                          </span>
                          <span className="truncate">{option.label}</span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </>
      )}

      <p className="mt-1.5 text-xs text-slate-400">{hint}</p>
    </div>
  );
}
