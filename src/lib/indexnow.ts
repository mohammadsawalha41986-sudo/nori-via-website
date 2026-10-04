import 'server-only';
import { after } from 'next/server';
import { env } from './env';
import { locales } from './i18n';

export function validIndexNowKey(key: string) {
  return /^[a-zA-Z0-9-]{8,128}$/.test(key);
}

/** Only explicit changed public paths, from authenticated CMS mutations. */
export function indexNowUrls(paths: string[]) {
  return [...new Set(paths)].filter(path =>
    /^\/(?:$|about$|contact$|services(?:\/[^/?#]+)?$|work(?:\/[^/?#]+)?$|insights(?:\/[^/?#]+)?$|library(?:\/[^/?#]+)?$|tools(?:\/[^/?#]+)?$|restaurant-growth$|start-here$|start-a-project$|privacy$|terms$)/.test(path)
  ).flatMap(path => locales.map(locale => `${env.siteUrl}/${locale}${path === '/' ? '' : path}`));
}

/** A search endpoint failure never rolls back a successful CMS save. */
export function notifyIndexNow(...paths: string[]) {
  if (!validIndexNowKey(env.indexNowKey) || process.env.NODE_ENV !== 'production') return;
  const urlList = indexNowUrls(paths);
  if (!urlList.length) return;
  after(async () => {
    try {
      const response = await fetch('https://api.indexnow.org/indexnow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ host: new URL(env.siteUrl).host, key: env.indexNowKey,
          keyLocation: `${env.siteUrl}/indexnow-key.txt`, urlList }),
        signal: AbortSignal.timeout(5000),
      });
      if (!response.ok) console.warn(`[IndexNow] submission returned ${response.status}`);
    } catch { console.warn('[IndexNow] submission failed; content was saved successfully'); }
  });
}
