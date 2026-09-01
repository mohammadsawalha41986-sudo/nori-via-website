import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PageHero } from '@/components/public/PageHero';
import { ServiceList, type ServiceGroup } from '@/components/public/ServiceList';
import { CTASection } from '@/components/public/CTASection';
import { EmptyState } from '@/components/public/EmptyState';
import { getDictionary } from '@/lib/dictionary';
import { isLocale, pick, type Locale } from '@/lib/i18n';
import { getPublishedServices, getServiceCategories, getPage } from '@/lib/content';
import { buildMetadata, JsonLd, breadcrumbs } from '@/lib/seo';

export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: raw } = await params;
  if (!isLocale(raw)) return {};
  const locale = raw as Locale;
  const page = await getPage('services');
  return buildMetadata({
    row: page,
    locale,
    path: '/services',
    fallbackTitle: getDictionary(locale).nav.services,
    fallbackDescription: page ? pick(page, 'body', locale) : '',
  });
}

export default async function ServicesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const dict = getDictionary(locale);

  const [services, categories, page] = await Promise.all([
    getPublishedServices(),
    getServiceCategories(),
    getPage('services'),
  ]);

  const groups: ServiceGroup[] = categories
    .map((c) => ({
      id: c.id,
      name: pick(c, 'name', locale),
      description: pick(c, 'description', locale),
      services: services
        .filter((s) => s.categoryId === c.id)
        .map((s) => ({ id: s.id, slug: s.slug, name: pick(s, 'name', locale), summary: pick(s, 'summary', locale) })),
    }))
    .filter((g) => g.services.length > 0);

  const uncategorised = services.filter((s) => !s.categoryId);
  if (uncategorised.length) {
    groups.push({
      id: 'other',
      name: dict.common.allServices,
      description: '',
      services: uncategorised.map((s) => ({
        id: s.id,
        slug: s.slug,
        name: pick(s, 'name', locale),
        summary: pick(s, 'summary', locale),
      })),
    });
  }

  return (
    <>
      <JsonLd
        data={breadcrumbs(locale, [
          { name: 'Noriva', path: '/' },
          { name: dict.nav.services, path: '/services' },
        ])}
      />

      <PageHero
        eyebrow={dict.nav.services}
        title={page ? pick(page, 'title', locale) : dict.nav.services}
        description={page ? pick(page, 'body', locale) : undefined}
      />

      <section className="bg-bone py-24 sm:py-32">
        <div className="shell">
          {groups.length ? (
            <ServiceList groups={groups} locale={locale} />
          ) : (
            <EmptyState title={dict.common.empty} body={dict.common.emptyServices} />
          )}
        </div>
      </section>

      <CTASection
        headline={dict.nav.start}
        label={dict.nav.start}
        href={`/${locale}/start-a-project`}
        secondaryLabel={dict.nav.work}
        secondaryHref={`/${locale}/work`}
      />
    </>
  );
}
