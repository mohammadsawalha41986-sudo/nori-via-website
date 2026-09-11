import { describe, it, expect } from 'vitest';
import { pick, dirOf, isLocale, localePath, formatDate, resolveLocale, defaultLocale } from '../src/lib/i18n';
import { withBrand, stripBrandSuffix, isBrandName } from '../src/lib/brand';

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

  it('opens in Arabic by default', () => {
    expect(defaultLocale).toBe('ar');
  });

  it('formats dates per locale and tolerates bad input', () => {
    expect(formatDate('2026-03-14', 'en')).toContain('2026');
    expect(formatDate('not-a-date', 'en')).toBe('');
    expect(formatDate(null, 'ar')).toBe('');
  });
});

describe('resolveLocale', () => {
  it('sends a first-time visitor to Arabic', () => {
    expect(resolveLocale(undefined)).toBe('ar');
    expect(resolveLocale(null)).toBe('ar');
    expect(resolveLocale('')).toBe('ar');
  });

  it('honours a remembered choice', () => {
    expect(resolveLocale('en')).toBe('en');
    expect(resolveLocale('ar')).toBe('ar');
  });

  it('ignores an unknown cookie value', () => {
    expect(resolveLocale('fr')).toBe(defaultLocale);
  });
});

describe('withBrand', () => {
  it('leaves a title that already names the brand untouched', () => {
    expect(withBrand('NORIVA GLOBAL — Restaurant Consulting', 'en')).toBe(
      'NORIVA GLOBAL — Restaurant Consulting',
    );
    expect(withBrand('نوريفا جلوبال — استشارات المطاعم', 'ar')).toBe('نوريفا جلوبال — استشارات المطاعم');
  });

  it('completes a title that opens with the short name', () => {
    expect(withBrand('NORIVA — Restaurant Marketing', 'en')).toBe('NORIVA GLOBAL — Restaurant Marketing');
    expect(withBrand('نوريفا — تسويق المطاعم', 'ar')).toBe('نوريفا جلوبال — تسويق المطاعم');
  });

  it('appends the brand to an unrelated title', () => {
    expect(withBrand('Menu Engineering', 'en')).toBe('Menu Engineering — NORIVA GLOBAL');
  });

  it('falls back to the brand alone when there is no title', () => {
    expect(withBrand('   ', 'en')).toBe('NORIVA GLOBAL');
    expect(withBrand('', 'ar')).toBe('نوريفا جلوبال');
  });
});

describe('stripBrandSuffix', () => {
  it('removes a trailing brand so the title template does not double it', () => {
    expect(stripBrandSuffix('قراءة القائمة بوصفها وثيقة تجارية — نوريفا')).toBe(
      'قراءة القائمة بوصفها وثيقة تجارية',
    );
    expect(stripBrandSuffix('Menu Engineering — Noriva')).toBe('Menu Engineering');
    expect(stripBrandSuffix('Menu Engineering — NORIVA GLOBAL')).toBe('Menu Engineering');
  });

  it('removes a suffix that was appended more than once', () => {
    expect(stripBrandSuffix('Menu Engineering — Noriva — NORIVA GLOBAL')).toBe('Menu Engineering');
  });

  it('leaves a brand mentioned inside the title alone', () => {
    expect(stripBrandSuffix('How NORIVA reads a menu')).toBe('How NORIVA reads a menu');
  });

  it('never returns an empty title', () => {
    expect(stripBrandSuffix('NORIVA GLOBAL')).toBe('NORIVA GLOBAL');
  });
});

describe('isBrandName', () => {
  it('treats the company, in any spelling, as the organisation', () => {
    for (const value of ['Noriva', 'NORIVA GLOBAL', 'نوريفا', 'نوريفا جلوبال', '  noriva  ', '']) {
      expect(isBrandName(value)).toBe(true);
    }
    expect(isBrandName(null)).toBe(true);
  });

  it('treats a real byline as a person', () => {
    expect(isBrandName('Mohammad Sawalha')).toBe(false);
  });
});

describe('stripBrandSuffix separators', () => {
  it('handles the pipe separator the shipped titles also use', () => {
    expect(stripBrandSuffix('Insights — Restaurant Strategy | Noriva')).toBe(
      'Insights — Restaurant Strategy',
    );
    expect(stripBrandSuffix('نمو المطاعم — القائمة والهامش | نوريفا')).toBe(
      'نمو المطاعم — القائمة والهامش',
    );
  });
});

describe('stripBrandSuffix brand segments', () => {
  it('drops the brand but keeps the section word that tells pages apart', () => {
    expect(stripBrandSuffix('Café KPI Dashboard — Noriva Library')).toBe('Café KPI Dashboard — Library');
    expect(stripBrandSuffix('لوحة مؤشرات أداء المقهى — مكتبة نوريفا')).toBe('لوحة مؤشرات أداء المقهى — مكتبة');
  });

  it('keeps two same-named pages distinguishable', () => {
    // A tool and a library resource share this name; the section word is the
    // only thing separating their titles.
    expect(stripBrandSuffix('Food Cost Calculator — Noriva')).toBe('Food Cost Calculator');
    expect(stripBrandSuffix('Food Cost Calculator — Noriva Library')).toBe(
      'Food Cost Calculator — Library',
    );
  });

  it('keeps a trailing clause that is not just a brand tag', () => {
    expect(stripBrandSuffix('Menu Engineering — what NORIVA looks at in a menu review')).toBe(
      'Menu Engineering — what NORIVA looks at in a menu review',
    );
    expect(stripBrandSuffix('Restaurant Growth — Menu, Margin and Operations')).toBe(
      'Restaurant Growth — Menu, Margin and Operations',
    );
  });
});
