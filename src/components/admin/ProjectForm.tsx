'use client';

import { AdminForm } from './AdminForm';
import { MediaField } from './MediaField';
import { SubmitButton } from './SubmitButton';
import { Card, Field, Grid, inputClass } from './ui';
import { saveProject, deleteProject } from '@/server/actions';

export type ProjectFormValues = {
  id?: string;
  slug: string;
  titleEn: string; titleAr: string;
  client: string;
  categoryId: string;
  descriptionEn: string; descriptionAr: string;
  heroMediaUrl: string; heroMediaKind: string;
  galleryRaw: string; videosRaw: string; downloadsRaw: string; resultsRaw: string;
  year: string; location: string;
  featured: boolean; status: string; order: number;
  serviceIds: string[];
  seoTitleEn: string; seoTitleAr: string;
  seoDescriptionEn: string; seoDescriptionAr: string;
  ogImage: string; noindex: boolean;
};

export function ProjectForm({
  values,
  categories,
  services,
}: {
  values: ProjectFormValues;
  categories: { id: string; nameEn: string }[];
  services: { id: string; nameEn: string }[];
}) {
  return (
    <AdminForm action={saveProject} className="space-y-5">
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
              <Field label="Client" htmlFor="client" hint="Only name a client you have permission to name.">
                <input id="client" name="client" defaultValue={values.client} className={inputClass} />
              </Field>
              <Field label="Category" htmlFor="categoryId">
                <select id="categoryId" name="categoryId" defaultValue={values.categoryId} className={inputClass}>
                  <option value="">None</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.nameEn}</option>
                  ))}
                </select>
              </Field>
              <Field label="Year" htmlFor="year">
                <input id="year" name="year" type="number" min={1900} max={2200} defaultValue={values.year} className={inputClass} />
              </Field>
              <Field label="Location" htmlFor="location">
                <input id="location" name="location" defaultValue={values.location} className={inputClass} />
              </Field>
            </Grid>

            <Grid>
              <Field label="Description (EN)" htmlFor="descriptionEn" className="mt-4">
                <textarea id="descriptionEn" name="descriptionEn" rows={4} defaultValue={values.descriptionEn} className={inputClass} />
              </Field>
              <Field label="Description (AR)" htmlFor="descriptionAr" className="mt-4">
                <textarea id="descriptionAr" name="descriptionAr" rows={4} defaultValue={values.descriptionAr} dir="rtl" className={inputClass} />
              </Field>
            </Grid>
          </Card>

          <Card title="Services delivered">
            <fieldset>
              <legend className="sr-only">Services</legend>
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {services.map((s) => (
                  <label key={s.id} className="flex items-center gap-2 text-sm text-slate-700">
                    <input
                      type="checkbox"
                      name="serviceIds[]"
                      value={s.id}
                      defaultChecked={values.serviceIds.includes(s.id)}
                      className="h-4 w-4 rounded border-slate-300"
                    />
                    {s.nameEn}
                  </label>
                ))}
              </div>
            </fieldset>
          </Card>

          <Card title="Media">
            <Grid>
              <MediaField name="heroMediaUrl" label="Hero image or video" defaultValue={values.heroMediaUrl} />
              <Field label="Hero media type" htmlFor="heroMediaKind">
                <select id="heroMediaKind" name="heroMediaKind" defaultValue={values.heroMediaKind} className={inputClass}>
                  <option value="IMAGE">Image</option>
                  <option value="VIDEO">Video</option>
                </select>
              </Field>
            </Grid>

            <div className="mt-4 space-y-4">
              <Field label="Gallery" htmlFor="galleryRaw" hint="One per line: URL | Alt EN | Alt AR">
                <textarea id="galleryRaw" name="galleryRaw" rows={5} defaultValue={values.galleryRaw} className={`${inputClass} font-mono text-xs`} />
              </Field>
              <Field label="Videos" htmlFor="videosRaw" hint="One per line: URL | Label EN | Label AR">
                <textarea id="videosRaw" name="videosRaw" rows={3} defaultValue={values.videosRaw} className={`${inputClass} font-mono text-xs`} />
              </Field>
              <Field label="Public downloads" htmlFor="downloadsRaw" hint="One per line: URL | Label EN | Label AR">
                <textarea id="downloadsRaw" name="downloadsRaw" rows={3} defaultValue={values.downloadsRaw} className={`${inputClass} font-mono text-xs`} />
              </Field>
            </div>
          </Card>

          <Card
            title="Verified results"
            description="Only enter figures you can evidence. Leave empty rather than estimating — nothing here should be invented."
          >
            <Field label="Results" htmlFor="resultsRaw" hint="One per line: Value | Label EN | Label AR — e.g. 3.4x | Return on ad spend | العائد على الإنفاق">
              <textarea id="resultsRaw" name="resultsRaw" rows={4} defaultValue={values.resultsRaw} className={`${inputClass} font-mono text-xs`} />
            </Field>
          </Card>

          <Card title="SEO">
            <Grid>
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
              <Field label="Order" htmlFor="order">
                <input id="order" name="order" type="number" min={0} defaultValue={values.order} className={inputClass} />
              </Field>
              <div className="space-y-2 pt-6">
                <label className="flex items-center gap-2 text-sm text-slate-700">
                  <input name="featured" type="checkbox" defaultChecked={values.featured} className="h-4 w-4 rounded border-slate-300" />
                  Feature on the homepage
                </label>
                <label className="flex items-center gap-2 text-sm text-slate-700">
                  <input name="noindex" type="checkbox" defaultChecked={values.noindex} className="h-4 w-4 rounded border-slate-300" />
                  Hide from search engines
                </label>
              </div>
            </Grid>
          </Card>
        </>
      )}
    </AdminForm>
  );
}

export function DeleteProjectForm({ id, name, hasCaseStudy }: { id: string; name: string; hasCaseStudy: boolean }) {
  return (
    <form action={deleteProject}>
      <input type="hidden" name="id" value={id} />
      <SubmitButton
        variant="danger"
        confirm={
          hasCaseStudy
            ? `Delete "${name}"? Its case study will be kept but will no longer be linked to a project. This cannot be undone.`
            : `Delete "${name}"? Its public page will 404. This cannot be undone.`
        }
      >
        Delete project
      </SubmitButton>
    </form>
  );
}
