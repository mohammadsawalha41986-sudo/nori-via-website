import { describe, it, expect } from 'vitest';
import { inquirySchema, contactSchema, loginSchema, serviceSchema, slugify } from '../src/lib/validation';

const validInquiry = {
  name: 'Sara Al-Otaibi',
  business: 'Bayt Restaurant',
  services: ['Social Media'],
  email: 'sara@example.com',
};

describe('inquirySchema', () => {
  it('accepts a minimal real submission and applies defaults', () => {
    const result = inquirySchema.safeParse(validInquiry);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.preferredContact).toBe('email');
      expect(result.data.locale).toBe('en');
      expect(result.data.goals).toEqual([]);
    }
  });

  it('requires at least one service', () => {
    expect(inquirySchema.safeParse({ ...validInquiry, services: [] }).success).toBe(false);
  });

  it('rejects an invalid email address', () => {
    expect(inquirySchema.safeParse({ ...validInquiry, email: 'not-an-email' }).success).toBe(false);
  });

  it('rejects a name that is too short', () => {
    expect(inquirySchema.safeParse({ ...validInquiry, name: 'A' }).success).toBe(false);
  });

  it('rejects an over-length description rather than truncating silently', () => {
    const result = inquirySchema.safeParse({ ...validInquiry, description: 'x'.repeat(5001) });
    expect(result.success).toBe(false);
  });

  it('rejects a filled honeypot field', () => {
    expect(inquirySchema.safeParse({ ...validInquiry, company_website: 'spam' }).success).toBe(false);
  });

  it('rejects an unknown preferred contact method', () => {
    expect(inquirySchema.safeParse({ ...validInquiry, preferredContact: 'telegram' }).success).toBe(false);
  });

  it('trims surrounding whitespace', () => {
    const result = inquirySchema.safeParse({ ...validInquiry, name: '  Sara  ' });
    expect(result.success && result.data.name).toBe('Sara');
  });

  it('accepts an Arabic submission', () => {
    const result = inquirySchema.safeParse({
      ...validInquiry,
      name: 'سارة العتيبي',
      business: 'مطعم بيت',
      locale: 'ar',
      description: 'نريد تحسين حسابنا على إنستغرام.',
    });
    expect(result.success).toBe(true);
  });
});

describe('contactSchema', () => {
  it('requires a message of reasonable length', () => {
    const base = { name: 'Sara', email: 'sara@example.com' };
    expect(contactSchema.safeParse({ ...base, message: 'hi' }).success).toBe(false);
    expect(contactSchema.safeParse({ ...base, message: 'Hello, I would like a quote.' }).success).toBe(true);
  });
});

describe('loginSchema', () => {
  it('enforces a minimum password length', () => {
    expect(loginSchema.safeParse({ email: 'a@b.co', password: 'short' }).success).toBe(false);
    expect(loginSchema.safeParse({ email: 'a@b.co', password: 'longenough1' }).success).toBe(true);
  });
});

describe('slugify', () => {
  it('produces URL-safe slugs', () => {
    expect(slugify('Menu Engineering & Pricing')).toBe('menu-engineering-pricing');
    expect(slugify('  Multiple   Spaces  ')).toBe('multiple-spaces');
  });
});

describe('summarise', () => {
  it('returns short text unchanged', async () => {
    const { summarise } = await import('../src/lib/seo-text');
    expect(summarise('A short policy line.')).toBe('A short policy line.');
  });

  it('collapses whitespace and newlines', async () => {
    const { summarise } = await import('../src/lib/seo-text');
    expect(summarise('Line one.\n\n  Line   two.')).toBe('Line one. Line two.');
  });

  it('cuts at a sentence boundary when one is available', async () => {
    const { summarise } = await import('../src/lib/seo-text');
    // The sentence must end past the 60-char guard for the boundary cut to win.
    const text = `${'This first sentence runs well past sixty characters so the boundary cut applies. '}${'x'.repeat(300)}`;
    const out = summarise(text);
    expect(out.endsWith('.')).toBe(true);
    expect(out.length).toBeLessThanOrEqual(155);
  });

  it('falls back to a word-boundary ellipsis with no sentence break', async () => {
    const { summarise } = await import('../src/lib/seo-text');
    const out = summarise('alpha bravo charlie delta '.repeat(20));
    expect(out.endsWith('…')).toBe(true);
    expect(out.length).toBeLessThanOrEqual(156);
  });

  it('handles empty input', async () => {
    const { summarise } = await import('../src/lib/seo-text');
    expect(summarise('')).toBe('');
    expect(summarise('   \n  ')).toBe('');
  });

  it('summarises Arabic copy', async () => {
    const { summarise } = await import('../src/lib/seo-text');
    expect(summarise('هذه الصفحة نص مبدئي. استبدله من لوحة التحكم.')).toContain('هذه الصفحة');
  });
});

/**
 * The three image slots on a service do different jobs, and each of them ends
 * up in a `next/image` src or a share card. A value the renderer cannot use
 * has to be refused at the form, not at request time on a public page.
 */
describe('service image slots', () => {
  const base = { slug: 'menu-strategy', nameEn: 'Menu Strategy' };

  it('accepts same-origin paths and https URLs in every slot', () => {
    const parsed = serviceSchema.parse({
      ...base,
      featuredImage: '/media/menu-hero.jpg',
      ogImage: 'https://cdn.example.com/share.png',
      gallery: [{ url: '/img/gallery-1.jpg', altEn: 'Plated dish', altAr: 'طبق' }],
    });
    expect(parsed.featuredImage).toBe('/media/menu-hero.jpg');
    expect(parsed.ogImage).toBe('https://cdn.example.com/share.png');
    expect(parsed.gallery[0]!.url).toBe('/img/gallery-1.jpg');
  });

  it('treats every slot as optional and keeps them independent', () => {
    const parsed = serviceSchema.parse(base);
    expect(parsed.featuredImage).toBe('');
    expect(parsed.ogImage).toBe('');
    expect(parsed.gallery).toEqual([]);
  });

  it.each([
    ['javascript:alert(1)'],
    ['data:text/html,<script>alert(1)</script>'],
    ['menu-hero.jpg'],
    ['http://cdn.example.com/share.png'],
  ])('refuses %s as a featured image', (value) => {
    expect(serviceSchema.safeParse({ ...base, featuredImage: value }).success).toBe(false);
  });

  it('refuses an unusable gallery row and says which one', () => {
    const result = serviceSchema.safeParse({
      ...base,
      gallery: [{ url: '/img/ok.jpg' }, { url: 'javascript:alert(1)' }],
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]!.message).toContain('Row 2');
    }
  });
});
