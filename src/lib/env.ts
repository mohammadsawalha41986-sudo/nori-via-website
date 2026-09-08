/**
 * The public production domain. Used for canonical URLs, sitemap, robots,
 * structured data and the website line in the footer whenever
 * NEXT_PUBLIC_SITE_URL is not supplied by the deployment.
 */
export const CANONICAL_SITE_URL = 'https://norivaglobal.com';

/** Local development falls back to the dev server rather than the live domain. */
const DEFAULT_SITE_URL =
  process.env.NODE_ENV === 'production' ? CANONICAL_SITE_URL : 'http://localhost:3000';

/**
 * Hosts that are a deployment detail, never this studio's public identity.
 *
 * `NEXT_PUBLIC_SITE_URL` had been set to the Railway host, and `siteUrl` is not
 * a private value: the footer prints it as the studio's own address, and it is
 * the canonical URL, the sitemap entries, the OG tags and the organisation URL
 * in structured data. So every visitor saw `…up.railway.app`, and every
 * crawler was told the site lived there — the same content indexed under two
 * hosts, with the wrong one presented as canonical.
 *
 * A platform hostname is therefore rejected rather than trusted, and the
 * canonical domain used instead. Configuration can still point this anywhere
 * legitimate; it just cannot publish the plumbing.
 */
const PLATFORM_HOSTS = [/\.up\.railway\.app$/i, /\.railway\.app$/i, /\.vercel\.app$/i];

function publicSiteUrl(): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!configured) return DEFAULT_SITE_URL;

  let host: string;
  try {
    host = new URL(configured).hostname;
  } catch {
    // Not a URL at all — configuration cannot be trusted to be public-facing.
    return DEFAULT_SITE_URL;
  }

  if (PLATFORM_HOSTS.some((pattern) => pattern.test(host))) return DEFAULT_SITE_URL;

  return configured;
}

/** Central place for reading configuration, so nothing is hard-coded in components. */
export const env = {
  siteUrl: publicSiteUrl().replace(/\/$/, ''),
  authSecret: process.env.AUTH_SECRET || '',
  contactEmail: process.env.CONTACT_EMAIL || '',
  storageDir: process.env.STORAGE_DIR || './storage',
  smtp: {
    host: process.env.SMTP_HOST || '',
    port: Number(process.env.SMTP_PORT || 587),
    user: process.env.SMTP_USER || '',
    password: process.env.SMTP_PASSWORD || '',
    from: process.env.SMTP_FROM || process.env.SMTP_USER || '',
    secure: process.env.SMTP_SECURE === 'true',
  },
  analytics: {
    gaId: process.env.NEXT_PUBLIC_GA_ID || '',
    gtmId: process.env.NEXT_PUBLIC_GTM_ID || '',
  },
};

export function isMailConfigured() {
  return Boolean(env.smtp.host && env.smtp.port);
}

export function assertAuthSecret() {
  if (!env.authSecret || env.authSecret.length < 32) {
    throw new Error('AUTH_SECRET must be set to a random string of at least 32 characters.');
  }
  return env.authSecret;
}
