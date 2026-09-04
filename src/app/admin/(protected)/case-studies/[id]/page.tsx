import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import { CaseStudyForm, DeleteCaseStudyForm } from '@/components/admin/CaseStudyForm';
import { PageHeader, LinkButton, Card } from '@/components/admin/ui';
import { stringifyMetrics, stringifyUrlList } from '@/server/helpers';
import { getRelationOptions } from '@/lib/relation-options';
import { getOutgoingRefs, serialiseRef } from '@/lib/relations';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const cs = await prisma.caseStudy.findUnique({ where: { id }, select: { titleEn: true } });
  return { title: cs?.titleEn ?? 'Case study' };
}

export default async function EditCaseStudyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const [cs, projects, services, relationOptions, refs] = await Promise.all([
    prisma.caseStudy.findUnique({ where: { id }, include: { services: true, project: { select: { slug: true } } } }),
    prisma.project.findMany({ orderBy: { titleEn: 'asc' }, select: { id: true, titleEn: true } }),
    prisma.service.findMany({ orderBy: { nameEn: 'asc' }, select: { id: true, nameEn: true } }),
    getRelationOptions({ type: 'CASE_STUDY', id }),
    getOutgoingRefs('CASE_STUDY', id),
  ]);

  if (!cs) notFound();

  const chapters: Record<string, string> = {};
  for (const key of ['challenge', 'strategy', 'idea', 'creative', 'campaign', 'result', 'outcome']) {
    chapters[`${key}En`] = (cs as unknown as Record<string, string>)[`${key}En`] ?? '';
    chapters[`${key}Ar`] = (cs as unknown as Record<string, string>)[`${key}Ar`] ?? '';
  }

  return (
    <>
      <PageHeader
        title={cs.titleEn}
        action={
          <div className="flex gap-2">
            {cs.project && <LinkButton href={`/en/work/${cs.project.slug}`} variant="secondary">Preview ↗</LinkButton>}
            <LinkButton href="/admin/case-studies" variant="secondary">Back</LinkButton>
          </div>
        }
      />

      <CaseStudyForm
        relationOptions={relationOptions}
        selectedRelations={refs.map(serialiseRef)}
        projects={projects}
        services={services}
        values={{
          id: cs.id,
          slug: cs.slug,
          titleEn: cs.titleEn, titleAr: cs.titleAr,
          projectId: cs.projectId ?? '',
          chapters,
          metricsRaw: stringifyMetrics(cs.metrics),
          galleryRaw: stringifyUrlList(cs.gallery),
          videosRaw: stringifyUrlList(cs.videos, 'label'),
          filesRaw: stringifyUrlList(cs.files, 'label'),
          heroMediaUrl: cs.heroMediaUrl ?? '',
          serviceIds: cs.services.map((s) => s.serviceId),
          seoTitleEn: cs.seoTitleEn, seoTitleAr: cs.seoTitleAr,
          seoDescriptionEn: cs.seoDescriptionEn, seoDescriptionAr: cs.seoDescriptionAr,
          ogImage: cs.ogImage ?? '',
          noindex: cs.noindex,
          status: cs.status,
          order: cs.order,
        }}
      />

      <Card title="Danger zone" className="mt-6 border-red-200">
        <DeleteCaseStudyForm id={cs.id} name={cs.titleEn} />
      </Card>
    </>
  );
}
