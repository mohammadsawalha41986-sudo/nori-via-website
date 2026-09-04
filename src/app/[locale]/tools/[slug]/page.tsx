import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CTASection } from '@/components/public/CTASection';
import { PageHero } from '@/components/public/PageHero';
import { RelatedContent } from '@/components/public/RelatedContent';
import { ToolRunner } from '@/components/public/ToolRunner';
import { Prose } from '@/components/ui/Prose';
import { getDictionary } from '@/lib/dictionary';
import { isLocale, pick, type Locale } from '@/lib/i18n';
import { getToolBySlug } from '@/lib/content';
import { parseToolConfig } from '@/lib/tool-engine';
import { getRelatedContent } from '@/lib/relations';
import { getSessionUser } from '@/lib/auth';
import { buildMetadata, JsonLd, breadcrumbs } from '@/lib/seo';

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale: raw, slug } = await params;
  if (!isLocale(raw)) return {};
  const locale = raw as Locale;
  const tool = await getToolBySlug(slug);
  if (!tool) return {};
  return buildMetadata({
    row: tool,
    locale,
    path: `/tools/${slug}`,
    fallbackTitle: pick(tool, 'name', locale),
    fallbackDescription: pick(tool, 'summary', locale),
  });
}

export default async function ToolPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string; slug: string }>;
  searchParams: Promise<{ preview?: string }>;
}) {
  const { locale: raw, slug } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const dict = getDictionary(locale);

  const { preview } = await searchParams;
  const isPreview = preview === '1' && Boolean(await getSessionUser());

  const tool = await getToolBySlug(slug, isPreview);
  if (!tool) notFound();

  const config = parseToolConfig(tool.config);
  const related = await getRelatedContent('TOOL', tool.id, locale);
  const notes = locale === 'ar' ? config.notesAr || config.notesEn : config.notesEn || config.notesAr;

  return (
    <>
      <JsonLd
        data={breadcrumbs(locale, [
          { name: dict.tools.title, path: '/tools' },
          { name: pick(tool, 'name', locale), path: `/tools/${tool.slug}` },
        ])}
      />

      {isPreview && tool.status !== 'PUBLISHED' && (
        <p className="bg-amber-400 px-4 py-2 text-center text-sm font-semibold text-ink-900">{dict.draft.badge}</p>
      )}

      <PageHero
        eyebrow={dict.tools.title}
        title={pick(tool, 'name', locale)}
        description={pick(tool, 'summary', locale)}
      />

      {config.outputs.length > 0 ? (
        <section className="bg-bone section-y">
          <div className="shell">
            <ToolRunner slug={tool.slug} config={config} locale={locale} dict={dict} />
          </div>
        </section>
      ) : null}

      {(pick(tool, 'purpose', locale) || pick(tool, 'description', locale) || notes) && (
        <section className="bg-white section-y">
          <div className="shell max-w-3xl">
            {pick(tool, 'purpose', locale) && <Prose text={pick(tool, 'purpose', locale)} className="text-lg" />}
            {pick(tool, 'description', locale) && (
              <div className="mt-10">
                <Prose text={pick(tool, 'description', locale)} />
              </div>
            )}
            {notes && (
              <div className="mt-12 rounded-card border border-ink-900/10 bg-bone p-8">
                <h2 className="font-display text-lg uppercase text-ink-900">
                  {dict.tools.notes}
                </h2>
                <div className="mt-4">
                  <Prose text={notes} />
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      <RelatedContent items={related} title={dict.related.title} eyebrow={dict.tools.title} />

      <CTASection
        headline={dict.nav.start}
        label={dict.nav.start}
        href={`/${locale}/start-a-project`}
        secondaryLabel={dict.nav.tools}
        secondaryHref={`/${locale}/tools`}
      />
    </>
  );
}
