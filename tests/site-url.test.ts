import { afterEach, describe, expect, it, vi } from 'vitest';

/**
 * The public site URL is not a private setting.
 *
 * It is printed in the footer as the studio's own address, and it is the
 * canonical URL, the sitemap entries, the OG tags and the organisation URL in
 * structured data. `NEXT_PUBLIC_SITE_URL` had been set to the Railway host, so
 * visitors read `…up.railway.app` in the footer and crawlers were told the site
 * lived there — the same pages indexed under two hosts with the wrong one
 * declared canonical.
 *
 * `env` reads configuration once at module load, so each case re-imports it
 * with a fresh module registry rather than mutating an already-evaluated object.
 */
async function siteUrlWith(value: string | undefined, nodeEnv = 'production') {
  vi.resetModules();

  // `stubEnv` rather than assignment: NODE_ENV is readonly to TypeScript, and
  // this restores both variables for us in `afterEach`.
  vi.stubEnv('NODE_ENV', nodeEnv);
  vi.stubEnv('NEXT_PUBLIC_SITE_URL', value);

  const { env } = await import('@/lib/env');
  return env.siteUrl;
}

afterEach(() => {
  vi.unstubAllEnvs();
  vi.resetModules();
});

describe('public site URL', () => {
  it('refuses the Railway host and uses the canonical domain', async () => {
    expect(await siteUrlWith('https://nori-via-website-production.up.railway.app')).toBe(
      'https://norivaglobal.com',
    );
  });

  it('refuses other platform hosts too', async () => {
    for (const host of [
      'https://something.railway.app',
      'https://preview-abc.vercel.app',
    ]) {
      expect(await siteUrlWith(host), host).toBe('https://norivaglobal.com');
    }
  });

  it('uses the canonical domain when nothing is configured', async () => {
    expect(await siteUrlWith(undefined)).toBe('https://norivaglobal.com');
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
    expect(await siteUrlWith('not-a-url')).toBe('https://norivaglobal.com');
  });

  it('still points at the dev server outside production', async () => {
    expect(await siteUrlWith(undefined, 'development')).toBe('http://localhost:3000');
  });
});
