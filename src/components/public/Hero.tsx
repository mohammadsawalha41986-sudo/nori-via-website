'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { MagneticButton } from '../ui/Button';
import { track, EVENTS } from '@/lib/track';
import type { Locale } from '@/lib/i18n';

const SCENES = ['/img/noriva-photo-dining.webp', '/img/noriva-photo-chef.webp', '/img/noriva-photo-delivery.webp'];

export function Hero({ locale, eyebrow, headline, subtitle, primaryCta, secondaryCta, mediaUrl, mediaKind }: {
  locale: Locale; eyebrow: string; headline: string; subtitle: string;
  primaryCta: string; secondaryCta: string; mediaUrl: string | null;
  mediaKind: 'IMAGE' | 'VIDEO' | 'DOCUMENT';
}) {
  const ar = locale === 'ar';
  const [scene, setScene] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(true);
  const video = useRef<HTMLVideoElement>(null);
  const editorial = !mediaUrl || ['/img/hero.jpg', '/img/noriva-editorial-dining.webp', SCENES[0]].includes(mediaUrl);
  const captions = ar ? ['تجربة تترك أثرًا', 'تشغيل يضبط التفاصيل', 'طلبات تُبنى على الربحية'] : ['An experience that stays', 'Operations in the details', 'Orders built around margin'];
  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(preference.matches);
    update(); preference.addEventListener('change', update);
    return () => preference.removeEventListener('change', update);
  }, []);
  useEffect(() => {
    if (!editorial || reduced || paused) return;
    const interval = window.setInterval(() => { if (!document.hidden) setScene(s => (s + 1) % SCENES.length); }, 7000);
    return () => window.clearInterval(interval);
  }, [editorial, reduced, paused]);
  useEffect(() => {
    if (!video.current) return;
    if (reduced || paused) video.current.pause();
    else void video.current.play().catch(() => {});
  }, [reduced, paused]);

  return (
    <section className="relative isolate flex min-h-[min(900px,100svh)] items-center overflow-hidden bg-ink-950 text-white">
      <div className="absolute inset-0 -z-20">
        {mediaUrl && mediaKind === 'VIDEO' ? <video ref={video} className="h-full w-full object-cover" src={mediaUrl} muted loop playsInline preload="metadata" poster={SCENES[0]} /> : editorial ?
          (reduced ? [SCENES[scene]] : SCENES).map(src => <Image key={src} src={src} alt="" fill priority={src === SCENES[0]} sizes="100vw" className={`hero-photo object-cover ${paused ? 'hero-paused' : ''}`} style={{ opacity: src === SCENES[scene] ? 1 : 0, transition: reduced ? 'none' : 'opacity 1200ms ease' }} />) :
          <Image src={mediaUrl || SCENES[0]} alt="" fill priority sizes="100vw" className="object-cover" />}
      </div>
      <div className="absolute inset-0 -z-10" style={{ background: ar ? 'linear-gradient(270deg,rgba(5,10,22,.92) 0%,rgba(5,10,22,.66) 48%,rgba(5,10,22,.18) 100%)' : 'linear-gradient(90deg,rgba(5,10,22,.92) 0%,rgba(5,10,22,.66) 48%,rgba(5,10,22,.18) 100%)' }} />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-1/3 bg-gradient-to-t from-ink-950/85 to-transparent" />
      <div className="shell w-full pb-28 pt-[calc(var(--nav-h)+4rem)] sm:pb-36 lg:pt-[calc(var(--nav-h)+5rem)]">
        <div className="max-w-3xl">
          {eyebrow && <p className="mb-6 text-xs font-semibold leading-7 tracking-[0.12em] text-brand-300">{eyebrow}</p>}
          <h1 className="max-w-[15ch] font-display text-[clamp(2.6rem,5.7vw,5.6rem)] font-semibold leading-[1.14] tracking-[-0.035em]">
            {headline.replace(/\n/g, ' ').replace(/\.$/, '')}<span className="text-brand">.</span>
          </h1>
          {subtitle && <p className="mt-7 max-w-xl text-base leading-8 text-white/85 sm:text-lg">{subtitle}</p>}
          <div className="mt-8 flex flex-wrap gap-3">
            <MagneticButton href={`/${locale}/start-a-project`} onClick={() => track(EVENTS.startProjectClick, { location: 'hero' })}>{primaryCta}</MagneticButton>
            <MagneticButton href={`/${locale}/services`} variant="outline">{secondaryCta}</MagneticButton>
          </div>
          <p className="mt-8 text-xs leading-6 text-white/65">{ar ? 'المطاعم والمقاهي · من تأسيس الفكرة إلى تطوير الأداء' : 'Restaurants & cafes · From concept to better performance'}</p>
        </div>
      </div>
      {editorial && <div className="absolute inset-x-0 bottom-5 sm:bottom-8">
        <div className="shell flex flex-wrap items-center justify-between gap-x-6 gap-y-2">
          <p className="text-sm text-white/85">{captions[scene]}</p>
          <div className="flex items-center gap-5">
            <div className="flex gap-2" aria-label={ar ? 'صور الهيرو' : 'Hero photographs'}>{SCENES.map((_, i) => <button key={i} type="button" onClick={() => { setScene(i); setPaused(true); }} aria-label={captions[i]} aria-pressed={scene === i} className="flex min-h-11 min-w-11 items-center justify-center"><span className={`block h-0.5 w-9 ${scene === i ? 'bg-brand' : 'bg-white/40'}`} /></button>)}</div>
            {!reduced && <button type="button" aria-pressed={paused} onClick={() => setPaused(p => !p)} className="min-h-11 text-xs text-white/85">{paused ? (ar ? 'تشغيل الحركة' : 'Play motion') : (ar ? 'إيقاف الحركة' : 'Pause motion')}</button>}
          </div>
        </div>
      </div>}
    </section>
  );
}
