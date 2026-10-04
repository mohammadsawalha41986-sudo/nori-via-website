/** Read-only HTTP audit of every sitemap URL. Run against production or a local build. */
import { writeFile } from 'node:fs/promises';
const origin = process.env.QA_BASE_URL || 'https://norivaglobal.com';
const canonicalOrigin = 'https://norivaglobal.com';
const output = process.env.SEO_REPORT_PATH || '/tmp/noriva-seo-audit.json';
const get = async path => {
  const response = await fetch(new URL(path, origin), { signal: AbortSignal.timeout(30000), headers: { 'User-Agent': 'NORIVA-SEO-Audit/1.0' } });
  return { status: response.status, url: response.url, text: await response.text(), headers: Object.fromEntries(response.headers) };
};
const decode = value => value.replaceAll('&amp;', '&').replaceAll('&quot;', '"');
const attr = (tag, name) => decode(tag.match(new RegExp(`\\b${name}="([^"]*)"`, 'i'))?.[1] || '');
const [sitemap, robots] = await Promise.all([get('/sitemap.xml'), get('/robots.txt')]);
const urls = [...sitemap.text.matchAll(/<loc>(.*?)<\/loc>/g)].map(m => decode(m[1]));
const results = [];
const brokenInternal = new Set();
const internal = new Set();
let cursor = 0;
async function worker() {
  while (cursor < urls.length) {
    const url = urls[cursor++];
    try {
      const page = await get(new URL(url).pathname);
      const metas = [...page.text.matchAll(/<meta\b[^>]*>/gi)].map(m => m[0]);
      const links = [...page.text.matchAll(/<link\b[^>]*>/gi)].map(m => m[0]);
      const meta = name => attr(metas.find(tag => attr(tag, 'name') === name || attr(tag, 'property') === name) || '', 'content');
      const canonical = attr(links.find(tag => attr(tag, 'rel') === 'canonical') || '', 'href');
      const alternates = Object.fromEntries(links.filter(tag => attr(tag, 'hreflang')).map(tag => [attr(tag, 'hreflang'), attr(tag, 'href')]));
      const schemas = [...page.text.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>(.*?)<\/script>/gs)].map(m => { try { return JSON.parse(m[1]); } catch { return { invalid: true }; } });
      const h1 = [...page.text.matchAll(/<h1\b[^>]*>(.*?)<\/h1>/gs)].map(m => m[1].replace(/<[^>]+>/g, '').trim());
      const locale = new URL(url).pathname.split('/')[1];
      const errors = [];
      if (page.status !== 200) errors.push(`HTTP ${page.status}`);
      if (!url.startsWith(canonicalOrigin + '/')) errors.push('Non-production sitemap URL');
      if (canonical !== url) errors.push('Canonical mismatch');
      if (!meta('description')) errors.push('Missing description');
      if (h1.length !== 1) errors.push(`H1 count ${h1.length}`);
      if (schemas.some(s => s.invalid)) errors.push('Invalid JSON-LD');
      if (['ar','en'].includes(locale) && (!alternates['ar-SA'] || !alternates['en-SA'])) errors.push('Missing Saudi hreflang');
      if (!meta('og:image')?.startsWith('https://')) errors.push('Missing absolute OG image');
      if (/noindex/.test(meta('robots'))) errors.push('Sitemap URL is noindex');
      const images = [...page.text.matchAll(/<img\b[^>]*>/gi)].map(m => m[0]);
      if (images.some(tag => !/\balt=/.test(tag))) errors.push('Image missing alt');
      for (const match of page.text.matchAll(/<a\b[^>]*href="([^"]+)"/gi)) {
        const href = decode(match[1]);
        if (href.startsWith('/') && !href.startsWith('//') && !href.startsWith('/api/') && !href.startsWith('/admin')) internal.add(new URL(href, origin).pathname);
      }
      results.push({ url, status: page.status, title: page.text.match(/<title>(.*?)<\/title>/s)?.[1], description: meta('description'), canonical, alternates, h1, schemaTypes: schemas.map(s => s['@type']), ogImage: meta('og:image'), imageCount: images.length, errors });
    } catch (error) { results.push({ url, errors: [String(error)] }); }
  }
}
await Promise.all(Array.from({ length: 5 }, worker));
const listed = new Set(urls.map(url => new URL(url).pathname));
const extras = [...internal].filter(path => !listed.has(path));
cursor = 0;
await Promise.all(Array.from({ length: 4 }, async () => {
  while (cursor < extras.length) {
    const path = extras[cursor++];
    try { if ((await get(path)).status >= 400) brokenInternal.add(path); } catch { brokenInternal.add(path); }
  }
}));
const imageUrls = [...new Set(results.map(page => page.ogImage).filter(Boolean))];
const brokenShareImages = [];
cursor = 0;
await Promise.all(Array.from({ length: 4 }, async () => {
  while (cursor < imageUrls.length) {
    const url = imageUrls[cursor++];
    try {
      const imageUrl = new URL(url);
      const target = imageUrl.origin === canonicalOrigin ? new URL(imageUrl.pathname, origin) : imageUrl;
      let valid = false;
      // One retry covers an interrupted connection during a rolling deployment.
      for (let attempt = 0; attempt < 2; attempt++) {
        try {
          const response = await fetch(target, { method: 'HEAD', signal: AbortSignal.timeout(20000) });
          valid = response.ok && Boolean(response.headers.get('content-type')?.startsWith('image/'));
          if (valid || (response.status >= 400 && response.status < 500)) break;
        } catch { /* Retry once, then report a real unresolved failure. */ }
      }
      if (!valid) brokenShareImages.push(url);
    } catch { brokenShareImages.push(url); }
  }
}));
const notFound = await get('/ar/services/noriva-seo-nonexistent-page');
const report = { timestamp: new Date().toISOString(), origin, sitemapStatus: sitemap.status, robotsStatus: robots.status,
  robots: robots.text, sitemapCount: urls.length, pages: results.sort((a,b) => a.url.localeCompare(b.url)),
  brokenShareImages, checkedShareImages: imageUrls.length, brokenInternal: [...brokenInternal], unknownPageStatus: notFound.status,
  issues: results.filter(page => page.errors.length), duplicateTitles: results.filter((p,i) => results.findIndex(q => q.title === p.title) !== i).map(p => p.url) };
await writeFile(output, JSON.stringify(report, null, 2));
console.log(JSON.stringify({ output, sitemapCount: urls.length, issues: report.issues.length, brokenShareImages, checkedShareImages: imageUrls.length, brokenInternal: report.brokenInternal, unknownPageStatus: report.unknownPageStatus, duplicateTitles: report.duplicateTitles.length }));
if (brokenShareImages.length || report.issues.length || report.brokenInternal.length || notFound.status !== 404 || sitemap.status !== 200) process.exitCode = 1;
