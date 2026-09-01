import { prisma } from '@/lib/db';
import { PageHeader, Card, Field, Grid, inputClass, EmptyRow } from '@/components/admin/ui';
import { InlineForm } from '@/components/admin/InlineForm';
import { MediaField } from '@/components/admin/MediaField';
import { SubmitButton } from '@/components/admin/SubmitButton';
import { saveTestimonial, deleteTestimonial } from '@/server/actions';

export const metadata = { title: 'Testimonials' };
export const dynamic = 'force-dynamic';

type T = {
  id: string; name: string; company: string; role: string;
  quoteEn: string; quoteAr: string; imageUrl: string | null;
  rating: number | null; published: boolean; order: number;
};

function Fields({ t }: { t?: T }) {
  const k = t?.id ?? 'new';
  return (
    <>
      {t && <input type="hidden" name="id" value={t.id} />}
      <Grid cols={3}>
        <Field label="Name" htmlFor={`name-${k}`} required>
          <input id={`name-${k}`} name="name" defaultValue={t?.name ?? ''} required className={inputClass} />
        </Field>
        <Field label="Company" htmlFor={`company-${k}`}>
          <input id={`company-${k}`} name="company" defaultValue={t?.company ?? ''} className={inputClass} />
        </Field>
        <Field label="Role" htmlFor={`role-${k}`}>
          <input id={`role-${k}`} name="role" defaultValue={t?.role ?? ''} className={inputClass} />
        </Field>
      </Grid>

      <Grid>
        <Field label="Quote (EN)" htmlFor={`quoteEn-${k}`} required className="mt-4">
          <textarea id={`quoteEn-${k}`} name="quoteEn" rows={3} defaultValue={t?.quoteEn ?? ''} required className={inputClass} />
        </Field>
        <Field label="Quote (AR)" htmlFor={`quoteAr-${k}`} className="mt-4">
          <textarea id={`quoteAr-${k}`} name="quoteAr" rows={3} defaultValue={t?.quoteAr ?? ''} dir="rtl" className={inputClass} />
        </Field>
      </Grid>

      <Grid cols={3}>
        <div className="mt-4">
          <MediaField name="imageUrl" label="Photo" defaultValue={t?.imageUrl ?? ''} />
        </div>
        <Field label="Rating" htmlFor={`rating-${k}`} hint="Only if genuinely given." className="mt-4">
          <input id={`rating-${k}`} name="rating" type="number" min={1} max={5} defaultValue={t?.rating ?? ''} className={inputClass} />
        </Field>
        <div className="mt-4 flex items-end gap-4 pb-1">
          <Field label="Order" htmlFor={`order-${k}`} className="w-24">
            <input id={`order-${k}`} name="order" type="number" min={0} defaultValue={t?.order ?? 0} className={inputClass} />
          </Field>
          <label className="flex items-center gap-2 pb-2 text-sm text-slate-700">
            <input name="published" type="checkbox" defaultChecked={t?.published ?? false} className="h-4 w-4 rounded border-slate-300" />
            Published
          </label>
        </div>
      </Grid>
    </>
  );
}

export default async function TestimonialsPage() {
  const items = await prisma.testimonial.findMany({ orderBy: { order: 'asc' } });

  return (
    <>
      <PageHeader
        title="Testimonials"
        description="Only enter quotes a real client actually gave, with their permission to publish."
      />

      <Card title="Add a testimonial" className="mb-5">
        <InlineForm action={saveTestimonial} submitLabel="Add testimonial">
          <Fields />
        </InlineForm>
      </Card>

      <Card title="Existing testimonials">
        {items.length === 0 ? (
          <EmptyRow>No testimonials yet.</EmptyRow>
        ) : (
          <ul className="space-y-6">
            {items.map((t) => (
              <li key={t.id} className="border-b border-slate-100 pb-6 last:border-0 last:pb-0">
                <InlineForm
                  action={saveTestimonial}
                  after={
                    <form action={deleteTestimonial}>
                      <input type="hidden" name="id" value={t.id} />
                      <SubmitButton variant="danger" className="!px-2.5 !py-1 !text-xs" confirm={`Delete the testimonial from ${t.name}?`}>
                        Delete
                      </SubmitButton>
                    </form>
                  }
                >
                  <Fields t={t} />
                </InlineForm>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </>
  );
}
