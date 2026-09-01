import Image from 'next/image';
import clsx from 'clsx';

/**
 * The wordmark falls back to a drawn "N" monogram plus type when no logo has
 * been uploaded in Admin, so the site never ships with a broken image.
 */
export function Logo({
  logoUrl,
  name,
  tone = 'dark',
  className,
}: {
  logoUrl?: string | null;
  name: string;
  tone?: 'dark' | 'light';
  className?: string;
}) {
  if (logoUrl) {
    return (
      <span className={clsx('relative block h-8 w-[132px] sm:h-9 sm:w-[150px]', className)}>
        <Image src={logoUrl} alt={name} fill sizes="150px" className="object-contain object-left rtl:object-right" priority />
      </span>
    );
  }

  const ink = tone === 'light' ? '#FFFFFF' : '#111C3A';

  return (
    <span className={clsx('flex items-center gap-2.5', className)}>
      <svg viewBox="0 0 40 36" className="h-7 w-[31px] sm:h-8 sm:w-9" role="img" aria-label={name}>
        <path d="M3 4h9l25 28h-9L3 4Z" fill="#F5106E" />
        <path d="M3 4h9v28H3V4Z" fill={ink} />
        <path d="M28 4h9v28h-9V4Z" fill={ink} />
        <path d="M3 4h9l25 28h-9L3 4Z" fill="#F5106E" />
      </svg>
      <span
        className={clsx(
          'font-display text-[1.32rem] font-extrabold uppercase leading-none tracking-[-0.02em] sm:text-[1.45rem]',
          tone === 'light' ? 'text-white' : 'text-ink-800',
        )}
      >
        {name}
      </span>
    </span>
  );
}
