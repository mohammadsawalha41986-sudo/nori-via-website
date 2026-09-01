'use client';

import { useEffect } from 'react';

export default function LocaleError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // The digest is safe to log; the message itself is never shown to visitors.
    console.error('[noriva] render error', error.digest);
  }, [error]);

  return (
    <section className="flex min-h-[80svh] items-center bg-ink-900 py-32 text-white">
      <div className="shell">
        <h1 className="font-display text-display-sm font-extrabold uppercase">Something went wrong.</h1>
        <p className="mt-5 max-w-lg text-lg text-white/50">
          An unexpected error occurred. Please try again. · حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-10 inline-flex rounded-full bg-brand px-7 py-4 text-[0.9375rem] font-semibold text-white transition-colors hover:bg-brand-600"
        >
          Try again
        </button>
      </div>
    </section>
  );
}
