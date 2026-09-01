'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useTransition } from 'react';
import clsx from 'clsx';
import { locales, type Locale } from '@/lib/i18n';

const LABELS: Record<Locale, string> = { en: 'EN', ar: 'ع' };
const FULL: Record<Locale, string> = { en: 'English', ar: 'العربية' };

export function LanguageSwitcher({ locale, tone = 'dark' }: { locale: Locale; tone?: 'dark' | 'light' }) {
  const pathname = usePathname();
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function switchTo(next: Locale) {
    if (next === locale) return;
    // Remember the choice so the middleware honours it on the next visit.
    document.cookie = `noriva_locale=${next};path=/;max-age=31536000;samesite=lax`;
    const rest = pathname.replace(new RegExp(`^/(${locales.join('|')})`), '') || '';
    startTransition(() => router.push(`/${next}${rest}`));
  }

  return (
    <div
      role="group"
      aria-label="Language"
      className={clsx(
        'flex items-center rounded-full border p-0.5 text-xs font-bold',
        tone === 'light' ? 'border-white/25' : 'border-ink-900/15',
        pending && 'opacity-60',
      )}
    >
      {locales.map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => switchTo(l)}
          aria-label={FULL[l]}
          aria-current={l === locale ? 'true' : undefined}
          className={clsx(
            'min-w-8 rounded-full px-2.5 py-1.5 transition-colors duration-300',
            l === locale
              ? 'bg-brand text-white'
              : tone === 'light'
                ? 'text-white/65 hover:text-white'
                : 'text-ink-400 hover:text-ink-900',
          )}
        >
          {LABELS[l]}
        </button>
      ))}
    </div>
  );
}
