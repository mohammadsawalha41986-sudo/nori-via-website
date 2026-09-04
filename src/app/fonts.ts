import {
  Inter,
  Manrope,
  Plus_Jakarta_Sans,
  Bricolage_Grotesque,
  Space_Grotesk,
  Archivo,
  IBM_Plex_Sans_Arabic,
  Tajawal,
  Cairo,
} from 'next/font/google';

/**
 * Every selectable family is self-hosted by `next/font` and exposes the same
 * CSS variable, so switching a font in Admin is a class swap on <html> — no
 * runtime request to a third-party font host, and no layout shift on load.
 *
 * Each loader must be called and assigned at module scope; the maps below just
 * index those constants.
 */
const inter = Inter({ subsets: ['latin'], variable: '--font-sans', display: 'swap' });
const manrope = Manrope({ subsets: ['latin'], variable: '--font-sans', display: 'swap' });
const jakarta = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-sans', display: 'swap' });

const bricolage = Bricolage_Grotesque({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
  weight: ['400', '600', '700', '800'],
});
const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
  weight: ['400', '600', '700'],
});
const archivo = Archivo({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
  weight: ['400', '600', '700', '800'],
});

const plexArabic = IBM_Plex_Sans_Arabic({
  subsets: ['arabic', 'latin'],
  variable: '--font-arabic',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
});
const tajawal = Tajawal({
  subsets: ['arabic'],
  variable: '--font-arabic',
  display: 'swap',
  weight: ['300', '400', '500', '700'],
});
const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  variable: '--font-arabic',
  display: 'swap',
  weight: ['300', '400', '600', '700'],
});

const sansFonts = { inter, manrope, jakarta };
const displayFonts = { bricolage: bricolage, space: spaceGrotesk, archivo };
const arabicFonts = { 'plex-arabic': plexArabic, tajawal, cairo };

/** Admin always writes a validated key, but an unknown value falls back safely. */
export function fontVarsFor(choice: { sansFont?: string; displayFont?: string; arabicFont?: string } = {}) {
  const sans = sansFonts[choice.sansFont as keyof typeof sansFonts] ?? sansFonts.inter;
  const display = displayFonts[choice.displayFont as keyof typeof displayFonts] ?? displayFonts.bricolage;
  const arabic = arabicFonts[choice.arabicFont as keyof typeof arabicFonts] ?? arabicFonts['plex-arabic'];
  return `${sans.variable} ${display.variable} ${arabic.variable}`;
}

/** Default trio, used by the admin shell and anywhere tokens are not loaded. */
export const fontVars = fontVarsFor();
