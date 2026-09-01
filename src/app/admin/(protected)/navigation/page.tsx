import { prisma } from '@/lib/db';
import { PageHeader, Card, Field, Grid, inputClass, EmptyRow } from '@/components/admin/ui';
import { InlineForm } from '@/components/admin/InlineForm';
import { SubmitButton } from '@/components/admin/SubmitButton';
import { saveNavigationItem, deleteNavigationItem } from '@/server/actions';

export const metadata = { title: 'Navigation' };
export const dynamic = 'force-dynamic';

type N = { id: string; labelEn: string; labelAr: string; href: string; location: string; order: number; visible: boolean; external: boolean };

function Fields({ n, location }: { n?: N; location?: string }) {
  const k = n?.id ?? `new-${location}`;
  return (
    <>
      {n && <input type="hidden" name="id" value={n.id} />}
      <Grid cols={3}>
        <Field label="Label (EN)" htmlFor={`labelEn-${k}`} required>
          <input id={`labelEn-${k}`} name="labelEn" defaultValue={n?.labelEn ?? ''} required className={inputClass} />
        </Field>
        <Field label="Label (AR)" htmlFor={`labelAr-${k}`}>
          <input id={`labelAr-${k}`} name="labelAr" defaultValue={n?.labelAr ?? ''} dir="rtl" className={inputClass} />
        </Field>
        <Field label="Link" htmlFor={`href-${k}`} required hint="Internal links start with / and are locale-prefixed automatically.">
          <input id={`href-${k}`} name="href" defaultValue={n?.href ?? '/'} required dir="ltr" className={inputClass} />
        </Field>
      </Grid>

      <Grid cols={3}>
        <Field label="Location" htmlFor={`location-${k}`} className="mt-4">
          <select id={`location-${k}`} name="location" defaultValue={n?.location ?? location ?? 'header'} className={inputClass}>
            <option value="header">Header</option>
            <option value="footer">Footer</option>
          </select>
        </Field>
        <Field label="Order" htmlFor={`order-${k}`} className="mt-4">
          <input id={`order-${k}`} name="order" type="number" min={0} defaultValue={n?.order ?? 0} className={inputClass} />
        </Field>
        <div className="mt-9 space-y-1.5">
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input name="visible" type="checkbox" defaultChecked={n?.visible ?? true} className="h-4 w-4 rounded border-slate-300" />
            Visible
          </label>
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input name="external" type="checkbox" defaultChecked={n?.external ?? false} className="h-4 w-4 rounded border-slate-300" />
            External link
          </label>
        </div>
      </Grid>
    </>
  );
}

export default async function NavigationPage() {
  const items = await prisma.navigationItem.findMany({ orderBy: [{ location: 'asc' }, { order: 'asc' }] });

  return (
    <>
      <PageHeader
        title="Navigation"
        description="Header and footer links. The Start a Project button is always shown and is not part of this list."
      />

      <Card title="Add a link" className="mb-5">
        <InlineForm action={saveNavigationItem} submitLabel="Add link">
          <Fields location="header" />
        </InlineForm>
      </Card>

      {(['header', 'footer'] as const).map((location) => {
        const rows = items.filter((i) => i.location === location);
        return (
          <Card key={location} title={location === 'header' ? 'Header links' : 'Footer links'} className="mb-5">
            {rows.length === 0 ? (
              <EmptyRow>No {location} links yet.</EmptyRow>
            ) : (
              <ul className="space-y-6">
                {rows.map((n) => (
                  <li key={n.id} className="border-b border-slate-100 pb-6 last:border-0 last:pb-0">
                    <InlineForm
                      action={saveNavigationItem}
                      after={
                        <form action={deleteNavigationItem}>
                          <input type="hidden" name="id" value={n.id} />
                          <SubmitButton variant="danger" className="!px-2.5 !py-1 !text-xs" confirm={`Remove "${n.labelEn}" from the ${location}?`}>
                            Delete
                          </SubmitButton>
                        </form>
                      }
                    >
                      <Fields n={n} />
                    </InlineForm>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        );
      })}
    </>
  );
}
