'use client';

import { MagneticButton } from '../ui/Button';
import { track, EVENTS } from '@/lib/track';

/**
 * The href points at the download route, so the file is fetched with a normal
 * navigation — the analytics event is a side effect, never a prerequisite.
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
      disabled={disabled}
      onClick={() => track(EVENTS.resourceDownload, { slug })}
      className="w-full"
    >
      {label}
    </MagneticButton>
  );
}
