'use client';

import { useMemo, useState } from 'react';
import clsx from 'clsx';
import { computeOutputs, formatOutput, type ToolConfig } from '@/lib/tool-engine';
import { track, EVENTS } from '@/lib/track';
import type { Locale } from '@/lib/i18n';
import type { Dictionary } from '@/lib/dictionary';

/**
 * Runs a CMS-defined calculator entirely in the browser. Nothing the visitor
 * types leaves the page — only an anonymous "tool used" event is recorded, and
 * only once per session.
 */
export function ToolRunner({
  slug,
  config,
  locale,
  dict,
}: {
  slug: string;
  config: ToolConfig;
  locale: Locale;
  dict: Dictionary;
}) {
  const initial = useMemo(
    () => Object.fromEntries(config.inputs.map((input) => [input.key, input.defaultValue])),
    [config.inputs],
  );

  const [values, setValues] = useState<Record<string, number>>(initial);
  const [used, setUsed] = useState(false);

  const results = useMemo(() => computeOutputs(config, values), [config, values]);
  const byKey = new Map(results.map((r) => [r.key, r]));

  function update(key: string, raw: string) {
    const next = raw === '' ? 0 : Number(raw);
    setValues((current) => ({ ...current, [key]: Number.isFinite(next) ? next : 0 }));
    if (!used) {
      setUsed(true);
      track(EVENTS.toolUse, { slug });
    }
  }

  const label = (row: { labelEn: string; labelAr: string }) =>
    (locale === 'ar' ? row.labelAr || row.labelEn : row.labelEn || row.labelAr) || '';
  const help = (row: { helpEn: string; helpAr: string }) =>
    locale === 'ar' ? row.helpAr || row.helpEn : row.helpEn || row.helpAr;

  const primaryOutputs = config.outputs.filter((o) => o.primary);
  const secondaryOutputs = config.outputs.filter((o) => !o.primary);

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:gap-14">
      <div>
        <h2 className="font-display text-xl uppercase text-ink-900">
          {dict.tools.inputs}
        </h2>

        <div className="mt-7 space-y-5">
          {config.inputs.map((input) => {
            const id = `tool-${input.key}`;
            const hint = help(input);
            return (
              <div key={input.key}>
                <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-ink-700">
                  {label(input)}
                  {input.unit && <span className="ms-1.5 font-normal text-ink-300">({input.unit})</span>}
                </label>

                {input.type === 'select' ? (
                  <select
                    id={id}
                    value={String(values[input.key] ?? input.defaultValue)}
                    onChange={(e) => update(input.key, e.target.value)}
                    className="w-full rounded-input border border-ink-900/15 bg-white px-4 py-3 text-[0.9375rem] text-ink-900 outline-none focus:border-brand"
                  >
                    {input.options.map((option) => (
                      <option key={option.value} value={option.value}>
                        {label(option)}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    id={id}
                    type="number"
                    inputMode="decimal"
                    dir="ltr"
                    value={String(values[input.key] ?? '')}
                    min={input.min ?? undefined}
                    max={input.max ?? undefined}
                    step={input.step ?? 'any'}
                    onChange={(e) => update(input.key, e.target.value)}
                    className="w-full rounded-input border border-ink-900/15 bg-white px-4 py-3 text-[0.9375rem] text-ink-900 outline-none focus:border-brand"
                  />
                )}

                {hint && <p className="mt-1.5 text-xs leading-relaxed text-ink-300">{hint}</p>}
              </div>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => setValues(initial)}
          className="mt-7 rounded-btn border border-ink-900/20 px-5 py-2.5 text-sm font-semibold text-ink-600 transition-colors hover:border-ink-900 hover:text-ink-900"
        >
          {dict.tools.reset}
        </button>
      </div>

      <div className="rounded-card bg-ink-900 p-8 text-white sm:p-10">
        <h2 className="font-display text-xl uppercase ">{dict.tools.results}</h2>

        <dl className="mt-8 space-y-7">
          {primaryOutputs.concat(secondaryOutputs).map((output) => {
            const result = byKey.get(output.key);
            const hint = help(output);
            return (
              <div key={output.key}>
                <dt className="text-[0.6875rem] font-bold uppercase tracking-[0.2em] text-white/45">
                  {label(output)}
                </dt>
                <dd
                  className={clsx(
                    'mt-1.5 font-display ',
                    output.primary ? 'text-4xl text-brand-300 sm:text-5xl' : 'text-2xl',
                  )}
                  dir="ltr"
                >
                  {formatOutput(result?.value ?? null, output, locale, config.currency)}
                </dd>
                {hint && <p className="mt-2 text-xs leading-relaxed text-white/45">{hint}</p>}
              </div>
            );
          })}
        </dl>

        <p className="mt-10 border-t border-white/10 pt-5 text-xs leading-relaxed text-white/40">
          {dict.tools.liveNote}
        </p>
      </div>
    </div>
  );
}
