'use client';

import { MagneticButton } from '../ui/Button';
import { AnimatedText } from '../ui/AnimatedText';
import { Reveal } from '../ui/Reveal';
import { track, EVENTS } from '@/lib/track';

export function CTASection({
  headline,
  description,
  label,
  href,
  secondaryLabel,
  secondaryHref,
}: {
  headline: string;
  description?: string;
  label: string;
  href: string;
  secondaryLabel?: string;
  secondaryHref?: string;
}) {
  if (!headline && !label) return null;

  return (
    <section className="relative overflow-hidden bg-brand text-white">
      <div aria-hidden className="grain absolute inset-0" />
      <div className="shell relative py-24 sm:py-36">
        <AnimatedText
          text={headline}
          as="h2"
          className="max-w-4xl font-display text-display-md uppercase"
        />
        {description && (
          <Reveal delay={140}>
            <p className="mt-8 max-w-xl text-lg leading-relaxed text-white/80">{description}</p>
          </Reveal>
        )}
        <Reveal delay={220} className="mt-11 flex flex-wrap gap-3">
          <MagneticButton href={href} variant="light" onClick={() => track(EVENTS.ctaClick, { label })}>
            {label}
          </MagneticButton>
          {secondaryLabel && secondaryHref && (
            <MagneticButton href={secondaryHref} variant="outline">
              {secondaryLabel}
            </MagneticButton>
          )}
        </Reveal>
      </div>
    </section>
  );
}
