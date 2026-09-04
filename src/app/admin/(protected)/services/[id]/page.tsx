import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import { ServiceForm, DeleteServiceForm } from '@/components/admin/ServiceForm';
import { PageHeader, LinkButton, Card } from '@/components/admin/ui';
import { stringifyPairs, stringifyBlocks, stringifyFaqs, stringifyUrlList } from '@/server/helpers';
import { getRelationOptions } from '@/lib/relation-options';
import { getOutgoingRefs, serialiseRef } from '@/lib/relations';
import { parseIntake } from '@/lib/intake';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const service = await prisma.service.findUnique({ where: { id }, select: { nameEn: true } });
  return { title: service?.nameEn ?? 'Service' };
}

export default async function EditServicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const [service, categories, relationOptions, refs] = await Promise.all([
    prisma.service.findUnique({ where: { id } }),
    prisma.serviceCategory.findMany({ orderBy: { order: 'asc' }, select: { id: true, nameEn: true } }),
    getRelationOptions({ type: 'SERVICE', id }),
    getOutgoingRefs('SERVICE', id),
  ]);

  if (!service) notFound();

  return (
    <>
      <PageHeader
        title={service.nameEn}
        description={`/services/${service.slug}`}
        action={
          <div className="flex gap-2">
            <LinkButton href={`/en/services/${service.slug}`} variant="secondary">Preview ↗</LinkButton>
            <LinkButton href="/admin/services" variant="secondary">Back</LinkButton>
          </div>
        }
      />

      <ServiceForm
        intake={parseIntake(service.intake)}
        relationOptions={relationOptions}
        selectedRelations={refs.map(serialiseRef)}
        categories={categories}
        values={{
          id: service.id,
          slug: service.slug,
          nameEn: service.nameEn, nameAr: service.nameAr,
          categoryId: service.categoryId ?? '',
          summaryEn: service.summaryEn, summaryAr: service.summaryAr,
          heroHeadlineEn: service.heroHeadlineEn, heroHeadlineAr: service.heroHeadlineAr,
          heroDescriptionEn: service.heroDescriptionEn, heroDescriptionAr: service.heroDescriptionAr,
          whatWeDoEn: service.whatWeDoEn, whatWeDoAr: service.whatWeDoAr,
          whyItMattersEn: service.whyItMattersEn, whyItMattersAr: service.whyItMattersAr,
          approachEn: service.approachEn, approachAr: service.approachAr,
          deliverablesRaw: stringifyPairs(service.deliverables),
          benefitsRaw: stringifyPairs(service.benefits),
          processRaw: stringifyBlocks(service.process),
          faqsRaw: stringifyFaqs(service.faqs),
          galleryRaw: stringifyUrlList(service.gallery),
          featuredImage: service.featuredImage ?? '',
          ogImage: service.ogImage ?? '',
          seoTitleEn: service.seoTitleEn, seoTitleAr: service.seoTitleAr,
          seoDescriptionEn: service.seoDescriptionEn, seoDescriptionAr: service.seoDescriptionAr,
          noindex: service.noindex,
          status: service.status,
          order: service.order,
        }}
      />

      <Card title="Danger zone" className="mt-6 border-red-200">
        <p className="mb-4 text-sm text-slate-600">
          Deleting a service removes its public page and unlinks it from any project or case study that references it.
          The projects themselves are not deleted.
        </p>
        <DeleteServiceForm id={service.id} name={service.nameEn} />
      </Card>
    </>
  );
}
