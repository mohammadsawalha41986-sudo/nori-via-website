/** Signs in and loads every Admin screen, failing on any non-200 or client error. */
import { chromium } from 'playwright';

const BASE = process.env.BASE_URL ?? 'http://127.0.0.1:3000';
const EMAIL = process.env.ADMIN_EMAIL;
const PASSWORD = process.env.ADMIN_PASSWORD;
if (!EMAIL || !PASSWORD) { console.error('Set ADMIN_EMAIL and ADMIN_PASSWORD.'); process.exit(2); }

const ROUTES = [
  '/admin', '/admin/inquiries', '/admin/messages', '/admin/homepage', '/admin/system',
  '/admin/services', '/admin/services/new', '/admin/work', '/admin/work/new',
  '/admin/case-studies', '/admin/case-studies/new', '/admin/insights', '/admin/insights/new',
  '/admin/pages', '/admin/pages/about', '/admin/media', '/admin/statistics',
  '/admin/testimonials', '/admin/taxonomies', '/admin/settings', '/admin/navigation', '/admin/seo',
];

const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined, args: ['--no-sandbox'] });
const page = await (await browser.newContext()).newPage();

const pageErrors = [];
page.on('pageerror', (e) => pageErrors.push(String(e).slice(0, 120)));

await page.goto(`${BASE}/admin/login`, { waitUntil: 'networkidle' });
await page.fill('#email', EMAIL);
await page.fill('#password', PASSWORD);
await page.click('button[type=submit]');
await page.waitForURL('**/admin', { timeout: 20000 });

let failures = 0;
for (const route of ROUTES) {
  pageErrors.length = 0;
  const res = await page.goto(BASE + route, { waitUntil: 'networkidle' });
  const status = res?.status() ?? 0;
  const bad = status !== 200 || pageErrors.length > 0;
  if (bad) failures++;
  console.log(`${bad ? 'FAIL' : 'PASS'}  ${route}  ${status}${pageErrors.length ? ' — ' + pageErrors[0] : ''}`);
}

await browser.close();
console.log(`\n${ROUTES.length - failures}/${ROUTES.length} admin routes render cleanly`);
process.exit(failures ? 1 : 0);
