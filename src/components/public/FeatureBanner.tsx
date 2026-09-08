import Image from 'next/image';
import { Reveal } from '../ui/Reveal';
import { MagneticButton } from '../ui/Button';

/**
 * A full-width band with an image behind it, used to send visitors to one
 * destination — the library, a tool, a service. The image is decorative: every
 * word is real text, so the section stays readable, translatable and indexable
 * whether or not the artwork loads.
 */
export function FeatureBanner({
  eyebrow,
  headline,
  body,
  ctaLabel,
  ctaHref,
  imageUrl,
}: {
  eyebrow?: string;
  headline: string;
  body?: string;
  ctaLabel?: string;
  ctaHref?: string;
  imageUrl?: string | null;
}) {
  if (!headline) return null;

  return (
    <section className="relative isolate overflow-hidden bg-ink-900 text-white">
      {imageUrl && (
        <>
          <Image
            src={imageUrl}
            alt=""
            fill
            sizes="100vw"
            className="-z-10 object-cover"
          />
          {/* Two layers: a flat wash for contrast, then a vertical gradient so
              the band reads as one piece against the sections around it. */}
          <div aria-hidden className="absolute inset-0 -z-10 bg-ink-950/70" />
          <div
            aria-hidden
            className="absolute inset-0 -z-10 bg-gradient-to-b from-ink-950/60 via-transparent to-ink-950/60"
          />
        </>
      )}

      <div className="shell relative py-24 text-center sm:py-32">
        <Reveal className="mx-auto max-w-2xl">
          {eyebrow && (
            <div className="mb-5 text-[0.6875rem] font-bold uppercase tracking-[0.24em] text-brand-300">
              {eyebrow}
            </div>
          )}
          <h2 className="font-display text-display-sm uppercase">{headline}</h2>
          {body && <p className="mt-6 text-lg leading-relaxed text-white/75">{body}</p>}
          {ctaLabel && ctaHref && (
            <div className="mt-10 flex justify-center">
              <MagneticButton href={ctaHref} variant="light">
                {ctaLabel}
              </MagneticButton>
            </div>
          )}
        </Reveal>
      </div>
    </section>
  );
}
