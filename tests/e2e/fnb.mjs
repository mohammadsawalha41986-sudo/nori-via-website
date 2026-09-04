import { chromium } from 'playwright';

const BASE = process.env.QA_BASE_URL ?? 'http://127.0.0.1:3000';
const EMAIL = process.env.QA_EMAIL ?? 'qa@example.com';
const PASSWORD = process.env.QA_PASSWORD ?? 'LocalQaPassword123!';
const CHROMIUM = process.env.QA_CHROMIUM ?? '/opt/pw-browsers/chromium';
const FIXTURE = process.env.QA_XLSX ?? '/var/tmp/qa-model.xlsx';
const results = [];
const check = (name, ok, detail = '') => {
  results.push({ name, ok });
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? ` — ${detail}` : ''}`);
};

const browser = await chromium.launch({ executablePath: CHROMIUM });
const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await context.newPage();
const errors = [];
page.on('pageerror', (e) => errors.push(`${page.url()} :: ${e.message.slice(0, 100)}`));
page.on('console', (m) => m.type() === 'error' && errors.push(`${page.url()} :: ${m.text().slice(0, 100)}`));

// ---------------------------------------------------------------- positioning
await page.goto(`${BASE}/en`);
const heroEn = await page.locator('h1').innerText();
check('English hero states the F&B positioning', /F&B|Food & Beverage/i.test(await page.locator('body').innerText()) && /better f&b businesses/i.test(heroEn), heroEn.replace(/\n/g, ' '));

await page.goto(`${BASE}/ar`);
const heroAr = await page.locator('h1').innerText();
check('Arabic hero states the F&B positioning', heroAr.includes('مشاريع أغذية ومشروبات'), heroAr.replace(/\n/g, ' '));
check('Arabic homepage is RTL', (await page.getAttribute('html', 'dir')) === 'rtl');

// ------------------------------------------------------------- menu service
await page.goto(`${BASE}/en/services/menu-strategy-engineering-pricing`);
const menuText = await page.locator('body').innerText();
check('menu service page is published', (await page.locator('h1').innerText()).toLowerCase().includes('menu'));
check('menu deliverables are listed', menuText.includes('Menu engineering matrix') && menuText.includes('Item profitability analysis'));
check('illustrative example is labelled', /illustrative example/i.test(menuText) && /not a client result/i.test(menuText));
check('example uses menu-engineering terminology', /stars/i.test(menuText) && /plowhorses/i.test(menuText));

await page.goto(`${BASE}/ar/services/menu-strategy-engineering-pricing`);
const menuAr = await page.locator('body').innerText();
check('menu service reads in Arabic', menuAr.includes('هندسة') && menuAr.includes('تسعير'));
check('Arabic example is labelled', menuAr.includes('مثال توضيحي'));

// ------------------------------------------------------- service questionnaire
await page.goto(`${BASE}/en/services/menu-strategy-engineering-pricing#request`);
await page.waitForSelector('#intake-menuProblem', { timeout: 15000 });
check('service questionnaire renders its questions', (await page.locator('#request select, #request input, #request textarea').count()) > 12);

await page.fill('input[name="name"]', 'QA Tester');
await page.fill('input[name="email"]', 'qa-fnb@example.com');
await page.fill('input[name="business"]', 'QA Café');
await page.selectOption('#intake-businessType', 'cafe');
await page.selectOption('#intake-stage', 'existing');
await page.fill('#intake-itemCount', '40');
await page.fill('#intake-challenge', 'Sales are flat and the menu is too long.');
await page.fill('#intake-menuProblem', 'Too many items, unclear which ones make money.');
await page.click('#request button:has-text("Delivery")');
await page.setInputFiles('#request input[type="file"]', FIXTURE);
await page.click('button:has-text("Send request")');
await page.waitForSelector('text=Your request is in', { timeout: 30000 });
check('service request submits with an Excel attachment', true);

// The consultant must receive it as a structured brief.
await page.goto(`${BASE}/admin/login`);
await page.fill('input[name="email"]', EMAIL);
await page.fill('input[name="password"]', PASSWORD);
await page.click('button[type="submit"]');
await page.waitForURL(/\/admin(?!\/login)/, { timeout: 20000 });
await page.goto(`${BASE}/admin/inquiries`);
await page.click('a:has-text("QA Tester")');
// Wait for the detail route before reading the page.
await page.waitForURL(/\/admin\/inquiries\/[a-z0-9]+$/, { timeout: 20000 });
await page.waitForSelector('text=Service brief', { timeout: 20000 });
const brief = await page.locator('body').innerText();
check('admin shows the requested service', brief.includes('menu-strategy-engineering-pricing'));
check('admin shows the structured brief', brief.includes('Service brief') && brief.includes('Too many items'));
check('admin shows the multi-select answer', brief.includes('delivery'));
check('admin lists the attachment', /qa-model\.xlsx/.test(brief));

// ------------------------------------------------------------------- tools
const toolChecks = [
  ['food-cost-calculator', '30.0%'],
  ['menu-pricing-calculator', '40.00'],
  ['discount-impact-calculator', '55.6%'],
];
for (const [slug, expected] of toolChecks) {
  await page.goto(`${BASE}/en/tools/${slug}`);
  const value = await page.locator('dd').first().innerText();
  check(`${slug} computes`, value.replace(/\s/g, '').includes(expected.replace(/\s/g, '')), value);
}
await page.goto(`${BASE}/ar/tools/delivery-pricing-calculator`);
check('delivery calculator renders in Arabic', (await page.locator('body').innerText()).includes('صافي الإيراد'));

// -------------------------------------------------------------- start here
await page.goto(`${BASE}/ar/start-here`);
const startAr = await page.locator('body').innerText();
check('Start Here asks the F&B question in Arabic', startAr.includes('أريد دراسة وتطوير القائمة') && startAr.includes('أملك مقهى'));
check('Start Here routes to the menu service', (await page.locator('a[href*="/services/menu-strategy-engineering-pricing"]').count()) > 0);

// ------------------------------------------------------- drafts stay private
const anon = await browser.newContext();
check('draft services are not public', (await anon.request.get(`${BASE}/en/services/cafe-consulting`)).status() === 404);
check('draft library entries are not public', (await anon.request.get(`${BASE}/en/library/menu-engineering-template`)).status() === 404);
const servicesIndex = await (await anon.request.get(`${BASE}/en/services`)).text();
check('draft services are off the index', !servicesIndex.includes('cafe-consulting'));
await anon.close();

// ------------------------------------------------------------------ search
await page.goto(`${BASE}/en/search?q=menu`);
check('search finds the menu service and tools', (await page.locator('a[href*="/services/menu-strategy"]').count()) > 0 && (await page.locator('a[href*="/tools/"]').count()) > 0);

// -------------------------------------------------------------- responsive
for (const [label, width, height] of [['mobile', 390, 844], ['tablet', 834, 1112]]) {
  const ctx = await browser.newContext({ viewport: { width, height } });
  const p2 = await ctx.newPage();
  for (const route of ['/ar', '/ar/services/menu-strategy-engineering-pricing', '/ar/start-here', '/en/tools/food-cost-calculator']) {
    await p2.goto(`${BASE}${route}`, { waitUntil: 'domcontentloaded' });
    const overflow = await p2.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    if (overflow > 1) check(`no overflow ${label} ${route}`, false, `${overflow}px`);
  }
  check(`no horizontal overflow on ${label}`, true);
  await ctx.close();
}

await browser.close();
const failed = results.filter((r) => !r.ok);
console.log(`\n${results.length - failed.length}/${results.length} checks passed`);
if (errors.length) console.log('Browser errors:', [...new Set(errors)].slice(0, 6).join(' | '));
if (failed.length) { console.log('FAILED:', failed.map((f) => f.name).join(', ')); process.exit(1); }
