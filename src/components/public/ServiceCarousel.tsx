'use client';

import { Children, useRef, useState, type ReactNode } from 'react';
import type { Locale } from '@/lib/i18n';

export function ServiceCarousel({ children, locale }: { children: ReactNode; locale: Locale }) {
  const items = Children.toArray(children);
  const track = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const ar = locale === 'ar';
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
    <div role="region" aria-label={ar ? 'تصفح خدماتنا' : 'Browse our services'} aria-roledescription="carousel">
      <div ref={track} dir={ar ? 'rtl' : 'ltr'} className="service-carousel" tabIndex={0} onScroll={syncActive}
        onKeyDown={event => {
          if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
          event.preventDefault();
          move(active + (event.key === (ar ? 'ArrowLeft' : 'ArrowRight') ? 1 : -1));
        }}>
        {items.map((item, index) => <div className="service-slide" key={index} role="group" aria-roledescription="slide" aria-label={`${index + 1} / ${items.length}`}>{item}</div>)}
      </div>
      {items.length > 1 && <div className="mt-4 flex items-center justify-between gap-4">
        <p className="font-mono text-xs text-ink-500" aria-live="polite">{active + 1} / {items.length}</p>
        <div className="flex gap-3">
          <button type="button" onClick={() => move(active - 1)} disabled={active === 0} aria-label={ar ? 'الخدمة السابقة' : 'Previous service'} className="flex h-11 w-11 items-center justify-center rounded-full border border-ink-900/20 text-xl disabled:opacity-30">{ar ? '→' : '←'}</button>
          <button type="button" onClick={() => move(active + 1)} disabled={active === items.length - 1} aria-label={ar ? 'الخدمة التالية' : 'Next service'} className="flex h-11 w-11 items-center justify-center rounded-full border border-ink-900/20 text-xl disabled:opacity-30">{ar ? '←' : '→'}</button>
        </div>
      </div>}
    </div>
  );
}
