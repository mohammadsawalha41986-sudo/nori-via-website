import { notFound } from 'next/navigation';
import Link from 'next/link';
import { prisma } from '@/lib/db';
import { PageHeader } from '@/components/admin/ui';
import { ResourceForm, DeleteResourceForm } from '@/components/admin/ResourceForm';
import { getRelationOptions } from '@/lib/relation-options';
import { getOutgoingRefs, serialiseRef } from '@/lib/relations';
import { asObjectList } from '@/lib/content';
import { documentLabel, formatBytes } from '@/lib/storage';

export const metadata = { title: 'Edit resource' };
export const dynamic = 'force-dynamic';

type Bullet = { labelEn?: string; labelAr?: string };

const toLines = (value: unknown) =>
  asObjectList<Bullet>(value)
    .map((item) => [item.labelEn, item.labelAr].filter(Boolean).join(' | '))
    .filter(Boolean)
    .join('\n');

export default async function EditResourcePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const [resource, categories, relationOptions, refs] = await Promise.all([
    prisma.resource.findUnique({ where: { id } }),
    prisma.resourceCategory.findMany({ orderBy: { order: 'asc' }, select: { id: true, nameEn: true } }),
    getRelationOptions({ type: 'RESOURCE', id }),
    getOutgoingRefs('RESOURCE', id),
  ]);

  if (!resource) notFound();

  const tags = Array.isArray(resource.tags) ? (resource.tags as string[]).join(', ') : '';

  return (
    <>
      <PageHeader
        title={resource.titleEn}
        description={`/library/${resource.slug}`}
        action={
          <Link
            href={`/en/library/${resource.slug}${resource.status === 'PUBLISHED' ? '' : '?preview=1'}`}
            target="_blank"
            className="text-sm font-medium text-slate-600 hover:text-slate-900"
          >
            {resource.status === 'PUBLISHED' ? 'View on site ↗' : 'Preview draft ↗'}
          </Link>
        }
      />

      <ResourceForm
        categories={categories}
        relationOptions={relationOptions}
        selectedRelations={refs.map(serialiseRef)}
        values={{
          id: resource.id,
          slug: resource.slug,
          titleEn: resource.titleEn, titleAr: resource.titleAr,
          summaryEn: resource.summaryEn, summaryAr: resource.summaryAr,
          descriptionEn: resource.descriptionEn, descriptionAr: resource.descriptionAr,
          type: resource.type,
          categoryId: resource.categoryId ?? '',
          tags,
          externalUrl: resource.externalUrl,
          thumbnail: resource.thumbnail ?? '',
          includes: toLines(resource.includes),
          audience: toLines(resource.audience),
          featured: resource.featured,
          publishedAt: resource.publishedAt ? resource.publishedAt.toISOString().slice(0, 10) : '',
          status: resource.status,
          order: resource.order,
          seoTitleEn: resource.seoTitleEn, seoTitleAr: resource.seoTitleAr,
          seoDescriptionEn: resource.seoDescriptionEn, seoDescriptionAr: resource.seoDescriptionAr,
          ogImage: resource.ogImage ?? '', noindex: resource.noindex,
          fileName: resource.fileName,
          fileLabel: resource.fileKey ? `(${documentLabel(resource.fileMime)}, ${formatBytes(resource.fileSize)})` : '',
        }}
      />

      <div className="mt-8">
        <DeleteResourceForm id={resource.id} name={resource.titleEn} />
      </div>
    </>
  );
}
