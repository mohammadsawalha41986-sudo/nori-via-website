'use client';

import { useState } from 'react';
import { inputClass } from './ui';
import type { Intake, IntakeQuestion } from '@/lib/intake';

/**
 * Visual editor for a service's intake questionnaire. It writes the same
 * validated JSON the public form reads, so adding a question to a service is a
 * CMS action — the questionnaire is data, not code.
 */
const emptyQuestion = (index: number): IntakeQuestion => ({
  key: `q${index + 1}`,
  labelEn: '',
  labelAr: '',
  helpEn: '',
  helpAr: '',
  type: 'text',
  required: false,
  options: [],
});

export function IntakeBuilder({ initial }: { initial: Intake }) {
  const [intake, setIntake] = useState<Intake>(initial);

  const update = (patch: Partial<Intake>) => setIntake((current) => ({ ...current, ...patch }));
  const patchQuestion = (index: number, patch: Partial<IntakeQuestion>) =>
    update({ questions: intake.questions.map((q, i) => (i === index ? { ...q, ...patch } : q)) });

  const optionsToText = (question: IntakeQuestion) =>
    question.options.map((o) => [o.value, o.labelEn, o.labelAr].filter(Boolean).join(' | ')).join('\n');

  const textToOptions = (text: string) =>
    text
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const [value, labelEn, labelAr] = line.split('|').map((part) => part.trim());
        return { value: value ?? '', labelEn: labelEn ?? value ?? '', labelAr: labelAr ?? '' };
      })
      .filter((o) => o.value);

  return (
    <div className="space-y-5">
      <input type="hidden" name="intakeJson" value={JSON.stringify(intake)} />

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1 block text-xs text-slate-500">Headline (EN)</span>
          <input value={intake.headlineEn} onChange={(e) => update({ headlineEn: e.target.value })} className={inputClass} />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs text-slate-500">Headline (AR)</span>
          <input value={intake.headlineAr} onChange={(e) => update({ headlineAr: e.target.value })} dir="rtl" className={inputClass} />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs text-slate-500">Intro (EN)</span>
          <textarea rows={3} value={intake.introEn} onChange={(e) => update({ introEn: e.target.value })} className={inputClass} />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs text-slate-500">Intro (AR)</span>
          <textarea rows={3} value={intake.introAr} onChange={(e) => update({ introAr: e.target.value })} dir="rtl" className={inputClass} />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs text-slate-500">What to attach (EN)</span>
          <input value={intake.uploadsEn} onChange={(e) => update({ uploadsEn: e.target.value })} className={inputClass} />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs text-slate-500">What to attach (AR)</span>
          <input value={intake.uploadsAr} onChange={(e) => update({ uploadsAr: e.target.value })} dir="rtl" className={inputClass} />
        </label>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-sm font-semibold text-slate-900">Questions</h3>
        <button
          type="button"
          onClick={() => update({ questions: [...intake.questions, emptyQuestion(intake.questions.length)] })}
          className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
        >
          Add question
        </button>
      </div>

      {intake.questions.length === 0 ? (
        <p className="rounded-md border border-dashed border-slate-300 px-4 py-6 text-center text-xs text-slate-400">
          No questions yet — the request form will ask only for contact details.
        </p>
      ) : (
        <ul className="space-y-3">
          {intake.questions.map((question, index) => (
            <li key={index} className="rounded-md border border-slate-200 p-4">
              <div className="mb-3 flex items-center justify-between gap-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Question {index + 1}</p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    disabled={index === 0}
                    onClick={() => {
                      const next = [...intake.questions];
                      [next[index - 1], next[index]] = [next[index]!, next[index - 1]!];
                      update({ questions: next });
                    }}
                    className="rounded border border-slate-300 px-2 py-1 text-xs text-slate-600 disabled:opacity-40"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    onClick={() => update({ questions: intake.questions.filter((_, i) => i !== index) })}
                    className="rounded border border-red-200 px-2 py-1 text-xs font-medium text-red-700 hover:bg-red-50"
                  >
                    Remove
                  </button>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <label className="block">
                  <span className="mb-1 block text-xs text-slate-500">Field key</span>
                  <input
                    value={question.key}
                    onChange={(e) => patchQuestion(index, { key: e.target.value.replace(/[^a-zA-Z0-9_-]/g, '') })}
                    dir="ltr"
                    className={inputClass}
                  />
                </label>
                <label className="block">
                  <span className="mb-1 block text-xs text-slate-500">Question (EN)</span>
                  <input value={question.labelEn} onChange={(e) => patchQuestion(index, { labelEn: e.target.value })} className={inputClass} />
                </label>
                <label className="block">
                  <span className="mb-1 block text-xs text-slate-500">Question (AR)</span>
                  <input value={question.labelAr} onChange={(e) => patchQuestion(index, { labelAr: e.target.value })} dir="rtl" className={inputClass} />
                </label>
                <label className="block">
                  <span className="mb-1 block text-xs text-slate-500">Answer type</span>
                  <select
                    value={question.type}
                    onChange={(e) => patchQuestion(index, { type: e.target.value as IntakeQuestion['type'] })}
                    className={inputClass}
                  >
                    <option value="text">Short text</option>
                    <option value="longtext">Long text</option>
                    <option value="number">Number</option>
                    <option value="select">Choose one</option>
                    <option value="multiselect">Choose several</option>
                  </select>
                </label>

                {(question.type === 'select' || question.type === 'multiselect') && (
                  <label className="block sm:col-span-2 lg:col-span-4">
                    <span className="mb-1 block text-xs text-slate-500">
                      Options — one per line as value | English label | Arabic label
                    </span>
                    <textarea
                      rows={4}
                      value={optionsToText(question)}
                      onChange={(e) => patchQuestion(index, { options: textToOptions(e.target.value) })}
                      className={inputClass}
                    />
                  </label>
                )}

                <label className="block sm:col-span-2">
                  <span className="mb-1 block text-xs text-slate-500">Help text (EN)</span>
                  <input value={question.helpEn} onChange={(e) => patchQuestion(index, { helpEn: e.target.value })} className={inputClass} />
                </label>
                <label className="block sm:col-span-2">
                  <span className="mb-1 block text-xs text-slate-500">Help text (AR)</span>
                  <input value={question.helpAr} onChange={(e) => patchQuestion(index, { helpAr: e.target.value })} dir="rtl" className={inputClass} />
                </label>

                <label className="flex items-center gap-2 text-sm text-slate-700 sm:col-span-2 lg:col-span-4">
                  <input
                    type="checkbox"
                    checked={question.required}
                    onChange={(e) => patchQuestion(index, { required: e.target.checked })}
                    className="h-4 w-4 rounded border-slate-300"
                  />
                  Required
                </label>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
