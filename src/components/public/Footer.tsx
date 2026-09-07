import Link from 'next/link';
import { Logo } from './Logo';
import { MagneticButton } from '../ui/Button';
import type { Locale } from '@/lib/i18n';
import type { Dictionary } from '@/lib/dictionary';

export type FooterLink = { id: string; label: string; href: string; external: boolean };

export type SocialLink = { label: string; href: string };

/** A service group, linked to its anchor on the services index. */
export type FooterService = { id: string; label: string };

export type FooterBackground = {
  type: 'COLOR' | 'IMAGE';
  image: string | null;
  color: string;
};

/**
 * Legal pages belong in the bottom bar rather than in the Explore column, so
 * the column heights stay balanced and the legal links sit where a reader
 * expects to find them.
 */
const LEGAL_HREFS = new Set(['/privacy', '/terms']);

/**
 * Site footer.
 *
 * Laid out as four columns of comparable height — brand, explore, services,
 * contact — so the width is actually used and no column leaves a tall void
 * beneath it. Height is driven by the content: no minimum height, no viewport
 * units, and no oversized wordmark behind the bottom bar.
 *
 * The backdrop is either a colour or a full-bleed image with an overlay. Both
 * are absolutely positioned, so switching between them never changes how tall
 * the footer is.
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
  links,
  services,
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
  links: FooterLink[];
  services: FooterService[];
  socials: SocialLink[];
  background: FooterBackground;
}) {
  const year = new Date().getFullYear();

  const explore = links.filter((l) => l.external || !LEGAL_HREFS.has(l.href));
  const legal = links.filter((l) => !l.external && LEGAL_HREFS.has(l.href));

  const useImage = background.type === 'IMAGE' && Boolean(background.image);
  const solid = !useImage && background.color ? background.color : undefined;

  const heading = 'text-[0.75rem] font-bold uppercase tracking-[0.18em] text-white/55';
  const item =
    'text-[0.875rem] leading-relaxed text-white/75 transition-colors duration-300 hover:text-white';

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
            className="absolute inset-0 -z-10 bg-cover bg-center"
            style={{ backgroundImage: `url("${background.image}")` }}
          />
          {/*
            Two layers rather than one flat wash: a base tint that guarantees
            contrast for the small type, and a vertical gradient that keeps the
            top edge dark where the footer meets the section above it.
          */}
          <div aria-hidden className="absolute inset-0 -z-10 bg-ink-950/65" />
          <div
            aria-hidden
            className="absolute inset-0 -z-10 bg-gradient-to-b from-ink-950 via-ink-950/70 to-ink-950/85"
          />
        </>
      )}

      {/* Contained to a readable measure and centred; the shell supplies the
          responsive gutter, so the footer keeps the page's edge alignment on
          every viewport up to the point the measure takes over. */}
      <div className="shell">
        <div className="mx-auto w-full max-w-[86rem]">
          {/* CTA — a single compact strip, never a second hero. */}
          <div className="flex flex-col gap-4 border-b border-white/10 py-7 sm:flex-row sm:items-center sm:justify-between sm:gap-8 sm:py-8">
            <div className="max-w-xl">
              <h2 className="font-display text-[1.375rem] uppercase leading-tight sm:text-[1.625rem]">
                {dict.footer.ctaTitle}
              </h2>
              <p className="mt-1.5 text-[0.875rem] leading-relaxed text-white/60">{dict.footer.ctaBody}</p>
            </div>
            <MagneticButton
              href={`/${locale}/start-a-project`}
              className="shrink-0 self-start px-6 py-3 text-[0.875rem] sm:self-auto"
            >
              {dict.nav.start}
            </MagneticButton>
          </div>

          <div className="grid grid-cols-2 gap-x-8 gap-y-8 pb-2 pt-8 sm:grid-cols-3 lg:grid-cols-[1.4fr_1fr_1fr_1.1fr] lg:gap-x-10 lg:gap-y-9 lg:pt-9">
            {/* Brand — spans the row until it earns a column of its own. */}
            <div className="col-span-2 flex flex-col sm:col-span-3 lg:col-span-1">
              <Link href={`/${locale}`} aria-label={companyName} className="inline-flex">
                <Logo logoUrl={logoUrl} logoInverseUrl={logoInverseUrl} name={companyName} tone="light" />
              </Link>
              {description && (
                <p className="mt-4 max-w-sm text-[0.875rem] leading-relaxed text-white/60">{description}</p>
              )}

              {socials.length > 0 && (
                <ul className="mt-5 flex flex-wrap gap-2 lg:mt-auto lg:pt-6">
                  {socials.map((s) => (
                    <li key={s.label}>
                      <a
                        href={s.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex rounded-full border border-white/20 px-3.5 py-1.5 text-[0.75rem] font-semibold tracking-wide text-white/80 transition-colors duration-300 hover:border-brand hover:bg-brand hover:text-white"
                      >
                        {s.label}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Explore */}
            {explore.length > 0 && (
              <nav aria-label={dict.footer.explore}>
                <h2 className={heading}>{dict.footer.explore}</h2>
                <ul className="mt-3.5 space-y-2">
                  {explore.map((l) => (
                    <li key={l.id}>
                      <Link
                        href={l.external ? l.href : `/${locale}${l.href}`}
                        target={l.external ? '_blank' : undefined}
                        rel={l.external ? 'noopener noreferrer' : undefined}
                        className={item}
                      >
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            )}

            {/* Services — the practice groups, anchored to the services index. */}
            {services.length > 0 && (
              <nav aria-label={dict.nav.services}>
                <h2 className={heading}>{dict.nav.services}</h2>
                <ul className="mt-3.5 space-y-2">
                  {services.map((s) => (
                    <li key={s.id}>
                      <Link href={`/${locale}/services#group-${s.id}`} className={item}>
                        {s.label}
                      </Link>
                    </li>
                  ))}
                  <li className="pt-1">
                    <Link
                      href={`/${locale}/services`}
                      className="text-[0.875rem] font-semibold text-brand-300 transition-colors duration-300 hover:text-white"
                    >
                      {dict.common.allServices}
                    </Link>
                  </li>
                </ul>
              </nav>
            )}

            {/* Contact */}
            <div className="col-span-2 sm:col-span-1">
              <h2 className={heading}>{dict.nav.contact}</h2>
              <ul className="mt-3.5 space-y-2">
                {email && (
                  <li>
                    <a href={`mailto:${email}`} className={`${item} break-words`}>
                      {email}
                    </a>
                  </li>
                )}
                {phone && (
                  <li>
                    <a href={`tel:${phone.replace(/\s/g, '')}`} dir="ltr" className={`${item} inline-block`}>
                      {phone}
                    </a>
                  </li>
                )}
                {whatsapp && (
                  <li>
                    <a
                      href={`https://wa.me/${whatsapp.replace(/[^\d]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={item}
                    >
                      {dict.common.whatsapp}
                    </a>
                  </li>
                )}
                {address && (
                  <li className="text-[0.875rem] leading-relaxed text-white/50">{address}</li>
                )}
                <li className="pt-1">
                  <Link href={`/${locale}/contact`} className="text-[0.875rem] font-semibold text-brand-300 transition-colors duration-300 hover:text-white">
                    {dict.footer.contactCta}
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-8 flex flex-col gap-3 border-t border-white/10 py-5 text-[0.75rem] text-white/45 sm:flex-row sm:items-center sm:justify-between">
            <p>{copyright || `© ${year} ${companyName}. ${dict.footer.rights}`}</p>
            {legal.length > 0 && (
              <ul className="flex flex-wrap items-center gap-x-5 gap-y-2 pe-36 sm:pe-40">
                {legal.map((l) => (
                  <li key={l.id}>
                    <Link
                      href={`/${locale}${l.href}`}
                      className="transition-colors duration-300 hover:text-white"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
