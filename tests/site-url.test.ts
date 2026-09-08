import { describe, it, expect } from 'vitest';
import {
  CANONICAL_SITE_URL,
  isPlatformHost,
  publicWebsiteUrl,
  resolveSiteUrl,
} from '../src/lib/site-url';

describe('isPlatformHost', () => {
  it('recognises hosting-platform hostnames', () => {
    expect(isPlatformHost('nori-via-website-production.up.railway.app')).toBe(true);
    expect(isPlatformHost('anything.railway.app')).toBe(true);
    expect(isPlatformHost('service.railway.internal')).toBe(true);
    expect(isPlatformHost('preview.vercel.app')).toBe(true);
    // Case and a trailing dot must not smuggle a platform host through.
    expect(isPlatformHost('NORI-VIA.UP.RAILWAY.APP.')).toBe(true);
  });

  it('leaves real domains alone', () => {
    expect(isPlatformHost('norivaglobal.com')).toBe(false);
    expect(isPlatformHost('www.norivaglobal.com')).toBe(false);
    // A brand domain that merely contains the word is still a brand domain.
    expect(isPlatformHost('railway.appliances.com')).toBe(false);
  });
});

describe('resolveSiteUrl', () => {
  it('never returns a platform hostname in production', () => {
    expect(
      resolveSiteUrl('https://nori-via-website-production.up.railway.app', true),
    ).toBe(CANONICAL_SITE_URL);
    expect(resolveSiteUrl('https://nori-via-website-production.up.railway.app/', false)).toBe(
      'http://localhost:3000',
    );
  });

  it('keeps a configured public origin', () => {
    expect(resolveSiteUrl('https://norivaglobal.com', true)).toBe('https://norivaglobal.com');
    expect(resolveSiteUrl('https://norivaglobal.com/', true)).toBe('https://norivaglobal.com');
    expect(resolveSiteUrl('norivaglobal.com', true)).toBe('https://norivaglobal.com');
  });

  it('falls back by environment when nothing usable is configured', () => {
    expect(resolveSiteUrl(undefined, true)).toBe(CANONICAL_SITE_URL);
    expect(resolveSiteUrl('   ', true)).toBe(CANONICAL_SITE_URL);
    expect(resolveSiteUrl('not a url', true)).toBe(CANONICAL_SITE_URL);
    expect(resolveSiteUrl(undefined, false)).toBe('http://localhost:3000');
    expect(resolveSiteUrl('http://localhost:3000', false)).toBe('http://localhost:3000');
    // Localhost is meaningless as a production canonical.
    expect(resolveSiteUrl('http://localhost:3000', true)).toBe(CANONICAL_SITE_URL);
  });
});

describe('publicWebsiteUrl', () => {
  it('shows the brand domain rather than an internal or local address', () => {
    expect(publicWebsiteUrl('http://localhost:3000')).toBe(CANONICAL_SITE_URL);
    expect(publicWebsiteUrl('https://nori-via-website-production.up.railway.app')).toBe(
      CANONICAL_SITE_URL,
    );
    expect(publicWebsiteUrl('nonsense')).toBe(CANONICAL_SITE_URL);
  });

  it('keeps a real public origin', () => {
    expect(publicWebsiteUrl('https://norivaglobal.com')).toBe('https://norivaglobal.com');
  });
});
