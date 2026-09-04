import Link from 'next/link';
import { Logo } from './Logo';
import { TextLink } from '../ui/Button';
import type { Locale } from '@/lib/i18n';
import type { Dictionary } from '@/lib/dictionary';

export type FooterLink = { id: string; label: string; href: string; external: boolean };

export type SocialLink = { label: string; href: string };

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
  socials,
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
  socials: SocialLink[];
}) {
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden bg-ink-900 text-white">
      <div className="shell pb-12 pt-20 sm:pt-28">
        <div className="grid gap-14 lg:grid-cols-[1.4fr_1fr_1fr]">
          <div className="max-w-md">
            <Link href={`/${locale}`} aria-label={companyName}>
              <Logo logoUrl={logoUrl} logoInverseUrl={logoInverseUrl} name={companyName} tone="light" />
            </Link>
            {description && <p className="mt-6 text-[0.9375rem] leading-relaxed text-white/55">{description}</p>}
            <div className="mt-8">
              <TextLink href={`/${locale}/start-a-project`} className="text-white hover:text-brand-300">
                {dict.nav.start}
              </TextLink>
            </div>
          </div>

          <nav aria-label="Footer">
            <h2 className="text-[0.6875rem] font-bold uppercase tracking-[0.24em] text-white/40">{companyName}</h2>
            <ul className="mt-6 space-y-3">
              {links.map((l) => (
                <li key={l.id}>
                  <Link
                    href={l.external ? l.href : `/${locale}${l.href}`}
                    target={l.external ? '_blank' : undefined}
                    rel={l.external ? 'noopener noreferrer' : undefined}
                    className="text-[0.9375rem] text-white/65 transition-colors duration-300 hover:text-white"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="text-[0.6875rem] font-bold uppercase tracking-[0.24em] text-white/40">{dict.nav.contact}</h2>
            <ul className="mt-6 space-y-3 text-[0.9375rem] text-white/65">
              {email && (
                <li>
                  <a href={`mailto:${email}`} className="transition-colors duration-300 hover:text-white">
                    {email}
                  </a>
                </li>
              )}
              {phone && (
                <li>
                  <a href={`tel:${phone.replace(/\s/g, '')}`} dir="ltr" className="transition-colors duration-300 hover:text-white">
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
                    className="transition-colors duration-300 hover:text-white"
                  >
                    {dict.common.whatsapp}
                  </a>
                </li>
              )}
              {address && <li className="pt-1 leading-relaxed text-white/45">{address}</li>}
            </ul>

            {socials.length > 0 && (
              <ul className="mt-8 flex flex-wrap gap-2">
                {socials.map((s) => (
                  <li key={s.label}>
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex rounded-full border border-white/20 px-4 py-2 text-xs font-semibold tracking-wide transition-colors duration-300 hover:border-brand hover:bg-brand hover:text-white"
                    >
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="mt-16 border-t border-white/10 pt-7 text-xs text-white/35 sm:flex sm:items-center sm:justify-between">
          <p>{copyright || `© ${year} ${companyName}.`}</p>
          <p className="mt-3 sm:mt-0">{companyName}</p>
        </div>
      </div>

      <div aria-hidden className="pointer-events-none select-none overflow-hidden">
        <div className="shell">
          <span className="block translate-y-[26%] font-display text-[clamp(4rem,20vw,17rem)] uppercase leading-none tracking-[-0.05em] text-white/[0.045]">
            {companyName}
          </span>
        </div>
      </div>
    </footer>
  );
}
