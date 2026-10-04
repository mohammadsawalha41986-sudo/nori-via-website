'use client';

import { Children, useRef, useState, type ReactNode } from 'react';
import type { Locale } from '@/lib/i18n';

export function ServiceCarousel({ children, locale, kind = 'services' }: {
  children: ReactNode;
  locale: Locale;
  kind?: 'services' | 'tools' | 'library';
}) {
  const items = Children.toArray(children);
  const track = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const ar = locale === 'ar';
  const labels = {
    services: { region: ar ? 'تصفح خدماتنا' : 'Browse our services', previous: ar ? 'الخدمة السابقة' : 'Previous service', next: ar ? 'الخدمة التالية' : 'Next service' },
    tools: { region: ar ? 'تصفح الأدوات' : 'Browse our tools', previous: ar ? 'الأداة السابقة' : 'Previous tool', next: ar ? 'الأداة التالية' : 'Next tool' },
    library: { region: ar ? 'تصفح المكتبة' : 'Browse our library', previous: ar ? 'المورد السابق' : 'Previous resource', next: ar ? 'المورد التالي' : 'Next resource' },
  }[kind];
  function move(index: number) {
    const next = Math.max(0, Math.min(index, items.length - 1));
    const container = track.current;
    const slide = container?.children[next] as HTMLElement | undefined;
    if (!container || !slide) return;
    const box = container.getBoundingClientRect();
    const rect = slide.getBoundingClientRect();
    container.scrollBy({ left: ar ? rect.right - box.right : rect.left - box.left,
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  }
  function syncActive() {
    const container = track.current;
    if (!container) return;
    const box = container.getBoundingClientRect();
    let closest = 0, distance = Infinity;
    Array.from(container.children).forEach((slide, index) => {
      const rect = slide.getBoundingClientRect();
      const delta = Math.abs(ar ? rect.right - box.right : rect.left - box.left);
      if (delta < distance) { closest = index; distance = delta; }
    });
    setActive(closest);
  }
  return (
    <div role="region" aria-label={labels.region} aria-roledescription="carousel">
      <div ref={track} dir={ar ? 'rtl' : 'ltr'} className="service-carousel" tabIndex={0} onScroll={syncActive}
        onKeyDown={event => {
          if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
          event.preventDefault();
          move(active + (event.key === (ar ? 'ArrowLeft' : 'ArrowRight') ? 1 : -1));
        }}>
        {items.map((item, index) => <div className="service-slide" key={index} role="group" aria-roledescription="slide" aria-label={`${index + 1} / ${items.length}`}>{item}</div>)}
      </div>
      {items.length > 1 && <div className="mt-4 flex items-center justify-between gap-4">
        <p dir="ltr" className="font-mono text-xs text-ink-500" aria-live="polite">{active + 1} / {items.length}</p>
        <div className="flex gap-3">
          <button type="button" onClick={() => move(active - 1)} disabled={active === 0} aria-label={labels.previous} className="flex h-11 w-11 items-center justify-center rounded-full border border-ink-900/20 text-xl disabled:opacity-30">{ar ? '→' : '←'}</button>
          <button type="button" onClick={() => move(active + 1)} disabled={active === items.length - 1} aria-label={labels.next} className="flex h-11 w-11 items-center justify-center rounded-full border border-ink-900/20 text-xl disabled:opacity-30">{ar ? '←' : '→'}</button>
        </div>
      </div>}
    </div>
  );
}
