/**
 * Design System acceptance test.
 *
 * Proves the whole chain for every token: Admin form → server action → database
 * → CSS custom property → the computed style of a real element on a real
 * public page, in both languages. It drives the colour swatch as well as the
 * hex box, because a swatch-only change was once silently discarded.
 *
 * The test restores the shipped defaults before it exits, so it leaves no
 * theme behind.
 */
import { chromium } from 'playwright';

const BASE = process.env.QA_BASE_URL ?? 'http://127.0.0.1:3000';
const EMAIL = process.env.QA_EMAIL ?? 'qa@example.com';
const PASSWORD = process.env.QA_PASSWORD ?? 'LocalQaPassword123!';
const CHROMIUM = process.env.QA_CHROMIUM;

const results = [];
const check = (name, ok, detail = '') => {
  results.push({ name, ok });
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? ` — ${detail}` : ''}`);
};

/** Deterministic, deliberately unmistakable values. */
const TEST = {
  brand: '#FF00FF',
  brandDark: '#FFA500',
  brandLight: '#800080',
  ink: '#FF0000',
  inkBody: '#0000FF',
  inkMuted: '#808000',
  border: '#00FF00',
  background: '#00FFFF',
};
const rgb = (hex) => {
  const n = Number.parseInt(hex.slice(1), 16);
  return `rgb(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255})`;
};

const browser = await chromium.launch({ executablePath: CHROMIUM || undefined, args: ['--no-sandbox'] });
const context = await browser.newContext();
const page = await context.newPage();

await page.goto(`${BASE}/admin/login`);
await page.fill('input[name="email"]', EMAIL);
await page.fill('input[name="password"]', PASSWORD);
await page.click('button[type="submit"]');
await page.waitForURL(/\/admin(?!\/login)/, { timeout: 20000 });

// ---------------------------------------------------------------- save it all
await page.goto(`${BASE}/admin/design`);

// The brand colour goes in through the swatch; the rest through the hex box.
// Both paths must reach the database.
await page.fill('input[aria-label="Brand / primary colour picker"]', TEST.brand.toLowerCase());
for (const [key, value] of Object.entries(TEST)) {
  if (key === 'brand') continue;
  await page.fill(`input[name="color.${key}"]`, value);
}
await page.fill('#type-size', '20');   // max allowed
await page.fill('#type-leading', '2.1');
await page.fill('#type-weight', '400');
await page.fill('#type-tracking', '0.05');
await page.selectOption('#type-arabic', 'tajawal');
await page.selectOption('#type-sans', 'manrope');
await page.selectOption('#type-display', 'archivo');
await page.fill('#shape-btn', '3');
await page.fill('#shape-card', '2');
await page.fill('#shape-input', '1');
await page.fill('#shape-container', '70');
await page.fill('#shape-section', '11');
const invalid = await page.evaluate(() => {
  const form = document.querySelector('input[name="color.brand"]')?.form;
  return form ? [...form.querySelectorAll(':invalid')].map((el) => el.getAttribute('name') ?? el.id) : ['no form'];
});
check('every field is within its allowed range', invalid.length === 0, invalid.join(', '));

await page.click('button[type="submit"]:has-text("Save changes")');
await page.waitForSelector('text=Saved', { timeout: 20000 });
check('design system saved', true);

// The swatch value must survive the round trip.
await page.reload();
const savedBrand = await page.inputValue('input[name="color.brand"]');
check('swatch-picked colour is stored', savedBrand.toUpperCase() === TEST.brand, savedBrand);

// ------------------------------------------------- measure the public pages
async function measure(path) {
  await page.goto(`${BASE}${path}`, { waitUntil: 'networkidle' });
  return page.evaluate(() => {
    const root = getComputedStyle(document.documentElement);
    const v = (n) => root.getPropertyValue(n).trim();
    const body = getComputedStyle(document.body);

    const withClass = (token) => [...document.querySelectorAll('*')].find((el) => el.classList.contains(token));
    const styleOf = (token, prop) => {
      const el = withClass(token);
      return el ? getComputedStyle(el)[prop] : null;
    };
    // Resolve a rule that only applies on hover, without hovering.
    const ruleValue = (selector, prop) => {
      for (const sheet of document.styleSheets) {
        let rules;
        try { rules = sheet.cssRules; } catch { continue; }
        for (const rule of rules ?? []) {
          if (rule.selectorText === selector) {
            const raw = rule.style.getPropertyValue(prop);
            if (!raw) continue;
            const probe = document.createElement('div');
            probe.style.setProperty(prop, raw);
            document.body.appendChild(probe);
            const value = getComputedStyle(probe)[prop === 'background-color' ? 'backgroundColor' : prop];
            probe.remove();
            return value;
          }
        }
      }
      return null;
    };

    const footer = document.querySelector('footer');
    const shell = document.querySelector('.shell');
    const section = withClass('section-y');
    // Some display elements carry deliberate art-directed tracking
    // (the footer wordmark, eyebrows). Measure one that does not.
    const display = [...document.querySelectorAll('h1.font-display, h2.font-display, h3.font-display')].find(
      (el) => ![...el.classList].some((c) => c.startsWith('tracking-')),
    );

    return {
      vars: {
        brand: v('--c-brand-500'), brandDark: v('--c-brand-600'), brandLight: v('--c-brand-300'),
        ink: v('--c-ink-900'), inkBody: v('--c-ink-600'), inkMuted: v('--c-ink-400'),
        border: v('--c-ink-100'), background: v('--c-bone'),
      },
      colours: {
        background: body.backgroundColor,
        ink: footer ? getComputedStyle(footer).backgroundColor : null,
        brand: styleOf('text-brand', 'color') ?? styleOf('bg-brand', 'backgroundColor'),
        brandLight: styleOf('text-brand-300', 'color'),
        brandDark: ruleValue('.hover\\:bg-brand-600:hover', 'background-color'),
        inkBody: styleOf('text-ink-600', 'color') ?? styleOf('prose-noriva', 'color'),
        inkMuted: styleOf('text-ink-400', 'color'),
        border: ruleValue('*, ::before, ::after', 'border-color') ?? ruleValue('*', 'border-color'),
      },
      typography: {
        baseSize: body.fontSize,
        lineHeight: getComputedStyle(withClass('prose-noriva') ?? document.body).lineHeight,
        headingWeight: display ? getComputedStyle(display).fontWeight : null,
        headingTracking: display ? getComputedStyle(display).letterSpacing : null,
        headingFontSize: display ? getComputedStyle(display).fontSize : null,
        headingClasses: display ? display.className : null,
        bodyFont: body.fontFamily,
        displayFont: display ? getComputedStyle(display).fontFamily : null,
      },
      shape: {
        button: styleOf('rounded-btn', 'borderRadius'),
        card: styleOf('rounded-card', 'borderRadius'),
        input: styleOf('rounded-input', 'borderRadius'),
        container: shell ? getComputedStyle(shell).maxWidth : null,
        section: section ? getComputedStyle(section).paddingTop : null,
      },
    };
  });
}

for (const [locale, path] of [['EN', '/en'], ['AR', '/ar']]) {
  const m = await measure(path);

  for (const [key, hex] of Object.entries(TEST)) {
    const expectedChannels = rgb(hex).replace(/rgb\(|\)/g, '').split(', ').join(' ');
    check(`${locale} · ${key} · CSS variable`, m.vars[key] === expectedChannels, `${m.vars[key]} (want ${expectedChannels})`);
  }

  check(`${locale} · background renders on the page`, m.colours.background === rgb(TEST.background), m.colours.background);
  check(`${locale} · heading/dark surface renders`, m.colours.ink === rgb(TEST.ink), m.colours.ink);
  check(`${locale} · brand renders on a real element`, m.colours.brand === rgb(TEST.brand), m.colours.brand ?? 'no consumer');
  check(`${locale} · brand-on-dark renders`, m.colours.brandLight === rgb(TEST.brandLight), m.colours.brandLight ?? 'no consumer');
  check(`${locale} · brand-pressed resolves`, m.colours.brandDark === rgb(TEST.brandDark), m.colours.brandDark ?? 'no consumer');
  check(`${locale} · body text renders`, m.colours.inkBody === rgb(TEST.inkBody), m.colours.inkBody ?? 'no consumer');
  check(`${locale} · muted text renders`, m.colours.inkMuted === rgb(TEST.inkMuted), m.colours.inkMuted ?? 'no consumer');
  check(`${locale} · border renders`, m.colours.border === rgb(TEST.border), m.colours.border ?? 'no consumer');

  check(`${locale} · base font size`, m.typography.baseSize === '20px', m.typography.baseSize);
  check(`${locale} · heading weight`, m.typography.headingWeight === '400', m.typography.headingWeight);
  // Letter spacing is em-relative to the heading's own size, not the base size.
  const trackingRatio = parseFloat(m.typography.headingTracking) / parseFloat(m.typography.headingFontSize);
  check(
    `${locale} · heading letter spacing`,
    Math.abs(trackingRatio - 0.05) < 0.005,
    `${m.typography.headingTracking} on ${m.typography.headingFontSize} (${trackingRatio.toFixed(3)}em) · ${m.typography.headingClasses}`,
  );
  check(`${locale} · display font`, /Archivo/i.test(m.typography.displayFont ?? ''), (m.typography.displayFont ?? '').slice(0, 40));
  check(
    `${locale} · body font`,
    locale === 'AR' ? /Tajawal/i.test(m.typography.bodyFont) : /Manrope/i.test(m.typography.bodyFont),
    m.typography.bodyFont.slice(0, 40),
  );

  check(`${locale} · button radius`, m.shape.button === '3px', m.shape.button ?? 'no consumer');
  check(`${locale} · card radius`, m.shape.card === '2px', m.shape.card ?? 'no consumer');
  check(`${locale} · container width`, m.shape.container === `${70 * 16}px`, m.shape.container);
  // `.section-y` is 1.3x from the sm breakpoint up, and the probe runs wide.
  check(`${locale} · section spacing`, m.shape.section === `${11 * 16 * 1.3}px`, m.shape.section ?? 'no consumer');
}

// Body line height governs long-form copy: measure it where prose exists.
for (const [locale, path] of [['EN', '/en/services/menu-strategy-engineering-pricing'], ['AR', '/ar/services/menu-strategy-engineering-pricing']]) {
  await page.goto(`${BASE}${path}`, { waitUntil: 'networkidle' });
  const prose = await page.evaluate(() => {
    const el = [...document.querySelectorAll('*')].find((e) => e.classList.contains('prose-noriva'));
    return el ? { lineHeight: getComputedStyle(el).lineHeight, fontSize: getComputedStyle(el).fontSize } : null;
  });
  check(
    `${locale} · body line height on long-form copy`,
    prose !== null && Math.abs(parseFloat(prose.lineHeight) / parseFloat(prose.fontSize) - 2.1) < 0.05,
    prose ? `${prose.lineHeight} / ${prose.fontSize}` : 'no prose on the page',
  );
}

// Input radius lives on pages that have a form.
await page.goto(`${BASE}/en/search`, { waitUntil: 'networkidle' });
const inputRadius = await page.evaluate(() => {
  const el = [...document.querySelectorAll('*')].find((e) => e.classList.contains('rounded-input'));
  return el ? getComputedStyle(el).borderRadius : null;
});
check('input radius', inputRadius === '1px', inputRadius ?? 'no consumer');

// --------------------------------------------------------------- restore
await page.goto(`${BASE}/admin/design`);
page.once('dialog', (d) => d.accept());
await page.click('button:has-text("Reset to brand defaults")');
await page.waitForTimeout(2500);

const restored = await measure('/en');
check('reset restores the brand colour', restored.vars.brand === '245 16 110', restored.vars.brand);
check('reset restores the page background', restored.colours.background === 'rgb(247, 245, 242)', restored.colours.background);
check('reset restores the base font size', restored.typography.baseSize === '17px', restored.typography.baseSize);
check('reset restores the button radius', restored.shape.button === '999px', restored.shape.button ?? 'no consumer');

await browser.close();
const failed = results.filter((r) => !r.ok);
console.log(`\n${results.length - failed.length}/${results.length} checks passed`);
if (failed.length) { console.log('FAILED:', failed.map((f) => f.name).join(', ')); process.exit(1); }
