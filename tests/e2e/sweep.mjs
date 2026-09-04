/**
 * Route sweep: every public and admin route in both languages, plus
 * accessibility and responsive checks. Fails on any non-200, any rendered
 * error boundary, and any browser console or page error.
 */
import { chromium } from 'playwright';

const BASE = process.env.QA_BASE_URL ?? 'http://127.0.0.1:3000';
const EMAIL = process.env.QA_EMAIL ?? 'qa@example.com';
const PASSWORD = process.env.QA_PASSWORD ?? 'LocalQaPassword123!';
const CHROMIUM = process.env.QA_CHROMIUM ?? '/opt/pw-browsers/chromium';

const browser = await chromium.launch({ executablePath: CHROMIUM });
const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
const page = await context.newPage();

const consoleErrors = [];
page.on('console', (m) => m.type() === 'error' && consoleErrors.push(`${page.url()} :: ${m.text().slice(0, 120)}`));
page.on('pageerror', (e) => consoleErrors.push(`${page.url()} :: ${e.message.slice(0, 120)}`));

await page.goto(`${BASE}/admin/login`);
await page.fill('input[name="email"]', EMAIL);
await page.fill('input[name="password"]', PASSWORD);
await page.click('button[type="submit"]');
await page.waitForURL(/\/admin(?!\/login)/, { timeout: 20000 });

const adminRoutes = [
  '/admin', '/admin/preview', '/admin/inquiries', '/admin/messages',
  '/admin/homepage', '/admin/system', '/admin/services', '/admin/services/new',
  '/admin/work', '/admin/work/new', '/admin/case-studies', '/admin/case-studies/new',
  '/admin/insights', '/admin/insights/new', '/admin/insights?status=DRAFT&q=menu',
  '/admin/pages', '/admin/pages/start-here', '/admin/pages/restaurant-growth',
  '/admin/resources', '/admin/resources/new', '/admin/resources?status=PUBLISHED',
  '/admin/tools', '/admin/tools/new',
  '/admin/taxonomies', '/admin/media', '/admin/statistics', '/admin/testimonials',
  '/admin/design', '/admin/settings', '/admin/navigation', '/admin/social', '/admin/seo',
];

const publicPaths = [
  '', '/start-here', '/services', '/work', '/insights', '/library', '/tools',
  '/about', '/contact', '/start-a-project', '/restaurant-growth', '/search?q=menu',
  '/services/menu-strategy-engineering-pricing',
  '/tools/food-cost-calculator', '/tools/menu-pricing-calculator',
  '/tools/contribution-margin-calculator', '/tools/discount-impact-calculator',
  '/tools/delivery-pricing-calculator',
  '/library/qa-profitability-model', '/tools/qa-break-even', '/insights/qa-costing-a-menu',
];
const publicRoutes = ['en', 'ar'].flatMap((l) => publicPaths.map((p) => `/${l}${p}`));

let failures = 0;
const fail = (msg) => { failures++; console.log(`FAIL ${msg}`); };

for (const route of [...adminRoutes, ...publicRoutes]) {
  const response = await page.goto(`${BASE}${route}`, { waitUntil: 'domcontentloaded' });
  const status = response?.status() ?? 0;
  const brokeDown =
    (await page.locator('h1:has-text("Application error"), h2:has-text("Something went wrong")').count()) > 0;
  if (status !== 200 || brokeDown) fail(`${status} ${route}${brokeDown ? ' (error boundary)' : ''}`);
  else console.log(`ok   ${status} ${route}`);
}

// ------------------------------------------------------------ accessibility
for (const route of [
  '/en', '/ar', '/en/library', '/ar/library', '/en/start-here', '/admin/design',
  '/en/services/menu-strategy-engineering-pricing', '/ar/services/menu-strategy-engineering-pricing',
  '/en/tools/food-cost-calculator',
]) {
  await page.goto(`${BASE}${route}`, { waitUntil: 'domcontentloaded' });
  const audit = await page.evaluate(() => {
    const imagesWithoutAlt = [...document.querySelectorAll('img')].filter((i) => !i.hasAttribute('alt')).length;
    const controls = [...document.querySelectorAll('input:not([type="hidden"]), select, textarea')];
    const unlabelled = controls.filter((el) => {
      // Anything inside an aria-hidden subtree is not in the accessibility
      // tree at all — the spam honeypot, for instance — so it needs no label.
      if (el.closest('[aria-hidden="true"]')) return false;
      if (el.getAttribute('aria-label') || el.getAttribute('aria-labelledby') || el.getAttribute('title')) return false;
      if (el.id && document.querySelector(`label[for="${CSS.escape(el.id)}"]`)) return false;
      return !el.closest('label');
    }).length;
    const h1s = document.querySelectorAll('h1').length;
    const emptyLinks = [...document.querySelectorAll('a')].filter(
      (a) => !a.textContent.trim() && !a.getAttribute('aria-label') && !a.querySelector('img[alt]:not([alt=""])'),
    ).length;
    return { imagesWithoutAlt, unlabelled, h1s, emptyLinks };
  });
  const ok = audit.imagesWithoutAlt === 0 && audit.unlabelled === 0 && audit.h1s <= 1 && audit.emptyLinks === 0;
  if (!ok) fail(`a11y ${route}: ${JSON.stringify(audit)}`);
  else console.log(`ok   a11y ${route}`);
}

// --------------------------------------------------------------- navigation
for (const [locale, labels] of [
  ['en', ['Start Here', 'Library', 'Tools']],
  ['ar', ['ابدأ من هنا', 'المكتبة', 'الأدوات']],
]) {
  await page.goto(`${BASE}/${locale}`);
  for (const label of labels) {
    if ((await page.locator(`header a:has-text("${label}")`).count()) === 0) {
      fail(`navigation (${locale}) missing "${label}"`);
    }
  }
  if ((await page.locator(`header a[href="/${locale}/search"]`).count()) === 0) fail(`navigation (${locale}) missing search`);
  console.log(`ok   navigation (${locale})`);
}

// ---------------------------------------------------------------- dashboard
await page.goto(`${BASE}/admin`);
const dashText = (await page.locator('body').innerText()).toLowerCase();
for (const label of ['Resources live', 'Tools live', 'Drafts', 'Downloads (30 days)']) {
  if (!dashText.includes(label.toLowerCase())) fail(`dashboard metric "${label}"`);
}
console.log('ok   dashboard metrics');

// --------------------------------------------------------------- responsive
for (const [label, width, height] of [['mobile', 390, 844], ['tablet', 834, 1112], ['laptop', 1366, 768]]) {
  const ctx = await browser.newContext({ viewport: { width, height } });
  const p2 = await ctx.newPage();
  for (const route of [
    '/en', '/ar', '/en/library', '/ar/library', '/en/start-here', '/ar/start-here',
    '/en/tools/food-cost-calculator', '/ar/services/menu-strategy-engineering-pricing',
    '/ar/restaurant-growth',
  ]) {
    await p2.goto(`${BASE}${route}`, { waitUntil: 'domcontentloaded' });
    const overflow = await p2.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    if (overflow > 1) fail(`overflow ${overflow}px on ${label} ${route}`);
  }
  console.log(`ok   responsive ${label}`);
  await ctx.close();
}

await browser.close();
console.log(`\n${failures} failures`);
if (consoleErrors.length) {
  console.log('Browser errors:');
  for (const e of [...new Set(consoleErrors)].slice(0, 12)) console.log('  -', e);
}
process.exit(failures || consoleErrors.length ? 1 : 0);
