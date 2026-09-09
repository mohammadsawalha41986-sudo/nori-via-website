'use client';

import { MagneticButton } from '../ui/Button';
import { track, EVENTS } from '@/lib/track';

/**
 * The href points at the download route, so the file is fetched with a normal
 * navigation — the analytics event is a side effect, never a prerequisite.
 *
 * Rendered as a plain anchor (`plain`): a router link would be prefetched, and
 * prefetching this href fetches the file and records a download for a visitor
 * who only opened the page.
 */
export function DownloadButton({
  href,
  slug,
  label,
  disabled,
}: {
  href: string;
  slug: string;
  label: string;
  disabled?: boolean;
}) {
  return (
    <MagneticButton
      href={disabled ? undefined : href}
      plain
      disabled={disabled}
      onClick={() => track(EVENTS.resourceDownload, { slug })}
      className="w-full"
    >
      {label}
    </MagneticButton>
  );
}
