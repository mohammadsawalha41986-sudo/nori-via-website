import { Inter, Bricolage_Grotesque, IBM_Plex_Sans_Arabic } from 'next/font/google';

export const sans = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

export const display = Bricolage_Grotesque({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
  weight: ['400', '600', '700', '800'],
});

export const arabic = IBM_Plex_Sans_Arabic({
  subsets: ['arabic', 'latin'],
  variable: '--font-arabic',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
});

export const fontVars = `${sans.variable} ${display.variable} ${arabic.variable}`;
