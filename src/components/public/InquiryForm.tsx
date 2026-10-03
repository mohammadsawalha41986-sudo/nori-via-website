'use client';
import { useEffect, useRef, useState } from 'react';
import { FileUploader } from './FileUploader';
import { track, EVENTS } from '@/lib/track';
import type { Dictionary } from '@/lib/dictionary';
import type { Locale } from '@/lib/i18n';
const inputClass =
  'w-full rounded-input border border-ink-900/20 bg-white px-4 py-3.5 text-base text-ink-900';
const needs = [
  ['launch', 'New restaurant', 'مطعم جديد'],
  ['existing', 'Existing restaurant', 'مطعم قائم'],
  ['finance', 'Profitability', 'الربحية'],
  ['menu', 'Menu', 'القائمة'],
  ['operations', 'Operations', 'التشغيل'],
  ['marketing', 'Marketing', 'التسويق'],
  ['brand', 'Branding', 'العلامة'],
  ['delivery', 'Delivery', 'التوصيل'],
  ['growth', 'Expansion', 'التوسع'],
  ['unsure', 'Not sure', 'غير متأكد'],
] as const;
type Values = {
  need: string;
  business: string;
  businessType: string;
  city: string;
  branches: string;
  status: string;
  description: string;
  name: string;
  email: string;
  phone: string;
  preferredContact: 'email' | 'phone' | 'whatsapp';
};
const initial: Values = {
  need: '',
  business: '',
  businessType: '',
  city: '',
  branches: '1',
  status: '',
  description: '',
  name: '',
  email: '',
  phone: '',
  preferredContact: 'email',
};
export function InquiryForm({ dict, locale }: { dict: Dictionary; locale: Locale }) {
  const ar = locale === 'ar';
  const [step, setStep] = useState(0);
  const [values, setValues] = useState(initial);
  const [files, setFiles] = useState<File[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [state, setState] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');
  const [serverError, setServerError] = useState('');
  const heading = useRef<HTMLHeadingElement>(null);
  const started = useRef(false);
  useEffect(() => {
    const need = new URLSearchParams(window.location.search).get('need');
    if (needs.some((n) => n[0] === need)) setValues((v) => ({ ...v, need: need! }));
  }, []);
  useEffect(() => {
    if (step > 0) heading.current?.focus();
  }, [step]);
  function set<K extends keyof Values>(key: K, value: Values[K]) {
    if (!started.current) {
      started.current = true;
      track(EVENTS.formStart);
    }
    setValues((v) => ({ ...v, [key]: value }));
    setErrors((e) => ({ ...e, [key]: '' }));
  }
  function validate(index: number) {
    const e: Record<string, string> = {};
    if (index === 0 && !values.need) e.need = dict.form.selectOne;
    if (index === 1 && values.description.trim().length < 10)
      e.description = dict.form.fieldRequired;
    if (index === 2) {
      if (values.name.trim().length < 2) e.name = dict.form.fieldRequired;
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) e.email = dict.form.invalidEmail;
      if (values.phone.trim().replace(/\D/g, '').length < 7) e.phone = dict.form.fieldRequired;
    }
    setErrors(e);
    return !Object.keys(e).length;
  }
  async function submit() {
    if (!validate(2)) return;
    setState('sending');
    setServerError('');
    const chosen = needs.find((n) => n[0] === values.need)!;
    const answers = [
      ['businessType', ar ? 'نوع النشاط' : 'Business type', values.businessType],
      ['city', ar ? 'المدينة' : 'City', values.city],
      ['branches', ar ? 'عدد الفروع' : 'Branches', values.branches],
      ['status', ar ? 'حالة المشروع' : 'Current status', values.status],
    ]
      .filter(([, , v]) => v)
      .map(([key, label, value]) => ({ key, label, value }));
    const body = new FormData();
    body.append(
      'payload',
      JSON.stringify({
        name: values.name,
        business: values.business,
        services: [chosen[ar ? 2 : 1]],
        description: values.description,
        email: values.email,
        phone: values.phone,
        whatsapp: values.preferredContact === 'whatsapp' ? values.phone : '',
        preferredContact: values.preferredContact,
        locale,
        answers,
      }),
    );
    files.forEach((f) => body.append('files', f));
    body.append('company_website', '');
    try {
      const res = await fetch('/api/inquiry', { method: 'POST', body });
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json.error || dict.form.errorBody);
      }
      track(EVENTS.formComplete);
      setState('done');
    } catch (e) {
      setServerError(e instanceof Error ? e.message : dict.form.errorBody);
      setState('error');
    }
  }
  function field(key: keyof Values, label: string, required = false, type = 'text') {
    return (
      <label className="block" key={key}>
        <span className="mb-2 block text-sm font-semibold">
          {label}
          {required ? ' *' : ''}
        </span>
        <input
          id={key}
          type={type}
          value={values[key]}
          onChange={(e) => set(key, e.target.value as never)}
          className={inputClass}
          maxLength={key === 'name' ? 120 : key === 'email' ? 160 : key === 'phone' ? 40 : 160}
          required={required}
          aria-invalid={!!errors[key]}
          aria-describedby={errors[key] ? `${key}-error` : undefined}
          dir={['email', 'phone'].includes(key) ? 'ltr' : undefined}
          autoComplete={
            key === 'name'
              ? 'name'
              : key === 'email'
                ? 'email'
                : key === 'phone'
                  ? 'tel'
                  : key === 'business'
                    ? 'organization'
                    : undefined
          }
        />
        {errors[key] && (
          <span id={`${key}-error`} className="mt-2 block text-sm text-red-700">
            {errors[key]}
          </span>
        )}
      </label>
    );
  }
  if (state === 'done')
    return (
      <div role="status" className="border-t-2 border-brand bg-bone p-10">
        <h2 className="font-display text-3xl">{dict.form.successTitle}</h2>
        <p className="mt-5">{dict.form.successBody}</p>
      </div>
    );
  const titles = ar
    ? ['ما الذي تحتاج مساعدة فيه؟', 'حدثنا عن مشروعك', 'كيف نتواصل معك؟']
    : ['What do you need help with?', 'Tell us about your restaurant', 'How can we reach you?'];
  return (
    <form
      className="border-t-2 border-ink-900 bg-bone p-6 sm:p-10"
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        if (step === 2) void submit();
        else if (validate(step)) {
          track(EVENTS.formStep, { step: step + 1 });
          setStep(step + 1);
        }
      }}
    >
      <div className="mb-7 flex gap-2" aria-label={ar ? 'تقدم الطلب' : 'Inquiry progress'}>
        {titles.map((title, i) => (
          <span key={title} className={`h-1 flex-1 ${i <= step ? 'bg-brand' : 'bg-ink-900/15'}`} />
        ))}
      </div>
      <p className="mb-3 text-xs text-ink-500">
        {dict.form.step} {step + 1} {dict.form.of} 3
      </p>
      <h2 ref={heading} tabIndex={-1} className="font-display text-2xl sm:text-3xl">
        {titles[step]}
      </h2>
      <div className="mt-8 space-y-6">
        {step === 0 && (
          <fieldset>
            <legend className="sr-only">{titles[0]}</legend>
            <div className="grid gap-3 sm:grid-cols-2">
              {needs.map(([id, en, arabic]) => (
                <label
                  key={id}
                  className={`flex min-h-14 cursor-pointer items-center gap-3 border px-4 py-3 ${values.need === id ? 'border-brand bg-white' : 'border-ink-900/20'}`}
                >
                  <input
                    type="radio"
                    name="need"
                    value={id}
                    checked={values.need === id}
                    onChange={() => set('need', id)}
                  />
                  {ar ? arabic : en}
                </label>
              ))}
            </div>
            {errors.need && (
              <p role="alert" className="mt-4 text-red-700">
                {errors.need}
              </p>
            )}
          </fieldset>
        )}
        {step === 1 && (
          <>
            {field('business', ar ? 'اسم المطعم أو المشروع' : 'Restaurant or business name')}
            <div className="grid gap-5 sm:grid-cols-2">
              {field('city', ar ? 'المدينة' : 'City')}
              <label>
                <span className="mb-2 block text-sm font-semibold">
                  {ar ? 'عدد الفروع' : 'Number of branches'}
                </span>
                <input
                  type="number"
                  min="0"
                  max="9999"
                  value={values.branches}
                  onChange={(e) => set('branches', e.target.value)}
                  className={inputClass}
                />
              </label>
              <label>
                <span className="mb-2 block text-sm font-semibold">
                  {ar ? 'نوع النشاط' : 'Business type'}
                </span>
                <select
                  className={inputClass}
                  value={values.businessType}
                  onChange={(e) => set('businessType', e.target.value)}
                >
                  <option value="">{dict.form.choose}</option>
                  {[
                    ['Restaurant', 'مطعم'],
                    ['Café', 'مقهى'],
                    ['Bakery', 'مخبز أو حلويات'],
                    ['Cloud kitchen', 'مطبخ سحابي'],
                    ['Other F&B', 'نشاط غذائي آخر'],
                  ].map(([en, arabic]) => (
                    <option key={en} value={en}>
                      {ar ? arabic : en}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                <span className="mb-2 block text-sm font-semibold">
                  {ar ? 'حالة المشروع' : 'Current status'}
                </span>
                <select
                  className={inputClass}
                  value={values.status}
                  onChange={(e) => set('status', e.target.value)}
                >
                  <option value="">{dict.form.choose}</option>
                  {[
                    ['Idea', 'فكرة'],
                    ['Pre-opening', 'قبل الافتتاح'],
                    ['Operating', 'قائم'],
                    ['Expanding', 'التوسع'],
                  ].map(([en, arabic]) => (
                    <option key={en} value={en}>
                      {ar ? arabic : en}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <label className="block">
              <span className="mb-2 block text-sm font-semibold">
                {ar ? 'ما التحدي الرئيسي؟' : 'What is the main challenge?'} *
              </span>
              <textarea
                rows={4}
                maxLength={5000}
                className={inputClass}
                value={values.description}
                onChange={(e) => set('description', e.target.value)}
                aria-invalid={!!errors.description}
                aria-describedby={errors.description ? 'description-error' : undefined}
              />
              {errors.description && (
                <span id="description-error" className="mt-2 block text-red-700">
                  {errors.description}
                </span>
              )}
            </label>
            <FileUploader files={files} onChange={setFiles} dict={dict} />
          </>
        )}
        {step === 2 && (
          <>
            <div className="grid gap-5 sm:grid-cols-2">
              {field('name', dict.form.name, true)}
              {field('phone', dict.request.phone, true, 'tel')}
              {field('email', dict.request.email, true, 'email')}
            </div>
            <label className="block">
              <span className="mb-2 block text-sm font-semibold">{dict.form.preferred}</span>
              <select
                className={inputClass}
                value={values.preferredContact}
                onChange={(e) =>
                  set('preferredContact', e.target.value as Values['preferredContact'])
                }
              >
                <option value="email">{dict.request.email}</option>
                <option value="phone">{dict.request.phone}</option>
                <option value="whatsapp">WhatsApp</option>
              </select>
            </label>
          </>
        )}
      </div>
      {serverError && (
        <p role="alert" className="mt-6 text-red-700">
          {serverError}
        </p>
      )}
      <div className="mt-8 flex justify-between gap-4">
        {step > 0 ? (
          <button
            type="button"
            className="min-h-12 border border-ink-900/20 px-5 py-3"
            onClick={() => setStep(step - 1)}
            disabled={state === 'sending'}
          >
            {dict.form.back}
          </button>
        ) : (
          <span />
        )}
        <button
          type="submit"
          disabled={state === 'sending'}
          className="min-h-12 rounded-btn bg-ink-900 px-7 py-3 font-semibold text-white disabled:opacity-50"
        >
          {state === 'sending'
            ? ar
              ? 'جارٍ الإرسال…'
              : 'Sending…'
            : step === 2
              ? dict.form.submit
              : dict.form.next}
        </button>
      </div>
    </form>
  );
}
