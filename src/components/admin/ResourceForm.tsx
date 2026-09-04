'use client';

import { AdminForm } from './AdminForm';
import { MediaField } from './MediaField';
import { RelationPicker, type RelationOption } from './RelationPicker';
import { SubmitButton } from './SubmitButton';
import { Card, Field, Grid, inputClass } from './ui';
import { saveResource, deleteResource } from '@/server/platform-actions';

export type ResourceFormValues = {
  id?: string;
  slug: string;
  titleEn: string; titleAr: string;
  summaryEn: string; summaryAr: string;
  descriptionEn: string; descriptionAr: string;
  type: string;
  categoryId: string;
  tags: string;
  externalUrl: string;
  thumbnail: string;
  includes: string;
  audience: string;
  featured: boolean;
  publishedAt: string;
  status: string;
  order: number;
  seoTitleEn: string; seoTitleAr: string;
  seoDescriptionEn: string; seoDescriptionAr: string;
  ogImage: string; noindex: boolean;
  fileName: string;
  fileLabel: string;
};

const TYPES = [
  ['EXCEL', 'Excel workbook'],
  ['WORD', 'Word document'],
  ['PDF', 'PDF'],
  ['TEMPLATE', 'Template'],
  ['GUIDE', 'Guide'],
  ['REPORT', 'Report'],
] as const;

export function ResourceForm({
  values,
  categories,
  relationOptions,
  selectedRelations,
}: {
  values: ResourceFormValues;
  categories: { id: string; nameEn: string }[];
  relationOptions: RelationOption[];
  selectedRelations: string[];
}) {
  return (
    <AdminForm action={saveResource} className="space-y-5">
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
              <Field label="Slug" htmlFor="slug" required hint={state.fieldErrors?.slug ?? 'Used in /library/…'}>
                <input id="slug" name="slug" defaultValue={values.slug} required dir="ltr" className={inputClass} />
              </Field>
              <Field label="Type" htmlFor="type" required>
                <select id="type" name="type" defaultValue={values.type} className={inputClass}>
                  {TYPES.map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </Field>
              <Field label="Category" htmlFor="categoryId" hint="Managed in Categories.">
                <select id="categoryId" name="categoryId" defaultValue={values.categoryId} className={inputClass}>
                  <option value="">None</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.nameEn}</option>
                  ))}
                </select>
              </Field>
              <Field label="Tags" htmlFor="tags" hint="Comma separated.">
                <input id="tags" name="tags" defaultValue={values.tags} className={inputClass} />
              </Field>
              <Field label="Summary (EN)" htmlFor="summaryEn" hint="Shown on the library card.">
                <textarea id="summaryEn" name="summaryEn" rows={3} defaultValue={values.summaryEn} className={inputClass} />
              </Field>
              <Field label="Summary (AR)" htmlFor="summaryAr">
                <textarea id="summaryAr" name="summaryAr" rows={3} defaultValue={values.summaryAr} dir="rtl" className={inputClass} />
              </Field>
            </Grid>
          </Card>

          <Card
            title="File"
            description="PDF, Word (.doc/.docx) or Excel (.xls/.xlsx), up to 25 MB. Files are stored privately and served only through the download link."
          >
            {values.fileName && (
              <p className="mb-4 rounded-md border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                Current file: <span className="font-medium text-slate-900">{values.fileName}</span> {values.fileLabel}
              </p>
            )}

            <Field label={values.fileName ? 'Replace file' : 'Upload file'} htmlFor="file">
              <input
                id="file"
                name="file"
                type="file"
                accept=".pdf,.doc,.docx,.xls,.xlsx,application/pdf,application/msword,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm file:me-3 file:rounded file:border-0 file:bg-slate-900 file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-white"
              />
            </Field>

            <Field
              label="Or link to an external file"
              htmlFor="externalUrl"
              hint="Used when the asset is hosted elsewhere. An uploaded file takes priority."
              className="mt-4"
            >
              <input id="externalUrl" name="externalUrl" defaultValue={values.externalUrl} dir="ltr" placeholder="https://" className={inputClass} />
            </Field>
          </Card>

          <Card title="Detail page" description="One item per line. Use “English | Arabic” for both languages.">
            <Field label="Description (EN)" htmlFor="descriptionEn" hint="Leave a blank line between paragraphs.">
              <textarea id="descriptionEn" name="descriptionEn" rows={8} defaultValue={values.descriptionEn} className={inputClass} />
            </Field>
            <Field label="Description (AR)" htmlFor="descriptionAr" className="mt-4">
              <textarea id="descriptionAr" name="descriptionAr" rows={8} defaultValue={values.descriptionAr} dir="rtl" className={inputClass} />
            </Field>
            <Grid>
              <Field label="What's included" htmlFor="includes" className="mt-4">
                <textarea id="includes" name="includes" rows={5} defaultValue={values.includes} className={inputClass} />
              </Field>
              <Field label="Who it is for" htmlFor="audience" className="mt-4">
                <textarea id="audience" name="audience" rows={5} defaultValue={values.audience} className={inputClass} />
              </Field>
            </Grid>
          </Card>

          <Card title="Related content" description="Connect this resource to articles, tools, solutions and work.">
            <RelationPicker options={relationOptions} selected={selectedRelations} />
          </Card>

          <Card title="Media & SEO">
            <Grid>
              <MediaField name="thumbnail" label="Thumbnail" defaultValue={values.thumbnail} kind="IMAGE" />
              <MediaField name="ogImage" label="Social share image" defaultValue={values.ogImage} kind="IMAGE" />
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
              <Field label="Publication date" htmlFor="publishedAt" hint="Leave empty to stamp on publish.">
                <input id="publishedAt" name="publishedAt" type="date" defaultValue={values.publishedAt} className={inputClass} />
              </Field>
              <Field label="Order" htmlFor="order">
                <input id="order" name="order" type="number" min={0} defaultValue={values.order} className={inputClass} />
              </Field>
              <label className="flex items-center gap-2 text-sm text-slate-700">
                <input name="featured" type="checkbox" defaultChecked={values.featured} className="h-4 w-4 rounded border-slate-300" />
                Feature on the homepage
              </label>
              <label className="flex items-center gap-2 text-sm text-slate-700">
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

export function DeleteResourceForm({ id, name }: { id: string; name: string }) {
  return (
    <form action={deleteResource}>
      <input type="hidden" name="id" value={id} />
      <SubmitButton variant="danger" confirm={`Delete "${name}"? Its file and public URL are removed. This cannot be undone.`}>
        Delete resource
      </SubmitButton>
    </form>
  );
}
