import { describe, it, expect } from 'vitest';
import { pick, dirOf, isLocale, localePath, formatDate } from '../src/lib/i18n';

const row = {
  titleEn: 'Menu Engineering',
  titleAr: 'هندسة القوائم',
  summaryEn: 'English only',
  summaryAr: '',
  emptyEn: '',
  emptyAr: '',
};

describe('pick', () => {
  it('returns the requested language', () => {
    expect(pick(row, 'title', 'en')).toBe('Menu Engineering');
    expect(pick(row, 'title', 'ar')).toBe('هندسة القوائم');
  });

  it('falls back to the other language when a translation is missing', () => {
    // An untranslated Arabic field must never blank out the page.
    expect(pick(row, 'summary', 'ar')).toBe('English only');
  });

  it('returns an empty string when both are missing', () => {
    expect(pick(row, 'empty', 'en')).toBe('');
  });

  it('handles a null row', () => {
    expect(pick(null, 'title', 'en')).toBe('');
  });

  it('ignores whitespace-only translations', () => {
    expect(pick({ aEn: 'Real', aAr: '   ' }, 'a', 'ar')).toBe('Real');
  });
});

describe('locale helpers', () => {
  it('maps direction correctly', () => {
    expect(dirOf('en')).toBe('ltr');
    expect(dirOf('ar')).toBe('rtl');
  });

  it('validates locale codes', () => {
    expect(isLocale('en')).toBe(true);
    expect(isLocale('ar')).toBe(true);
    expect(isLocale('fr')).toBe(false);
  });

  it('builds locale-prefixed paths', () => {
    expect(localePath('ar', '/work')).toBe('/ar/work');
    expect(localePath('en', '/')).toBe('/en');
  });

  it('formats dates per locale and tolerates bad input', () => {
    expect(formatDate('2026-03-14', 'en')).toContain('2026');
    expect(formatDate('not-a-date', 'en')).toBe('');
    expect(formatDate(null, 'ar')).toBe('');
  });
});
