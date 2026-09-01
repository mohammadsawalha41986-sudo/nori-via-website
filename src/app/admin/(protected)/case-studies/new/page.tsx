import { prisma } from '@/lib/db';
import { CaseStudyForm } from '@/components/admin/CaseStudyForm';
import { PageHeader, LinkButton } from '@/components/admin/ui';

export const metadata = { title: 'New case study' };
export const dynamic = 'force-dynamic';

export default async function NewCaseStudyPage() {
  const [projects, services, count] = await Promise.all([
    prisma.project.findMany({ where: { caseStudy: null }, orderBy: { titleEn: 'asc' }, select: { id: true, titleEn: true } }),
    prisma.service.findMany({ orderBy: { nameEn: 'asc' }, select: { id: true, nameEn: true } }),
    prisma.caseStudy.count(),
  ]);

  return (
    <>
      <PageHeader
        title="New case study"
        description="Only projects without an existing case study are listed."
        action={<LinkButton href="/admin/case-studies" variant="secondary">Back</LinkButton>}
      />
      <CaseStudyForm
        projects={projects}
        services={services}
        values={{
          slug: '', titleEn: '', titleAr: '', projectId: '',
          chapters: {},
          metricsRaw: '', galleryRaw: '', videosRaw: '', filesRaw: '',
          heroMediaUrl: '', serviceIds: [],
          seoTitleEn: '', seoTitleAr: '', seoDescriptionEn: '', seoDescriptionAr: '',
          ogImage: '', noindex: false, status: 'DRAFT', order: count + 1,
        }}
      />
    </>
  );
}
