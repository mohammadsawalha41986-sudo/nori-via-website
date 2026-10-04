import localFont from 'next/font/local';

// Bundled licensed fonts make builds independent of Google availability.
// The browser requests only the family selected in CMS.
// Swap display ensures the selected brand font is used even on slow links.
const inter = localFont({ src: [
    { path: '../../public/fonts/inter-400.woff2', weight: '400', style: 'normal' },
    { path: '../../public/fonts/inter-500.woff2', weight: '500', style: 'normal' },
    { path: '../../public/fonts/inter-600.woff2', weight: '600', style: 'normal' },
    { path: '../../public/fonts/inter-700.woff2', weight: '700', style: 'normal' }
], variable: '--font-sans', display: 'optional', preload: false });
const manrope = localFont({ src: [
    { path: '../../public/fonts/manrope-400.woff2', weight: '400', style: 'normal' },
    { path: '../../public/fonts/manrope-500.woff2', weight: '500', style: 'normal' },
    { path: '../../public/fonts/manrope-600.woff2', weight: '600', style: 'normal' },
    { path: '../../public/fonts/manrope-700.woff2', weight: '700', style: 'normal' }
], variable: '--font-sans', display: 'optional', preload: false });
const jakarta = localFont({ src: [
    { path: '../../public/fonts/jakarta-400.woff2', weight: '400', style: 'normal' },
    { path: '../../public/fonts/jakarta-500.woff2', weight: '500', style: 'normal' },
    { path: '../../public/fonts/jakarta-600.woff2', weight: '600', style: 'normal' },
    { path: '../../public/fonts/jakarta-700.woff2', weight: '700', style: 'normal' }
], variable: '--font-sans', display: 'optional', preload: false });
const bricolage = localFont({ src: [
    { path: '../../public/fonts/bricolage-400.woff2', weight: '400', style: 'normal' },
    { path: '../../public/fonts/bricolage-600.woff2', weight: '600', style: 'normal' },
    { path: '../../public/fonts/bricolage-700.woff2', weight: '700', style: 'normal' },
    { path: '../../public/fonts/bricolage-800.woff2', weight: '800', style: 'normal' }
], variable: '--font-display', display: 'optional', preload: false });
const spaceGrotesk = localFont({ src: [
    { path: '../../public/fonts/space-400.woff2', weight: '400', style: 'normal' },
    { path: '../../public/fonts/space-600.woff2', weight: '600', style: 'normal' },
    { path: '../../public/fonts/space-700.woff2', weight: '700', style: 'normal' }
], variable: '--font-display', display: 'optional', preload: false });
const archivo = localFont({ src: [
    { path: '../../public/fonts/archivo-400.woff2', weight: '400', style: 'normal' },
    { path: '../../public/fonts/archivo-600.woff2', weight: '600', style: 'normal' },
    { path: '../../public/fonts/archivo-700.woff2', weight: '700', style: 'normal' },
    { path: '../../public/fonts/archivo-800.woff2', weight: '800', style: 'normal' }
], variable: '--font-display', display: 'optional', preload: false });
const plexArabic = localFont({ src: [
    { path: '../../public/fonts/plex-arabic-300.woff2', weight: '300', style: 'normal' },
    { path: '../../public/fonts/plex-arabic-400.woff2', weight: '400', style: 'normal' },
    { path: '../../public/fonts/plex-arabic-500.woff2', weight: '500', style: 'normal' },
    { path: '../../public/fonts/plex-arabic-600.woff2', weight: '600', style: 'normal' },
    { path: '../../public/fonts/plex-arabic-700.woff2', weight: '700', style: 'normal' }
], variable: '--font-arabic', display: 'swap', preload: false });
const tajawal = localFont({ src: [
    { path: '../../public/fonts/tajawal-300.woff2', weight: '300', style: 'normal' },
    { path: '../../public/fonts/tajawal-400.woff2', weight: '400', style: 'normal' },
    { path: '../../public/fonts/tajawal-500.woff2', weight: '500', style: 'normal' },
    { path: '../../public/fonts/tajawal-700.woff2', weight: '700', style: 'normal' }
], variable: '--font-arabic', display: 'swap', preload: false });
const cairo = localFont({ src: [
    { path: '../../public/fonts/cairo-300.woff2', weight: '300', style: 'normal' },
    { path: '../../public/fonts/cairo-400.woff2', weight: '400', style: 'normal' },
    { path: '../../public/fonts/cairo-600.woff2', weight: '600', style: 'normal' },
    { path: '../../public/fonts/cairo-700.woff2', weight: '700', style: 'normal' }
], variable: '--font-arabic', display: 'swap', preload: false });

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
