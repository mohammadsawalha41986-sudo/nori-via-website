'use client';

import { Children, useRef, useState, type ReactNode } from 'react';
import type { Locale } from '@/lib/i18n';

export function WorkCarousel({ children, locale }: { children: ReactNode; locale: Locale }) {
  const items = Children.toArray(children);
  const track = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const ar = locale === 'ar';
  function move(index: number) {
    const next = Math.max(0, Math.min(index, items.length - 1));
    const container = track.current;
    const slide = container?.children[next] as HTMLElement | undefined;
    if (!container || !slide) return;
    // Relative geometry works with both RTL scroll origins and LTR.
    const box = container.getBoundingClientRect();
    const itemBox = slide.getBoundingClientRect();
    container.scrollBy({ left: ar ? itemBox.right - box.right : itemBox.left - box.left,
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    setActive(next);
  }
  function syncActive() {
    const container = track.current;
    if (!container) return;
    const box = container.getBoundingClientRect();
    let closest = 0, distance = Infinity;
    Array.from(container.children).forEach((slide, i) => {
      const rect = slide.getBoundingClientRect();
      const delta = Math.abs(ar ? rect.right - box.right : rect.left - box.left);
      if (delta < distance) { closest = i; distance = delta; }
    });
    setActive(closest);
  }
  return (
    <div role="region" aria-label={ar ? 'تصفح أعمالنا بالتتابع' : 'Browse our work'} aria-roledescription="carousel">
      <div ref={track} dir={ar ? 'rtl' : 'ltr'} onScroll={syncActive} className="work-carousel" tabIndex={0}
        onKeyDown={event => {
          if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
          event.preventDefault();
          move(active + (event.key === (ar ? 'ArrowLeft' : 'ArrowRight') ? 1 : -1));
        }}>
        {items.map((item, i) => <div className="work-slide" key={i} role="group" aria-roledescription="slide" aria-label={`${i + 1} / ${items.length}`}>{item}</div>)}
      </div>
      {items.length > 1 && <div className="mt-6 flex items-center justify-between gap-4">
        <p className="font-mono text-xs text-ink-500" aria-live="polite">{String(active + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')}</p>
        <div className="flex gap-3">
          <button type="button" onClick={() => move(active - 1)} disabled={active === 0} aria-label={ar ? 'العمل السابق' : 'Previous project'} className="flex h-12 w-12 items-center justify-center rounded-full border border-ink-900/20 text-xl text-ink-900 disabled:opacity-30">{ar ? '→' : '←'}</button>
          <button type="button" onClick={() => move(active + 1)} disabled={active === items.length - 1} aria-label={ar ? 'العمل التالي' : 'Next project'} className="flex h-12 w-12 items-center justify-center rounded-full border border-ink-900/20 text-xl text-ink-900 disabled:opacity-30">{ar ? '←' : '→'}</button>
        </div>
      </div>}
    </div>
  );
}
