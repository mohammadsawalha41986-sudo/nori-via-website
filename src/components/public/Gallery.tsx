'use client';

import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';
import clsx from 'clsx';

export type GalleryImage = { url: string; alt: string };

type Labels = {
  /** Accessible name for the dialog, e.g. the project title. */
  title: string;
  open: string;
  close: string;
  previous: string;
  next: string;
};

/**
 * Project gallery with a lightbox.
 *
 * The grid keeps the editorial rhythm of the page — every third frame runs full
 * width — and each frame opens a full-screen viewer. The viewer is a modal in
 * the accessibility sense: focus moves into it, is trapped while it is open,
 * and returns to the thumbnail that opened it on close. Arrow keys page through
 * images in reading order, which is reversed under RTL so "next" always means
 * the direction the eye travels.
 */
export function Gallery({
  images,
  labels,
  dir = 'ltr',
}: {
  images: GalleryImage[];
  labels: Labels;
  dir?: 'ltr' | 'rtl';
}) {
  const [openAt, setOpenAt] = useState<number | null>(null);
  const [loaded, setLoaded] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const openerRef = useRef<HTMLButtonElement | null>(null);

  const isOpen = openAt !== null;
  const total = images.length;

  const close = useCallback(() => {
    setOpenAt(null);
    openerRef.current?.focus();
  }, []);

  const step = useCallback(
    (delta: number) => {
      setLoaded(false);
      setOpenAt((current) => (current === null ? current : (current + delta + total) % total));
    },
    [total],
  );

  /* Keyboard: Escape closes, arrows page, Tab is trapped inside the dialog. */
  useEffect(() => {
    if (!isOpen) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        close();
        return;
      }
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        step(dir === 'rtl' ? -1 : 1);
        return;
      }
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        step(dir === 'rtl' ? 1 : -1);
        return;
      }
      if (e.key !== 'Tab') return;

      const focusable = dialogRef.current?.querySelectorAll<HTMLElement>('button');
      if (!focusable?.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKey);
    /* The page behind a full-screen viewer should not scroll. */
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen, close, step, dir]);

  /* Move focus into the dialog when it opens. */
  useEffect(() => {
    if (isOpen) dialogRef.current?.querySelector('button')?.focus();
  }, [isOpen]);

  if (!images.length) return null;

  /* Bundling index with image lets TypeScript narrow both at once. */
  const active = openAt === null ? null : { index: openAt, image: images[openAt] };

  return (
    <>
      <div className="shell grid gap-6 sm:grid-cols-2">
        {images.map((image, i) => (
          <button
            key={image.url + i}
            type="button"
            onClick={(e) => {
              openerRef.current = e.currentTarget;
              setLoaded(false);
              setOpenAt(i);
            }}
            aria-label={`${labels.open} — ${image.alt}`}
            className={clsx(
              'group relative block overflow-hidden rounded-xl bg-ink-100 outline-none',
              'focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-4 focus-visible:ring-offset-bone',
              i % 3 === 0 ? 'aspect-[4/3] sm:col-span-2' : 'aspect-square',
            )}
          >
            <Image
              src={image.url}
              alt={image.alt}
              fill
              sizes="(min-width:640px) 50vw, 100vw"
              className="object-cover transition-transform duration-[900ms] ease-noriva motion-safe:group-hover:scale-[1.04]"
            />
            <span className="absolute inset-0 bg-ink-950/0 transition-colors duration-500 group-hover:bg-ink-950/20" />
          </button>
        ))}
      </div>

      {active && (
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label={labels.title}
          className="fixed inset-0 z-[100] flex flex-col bg-ink-950/95 backdrop-blur-sm motion-safe:animate-fade-up"
          onClick={(e) => {
            /* Clicking the backdrop closes; clicking the image itself does not. */
            if (e.target === e.currentTarget) close();
          }}
        >
          <div className="flex items-center justify-between px-5 py-4 text-white sm:px-8">
            <span className="font-mono text-xs tabular-nums text-white/70">
              {active.index + 1} / {total}
            </span>
            <button
              type="button"
              onClick={close}
              aria-label={labels.close}
              className="rounded-full p-2 text-white/80 outline-none transition hover:bg-white/10 hover:text-white focus-visible:ring-2 focus-visible:ring-white"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          <div
            className="relative mx-auto flex w-full max-w-6xl flex-1 items-center justify-center px-4 pb-6 sm:px-8"
            onClick={(e) => {
              if (e.target === e.currentTarget) close();
            }}
          >
            {!loaded && (
              <span className="absolute inset-0 m-auto h-8 w-8 animate-spin rounded-full border-2 border-white/25 border-t-white/80" />
            )}
            <Image
              key={active.image.url}
              src={active.image.url}
              alt={active.image.alt}
              width={1600}
              height={1100}
              sizes="100vw"
              onLoad={() => setLoaded(true)}
              className={clsx(
                'max-h-[78svh] w-auto object-contain transition-opacity duration-500',
                loaded ? 'opacity-100' : 'opacity-0',
              )}
            />
          </div>

          {total > 1 && (
            <div className="flex items-center justify-center gap-3 pb-8">
              <button
                type="button"
                onClick={() => step(dir === 'rtl' ? 1 : -1)}
                aria-label={labels.previous}
                className="rounded-full border border-white/25 p-3 text-white/85 outline-none transition hover:bg-white/10 hover:text-white focus-visible:ring-2 focus-visible:ring-white"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path
                    d="M15 5l-7 7 7 7"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    transform={dir === 'rtl' ? 'rotate(180 12 12)' : undefined}
                  />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => step(dir === 'rtl' ? -1 : 1)}
                aria-label={labels.next}
                className="rounded-full border border-white/25 p-3 text-white/85 outline-none transition hover:bg-white/10 hover:text-white focus-visible:ring-2 focus-visible:ring-white"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path
                    d="M9 5l7 7-7 7"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    transform={dir === 'rtl' ? 'rotate(180 12 12)' : undefined}
                  />
                </svg>
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
}
