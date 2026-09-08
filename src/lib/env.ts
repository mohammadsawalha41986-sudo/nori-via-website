/**
 * The public production domain. Used for canonical URLs, sitemap, robots,
 * structured data and the website line in the footer whenever
 * NEXT_PUBLIC_SITE_URL is not supplied by the deployment.
 */
export const CANONICAL_SITE_URL = 'https://norivaglobal.com';

/** Local development falls back to the dev server rather than the live domain. */
const DEFAULT_SITE_URL =
  process.env.NODE_ENV === 'production' ? CANONICAL_SITE_URL : 'http://localhost:3000';

/** Central place for reading configuration, so nothing is hard-coded in components. */
export const env = {
  siteUrl: (process.env.NEXT_PUBLIC_SITE_URL || DEFAULT_SITE_URL).replace(/\/$/, ''),
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
