import { resolveSiteUrl } from './site-url';

/**
 * The public production domain. Re-exported so `@/lib/env` stays a valid
 * import path for it, while `site-url.ts` remains the single definition.
 */
export { CANONICAL_SITE_URL } from './site-url';

/** Central place for reading configuration, so nothing is hard-coded in components. */
export const env = {
  /**
   * The public origin of the site.
   *
   * Resolved rather than read directly: falling back to the canonical domain
   * only when NEXT_PUBLIC_SITE_URL is absent still leaves the deployment host
   * on the public site whenever the platform sets that variable to its own
   * generated hostname, which is exactly what it does. Resolving the value
   * rejects such a hostname however it arrives. See `site-url.ts`.
   */
  siteUrl: resolveSiteUrl(process.env.NEXT_PUBLIC_SITE_URL, process.env.NODE_ENV === 'production'),
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
