import { prisma } from '@/lib/db';
import { PageHeader, Card, Field, Grid, inputClass, EmptyRow } from '@/components/admin/ui';
import { InlineForm } from '@/components/admin/InlineForm';
import { MediaField } from '@/components/admin/MediaField';
import { SubmitButton } from '@/components/admin/SubmitButton';
import { saveSystemStage, deleteSystemStage } from '@/server/actions';
import { asStringList } from '@/lib/content';

export const metadata = { title: 'Noriva System' };
export const dynamic = 'force-dynamic';

type Stage = {
  id: string; step: string; titleEn: string; titleAr: string;
  descriptionEn: string; descriptionAr: string; services: unknown;
  mediaUrl: string | null; order: number; visible: boolean;
};

function Fields({ s }: { s?: Stage }) {
  const k = s?.id ?? 'new';
  return (
    <>
      {s && <input type="hidden" name="id" value={s.id} />}
      <Grid cols={3}>
        <Field label="Step" htmlFor={`step-${k}`} required hint="e.g. 01">
          <input id={`step-${k}`} name="step" defaultValue={s?.step ?? ''} required maxLength={8} className={inputClass} />
        </Field>
        <Field label="Title (EN)" htmlFor={`titleEn-${k}`} required>
          <input id={`titleEn-${k}`} name="titleEn" defaultValue={s?.titleEn ?? ''} required className={inputClass} />
        </Field>
        <Field label="Title (AR)" htmlFor={`titleAr-${k}`}>
          <input id={`titleAr-${k}`} name="titleAr" defaultValue={s?.titleAr ?? ''} dir="rtl" className={inputClass} />
        </Field>
      </Grid>

      <Grid>
        <Field label="Description (EN)" htmlFor={`descEn-${k}`} className="mt-4">
          <textarea id={`descEn-${k}`} name="descriptionEn" rows={3} defaultValue={s?.descriptionEn ?? ''} className={inputClass} />
        </Field>
        <Field label="Description (AR)" htmlFor={`descAr-${k}`} className="mt-4">
          <textarea id={`descAr-${k}`} name="descriptionAr" rows={3} defaultValue={s?.descriptionAr ?? ''} dir="rtl" className={inputClass} />
        </Field>
      </Grid>

      <Grid cols={3}>
        <Field label="Service tags" htmlFor={`services-${k}`} hint="Comma separated." className="mt-4">
          <input id={`services-${k}`} name="services" defaultValue={asStringList(s?.services).join(', ')} className={inputClass} />
        </Field>
        <div className="mt-4">
          <MediaField name="mediaUrl" label="Stage visual" defaultValue={s?.mediaUrl ?? ''} />
        </div>
        <div className="mt-4 flex items-end gap-4 pb-1">
          <Field label="Order" htmlFor={`order-${k}`} className="w-24">
            <input id={`order-${k}`} name="order" type="number" min={0} defaultValue={s?.order ?? 0} className={inputClass} />
          </Field>
          <label className="flex items-center gap-2 pb-2 text-sm text-slate-700">
            <input name="visible" type="checkbox" defaultChecked={s?.visible ?? true} className="h-4 w-4 rounded border-slate-300" />
            Visible
          </label>
        </div>
      </Grid>
    </>
  );
}

export default async function SystemPage() {
  const stages = await prisma.systemStage.findMany({ orderBy: { order: 'asc' } });

  return (
    <>
      <PageHeader
        title="Noriva System"
        description="The four-stage story on the homepage: notice → remember → order → come back."
      />

      <Card title="Add a stage" className="mb-5">
        <InlineForm action={saveSystemStage} submitLabel="Add stage">
          <Fields />
        </InlineForm>
      </Card>

      <Card title="Stages">
        {stages.length === 0 ? (
          <EmptyRow>No stages yet.</EmptyRow>
        ) : (
          <ul className="space-y-6">
            {stages.map((s) => (
              <li key={s.id} className="border-b border-slate-100 pb-6 last:border-0 last:pb-0">
                <InlineForm
                  action={saveSystemStage}
                  after={
                    <form action={deleteSystemStage}>
                      <input type="hidden" name="id" value={s.id} />
                      <SubmitButton variant="danger" className="!px-2.5 !py-1 !text-xs" confirm={`Delete stage "${s.titleEn}"?`}>
                        Delete
                      </SubmitButton>
                    </form>
                  }
                >
                  <Fields s={s} />
                </InlineForm>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </>
  );
}
