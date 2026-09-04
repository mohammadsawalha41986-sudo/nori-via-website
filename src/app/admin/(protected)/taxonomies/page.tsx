import { prisma } from '@/lib/db';
import { PageHeader, Card, Field, Grid, inputClass, EmptyRow } from '@/components/admin/ui';
import { InlineForm } from '@/components/admin/InlineForm';
import { SubmitButton } from '@/components/admin/SubmitButton';
import { saveTaxonomy, deleteTaxonomy } from '@/server/actions';

export const metadata = { title: 'Categories' };
export const dynamic = 'force-dynamic';

type Row = {
  id: string; slug: string; nameEn: string; nameAr: string;
  descriptionEn?: string; descriptionAr?: string; order: number; visible: boolean;
};

function Fields({ kind, row, withDescription }: { kind: string; row?: Row; withDescription?: boolean }) {
  const k = row?.id ?? `new-${kind}`;
  return (
    <>
      <input type="hidden" name="kind" value={kind} />
      {row && <input type="hidden" name="id" value={row.id} />}

      <Grid cols={3}>
        <Field label="Name (EN)" htmlFor={`nameEn-${k}`} required>
          <input id={`nameEn-${k}`} name="nameEn" defaultValue={row?.nameEn ?? ''} required className={inputClass} />
        </Field>
        <Field label="Name (AR)" htmlFor={`nameAr-${k}`}>
          <input id={`nameAr-${k}`} name="nameAr" defaultValue={row?.nameAr ?? ''} dir="rtl" className={inputClass} />
        </Field>
        <Field label="Slug" htmlFor={`slug-${k}`} required>
          <input id={`slug-${k}`} name="slug" defaultValue={row?.slug ?? ''} required dir="ltr" className={inputClass} />
        </Field>
      </Grid>

      {withDescription && (
        <Grid>
          <Field label="Description (EN)" htmlFor={`descEn-${k}`} className="mt-4">
            <input id={`descEn-${k}`} name="descriptionEn" defaultValue={row?.descriptionEn ?? ''} className={inputClass} />
          </Field>
          <Field label="Description (AR)" htmlFor={`descAr-${k}`} className="mt-4">
            <input id={`descAr-${k}`} name="descriptionAr" defaultValue={row?.descriptionAr ?? ''} dir="rtl" className={inputClass} />
          </Field>
        </Grid>
      )}

      <div className="mt-4 flex items-end gap-4">
        <Field label="Order" htmlFor={`order-${k}`} className="w-24">
          <input id={`order-${k}`} name="order" type="number" min={0} defaultValue={row?.order ?? 0} className={inputClass} />
        </Field>
        <label className="flex items-center gap-2 pb-2 text-sm text-slate-700">
          <input name="visible" type="checkbox" defaultChecked={row?.visible ?? true} className="h-4 w-4 rounded border-slate-300" />
          Visible
        </label>
      </div>
    </>
  );
}

function Section({
  kind,
  title,
  description,
  rows,
  withDescription,
}: {
  kind: string;
  title: string;
  description: string;
  rows: Row[];
  withDescription?: boolean;
}) {
  return (
    <Card title={title} description={description} className="mb-5">
      <div className="mb-6 rounded-md border border-slate-200 bg-slate-50 p-4">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Add new</p>
        <InlineForm action={saveTaxonomy} submitLabel="Add category">
          <Fields kind={kind} withDescription={withDescription} />
        </InlineForm>
      </div>

      {rows.length === 0 ? (
        <EmptyRow>No categories yet.</EmptyRow>
      ) : (
        <ul className="space-y-6">
          {rows.map((r) => (
            <li key={r.id} className="border-b border-slate-100 pb-6 last:border-0 last:pb-0">
              <InlineForm
                action={saveTaxonomy}
                after={
                  <form action={deleteTaxonomy}>
                    <input type="hidden" name="kind" value={kind} />
                    <input type="hidden" name="id" value={r.id} />
                    <SubmitButton
                      variant="danger"
                      className="!px-2.5 !py-1 !text-xs"
                      confirm={`Delete "${r.nameEn}"? Content in this category is kept but becomes uncategorised.`}
                    >
                      Delete
                    </SubmitButton>
                  </form>
                }
              >
                <Fields kind={kind} row={r} withDescription={withDescription} />
              </InlineForm>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}

export default async function TaxonomiesPage() {
  const [serviceCats, workCats, insightCats, resourceCats] = await Promise.all([
    prisma.serviceCategory.findMany({ orderBy: { order: 'asc' } }),
    prisma.workCategory.findMany({ orderBy: { order: 'asc' } }),
    prisma.insightCategory.findMany({ orderBy: { order: 'asc' } }),
    prisma.resourceCategory.findMany({ orderBy: { order: 'asc' } }),
  ]);

  return (
    <>
      <PageHeader
        title="Categories"
        description="Grouping for services, portfolio work, insights and library resources. Deleting a category never deletes its content."
      />

      <Section
        kind="service"
        title="Service categories"
        description="The five practice groups shown on the services page."
        rows={serviceCats}
        withDescription
      />
      <Section
        kind="work"
        title="Work categories"
        description="The filter buttons on the Work page."
        rows={workCats}
      />
      <Section
        kind="insight"
        title="Insight categories"
        description="Article topics."
        rows={insightCats}
      />
      <Section
        kind="resource"
        title="Library categories"
        description="Grouping for downloadable resources in the Library."
        rows={resourceCats}
        withDescription
      />
    </>
  );
}
