import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import { savePage } from '@/server/actions';
import { AdminForm } from '@/components/admin/AdminForm';
import { MediaField } from '@/components/admin/MediaField';
import { PageHeader, Card, Field, Grid, inputClass, LinkButton } from '@/components/admin/ui';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ key: string }> }) {
  const { key } = await params;
  return { title: `Page — ${key}` };
}

export default async function EditPage({ params }: { params: Promise<{ key: string }> }) {
  const { key } = await params;
  const page = await prisma.page.findUnique({ where: { key } });
  if (!page) notFound();

  const hasSections = page.content && typeof page.content === 'object' && Object.keys(page.content).length > 0;

  return (
    <>
      <PageHeader
        title={page.titleEn || key}
        description={`/${key}`}
        action={
          <div className="flex gap-2">
            <LinkButton href={`/en/${key === 'home' ? '' : key}`} variant="secondary">Preview ↗</LinkButton>
            <LinkButton href="/admin/pages" variant="secondary">Back</LinkButton>
          </div>
        }
      />

      <AdminForm action={savePage} className="space-y-5">
        {(state) => (
          <>
            <input type="hidden" name="key" value={page.key} />

            <Card title="Headline and intro" description="Use a line break in the title to control where the headline wraps.">
              <Grid>
                <Field label="Title (EN)" htmlFor="titleEn">
                  <textarea id="titleEn" name="titleEn" rows={3} defaultValue={page.titleEn} className={inputClass} />
                </Field>
                <Field label="Title (AR)" htmlFor="titleAr">
                  <textarea id="titleAr" name="titleAr" rows={3} defaultValue={page.titleAr} dir="rtl" className={inputClass} />
                </Field>
                <Field label="Body (EN)" htmlFor="bodyEn" hint="Leave a blank line between paragraphs.">
                  <textarea id="bodyEn" name="bodyEn" rows={10} defaultValue={page.bodyEn} className={inputClass} />
                </Field>
                <Field label="Body (AR)" htmlFor="bodyAr">
                  <textarea id="bodyAr" name="bodyAr" rows={10} defaultValue={page.bodyAr} dir="rtl" className={inputClass} />
                </Field>
              </Grid>
            </Card>

            {hasSections && (
              <Card
                title="Section content"
                description="Structured sections for this page, edited as JSON. Keep the existing shape — each entry needs its English and Arabic fields."
              >
                <Field label="Sections" htmlFor="contentJson" hint={state.fieldErrors?.contentJson ?? 'Must be valid JSON.'}>
                  <textarea
                    id="contentJson"
                    name="contentJson"
                    rows={22}
                    defaultValue={JSON.stringify(page.content, null, 2)}
                    spellCheck={false}
                    dir="ltr"
                    className={`${inputClass} font-mono text-xs`}
                  />
                </Field>
              </Card>
            )}
            {!hasSections && <input type="hidden" name="contentJson" value="{}" />}

            <Card title="SEO">
              <Grid>
                <MediaField name="ogImage" label="Social share image" defaultValue={page.ogImage ?? ''} />
                <Field label="Canonical URL" htmlFor="canonical" hint="Leave empty to use the default.">
                  <input id="canonical" name="canonical" defaultValue={page.canonical} dir="ltr" className={inputClass} />
                </Field>
                <Field label="SEO title (EN)" htmlFor="seoTitleEn">
                  <input id="seoTitleEn" name="seoTitleEn" defaultValue={page.seoTitleEn} className={inputClass} />
                </Field>
                <Field label="SEO title (AR)" htmlFor="seoTitleAr">
                  <input id="seoTitleAr" name="seoTitleAr" defaultValue={page.seoTitleAr} dir="rtl" className={inputClass} />
                </Field>
                <Field label="SEO description (EN)" htmlFor="seoDescriptionEn">
                  <textarea id="seoDescriptionEn" name="seoDescriptionEn" rows={3} defaultValue={page.seoDescriptionEn} className={inputClass} />
                </Field>
                <Field label="SEO description (AR)" htmlFor="seoDescriptionAr">
                  <textarea id="seoDescriptionAr" name="seoDescriptionAr" rows={3} defaultValue={page.seoDescriptionAr} dir="rtl" className={inputClass} />
                </Field>
              </Grid>

              <label className="mt-4 flex items-center gap-2 text-sm text-slate-700">
                <input name="noindex" type="checkbox" defaultChecked={page.noindex} className="h-4 w-4 rounded border-slate-300" />
                Hide this page from search engines
              </label>
            </Card>
          </>
        )}
      </AdminForm>
    </>
  );
}
