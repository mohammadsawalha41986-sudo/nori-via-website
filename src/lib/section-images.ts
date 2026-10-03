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
  services: '/img/noriva-photo-training.webp',
  work: '/img/noriva-photo-brand.webp',
  insights: '/img/noriva-photo-menu.webp',
  tools: '/img/noriva-photo-costing.webp',
  library: '/img/noriva-photo-inventory.webp',
  'restaurant-growth': '/img/noriva-photo-delivery.webp',
  'start-here': '/img/noriva-photo-launch.webp',
  'start-a-project': '/img/noriva-photo-planning.webp',
  contact: '/img/noriva-photo-cafe.webp',
} as const;

export type SectionKey = keyof typeof SECTION_HERO_IMAGES;

export function sectionHero(key: SectionKey): string {
  return SECTION_HERO_IMAGES[key];
}
