import type { Metadata, Viewport } from 'next';
import './globals.css';
import { BRAND, BRAND_DESCRIPTION } from '@/lib/brand';

export const metadata: Metadata = {
  title: BRAND.name,
  description: BRAND_DESCRIPTION.en,
};

export const viewport: Viewport = {
  themeColor: '#0B1225',
  width: 'device-width',
  initialScale: 1,
};

/**
 * The real <html> element is rendered by the locale and admin layouts so that
 * `lang` and `dir` can be set correctly per section.
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
