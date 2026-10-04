import { CmsImage as Image } from '@/components/public/CmsImage';
import { AnimatedText } from '../ui/AnimatedText';
import { Reveal } from '../ui/Reveal';

export function PageHero({
  eyebrow,
  title,
  description,
  meta,
  image,
  imageAlt,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  meta?: React.ReactNode;
  /**
   * Section photography behind the heading. Optional: a section with no
   * picture of its own keeps the brand gradient rather than borrowing an
   * image that belongs to something else.
   */
  image?: string | null;
  imageAlt?: string;
}) {
  return (
    <section className="relative isolate overflow-hidden bg-ink-900 pb-12 pt-[calc(var(--nav-h)+2.5rem)] text-white sm:pb-16 sm:pt-[calc(var(--nav-h)+3.5rem)]">
      {image && (
        <div className="absolute inset-0 -z-10">
          <Image
            src={image}
            // Decorative: the heading beside it already names the section, so
            // an alt text here would only repeat it to a screen reader.
            alt={imageAlt || title}
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-40"
          />
          {/*
            The heading sits on top of the photograph, so the image is dimmed
            and weighted towards the text side. Without this the display type
            loses contrast against a light patch and becomes unreadable —
            which is a legibility requirement, not a stylistic one.
          */}
          <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/75 to-ink-950/55" />
        </div>
      )}

      <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(100%_80%_at_88%_0%,rgba(245,16,110,0.32)_0%,transparent_60%)]" />
      <div aria-hidden className="grain absolute inset-0 -z-10" />

      <div className="shell relative">
        {eyebrow && (
          <Reveal>
            <p className="mb-6 text-xs font-bold uppercase tracking-[0.24em] text-brand-300">{eyebrow}</p>
          </Reveal>
        )}

        <AnimatedText text={title} as="h1" className="max-w-5xl font-display text-display-md uppercase" />

        {description && (
          <Reveal delay={200}>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/80 sm:text-lg">{description}</p>
          </Reveal>
        )}

        {meta && <Reveal delay={280}>{meta}</Reveal>}
      </div>
    </section>
  );
}
