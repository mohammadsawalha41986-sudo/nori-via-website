/**
 * Pure text helpers for metadata.
 *
 * Kept separate from `seo.tsx` so they can be imported (and unit tested)
 * without pulling in JSX.
 */

/**
 * Condenses CMS body copy into a meta-description-length summary. Used when a
 * page has no explicit SEO description entered in Admin.
 */
export function summarise(text: string, max = 155) {
  const flat = text.replace(/\s+/g, ' ').trim();
  if (!flat) return '';
  if (flat.length <= max) return flat;

  const cut = flat.slice(0, max);
  const stop = Math.max(cut.lastIndexOf('. '), cut.lastIndexOf('! '), cut.lastIndexOf('? '));
  return stop > 60 ? cut.slice(0, stop + 1) : `${cut.replace(/[\s,;:]+\S*$/, '')}…`;
}
