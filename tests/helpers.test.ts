import { describe, it, expect } from 'vitest';
import {
  parsePairs,
  stringifyPairs,
  parseMetrics,
  stringifyMetrics,
  parseUrlList,
  parseFaqs,
  parseBlocks,
  checkbox,
  nullableId,
} from '../src/server/helpers';

describe('parsePairs / stringifyPairs', () => {
  it('round-trips bilingual list content', () => {
    const raw = 'Monthly content calendar | تقويم محتوى شهري\nShoot days | أيام تصوير';
    const parsed = parsePairs(raw);
    expect(parsed).toEqual([
      { labelEn: 'Monthly content calendar', labelAr: 'تقويم محتوى شهري' },
      { labelEn: 'Shoot days', labelAr: 'أيام تصوير' },
    ]);
    expect(stringifyPairs(parsed)).toBe(raw);
  });

  it('tolerates a missing Arabic column and blank lines', () => {
    expect(parsePairs('Only English\n\n  \n')).toEqual([{ labelEn: 'Only English', labelAr: '' }]);
  });
});

describe('parseMetrics', () => {
  it('keeps only complete metric rows', () => {
    const parsed = parseMetrics('3.4x | Return on ad spend | العائد\nincomplete\n| | ');
    expect(parsed).toEqual([{ value: '3.4x', labelEn: 'Return on ad spend', labelAr: 'العائد' }]);
  });

  it('round-trips through stringifyMetrics', () => {
    const parsed = parseMetrics('12 | Covers per night | ');
    expect(stringifyMetrics(parsed)).toBe('12 | Covers per night');
  });
});

describe('parseUrlList', () => {
  it('drops rows without a URL', () => {
    const parsed = parseUrlList('/media/a.jpg | Dish | طبق\n | no url');
    expect(parsed).toEqual([{ url: '/media/a.jpg', altEn: 'Dish', altAr: 'طبق' }]);
  });

  it('supports the label key for downloads', () => {
    expect(parseUrlList('/media/deck.pdf | Deck', 'label')).toEqual([
      { url: '/media/deck.pdf', labelEn: 'Deck', labelAr: '' },
    ]);
  });
});

describe('parseFaqs and parseBlocks', () => {
  it('requires both a question and an answer', () => {
    expect(parseFaqs('Q1 | س١ | A1 | ج١')).toHaveLength(1);
    expect(parseFaqs('Q1 | س١ | | ')).toHaveLength(0);
  });

  it('requires a title for a process block', () => {
    expect(parseBlocks('Discovery | استكشاف | We start here | نبدأ هنا')).toHaveLength(1);
    expect(parseBlocks(' | | body only | ')).toHaveLength(0);
  });
});

describe('form helpers', () => {
  it('reads checkbox values', () => {
    const fd = new FormData();
    fd.set('a', 'on');
    fd.set('b', 'false');
    expect(checkbox(fd, 'a')).toBe(true);
    expect(checkbox(fd, 'b')).toBe(false);
    expect(checkbox(fd, 'missing')).toBe(false);
  });

  it('converts empty relation selects to null', () => {
    expect(nullableId('')).toBeNull();
    expect(nullableId('   ')).toBeNull();
    expect(nullableId('abc123')).toBe('abc123');
    expect(nullableId(null)).toBeNull();
  });
});
