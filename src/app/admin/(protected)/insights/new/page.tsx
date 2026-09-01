import { prisma } from '@/lib/db';
import { InsightForm } from '@/components/admin/InsightForm';
import { PageHeader, LinkButton } from '@/components/admin/ui';

export const metadata = { title: 'New article' };
export const dynamic = 'force-dynamic';

export default async function NewInsightPage() {
  const categories = await prisma.insightCategory.findMany({ orderBy: { order: 'asc' }, select: { id: true, nameEn: true } });

  return (
    <>
      <PageHeader title="New article" action={<LinkButton href="/admin/insights" variant="secondary">Back</LinkButton>} />
      <InsightForm
        categories={categories}
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
