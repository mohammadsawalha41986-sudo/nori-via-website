import { MagneticButton } from '../ui/Button';

/**
 * Shown wherever the CMS has no published content yet. It is deliberately
 * explicit rather than filled with placeholder cards, so the site never
 * presents invented work as real.
 */
export function EmptyState({
  title,
  body,
  ctaHref,
  ctaLabel,
}: {
  title: string;
  body: string;
  ctaHref?: string;
  ctaLabel?: string;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-ink-900/15 bg-white/60 px-8 py-20 text-center">
      <p className="font-display text-2xl font-bold uppercase tracking-tight text-ink-900">{title}</p>
      <p className="mx-auto mt-4 max-w-md text-[0.9375rem] leading-relaxed text-ink-400">{body}</p>
      {ctaHref && ctaLabel && (
        <div className="mt-8 flex justify-center">
          <MagneticButton href={ctaHref} variant="ghost">
            {ctaLabel}
          </MagneticButton>
        </div>
      )}
    </div>
  );
}
