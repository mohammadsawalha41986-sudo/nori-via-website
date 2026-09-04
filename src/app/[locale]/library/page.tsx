import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import type { Prisma, ResourceType } from '@prisma/client';
import { PageHero } from '@/components/public/PageHero';
import { CTASection } from '@/components/public/CTASection';
import { EmptyState } from '@/components/public/EmptyState';
import { LibraryFilters } from '@/components/public/LibraryFilters';
import { ResourceCard } from '@/components/public/ResourceCard';
import { getDictionary } from '@/lib/dictionary';
import { isLocale, pick, type Locale } from '@/lib/i18n';
import { getPage, getResourceCategories } from '@/lib/content';
import { prisma } from '@/lib/db';
import { buildMetadata, JsonLd, breadcrumbs } from '@/lib/seo';

/**
 * Filtering, searching and sorting all happen in the database and are driven
 * by the URL, so the Library scales to hundreds of resources and every view is
 * a shareable link.
 */
export const dynamic = 'force-dynamic';

const RESOURCE_TYPES: ResourceType[] = ['EXCEL', 'WORD', 'PDF', 'TEMPLATE', 'GUIDE', 'REPORT'];
const PAGE_SIZE = 24;

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

const single = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] ?? '' : value ?? '');

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: raw } = await params;
  if (!isLocale(raw)) return {};
  const locale = raw as Locale;
  const page = await getPage('library');
  return buildMetadata({
    row: page,
    locale,
    path: '/library',
    fallbackTitle: getDictionary(locale).library.title,
    fallbackDescription: page ? pick(page, 'body', locale) : getDictionary(locale).library.intro,
  });
}

export default async function LibraryPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: SearchParams;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const dict = getDictionary(locale);

  const query = await searchParams;
  const q = single(query.q).trim().slice(0, 120);
  const typeParam = single(query.type).toUpperCase();
  const type = (RESOURCE_TYPES as string[]).includes(typeParam) ? (typeParam as ResourceType) : '';
  const categorySlug = single(query.category);
  const sort = single(query.sort) || 'newest';
  const page = Math.max(1, Number(single(query.page)) || 1);

  const [categories, pageContent] = await Promise.all([getResourceCategories(), getPage('library')]);
  const category = categories.find((c) => c.slug === categorySlug);

  const where: Prisma.ResourceWhereInput = {
    status: 'PUBLISHED',
    ...(type ? { type } : {}),
    ...(category ? { categoryId: category.id } : {}),
    ...(q
      ? {
          OR: [
            { titleEn: { contains: q, mode: 'insensitive' } },
            { titleAr: { contains: q, mode: 'insensitive' } },
            { summaryEn: { contains: q, mode: 'insensitive' } },
            { summaryAr: { contains: q, mode: 'insensitive' } },
          ],
        }
      : {}),
  };

  const orderBy: Prisma.ResourceOrderByWithRelationInput[] =
    sort === 'popular'
      ? [{ downloadCount: 'desc' }, { publishedAt: 'desc' }]
      : sort === 'az'
        ? [{ titleEn: 'asc' }]
        : [{ featured: 'desc' }, { publishedAt: 'desc' }, { createdAt: 'desc' }];

  const [resources, total] = await Promise.all([
    prisma.resource.findMany({
      where,
      orderBy,
      include: { category: true },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.resource.count({ where }),
  ]);

  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const buildPageHref = (target: number) => {
    const params = new URLSearchParams();
    if (q) params.set('q', q);
    if (type) params.set('type', type);
    if (categorySlug) params.set('category', categorySlug);
    if (sort !== 'newest') params.set('sort', sort);
    if (target > 1) params.set('page', String(target));
    const search = params.toString();
    return `/${locale}/library${search ? `?${search}` : ''}`;
  };

  return (
    <>
      <JsonLd
        data={breadcrumbs(locale, [
          { name: dict.nav.work, path: '/' },
          { name: dict.library.title, path: '/library' },
        ])}
      />

      <PageHero
        eyebrow={dict.library.title}
        title={pageContent ? pick(pageContent, 'title', locale) || dict.library.title : dict.library.title}
        description={pageContent ? pick(pageContent, 'body', locale) || dict.library.intro : dict.library.intro}
      />

      <section className="bg-bone section-y">
        <div className="shell">
          <LibraryFilters
            dict={dict}
            types={RESOURCE_TYPES.map((t) => ({ value: t, label: dict.library.types[t] }))}
            categories={categories.map((c) => ({ value: c.slug, label: pick(c, 'name', locale) }))}
            activeType={type}
            activeCategory={category?.slug ?? ''}
            activeSort={sort}
            query={q}
          />

          <p className="mt-8 text-sm text-ink-400" role="status" aria-live="polite">
            {total} {dict.library.results}
          </p>

          {resources.length ? (
            <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {resources.map((r, i) => (
                <ResourceCard
                  key={r.id}
                  locale={locale}
                  dict={dict}
                  index={i}
                  resource={{
                    id: r.id,
                    slug: r.slug,
                    title: pick(r, 'title', locale),
                    summary: pick(r, 'summary', locale),
                    type: r.type,
                    category: r.category ? pick(r.category, 'name', locale) : '',
                    thumbnail: r.thumbnail,
                    fileMime: r.fileMime,
                    fileSize: r.fileSize,
                    external: !r.fileKey && Boolean(r.externalUrl),
                  }}
                />
              ))}
            </ul>
          ) : (
            <div className="mt-10">
              <EmptyState title={dict.common.empty} body={dict.library.noResults} />
            </div>
          )}

          {pages > 1 && (
            <nav className="mt-14 flex flex-wrap items-center justify-center gap-2" aria-label={dict.library.title}>
              {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
                <a
                  key={n}
                  href={buildPageHref(n)}
                  aria-current={n === page ? 'page' : undefined}
                  className={
                    n === page
                      ? 'rounded-btn bg-ink-900 px-4 py-2 text-sm font-semibold text-white'
                      : 'rounded-btn border border-ink-900/15 px-4 py-2 text-sm font-medium text-ink-500 transition-colors hover:border-ink-900'
                  }
                >
                  {n}
                </a>
              ))}
            </nav>
          )}
        </div>
      </section>

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
