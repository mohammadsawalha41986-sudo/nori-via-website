import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Noriva',
  description: 'Restaurant marketing, creative and growth.',
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
