import { prisma } from '@/lib/db';
import { ServiceForm } from '@/components/admin/ServiceForm';
import { PageHeader, LinkButton } from '@/components/admin/ui';
import { getRelationOptions } from '@/lib/relation-options';

export const metadata = { title: 'New service' };
export const dynamic = 'force-dynamic';

export default async function NewServicePage() {
  const [categories, count, relationOptions] = await Promise.all([
    prisma.serviceCategory.findMany({ orderBy: { order: 'asc' }, select: { id: true, nameEn: true } }),
    prisma.service.count(),
    getRelationOptions(),
  ]);

  return (
    <>
      <PageHeader title="New service" action={<LinkButton href="/admin/services" variant="secondary">Back</LinkButton>} />
      <ServiceForm
        relationOptions={relationOptions}
        selectedRelations={[]}
        categories={categories}
        values={{
          slug: '', nameEn: '', nameAr: '', categoryId: '',
          summaryEn: '', summaryAr: '',
          heroHeadlineEn: '', heroHeadlineAr: '', heroDescriptionEn: '', heroDescriptionAr: '',
          whatWeDoEn: '', whatWeDoAr: '', whyItMattersEn: '', whyItMattersAr: '', approachEn: '', approachAr: '',
          deliverablesRaw: '', benefitsRaw: '', processRaw: '', faqsRaw: '', galleryRaw: '',
          featuredImage: '', ogImage: '',
          seoTitleEn: '', seoTitleAr: '', seoDescriptionEn: '', seoDescriptionAr: '',
          noindex: false, status: 'DRAFT', order: count + 1,
        }}
      />
    </>
  );
}
