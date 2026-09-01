import { prisma } from '@/lib/db';
import { PageHeader, Card, Field, Grid, inputClass, EmptyRow } from '@/components/admin/ui';
import { InlineForm } from '@/components/admin/InlineForm';
import { SubmitButton } from '@/components/admin/SubmitButton';
import { saveStatistic, deleteStatistic } from '@/server/actions';

export const metadata = { title: 'Statistics' };
export const dynamic = 'force-dynamic';

function StatFields({ s }: { s?: { id: string; value: string; labelEn: string; labelAr: string; descriptionEn: string; descriptionAr: string; visible: boolean; order: number } }) {
  return (
    <>
      {s && <input type="hidden" name="id" value={s.id} />}
      <Grid cols={3}>
        <Field label="Value" htmlFor={`value-${s?.id ?? 'new'}`} required>
          <input id={`value-${s?.id ?? 'new'}`} name="value" defaultValue={s?.value ?? ''} required placeholder="e.g. 12" className={inputClass} />
        </Field>
        <Field label="Label (EN)" htmlFor={`labelEn-${s?.id ?? 'new'}`} required>
          <input id={`labelEn-${s?.id ?? 'new'}`} name="labelEn" defaultValue={s?.labelEn ?? ''} required className={inputClass} />
        </Field>
        <Field label="Label (AR)" htmlFor={`labelAr-${s?.id ?? 'new'}`}>
          <input id={`labelAr-${s?.id ?? 'new'}`} name="labelAr" defaultValue={s?.labelAr ?? ''} dir="rtl" className={inputClass} />
        </Field>
        <Field label="Description (EN)" htmlFor={`descEn-${s?.id ?? 'new'}`}>
          <input id={`descEn-${s?.id ?? 'new'}`} name="descriptionEn" defaultValue={s?.descriptionEn ?? ''} className={inputClass} />
        </Field>
        <Field label="Description (AR)" htmlFor={`descAr-${s?.id ?? 'new'}`}>
          <input id={`descAr-${s?.id ?? 'new'}`} name="descriptionAr" defaultValue={s?.descriptionAr ?? ''} dir="rtl" className={inputClass} />
        </Field>
        <div className="flex items-end gap-4 pb-1">
          <Field label="Order" htmlFor={`order-${s?.id ?? 'new'}`} className="w-24">
            <input id={`order-${s?.id ?? 'new'}`} name="order" type="number" min={0} defaultValue={s?.order ?? 0} className={inputClass} />
          </Field>
          <label className="flex items-center gap-2 pb-2 text-sm text-slate-700">
            <input name="visible" type="checkbox" defaultChecked={s?.visible ?? false} className="h-4 w-4 rounded border-slate-300" />
            Show on site
          </label>
        </div>
      </Grid>
    </>
  );
}

export default async function StatisticsPage() {
  const stats = await prisma.statistic.findMany({ orderBy: { order: 'asc' } });

  return (
    <>
      <PageHeader
        title="Statistics"
        description="Only publish numbers you can evidence. Nothing here should ever be estimated or invented."
      />

      <div className="mb-5 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
        A statistic is only shown on the public site once you tick <strong>Show on site</strong>.
      </div>

      <Card title="Add a statistic" className="mb-5">
        <InlineForm action={saveStatistic} submitLabel="Add statistic">
          <StatFields />
        </InlineForm>
      </Card>

      <Card title="Existing statistics">
        {stats.length === 0 ? (
          <EmptyRow>No statistics yet.</EmptyRow>
        ) : (
          <ul className="space-y-6">
            {stats.map((s) => (
              <li key={s.id} className="border-b border-slate-100 pb-6 last:border-0 last:pb-0">
                <InlineForm
                  action={saveStatistic}
                  after={
                    <form action={deleteStatistic}>
                      <input type="hidden" name="id" value={s.id} />
                      <SubmitButton variant="danger" className="!px-2.5 !py-1 !text-xs" confirm={`Delete the "${s.labelEn}" statistic?`}>
                        Delete
                      </SubmitButton>
                    </form>
                  }
                >
                  <StatFields s={s} />
                </InlineForm>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </>
  );
}
