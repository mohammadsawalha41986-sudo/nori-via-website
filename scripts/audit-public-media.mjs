/** Read-only crawl. Records actual rendered image usage, not filenames alone. */
import { mkdirSync, writeFileSync, readFileSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import path from 'node:path';

const origin = process.env.AUDIT_ORIGIN || 'https://norivaglobal.com';
const output = process.env.AUDIT_OUTPUT || '../../public-audit';
mkdirSync(output, { recursive: true });
const sitemap = await fetch(`${origin}/sitemap.xml`).then((r) => r.text());
const routes = [...new Set([...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => new URL(m[1]).pathname))];
const pages = [];
const usages = new Map();
let cursor = 0;
await Promise.all(Array.from({ length: 4 }, async () => {
  while (cursor < routes.length) {
    const route = routes[cursor++];
    try {
      const response = await fetch(`${origin}${route}`, { signal: AbortSignal.timeout(30000) });
      const html = await response.text();
      const title = html.match(/<title>(.*?)<\/title>/s)?.[1] || route;
      const images = [...html.matchAll(/<img\b[^>]*>/g)].map(([tag]) => {
        let src = tag.match(/\bsrc="([^"]*)"/)?.[1]?.replaceAll('&amp;', '&') || '';
        if (src.startsWith('/_next/image')) src = new URL(src, origin).searchParams.get('url') || src;
        const alt = tag.match(/\balt="([^"]*)"/)?.[1] || '';
        return { src, alt };
      });
      pages.push({ route, title, status: response.status, images, canonical: html.match(/<link[^>]*rel="canonical"[^>]*href="([^"]*)"/)?.[1] });
      for (const { src } of images) {
        if (!usages.has(src)) usages.set(src, new Set());
        usages.get(src).add(route);
      }
    } catch (e) { pages.push({ route, error: String(e) }); }
  }
}));
const reuse = [...usages].map(([image, set]) => ({ image, count: set.size, pages: [...set] })).sort((a, b) => b.count - a.count);
const hashes = new Map();
for (const { image } of reuse) {
  if (!image.startsWith('/img/')) continue;
  const local = path.join('public', image);
  if (!existsSync(local)) continue;
  const hash = createHash('sha256').update(readFileSync(local)).digest('hex');
  if (!hashes.has(hash)) hashes.set(hash, []);
  hashes.get(hash).push(image);
}
const exactDuplicates = [...hashes.values()].filter((a) => a.length > 1);
writeFileSync(path.join(output, 'public-image-audit.json'), JSON.stringify({ origin, date: new Date().toISOString(), pages, reuse, exactDuplicates }, null, 2));
console.log(JSON.stringify({ routes: routes.length, checked: pages.length, failures: pages.filter((p) => p.error || p.status !== 200).length, reusedImages: reuse.filter((r) => r.count > 2).length, exactDuplicateGroups: exactDuplicates.length }));
