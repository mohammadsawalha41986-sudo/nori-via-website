'use client';

import { useMemo, useState } from 'react';
import { inputClass } from './ui';
import {
  checkFormula,
  computeOutputs,
  formatOutput,
  toolConfigSchema,
  type ToolConfig,
  type ToolInput,
  type ToolOutput,
} from '@/lib/tool-engine';

/**
 * Visual editor for a calculator definition.
 *
 * The builder writes the same validated JSON the server expects, and runs the
 * real engine as you type — so a broken formula is visible here rather than on
 * the public page. The server re-validates everything regardless.
 */

const emptyInput = (index: number): ToolInput => ({
  key: `input${index + 1}`,
  labelEn: '',
  labelAr: '',
  helpEn: '',
  helpAr: '',
  type: 'number',
  unit: '',
  min: null,
  max: null,
  step: null,
  defaultValue: 0,
  options: [],
});

const emptyOutput = (index: number): ToolOutput => ({
  key: `result${index + 1}`,
  labelEn: '',
  labelAr: '',
  helpEn: '',
  helpAr: '',
  expression: '',
  format: 'number',
  precision: 2,
  primary: index === 0,
});

function Row({ children, onRemove, title }: { children: React.ReactNode; onRemove: () => void; title: string }) {
  return (
    <li className="rounded-md border border-slate-200 p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{title}</p>
        <button
          type="button"
          onClick={onRemove}
          className="rounded border border-red-200 px-2 py-1 text-xs font-medium text-red-700 hover:bg-red-50"
        >
          Remove
        </button>
      </div>
      {children}
    </li>
  );
}

export function ToolBuilder({ initialConfig }: { initialConfig: ToolConfig }) {
  const [config, setConfig] = useState<ToolConfig>(initialConfig);

  const update = (patch: Partial<ToolConfig>) => setConfig((c) => ({ ...c, ...patch }));

  const patchInput = (index: number, patch: Partial<ToolInput>) =>
    update({ inputs: config.inputs.map((input, i) => (i === index ? { ...input, ...patch } : input)) });

  const patchOutput = (index: number, patch: Partial<ToolOutput>) =>
    update({ outputs: config.outputs.map((output, i) => (i === index ? { ...output, ...patch } : output)) });

  const availableKeys = useMemo(
    () => [...config.inputs.map((i) => i.key), ...config.outputs.map((o) => o.key)],
    [config.inputs, config.outputs],
  );

  const formulaErrors = useMemo(
    () =>
      config.outputs.map((output) => (output.expression.trim() ? checkFormula(output.expression, availableKeys) : null)),
    [config.outputs, availableKeys],
  );

  // Live preview against each input's default value.
  const preview = useMemo(() => {
    const values = Object.fromEntries(config.inputs.map((input) => [input.key, input.defaultValue]));
    const parsed = toolConfigSchema.safeParse(config);
    return parsed.success ? computeOutputs(parsed.data, values) : [];
  }, [config]);

  const serialised = JSON.stringify(config);

  return (
    <div className="space-y-6">
      <input type="hidden" name="configJson" value={serialised} />

      <section>
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-sm font-semibold text-slate-900">Inputs</h3>
          <button
            type="button"
            onClick={() => update({ inputs: [...config.inputs, emptyInput(config.inputs.length)] })}
            className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
          >
            Add input
          </button>
        </div>

        {config.inputs.length === 0 ? (
          <p className="rounded-md border border-dashed border-slate-300 px-4 py-6 text-center text-xs text-slate-400">
            No inputs yet. Add the numbers a visitor should enter.
          </p>
        ) : (
          <ul className="space-y-3">
            {config.inputs.map((input, index) => (
              <Row
                key={index}
                title={`Input ${index + 1}`}
                onRemove={() => update({ inputs: config.inputs.filter((_, i) => i !== index) })}
              >
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  <label className="block">
                    <span className="mb-1 block text-xs text-slate-500">Field key (used in formulas)</span>
                    <input
                      value={input.key}
                      onChange={(e) => patchInput(index, { key: e.target.value.replace(/[^a-zA-Z0-9_]/g, '') })}
                      dir="ltr"
                      className={inputClass}
                    />
                  </label>
                  <label className="block">
                    <span className="mb-1 block text-xs text-slate-500">Label (EN)</span>
                    <input value={input.labelEn} onChange={(e) => patchInput(index, { labelEn: e.target.value })} className={inputClass} />
                  </label>
                  <label className="block">
                    <span className="mb-1 block text-xs text-slate-500">Label (AR)</span>
                    <input value={input.labelAr} onChange={(e) => patchInput(index, { labelAr: e.target.value })} dir="rtl" className={inputClass} />
                  </label>
                  <label className="block">
                    <span className="mb-1 block text-xs text-slate-500">Unit</span>
                    <input value={input.unit} onChange={(e) => patchInput(index, { unit: e.target.value })} className={inputClass} />
                  </label>
                  <label className="block">
                    <span className="mb-1 block text-xs text-slate-500">Default value</span>
                    <input
                      type="number"
                      value={input.defaultValue}
                      onChange={(e) => patchInput(index, { defaultValue: Number(e.target.value) || 0 })}
                      className={inputClass}
                    />
                  </label>
                  <label className="block">
                    <span className="mb-1 block text-xs text-slate-500">Minimum</span>
                    <input
                      type="number"
                      value={input.min ?? ''}
                      onChange={(e) => patchInput(index, { min: e.target.value === '' ? null : Number(e.target.value) })}
                      className={inputClass}
                    />
                  </label>
                  <label className="block">
                    <span className="mb-1 block text-xs text-slate-500">Maximum</span>
                    <input
                      type="number"
                      value={input.max ?? ''}
                      onChange={(e) => patchInput(index, { max: e.target.value === '' ? null : Number(e.target.value) })}
                      className={inputClass}
                    />
                  </label>
                  <label className="block">
                    <span className="mb-1 block text-xs text-slate-500">Step</span>
                    <input
                      type="number"
                      value={input.step ?? ''}
                      onChange={(e) => patchInput(index, { step: e.target.value === '' ? null : Number(e.target.value) })}
                      className={inputClass}
                    />
                  </label>
                  <label className="block sm:col-span-2 lg:col-span-4">
                    <span className="mb-1 block text-xs text-slate-500">Help text (EN)</span>
                    <input value={input.helpEn} onChange={(e) => patchInput(index, { helpEn: e.target.value })} className={inputClass} />
                  </label>
                  <label className="block sm:col-span-2 lg:col-span-4">
                    <span className="mb-1 block text-xs text-slate-500">Help text (AR)</span>
                    <input value={input.helpAr} onChange={(e) => patchInput(index, { helpAr: e.target.value })} dir="rtl" className={inputClass} />
                  </label>
                </div>
              </Row>
            ))}
          </ul>
        )}
      </section>

      <section>
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-sm font-semibold text-slate-900">Results</h3>
          <button
            type="button"
            onClick={() => update({ outputs: [...config.outputs, emptyOutput(config.outputs.length)] })}
            className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
          >
            Add result
          </button>
        </div>

        <p className="mb-3 text-xs text-slate-400">
          Formulas may use input keys, earlier result keys, <code>+ - * / % ^</code>, comparisons, <code>? :</code>, and
          min, max, round, floor, ceil, abs, sqrt, pow. Example: <code>covers * spend * (1 - foodCost / 100)</code>
        </p>

        {config.outputs.length === 0 ? (
          <p className="rounded-md border border-dashed border-slate-300 px-4 py-6 text-center text-xs text-slate-400">
            No results yet. A tool needs at least one before it can be published.
          </p>
        ) : (
          <ul className="space-y-3">
            {config.outputs.map((output, index) => (
              <Row
                key={index}
                title={`Result ${index + 1}`}
                onRemove={() => update({ outputs: config.outputs.filter((_, i) => i !== index) })}
              >
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  <label className="block">
                    <span className="mb-1 block text-xs text-slate-500">Result key</span>
                    <input
                      value={output.key}
                      onChange={(e) => patchOutput(index, { key: e.target.value.replace(/[^a-zA-Z0-9_]/g, '') })}
                      dir="ltr"
                      className={inputClass}
                    />
                  </label>
                  <label className="block">
                    <span className="mb-1 block text-xs text-slate-500">Label (EN)</span>
                    <input value={output.labelEn} onChange={(e) => patchOutput(index, { labelEn: e.target.value })} className={inputClass} />
                  </label>
                  <label className="block">
                    <span className="mb-1 block text-xs text-slate-500">Label (AR)</span>
                    <input value={output.labelAr} onChange={(e) => patchOutput(index, { labelAr: e.target.value })} dir="rtl" className={inputClass} />
                  </label>
                  <label className="block">
                    <span className="mb-1 block text-xs text-slate-500">Format</span>
                    <select
                      value={output.format}
                      onChange={(e) => patchOutput(index, { format: e.target.value as ToolOutput['format'] })}
                      className={inputClass}
                    >
                      <option value="number">Number</option>
                      <option value="currency">Currency</option>
                      <option value="percent">Percentage</option>
                    </select>
                  </label>

                  <label className="block sm:col-span-2 lg:col-span-3">
                    <span className="mb-1 block text-xs text-slate-500">Formula</span>
                    <input
                      value={output.expression}
                      onChange={(e) => patchOutput(index, { expression: e.target.value })}
                      dir="ltr"
                      className={inputClass}
                    />
                    {formulaErrors[index] && (
                      <span className="mt-1 block text-xs font-medium text-red-700">{formulaErrors[index]}</span>
                    )}
                  </label>

                  <label className="block">
                    <span className="mb-1 block text-xs text-slate-500">Decimals</span>
                    <input
                      type="number"
                      min={0}
                      max={6}
                      value={output.precision}
                      onChange={(e) => patchOutput(index, { precision: Number(e.target.value) || 0 })}
                      className={inputClass}
                    />
                  </label>

                  <label className="flex items-center gap-2 text-sm text-slate-700 sm:col-span-2 lg:col-span-4">
                    <input
                      type="checkbox"
                      checked={output.primary}
                      onChange={(e) => patchOutput(index, { primary: e.target.checked })}
                      className="h-4 w-4 rounded border-slate-300"
                    />
                    Headline result
                  </label>
                </div>
              </Row>
            ))}
          </ul>
        )}
      </section>

      <section className="grid gap-3 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1 block text-xs text-slate-500">Currency symbol or code</span>
          <input value={config.currency} onChange={(e) => update({ currency: e.target.value })} className={inputClass} />
        </label>
      </section>

      <section className="grid gap-3 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1 block text-xs text-slate-500">How to read this (EN)</span>
          <textarea rows={4} value={config.notesEn} onChange={(e) => update({ notesEn: e.target.value })} className={inputClass} />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs text-slate-500">How to read this (AR)</span>
          <textarea rows={4} value={config.notesAr} onChange={(e) => update({ notesAr: e.target.value })} dir="rtl" className={inputClass} />
        </label>
      </section>

      {config.outputs.length > 0 && (
        <section className="rounded-md border border-slate-200 bg-slate-50 p-4">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
            Live check — results from the default values
          </p>
          <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {config.outputs.map((output, index) => {
              const result = preview.find((r) => r.key === output.key);
              return (
                <div key={index} className="rounded border border-slate-200 bg-white px-3 py-2">
                  <dt className="text-xs text-slate-400">{output.labelEn || output.key}</dt>
                  <dd className="mt-0.5 text-sm font-semibold text-slate-900" dir="ltr">
                    {result?.error ? (
                      <span className="text-red-700">{result.error}</span>
                    ) : (
                      formatOutput(result?.value ?? null, output, 'en', config.currency)
                    )}
                  </dd>
                </div>
              );
            })}
          </dl>
        </section>
      )}
    </div>
  );
}
