export const locales = ['en', 'ar'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'en';

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

export function dirOf(locale: Locale) {
  return locale === 'ar' ? 'rtl' : 'ltr';
}

/**
 * Picks the `${field}En` / `${field}Ar` variant off a record, falling back to
 * the other language when a translation has not been filled in yet — an empty
 * Arabic field should never blank out the page.
 */
export function pick<T extends Record<string, unknown>>(
  row: T | null | undefined,
  field: string,
  locale: Locale,
): string {
  if (!row) return '';
  const primary = row[`${field}${locale === 'ar' ? 'Ar' : 'En'}`];
  const fallback = row[`${field}${locale === 'ar' ? 'En' : 'Ar'}`];
  const value = typeof primary === 'string' && primary.trim() ? primary : fallback;
  return typeof value === 'string' ? value : '';
}

export function localePath(locale: Locale, path = '/') {
  const clean = path === '/' ? '' : path.startsWith('/') ? path : `/${path}`;
  return `/${locale}${clean}` || `/${locale}`;
}

export function formatDate(date: Date | string | null | undefined, locale: Locale) {
  if (!date) return '';
  const d = typeof date === 'string' ? new Date(date) : date;
  if (Number.isNaN(d.getTime())) return '';
  return new Intl.DateTimeFormat(locale === 'ar' ? 'ar-SA' : 'en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(d);
}
