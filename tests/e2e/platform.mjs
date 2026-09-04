/**
 * Platform suite: the design system, Library, Tools, content relationships,
 * publishing states, search, admin preview and navigation validation.
 */
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

await page.goto(`${BASE}/admin/login`);
await page.fill('input[name="email"]', EMAIL);
await page.fill('input[name="password"]', PASSWORD);
await page.click('button[type="submit"]');
await page.waitForURL(/\/admin(?!\/login)/, { timeout: 20000 });
check('admin login', page.url().includes('/admin'));

// ------------------------------------------------------------ design tokens
await page.goto(`${BASE}/admin/design`);
await page.fill('input[name="color.brand"][type="text"]', '#1E9E6A');
await page.fill('input[name="shape.radiusCard"]', '4');
await page.click('button[type="submit"]:has-text("Save changes")');
await page.waitForSelector('text=Saved', { timeout: 20000 });
check('design tokens saved', true);

await page.goto(`${BASE}/en`);
const brand = await page.evaluate(() =>
  getComputedStyle(document.documentElement).getPropertyValue('--c-brand-500').trim(),
);
check('brand token reaches the public site', brand === '30 158 106', brand);

await page.goto(`${BASE}/admin/design`);
await page.selectOption('#type-arabic', 'tajawal');
await page.fill('#type-size', '19');
await page.fill('#shape-btn', '6');
await page.fill('input[name="color.brand"][type="text"]', '#F5106E');
await page.fill('input[name="shape.radiusCard"]', '16');
await page.click('button[type="submit"]:has-text("Save changes")');
await page.waitForSelector('text=Saved', { timeout: 20000 });

await page.goto(`${BASE}/ar`);
const shape = await page.evaluate(() => ({
  size: getComputedStyle(document.documentElement).getPropertyValue('--font-size-base').trim(),
  radius: getComputedStyle(document.documentElement).getPropertyValue('--radius-btn').trim(),
  font: getComputedStyle(document.body).fontFamily,
}));
check('base font size token applied', shape.size === '19px', shape.size);
check('button radius token applied', shape.radius === '6px', shape.radius);
check('Arabic font switched from Admin', /Tajawal/i.test(shape.font), shape.font.slice(0, 30));

await page.goto(`${BASE}/admin/design`);
await page.selectOption('#type-arabic', 'plex-arabic');
await page.fill('#type-size', '17');
await page.fill('#shape-btn', '999');
await page.click('button[type="submit"]:has-text("Save changes")');
await page.waitForSelector('text=Saved', { timeout: 20000 });

// -------------------------------------------------------- social + floating
await page.goto(`${BASE}/admin/social`);
await page.selectOption('select[name="platform"]', 'linkedin');
await page.fill('input[name="url"]', 'https://www.linkedin.com/company/example');
await page.click('button:has-text("Add channel")');
await page.waitForSelector('text=Saved', { timeout: 20000 });
await page.selectOption('#kind-new-action', 'whatsapp');
await page.fill('#value-new-action', '+966500000000');
await page.click('button:has-text("Add button")');
await page.waitForTimeout(1500);

await page.goto(`${BASE}/en`);
check('floating WhatsApp button comes from the CMS',
  (await page.getAttribute('a[href^="https://wa.me/"]', 'href')) === 'https://wa.me/966500000000');
check('social link renders in the footer',
  (await page.locator('footer a[href*="linkedin.com/company/example"]').count()) > 0);

// ------------------------------------------------------------------ library
await page.goto(`${BASE}/admin/resources/new`);
await page.fill('#titleEn', 'QA Profitability Model');
await page.fill('#titleAr', 'نموذج ربحية للاختبار');
await page.fill('#slug', 'qa-profitability-model');
await page.selectOption('#type', 'EXCEL');
await page.fill('#summaryEn', 'A spreadsheet for costing every menu item.');
await page.fill('#summaryAr', 'ملف لحساب تكلفة كل صنف.');
await page.fill('#includes', 'Cost sheet | ورقة التكاليف');
await page.fill('#audience', 'Owners | أصحاب المشاريع');
await page.setInputFiles('#file', FIXTURE);
await page.selectOption('#status', 'PUBLISHED');
await page.click('button[type="submit"]:has-text("Save changes")');
await page.waitForURL((u) => /\/admin\/resources\/[a-z0-9]+$/.test(u.pathname) && !u.pathname.endsWith('/new'), { timeout: 30000 });
check('resource created with an xlsx upload', true);

await page.goto(`${BASE}/en/library?type=EXCEL&q=profitability`);
check('library search and type filter find it',
  (await page.locator('a[href*="/library/qa-profitability-model"]').count()) > 0);

await page.goto(`${BASE}/ar/library`);
check('library renders in Arabic RTL',
  (await page.getAttribute('html', 'dir')) === 'rtl' && (await page.locator('text=نموذج ربحية للاختبار').count()) > 0);

const download = await context.request.get(`${BASE}/api/library/qa-profitability-model/download`);
const body = await download.body();
check('download serves the uploaded file',
  download.status() === 200 && body.subarray(0, 2).toString('latin1') === 'PK', `${body.length} bytes`);
check('download is an attachment with the original name',
  (download.headers()['content-disposition'] ?? '').includes('qa-model.xlsx'));
check('unknown resource download 404s', (await context.request.get(`${BASE}/api/library/nope/download`)).status() === 404);

// -------------------------------------------------------------------- tools
await page.goto(`${BASE}/admin/tools/new`);
await page.fill('#nameEn', 'QA Break-even Calculator');
await page.fill('#slug', 'qa-break-even');
await page.fill('#summaryEn', 'How many covers a service needs to break even.');
await page.click('button:has-text("Add input")');
let row = page.locator('li:has-text("Input 1")');
await row.locator('input').first().fill('fixedCost');
await row.locator('input').nth(1).fill('Fixed cost');
await row.locator('input[type="number"]').first().fill('4000');
await page.click('button:has-text("Add input")');
row = page.locator('li:has-text("Input 2")');
await row.locator('input').first().fill('contribution');
await row.locator('input').nth(1).fill('Contribution per cover');
await row.locator('input[type="number"]').first().fill('80');
await page.click('button:has-text("Add result")');
const out = page.locator('li:has-text("Result 1")');
await out.locator('input').first().fill('covers');
await out.locator('input').nth(1).fill('Covers needed');
await out.locator('input[dir="ltr"]').last().fill('ceil(fixedCost / contribution)');
await page.waitForTimeout(400);
check('builder previews the formula result', (await page.locator('dd').first().innerText()).includes('50'));

await out.locator('input[dir="ltr"]').last().fill('ceil(fixedCost / nonexistent)');
await page.waitForTimeout(300);
check('builder flags an unknown field', (await page.locator('text=Unknown field').count()) > 0);
await out.locator('input[dir="ltr"]').last().fill('ceil(fixedCost / contribution)');
await page.waitForTimeout(300);
await page.selectOption('#status', 'PUBLISHED');
await page.click('button[type="submit"]:has-text("Save changes")');
await page.waitForURL((u) => /\/admin\/tools\/[a-z0-9]+$/.test(u.pathname) && !u.pathname.endsWith('/new'), { timeout: 30000 });
check('tool created', true);

await page.goto(`${BASE}/en/tools/qa-break-even`);
check('public tool computes from defaults',
  (await page.locator('dd').first().innerText()).replace(/[^0-9.]/g, '') === '50.00');
await page.fill('#tool-fixedCost', '8000');
await page.waitForTimeout(300);
check('public tool recomputes on input',
  (await page.locator('dd').first().innerText()).replace(/[^0-9.]/g, '') === '100.00');

// ------------------------------------------------------------ relationships
await page.goto(`${BASE}/admin/tools`);
await page.click('a:has-text("QA Break-even Calculator")');
await page.click('button:has-text("QA Profitability Model")');
await page.click('button[type="submit"]:has-text("Save changes")');
await page.waitForSelector('text=Saved', { timeout: 20000 });

await page.goto(`${BASE}/en/tools/qa-break-even`);
check('related resource shows on the tool',
  (await page.locator('a[href*="/library/qa-profitability-model"]').count()) > 0);
await page.goto(`${BASE}/en/library/qa-profitability-model`);
check('the relationship is bidirectional',
  (await page.locator('a[href*="/tools/qa-break-even"]').count()) > 0);

// ------------------------------------------------------------- draft guards
await page.goto(`${BASE}/admin/resources`);
await page.click('a:has-text("QA Profitability Model")');
await page.selectOption('#status', 'DRAFT');
await page.click('button[type="submit"]:has-text("Save changes")');
await page.waitForSelector('text=Saved', { timeout: 20000 });

const anon = await browser.newContext();
check('draft resource is not public', (await anon.request.get(`${BASE}/en/library/qa-profitability-model`)).status() === 404);
check('draft file cannot be downloaded', (await anon.request.get(`${BASE}/api/library/qa-profitability-model/download`)).status() === 404);
check('admin requires a session',
  [302, 307].includes((await anon.request.get(`${BASE}/admin/resources`, { maxRedirects: 0 })).status()));
await anon.close();

await page.goto(`${BASE}/en/library/qa-profitability-model?preview=1`);
check('admin can preview the draft', (await page.locator('text=Draft preview').count()) > 0);

await page.goto(`${BASE}/en/search?q=profitability`);
check('search excludes drafts', (await page.locator('a[href*="/library/qa-profitability-model"]').count()) === 0);
await page.goto(`${BASE}/en/search?q=break-even`);
check('search finds the published tool', (await page.locator('a[href*="/tools/qa-break-even"]').count()) > 0);

await page.goto(`${BASE}/admin/resources`);
await page.click('a:has-text("QA Profitability Model")');
await page.selectOption('#status', 'PUBLISHED');
await page.click('button[type="submit"]:has-text("Save changes")');
await page.waitForSelector('text=Saved', { timeout: 20000 });

// ------------------------------------------------------------------ preview
await page.goto(`${BASE}/admin/preview`);
await page.click('button:has-text("Mobile")');
await page.click('button:has-text("العربية")');
await page.waitForTimeout(2500);
check('admin preview renders the real site in Arabic',
  (await page.frameLocator('iframe').locator('html').getAttribute('dir').catch(() => null)) === 'rtl');

// -------------------------------------------- insights, scheduling, filters
await page.goto(`${BASE}/admin/insights/new`);
await page.fill('#titleEn', 'QA costing a menu');
await page.fill('#titleAr', 'اختبار تسعير القائمة');
await page.fill('#slug', 'qa-costing-a-menu');
await page.fill('#excerptEn', 'Where menu margin actually comes from.');
await page.fill('#contentEn', 'Paragraph one.\n\nParagraph two.');
await page.fill('#contentAr', 'الفقرة الأولى.\n\nالفقرة الثانية.');
await page.click('button:has-text("QA Break-even Calculator")');
await page.selectOption('#status', 'PUBLISHED');
await page.click('button[type="submit"]:has-text("Save changes")');
await page.waitForURL((u) => /\/admin\/insights\/[a-z0-9]+$/.test(u.pathname) && !u.pathname.endsWith('/new'), { timeout: 30000 });
check('article created through the existing CMS', true);

await page.goto(`${BASE}/en/insights/qa-costing-a-menu`);
check('article links to its related tool', (await page.locator('a[href*="/tools/qa-break-even"]').count()) > 0);
await page.goto(`${BASE}/en/tools/qa-break-even`);
check('tool shows the article in return', (await page.locator('a[href*="/insights/qa-costing-a-menu"]').count()) > 0);
await page.goto(`${BASE}/ar/insights/qa-costing-a-menu`);
check('article renders its Arabic body', (await page.locator('text=الفقرة الأولى').count()) > 0);
await page.goto(`${BASE}/en/search?q=costing`);
check('search finds the new article', (await page.locator('a[href*="/insights/qa-costing-a-menu"]').count()) > 0);

const future = new Date(Date.now() + 7 * 864e5).toISOString().slice(0, 10);
await page.goto(`${BASE}/admin/insights`);
await page.click('a:has-text("QA costing a menu")');
await page.fill('#publishedAt', future);
await page.click('button[type="submit"]:has-text("Save changes")');
await page.waitForSelector('text=Saved', { timeout: 20000 });

const anon2 = await browser.newContext();
check('scheduled article is not public yet', (await anon2.request.get(`${BASE}/en/insights/qa-costing-a-menu`)).status() === 404);
check('scheduled article is off the index',
  !(await (await anon2.request.get(`${BASE}/en/insights`)).text()).includes('qa-costing-a-menu'));
await anon2.close();

await page.goto(`${BASE}/admin/insights`);
check('admin shows a SCHEDULED badge', (await page.locator('text=SCHEDULED').count()) > 0);
await page.click('a:has-text("QA costing a menu")');
await page.fill('#publishedAt', new Date().toISOString().slice(0, 10));
await page.click('button[type="submit"]:has-text("Save changes")');
await page.waitForSelector('text=Saved', { timeout: 20000 });
const anon3 = await browser.newContext();
check('article returns once its date arrives', (await anon3.request.get(`${BASE}/en/insights/qa-costing-a-menu`)).status() === 200);
await anon3.close();

await page.goto(`${BASE}/admin/insights?q=costing`);
check('admin list search filters articles', (await page.locator('a:has-text("QA costing a menu")').count()) > 0);
await page.goto(`${BASE}/admin/insights?q=zzzznotathing`);
check('admin list search reports an empty result', (await page.locator('text=No articles match').count()) > 0);

// ------------------------------------------------ navigation link validation
await page.goto(`${BASE}/admin/navigation`);
await page.fill('#labelEn-new-header', 'Broken');
await page.fill('#href-new-header', '/does-not-exist');
await page.click('button:has-text("Add link")');
await page.waitForTimeout(1200);
check('CMS refuses a navigation link that would 404',
  (await page.locator('text=is not a page on this site').count()) > 0 ||
  (await page.locator('text=Please check the highlighted fields').count()) > 0);

// ------------------------------------------------ Start Here + page relations
await page.goto(`${BASE}/admin/pages/start-here`);
await page.click('button:has-text("QA Profitability Model")');
await page.click('button[type="submit"]:has-text("Save changes")');
await page.waitForSelector('text=Saved', { timeout: 20000 });

await page.goto(`${BASE}/en/start-here`);
check('Start Here renders its CMS route cards', (await page.locator('a[href^="/en/"]').count()) > 3);
check('Start Here shows the attached resource',
  (await page.locator('a[href*="/library/qa-profitability-model"]').count()) > 0);
await page.goto(`${BASE}/ar/start-here`);
check('Start Here renders in Arabic RTL', (await page.getAttribute('html', 'dir')) === 'rtl');

// -------------------------------------------------------------- responsive
for (const [label, width, height] of [['mobile', 390, 844], ['tablet', 834, 1112]]) {
  const ctx = await browser.newContext({ viewport: { width, height } });
  const p2 = await ctx.newPage();
  let worst = 0;
  for (const route of ['/en', '/ar', '/en/library', '/ar/library', '/en/tools/qa-break-even']) {
    await p2.goto(`${BASE}${route}`, { waitUntil: 'domcontentloaded' });
    worst = Math.max(worst, await p2.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth));
  }
  check(`no horizontal overflow on ${label}`, worst <= 1, `${worst}px`);
  await ctx.close();
}

await browser.close();
const failed = results.filter((r) => !r.ok);
console.log(`\n${results.length - failed.length}/${results.length} checks passed`);
if (failed.length) { console.log('FAILED:', failed.map((f) => f.name).join(', ')); process.exit(1); }
