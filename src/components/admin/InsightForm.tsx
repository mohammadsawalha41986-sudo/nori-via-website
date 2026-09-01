'use client';

import { AdminForm } from './AdminForm';
import { MediaField } from './MediaField';
import { SubmitButton } from './SubmitButton';
import { Card, Field, Grid, inputClass } from './ui';
import { saveInsight, deleteInsight } from '@/server/actions';

export type InsightFormValues = {
  id?: string;
  slug: string;
  titleEn: string; titleAr: string;
  excerptEn: string; excerptAr: string;
  contentEn: string; contentAr: string;
  coverImage: string;
  categoryId: string;
  tags: string;
  author: string;
  publishedAt: string;
  status: string;
  seoTitleEn: string; seoTitleAr: string;
  seoDescriptionEn: string; seoDescriptionAr: string;
  ogImage: string; noindex: boolean;
};

export function InsightForm({
  values,
  categories,
}: {
  values: InsightFormValues;
  categories: { id: string; nameEn: string }[];
}) {
  return (
    <AdminForm action={saveInsight} className="space-y-5">
      {(state) => (
        <>
          {values.id && <input type="hidden" name="id" value={values.id} />}

          <Card title="Basics">
            <Grid>
              <Field label="Title (EN)" htmlFor="titleEn" required>
                <input id="titleEn" name="titleEn" defaultValue={values.titleEn} required className={inputClass} />
              </Field>
              <Field label="Title (AR)" htmlFor="titleAr">
                <input id="titleAr" name="titleAr" defaultValue={values.titleAr} dir="rtl" className={inputClass} />
              </Field>
              <Field label="Slug" htmlFor="slug" required hint={state.fieldErrors?.slug}>
                <input id="slug" name="slug" defaultValue={values.slug} required dir="ltr" className={inputClass} />
              </Field>
              <Field label="Category" htmlFor="categoryId">
                <select id="categoryId" name="categoryId" defaultValue={values.categoryId} className={inputClass}>
                  <option value="">None</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.nameEn}</option>
                  ))}
                </select>
              </Field>
              <Field label="Author" htmlFor="author">
                <input id="author" name="author" defaultValue={values.author} className={inputClass} />
              </Field>
              <Field label="Tags" htmlFor="tags" hint="Comma separated.">
                <input id="tags" name="tags" defaultValue={values.tags} className={inputClass} />
              </Field>
            </Grid>
          </Card>

          <Card title="Content" description="Leave a blank line between paragraphs.">
            <Grid>
              <Field label="Excerpt (EN)" htmlFor="excerptEn">
                <textarea id="excerptEn" name="excerptEn" rows={3} defaultValue={values.excerptEn} className={inputClass} />
              </Field>
              <Field label="Excerpt (AR)" htmlFor="excerptAr">
                <textarea id="excerptAr" name="excerptAr" rows={3} defaultValue={values.excerptAr} dir="rtl" className={inputClass} />
              </Field>
            </Grid>

            <Field label="Body (EN)" htmlFor="contentEn" className="mt-4">
              <textarea id="contentEn" name="contentEn" rows={16} defaultValue={values.contentEn} className={inputClass} />
            </Field>
            <Field label="Body (AR)" htmlFor="contentAr" className="mt-4">
              <textarea id="contentAr" name="contentAr" rows={16} defaultValue={values.contentAr} dir="rtl" className={inputClass} />
            </Field>
          </Card>

          <Card title="Media & SEO">
            <Grid>
              <MediaField name="coverImage" label="Cover image" defaultValue={values.coverImage} />
              <MediaField name="ogImage" label="Social share image" defaultValue={values.ogImage} />
              <Field label="SEO title (EN)" htmlFor="seoTitleEn">
                <input id="seoTitleEn" name="seoTitleEn" defaultValue={values.seoTitleEn} className={inputClass} />
              </Field>
              <Field label="SEO title (AR)" htmlFor="seoTitleAr">
                <input id="seoTitleAr" name="seoTitleAr" defaultValue={values.seoTitleAr} dir="rtl" className={inputClass} />
              </Field>
              <Field label="SEO description (EN)" htmlFor="seoDescriptionEn">
                <textarea id="seoDescriptionEn" name="seoDescriptionEn" rows={3} defaultValue={values.seoDescriptionEn} className={inputClass} />
              </Field>
              <Field label="SEO description (AR)" htmlFor="seoDescriptionAr">
                <textarea id="seoDescriptionAr" name="seoDescriptionAr" rows={3} defaultValue={values.seoDescriptionAr} dir="rtl" className={inputClass} />
              </Field>
            </Grid>
          </Card>

          <Card title="Publishing">
            <Grid cols={3}>
              <Field label="Status" htmlFor="status">
                <select id="status" name="status" defaultValue={values.status} className={inputClass}>
                  <option value="DRAFT">Draft</option>
                  <option value="PUBLISHED">Published</option>
                </select>
              </Field>
              <Field label="Publication date" htmlFor="publishedAt" hint="Leave empty to stamp the moment you publish.">
                <input id="publishedAt" name="publishedAt" type="date" defaultValue={values.publishedAt} className={inputClass} />
              </Field>
              <label className="mt-7 flex items-center gap-2 text-sm text-slate-700">
                <input name="noindex" type="checkbox" defaultChecked={values.noindex} className="h-4 w-4 rounded border-slate-300" />
                Hide from search engines
              </label>
            </Grid>
          </Card>
        </>
      )}
    </AdminForm>
  );
}

export function DeleteInsightForm({ id, name }: { id: string; name: string }) {
  return (
    <form action={deleteInsight}>
      <input type="hidden" name="id" value={id} />
      <SubmitButton variant="danger" confirm={`Delete "${name}"? Its public URL will 404. This cannot be undone.`}>
        Delete article
      </SubmitButton>
    </form>
  );
}
