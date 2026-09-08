import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  CANONICAL_SITE_URL,
  isPlatformHost,
  publicWebsiteUrl,
  resolveSiteUrl,
} from '../src/lib/site-url';

/**
 * The public site URL is not a private setting.
 *
 * It is printed in the footer as the studio's own address, and it is also the
 * canonical URL, the sitemap entries, the OG tags and the organisation URL in
 * structured data. `NEXT_PUBLIC_SITE_URL` had been set to the Railway host, so
 * visitors read `…up.railway.app` in the footer and crawlers were told the site
 * lived there — the same pages indexed under two hosts, with the wrong one
 * declared canonical.
 *
 * These cover the rule itself (`site-url.ts`), the value the rest of the app
 * reads (`env.siteUrl`), and what actually reaches a page's metadata.
 */

const RAILWAY_HOST = 'https://nori-via-website-production.up.railway.app';

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
    expect(resolveSiteUrl(RAILWAY_HOST, true)).toBe(CANONICAL_SITE_URL);
    expect(resolveSiteUrl(`${RAILWAY_HOST}/`, false)).toBe('http://localhost:3000');
    expect(resolveSiteUrl('https://something.railway.app', true)).toBe(CANONICAL_SITE_URL);
    expect(resolveSiteUrl('https://preview-abc.vercel.app', true)).toBe(CANONICAL_SITE_URL);
  });

  it('keeps a configured public origin', () => {
    expect(resolveSiteUrl('https://norivaglobal.com', true)).toBe('https://norivaglobal.com');
    expect(resolveSiteUrl('https://norivaglobal.com/', true)).toBe('https://norivaglobal.com');
    expect(resolveSiteUrl('norivaglobal.com', true)).toBe('https://norivaglobal.com');
  });

  it('keeps a deliberately configured staging domain', () => {
    // Staging is a real address the team chose; only the platform's own
    // generated hostname is refused.
    expect(resolveSiteUrl('https://staging.norivaglobal.com', true)).toBe(
      'https://staging.norivaglobal.com',
    );
    expect(resolveSiteUrl('https://noriva-staging.example.com/', true)).toBe(
      'https://noriva-staging.example.com',
    );
  });

  it('falls back by environment when nothing usable is configured', () => {
    expect(resolveSiteUrl(undefined, true)).toBe(CANONICAL_SITE_URL);
    expect(resolveSiteUrl('   ', true)).toBe(CANONICAL_SITE_URL);
    expect(resolveSiteUrl('not a url', true)).toBe(CANONICAL_SITE_URL);
    expect(resolveSiteUrl('http://', true)).toBe(CANONICAL_SITE_URL);
    // A bare label parses as a URL once a scheme is assumed, but it is not an
    // address anyone can reach, so it must not become the canonical host.
    expect(resolveSiteUrl('not-a-url', true)).toBe(CANONICAL_SITE_URL);
    expect(resolveSiteUrl('https://localhost', true)).toBe(CANONICAL_SITE_URL);
    expect(resolveSiteUrl('https://내부-호스트', true)).toBe(CANONICAL_SITE_URL);
    expect(resolveSiteUrl(undefined, false)).toBe('http://localhost:3000');
    expect(resolveSiteUrl('http://localhost:3000', false)).toBe('http://localhost:3000');
    // Localhost is meaningless as a production canonical.
    expect(resolveSiteUrl('http://localhost:3000', true)).toBe(CANONICAL_SITE_URL);
  });
});

describe('publicWebsiteUrl', () => {
  it('shows the brand domain rather than an internal or local address', () => {
    expect(publicWebsiteUrl('http://localhost:3000')).toBe(CANONICAL_SITE_URL);
    expect(publicWebsiteUrl(RAILWAY_HOST)).toBe(CANONICAL_SITE_URL);
    expect(publicWebsiteUrl('https://preview.vercel.app')).toBe(CANONICAL_SITE_URL);
    expect(publicWebsiteUrl('nonsense')).toBe(CANONICAL_SITE_URL);
  });

  it('keeps a real public origin', () => {
    expect(publicWebsiteUrl('https://norivaglobal.com')).toBe('https://norivaglobal.com');
    expect(publicWebsiteUrl('https://staging.norivaglobal.com')).toBe(
      'https://staging.norivaglobal.com',
    );
  });
});

/**
 * `env` reads configuration once at module load, so each case re-imports it
 * with a fresh module registry rather than mutating an already-evaluated
 * object. This is what proves the rule is actually wired into the value the
 * rest of the application reads, not merely available beside it.
 */
async function loadWith(value: string | undefined, nodeEnv = 'production') {
  vi.resetModules();

  // `stubEnv` rather than assignment: NODE_ENV is readonly to TypeScript, and
  // this restores both variables for us in `afterEach`.
  vi.stubEnv('NODE_ENV', nodeEnv);
  vi.stubEnv('NEXT_PUBLIC_SITE_URL', value);

  return import('@/lib/env');
}

async function siteUrlWith(value: string | undefined, nodeEnv = 'production') {
  const { env } = await loadWith(value, nodeEnv);
  return env.siteUrl;
}

afterEach(() => {
  vi.unstubAllEnvs();
  vi.resetModules();
});

describe('public site URL', () => {
  it('refuses the Railway host and uses the canonical domain', async () => {
    expect(await siteUrlWith(RAILWAY_HOST)).toBe(CANONICAL_SITE_URL);
  });

  it('refuses other platform hosts too', async () => {
    for (const host of ['https://something.railway.app', 'https://preview-abc.vercel.app']) {
      expect(await siteUrlWith(host), host).toBe(CANONICAL_SITE_URL);
    }
  });

  it('uses the canonical domain when nothing is configured', async () => {
    expect(await siteUrlWith(undefined)).toBe(CANONICAL_SITE_URL);
  });

  it('honours a real domain, including one that is not the canonical one', async () => {
    expect(await siteUrlWith('https://norivaglobal.com')).toBe('https://norivaglobal.com');
    expect(await siteUrlWith('https://staging.norivaglobal.com')).toBe(
      'https://staging.norivaglobal.com',
    );
  });

  it('strips a trailing slash, so canonical URLs do not double up', async () => {
    expect(await siteUrlWith('https://norivaglobal.com/')).toBe('https://norivaglobal.com');
  });

  it('falls back rather than publishing a malformed value', async () => {
    expect(await siteUrlWith('not-a-url')).toBe(CANONICAL_SITE_URL);
  });

  it('still points at the dev server outside production', async () => {
    expect(await siteUrlWith(undefined, 'development')).toBe('http://localhost:3000');
  });
});

describe('what a page publishes', () => {
  /** Every public address a page emits, built from the same configured value. */
  async function publishedFor(configured: string | undefined) {
    vi.resetModules();
    vi.stubEnv('NODE_ENV', 'production');
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', configured);

    const { buildMetadata } = await import('@/lib/seo');
    const { env } = await import('@/lib/env');
    const { publicWebsiteUrl: showAddress } = await import('@/lib/site-url');

    const metadata = buildMetadata({
      locale: 'en',
      path: '/services',
      fallbackTitle: 'Services',
    });

    return {
      canonical: String(metadata.alternates?.canonical ?? ''),
      ogUrl: String(metadata.openGraph?.url ?? ''),
      alternates: Object.values(metadata.alternates?.languages ?? {}).map(String),
      // What the sitemap and the Organization structured data are built from.
      siteUrl: env.siteUrl,
      // What the footer prints as the studio's address.
      footer: showAddress(env.siteUrl),
    };
  }

  it('publishes the canonical domain even when the platform host is configured', async () => {
    const published = await publishedFor(RAILWAY_HOST);

    expect(published.canonical).toBe('https://norivaglobal.com/en/services');
    expect(published.ogUrl).toBe('https://norivaglobal.com/en/services');
    expect(published.siteUrl).toBe(CANONICAL_SITE_URL);
    expect(published.footer).toBe(CANONICAL_SITE_URL);

    // Nothing a page emits may name the hosting platform.
    for (const value of [
      published.canonical,
      published.ogUrl,
      published.siteUrl,
      published.footer,
      ...published.alternates,
    ]) {
      expect(value).not.toMatch(/railway\.app|vercel\.app/i);
    }
  });

  it('publishes a legitimately configured domain unchanged', async () => {
    const published = await publishedFor('https://staging.norivaglobal.com');

    expect(published.canonical).toBe('https://staging.norivaglobal.com/en/services');
    expect(published.ogUrl).toBe('https://staging.norivaglobal.com/en/services');
    expect(published.footer).toBe('https://staging.norivaglobal.com');
  });
});
