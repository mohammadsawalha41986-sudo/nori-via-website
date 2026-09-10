import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CTASection } from '@/components/public/CTASection';
import { PageHero } from '@/components/public/PageHero';
import { PathCards, toPathCards } from '@/components/public/PathCards';
import { RelatedContent } from '@/components/public/RelatedContent';
import { Prose } from '@/components/ui/Prose';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { getDictionary } from '@/lib/dictionary';
import { isLocale, pick, type Locale } from '@/lib/i18n';
import { getPage, getPublishedServices } from '@/lib/content';
import { getRelatedContent } from '@/lib/relations';
import { buildMetadata, JsonLd, breadcrumbs } from '@/lib/seo';
import { summarise } from '@/lib/seo-text';

export const revalidate = 60;

/**
 * The guided entry point. Every card, heading and paragraph comes from the
 * `start-here` page in Admin — this route only decides how they are laid out,
 * so the journey can be re-shaped without a deployment.
 */
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: raw } = await params;
  if (!isLocale(raw)) return {};
  const locale = raw as Locale;
  const page = await getPage('start-here');
  return buildMetadata({
    row: page,
    locale,
    path: '/start-here',
    fallbackTitle: getDictionary(locale).nav.startHere,
    fallbackDescription: page ? summarise(pick(page, 'body', locale)) : '',
  });
}

export default async function StartHerePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const dict = getDictionary(locale);

  const [page, services] = await Promise.all([getPage('start-here'), getPublishedServices()]);

  // The page row is optional: without it the solutions below still route the
  // visitor, so a database that has not been seeded yet is never a dead end.
  const content = (page?.content ?? {}) as { paths?: unknown };
  const paths = toPathCards(content.paths, locale, dict.common.readMore);
  const related = page ? await getRelatedContent('PAGE', page.id, locale) : [];

  // Solutions are the fallback router when no custom paths have been authored,
  // so the page is never an empty shell.
  const solutionCards = services.slice(0, 6).map((service) => ({
    title: pick(service, 'name', locale),
    body: pick(service, 'summary', locale),
    href: `/${locale}/services/${service.slug}`,
    label: dict.common.readMore,
  }));

  return (
    <>
      <JsonLd data={breadcrumbs(locale, [{ name: dict.nav.startHere, path: '/start-here' }])} />

      <PageHero
        eyebrow={dict.nav.startHere}
        title={(page && pick(page, 'title', locale)) || dict.nav.startHere}
        description={page ? pick(page, 'body', locale) : undefined}
      />

      <section className="bg-bone section-y">
        <div className="shell">
          <SectionHeading eyebrow={dict.startHere.eyebrow} title={dict.startHere.title} />
          <div className="mt-12">
            <PathCards items={paths.length ? paths : solutionCards} />
          </div>
        </div>
      </section>

      {page && pick(page, 'body', locale) && (
        <section className="bg-white section-y">
          <div className="shell max-w-3xl">
            <Prose text={pick(page, 'body', locale)} className="text-lg" />
          </div>
        </section>
      )}

      <RelatedContent items={related} title={dict.related.title} eyebrow={dict.nav.startHere} />

      <CTASection
        headline={dict.nav.start}
        label={dict.nav.start}
        href={`/${locale}/start-a-project`}
        secondaryLabel={dict.nav.contact}
        secondaryHref={`/${locale}/contact`}
      />
    </>
  );
}
