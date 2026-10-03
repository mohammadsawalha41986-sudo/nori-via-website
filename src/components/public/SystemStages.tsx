'use client';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
export type Stage = {
  id: string;
  step: string;
  title: string;
  description: string;
  services: string[];
  mediaUrl: string | null;
};
export function SystemStages({ headline, stages }: { headline: string; stages: Stage[] }) {
  const [active, setActive] = useState(0);
  const [desktop, setDesktop] = useState<boolean | null>(null);
  const list = useRef<HTMLOListElement>(null);
  const process = stages.filter((s) => s.step.startsWith('P'));
  const shown = (process.length ? process : stages).slice(0, 7);
  useEffect(() => {
    const media = window.matchMedia('(min-width:1024px)');
    const update = () => setDesktop(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);
  useEffect(() => {
    if (!list.current || !window.matchMedia('(min-width:1024px)').matches) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries)
          if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.index));
      },
      { rootMargin: '-35% 0px -45% 0px', threshold: 0 },
    );
    list.current.querySelectorAll('[data-index]').forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [stages]);
  if (!shown.length) return null;
  const current = shown[Math.min(active, shown.length - 1)];
  return (
    <section className="bg-ink-900 section-y text-white">
      <div className="shell">
        <h2 className="max-w-3xl font-display text-display-sm">{headline}</h2>
        <div className="mt-12 grid items-start gap-10 lg:grid-cols-2">
          <ol ref={list} className="border-t border-white/20">
            {shown.map((s, i) => (
              <li key={s.id} data-index={i} className="border-b border-white/20">
                <button
                  type="button"
                  aria-expanded={desktop === null ? undefined : desktop || active === i}
                  aria-pressed={desktop ? active === i : undefined}
                  aria-controls={`stage-body-${s.id}`}
                  onClick={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  className="flex min-h-16 w-full gap-5 py-5 text-start"
                >
                  <span className="pt-1 font-mono text-xs text-brand-300">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span
                    className={`font-display text-xl sm:text-2xl ${active === i ? 'text-white' : 'text-white/65'}`}
                  >
                    {s.title}
                  </span>
                  <span aria-hidden className="ms-auto">
                    {active === i ? '−' : '+'}
                  </span>
                </button>
                <div
                  id={`stage-body-${s.id}`}
                  className={`${active === i ? 'block' : 'hidden lg:block'} pb-6 ps-10`}
                >
                  <p className="max-w-lg text-sm leading-relaxed text-white/65">{s.description}</p>
                  {active === i && s.mediaUrl && (
                    <div className="relative mt-5 aspect-[16/9] overflow-hidden lg:hidden">
                      <Image
                        src={s.mediaUrl}
                        alt={s.title}
                        fill
                        sizes="92vw"
                        className="object-cover"
                      />
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ol>
          <div className="sticky top-28 hidden lg:block">
            <div className="relative aspect-[4/5] overflow-hidden bg-ink-800">
              {current.mediaUrl && (
                <Image
                  key={current.id}
                  src={current.mediaUrl}
                  alt={current.title}
                  fill
                  sizes="45vw"
                  className="object-cover"
                />
              )}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink-950 p-8">
                <p className="font-mono text-xs text-brand-300">
                  0{active + 1} / 0{shown.length}
                </p>
                <p className="mt-3 font-display text-2xl">{current.title}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
