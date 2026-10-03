import manifest from '../../scripts/visual-manifest.json';
const shipped = new Set<string>(manifest.images.map((image) => `/img/${image.name}.webp`));
for (const name of [
  'hero',
  'about',
  'cta',
  'service-brand',
  'service-content',
  'service-growth',
  'service-experience',
  'service-digital',
  'insight-1',
  'insight-2',
  'insight-3',
  'insight-4',
  'gallery-1',
  'gallery-2',
  'gallery-3',
  'gallery-4',
  'gallery-5',
  'gallery-6',
])
  shipped.add(`/img/${name}.jpg`);
export function isShippedImage(url: string | null | undefined) {
  return Boolean(url && shipped.has(url));
}
/** Retain authored/uploaded galleries. New editorial heroes supersede the old stock set. */
export function presentationGallery<T extends { url?: string }>(items: T[], hero: string | null) {
  return (hero?.startsWith('/img/noriva-editorial-') || hero?.startsWith('/img/noriva-photo-'))
    ? items.filter((item) => !isShippedImage(item.url) && item.url !== hero)
    : items;
}
