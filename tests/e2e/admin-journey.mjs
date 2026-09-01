import { chromium } from 'playwright';

const BASE = process.env.BASE_URL ?? 'http://127.0.0.1:3000';
const EMAIL = process.env.ADMIN_EMAIL;
const PASSWORD = process.env.ADMIN_PASSWORD;

if (!EMAIL || !PASSWORD) {
  console.error('Set ADMIN_EMAIL and ADMIN_PASSWORD before running the journey.');
  process.exit(2);
}
const results = [];
const ok = (name, pass, detail = '') => {
  results.push({ name, pass, detail });
  console.log(`${pass ? 'PASS' : 'FAIL'}  ${name}${detail ? ` — ${detail}` : ''}`);
};

const browser = await chromium.launch({
  // Honour a preinstalled browser when one is provided by the environment.
  executablePath: process.env.CHROMIUM_PATH || undefined,
  args: ['--no-sandbox'],
});
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();

const consoleErrors = [];
page.on('console', (m) => {
  if (m.type() === 'error') consoleErrors.push(m.text());
});
page.on('response', (r) => {
  if (r.status() >= 400) consoleErrors.push(`${r.status()} ${r.url()}`);
});

// ---- 1. Login is required -------------------------------------------------
await page.goto(`${BASE}/admin`, { waitUntil: 'networkidle' });
ok('unauthenticated /admin redirects to login', page.url().includes('/admin/login'), page.url());

// ---- 2. Wrong password is rejected ---------------------------------------
await page.fill('#email', EMAIL);
await page.fill('#password', 'wrong-password-here');
await page.click('button[type=submit]');
await page.waitForSelector('form [role=alert]', { timeout: 10000 });
ok('wrong password is rejected', (await page.textContent('form [role=alert]')).includes('Invalid'));
ok('failed login preserves the typed email', (await page.inputValue('#email')) === EMAIL);

// ---- 3. Correct password signs in ----------------------------------------
await page.fill('#password', PASSWORD);
await page.click('button[type=submit]');
await page.waitForURL('**/admin', { timeout: 15000 });
ok('correct password signs in', page.url().endsWith('/admin'));
ok('dashboard shows the inquiry inbox', (await page.textContent('body')).includes('Recent inquiries'));

// ---- 4. Edit the homepage hero and verify it on the public site ----------
const NEW_HEADLINE = 'WE MAKE RESTAURANTS\nIMPOSSIBLE TO IGNORE.\nEDITED FROM ADMIN.';
await page.goto(`${BASE}/admin/homepage`, { waitUntil: 'networkidle' });
await page.fill('#heroHeadlineEn', NEW_HEADLINE);
await page.click('main button:has-text("Save changes")');
await page.waitForSelector('form [role=status]', { timeout: 20000 });
ok('homepage save reports success', (await page.textContent('form [role=status]')).includes('Saved'));

const pub = await ctx.newPage();
await pub.goto(`${BASE}/en`, { waitUntil: 'networkidle' });
const h1 = (await pub.textContent('h1')) || '';
ok('edited headline appears on the public homepage', h1.includes('EDITED FROM ADMIN'), h1.replace(/\s+/g, ' ').trim());

// ---- 5. Create and publish a service, verify it appears publicly ---------
await page.goto(`${BASE}/admin/services/new`, { waitUntil: 'networkidle' });
await page.fill('#nameEn', 'QA Test Service');
await page.fill('#nameAr', 'خدمة اختبار');
await page.fill('#slug', 'qa-test-service');
await page.fill('#summaryEn', 'A service created by the automated admin journey test.');
await page.selectOption('#status', 'PUBLISHED');
await page.click('main button:has-text("Save changes")');
// `/admin/services/new` also matches a loose glob, so wait for the real id.
await page.waitForURL((u) => /\/admin\/services\/[a-z0-9]{16,}$/.test(u.toString()), { timeout: 20000 });
ok('new service is created and opens its edit page', /\/admin\/services\/[a-z0-9]{16,}$/.test(page.url()), page.url());

await pub.goto(`${BASE}/en/services`, { waitUntil: 'networkidle' });
ok('published service appears on /en/services', (await pub.textContent('body')).includes('QA Test Service'));

await pub.goto(`${BASE}/en/services/qa-test-service`, { waitUntil: 'networkidle' });
ok('service detail page renders', (await pub.textContent('h1')).includes('QA Test Service'));

await pub.goto(`${BASE}/ar/services/qa-test-service`, { waitUntil: 'networkidle' });
ok('Arabic service page uses the Arabic name', (await pub.textContent('h1')).includes('خدمة اختبار'));

// ---- 6. Unpublish removes it from the public site ------------------------
await page.goto(`${BASE}/admin/services`, { waitUntil: 'networkidle' });
const row = page.locator('main li', { hasText: 'QA Test Service' }).first();
await row.locator('button:has-text("Unpublish")').click();
await page.waitForTimeout(2500);
await pub.goto(`${BASE}/en/services`, { waitUntil: 'networkidle' });
ok('unpublished service disappears from the public index', !(await pub.textContent('body')).includes('QA Test Service'));

const resp = await pub.goto(`${BASE}/en/services/qa-test-service`);
ok('unpublished service detail returns 404', resp.status() === 404, `status ${resp.status()}`);

// ---- 7. Inquiry inbox shows the real submissions -------------------------
await page.goto(`${BASE}/admin/inquiries`, { waitUntil: 'networkidle' });
const inbox = await page.textContent('body');
ok('inquiry inbox lists submitted leads', inbox.includes('Khalid Al-Harbi') && inbox.includes('Sara Al-Otaibi'));

await page.click('text=Khalid Al-Harbi');
await page.waitForURL('**/admin/inquiries/**', { timeout: 10000 });
const detail = await page.textContent('body');
ok('inquiry detail shows the full request', detail.includes('Nakhla Grill') && detail.includes('menu.png'));

// ---- 8. Private attachment requires the session --------------------------
// The session cookie is Secure, which browsers send over localhost but Node's
// request context will not — so this is checked through real navigation.
const key = await page.getAttribute('a[href^="/api/admin/attachments/"]', 'href');
const download = page.waitForEvent('download', { timeout: 10000 }).catch(() => null);
await page.click('a[href^="/api/admin/attachments/"]');
const file = await download;
ok('signed-in admin can download the attachment', file !== null, file ? await file.suggestedFilename() : 'no download');

const anon = await browser.newContext();
const anonPage = await anon.newPage();
const anonRes = await anonPage.goto(`${BASE}${key}`);
ok('signed-out request for the attachment is refused', anonRes.status() === 401, `status ${anonRes.status()}`);
await anon.close();

// ---- 9. Status update persists -------------------------------------------
await page.selectOption('select[name=status]', 'CONTACTED');
await page.fill('textarea[name=notes]', 'Called on Monday; sending a proposal.');
await page.click('main button:has-text("Update")');
await page.waitForTimeout(2000);
await page.reload({ waitUntil: 'networkidle' });
ok('inquiry status update persists', (await page.inputValue('select[name=status]')) === 'CONTACTED');

// ---- 10. Sign out ---------------------------------------------------------
await page.click('button:has-text("Sign out")');
await page.waitForURL('**/admin/login', { timeout: 10000 });
ok('sign out returns to login', page.url().includes('/admin/login'));

const after = await page.goto(`${BASE}/admin/settings`);
ok('session is destroyed after sign out', page.url().includes('/admin/login'), page.url());

// The unpublished test service is expected to 404 — that is asserted above,
// and Next also prefetches it from the admin list, so it is excluded here.
const unexpected = consoleErrors.filter(
  (e) => !e.includes('qa-test-service') && !e.includes('Failed to load resource'),
);
ok('no unexpected errors during the admin journey', unexpected.length === 0, unexpected.slice(0, 3).join(' | '));

await browser.close();

const failed = results.filter((r) => !r.pass);
console.log(`\n${results.length - failed.length}/${results.length} checks passed`);
process.exit(failed.length ? 1 : 0);
