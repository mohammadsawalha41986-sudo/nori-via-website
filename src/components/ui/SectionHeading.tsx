import clsx from 'clsx';
import { Reveal } from './Reveal';

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'start',
  tone = 'dark',
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: 'start' | 'center';
  tone?: 'dark' | 'light';
  className?: string;
}) {
  return (
    <Reveal className={clsx('max-w-3xl', align === 'center' && 'mx-auto text-center', className)}>
      {eyebrow && (
        <div
          className={clsx(
            'mb-5 flex items-center gap-3 text-[0.6875rem] font-bold uppercase tracking-[0.24em]',
            align === 'center' && 'justify-center',
            tone === 'light' ? 'text-brand-300' : 'text-brand',
          )}
        >
          <span aria-hidden className="h-px w-8 bg-current" />
          {eyebrow}
        </div>
      )}
      <h2
        className={clsx(
          'font-display text-display-sm font-extrabold uppercase',
          tone === 'light' ? 'text-white' : 'text-ink-900',
        )}
      >
        {title}
      </h2>
      {description && (
        <p className={clsx('mt-6 text-lg leading-relaxed', tone === 'light' ? 'text-white/65' : 'text-ink-500')}>
          {description}
        </p>
      )}
    </Reveal>
  );
}
