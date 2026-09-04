'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * The editorial statement. Each line brightens as it crosses the middle of the
 * viewport; with reduced motion every line is simply shown at full contrast.
 */
export function BrandStatement({ statement, support }: { statement: string; support?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [reduced, setReduced] = useState(false);
  const lines = statement.split('\n').map((l) => l.trim()).filter(Boolean);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setReduced(true);
      return;
    }
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const el = ref.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        const span = r.height + window.innerHeight * 0.7;
        setProgress(Math.min(1, Math.max(0, (window.innerHeight * 0.85 - r.top) / span)));
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  if (!lines.length) return null;

  return (
    <section className="bg-bone py-24 sm:py-36">
      <div className="shell" ref={ref}>
        <p className="font-display text-display-sm uppercase leading-[1.06]">
          {lines.map((line, i) => {
            const threshold = i / (lines.length + 0.6);
            const active = reduced || progress > threshold;
            return (
              <span
                key={i}
                className="block transition-colors duration-500 ease-noriva"
                style={{ color: active ? '#0B1225' : 'rgba(11,18,37,0.16)' }}
              >
                {line}
              </span>
            );
          })}
        </p>

        {support && (
          <p className="mt-12 max-w-2xl text-lg leading-relaxed text-ink-500 ltr:ml-auto rtl:mr-auto">{support}</p>
        )}
      </div>
    </section>
  );
}
