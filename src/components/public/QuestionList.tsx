import { Reveal } from '../ui/Reveal';
import { Prose } from '../ui/Prose';

export type QuestionItem = {
  id: string;
  question: string;
  answer: string;
};

/**
 * The "questions that usually go unanswered" block: an editorial heading that
 * stays with the reader on wide screens, beside a numbered list whose answers
 * are always visible. It is a statement of expertise rather than a help
 * section, which is why nothing here collapses — see FaqAccordion for the
 * support-style treatment.
 */
export function QuestionList({
  eyebrow,
  headline,
  body,
  items,
}: {
  eyebrow?: string;
  headline: string;
  body?: string;
  items: QuestionItem[];
}) {
  if (!headline || items.length === 0) return null;

  return (
    <section className="bg-white section-y">
      <div className="shell grid gap-14 lg:grid-cols-12 lg:gap-16">
        <Reveal className="lg:col-span-5">
          {/* Sticky only where there is room for it to travel. */}
          <div className="lg:sticky lg:top-32">
            {eyebrow && (
              <div className="mb-5 flex items-center gap-3 text-[0.6875rem] font-bold uppercase tracking-[0.24em] text-brand">
                <span aria-hidden className="h-px w-8 bg-current" />
                {eyebrow}
              </div>
            )}
            <h2 className="font-display text-display-sm uppercase text-ink-900">{headline}</h2>
            {body && <p className="mt-6 max-w-md text-lg leading-relaxed text-ink-500">{body}</p>}
          </div>
        </Reveal>

        <ol className="lg:col-span-7">
          {items.map((item, i) => (
            <Reveal
              as="li"
              key={item.id}
              delay={Math.min(i, 6) * 55}
              y={16}
              className="border-t border-ink-900/10 py-8 first:border-t-0 first:pt-0 sm:py-9"
            >
              <div className="flex items-start gap-5 sm:gap-8">
                <span aria-hidden className="mt-1 shrink-0 font-mono text-sm text-ink-300">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div className="flex-1">
                  <h3 className="font-display text-xl font-display-soft uppercase text-ink-900 sm:text-2xl">
                    {item.question}
                  </h3>
                  {item.answer && <Prose text={item.answer} className="mt-3 max-w-xl" />}
                </div>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
