'use client';

import { AdminForm } from './AdminForm';
import { MediaField } from './MediaField';
import { RelationPicker, type RelationOption } from './RelationPicker';
import { SubmitButton } from './SubmitButton';
import { ToolBuilder } from './ToolBuilder';
import { Card, Field, Grid, inputClass } from './ui';
import { saveTool, deleteTool } from '@/server/platform-actions';
import type { ToolConfig } from '@/lib/tool-engine';

export type ToolFormValues = {
  id?: string;
  slug: string;
  nameEn: string; nameAr: string;
  summaryEn: string; summaryAr: string;
  descriptionEn: string; descriptionAr: string;
  purposeEn: string; purposeAr: string;
  thumbnail: string;
  featured: boolean;
  status: string;
  order: number;
  seoTitleEn: string; seoTitleAr: string;
  seoDescriptionEn: string; seoDescriptionAr: string;
  ogImage: string; noindex: boolean;
};

export function ToolForm({
  values,
  config,
  relationOptions,
  selectedRelations,
}: {
  values: ToolFormValues;
  config: ToolConfig;
  relationOptions: RelationOption[];
  selectedRelations: string[];
}) {
  return (
    <AdminForm action={saveTool} className="space-y-5">
      {(state) => (
        <>
          {values.id && <input type="hidden" name="id" value={values.id} />}

          <Card title="Basics">
            <Grid>
              <Field label="Name (EN)" htmlFor="nameEn" required>
                <input id="nameEn" name="nameEn" defaultValue={values.nameEn} required className={inputClass} />
              </Field>
              <Field label="Name (AR)" htmlFor="nameAr">
                <input id="nameAr" name="nameAr" defaultValue={values.nameAr} dir="rtl" className={inputClass} />
              </Field>
              <Field label="Slug" htmlFor="slug" required hint={state.fieldErrors?.slug ?? 'Used in /tools/…'}>
                <input id="slug" name="slug" defaultValue={values.slug} required dir="ltr" className={inputClass} />
              </Field>
              <Field label="Order" htmlFor="order">
                <input id="order" name="order" type="number" min={0} defaultValue={values.order} className={inputClass} />
              </Field>
              <Field label="Summary (EN)" htmlFor="summaryEn" hint="Shown on the tools index.">
                <textarea id="summaryEn" name="summaryEn" rows={3} defaultValue={values.summaryEn} className={inputClass} />
              </Field>
              <Field label="Summary (AR)" htmlFor="summaryAr">
                <textarea id="summaryAr" name="summaryAr" rows={3} defaultValue={values.summaryAr} dir="rtl" className={inputClass} />
              </Field>
            </Grid>
          </Card>

          <Card
            title="Calculator"
            description="Define the inputs and the formulas. Results are calculated in the visitor's browser — nothing they type is sent anywhere."
          >
            {state.fieldErrors?.configJson && (
              <p role="alert" className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {state.fieldErrors.configJson}
              </p>
            )}
            <ToolBuilder initialConfig={config} />
          </Card>

          <Card title="Explanation" description="Optional copy shown under the calculator.">
            <Grid>
              <Field label="Purpose (EN)" htmlFor="purposeEn">
                <textarea id="purposeEn" name="purposeEn" rows={4} defaultValue={values.purposeEn} className={inputClass} />
              </Field>
              <Field label="Purpose (AR)" htmlFor="purposeAr">
                <textarea id="purposeAr" name="purposeAr" rows={4} defaultValue={values.purposeAr} dir="rtl" className={inputClass} />
              </Field>
            </Grid>
            <Field label="Description (EN)" htmlFor="descriptionEn" className="mt-4">
              <textarea id="descriptionEn" name="descriptionEn" rows={7} defaultValue={values.descriptionEn} className={inputClass} />
            </Field>
            <Field label="Description (AR)" htmlFor="descriptionAr" className="mt-4">
              <textarea id="descriptionAr" name="descriptionAr" rows={7} defaultValue={values.descriptionAr} dir="rtl" className={inputClass} />
            </Field>
          </Card>

          <Card title="Related content" description="Connect this tool to articles, resources, solutions and work.">
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
              <label className="mt-7 flex items-center gap-2 text-sm text-slate-700">
                <input name="featured" type="checkbox" defaultChecked={values.featured} className="h-4 w-4 rounded border-slate-300" />
                Feature on the homepage
              </label>
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

export function DeleteToolForm({ id, name }: { id: string; name: string }) {
  return (
    <form action={deleteTool}>
      <input type="hidden" name="id" value={id} />
      <SubmitButton variant="danger" confirm={`Delete "${name}"? Its public URL will 404. This cannot be undone.`}>
        Delete tool
      </SubmitButton>
    </form>
  );
}
