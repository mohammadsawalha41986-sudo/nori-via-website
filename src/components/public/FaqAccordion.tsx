import { Reveal } from '../ui/Reveal';
import { Prose } from '../ui/Prose';

export type FaqEntry = {
  /** Stable key. Service FAQs are stored as a JSON list, so an index is used there. */
  id: string;
  question: string;
  answer: string;
};

/**
 * Collapsible questions, built on <details> so a question opens without
 * JavaScript and is reachable by keyboard and by in-page search.
 *
 * Shared by the homepage FAQ block and the service pages, so the two can never
 * drift apart visually.
 */
export function FaqAccordion({ items, className }: { items: FaqEntry[]; className?: string }) {
  if (items.length === 0) return null;

  return (
    <div className={className}>
      {items.map((item, i) => (
        <Reveal key={item.id} delay={Math.min(i, 8) * 50} y={14}>
          <details className="group border-b border-ink-900/10 py-5">
            <summary className="flex cursor-pointer list-none items-start justify-between gap-6 text-start font-semibold text-ink-900 marker:hidden">
              {item.question}
              <span
                aria-hidden
                className="mt-1 shrink-0 text-brand transition-transform duration-300 group-open:rotate-45"
              >
                +
              </span>
            </summary>
            {item.answer && (
              <div className="pt-4">
                <Prose text={item.answer} className="max-w-2xl" />
              </div>
            )}
          </details>
        </Reveal>
      ))}
    </div>
  );
}

/**
 * The homepage's FAQ section: heading on one side, questions on the other.
 * The section disappears entirely when an editor has not written any.
 */
export function FaqSection({
  eyebrow,
  headline,
  body,
  items,
}: {
  eyebrow?: string;
  headline: string;
  body?: string;
  items: FaqEntry[];
}) {
  if (!headline || items.length === 0) return null;

  return (
    <section className="bg-bone section-y">
      <div className="shell grid gap-12 lg:grid-cols-12 lg:gap-16">
        <Reveal className="lg:col-span-5">
          <div className="lg:sticky lg:top-32">
            {eyebrow && (
              <div className="mb-5 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.24em] text-brand">
                <span aria-hidden className="h-px w-8 bg-current" />
                {eyebrow}
              </div>
            )}
            <h2 className="font-display text-display-sm uppercase text-ink-900">{headline}</h2>
            {body && <p className="mt-6 max-w-md text-lg leading-relaxed text-ink-500">{body}</p>}
          </div>
        </Reveal>

        <FaqAccordion items={items} className="border-t border-ink-900/10 lg:col-span-7" />
      </div>
    </section>
  );
}
