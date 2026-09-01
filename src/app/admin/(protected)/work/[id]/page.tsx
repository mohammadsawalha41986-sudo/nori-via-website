import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import { ProjectForm, DeleteProjectForm } from '@/components/admin/ProjectForm';
import { PageHeader, LinkButton, Card } from '@/components/admin/ui';
import { stringifyUrlList, stringifyMetrics } from '@/server/helpers';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = await prisma.project.findUnique({ where: { id }, select: { titleEn: true } });
  return { title: project?.titleEn ?? 'Project' };
}

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const [project, categories, services] = await Promise.all([
    prisma.project.findUnique({ where: { id }, include: { services: true, caseStudy: { select: { id: true } } } }),
    prisma.workCategory.findMany({ orderBy: { order: 'asc' }, select: { id: true, nameEn: true } }),
    prisma.service.findMany({ orderBy: { nameEn: 'asc' }, select: { id: true, nameEn: true } }),
  ]);

  if (!project) notFound();

  return (
    <>
      <PageHeader
        title={project.titleEn}
        description={`/work/${project.slug}`}
        action={
          <div className="flex gap-2">
            <LinkButton href={`/en/work/${project.slug}`} variant="secondary">Preview ↗</LinkButton>
            <LinkButton href="/admin/work" variant="secondary">Back</LinkButton>
          </div>
        }
      />

      <div className="mb-5 rounded-lg border border-slate-200 bg-white px-5 py-3 text-sm text-slate-600">
        {project.caseStudy ? (
          <>
            This project has a case study.{' '}
            <Link href={`/admin/case-studies/${project.caseStudy.id}`} className="font-medium text-slate-900 underline">
              Edit case study
            </Link>
          </>
        ) : (
          <>
            No case study yet.{' '}
            <Link href="/admin/case-studies/new" className="font-medium text-slate-900 underline">
              Add one
            </Link>{' '}
            to tell the full challenge → outcome story.
          </>
        )}
      </div>

      <ProjectForm
        categories={categories}
        services={services}
        values={{
          id: project.id,
          slug: project.slug,
          titleEn: project.titleEn, titleAr: project.titleAr,
          client: project.client,
          categoryId: project.categoryId ?? '',
          descriptionEn: project.descriptionEn, descriptionAr: project.descriptionAr,
          heroMediaUrl: project.heroMediaUrl ?? '',
          heroMediaKind: project.heroMediaKind,
          galleryRaw: stringifyUrlList(project.gallery),
          videosRaw: stringifyUrlList(project.videos, 'label'),
          downloadsRaw: stringifyUrlList(project.downloads, 'label'),
          resultsRaw: stringifyMetrics(project.results),
          year: project.year ? String(project.year) : '',
          location: project.location,
          featured: project.featured,
          status: project.status,
          order: project.order,
          serviceIds: project.services.map((s) => s.serviceId),
          seoTitleEn: project.seoTitleEn, seoTitleAr: project.seoTitleAr,
          seoDescriptionEn: project.seoDescriptionEn, seoDescriptionAr: project.seoDescriptionAr,
          ogImage: project.ogImage ?? '',
          noindex: project.noindex,
        }}
      />

      <Card title="Danger zone" className="mt-6 border-red-200">
        <p className="mb-4 text-sm text-slate-600">
          Deleting a project removes its public page. Any attached case study is kept but becomes unlinked.
        </p>
        <DeleteProjectForm id={project.id} name={project.titleEn} hasCaseStudy={Boolean(project.caseStudy)} />
      </Card>
    </>
  );
}
