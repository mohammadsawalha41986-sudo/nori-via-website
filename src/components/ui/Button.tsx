'use client';

import Link from 'next/link';
import { useRef, useState } from 'react';
import clsx from 'clsx';

type Variant = 'primary' | 'ghost' | 'light' | 'outline';

const styles: Record<Variant, string> = {
  primary: 'bg-brand text-white hover:bg-brand-600',
  ghost: 'bg-transparent text-ink-900 hover:bg-ink-900 hover:text-white border border-ink-900/25',
  light: 'bg-white text-ink-900 hover:bg-bone',
  outline: 'bg-transparent text-white border border-white/35 hover:bg-white hover:text-ink-900',
};

const base =
  'group relative inline-flex items-center justify-center gap-2.5 rounded-btn px-7 py-4 text-sm font-semibold tracking-tight transition-colors duration-300 ease-noriva';

function Arrow() {
  return (
    <span aria-hidden className="inline-block transition-transform duration-300 ease-noriva group-hover:translate-x-1 rtl:group-hover:-translate-x-1 rtl:rotate-180">
      →
    </span>
  );
}

/**
 * A cursor-following button. The magnetic offset is skipped entirely on touch
 * devices and when reduced motion is requested.
 */
export function MagneticButton({
  href,
  children,
  variant = 'primary',
  className,
  arrow = true,
  onClick,
  type,
  disabled,
  plain,
}: {
  href?: string;
  children: React.ReactNode;
  variant?: Variant;
  className?: string;
  arrow?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit';
  disabled?: boolean;
  /**
   * Render a plain anchor instead of a router link. Required whenever the href
   * is a file rather than a page: the router prefetches its links, and a
   * prefetch of a download endpoint transfers the file and is recorded as a
   * download that nobody asked for.
   */
  plain?: boolean;
}) {
  const ref = useRef<HTMLElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  function move(e: React.MouseEvent) {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce), (hover: none)').matches) return;
    const r = el.getBoundingClientRect();
    setOffset({ x: (e.clientX - (r.left + r.width / 2)) * 0.22, y: (e.clientY - (r.top + r.height / 2)) * 0.32 });
  }

  const shared = {
    ref: ref as never,
    className: clsx(base, styles[variant], disabled && 'pointer-events-none opacity-55', className),
    style: { transform: `translate3d(${offset.x}px, ${offset.y}px, 0)`, transition: 'transform 320ms cubic-bezier(0.22,1,0.36,1), background-color 300ms, color 300ms' },
    onMouseMove: move,
    onMouseLeave: () => setOffset({ x: 0, y: 0 }),
  };

  const content = (
    <>
      <span>{children}</span>
      {arrow && <Arrow />}
    </>
  );

  if (href) {
    if (plain) {
      return (
        <a href={href} {...shared} onClick={onClick}>
          {content}
        </a>
      );
    }
    return (
      <Link href={href} {...shared} onClick={onClick}>
        {content}
      </Link>
    );
  }

  return (
    <button {...shared} type={type ?? 'button'} onClick={onClick} disabled={disabled}>
      {content}
    </button>
  );
}

export function TextLink({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) {
  return (
    <Link
      href={href}
      className={clsx(
        'group inline-flex items-center gap-2 text-sm font-semibold tracking-tight',
        'border-b border-current pb-1 transition-colors duration-300 hover:text-brand',
        className,
      )}
    >
      {children}
      <Arrow />
    </Link>
  );
}
