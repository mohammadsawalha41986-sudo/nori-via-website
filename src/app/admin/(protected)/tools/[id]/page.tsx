import { notFound } from 'next/navigation';
import Link from 'next/link';
import { prisma } from '@/lib/db';
import { PageHeader } from '@/components/admin/ui';
import { ToolForm, DeleteToolForm } from '@/components/admin/ToolForm';
import { getRelationOptions } from '@/lib/relation-options';
import { getOutgoingRefs, serialiseRef } from '@/lib/relations';
import { parseToolConfig } from '@/lib/tool-engine';

export const metadata = { title: 'Edit tool' };
export const dynamic = 'force-dynamic';

export default async function EditToolPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const [tool, relationOptions, refs] = await Promise.all([
    prisma.tool.findUnique({ where: { id } }),
    getRelationOptions({ type: 'TOOL', id }),
    getOutgoingRefs('TOOL', id),
  ]);

  if (!tool) notFound();

  return (
    <>
      <PageHeader
        title={tool.nameEn}
        description={`/tools/${tool.slug}`}
        action={
          <Link
            href={`/en/tools/${tool.slug}${tool.status === 'PUBLISHED' ? '' : '?preview=1'}`}
            target="_blank"
            className="text-sm font-medium text-slate-600 hover:text-slate-900"
          >
            {tool.status === 'PUBLISHED' ? 'View on site ↗' : 'Preview draft ↗'}
          </Link>
        }
      />

      <ToolForm
        config={parseToolConfig(tool.config)}
        relationOptions={relationOptions}
        selectedRelations={refs.map(serialiseRef)}
        values={{
          id: tool.id,
          slug: tool.slug,
          nameEn: tool.nameEn, nameAr: tool.nameAr,
          summaryEn: tool.summaryEn, summaryAr: tool.summaryAr,
          descriptionEn: tool.descriptionEn, descriptionAr: tool.descriptionAr,
          purposeEn: tool.purposeEn, purposeAr: tool.purposeAr,
          thumbnail: tool.thumbnail ?? '',
          featured: tool.featured,
          status: tool.status,
          order: tool.order,
          seoTitleEn: tool.seoTitleEn, seoTitleAr: tool.seoTitleAr,
          seoDescriptionEn: tool.seoDescriptionEn, seoDescriptionAr: tool.seoDescriptionAr,
          ogImage: tool.ogImage ?? '', noindex: tool.noindex,
        }}
      />

      <div className="mt-8">
        <DeleteToolForm id={tool.id} name={tool.nameEn} />
      </div>
    </>
  );
}
