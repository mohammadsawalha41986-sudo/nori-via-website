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

  const name = pick(settings, 'companyName', locale) || 'Noriva';
  // Prefer a purpose-made share image; fall back to the logo so a shared link
  // is never a blank card once branding has been uploaded.
  const shareImage = settings.defaultOgImage || settings.logoUrl || undefined;
  const title = pick(settings, 'seoTitle', locale) || `${name} — ${pick(settings, 'tagline', locale)}`;
  const description = pick(settings, 'seoDescription', locale) || pick(settings, 'description', locale);

  return {
    metadataBase: new URL(env.siteUrl),
    title: { default: title, template: `%s — ${name}` },
    description,
    alternates: {
      canonical: `${env.siteUrl}/${locale}`,
      languages: { en: `${env.siteUrl}/en`, ar: `${env.siteUrl}/ar`, 'x-default': `${env.siteUrl}/en` },
    },
    openGraph: {
      type: 'website',
      siteName: name,
      title,
      description,
      locale: locale === 'ar' ? 'ar_SA' : 'en_US',
      url: `${env.siteUrl}/${locale}`,
      images: shareImage ? [{ url: shareImage }] : undefined,
    },
    twitter: { card: 'summary_large_image', title, description, images: shareImage ? [shareImage] : undefined },
    // Driven entirely from Admin, falling back to the bundled default. The
    // file-based icon convention is deliberately not used, because it would
    // override this and make the favicon uneditable.
    icons: {
      icon: settings.faviconUrl || '/icon.svg',
      shortcut: settings.faviconUrl || '/favicon.ico',
      apple: settings.faviconUrl || '/icon.svg',
    },
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
  const { settings, dict, companyName, headerLinks, footerLinks, socials, contact, floatingActions } = layout;

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
          socials={socials}
          {...contact}
        />

        <FloatingActions actions={floatingActions} />

        <Analytics gaId={settings.gaId || env.analytics.gaId} gtmId={settings.gtmId || env.analytics.gtmId} />
      </body>
    </html>
  );
}
