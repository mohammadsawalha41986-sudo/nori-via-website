'use client';

import { useState } from 'react';
import clsx from 'clsx';
import { MagneticButton } from '../ui/Button';
import type { Dictionary } from '@/lib/dictionary';
import type { Locale } from '@/lib/i18n';

const field =
  'w-full rounded-lg border border-ink-900/15 bg-white px-4 py-3.5 text-[0.9375rem] text-ink-900 outline-none transition-colors duration-200 placeholder:text-ink-300 focus:border-brand';

export function ContactForm({ dict, locale }: { dict: Dictionary; locale: Locale }) {
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [error, setError] = useState('');

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState('sending');
    setError('');

    const data = Object.fromEntries(new FormData(e.currentTarget).entries());

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ ...data, locale }),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(body.error || 'failed');
      }
      setState('sent');
      e.currentTarget.reset();
    } catch {
      setState('error');
      setError(dict.form.errorBody);
    }
  }

  if (state === 'sent') {
    return (
      <div className="rounded-2xl border border-brand/25 bg-brand/[0.06] p-8">
        <p className="font-display text-xl font-display-soft uppercase text-ink-900">{dict.form.successTitle}</p>
        <p className="mt-3 text-[0.9375rem] leading-relaxed text-ink-500">{dict.contact.sent}</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate={false}>
      {/* Honeypot — hidden from people, tempting to bots. */}
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="c_company_website">Company website</label>
        <input id="c_company_website" name="company_website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="c_name" className="mb-2 block text-sm font-semibold text-ink-700">
            {dict.form.name} *
          </label>
          <input id="c_name" name="name" required minLength={2} maxLength={120} className={field} autoComplete="name" />
        </div>
        <div>
          <label htmlFor="c_email" className="mb-2 block text-sm font-semibold text-ink-700">
            {dict.common.email} *
          </label>
          <input id="c_email" name="email" type="email" required maxLength={160} className={field} autoComplete="email" dir="ltr" />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="c_phone" className="mb-2 block text-sm font-semibold text-ink-700">
            {dict.common.phone} <span className="font-normal text-ink-300">({dict.common.optional})</span>
          </label>
          <input id="c_phone" name="phone" type="tel" maxLength={40} className={field} autoComplete="tel" dir="ltr" />
        </div>
        <div>
          <label htmlFor="c_subject" className="mb-2 block text-sm font-semibold text-ink-700">
            {dict.contact.subject}
          </label>
          <input id="c_subject" name="subject" maxLength={160} className={field} />
        </div>
      </div>

      <div>
        <label htmlFor="c_message" className="mb-2 block text-sm font-semibold text-ink-700">
          {dict.contact.message} *
        </label>
        <textarea id="c_message" name="message" required minLength={10} maxLength={4000} rows={6} className={clsx(field, 'resize-y')} />
      </div>

      {state === 'error' && (
        <p role="alert" className="rounded-lg bg-brand/10 px-4 py-3 text-sm font-medium text-brand-700">
          {error}
        </p>
      )}

      <MagneticButton type="submit" disabled={state === 'sending'}>
        {state === 'sending' ? dict.form.submitting : dict.contact.send}
      </MagneticButton>
    </form>
  );
}
