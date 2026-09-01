import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import { InsightForm, DeleteInsightForm } from '@/components/admin/InsightForm';
import { PageHeader, LinkButton, Card } from '@/components/admin/ui';
import { asStringList } from '@/lib/content';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const a = await prisma.insight.findUnique({ where: { id }, select: { titleEn: true } });
  return { title: a?.titleEn ?? 'Article' };
}

export default async function EditInsightPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const [article, categories] = await Promise.all([
    prisma.insight.findUnique({ where: { id } }),
    prisma.insightCategory.findMany({ orderBy: { order: 'asc' }, select: { id: true, nameEn: true } }),
  ]);

  if (!article) notFound();

  return (
    <>
      <PageHeader
        title={article.titleEn}
        description={`/insights/${article.slug}`}
        action={
          <div className="flex gap-2">
            <LinkButton href={`/en/insights/${article.slug}`} variant="secondary">Preview ↗</LinkButton>
            <LinkButton href="/admin/insights" variant="secondary">Back</LinkButton>
          </div>
        }
      />

      <InsightForm
        categories={categories}
        values={{
          id: article.id,
          slug: article.slug,
          titleEn: article.titleEn, titleAr: article.titleAr,
          excerptEn: article.excerptEn, excerptAr: article.excerptAr,
          contentEn: article.contentEn, contentAr: article.contentAr,
          coverImage: article.coverImage ?? '',
          categoryId: article.categoryId ?? '',
          tags: asStringList(article.tags).join(', '),
          author: article.author,
          publishedAt: article.publishedAt ? article.publishedAt.toISOString().slice(0, 10) : '',
          status: article.status,
          seoTitleEn: article.seoTitleEn, seoTitleAr: article.seoTitleAr,
          seoDescriptionEn: article.seoDescriptionEn, seoDescriptionAr: article.seoDescriptionAr,
          ogImage: article.ogImage ?? '',
          noindex: article.noindex,
        }}
      />

      <Card title="Danger zone" className="mt-6 border-red-200">
        <DeleteInsightForm id={article.id} name={article.titleEn} />
      </Card>
    </>
  );
}
