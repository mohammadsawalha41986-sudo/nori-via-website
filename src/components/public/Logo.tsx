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
  size = 'md',
  className,
}: {
  logoUrl?: string | null;
  logoInverseUrl?: string | null;
  name: string;
  /** 'light' means the logo sits on a dark background. */
  tone?: 'dark' | 'light';
  /** 'lg' is the footer's brand column, where the wordmark leads the column. */
  size?: 'md' | 'lg';
  className?: string;
}) {
  const onDark = tone === 'light';
  const source = onDark && logoInverseUrl ? logoInverseUrl : logoUrl;

  if (source) {
    // A single-version logo on a dark background gets a light plate. The plate
    // is the only thing added; the artwork itself is untouched.
    const needsPlate = onDark && !logoInverseUrl;

    const large = size === 'lg';

    return (
      <span
        className={clsx(
          'relative block',
          large ? 'h-10 w-[160px] sm:h-11 sm:w-[178px]' : 'h-8 w-[132px] sm:h-9 sm:w-[150px]',
          needsPlate &&
            (large
              ? 'h-14 w-[184px] rounded-md bg-white px-3 py-2 sm:h-[3.75rem] sm:w-[200px]'
              : 'h-11 w-[152px] rounded-md bg-white px-2.5 py-1.5 sm:h-12 sm:w-[172px]'),
          className,
        )}
      >
        <Image
          src={source}
          alt={name}
          fill
          sizes={large ? '200px' : '172px'}
          // object-contain preserves the original proportions at every size.
          className={clsx('object-contain object-left rtl:object-right', needsPlate && 'p-0.5')}
          // Only the header's logo is above the fold; the footer's is not, so
          // it is left to load normally rather than competing for bandwidth.
          priority={!large}
        />
      </span>
    );
  }

  const ink = onDark ? '#FFFFFF' : '#111C3A';

  return (
    <span className={clsx('flex items-center gap-2.5', className)}>
      <svg
        viewBox="0 0 40 36"
        className={size === 'lg' ? 'h-9 w-10 sm:h-10 sm:w-11' : 'h-7 w-[31px] sm:h-8 sm:w-9'}
        role="img"
        aria-label={name}
      >
        <path d="M3 4h9v28H3V4Z" fill={ink} />
        <path d="M28 4h9v28h-9V4Z" fill={ink} />
        <path d="M3 4h9l25 28h-9L3 4Z" fill="#F5106E" />
      </svg>
      <span
        className={clsx(
          'font-display uppercase leading-none tracking-[-0.02em]',
          size === 'lg' ? 'text-[1.7rem] sm:text-[1.9rem]' : 'text-[1.32rem] sm:text-[1.45rem]',
          onDark ? 'text-white' : 'text-ink-800',
        )}
      >
        {name}
      </span>
    </span>
  );
}
