/**
 * Resolution of the site's public origin.
 *
 * The origin is configured per environment through `NEXT_PUBLIC_SITE_URL`, but
 * a hosting platform's generated hostname (Railway, Vercel, Render, …) is an
 * implementation detail of the deployment, never the brand's address. When one
 * of those reaches the public site it leaks internal infrastructure to
 * visitors in the footer and — worse — into canonical URLs, Open Graph tags,
 * `robots.txt` and the sitemap, where search engines index the deployment host
 * as a duplicate of the real site.
 *
 * So the origin is resolved rather than read: a configured value is used only
 * when it is a genuine public address, and anything else falls back to the
 * canonical domain in production. Fixing it here rather than in the footer
 * means no component can reintroduce the leak, whatever the platform sets.
 */

/** The brand's official public origin. The one place the domain is written. */
export const CANONICAL_SITE_URL = 'https://norivaglobal.com';

/** Local origin used when nothing is configured outside production. */
const DEVELOPMENT_SITE_URL = 'http://localhost:3000';

/**
 * Hostname suffixes owned by hosting platforms. A deployment reachable on one
 * of these is reachable there for operational reasons only, so it must never
 * be presented to a visitor or emitted as a canonical URL.
 */
const PLATFORM_HOST_SUFFIXES = [
  'railway.app',
  'railway.internal',
  'up.railway.app',
  'vercel.app',
  'netlify.app',
  'onrender.com',
  'herokuapp.com',
  'fly.dev',
  'ngrok.io',
  'ngrok-free.app',
];

const LOCAL_HOSTNAMES = new Set(['localhost', '127.0.0.1', '0.0.0.0', '::1']);

/**
 * A hostname that can actually be reached from the public internet: at least
 * one dot, and nothing but the characters a domain is made of.
 *
 * Because a value without a scheme is completed to `https://…`, a typo such as
 * `not-a-url` would otherwise parse cleanly and be published as the canonical
 * host. A single label is never a public address, so it is treated as
 * malformed. Local hostnames are checked separately, since they are legitimate
 * in development and meaningless in production.
 */
const PUBLIC_HOSTNAME = /^(?=.{1,253}$)(?!-)[a-z0-9-]{1,63}(?:\.(?!-)[a-z0-9-]{1,63})+$/i;

/** True when the hostname belongs to a hosting platform rather than the brand. */
export function isPlatformHost(hostname: string): boolean {
  const host = hostname.trim().toLowerCase().replace(/\.$/, '');
  return PLATFORM_HOST_SUFFIXES.some((suffix) => host === suffix || host.endsWith(`.${suffix}`));
}

/**
 * Turns a configured origin into the origin the public site should use.
 *
 * @param raw       the configured value, typically `NEXT_PUBLIC_SITE_URL`
 * @param isProduction whether this is a production runtime, which decides the
 *                     fallback: the canonical domain in production, localhost
 *                     in development so local work keeps addressing itself.
 * @returns an absolute origin with no trailing slash
 */
export function resolveSiteUrl(raw: string | undefined, isProduction: boolean): string {
  const fallback = isProduction ? CANONICAL_SITE_URL : DEVELOPMENT_SITE_URL;
  const value = (raw ?? '').trim();
  if (!value) return fallback;

  // A value without a scheme is still a usable domain; assume the secure one.
  const candidate = /^https?:\/\//i.test(value) ? value : `https://${value}`;

  let url: URL;
  try {
    url = new URL(candidate);
  } catch {
    return fallback;
  }

  const hostname = url.hostname.toLowerCase().replace(/\.$/, '');

  if (isPlatformHost(hostname)) return fallback;

  if (LOCAL_HOSTNAMES.has(hostname)) {
    // A local address is legitimate in development and meaningless in production.
    return isProduction ? CANONICAL_SITE_URL : `${url.protocol}//${url.host}`;
  }

  // Anything that is neither a local address nor a real public domain — an
  // unfinished value, a typo, a bare label — is malformed configuration.
  if (!PUBLIC_HOSTNAME.test(hostname)) return fallback;

  return `${url.protocol}//${url.host}${url.pathname}`.replace(/\/+$/, '');
}

/**
 * The web address shown to visitors, e.g. in the footer.
 *
 * Always a real, reachable brand address: a local origin is correct for the
 * rest of the app while developing, but it is not an address a visitor can
 * use, so the canonical domain stands in for it.
 */
export function publicWebsiteUrl(siteUrl: string): string {
  try {
    const { hostname } = new URL(siteUrl);
    if (LOCAL_HOSTNAMES.has(hostname.toLowerCase()) || isPlatformHost(hostname)) {
      return CANONICAL_SITE_URL;
    }
    return siteUrl.replace(/\/+$/, '');
  } catch {
    return CANONICAL_SITE_URL;
  }
}
