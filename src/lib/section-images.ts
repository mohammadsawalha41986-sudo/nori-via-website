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
  services: '/img/noriva-editorial-training.webp',
  work: '/img/noriva-editorial-brand.webp',
  insights: '/img/noriva-editorial-menu.webp',
  tools: '/img/noriva-editorial-costing.webp',
  library: '/img/noriva-editorial-inventory.webp',
  'restaurant-growth': '/img/noriva-editorial-delivery.webp',
  'start-here': '/img/noriva-editorial-launch.webp',
  'start-a-project': '/img/cta.jpg',
  contact: '/img/gallery-3.jpg',
} as const;

export type SectionKey = keyof typeof SECTION_HERO_IMAGES;

export function sectionHero(key: SectionKey): string {
  return SECTION_HERO_IMAGES[key];
}
