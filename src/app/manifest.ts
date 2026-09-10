import type { MetadataRoute } from 'next';
import { BRAND, BRAND_DESCRIPTION } from '@/lib/brand';

/**
 * Web app manifest.
 *
 * Its `name` is one more consistent statement of the brand entity, and the
 * icon set it points at is the same square N mark the HTML references — an
 * installed shortcut and a search result should never show different marks.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: BRAND.name,
    short_name: BRAND.shortName,
    description: BRAND_DESCRIPTION.en,
    start_url: '/',
    display: 'standalone',
    background_color: '#0B1225',
    theme_color: '#0B1225',
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  };
}
