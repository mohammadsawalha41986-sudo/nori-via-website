import { prisma } from '@/lib/db';
import { InsightForm } from '@/components/admin/InsightForm';
import { PageHeader, LinkButton } from '@/components/admin/ui';
import { getRelationOptions } from '@/lib/relation-options';

export const metadata = { title: 'New article' };
export const dynamic = 'force-dynamic';

export default async function NewInsightPage() {
  const [categories, relationOptions] = await Promise.all([
    prisma.insightCategory.findMany({ orderBy: { order: 'asc' }, select: { id: true, nameEn: true } }),
    getRelationOptions(),
  ]);

  return (
    <>
      <PageHeader title="New article" action={<LinkButton href="/admin/insights" variant="secondary">Back</LinkButton>} />
      <InsightForm
        categories={categories}
        relationOptions={relationOptions}
        selectedRelations={[]}
        values={{
          slug: '', titleEn: '', titleAr: '', excerptEn: '', excerptAr: '',
          contentEn: '', contentAr: '', coverImage: '', categoryId: '',
          tags: '', author: '', publishedAt: '', status: 'DRAFT',
          seoTitleEn: '', seoTitleAr: '', seoDescriptionEn: '', seoDescriptionAr: '',
          ogImage: '', noindex: false,
        }}
      />
    </>
  );
}
