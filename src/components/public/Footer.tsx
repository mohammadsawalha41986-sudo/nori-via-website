import Link from 'next/link';
import clsx from 'clsx';
import { Logo } from './Logo';
import { FooterColumn } from './FooterColumn';
import { LanguageSwitcher } from './LanguageSwitcher';
import { ArrowIcon, GlobeIcon, MailIcon, PhoneIcon, PinIcon, SocialIcon } from './FooterIcons';
import type { Locale } from '@/lib/i18n';
import type { Dictionary } from '@/lib/dictionary';

export type FooterLink = { id: string; label: string; href: string; external: boolean };

export type SocialLink = { platform?: string; label: string; href: string };

/** One practice group and the published services inside it. */
export type FooterServiceGroup = {
  id: string;
  label: string;
  href: string;
  items: { id: string; label: string; href: string }[];
};

export type FooterBackground = {
  type: 'COLOR' | 'IMAGE';
  image: string | null;
  color: string;
  position: 'CENTER' | 'TOP' | 'BOTTOM' | 'LEFT' | 'RIGHT';
  overlayColor: string;
  /** Percentage. 0 shows the bare image, 100 hides it entirely. */
  overlayOpacity: number;
};

/**
 * Legal pages belong in the bottom bar rather than in the Explore column, so
 * the column heights stay balanced and the legal links sit where a reader
 * expects to find them.
 */
const LEGAL_HREFS = new Set(['/privacy', '/terms']);

/**
 * Desktop column tracks, keyed by how many service groups the CMS actually
 * has content for. The footer is a different shape with one group than with
 * three, and the widths are tuned per case rather than left to `1fr` — the
 * brand column carries a logo and a paragraph, Explore carries short words.
 *
 * Written out as complete class strings so Tailwind can see them in source.
 */
const COLUMN_TRACKS: Record<number, string> = {
  0: 'lg:grid-cols-[1.5fr_1fr_1.2fr]',
  1: 'lg:grid-cols-[1.45fr_0.85fr_1.25fr_1.15fr]',
  2: 'lg:grid-cols-[1.4fr_0.8fr_1.05fr_1.05fr_1.1fr]',
  3: 'lg:grid-cols-[1.35fr_0.75fr_1fr_1fr_1fr_1.05fr]',
};

const BACKGROUND_POSITION: Record<FooterBackground['position'], string> = {
  CENTER: 'center',
  TOP: 'top center',
  BOTTOM: 'bottom center',
  LEFT: 'center left',
  RIGHT: 'center right',
};

/** The brand's dark ink, used when no overlay colour has been chosen. */
const DEFAULT_OVERLAY = '#070D1C';

/**
 * Site footer.
 *
 * Laid out horizontally the way a brand system is: the wordmark and the
 * proposition lead, Explore sits beside it, the practice groups occupy the
 * middle with their services beneath them, and contact closes the row. Height
 * comes from the content alone — no minimum height, no viewport units, no
 * oversized wordmark behind the bottom bar — so the whole footer lands in the
 * 350–500px range on a desktop and grows only if the taxonomy does.
 *
 * The backdrop is either a colour or a full-bleed image behind an editable
 * overlay. Both are absolutely positioned, so switching between them never
 * changes how tall the footer is.
 *
 * Everything visible here is CMS-managed: the logo and description from Site
 * settings, Explore from Navigation, the service groups from the service
 * taxonomy, the icons from Social, and the backdrop from the footer's own
 * settings. Nothing is hard-coded except the UI chrome, which is translated.
 */
export function Footer({
  locale,
  dict,
  companyName,
  logoUrl,
  logoInverseUrl,
  description,
  copyright,
  email,
  phone,
  whatsapp,
  address,
  website,
  links,
  serviceGroups,
  socials,
  background,
}: {
  locale: Locale;
  dict: Dictionary;
  companyName: string;
  logoUrl: string | null;
  logoInverseUrl: string | null;
  description: string;
  copyright: string;
  email: string;
  phone: string;
  whatsapp: string;
  address: string;
  website: string;
  links: FooterLink[];
  serviceGroups: FooterServiceGroup[];
  socials: SocialLink[];
  background: FooterBackground;
}) {
  const year = new Date().getFullYear();

  const explore = links.filter((l) => l.external || !LEGAL_HREFS.has(l.href));
  const legal = links.filter((l) => !l.external && LEGAL_HREFS.has(l.href));

  const groups = serviceGroups.filter((g) => g.items.length > 0).slice(0, 3);
  const tracks = COLUMN_TRACKS[groups.length] ?? COLUMN_TRACKS[3]!;

  const useImage = background.type === 'IMAGE' && Boolean(background.image);
  const solid = !useImage && background.color ? background.color : undefined;
  const overlay = background.overlayColor || DEFAULT_OVERLAY;
  const overlayAlpha = Math.min(100, Math.max(0, background.overlayOpacity)) / 100;

  // The site URL is stored with its scheme; the footer shows the host, which
  // is what people read a web address as.
  const websiteLabel = website.replace(/^https?:\/\//, '').replace(/\/$/, '');

  const link =
    'text-sm leading-relaxed text-white/70 transition-colors duration-200 hover:text-white';
  const accentLink =
    'text-sm font-semibold text-brand-300 transition-colors duration-200 hover:text-white';

  return (
    <footer
      className="relative isolate overflow-hidden bg-ink-900 text-white"
      style={solid ? { backgroundColor: solid } : undefined}
    >
      {/* Backdrop art is absolutely positioned so it can never add height. */}
      {useImage && (
        <>
          <div
            aria-hidden
            className="absolute inset-0 -z-10 bg-cover bg-no-repeat"
            style={{
              backgroundImage: `url("${background.image}")`,
              backgroundPosition: BACKGROUND_POSITION[background.position],
            }}
          />
          {/*
            Two layers rather than one flat wash: the editable overlay, which
            guarantees contrast for the small type, and a fixed vertical
            gradient that keeps the top edge dark where the footer meets the
            section above it.
          */}
          <div
            aria-hidden
            className="absolute inset-0 -z-10"
            style={{ backgroundColor: overlay, opacity: overlayAlpha }}
          />
          <div
            aria-hidden
            className="absolute inset-0 -z-10 bg-gradient-to-b from-ink-950/70 via-transparent to-ink-950/40"
          />
        </>
      )}

      {/* Contained to a readable measure and centred; the shell supplies the
          responsive gutter, so the footer keeps the page's edge alignment on
          every viewport up to the point the measure takes over. */}
      <div className="shell">
        <div className="mx-auto w-full max-w-[85rem]">
          <div
            className={clsx(
              'grid gap-x-8 gap-y-0 pb-1 pt-10 sm:grid-cols-3 sm:gap-y-10 sm:pt-12 lg:gap-x-10 lg:pt-12',
              tracks,
            )}
          >
            {/* Brand — leads the row, and spans it until it earns a column. */}
            <div className="flex flex-col pb-8 sm:pb-0 lg:pe-6">
              <Link href={`/${locale}`} aria-label={companyName} className="inline-flex">
                <Logo
                  logoUrl={logoUrl}
                  logoInverseUrl={logoInverseUrl}
                  name={companyName}
                  tone="light"
                  size="lg"
                />
              </Link>

              {description && (
                <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/60">
                  {description}
                </p>
              )}

              <Link
                href={`/${locale}/start-a-project`}
                className="group mt-6 inline-flex w-fit items-center gap-2.5 rounded-full border border-brand/70 px-5 py-2.5 text-sm font-semibold text-white transition-colors duration-200 hover:border-brand hover:bg-brand"
              >
                {dict.nav.start}
                <ArrowIcon className="h-4 w-4 text-brand-300 transition-colors duration-200 group-hover:text-white" />
              </Link>

              {socials.length > 0 && (
                <ul className="mt-7 flex flex-wrap gap-2.5" aria-label={dict.footer.social}>
                  {socials.map((s) => (
                    <li key={`${s.platform ?? ''}-${s.href}`}>
                      <a
                        href={s.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={s.label}
                        title={s.label}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/75 transition-colors duration-200 hover:border-brand hover:bg-brand hover:text-white"
                      >
                        <SocialIcon platform={(s.platform ?? '').toLowerCase()} className="h-[1.05rem] w-[1.05rem]" />
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Explore */}
            {explore.length > 0 && (
              <FooterColumn
                title={dict.footer.explore}
                expandLabel={dict.footer.expand}
                collapseLabel={dict.footer.collapse}
              >
                <ul className="space-y-2">
                  {explore.map((l) => (
                    <li key={l.id}>
                      <Link
                        href={l.external ? l.href : `/${locale}${l.href}`}
                        target={l.external ? '_blank' : undefined}
                        rel={l.external ? 'noopener noreferrer' : undefined}
                        className={link}
                      >
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </FooterColumn>
            )}

            {/* Service groups — one column each, the services listed beneath
                their practice rather than in a single long list. */}
            {groups.map((group) => (
              <FooterColumn
                key={group.id}
                title={group.label}
                expandLabel={dict.footer.expand}
                collapseLabel={dict.footer.collapse}
              >
                <ul className="space-y-2">
                  {group.items.map((item) => (
                    <li key={item.id}>
                      <Link href={`/${locale}${item.href}`} className={link}>
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </FooterColumn>
            ))}

            {/* Contact — never collapsed: it is the reason most people scroll
                this far, and it is short enough to stay open on a phone. */}
            <FooterColumn
              title={dict.nav.contact}
              expandLabel={dict.footer.expand}
              collapseLabel={dict.footer.collapse}
              collapsible={false}
            >
              <ul className="space-y-2.5">
                {email && (
                  <li>
                    <a href={`mailto:${email}`} className={`${link} flex items-start gap-2.5 break-all`}>
                      <MailIcon className="mt-[0.15rem] h-4 w-4 shrink-0 text-brand-300" />
                      <span>{email}</span>
                    </a>
                  </li>
                )}
                {phone && (
                  <li>
                    <a
                      href={`tel:${phone.replace(/\s/g, '')}`}
                      className={`${link} flex items-center gap-2.5`}
                    >
                      <PhoneIcon className="h-4 w-4 shrink-0 text-brand-300" />
                      <span dir="ltr">{phone}</span>
                    </a>
                  </li>
                )}
                {whatsapp && (
                  <li>
                    <a
                      href={`https://wa.me/${whatsapp.replace(/[^\d]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`${link} flex items-center gap-2.5`}
                    >
                      <SocialIcon platform="whatsapp" className="h-4 w-4 shrink-0 text-brand-300" />
                      <span>{dict.common.whatsapp}</span>
                    </a>
                  </li>
                )}
                {websiteLabel && (
                  <li>
                    <a href={website} className={`${link} flex items-center gap-2.5`}>
                      <GlobeIcon className="h-4 w-4 shrink-0 text-brand-300" />
                      <span dir="ltr">{websiteLabel}</span>
                    </a>
                  </li>
                )}
                {address && (
                  <li className="flex items-start gap-2.5 text-sm leading-relaxed text-white/55">
                    <PinIcon className="mt-[0.15rem] h-4 w-4 shrink-0 text-brand-300" />
                    <span>{address}</span>
                  </li>
                )}
                <li className="pt-1">
                  <Link href={`/${locale}/contact`} className={accentLink}>
                    {dict.footer.contactCta}
                  </Link>
                </li>
              </ul>
            </FooterColumn>
          </div>

          {/* Bottom bar — sits close to the content above it. */}
          <div className="mt-9 flex flex-col gap-4 border-t border-white/10 py-5 text-xs text-white/45 sm:mt-10 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
            <p>{copyright || `© ${year} ${companyName}. ${dict.footer.rights}`}</p>

            {/* The end padding keeps the switcher clear of the floating
                contact button, which is pinned to the same corner. */}
            <div className="flex flex-wrap items-center gap-x-5 gap-y-3 pe-14 sm:pe-20 lg:pe-24">
              {/* The brand line, kept quiet: a mark, small caps, wide tracking. */}
              <p className="hidden items-center gap-2.5 uppercase tracking-[0.2em] text-white/35 lg:flex">
                <span aria-hidden className="h-3.5 w-[1px] rotate-[20deg] bg-brand/70" />
                {dict.footer.statement}
              </p>

              {legal.length > 0 && (
                <ul className="flex flex-wrap items-center gap-x-5 gap-y-2">
                  {legal.map((l) => (
                    <li key={l.id}>
                      <Link
                        href={`/${locale}${l.href}`}
                        className="transition-colors duration-200 hover:text-white"
                      >
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}

              {/* The site's own switcher, not a second language system. */}
              <LanguageSwitcher locale={locale} tone="light" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
