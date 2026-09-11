import { CANONICAL_SITE_URL } from './site-url';
import type { Locale } from './i18n';

/**
 * The brand entity, as search engines should understand it.
 *
 * This is deliberately code-level rather than CMS-driven. The company name
 * shown in the header and footer is editorial and belongs in Admin, but the
 * *entity* a search engine resolves — the preferred site name, the schema
 * identity, the Open Graph site name — must stay stable across content edits.
 * A one-word rename in Admin should never dissolve the brand entity Google has
 * built up, and "NORIVA GLOBAL" is what disambiguates the company from the
 * similarly spelled businesses it currently competes with in search results.
 */
export const BRAND = {
  /** Preferred site name. What Google should print above the search result. */
  name: 'NORIVA GLOBAL',
  /** Short form, offered as an alternate so both spellings resolve here. */
  shortName: 'NORIVA',
  nameAr: 'نوريفا جلوبال',
  shortNameAr: 'نوريفا',
  /** The country the company serves. ISO 3166-1 alpha-2, as schema.org expects. */
  areaServed: 'SA',
} as const;

/**
 * Stable JSON-LD node identifiers.
 *
 * Every graph node that refers to the company points at `organizationId`
 * instead of repeating the organisation inline, so a crawler merges them into
 * one entity rather than reading a dozen look-alike organisations.
 */
export const SCHEMA_IDS = {
  organization: `${CANONICAL_SITE_URL}/#organization`,
  website: `${CANONICAL_SITE_URL}/#website`,
} as const;

/** Brand mark used wherever a logo has to be an absolute, always-present URL. */
export const BRAND_LOGO = {
  path: '/icon-512.png',
  width: 512,
  height: 512,
} as const;

/** The localised brand name, for on-page copy and metadata. */
export function brandName(locale: Locale): string {
  return locale === 'ar' ? BRAND.nameAr : BRAND.name;
}

/**
 * What the company actually does, in each language.
 *
 * Used as the description of last resort when Admin has not filled the SEO
 * fields, and as the `description` of the Organization node. Every claim here
 * is drawn from the services the site already publishes — nothing is invented.
 */
export const BRAND_DESCRIPTION: Record<Locale, string> = {
  en: 'NORIVA GLOBAL is a restaurant, café and F&B consulting and development company in Saudi Arabia, working on menu engineering, food cost, profitability, operations and restaurant growth.',
  ar: 'نوريفا جلوبال شركة استشارات وتطوير للمطاعم والمقاهي وقطاع الأغذية والمشروبات في السعودية، تعمل على هندسة المنيو وتكلفة الطعام وتحليل الربحية وتحسين التشغيل ونمو المطاعم.',
};

/**
 * Subject areas the company works in, for the Organization `knowsAbout` field.
 *
 * These mirror the published service catalogue, so the list stays truthful; it
 * exists to tell a crawler which industry this entity belongs to, which is the
 * signal that separates it from unrelated companies with similar names.
 */
export const BRAND_TOPICS: Record<Locale, string[]> = {
  en: [
    'Restaurant consulting',
    'Restaurant development',
    'Food and beverage consulting',
    'Menu engineering',
    'Food cost analysis',
    'Restaurant profitability analysis',
    'Restaurant operations',
    'Feasibility studies',
    'Restaurant growth',
  ],
  ar: [
    'استشارات المطاعم',
    'تطوير المطاعم',
    'تطوير المقاهي',
    'استشارات الأغذية والمشروبات',
    'هندسة المنيو',
    'تحليل تكلفة الطعام',
    'تحليل ربحية المطاعم',
    'تحسين التشغيل',
    'دراسات جدوى المطاعم',
  ],
};

/**
 * Guarantees the brand entity is present in a title.
 *
 * Titles are editorial and live in Admin, but the SERP is where the brand is
 * currently being confused with similarly spelled companies, so the entity
 * cannot be left to whatever a title happens to say. This normalises rather
 * than overrides: a title already naming the full brand is returned untouched,
 * a title that opens with the short name has that name completed, and anything
 * else keeps its own words and gains the brand as a suffix.
 */
export function withBrand(title: string, locale: Locale): string {
  const text = title.trim();
  const full = locale === 'ar' ? BRAND.nameAr : BRAND.name;
  const short = locale === 'ar' ? BRAND.shortNameAr : BRAND.shortName;

  if (!text) return full;

  const haystack = text.toLowerCase();
  if (haystack.includes(full.toLowerCase())) return text;

  /*
    "NORIVA — …" becomes "NORIVA GLOBAL — …" rather than gaining a second,
    redundant mention of the same brand at the end.

    The boundary is a Unicode lookahead rather than `\b`, which only knows
    about ASCII: against "نوريفا" it never matches, and the Arabic title —
    the one that matters most here — would silently fall through to the
    suffix branch and read "نوريفا — … — نوريفا جلوبال".
  */
  const opensWithShort = new RegExp(`^${short}(?![\\p{L}\\p{N}])`, 'iu');
  if (opensWithShort.test(text)) return text.replace(opensWithShort, full);

  return `${text} — ${full}`;
}

/** Every spelling of the brand, longest first so a prefix never matches early. */
const BRAND_SPELLINGS = [BRAND.name, BRAND.nameAr, BRAND.shortName, BRAND.shortNameAr];

/**
 * True when a value is the company itself rather than a person.
 *
 * The article `author` column holds a free-text byline, and the shipped
 * articles put the company name in it. Rendered literally that produces a
 * `Person` named after the company — structured data asserting that NORIVA
 * GLOBAL is a human being. This is what tells the page to use the
 * organisation node instead.
 */
export function isBrandName(value: string | null | undefined): boolean {
  const text = (value ?? '').trim().toLowerCase();
  if (!text) return true;
  return BRAND_SPELLINGS.some((spelling) => spelling.toLowerCase() === text);
}

/**
 * Removes a brand suffix an editor (or the content scripts) already appended.
 *
 * Page titles run through Next's `%s — NORIVA GLOBAL` template, so a stored
 * title ending in the brand comes out branded twice: "… — نوريفا — NORIVA
 * GLOBAL". Stripping the stored suffix first leaves the template to add the
 * one canonical form, and costs the SERP no characters it did not need to
 * spend. A title that merely mentions the brand mid-sentence is left alone —
 * only a trailing separator + brand is removed. The separator class covers the
 * pipe as well as the dashes, because the shipped titles use both.
 */
export function stripBrandSuffix(title: string): string {
  let text = title.trim();

  // Loop: content scripts have appended the short form to titles that already
  // carried it, and one pass would leave the second copy behind.
  for (;;) {
    const match = text.match(TRAILING_SEGMENT);
    if (!match) return text;

    const head = text.slice(0, match.index).trim();
    const cleaned = withoutBrandTokens(match[0]);
    if (!head || cleaned === null) return text;

    // "— Noriva Library" keeps its section word and loses only the brand, so
    // titles that rely on that word to tell two pages apart still do.
    text = cleaned ? `${head} — ${cleaned}` : head;
  }
}

/** The last separator-delimited segment of a title, separator included. */
const TRAILING_SEGMENT = /[\s]*[—–|·-][^—–|·-]*$/;

/**
 * Drops the brand from a trailing segment, or returns `null` to leave it be.
 *
 * "— Noriva", "— Noriva Library" and "— مكتبة نوريفا" are all a brand tag on
 * the end of a real title, and only the brand part of them is noise: the
 * section word is often the only thing distinguishing two pages that share a
 * name, so it stays. The word limit keeps a genuine trailing clause that
 * happens to mention the company from being rewritten.
 */
function withoutBrandTokens(segment: string): string | null {
  const words = segment
    .replace(/^[\s]*[—–|·-][\s]*/, '')
    .split(/[\s]+/)
    .filter(Boolean);

  if (!words.length || words.length > 3) return null;

  let remaining = words;
  let removed = false;

  // Longest spelling first, so "NORIVA GLOBAL" is not reduced to "GLOBAL".
  for (const spelling of BRAND_SPELLINGS) {
    const parts = spelling.toLowerCase().split(/\s+/);
    const lowered = remaining.map((word) => word.toLowerCase());
    if (!parts.every((part) => lowered.includes(part))) continue;
    remaining = remaining.filter((word) => !parts.includes(word.toLowerCase()));
    removed = true;
  }

  return removed ? remaining.join(' ') : null;
}
