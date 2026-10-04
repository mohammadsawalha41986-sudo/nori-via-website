'use client';

import { MagneticButton } from '../ui/Button';
import { AnimatedText } from '../ui/AnimatedText';
import { Reveal } from '../ui/Reveal';
import { track, EVENTS } from '@/lib/track';
import Image from 'next/image';

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
    <section className="cta-photo-section relative isolate overflow-hidden bg-ink-950 text-white">
      <Image src="/img/noriva-photo-planning.webp" alt="" fill sizes="100vw" loading="lazy" className="-z-20 object-cover" />
      <div aria-hidden className="absolute inset-0 -z-10 bg-ink-950/75" />
      <div className="shell relative py-10 sm:py-14">
        <AnimatedText
          text={headline}
          as="h2"
          className="max-w-4xl font-display text-display-sm uppercase"
        />
        {description && (
          <Reveal delay={140}>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-white/80">{description}</p>
          </Reveal>
        )}
        <Reveal delay={220} className="mt-6 flex flex-wrap gap-3">
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
