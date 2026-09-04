'use client';

import { useRef, useState } from 'react';
import clsx from 'clsx';
import { MagneticButton } from '../ui/Button';
import { labelOf, helpOf, type Intake, type IntakeQuestion } from '@/lib/intake';
import { track, EVENTS } from '@/lib/track';
import type { Locale } from '@/lib/i18n';
import type { Dictionary } from '@/lib/dictionary';

/**
 * The service-specific intake. It posts to the same `/api/inquiry` endpoint as
 * the guided Start a Project flow — one inbox, one rate limit, one attachment
 * pipeline — and adds the service's own answers so the consultant reads a
 * structured brief rather than a paragraph.
 */
export function ServiceRequestForm({
  serviceSlug,
  serviceName,
  intake,
  locale,
  dict,
}: {
  serviceSlug: string;
  serviceName: string;
  intake: Intake;
  locale: Locale;
  dict: Dictionary;
}) {
  const [values, setValues] = useState<Record<string, string | string[]>>({});
  const [files, setFiles] = useState<File[]>([]);
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [error, setError] = useState('');
  const fileInput = useRef<HTMLInputElement>(null);

  const t = dict.request;
  const inputClass =
    'w-full rounded-input border border-ink-900/15 bg-white px-4 py-3 text-[0.9375rem] text-ink-900 outline-none transition-colors placeholder:text-ink-300 focus:border-brand';

  const set = (key: string, value: string | string[]) => setValues((v) => ({ ...v, [key]: value }));

  const toggleMulti = (question: IntakeQuestion, option: string) => {
    const current = Array.isArray(values[question.key]) ? (values[question.key] as string[]) : [];
    set(question.key, current.includes(option) ? current.filter((v) => v !== option) : [...current, option]);
  };

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (state === 'sending') return;

    const form = new FormData(event.currentTarget);
    const name = String(form.get('name') ?? '').trim();
    const email = String(form.get('email') ?? '').trim();

    if (!name || !email) {
      setError(t.missing);
      setState('error');
      return;
    }

    setState('sending');
    setError('');

    const answers = intake.questions
      .map((question) => {
        const raw = values[question.key];
        const value = Array.isArray(raw) ? raw.join(', ') : (raw ?? '');
        return { key: question.key, label: labelOf(question, locale), value: String(value).trim() };
      })
      .filter((answer) => answer.value);

    const payload = {
      name,
      business: String(form.get('business') ?? ''),
      website: String(form.get('website') ?? ''),
      social: String(form.get('social') ?? ''),
      services: [serviceName],
      goals: [],
      description: String(form.get('description') ?? ''),
      budget: String(form.get('budget') ?? ''),
      timeline: String(form.get('timeline') ?? ''),
      email,
      phone: String(form.get('phone') ?? ''),
      whatsapp: String(form.get('whatsapp') ?? ''),
      preferredContact: String(form.get('preferredContact') ?? 'email'),
      locale,
      serviceSlug,
      answers,
    };

    const body = new FormData();
    body.set('payload', JSON.stringify(payload));
    body.set('company_website', String(form.get('company_website') ?? ''));
    for (const file of files) body.append('files', file);

    try {
      const response = await fetch('/api/inquiry', { method: 'POST', body });
      if (!response.ok) {
        const data = (await response.json().catch(() => ({}))) as { error?: string };
        setError(data.error || t.errorBody);
        setState('error');
        return;
      }
      track(EVENTS.formComplete, { service: serviceSlug });
      setState('sent');
    } catch {
      setError(t.errorBody);
      setState('error');
    }
  }

  if (state === 'sent') {
    return (
      <div className="rounded-card border border-ink-900/10 bg-white p-10 text-center">
        <p className="font-display text-2xl uppercase text-ink-900">{t.successTitle}</p>
        <p className="mx-auto mt-4 max-w-md text-[0.9375rem] leading-relaxed text-ink-400">{t.successBody}</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="rounded-card border border-ink-900/10 bg-white p-8 sm:p-10">
      <input
        type="text"
        name="company_website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
        className="pointer-events-none absolute h-0 w-0 opacity-0"
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold text-ink-700">
            {t.name} <span className="text-brand">*</span>
          </span>
          <input name="name" required className={inputClass} />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold text-ink-700">
            {t.email} <span className="text-brand">*</span>
          </span>
          <input name="email" type="email" required dir="ltr" className={inputClass} />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold text-ink-700">{t.business}</span>
          <input name="business" className={inputClass} />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold text-ink-700">{t.phone}</span>
          <input name="phone" dir="ltr" className={inputClass} />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold text-ink-700">{t.website}</span>
          <input name="website" dir="ltr" className={inputClass} />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold text-ink-700">{t.social}</span>
          <input name="social" dir="ltr" className={inputClass} />
        </label>
      </div>

      {intake.questions.length > 0 && (
        <div className="mt-8 space-y-5 border-t border-ink-900/10 pt-8">
          {intake.questions.map((question) => {
            const id = `intake-${question.key}`;
            const label = labelOf(question, locale);
            const help = helpOf(question, locale);
            const selected = Array.isArray(values[question.key]) ? (values[question.key] as string[]) : [];

            return (
              <div key={question.key}>
                <span className="mb-1.5 block text-sm font-semibold text-ink-700">
                  {label}
                  {question.required && <span className="text-brand"> *</span>}
                </span>

                {question.type === 'longtext' && (
                  <textarea
                    id={id}
                    rows={4}
                    required={question.required}
                    value={String(values[question.key] ?? '')}
                    onChange={(e) => set(question.key, e.target.value)}
                    aria-label={label}
                    className={inputClass}
                  />
                )}

                {(question.type === 'text' || question.type === 'number') && (
                  <input
                    id={id}
                    type={question.type === 'number' ? 'number' : 'text'}
                    inputMode={question.type === 'number' ? 'decimal' : undefined}
                    required={question.required}
                    value={String(values[question.key] ?? '')}
                    onChange={(e) => set(question.key, e.target.value)}
                    aria-label={label}
                    className={inputClass}
                  />
                )}

                {question.type === 'select' && (
                  <select
                    id={id}
                    required={question.required}
                    value={String(values[question.key] ?? '')}
                    onChange={(e) => set(question.key, e.target.value)}
                    aria-label={label}
                    className={inputClass}
                  >
                    <option value="">{t.choose}</option>
                    {question.options.map((option) => (
                      <option key={option.value} value={option.value}>
                        {labelOf(option, locale) || option.value}
                      </option>
                    ))}
                  </select>
                )}

                {question.type === 'multiselect' && (
                  <div className="flex flex-wrap gap-2" role="group" aria-label={label}>
                    {question.options.map((option) => {
                      const active = selected.includes(option.value);
                      return (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => toggleMulti(question, option.value)}
                          aria-pressed={active}
                          className={clsx(
                            'rounded-btn border px-4 py-2 text-sm transition-colors duration-300',
                            active
                              ? 'border-ink-900 bg-ink-900 text-white'
                              : 'border-ink-900/15 text-ink-600 hover:border-ink-900',
                          )}
                        >
                          {labelOf(option, locale) || option.value}
                        </button>
                      );
                    })}
                  </div>
                )}

                {help && <p className="mt-1.5 text-xs leading-relaxed text-ink-300">{help}</p>}
              </div>
            );
          })}
        </div>
      )}

      <div className="mt-8 space-y-5 border-t border-ink-900/10 pt-8">
        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold text-ink-700">{t.description}</span>
          <textarea name="description" rows={4} className={inputClass} />
        </label>

        <div className="grid gap-5 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-ink-700">{t.timeline}</span>
            <input name="timeline" className={inputClass} />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-ink-700">{t.preferred}</span>
            <select name="preferredContact" defaultValue="email" className={inputClass}>
              <option value="email">{t.email}</option>
              <option value="phone">{t.phone}</option>
              <option value="whatsapp">{t.whatsapp}</option>
            </select>
          </label>
        </div>

        <div>
          <span className="mb-1.5 block text-sm font-semibold text-ink-700">{t.attachments}</span>
          <p className="mb-2 text-xs leading-relaxed text-ink-400">
            {(locale === 'ar' ? intake.uploadsAr || intake.uploadsEn : intake.uploadsEn || intake.uploadsAr) ||
              t.attachmentsHint}
          </p>
          <input
            ref={fileInput}
            type="file"
            multiple
            accept=".pdf,.jpg,.jpeg,.png,.webp,.xlsx,.xls,.doc,.docx"
            aria-label={t.attachments}
            onChange={(e) => setFiles([...(e.target.files ?? [])].slice(0, 8))}
            className="w-full rounded-input border border-ink-900/15 bg-white px-4 py-3 text-sm file:me-3 file:rounded file:border-0 file:bg-ink-900 file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-white"
          />
          {files.length > 0 && (
            <ul className="mt-2 space-y-1 text-xs text-ink-400">
              {files.map((file) => (
                <li key={file.name}>{file.name}</li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-4">
        <MagneticButton type="submit" disabled={state === 'sending'}>
          {state === 'sending' ? t.sending : t.submit}
        </MagneticButton>
        {state === 'error' && (
          <p role="alert" className="text-sm font-medium text-brand-600">
            {error}
          </p>
        )}
      </div>
    </form>
  );
}
