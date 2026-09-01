import { describe, it, expect } from 'vitest';
import { inquirySchema, contactSchema, loginSchema, slugify } from '../src/lib/validation';

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
