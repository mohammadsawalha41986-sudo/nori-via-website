import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { CTASection } from '@/components/public/CTASection';
import { Prose } from '@/components/ui/Prose';
import { TextLink } from '@/components/ui/Button';
import { getDictionary } from '@/lib/dictionary';
import { isLocale, pick, formatDate, locales, type Locale } from '@/lib/i18n';
import { getInsightBySlug, getPublishedInsights, asStringList } from '@/lib/content';
import { buildMetadata, JsonLd, breadcrumbs } from '@/lib/seo';
import { env } from '@/lib/env';

export const revalidate = 60;

export async function generateStaticParams() {
  const insights = await getPublishedInsights();
  return locales.flatMap((locale) => insights.map((a) => ({ locale, slug: a.slug })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale: raw, slug } = await params;
  if (!isLocale(raw)) return {};
  const locale = raw as Locale;
  const article = await getInsightBySlug(slug);
  if (!article) return {};
  return buildMetadata({
    row: article,
    locale,
    path: `/insights/${slug}`,
    fallbackTitle: pick(article, 'title', locale),
    fallbackDescription: pick(article, 'excerpt', locale),
    type: 'article',
    publishedTime: article.publishedAt?.toISOString(),
  });
}

export default async function InsightPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale: raw, slug } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const dict = getDictionary(locale);

  const article = await getInsightBySlug(slug);
  if (!article) notFound();

  const title = pick(article, 'title', locale);
  const tags = asStringList(article.tags);

  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: title,
          description: pick(article, 'excerpt', locale),
          image: article.coverImage ? [article.coverImage] : undefined,
          datePublished: article.publishedAt?.toISOString(),
          dateModified: article.updatedAt.toISOString(),
          author: article.author ? { '@type': 'Person', name: article.author } : { '@type': 'Organization', name: 'Noriva' },
          publisher: { '@type': 'Organization', name: 'Noriva', url: env.siteUrl },
          mainEntityOfPage: `${env.siteUrl}/${locale}/insights/${slug}`,
        }}
      />
      <JsonLd
        data={breadcrumbs(locale, [
          { name: 'Noriva', path: '/' },
          { name: dict.nav.insights, path: '/insights' },
          { name: title, path: `/insights/${slug}` },
        ])}
      />

      <article>
        <header className="relative overflow-hidden bg-ink-900 pb-20 pt-[calc(var(--nav-h)+4.5rem)] text-white sm:pb-24 sm:pt-[calc(var(--nav-h)+6rem)]">
          <div aria-hidden className="absolute inset-0 bg-[radial-gradient(90%_80%_at_85%_0%,rgba(245,16,110,0.28),transparent_60%)]" />
          <div className="shell relative max-w-3xl">
            {article.category && (
              <p className="mb-5 text-[0.6875rem] font-bold uppercase tracking-[0.24em] text-brand-300">
                {pick(article.category, 'name', locale)}
              </p>
            )}
            <h1 className="font-display text-display-sm font-extrabold uppercase">{title}</h1>
            <p className="mt-6 text-sm text-white/50">
              {[
                article.author && `${dict.common.by} ${article.author}`,
                formatDate(article.publishedAt, locale),
              ]
                .filter(Boolean)
                .join(' · ')}
            </p>
          </div>
        </header>

        {article.coverImage && (
          <div className="bg-bone">
            <div className="shell -mt-10 sm:-mt-16">
              <div className="relative aspect-[16/9] overflow-hidden rounded-2xl bg-ink-100 shadow-2xl shadow-ink-900/15">
                <Image src={article.coverImage} alt={title} fill priority sizes="100vw" className="object-cover" />
              </div>
            </div>
          </div>
        )}

        <div className="bg-bone py-20 sm:py-28">
          <div className="shell max-w-3xl">
            {pick(article, 'excerpt', locale) && (
              <p className="mb-10 border-s-2 border-brand ps-6 text-xl leading-relaxed text-ink-700">
                {pick(article, 'excerpt', locale)}
              </p>
            )}

            <Prose text={pick(article, 'content', locale)} className="text-lg" />

            {tags.length > 0 && (
              <ul className="mt-12 flex flex-wrap gap-2 border-t border-ink-900/10 pt-8">
                {tags.map((t) => (
                  <li key={t} className="rounded-full bg-ink-900/[0.06] px-3.5 py-1.5 text-xs text-ink-500">
                    #{t}
                  </li>
                ))}
              </ul>
            )}

            <div className="mt-12">
              <TextLink href={`/${locale}/insights`}>{dict.nav.insights}</TextLink>
            </div>
          </div>
        </div>
      </article>

      <CTASection headline={dict.nav.start} label={dict.nav.start} href={`/${locale}/start-a-project`} />
    </>
  );
}
