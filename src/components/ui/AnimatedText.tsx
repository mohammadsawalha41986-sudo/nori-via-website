'use client';

import { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';

/**
 * Reveals a headline line by line. Newlines in the source string define the
 * lines, so CMS-authored headlines keep their intended breaks.
 */
export function AnimatedText({
  text,
  className,
  lineClassName,
  delay = 0,
  as: Tag = 'h2',
}: {
  text: string;
  className?: string;
  lineClassName?: string;
  delay?: number;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'div';
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);
  const lines = text.split('\n').filter((l) => l.trim().length > 0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setShown(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && (setShown(true), io.disconnect())),
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag ref={ref as never} className={className}>
      {lines.map((line, i) => (
        <span key={i} className="block overflow-hidden">
          <span
            className={clsx('block transition-[transform,opacity] duration-[900ms] ease-noriva', lineClassName)}
            style={{
              transform: shown ? 'none' : 'translate3d(0, 105%, 0)',
              opacity: shown ? 1 : 0,
              transitionDelay: `${delay + i * 90}ms`,
            }}
          >
            {line}
          </span>
        </span>
      ))}
    </Tag>
  );
}
