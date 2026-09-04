'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { MagneticButton } from '../ui/Button';
import { track, EVENTS } from '@/lib/track';
import type { Locale } from '@/lib/i18n';

export function Hero({
  locale,
  eyebrow,
  headline,
  subtitle,
  primaryCta,
  secondaryCta,
  mediaUrl,
  mediaKind,
}: {
  locale: Locale;
  eyebrow: string;
  headline: string;
  subtitle: string;
  primaryCta: string;
  secondaryCta: string;
  mediaUrl: string | null;
  mediaKind: 'IMAGE' | 'VIDEO' | 'DOCUMENT';
}) {
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);

  const lines = headline.split('\n').filter((l) => l.trim());

  return (
    <section className="relative isolate flex min-h-[92svh] items-end overflow-hidden bg-ink-900 pb-16 pt-[calc(var(--nav-h)+5rem)] text-white sm:pb-24">
      {/* Backdrop */}
      <div aria-hidden className="absolute inset-0 -z-10">
        {mediaUrl && mediaKind === 'VIDEO' ? (
          <video
            className="h-full w-full object-cover opacity-45"
            src={mediaUrl}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
          />
        ) : mediaUrl ? (
          <Image src={mediaUrl} alt="" fill priority sizes="100vw" className="object-cover opacity-45" />
        ) : (
          <div className="absolute inset-0 bg-[radial-gradient(120%_85%_at_78%_8%,rgba(245,16,110,0.42)_0%,transparent_58%),radial-gradient(90%_70%_at_10%_100%,rgba(34,46,77,0.9)_0%,transparent_60%)]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/62 to-ink-950/35" />
        <div className="grain absolute inset-0" />
      </div>

      <div className="shell w-full">
        {eyebrow && (
          <p
            className="mb-8 max-w-xl text-[0.6875rem] font-bold uppercase leading-relaxed tracking-[0.24em] text-brand-300 transition-all duration-1000 ease-noriva"
            style={{ opacity: ready ? 1 : 0, transform: ready ? 'none' : 'translateY(16px)' }}
          >
            {eyebrow}
          </p>
        )}

        <h1 className="font-display text-display-lg uppercase">
          {lines.map((line, i) => (
            <span key={i} className="block overflow-hidden">
              <span
                className="block transition-[transform,opacity] duration-[1100ms] ease-noriva"
                style={{
                  transform: ready ? 'none' : 'translate3d(0,105%,0)',
                  opacity: ready ? 1 : 0,
                  transitionDelay: `${140 + i * 110}ms`,
                }}
              >
                {i === lines.length - 1 ? (
                  <>
                    {line.replace(/\.$/, '')}
                    <span className="text-brand">.</span>
                  </>
                ) : (
                  line
                )}
              </span>
            </span>
          ))}
        </h1>

        <div
          className="mt-10 flex flex-col gap-8 transition-all duration-1000 ease-noriva lg:flex-row lg:items-end lg:justify-between"
          style={{ opacity: ready ? 1 : 0, transform: ready ? 'none' : 'translateY(24px)', transitionDelay: '520ms' }}
        >
          {subtitle && <p className="max-w-xl text-lg leading-relaxed text-white/65 sm:text-xl">{subtitle}</p>}

          <div className="flex flex-wrap items-center gap-3">
            <MagneticButton
              href={`/${locale}/start-a-project`}
              onClick={() => track(EVENTS.startProjectClick, { location: 'hero' })}
            >
              {primaryCta}
            </MagneticButton>
            <MagneticButton href={`/${locale}/work`} variant="outline">
              {secondaryCta}
            </MagneticButton>
          </div>
        </div>
      </div>
    </section>
  );
}
