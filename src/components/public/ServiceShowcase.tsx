import Link from 'next/link';
import Image from 'next/image';
import { Reveal } from '../ui/Reveal';
import { SectionHeading } from '../ui/SectionHeading';
import { TextLink } from '../ui/Button';
import type { Locale } from '@/lib/i18n';

export type ShowcaseService = {
  id: string;
  slug: string;
  name: string;
  summary: string;
  /** Only the promoted card draws artwork, and only its own. */
  image?: string | null;
};

/**
 * The services grid: compact cards with one service promoted to a large card
 * carrying its own image. The promoted card is chosen in Admin; when none is
 * chosen, or the chosen one has no image, the grid degrades to plain cards
 * rather than borrowing another service's artwork.
 */
export function ServiceShowcase({
  locale,
  headline,
  body,
  allLabel,
  services,
  featured,
}: {
  locale: Locale;
  headline: string;
  body?: string;
  allLabel: string;
  services: ShowcaseService[];
  featured?: ShowcaseService | null;
}) {
  if (!headline || services.length === 0) return null;

  const hasFeature = Boolean(featured?.image);

  return (
    <section className="bg-white section-y">
      <div className="shell">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
          <SectionHeading title={headline} description={body} className="mb-0" />
          <TextLink href={`/${locale}/services`}>{allLabel}</TextLink>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {hasFeature && featured && (
            <Reveal className="sm:col-span-2 lg:row-span-2">
              <Link
                href={`/${locale}/services/${featured.slug}`}
                className="group relative flex h-full min-h-[22rem] flex-col justify-end overflow-hidden rounded-card bg-ink-900 p-8 text-white sm:min-h-[28rem]"
              >
                <Image
                  src={featured.image as string}
                  alt=""
                  fill
                  sizes="(max-width: 640px) 100vw, 66vw"
                  className="object-cover transition-transform duration-700 ease-noriva group-hover:scale-105"
                />
                {/* Readability wash — the type sits over uncontrolled photography. */}
                <div
                  aria-hidden
                  className="absolute inset-0 bg-gradient-to-t from-ink-950/90 via-ink-950/45 to-ink-950/10"
                />
                <div className="relative">
                  <h3 className="font-display text-2xl font-display-soft uppercase sm:text-3xl">
                    {featured.name}
                  </h3>
                  {featured.summary && (
                    <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/75">
                      {featured.summary}
                    </p>
                  )}
                </div>
              </Link>
            </Reveal>
          )}

          {services.map((service, i) => (
            <Reveal key={service.id} delay={Math.min(i, 6) * 55} y={16} className="h-full">
              <Link
                href={`/${locale}/services/${service.slug}`}
                className="group flex h-full flex-col rounded-card border border-ink-900/10 bg-bone p-7 transition-colors duration-300 hover:border-brand"
              >
                <span aria-hidden className="font-mono text-xs text-brand">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="mt-4 font-display text-lg font-display-soft uppercase text-ink-900 transition-colors duration-300 group-hover:text-brand">
                  {service.name}
                </h3>
                {service.summary && (
                  <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-ink-400">
                    {service.summary}
                  </p>
                )}
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
