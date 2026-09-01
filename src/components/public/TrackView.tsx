'use client';

import { useEffect } from 'react';
import { track } from '@/lib/track';

/** Fires a single analytics event on mount. Carries no personal data. */
export function TrackView({ event, slug }: { event: string; slug: string }) {
  useEffect(() => {
    track(event, { slug });
  }, [event, slug]);
  return null;
}
