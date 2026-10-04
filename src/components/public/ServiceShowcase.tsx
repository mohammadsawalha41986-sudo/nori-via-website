import Link from 'next/link';
import { CmsImage as Image } from '@/components/public/CmsImage';
import { ServiceCarousel } from './ServiceCarousel';
import { SectionHeading } from '../ui/SectionHeading';
import { TextLink } from '../ui/Button';
import type { Locale } from '@/lib/i18n';
export type ShowcaseService = {
  id: string;
  slug: string;
  name: string;
  summary: string;
  image?: string | null;
};
export function ServiceShowcase({
  locale,
  headline,
  body,
  allLabel,
  services,
}: {
  locale: Locale;
  headline: string;
  body?: string;
  allLabel: string;
  services: ShowcaseService[];
  featured?: ShowcaseService | null;
}) {
  if (!services.length) return null;
  return (
    <section className="bg-white section-y">
      <div className="shell">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
          <SectionHeading title={headline} description={body} className="mb-0" />
          <TextLink href={`/${locale}/services`}>{allLabel}</TextLink>
        </div>
        <ServiceCarousel locale={locale}>
          {services.slice(0, 4).map((s, i) => (
            <article key={s.id}>
              <Link href={`/${locale}/services/${s.slug}`} className="pillar-card group">
                <div className="relative aspect-[16/10] overflow-hidden bg-ink-100">
                  {s.image && (
                    <Image
                      src={s.image}
                      alt={s.name}
                      fill
                      sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 85vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  )}
                  <span className="absolute bottom-3 start-3 bg-ink-900 px-3 py-1 font-mono text-xs text-white">
                    0{i + 1}
                  </span>
                </div>
                <div className="py-5">
                  <h3 className="font-display text-lg text-ink-900 group-hover:underline underline-offset-4">
                    {s.name} <span aria-hidden>↗</span>
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-ink-500">{s.summary}</p>
                </div>
              </Link>
            </article>
          ))}
        </ServiceCarousel>
      </div>
    </section>
  );
}
