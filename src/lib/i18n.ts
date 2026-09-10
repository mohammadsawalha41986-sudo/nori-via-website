export const locales = ['en', 'ar'] as const;
export type Locale = (typeof locales)[number];

/**
 * Arabic is the house language: a visitor who has never chosen one lands on
 * the Arabic site, whatever their browser advertises. English stays one click
 * away in the header, and the choice is remembered in `LOCALE_COOKIE`.
 */
export const defaultLocale: Locale = 'ar';

/** Cookie that stores an explicit language choice made in the switcher. */
export const LOCALE_COOKIE = 'noriva_locale';

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

/**
 * Resolves the locale for an unprefixed request.
 *
 * Only an explicit, remembered choice can move a visitor off Arabic —
 * `Accept-Language` is deliberately ignored, because an Arabic-speaking guest
 * on an English-configured phone is the common case here, not the exception.
 */
export function resolveLocale(cookieValue?: string | null): Locale {
  if (cookieValue && isLocale(cookieValue)) return cookieValue;
  return defaultLocale;
}

/**
 * Reads the locale out of a pathname. Routes rendered outside the params tree
 * — the `error` and `not-found` boundaries — have no `params` to read, but the
 * segment is still right there in the URL.
 */
export function localeFromPath(pathname: string): Locale {
  const segment = pathname.split('/')[1] ?? '';
  return isLocale(segment) ? segment : defaultLocale;
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
