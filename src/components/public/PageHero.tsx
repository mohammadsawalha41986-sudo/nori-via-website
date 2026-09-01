import { AnimatedText } from '../ui/AnimatedText';
import { Reveal } from '../ui/Reveal';

export function PageHero({
  eyebrow,
  title,
  description,
  meta,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  meta?: React.ReactNode;
}) {
  return (
    <section className="relative overflow-hidden bg-ink-900 pb-20 pt-[calc(var(--nav-h)+4.5rem)] text-white sm:pb-28 sm:pt-[calc(var(--nav-h)+7rem)]">
      <div aria-hidden className="absolute inset-0 bg-[radial-gradient(100%_80%_at_88%_0%,rgba(245,16,110,0.32)_0%,transparent_60%)]" />
      <div aria-hidden className="grain absolute inset-0" />

      <div className="shell relative">
        {eyebrow && (
          <Reveal>
            <p className="mb-6 text-[0.6875rem] font-bold uppercase tracking-[0.24em] text-brand-300">{eyebrow}</p>
          </Reveal>
        )}

        <AnimatedText text={title} as="h1" className="max-w-5xl font-display text-display-md font-extrabold uppercase" />

        {description && (
          <Reveal delay={200}>
            <p className="mt-8 max-w-2xl text-lg leading-relaxed text-white/60">{description}</p>
          </Reveal>
        )}

        {meta && <Reveal delay={280}>{meta}</Reveal>}
      </div>
    </section>
  );
}
