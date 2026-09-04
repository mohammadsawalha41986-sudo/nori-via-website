import { prisma } from '@/lib/db';
import { PageHeader } from '@/components/admin/ui';
import { ResourceForm } from '@/components/admin/ResourceForm';
import { getRelationOptions } from '@/lib/relation-options';

export const metadata = { title: 'New resource' };
export const dynamic = 'force-dynamic';

export default async function NewResourcePage() {
  const [categories, relationOptions] = await Promise.all([
    prisma.resourceCategory.findMany({ orderBy: { order: 'asc' }, select: { id: true, nameEn: true } }),
    getRelationOptions(),
  ]);

  return (
    <>
      <PageHeader title="New resource" description="Upload the file, describe it, then publish when it is ready." />
      <ResourceForm
        categories={categories}
        relationOptions={relationOptions}
        selectedRelations={[]}
        values={{
          slug: '',
          titleEn: '', titleAr: '',
          summaryEn: '', summaryAr: '',
          descriptionEn: '', descriptionAr: '',
          type: 'PDF',
          categoryId: '',
          tags: '',
          externalUrl: '',
          thumbnail: '',
          includes: '',
          audience: '',
          featured: false,
          publishedAt: '',
          status: 'DRAFT',
          order: 0,
          seoTitleEn: '', seoTitleAr: '',
          seoDescriptionEn: '', seoDescriptionAr: '',
          ogImage: '', noindex: false,
          fileName: '',
          fileLabel: '',
        }}
      />
    </>
  );
}
