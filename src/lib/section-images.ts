/**
 * The photograph behind each section's hero.
 *
 * Kept in one map rather than hard-coded per page: the point of these images is
 * that no two sections share one, and that is only checkable if they are
 * written down together. Every file lives in `public/img` and is committed to
 * the repository, so a section hero can never resolve to a missing image.
 *
 * A section absent from this map simply renders the brand gradient — the hero
 * is designed to work with or without a photograph.
 */
export const SECTION_HERO_IMAGES = {
  services: '/img/noriva-system-06.webp',
  work: '/img/noriva-system-07.webp',
  insights: '/img/noriva-system-09.webp',
  tools: '/img/noriva-system-04.webp',
  library: '/img/noriva-system-10.webp',
  'restaurant-growth': '/img/noriva-system-05.webp',
  'start-here': '/img/noriva-system-01.webp',
  'start-a-project': '/img/cta.jpg',
  contact: '/img/gallery-3.jpg',
} as const;

export type SectionKey = keyof typeof SECTION_HERO_IMAGES;

export function sectionHero(key: SectionKey): string {
  return SECTION_HERO_IMAGES[key];
}
