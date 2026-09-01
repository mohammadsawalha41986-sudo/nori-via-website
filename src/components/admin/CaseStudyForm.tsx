'use client';

import { AdminForm } from './AdminForm';
import { MediaField } from './MediaField';
import { SubmitButton } from './SubmitButton';
import { Card, Field, Grid, inputClass } from './ui';
import { saveCaseStudy, deleteCaseStudy } from '@/server/actions';

const CHAPTERS = [
  ['challenge', 'The Challenge'],
  ['strategy', 'The Strategy'],
  ['idea', 'The Idea'],
  ['creative', 'The Creative'],
  ['campaign', 'The Campaign'],
  ['result', 'The Result'],
  ['outcome', 'The Outcome'],
] as const;

export type CaseStudyFormValues = {
  id?: string;
  slug: string;
  titleEn: string; titleAr: string;
  projectId: string;
  chapters: Record<string, string>;
  metricsRaw: string; galleryRaw: string; videosRaw: string; filesRaw: string;
  heroMediaUrl: string;
  serviceIds: string[];
  seoTitleEn: string; seoTitleAr: string;
  seoDescriptionEn: string; seoDescriptionAr: string;
  ogImage: string; noindex: boolean;
  status: string; order: number;
};

export function CaseStudyForm({
  values,
  projects,
  services,
}: {
  values: CaseStudyFormValues;
  projects: { id: string; titleEn: string }[];
  services: { id: string; nameEn: string }[];
}) {
  return (
    <AdminForm action={saveCaseStudy} className="space-y-5">
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
              <Field label="Project" htmlFor="projectId" hint="The case study renders on that project's page.">
                <select id="projectId" name="projectId" defaultValue={values.projectId} className={inputClass}>
                  <option value="">None</option>
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>{p.titleEn}</option>
                  ))}
                </select>
              </Field>
            </Grid>
          </Card>

          <Card title="The story" description="Leave a blank line between paragraphs. Empty sections are simply not rendered.">
            <div className="space-y-5">
              {CHAPTERS.map(([key, label]) => (
                <Grid key={key}>
                  <Field label={`${label} (EN)`} htmlFor={`${key}En`}>
                    <textarea id={`${key}En`} name={`${key}En`} rows={4} defaultValue={values.chapters[`${key}En`] ?? ''} className={inputClass} />
                  </Field>
                  <Field label={`${label} (AR)`} htmlFor={`${key}Ar`}>
                    <textarea id={`${key}Ar`} name={`${key}Ar`} rows={4} defaultValue={values.chapters[`${key}Ar`] ?? ''} dir="rtl" className={inputClass} />
                  </Field>
                </Grid>
              ))}
            </div>
          </Card>

          <Card
            title="Verified metrics"
            description="Evidence-backed figures only. An empty list is better than an estimate."
          >
            <Field label="Metrics" htmlFor="metricsRaw" hint="One per line: Value | Label EN | Label AR">
              <textarea id="metricsRaw" name="metricsRaw" rows={4} defaultValue={values.metricsRaw} className={`${inputClass} font-mono text-xs`} />
            </Field>
          </Card>

          <Card title="Media">
            <MediaField name="heroMediaUrl" label="Hero image" defaultValue={values.heroMediaUrl} />
            <div className="mt-4 space-y-4">
              <Field label="Gallery" htmlFor="galleryRaw" hint="URL | Alt EN | Alt AR">
                <textarea id="galleryRaw" name="galleryRaw" rows={4} defaultValue={values.galleryRaw} className={`${inputClass} font-mono text-xs`} />
              </Field>
              <Field label="Videos" htmlFor="videosRaw" hint="URL | Label EN | Label AR">
                <textarea id="videosRaw" name="videosRaw" rows={3} defaultValue={values.videosRaw} className={`${inputClass} font-mono text-xs`} />
              </Field>
              <Field label="PDFs and files" htmlFor="filesRaw" hint="URL | Label EN | Label AR">
                <textarea id="filesRaw" name="filesRaw" rows={3} defaultValue={values.filesRaw} className={`${inputClass} font-mono text-xs`} />
              </Field>
            </div>
          </Card>

          <Card title="Related services">
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
          </Card>

          <Card title="SEO & publishing">
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

            <Grid cols={3}>
              <Field label="Status" htmlFor="status" className="mt-4">
                <select id="status" name="status" defaultValue={values.status} className={inputClass}>
                  <option value="DRAFT">Draft</option>
                  <option value="PUBLISHED">Published</option>
                </select>
              </Field>
              <Field label="Order" htmlFor="order" className="mt-4">
                <input id="order" name="order" type="number" min={0} defaultValue={values.order} className={inputClass} />
              </Field>
              <label className="mt-10 flex items-center gap-2 text-sm text-slate-700">
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

export function DeleteCaseStudyForm({ id, name }: { id: string; name: string }) {
  return (
    <form action={deleteCaseStudy}>
      <input type="hidden" name="id" value={id} />
      <SubmitButton
        variant="danger"
        confirm={`Delete the case study "${name}"? The linked project is not deleted, but the story disappears from its page. This cannot be undone.`}
      >
        Delete case study
      </SubmitButton>
    </form>
  );
}
