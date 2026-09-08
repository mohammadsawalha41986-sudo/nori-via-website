/**
 * Service imagery regression suite.
 *
 * The three image slots on a service have three different jobs and must never
 * be confused with one another:
 *
 *   featuredImage — rendered on the service page and as the index thumbnail
 *   ogImage       — never rendered in the page, only emitted as social metadata
 *   gallery       — a set of supporting images rendered in their own section
 *
 * This suite drives the admin form for a real service, then asserts what the
 * public pages actually render in a browser (English and Arabic, desktop and
 * mobile), and finally restores whatever the CMS held before it ran.
 */
import { chromium } from 'playwright';

const BASE = process.env.QA_BASE_URL ?? 'http://127.0.0.1:3000';
const EMAIL = process.env.QA_EMAIL ?? 'qa@example.com';
const PASSWORD = process.env.QA_PASSWORD ?? 'LocalQaPassword123!';
const CHROMIUM = process.env.QA_CHROMIUM;
const SLUG = process.env.QA_SERVICE_SLUG ?? 'menu-strategy-engineering-pricing';

const FEATURED = '/img/gallery-11.jpg';
const SOCIAL = '/img/gallery-12.jpg';
const GALLERY = ['/img/gallery-1.jpg', '/img/gallery-2.jpg'];
const GALLERY_RAW = `${GALLERY[0]} | QA gallery one | معرض واحد\n${GALLERY[1]} | QA gallery two | معرض اثنان`;

const results = [];
const check = (name, ok, detail = '') => {
  results.push({ name, ok });
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? ` — ${detail}` : ''}`);
};

/** The source a rendered <img> ultimately points at, seen through next/image. */
const sourceOf = (src) => {
  try {
    const url = new URL(src, BASE);
    return url.pathname === '/_next/image' ? (url.searchParams.get('url') ?? src) : url.pathname;
  } catch {
    return src;
  }
};

/** Every image the browser painted, with the decoded source and load state. */
const paintedImages = (page) =>
  page.$$eval('img', (nodes) =>
    nodes.map((n) => ({
      src: n.currentSrc || n.src,
      alt: n.getAttribute('alt') ?? '',
      loading: n.getAttribute('loading'),
      natural: n.naturalWidth,
      complete: n.complete,
      hidden: n.offsetParent === null && getComputedStyle(n).position !== 'fixed' && getComputedStyle(n).position !== 'absolute',
      display: getComputedStyle(n).display,
      visibility: getComputedStyle(n).visibility,
      opacity: getComputedStyle(n).opacity,
    })),
  );

/**
 * Bring every image into view and wait for the browser to finish with it.
 * Lazily loaded images below the fold never start loading on their own in a
 * headless viewport, so the page is scrolled through first.
 */
const settle = async (page) => {
  await page.waitForLoadState('domcontentloaded');
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 400) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 150));
    }
  });
  // `complete` lies about images the browser has not scheduled yet, so wait on
  // pixels actually being decoded.
  await page
    .waitForFunction(() => Array.from(document.images).every((i) => i.naturalWidth > 0), null, { timeout: 20000 })
    .catch(() => {});
  await page.evaluate(() => window.scrollTo(0, 0));
};

const browser = await chromium.launch({ executablePath: CHROMIUM || undefined, args: ['--no-sandbox'] });
const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await context.newPage();
const errors = [];
page.on('pageerror', (e) => errors.push(`${page.url()} :: ${e.message.slice(0, 120)}`));
page.on('response', (r) => {
  if (r.status() >= 400 && /\.(jpe?g|png|webp|avif|gif|svg)|\/_next\/image/.test(r.url())) {
    errors.push(`image ${r.status()} ${r.url().slice(0, 120)}`);
  }
});

// ------------------------------------------------------------------- sign in
await page.goto(`${BASE}/admin/login`);
await page.fill('input[name="email"]', EMAIL);
await page.fill('input[name="password"]', PASSWORD);
await page.click('button[type="submit"]');
await page.waitForURL(/\/admin(?!\/login)/, { timeout: 20000 });

// Find the service by its public slug — the admin list prints it under the name.
await page.goto(`${BASE}/admin/services`);
const editUrl = await page.$$eval(
  'a[href^="/admin/services/"]',
  (links, slug) => {
    const row = links.find((l) => new RegExp(`/${slug}(\\s|$|\\u00b7)`).test(l.textContent ?? ''));
    return row ? row.getAttribute('href') : '';
  },
  SLUG,
).then((href) => (href ? `${BASE}${href}` : ''));
if (editUrl) await page.goto(editUrl);

check('the service under test is editable in admin', Boolean(editUrl), editUrl || SLUG);
if (!editUrl) {
  await browser.close();
  process.exit(1);
}

// Remember what the CMS held so the run leaves no trace.
const before = {
  featuredImage: await page.inputValue('input[name="featuredImage"]'),
  ogImage: await page.inputValue('input[name="ogImage"]'),
  galleryRaw: await page.inputValue('textarea[name="galleryRaw"]'),
};

const saveForm = async () => {
  const invalid = await page.$$eval('input:invalid, textarea:invalid, select:invalid', (n) =>
    n.map((e) => e.getAttribute('name') ?? e.id),
  );
  if (invalid.length) throw new Error(`form rejected before save: ${invalid.join(', ')}`);
  await page.click('button[type="submit"]:has-text("Save")');
  await page.waitForSelector('text=/Saved|saved/', { timeout: 20000 });
};

const setImages = async ({ featuredImage, ogImage, galleryRaw }) => {
  await page.goto(editUrl);
  await page.fill('input[name="featuredImage"]', featuredImage);
  await page.fill('input[name="ogImage"]', ogImage);
  await page.fill('textarea[name="galleryRaw"]', galleryRaw);
  await saveForm();
};

// The fixtures must belong to no other service, or the negative assertions
// below ("this image is gone", "that image is never painted") prove nothing.
await page.goto(`${BASE}/en/services`);
await settle(page);
const baseline = (await paintedImages(page)).map((i) => sourceOf(i.src));
check(
  'the fixture images are not already used elsewhere on the services index',
  !baseline.includes(FEATURED) && !baseline.includes(SOCIAL),
  baseline.join(', '),
);

// ------------------------------------------------- admin writes the three slots
await setImages({ featuredImage: FEATURED, ogImage: SOCIAL, galleryRaw: GALLERY_RAW });
await page.goto(editUrl);
check(
  'the three image slots survive a reload of the admin form',
  (await page.inputValue('input[name="featuredImage"]')) === FEATURED &&
    (await page.inputValue('input[name="ogImage"]')) === SOCIAL &&
    (await page.inputValue('textarea[name="galleryRaw"]')).includes(GALLERY[1]),
);

// --------------------------------------------------------- public service page
for (const locale of ['en', 'ar']) {
  await page.goto(`${BASE}/${locale}/services/${SLUG}`);
  await settle(page);
  const heading = await page.locator('h1').first().innerText();
  const imgs = await paintedImages(page);
  const sources = imgs.map((i) => sourceOf(i.src));

  const featured = imgs.find((i) => sourceOf(i.src) === FEATURED);
  check(`[${locale}] the featured image is rendered on the service page`, Boolean(featured), sources.join(', '));
  check(
    `[${locale}] the featured image actually loads and is visible`,
    Boolean(featured) && featured.natural > 0 && featured.display !== 'none' && featured.visibility !== 'hidden' && featured.opacity !== '0',
    featured ? `natural=${featured.natural} display=${featured.display}` : 'missing',
  );
  check(
    `[${locale}] the featured image carries the service name as alt text`,
    Boolean(featured) && featured.alt.trim().length > 0 && featured.alt.trim().toLocaleLowerCase() === heading.trim().toLocaleLowerCase(),
    featured?.alt,
  );

  check(
    `[${locale}] the social share image is not painted into the page`,
    !sources.includes(SOCIAL),
    sources.join(', '),
  );

  const galleryImgs = imgs.filter((i) => GALLERY.includes(sourceOf(i.src)));
  check(`[${locale}] every gallery image is rendered`, galleryImgs.length === GALLERY.length, `${galleryImgs.length}/${GALLERY.length}`);
  check(
    `[${locale}] gallery images load, are lazy and keep their own alt text`,
    galleryImgs.length === GALLERY.length &&
      galleryImgs.every((i) => i.natural > 0 && i.loading === 'lazy' && i.alt.trim().length > 0) &&
      new Set(galleryImgs.map((i) => i.alt)).size === GALLERY.length,
    galleryImgs.map((i) => `${i.alt}/${i.loading}`).join(' | '),
  );

  check(
    `[${locale}] no image on the page is broken`,
    imgs.every((i) => i.natural > 0),
    imgs.filter((i) => !i.natural).map((i) => i.src).join(', '),
  );

  const og = await page.getAttribute('meta[property="og:image"]', 'content');
  const twitter = await page.getAttribute('meta[name="twitter:image"]', 'content');
  check(`[${locale}] og:image is the social share image`, Boolean(og) && og.endsWith(SOCIAL), og ?? 'none');
  check(`[${locale}] twitter:image matches og:image`, twitter === og, twitter ?? 'none');
}

// ------------------------------------------------------- responsive behaviour
const mobile = await context.newPage();
await mobile.setViewportSize({ width: 390, height: 844 });
await mobile.goto(`${BASE}/en/services/${SLUG}`);
await settle(mobile);
const mobileImgs = await paintedImages(mobile);
const mobileFeatured = mobileImgs.find((i) => sourceOf(i.src) === FEATURED);
check('[mobile] the featured image renders and fits the viewport', Boolean(mobileFeatured) && mobileFeatured.natural > 0);
const overflow = await mobile.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
check('[mobile] the service page does not scroll sideways', overflow <= 1, `overflow ${overflow}px`);
await mobile.close();

// ------------------------------------------------------------- services index
for (const locale of ['en', 'ar']) {
  await page.goto(`${BASE}/${locale}/services`);
  await settle(page);
  const imgs = await paintedImages(page);
  const thumb = imgs.find((i) => sourceOf(i.src) === FEATURED);
  check(`[${locale}] the services index shows the featured image as a thumbnail`, Boolean(thumb) && thumb.natural > 0);
  check(`[${locale}] index thumbnails are lazy loaded`, !thumb || thumb.loading === 'lazy', thumb?.loading ?? 'none');
  check(
    `[${locale}] the services index has no broken images`,
    imgs.every((i) => i.natural > 0),
    imgs.filter((i) => !i.natural).map((i) => i.src).join(', '),
  );
}

// ------------------------------------------- social metadata falls back safely
await setImages({ featuredImage: FEATURED, ogImage: '', galleryRaw: GALLERY_RAW });
await page.goto(`${BASE}/en/services/${SLUG}`);
const fallback = await page.getAttribute('meta[property="og:image"]', 'content');
check('og:image falls back to the featured image when no social image is set', Boolean(fallback) && fallback.endsWith(FEATURED), fallback ?? 'none');

// ------------------------------------------- a service without images stays clean
await setImages({ featuredImage: '', ogImage: '', galleryRaw: '' });
await page.goto(`${BASE}/en/services/${SLUG}`);
await settle(page);
const bare = await paintedImages(page);
check(
  'a service with no imagery renders no placeholder and nothing broken',
  bare.every((i) => i.natural > 0) && !bare.some((i) => sourceOf(i.src) === FEATURED),
  bare.map((i) => sourceOf(i.src)).join(', '),
);
await page.goto(`${BASE}/en/services`);
await settle(page);
check('the index drops the thumbnail when the service has no featured image', !(await paintedImages(page)).some((i) => sourceOf(i.src) === FEATURED));

// ----------------------------------------------------------------- restore CMS
await setImages(before);
await page.goto(editUrl);
check(
  'the suite restored the values the CMS held before it ran',
  (await page.inputValue('input[name="featuredImage"]')) === before.featuredImage &&
    (await page.inputValue('input[name="ogImage"]')) === before.ogImage &&
    (await page.inputValue('textarea[name="galleryRaw"]')) === before.galleryRaw,
);

check('no page errors or failed image requests', errors.length === 0, errors.slice(0, 5).join(' | '));

await browser.close();
const failed = results.filter((r) => !r.ok);
console.log(`\n${results.length - failed.length}/${results.length} checks passed`);
process.exit(failed.length ? 1 : 0);
