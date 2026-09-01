import Link from 'next/link';
import { Reveal } from '../ui/Reveal';
import type { Locale } from '@/lib/i18n';

export type ServiceRow = { id: string; slug: string; name: string; summary: string };
export type ServiceGroup = { id: string; name: string; description: string; services: ServiceRow[] };

/**
 * Services as an editorial index rather than a card wall — each row expands its
 * summary on hover/focus and links straight to the detail page.
 */
export function ServiceList({ groups, locale }: { groups: ServiceGroup[]; locale: Locale }) {
  return (
    <div className="space-y-20 sm:space-y-28">
      {groups.map((group) => (
        <section key={group.id} aria-labelledby={`group-${group.id}`}>
          <Reveal className="mb-8 max-w-2xl">
            <h2
              id={`group-${group.id}`}
              className="font-display text-2xl font-extrabold uppercase tracking-tight text-ink-900 sm:text-3xl"
            >
              {group.name}
            </h2>
            {group.description && <p className="mt-3 text-[0.9375rem] leading-relaxed text-ink-400">{group.description}</p>}
          </Reveal>

          <ul className="border-t border-ink-900/10">
            {group.services.map((s, i) => (
              <Reveal as="li" key={s.id} delay={i * 45} y={16} className="border-b border-ink-900/10">
                <Link href={`/${locale}/services/${s.slug}`} className="group flex items-start gap-6 py-6 sm:gap-10 sm:py-7">
                  <span className="mt-2 shrink-0 font-mono text-[0.6875rem] text-ink-300">
                    {String(i + 1).padStart(2, '0')}
                  </span>

                  <span className="flex-1">
                    <span className="block font-display text-xl font-bold uppercase tracking-tight text-ink-900 transition-colors duration-300 group-hover:text-brand sm:text-2xl">
                      {s.name}
                    </span>
                    {s.summary && (
                      <span className="mt-2 block max-w-2xl text-[0.9375rem] leading-relaxed text-ink-400">
                        {s.summary}
                      </span>
                    )}
                  </span>

                  <span
                    aria-hidden
                    className="mt-2 shrink-0 text-ink-300 transition-all duration-300 ease-noriva group-hover:translate-x-1 group-hover:text-brand rtl:rotate-180 rtl:group-hover:-translate-x-1"
                  >
                    →
                  </span>
                </Link>
              </Reveal>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
