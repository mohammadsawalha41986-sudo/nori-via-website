import Image from 'next/image';
import clsx from 'clsx';

/**
 * The Noriva wordmark.
 *
 * Artwork uploaded in Admin is never recoloured, filtered or redrawn — only
 * scaled, and always with its aspect ratio preserved. On dark backgrounds the
 * component prefers a light/reversed file when one has been uploaded; if only
 * one version of the logo exists it is placed on a light plate instead, which
 * keeps a dark logo legible without touching the original artwork.
 *
 * With nothing uploaded it falls back to a drawn monogram so the site never
 * ships with a broken image.
 */
export function Logo({
  logoUrl,
  logoInverseUrl,
  name,
  tone = 'dark',
  className,
}: {
  logoUrl?: string | null;
  logoInverseUrl?: string | null;
  name: string;
  /** 'light' means the logo sits on a dark background. */
  tone?: 'dark' | 'light';
  className?: string;
}) {
  const onDark = tone === 'light';
  const source = onDark && logoInverseUrl ? logoInverseUrl : logoUrl;

  if (source) {
    // A single-version logo on a dark background gets a light plate. The plate
    // is the only thing added; the artwork itself is untouched.
    const needsPlate = onDark && !logoInverseUrl;

    return (
      <span
        className={clsx(
          'relative block h-8 w-[132px] sm:h-9 sm:w-[150px]',
          needsPlate && 'h-11 w-[152px] rounded-md bg-white px-2.5 py-1.5 sm:h-12 sm:w-[172px]',
          className,
        )}
      >
        <Image
          src={source}
          alt={name}
          fill
          sizes="172px"
          // object-contain preserves the original proportions at every size.
          className={clsx('object-contain object-left rtl:object-right', needsPlate && 'p-0.5')}
          priority
        />
      </span>
    );
  }

  const ink = onDark ? '#FFFFFF' : '#111C3A';

  return (
    <span className={clsx('flex items-center gap-2.5', className)}>
      <svg viewBox="0 0 40 36" className="h-7 w-[31px] sm:h-8 sm:w-9" role="img" aria-label={name}>
        <path d="M3 4h9v28H3V4Z" fill={ink} />
        <path d="M28 4h9v28h-9V4Z" fill={ink} />
        <path d="M3 4h9l25 28h-9L3 4Z" fill="#F5106E" />
      </svg>
      <span
        className={clsx(
          'font-display text-[1.32rem] uppercase leading-none tracking-[-0.02em] sm:text-[1.45rem]',
          onDark ? 'text-white' : 'text-ink-800',
        )}
      >
        {name}
      </span>
    </span>
  );
}
