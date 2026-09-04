import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PageHero } from '@/components/public/PageHero';
import { CTASection } from '@/components/public/CTASection';
import { Metrics } from '@/components/public/Metrics';
import { Reveal } from '@/components/ui/Reveal';
import { Prose } from '@/components/ui/Prose';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { getDictionary } from '@/lib/dictionary';
import { isLocale, pick, type Locale } from '@/lib/i18n';
import { getPage, getStatistics, getTestimonials } from '@/lib/content';
import { buildMetadata, JsonLd, breadcrumbs } from '@/lib/seo';
import { RelatedContent } from '@/components/public/RelatedContent';
import { getRelatedContent } from '@/lib/relations';

export const revalidate = 60;

type Section = { key?: string; titleEn?: string; titleAr?: string; bodyEn?: string; bodyAr?: string };

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: raw } = await params;
  if (!isLocale(raw)) return {};
  const locale = raw as Locale;
  const page = await getPage('about');
  return buildMetadata({
    row: page,
    locale,
    path: '/about',
    fallbackTitle: getDictionary(locale).nav.about,
    fallbackDescription: page ? pick(page, 'body', locale) : '',
  });
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const dict = getDictionary(locale);

  const [page, stats, testimonials] = await Promise.all([getPage('about'), getStatistics(), getTestimonials()]);

  // Attached in Admin, so About can point at the work, articles and tools that
  // back up what it claims.
  const related = page ? await getRelatedContent('PAGE', page.id, locale) : [];

  const content = (page?.content ?? {}) as { sections?: Section[] };
  const sections = (content.sections ?? []).filter((s) => pick(s, 'title', locale));

  return (
    <>
      <JsonLd
        data={breadcrumbs(locale, [
          { name: 'Noriva', path: '/' },
          { name: dict.nav.about, path: '/about' },
        ])}
      />

      <PageHero
        eyebrow={dict.nav.about}
        title={page ? pick(page, 'title', locale) : dict.nav.about}
        description={page ? pick(page, 'body', locale) : undefined}
      />

      {sections.length > 0 && (
        <section className="bg-bone py-24 sm:py-32">
          <div className="shell space-y-20 sm:space-y-28">
            {sections.map((s, i) => (
              <div key={s.key ?? i} className="grid gap-8 lg:grid-cols-[minmax(0,18rem)_minmax(0,1fr)] lg:gap-16">
                <Reveal>
                  <h2 className="font-display text-xl uppercase text-ink-900 sm:text-2xl">
                    <span className="me-3 font-mono text-xs text-brand">{String(i + 1).padStart(2, '0')}</span>
                    {pick(s, 'title', locale)}
                  </h2>
                </Reveal>
                <Reveal delay={80}>
                  <Prose text={pick(s, 'body', locale)} className="max-w-2xl text-lg" />
                </Reveal>
              </div>
            ))}
          </div>
        </section>
      )}

      {stats.length > 0 && (
        <section className="bg-ink-900 py-20 text-white sm:py-28">
          <div className="shell">
            <Metrics
              tone="light"
              items={stats.map((s) => ({
                value: s.value,
                label: pick(s, 'label', locale),
                description: pick(s, 'description', locale),
              }))}
            />
          </div>
        </section>
      )}

      {testimonials.length > 0 && (
        <section className="bg-white py-24 sm:py-32">
          <div className="shell">
            <SectionHeading title={dict.nav.about} />
            <ul className="mt-12 grid gap-8 lg:grid-cols-2">
              {testimonials.map((t, i) => (
                <Reveal as="li" key={t.id} delay={i * 80} className="rounded-2xl border border-ink-900/10 bg-bone p-8">
                  <blockquote className="text-lg leading-relaxed text-ink-700">
                    “{pick(t, 'quote', locale)}”
                  </blockquote>
                  <footer className="mt-6 text-sm text-ink-400">
                    <span className="font-semibold text-ink-800">{t.name}</span>
                    {(t.role || t.company) && <span> · {[t.role, t.company].filter(Boolean).join(', ')}</span>}
                  </footer>
                </Reveal>
              ))}
            </ul>
          </div>
        </section>
      )}

      <RelatedContent items={related} title={dict.related.title} eyebrow={dict.nav.about} />

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
