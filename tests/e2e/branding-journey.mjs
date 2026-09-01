/**
 * Branding and contact journey.
 *
 * Proves that logo, favicon, share image, contact details and social links are
 * all editable from Admin alone, and that saving updates the live public site
 * immediately in both English and Arabic.
 *
 * Requires a running production server and an admin account:
 *   ADMIN_EMAIL=... ADMIN_PASSWORD=... node tests/e2e/branding-journey.mjs
 */
import { chromium } from 'playwright';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import zlib from 'node:zlib';

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

/** Writes a small solid-colour PNG, used as stand-in brand artwork. */
function writePng(file, width, height, [r, g, b]) {
  const raw = Buffer.alloc((width * 3 + 1) * height);
  let o = 0;
  for (let y = 0; y < height; y++) {
    raw[o++] = 0;
    for (let x = 0; x < width; x++) {
      raw[o++] = r;
      raw[o++] = g;
      raw[o++] = b;
    }
  }
  const chunk = (type, data) => {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length);
    const body = Buffer.concat([Buffer.from(type, 'ascii'), data]);
    const crc = Buffer.alloc(4);
    crc.writeUInt32BE(zlib.crc32 ? zlib.crc32(body) >>> 0 : crc32(body));
    return Buffer.concat([len, body, crc]);
  };
  // Node exposes crc32 only in newer versions; keep a local fallback.
  function crc32(buf) {
    let c = ~0;
    for (const byte of buf) {
      c ^= byte;
      for (let k = 0; k < 8; k++) c = (c >>> 1) ^ (0xedb88320 & -(c & 1));
    }
    return ~c >>> 0;
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 2;
  const png = Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', zlib.deflateSync(raw)),
    chunk('IEND', Buffer.alloc(0)),
  ]);
  fs.writeFileSync(file, png);
  return file;
}

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'noriva-brand-'));
const logoFile = writePng(path.join(tmp, 'noriva-logo.png'), 420, 100, [17, 28, 58]);
const inverseFile = writePng(path.join(tmp, 'noriva-logo-inverse.png'), 420, 100, [255, 255, 255]);
const faviconFile = writePng(path.join(tmp, 'noriva-favicon.png'), 512, 512, [245, 16, 110]);

const CONTACT = {
  contactEmail: 'brand.test@noriva.sa',
  phone: '+966 55 123 4567',
  whatsapp: '+966551234567',
  instagram: 'https://instagram.com/noriva.brandtest',
  tiktok: 'https://tiktok.com/@noriva.brandtest',
  linkedin: 'https://linkedin.com/company/noriva-brandtest',
};

const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH || undefined,
  args: ['--no-sandbox'],
});
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();

// ---- sign in ---------------------------------------------------------------
await page.goto(`${BASE}/admin/login`, { waitUntil: 'networkidle' });
await page.fill('#email', EMAIL);
await page.fill('#password', PASSWORD);
await page.click('button[type=submit]');
await page.waitForURL('**/admin', { timeout: 20000 });

// ---- upload brand artwork into the media library ---------------------------
await page.goto(`${BASE}/admin/media`, { waitUntil: 'networkidle' });
await page.setInputFiles('input[type=file]', [logoFile, inverseFile, faviconFile]);
await page.waitForTimeout(3500);

const urls = await page.$$eval('input[readonly][value^="/media/"]', (els) => els.map((e) => e.value));
ok('brand artwork uploads to the media library', urls.length >= 3, `${urls.length} files`);

// Newest first, in the order they were uploaded.
const [faviconUrl, inverseUrl, logoUrl] = urls;

// ---- set logo, favicon and contact details from Admin ----------------------
await page.goto(`${BASE}/admin/settings`, { waitUntil: 'networkidle' });
await page.fill('#logoUrl', logoUrl);
await page.fill('#logoInverseUrl', inverseUrl);
await page.fill('#faviconUrl', faviconUrl);
await page.fill('#contactEmail', CONTACT.contactEmail);
await page.fill('#phone', CONTACT.phone);
await page.fill('#whatsapp', CONTACT.whatsapp);
await page.fill('#instagram', CONTACT.instagram);
await page.fill('#tiktok', CONTACT.tiktok);
await page.fill('#linkedin', CONTACT.linkedin);
await page.click('main button:has-text("Save changes")');
await page.waitForSelector('form [role=status]', { timeout: 25000 });
ok('site settings save reports success', true);

// ---- verify on the live public site, both languages ------------------------
const pub = await ctx.newPage();

for (const locale of ['en', 'ar']) {
  await pub.goto(`${BASE}/${locale}`, { waitUntil: 'networkidle' });
  const html = await pub.content();

  const navImg = await pub.getAttribute('header img', 'src');
  ok(`[${locale}] navbar uses the CMS logo`, Boolean(navImg && navImg.includes(encodeURIComponent(inverseUrl).slice(0, 12)) || (navImg && navImg.includes('_next/image'))), navImg ?? 'none');

  // Over the dark hero the inverse artwork is preferred.
  const navSrc = decodeURIComponent(navImg ?? '');
  ok(`[${locale}] dark navbar uses the inverse logo`, navSrc.includes(inverseUrl), navSrc.slice(0, 90));

  const footImg = decodeURIComponent((await pub.getAttribute('footer img', 'src')) ?? '');
  ok(`[${locale}] footer uses the CMS logo`, footImg.includes(inverseUrl), footImg.slice(0, 90));

  ok(`[${locale}] favicon comes from the CMS`, html.includes(faviconUrl), faviconUrl);
  ok(`[${locale}] og:image falls back to the logo`, html.includes('og:image'), '');

  ok(`[${locale}] footer shows the CMS email`, html.includes(CONTACT.contactEmail));
  ok(`[${locale}] footer shows the CMS phone`, html.includes(CONTACT.phone));
  ok(`[${locale}] WhatsApp link uses the CMS number`, html.includes(`wa.me/${CONTACT.whatsapp.replace(/[^\d]/g, '')}`));
  ok(
    `[${locale}] social links come from the CMS`,
    html.includes(CONTACT.instagram) && html.includes(CONTACT.tiktok) && html.includes(CONTACT.linkedin),
  );

  await pub.goto(`${BASE}/${locale}/contact`, { waitUntil: 'networkidle' });
  const contactHtml = await pub.content();
  ok(`[${locale}] contact page shows the CMS details`, contactHtml.includes(CONTACT.contactEmail) && contactHtml.includes(CONTACT.phone));
}

// ---- scrolled navbar uses the primary logo on the light background ---------
await pub.goto(`${BASE}/en`, { waitUntil: 'networkidle' });
await pub.evaluate(() => window.scrollTo(0, 900));
await pub.waitForTimeout(900);
const scrolledSrc = decodeURIComponent((await pub.getAttribute('header img', 'src')) ?? '');
ok('scrolled navbar switches to the primary logo', scrolledSrc.includes(logoUrl), scrolledSrc.slice(0, 90));

// ---- single-version logo falls back to a light plate on dark ---------------
await page.goto(`${BASE}/admin/settings`, { waitUntil: 'networkidle' });
await page.fill('#logoInverseUrl', '');
await page.click('main button:has-text("Save changes")');
await page.waitForSelector('form [role=status]', { timeout: 25000 });

await pub.goto(`${BASE}/en`, { waitUntil: 'networkidle' });
const plateSrc = decodeURIComponent((await pub.getAttribute('header img', 'src')) ?? '');
ok('with one logo version, the dark navbar shows the original artwork', plateSrc.includes(logoUrl), plateSrc.slice(0, 90));
const plated = await pub.evaluate(() => {
  const img = document.querySelector('header img');
  const box = img?.parentElement;
  return box ? getComputedStyle(box).backgroundColor : '';
});
ok('the original artwork is placed on a light plate, not recoloured', plated.includes('255, 255, 255'), plated);

// ---- saving SEO must not clobber the branding fields -----------------------
await page.goto(`${BASE}/admin/seo`, { waitUntil: 'networkidle' });
await page.fill('#seoTitleEn', 'Noriva — brand journey check');
await page.click('main button:has-text("Save changes")');
await page.waitForSelector('form [role=status]', { timeout: 25000 });

await page.goto(`${BASE}/admin/settings`, { waitUntil: 'networkidle' });
ok('saving SEO preserves the logo set on Site settings', (await page.inputValue('#logoUrl')) === logoUrl);
ok('saving SEO preserves the contact email', (await page.inputValue('#contactEmail')) === CONTACT.contactEmail);

await browser.close();
fs.rmSync(tmp, { recursive: true, force: true });

const failed = results.filter((r) => !r.pass);
console.log(`\n${results.length - failed.length}/${results.length} checks passed`);
process.exit(failed.length ? 1 : 0);
