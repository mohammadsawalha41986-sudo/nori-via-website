/** Read-only production audit; never sends inquiries or edits CMS. */
import { chromium } from 'playwright';
import { mkdirSync, writeFileSync } from 'node:fs';
const base = process.env.QA_BASE_URL || 'http://127.0.0.1:3000';
const out = process.env.QA_REPORT_DIR || '../../qa/public-redesign';
mkdirSync(out, { recursive: true });
const browser = await chromium.launch({
  executablePath: process.env.QA_CHROMIUM,
  args: ['--no-sandbox'],
});
const context = await browser.newContext({
  viewport: { width: 1440, height: 1000 },
  reducedMotion: 'reduce',
});
const results = [],
  errors = [],
  links = new Set();
const sitemap = await (await fetch(base + '/sitemap.xml')).text();
const routes = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => new URL(m[1]).pathname);
for (const path of routes) {
  const r = await fetch(base + path);
  const html = await r.text();
  const valid =
    r.status === 200 && /rel="canonical"/.test(html) && !/NEXT_HTTP_ERROR_FALLBACK;500/.test(html);
  results.push({ path, status: r.status, valid });
  if (results.length % 50 === 0) console.log('Sitemap checked: ' + results.length);
  if (!valid) errors.push('route/SEO ' + path + ' ' + r.status);
}
const page = await context.newPage();
page.on('pageerror', (e) => errors.push(page.url() + ' ' + e.message));
page.on('console', (m) => {
  if (m.type() === 'error') errors.push(page.url() + ' console ' + m.text());
});
page.on('response', (r) => {
  if (r.status() >= 400 && new URL(r.url()).origin === new URL(base).origin)
    errors.push('network ' + r.status() + ' ' + r.url());
});
const paths = [
  '',
  '/services',
  '/library',
  '/tools',
  '/work',
  '/about',
  '/contact',
  '/start-a-project',
  '/start-here',
  '/services/delivery-menu-pricing',
  '/services/menu-strategy-engineering-pricing',
  '/work/sample-menu-restructure',
  '/tools/delivery-pricing-calculator',
  '/tools/food-cost-calculator',
];
for (const width of [1440, 1280, 834, 390])
  for (const locale of ['en', 'ar'])
    for (const path of paths) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(base + '/' + locale + path, { waitUntil: 'networkidle', timeout: 60000 });
      await page.evaluate(async () => {
        for (let y = 0; y < document.body.scrollHeight; y += 700) {
          window.scrollTo(0, y);
          await new Promise((r) => setTimeout(r, 40));
        }
      });
      await page.waitForTimeout(300);
      const check = await page.evaluate(() => ({
        dir: document.documentElement.dir,
        overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
        broken: [...document.images]
          .filter((i) => i.currentSrc && (!i.complete || !i.naturalWidth))
          .map((i) => i.currentSrc),
        alt: [...document.images].filter((i) => !i.hasAttribute('alt')).map((i) => i.currentSrc),
        h1: document.querySelectorAll('h1').length,
        links: [...document.querySelectorAll('a[href]')].map((a) => a.getAttribute('href')),
      }));
      if (
        check.dir !== (locale === 'ar' ? 'rtl' : 'ltr') ||
        check.overflow > 1 ||
        check.broken.length ||
        check.alt.length ||
        check.h1 !== 1
      )
        errors.push(
          JSON.stringify({ path: '/' + locale + path, width, ...check, links: undefined }),
        );
      check.links.filter((x) => x.startsWith('/')).forEach((x) => links.add(x.split('#')[0]));
      if (!path) {
        await page.evaluate(() => window.scrollTo(0, 0));
        await page.screenshot({ path: out + '/' + locale + '-' + width + '.png', fullPage: true });
      }
      results.push({ path: '/' + locale + path, width, ...check, links: undefined });
    }
// Exercise both service modes, every business filter and purpose filter.
for (const locale of ['en', 'ar']) {
  await page.goto(base + '/' + locale + '/services');
  for (const button of await page.locator('.discovery button').all()) {
    await button.click();
    await page.waitForTimeout(100);
  }
  const search = page.locator('.discovery input[type=search]');
  await search.fill(locale === 'en' ? 'menu' : 'القائمة');
  await page.waitForTimeout(200);
  if (!(await page.locator('.discovery a[href*="/services/"]').count()))
    errors.push('service search ' + locale);
  for (const kind of ['guide', 'checklist', 'template', 'framework', 'sample']) {
    const response = await page.goto(base + '/' + locale + '/library?kind=' + kind);
    if (response.status() !== 200) errors.push('resource filter ' + kind);
  }
}
for (const path of links) {
  if (path.startsWith('/api/') || path.startsWith('/admin')) continue;
  const r = await fetch(base + path);
  if (r.status >= 400) errors.push('linked route ' + path + ' ' + r.status);
}
await browser.close();
writeFileSync(
  out + '/report.json',
  JSON.stringify(
    {
      base,
      at: new Date().toISOString(),
      sitemapRoutes: routes.length,
      linkedRoutes: links.size,
      results,
      errors: [...new Set(errors)],
    },
    null,
    2,
  ),
);
console.log(
  JSON.stringify(
    {
      base,
      sitemapRoutes: routes.length,
      linkedRoutes: links.size,
      checks: results.length,
      errors: [...new Set(errors)],
    },
    null,
    2,
  ),
);
if (errors.length) process.exitCode = 1;
