import { PageHeader } from '@/components/admin/ui';
import { ToolForm } from '@/components/admin/ToolForm';
import { getRelationOptions } from '@/lib/relation-options';
import { EMPTY_TOOL_CONFIG } from '@/lib/tool-engine';

export const metadata = { title: 'New tool' };
export const dynamic = 'force-dynamic';

export default async function NewToolPage() {
  const relationOptions = await getRelationOptions();

  return (
    <>
      <PageHeader title="New tool" description="Add the inputs, write the formulas, then publish when the results check out." />
      <ToolForm
        config={EMPTY_TOOL_CONFIG}
        relationOptions={relationOptions}
        selectedRelations={[]}
        values={{
          slug: '',
          nameEn: '', nameAr: '',
          summaryEn: '', summaryAr: '',
          descriptionEn: '', descriptionAr: '',
          purposeEn: '', purposeAr: '',
          thumbnail: '',
          featured: false,
          status: 'DRAFT',
          order: 0,
          seoTitleEn: '', seoTitleAr: '',
          seoDescriptionEn: '', seoDescriptionAr: '',
          ogImage: '', noindex: false,
        }}
      />
    </>
  );
}
