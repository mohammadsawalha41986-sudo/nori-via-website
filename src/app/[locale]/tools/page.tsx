import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PageHero } from '@/components/public/PageHero';
import { sectionHero } from '@/lib/section-images';
import { CTASection } from '@/components/public/CTASection';
import { EmptyState } from '@/components/public/EmptyState';
import { Reveal } from '@/components/ui/Reveal';
import { getDictionary } from '@/lib/dictionary';
import { isLocale, pick, type Locale } from '@/lib/i18n';
import { getPage, getPublishedTools } from '@/lib/content';
import { parseToolConfig } from '@/lib/tool-engine';
import { buildMetadata, JsonLd, breadcrumbs } from '@/lib/seo';

export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: raw } = await params;
  if (!isLocale(raw)) return {};
  const locale = raw as Locale;
  const page = await getPage('tools');
  return buildMetadata({
    row: page,
    locale,
    path: '/tools',
    fallbackTitle: getDictionary(locale).tools.title,
    fallbackDescription: page ? pick(page, 'body', locale) : getDictionary(locale).tools.intro,
  });
}

export default async function ToolsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const dict = getDictionary(locale);

  const [tools, page] = await Promise.all([getPublishedTools(), getPage('tools')]);

  return (
    <>
      <JsonLd
        data={breadcrumbs(locale, [
          { name: dict.tools.title, path: '/tools' },
        ])}
      />

      <PageHero
        eyebrow={dict.tools.title}
        title={page ? pick(page, 'title', locale) || dict.tools.title : dict.tools.title}
        description={page ? pick(page, 'body', locale) || dict.tools.intro : dict.tools.intro}
        image={sectionHero('tools')}
      />

      <section className="bg-bone section-y">
        <div className="shell">
          {tools.length ? (
            <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {tools.map((tool, i) => {
                const config = parseToolConfig(tool.config);
                return (
                  <Reveal as="li" key={tool.id} delay={Math.min(i, 8) * 55} y={14} className="h-full">
                    <Link
                      href={`/${locale}/tools/${tool.slug}`}
                      className="group flex h-full flex-col rounded-card border border-ink-900/10 bg-white p-8 transition-colors duration-300 hover:border-brand"
                    >
                      <span className="font-mono text-xs text-brand">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span className="mt-4 font-display text-xl font-display-soft uppercase text-ink-900 transition-colors group-hover:text-brand">
                        {pick(tool, 'name', locale)}
                      </span>
                      {pick(tool, 'summary', locale) && (
                        <span className="mt-3 flex-1 text-sm leading-relaxed text-ink-400">
                          {pick(tool, 'summary', locale)}
                        </span>
                      )}
                      <span className="mt-6 text-xs font-semibold uppercase tracking-[0.16em] text-ink-300">
                        {config.outputs.length} {dict.tools.results}
                      </span>
                    </Link>
                  </Reveal>
                );
              })}
            </ul>
          ) : (
            <EmptyState
              title={dict.common.empty}
              body={dict.tools.empty}
              ctaHref={`/${locale}/library`}
              ctaLabel={dict.nav.library}
            />
          )}
        </div>
      </section>

      <CTASection headline={dict.nav.start} label={dict.nav.start} href={`/${locale}/start-a-project`} />
    </>
  );
}
