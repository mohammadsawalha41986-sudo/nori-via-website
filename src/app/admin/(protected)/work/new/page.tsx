import { prisma } from '@/lib/db';
import { ProjectForm } from '@/components/admin/ProjectForm';
import { PageHeader, LinkButton } from '@/components/admin/ui';
import { getRelationOptions } from '@/lib/relation-options';

export const metadata = { title: 'New project' };
export const dynamic = 'force-dynamic';

export default async function NewProjectPage() {
  const [categories, services, count, relationOptions] = await Promise.all([
    prisma.workCategory.findMany({ orderBy: { order: 'asc' }, select: { id: true, nameEn: true } }),
    prisma.service.findMany({ orderBy: { nameEn: 'asc' }, select: { id: true, nameEn: true } }),
    prisma.project.count(),
    getRelationOptions(),
  ]);

  return (
    <>
      <PageHeader title="New project" action={<LinkButton href="/admin/work" variant="secondary">Back</LinkButton>} />
      <ProjectForm
        relationOptions={relationOptions}
        selectedRelations={[]}
        categories={categories}
        services={services}
        values={{
          slug: '', titleEn: '', titleAr: '', client: '', categoryId: '',
          descriptionEn: '', descriptionAr: '',
          heroMediaUrl: '', heroMediaKind: 'IMAGE',
          galleryRaw: '', videosRaw: '', downloadsRaw: '', resultsRaw: '',
          year: String(new Date().getFullYear()), location: '',
          featured: false, status: 'DRAFT', order: count + 1, serviceIds: [],
          seoTitleEn: '', seoTitleAr: '', seoDescriptionEn: '', seoDescriptionAr: '',
          ogImage: '', noindex: false,
        }}
      />
    </>
  );
}
