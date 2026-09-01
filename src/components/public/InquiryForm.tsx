'use client';

import { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import { FileUploader } from './FileUploader';
import { MagneticButton } from '../ui/Button';
import { track, EVENTS } from '@/lib/track';
import type { Dictionary } from '@/lib/dictionary';
import type { Locale } from '@/lib/i18n';

const field =
  'w-full rounded-lg border border-ink-900/15 bg-white px-4 py-3.5 text-[0.9375rem] text-ink-900 outline-none transition-colors duration-200 placeholder:text-ink-300 focus:border-brand';

const SERVICE_OPTIONS = [
  ['Social Media', 'وسائل التواصل الاجتماعي'],
  ['Advertising', 'الإعلانات'],
  ['Branding', 'الهوية'],
  ['Creative', 'الإبداع'],
  ['Menu', 'قائمة الطعام'],
  ['Restaurant Growth', 'نمو المطاعم'],
  ['Multiple Services', 'خدمات متعددة'],
] as const;

const GOAL_OPTIONS = [
  ['Increase awareness', 'زيادة الوعي'],
  ['Increase orders', 'زيادة الطلبات'],
  ['Launch a restaurant', 'إطلاق مطعم'],
  ['Improve social media', 'تحسين وسائل التواصل'],
  ['Run advertising', 'تشغيل حملات إعلانية'],
  ['Rebrand', 'إعادة بناء الهوية'],
  ['Improve menu profitability', 'تحسين ربحية القائمة'],
  ['Restaurant growth', 'نمو المطعم'],
] as const;

const BUDGETS = [
  ['Under 10,000 SAR', 'أقل من ١٠٬٠٠٠ ريال'],
  ['10,000 – 25,000 SAR', '١٠٬٠٠٠ – ٢٥٬٠٠٠ ريال'],
  ['25,000 – 50,000 SAR', '٢٥٬٠٠٠ – ٥٠٬٠٠٠ ريال'],
  ['50,000 – 100,000 SAR', '٥٠٬٠٠٠ – ١٠٠٬٠٠٠ ريال'],
  ['Over 100,000 SAR', 'أكثر من ١٠٠٬٠٠٠ ريال'],
  ['Not sure yet', 'غير محدد بعد'],
] as const;

const TIMELINES = [
  ['As soon as possible', 'في أقرب وقت'],
  ['Within 1 month', 'خلال شهر'],
  ['1 – 3 months', 'من ١ إلى ٣ أشهر'],
  ['3 – 6 months', 'من ٣ إلى ٦ أشهر'],
  ['Just exploring', 'مجرد استكشاف'],
] as const;

const TOTAL_STEPS = 7;

type Values = {
  name: string;
  business: string;
  website: string;
  social: string;
  services: string[];
  otherService: string;
  goals: string[];
  otherGoal: string;
  description: string;
  budget: string;
  timeline: string;
  email: string;
  phone: string;
  whatsapp: string;
  preferredContact: 'email' | 'phone' | 'whatsapp';
};

const initial: Values = {
  name: '', business: '', website: '', social: '',
  services: [], otherService: '', goals: [], otherGoal: '',
  description: '', budget: '', timeline: '',
  email: '', phone: '', whatsapp: '', preferredContact: 'email',
};

export function InquiryForm({ dict, locale }: { dict: Dictionary; locale: Locale }) {
  const [step, setStep] = useState(0);
  const [values, setValues] = useState<Values>(initial);
  const [files, setFiles] = useState<File[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [state, setState] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');
  const [serverError, setServerError] = useState('');
  const started = useRef(false);
  const headingRef = useRef<HTMLHeadingElement>(null);

  const opt = (pair: readonly [string, string]) => (locale === 'ar' ? pair[1] : pair[0]);

  function set<K extends keyof Values>(key: K, value: Values[K]) {
    if (!started.current) {
      started.current = true;
      track(EVENTS.formStart);
    }
    setValues((v) => ({ ...v, [key]: value }));
    setErrors((e) => {
      if (!e[key as string]) return e;
      const next = { ...e };
      delete next[key as string];
      return next;
    });
  }

  function toggle(key: 'services' | 'goals', value: string) {
    const list = values[key];
    set(key, list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);
  }

  function validateStep(index: number) {
    const e: Record<string, string> = {};
    if (index === 0 && values.name.trim().length < 2) e.name = dict.form.fieldRequired;
    if (index === 1 && values.services.length === 0 && !values.otherService.trim()) e.services = dict.form.selectOne;
    if (index === 3 && values.description.trim().length < 10) e.description = dict.form.fieldRequired;
    if (index === 6) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) e.email = dict.form.invalidEmail;
      if (values.preferredContact === 'phone' && !values.phone.trim()) e.phone = dict.form.fieldRequired;
      if (values.preferredContact === 'whatsapp' && !values.whatsapp.trim()) e.whatsapp = dict.form.fieldRequired;
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function next() {
    if (!validateStep(step)) return;
    track(EVENTS.formStep, { step: step + 1 });
    setStep((s) => Math.min(s + 1, TOTAL_STEPS - 1));
  }

  // Move focus to the new step heading so keyboard and screen-reader users
  // follow along. Skipped on first render — nobody has navigated yet — and the
  // ring is suppressed below because the heading is not an interactive control.
  const firstRender = useRef(true);
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    if (state === 'idle') headingRef.current?.focus();
  }, [step, state]);

  async function submit() {
    if (!validateStep(6)) return;
    setState('sending');
    setServerError('');

    const payload = {
      ...values,
      services: [...values.services, ...(values.otherService.trim() ? [values.otherService.trim()] : [])],
      goals: [...values.goals, ...(values.otherGoal.trim() ? [values.otherGoal.trim()] : [])],
      locale,
    };

    const body = new FormData();
    body.append('payload', JSON.stringify(payload));
    files.forEach((f) => body.append('files', f));
    body.append('company_website', '');

    try {
      const res = await fetch('/api/inquiry', { method: 'POST', body });
      if (!res.ok) {
        const json = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(json.error || 'failed');
      }
      track(EVENTS.formComplete);
      setState('done');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setState('error');
      setServerError(err instanceof Error && err.message !== 'failed' ? err.message : dict.form.errorBody);
    }
  }

  if (state === 'done') {
    return (
      <div className="rounded-2xl border border-brand/25 bg-brand/[0.06] px-8 py-16 text-center">
        <p className="font-display text-3xl font-extrabold uppercase tracking-tight text-ink-900">
          {dict.form.successTitle}
        </p>
        <p className="mx-auto mt-5 max-w-lg text-[1.0625rem] leading-relaxed text-ink-500">{dict.form.successBody}</p>
        <div className="mt-10 flex justify-center">
          <MagneticButton href={`/${locale}/work`} variant="ghost">
            {dict.common.exploreWork}
          </MagneticButton>
        </div>
      </div>
    );
  }

  const steps = [
    { title: dict.form.s1Title, sub: dict.form.s1Sub },
    { title: dict.form.s2Title, sub: dict.form.s2Sub },
    { title: dict.form.s3Title, sub: dict.form.s3Sub },
    { title: dict.form.s4Title, sub: dict.form.s4Sub },
    { title: dict.form.s5Title, sub: dict.form.s5Sub },
    { title: dict.form.s6Title, sub: dict.form.s6Sub },
    { title: dict.form.s7Title, sub: dict.form.s7Sub },
  ];

  const current = steps[step]!;
  const last = step === TOTAL_STEPS - 1;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (last) void submit();
        else next();
      }}
      className="rounded-2xl border border-ink-900/10 bg-bone p-6 sm:p-10"
    >
      {/* Progress */}
      <div className="mb-9">
        <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.16em] text-ink-400">
          <span>
            {dict.form.step} {step + 1} {dict.form.of} {TOTAL_STEPS}
          </span>
          <span>{Math.round(((step + 1) / TOTAL_STEPS) * 100)}%</span>
        </div>
        <div
          role="progressbar"
          aria-valuemin={1}
          aria-valuemax={TOTAL_STEPS}
          aria-valuenow={step + 1}
          className="mt-3 h-1 w-full overflow-hidden rounded-full bg-ink-900/10"
        >
          <div
            className="h-full rounded-full bg-brand transition-[width] duration-500 ease-noriva"
            style={{ width: `${((step + 1) / TOTAL_STEPS) * 100}%` }}
          />
        </div>
      </div>

      <h2
        ref={headingRef}
        tabIndex={-1}
        className="font-display text-2xl font-extrabold uppercase tracking-tight text-ink-900 outline-none focus-visible:ring-0 sm:text-3xl"
      >
        {current.title}
      </h2>
      <p className="mt-2.5 text-[0.9375rem] text-ink-400">{current.sub}</p>

      <div className="mt-9 space-y-6">
        {step === 0 && (
          <>
            <Field id="name" label={`${dict.form.name} *`} error={errors.name}>
              <input id="name" className={field} value={values.name} onChange={(e) => set('name', e.target.value)} autoComplete="name" maxLength={120} />
            </Field>
            <Field id="business" label={dict.form.business}>
              <input id="business" className={field} value={values.business} onChange={(e) => set('business', e.target.value)} autoComplete="organization" maxLength={160} />
            </Field>
            <div className="grid gap-6 sm:grid-cols-2">
              <Field id="website" label={dict.form.website}>
                <input id="website" className={field} value={values.website} onChange={(e) => set('website', e.target.value)} dir="ltr" maxLength={200} placeholder="https://" />
              </Field>
              <Field id="social" label={dict.form.social}>
                <input id="social" className={field} value={values.social} onChange={(e) => set('social', e.target.value)} dir="ltr" maxLength={200} placeholder="@" />
              </Field>
            </div>
          </>
        )}

        {step === 1 && (
          <>
            <ChipGroup
              legend={dict.form.s2Title}
              options={SERVICE_OPTIONS.map(opt)}
              selected={values.services}
              onToggle={(v) => toggle('services', v)}
              error={errors.services}
            />
            <Field id="otherService" label={dict.form.other}>
              <input id="otherService" className={field} value={values.otherService} onChange={(e) => set('otherService', e.target.value)} maxLength={120} />
            </Field>
          </>
        )}

        {step === 2 && (
          <>
            <ChipGroup
              legend={dict.form.s3Title}
              options={GOAL_OPTIONS.map(opt)}
              selected={values.goals}
              onToggle={(v) => toggle('goals', v)}
            />
            <Field id="otherGoal" label={dict.form.other}>
              <input id="otherGoal" className={field} value={values.otherGoal} onChange={(e) => set('otherGoal', e.target.value)} maxLength={120} />
            </Field>
          </>
        )}

        {step === 3 && (
          <Field id="description" label={`${dict.form.description} *`} error={errors.description}>
            <textarea
              id="description"
              rows={9}
              className={clsx(field, 'resize-y')}
              value={values.description}
              onChange={(e) => set('description', e.target.value)}
              maxLength={5000}
            />
          </Field>
        )}

        {step === 4 && (
          <div className="grid gap-6 sm:grid-cols-2">
            <Field id="budget" label={dict.form.budget}>
              <select id="budget" className={field} value={values.budget} onChange={(e) => set('budget', e.target.value)}>
                <option value="">{dict.form.choose}</option>
                {BUDGETS.map((b) => (
                  <option key={b[0]} value={opt(b)}>
                    {opt(b)}
                  </option>
                ))}
              </select>
            </Field>
            <Field id="timeline" label={dict.form.timeline}>
              <select id="timeline" className={field} value={values.timeline} onChange={(e) => set('timeline', e.target.value)}>
                <option value="">{dict.form.choose}</option>
                {TIMELINES.map((t) => (
                  <option key={t[0]} value={opt(t)}>
                    {opt(t)}
                  </option>
                ))}
              </select>
            </Field>
          </div>
        )}

        {step === 5 && <FileUploader files={files} onChange={setFiles} dict={dict} />}

        {step === 6 && (
          <>
            <Field id="email" label={`${dict.common.email} *`} error={errors.email}>
              <input id="email" type="email" className={field} value={values.email} onChange={(e) => set('email', e.target.value)} autoComplete="email" dir="ltr" maxLength={160} />
            </Field>
            <div className="grid gap-6 sm:grid-cols-2">
              <Field id="phone" label={dict.common.phone} error={errors.phone}>
                <input id="phone" type="tel" className={field} value={values.phone} onChange={(e) => set('phone', e.target.value)} autoComplete="tel" dir="ltr" maxLength={40} />
              </Field>
              <Field id="whatsapp" label={dict.common.whatsapp} error={errors.whatsapp}>
                <input id="whatsapp" className={field} value={values.whatsapp} onChange={(e) => set('whatsapp', e.target.value)} dir="ltr" maxLength={40} />
              </Field>
            </div>
            <fieldset>
              <legend className="mb-3 block text-sm font-semibold text-ink-700">{dict.form.preferred}</legend>
              <div className="flex flex-wrap gap-2">
                {(['email', 'phone', 'whatsapp'] as const).map((m) => (
                  <label
                    key={m}
                    className={clsx(
                      'cursor-pointer rounded-full border px-5 py-2.5 text-sm font-medium transition-all duration-300',
                      values.preferredContact === m
                        ? 'border-brand bg-brand text-white'
                        : 'border-ink-900/15 bg-white text-ink-500 hover:border-ink-900/40',
                    )}
                  >
                    <input
                      type="radio"
                      name="preferredContact"
                      value={m}
                      checked={values.preferredContact === m}
                      onChange={() => set('preferredContact', m)}
                      className="sr-only"
                    />
                    {m === 'email' ? dict.common.email : m === 'phone' ? dict.common.phone : dict.common.whatsapp}
                  </label>
                ))}
              </div>
            </fieldset>
          </>
        )}
      </div>

      {state === 'error' && (
        <p role="alert" className="mt-7 rounded-lg bg-brand/10 px-4 py-3 text-sm font-medium text-brand-700">
          <strong className="block">{dict.form.errorTitle}</strong>
          {serverError}
        </p>
      )}

      <div className="mt-10 flex items-center justify-between gap-4 border-t border-ink-900/10 pt-7">
        <button
          type="button"
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
          className="text-sm font-semibold text-ink-400 transition-colors hover:text-ink-900 disabled:invisible"
        >
          ← {dict.form.back}
        </button>

        <MagneticButton type="submit" disabled={state === 'sending'}>
          {state === 'sending' ? dict.form.submitting : last ? dict.form.submit : dict.form.next}
        </MagneticButton>
      </div>
    </form>
  );
}

function Field({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-semibold text-ink-700">
        {label}
      </label>
      {children}
      {error && (
        <p role="alert" className="mt-2 text-sm font-medium text-brand-700">
          {error}
        </p>
      )}
    </div>
  );
}

function ChipGroup({
  legend,
  options,
  selected,
  onToggle,
  error,
}: {
  legend: string;
  options: string[];
  selected: string[];
  onToggle: (value: string) => void;
  error?: string;
}) {
  return (
    <fieldset>
      <legend className="sr-only">{legend}</legend>
      <div className="flex flex-wrap gap-2.5">
        {options.map((o) => {
          const on = selected.includes(o);
          return (
            <label
              key={o}
              className={clsx(
                'cursor-pointer rounded-full border px-5 py-3 text-sm font-medium transition-all duration-300 ease-noriva',
                on ? 'border-brand bg-brand text-white' : 'border-ink-900/15 bg-white text-ink-600 hover:border-ink-900/40',
              )}
            >
              <input type="checkbox" checked={on} onChange={() => onToggle(o)} className="sr-only" />
              {o}
            </label>
          );
        })}
      </div>
      {error && (
        <p role="alert" className="mt-3 text-sm font-medium text-brand-700">
          {error}
        </p>
      )}
    </fieldset>
  );
}
