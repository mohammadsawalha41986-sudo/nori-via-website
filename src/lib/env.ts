import { resolveSiteUrl } from './site-url';

/** Central place for reading configuration, so nothing is hard-coded in components. */
export const env = {
  /**
   * The public origin of the site. Resolved rather than read directly: a
   * hosting platform's generated hostname is never shown to visitors or used
   * as a canonical URL. See `site-url.ts`.
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
