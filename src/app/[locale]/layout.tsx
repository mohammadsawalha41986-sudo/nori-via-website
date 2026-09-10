import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { fontVarsFor } from '../fonts';
import { Navbar } from '@/components/public/Navbar';
import { Footer } from '@/components/public/Footer';
import { Analytics } from '@/components/public/Analytics';
import { FloatingActions } from '@/components/public/FloatingActions';
import { getLayoutData } from '@/lib/layout-data';
import { isLocale, dirOf, pick, type Locale } from '@/lib/i18n';
import { getSettings } from '@/lib/content';
import { env } from '@/lib/env';
import { getDesignTokens, tokensToCss } from '@/lib/design-tokens';
import { alternatesFor } from '@/lib/seo';
import { BRAND, BRAND_DESCRIPTION, brandName, withBrand } from '@/lib/brand';

/**
 * Deliberately no `generateStaticParams`.
 *
 * Every page under this layout reads CMS content from PostgreSQL. Enumerating
 * the locales here would make Next prerender those pages during `next build`,
 * which would require a live database just to compile the app. Without it the
 * routes are rendered on first request and then cached for `revalidate`
 * seconds, so the site still serves from cache and `revalidatePath` still
 * publishes changes instantly — the database is only needed at runtime.
 */

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: raw } = await params;
  if (!isLocale(raw)) return {};
  const locale = raw as Locale;
  const settings = await getSettings();

  // Prefer a purpose-made share image; fall back to the logo so a shared link
  // is never a blank card once branding has been uploaded.
  const shareImage = settings.defaultOgImage || settings.logoUrl || undefined;
  const tagline = pick(settings, 'tagline', locale);
  /*
    The homepage title is the strongest brand signal Google has, so the entity
    is guaranteed to appear in it whatever Admin holds — `withBrand` completes
    a short name rather than replacing the editor's words.
  */
  const title = withBrand(
    pick(settings, 'seoTitle', locale) || (tagline ? `${brandName(locale)} — ${tagline}` : ''),
    locale,
  );
  const description =
    pick(settings, 'seoDescription', locale) ||
    pick(settings, 'description', locale) ||
    BRAND_DESCRIPTION[locale];

  return {
    metadataBase: new URL(env.siteUrl),
    /*
      The title template carries the brand entity rather than the editable
      company name: every result in the SERP should read "… — NORIVA GLOBAL",
      which is the string that separates this company from the similarly
      spelled businesses it competes with there. The editable name still drives
      everything visible on the page.
    */
    title: { default: title, template: `%s — ${BRAND.name}` },
    description,
    applicationName: BRAND.name,
    alternates: alternatesFor(locale),
    openGraph: {
      type: 'website',
      siteName: BRAND.name,
      title,
      description,
      locale: locale === 'ar' ? 'ar_SA' : 'en_US',
      url: `${env.siteUrl}/${locale}`,
      images: shareImage ? [{ url: shareImage }] : undefined,
    },
    twitter: { card: 'summary_large_image', title, description, images: shareImage ? [shareImage] : undefined },
    /*
      Icons.

      An icon uploaded in Admin still wins, but the bundled fallback is now a
      full set generated from the N mark rather than a single 32px file: Google
      ignores a favicon smaller than 48px, which is why a generic globe was
      showing next to the domain. The file-based icon convention is
      deliberately not used, because it would override this and make the
      favicon uneditable.
    */
    icons: settings.faviconUrl
      ? { icon: settings.faviconUrl, shortcut: settings.faviconUrl, apple: settings.faviconUrl }
      : {
          icon: [
            { url: '/favicon.ico', sizes: '16x16 32x32 48x48', type: 'image/x-icon' },
            { url: '/favicon-48x48.png', sizes: '48x48', type: 'image/png' },
            { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
            { url: '/icon.svg', type: 'image/svg+xml' },
          ],
          shortcut: '/favicon.ico',
          apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
        },
    manifest: '/manifest.webmanifest',
    // Only rendered when a token is configured; Search Console also accepts
    // DNS verification, in which case this stays unset.
    verification: env.googleSiteVerification
      ? { google: env.googleSiteVerification }
      : undefined,
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;

  const [layout, tokens] = await Promise.all([getLayoutData(locale), getDesignTokens()]);
  const {
    settings, dict, companyName, headerLinks, footerLinks, footerServiceGroups,
    footerBackground, socials, contact, floatingActions,
  } = layout;

  // Token overrides are inlined ahead of the first paint, so a brand change
  // never flashes the previous palette.
  const tokenCss = tokensToCss(tokens);

  return (
    <html
      lang={locale}
      dir={dirOf(locale)}
      className={fontVarsFor(tokens.typography)}
      suppressHydrationWarning
    >
      {/*
        No manual <head>: React owns that element in the App Router. A <style>
        carrying `precedence` is hoisted into the head for us and deduplicated
        by `href`, which keeps the server and client trees identical.
      */}
      {tokenCss ? (
        <style
          href="noriva-design-tokens"
          precedence="high"
          dangerouslySetInnerHTML={{ __html: tokenCss }}
        />
      ) : null}
      <body className="flex min-h-screen flex-col bg-bone">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-ink-900 focus:px-5 focus:py-3 focus:text-sm focus:font-semibold focus:text-white"
        >
          {dict.nav.skip}
        </a>

        <Navbar
          locale={locale}
          links={headerLinks}
          companyName={companyName}
          logoUrl={settings.logoUrl}
          logoInverseUrl={settings.logoInverseUrl}
          startLabel={dict.nav.start}
          searchLabel={dict.nav.search}
          menuLabel={dict.nav.menu}
          closeLabel={dict.nav.close}
        />

        <main id="main" className="flex-1">
          {children}
        </main>

        <Footer
          locale={locale}
          dict={dict}
          companyName={companyName}
          logoUrl={settings.logoUrl}
          logoInverseUrl={settings.logoInverseUrl}
          description={pick(settings, 'footerDescription', locale)}
          copyright={pick(settings, 'copyright', locale)}
          links={footerLinks}
          serviceGroups={footerServiceGroups}
          socials={socials}
          background={footerBackground}
          {...contact}
        />

        <FloatingActions actions={floatingActions} />

        <Analytics gaId={settings.gaId || env.analytics.gaId} gtmId={settings.gtmId || env.analytics.gtmId} />
      </body>
    </html>
  );
}
