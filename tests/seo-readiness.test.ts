import { describe, expect, it, vi } from 'vitest';
vi.mock('next/server', () => ({ after: vi.fn() }));
import { alternatesFor, buildMetadata, organizationSchema } from '@/lib/seo';
import { indexNowUrls, validIndexNowKey } from '@/lib/indexnow';
import { env } from '@/lib/env';

describe('search engine readiness', () => {
  it('explicitly brands homepage titles because the same-segment layout template does not apply', () => {
    const en = buildMetadata({ locale: 'en', path: '/', fallbackTitle: 'Restaurant consulting' });
    const ar = buildMetadata({ locale: 'ar', path: '/', fallbackTitle: 'إدارة المطاعم' });
    expect(en.title).toEqual({ absolute: 'Restaurant consulting — NORIVA GLOBAL' });
    expect(ar.title).toEqual({ absolute: 'إدارة المطاعم — نوريفا جلوبال' });
  });
  it('keeps reciprocal Saudi language links without replacing the canonical', () => {
    const ar = alternatesFor('ar', '/services/menu');
    const en = alternatesFor('en', '/services/menu');
    expect(ar?.canonical).toBe(`${env.siteUrl}/ar/services/menu`);
    expect(en?.canonical).toBe(`${env.siteUrl}/en/services/menu`);
    expect(ar?.languages).toEqual(en?.languages);
    expect(ar?.languages?.['en-SA']).toBe(en?.canonical);
    expect(ar?.languages?.['ar-SA']).toBe(ar?.canonical);
  });
  it('rejects canonical overrides that leak preview hosts or erase another language', () => {
    for (const canonical of ['https://preview.up.railway.app/ar/about', `${env.siteUrl}/en/about`]) {
      const meta = buildMetadata({ row: { canonical }, locale: 'ar', path: '/about', fallbackTitle: 'About' });
      expect(meta.alternates?.canonical).toBe(`${env.siteUrl}/ar/about`);
    }
  });
  it('never concatenates the origin onto an absolute CMS logo', () => {
    const data = organizationSchema({ locale: 'en', logoUrl: 'https://cdn.example.com/logo.webp' });
    expect(data.logo.url).toBe('https://cdn.example.com/logo.webp');
    expect(data).not.toHaveProperty('aggregateRating');
    expect(data.address).toBeUndefined();
  });
  it('provides an absolute share image on section pages', () => {
    const meta = buildMetadata({ locale: 'en', path: '/contact', fallbackTitle: 'Contact' });
    expect(JSON.stringify(meta.openGraph?.images)).toContain(`${env.siteUrl}/img/`);
  });
  it('only submits changed public URLs and deduplicates them', () => {
    const urls = indexNowUrls(['/services/menu', '/services/menu', '/admin', '/api/inquiry', '/search?q=x']);
    expect(urls).toEqual([`${env.siteUrl}/en/services/menu`, `${env.siteUrl}/ar/services/menu`]);
    expect(validIndexNowKey('12345678')).toBe(true);
    expect(validIndexNowKey('../key')).toBe(false);
    expect(validIndexNowKey('')).toBe(false);
  });
});
