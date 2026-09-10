import Link from 'next/link';
import { Reveal } from '../ui/Reveal';
import { localePath, type Locale } from '@/lib/i18n';

export type CrossLink = { id: string; slug: string; name: string; summary: string };

/**
 * Sibling services, linked from a service page.
 *
 * The editorial "related content" block beside this one is curated in Admin
 * and only as complete as an editor has made it. This block is structural: it
 * always links a service to its neighbours, so every service in the catalogue
 * is reachable from every other one rather than only from the index. Each link
 * carries the service's own name as its anchor text, which is what both a
 * visitor and a crawler need to know where the link goes.
 */
export function ServiceCrossLinks({
  locale,
  title,
  allLabel,
  services,
}: {
  locale: Locale;
  title: string;
  allLabel: string;
  services: CrossLink[];
}) {
  if (services.length === 0) return null;

  return (
    <section className="bg-white section-y" aria-labelledby="more-services">
      <div className="shell">
        <div className="flex flex-wrap items-baseline justify-between gap-4">
          <h2 id="more-services" className="font-display text-xl uppercase text-ink-900 sm:text-2xl">
            {title}
          </h2>
          <Link
            href={localePath(locale, '/services')}
            className="text-sm font-semibold text-brand transition-colors hover:text-brand-600"
          >
            {allLabel} →
          </Link>
        </div>

        <ul className="mt-10 grid gap-px overflow-hidden rounded-xl bg-ink-900/10 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, i) => (
            <Reveal as="li" key={service.id} delay={i * 40} y={14} className="bg-white">
              <Link
                href={localePath(locale, `/services/${service.slug}`)}
                className="group block h-full px-7 py-7 transition-colors hover:bg-bone"
              >
                <span className="block text-sm font-semibold leading-snug text-ink-900 group-hover:text-brand">
                  {service.name}
                </span>
                {service.summary && (
                  <span className="mt-2 block text-xs leading-relaxed text-ink-400">{service.summary}</span>
                )}
              </Link>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
