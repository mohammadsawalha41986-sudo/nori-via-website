'use client';

import { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';

type Props = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  /** Distance travelled on entry, in pixels. */
  y?: number;
  as?: 'div' | 'section' | 'li' | 'article' | 'span';
};

/**
 * Intersection-observer entrance. Uses CSS transitions rather than a motion
 * library so it costs nothing on the initial bundle, and it resolves to the
 * visible state immediately when reduced motion is requested.
 */
export function Reveal({ children, className, delay = 0, y = 26, as = 'div' }: Props) {
  const ref = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setShown(true);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setShown(true);
            io.disconnect();
          }
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  const Tag = as as 'div';

  return (
    <Tag
      ref={ref as React.RefObject<HTMLDivElement>}
      className={clsx('transition-[opacity,transform] duration-700 ease-noriva will-change-transform', className)}
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? 'none' : `translate3d(0, ${y}px, 0)`,
        transitionDelay: shown ? `${delay}ms` : '0ms',
      }}
    >
      {children}
    </Tag>
  );
}
