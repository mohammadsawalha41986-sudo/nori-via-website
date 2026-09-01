'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import clsx from 'clsx';
import { Logo } from './Logo';
import { LanguageSwitcher } from './LanguageSwitcher';
import { MagneticButton } from '../ui/Button';
import type { Locale } from '@/lib/i18n';

export type NavLink = { id: string; label: string; href: string; external: boolean };

export function Navbar({
  locale,
  links,
  companyName,
  logoUrl,
  startLabel,
  menuLabel,
  closeLabel,
}: {
  locale: Locale;
  links: NavLink[];
  companyName: string;
  logoUrl: string | null;
  startLabel: string;
  menuLabel: string;
  closeLabel: string;
}) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close the drawer whenever the route changes.
  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const home = `/${locale}`;
  const isActive = (href: string) => pathname === `/${locale}${href}` || pathname.startsWith(`/${locale}${href}/`);

  // Every page opens on a dark hero, so the transparent bar needs light content
  // until the bone page background has scrolled up behind it.
  const solid = scrolled || open;
  const tone = solid ? 'dark' : 'light';

  return (
    <>
      <header
        className={clsx(
          'fixed inset-x-0 top-0 z-50 transition-[background-color,backdrop-filter,border-color] duration-500 ease-noriva',
          scrolled || open
            ? 'border-b border-ink-900/10 bg-bone/95 backdrop-blur-xl backdrop-saturate-150'
            : 'border-b border-transparent bg-transparent',
        )}
      >
        <nav className="shell flex h-[var(--nav-h)] items-center justify-between gap-6" aria-label="Main">
          <Link href={home} className="shrink-0" aria-label={companyName}>
            <Logo logoUrl={logoUrl} name={companyName} tone={tone} />
          </Link>

          <ul className="hidden items-center gap-8 lg:flex">
            {links.map((link) => (
              <li key={link.id}>
                <Link
                  href={link.external ? link.href : `/${locale}${link.href}`}
                  target={link.external ? '_blank' : undefined}
                  rel={link.external ? 'noopener noreferrer' : undefined}
                  aria-current={isActive(link.href) ? 'page' : undefined}
                  className={clsx(
                    'relative text-[0.9375rem] font-medium tracking-tight transition-colors duration-300',
                    'after:absolute after:-bottom-1.5 after:left-0 after:h-px after:bg-brand after:transition-all after:duration-300',
                    isActive(link.href)
                      ? solid
                        ? 'text-ink-900 after:w-full'
                        : 'text-white after:w-full'
                      : solid
                        ? 'text-ink-500 after:w-0 hover:text-ink-900 hover:after:w-full'
                        : 'text-white/70 after:w-0 hover:text-white hover:after:w-full',
                  )}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-3">
            <LanguageSwitcher locale={locale} tone={tone} />
            <MagneticButton href={`/${locale}/start-a-project`} className="hidden !px-6 !py-3 text-sm sm:inline-flex">
              {startLabel}
            </MagneticButton>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? closeLabel : menuLabel}
              className={clsx(
                'relative z-10 flex h-11 w-11 items-center justify-center rounded-full border lg:hidden',
                solid ? 'border-ink-900/15' : 'border-white/30',
              )}
            >
              <span className="sr-only">{open ? closeLabel : menuLabel}</span>
              <span aria-hidden className="flex h-4 w-5 flex-col justify-between">
                <span className={clsx('h-0.5 w-full transition-transform duration-300 ease-noriva', solid ? 'bg-ink-900' : 'bg-white', open && 'translate-y-[7px] rotate-45')} />
                <span className={clsx('h-0.5 w-full transition-opacity duration-200', solid ? 'bg-ink-900' : 'bg-white', open && 'opacity-0')} />
                <span className={clsx('h-0.5 w-full transition-transform duration-300 ease-noriva', solid ? 'bg-ink-900' : 'bg-white', open && '-translate-y-[7px] -rotate-45')} />
              </span>
            </button>
          </div>
        </nav>
      </header>

      <div
        id="mobile-menu"
        hidden={!open}
        className="fixed inset-0 z-40 bg-ink-900 text-white lg:hidden"
      >
        <div className="shell flex h-full flex-col justify-between pb-12 pt-[calc(var(--nav-h)+2.5rem)]">
          <ul className="flex flex-col gap-1">
            {links.map((link, i) => (
              <li key={link.id}>
                <Link
                  href={link.external ? link.href : `/${locale}${link.href}`}
                  className="block border-b border-white/10 py-4 font-display text-3xl font-extrabold uppercase tracking-tight transition-colors duration-300 hover:text-brand"
                  style={{
                    animation: open ? `fade-up 0.55s cubic-bezier(0.22,1,0.36,1) ${i * 55}ms both` : undefined,
                  }}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <MagneticButton href={`/${locale}/start-a-project`} className="w-full">
            {startLabel}
          </MagneticButton>
        </div>
      </div>
    </>
  );
}
