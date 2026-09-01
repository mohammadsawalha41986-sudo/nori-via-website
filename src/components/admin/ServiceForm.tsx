'use client';

import { AdminForm } from './AdminForm';
import { MediaField } from './MediaField';
import { SubmitButton } from './SubmitButton';
import { Card, Field, Grid, inputClass } from './ui';
import { saveService, deleteService } from '@/server/actions';

export type ServiceFormValues = {
  id?: string;
  slug: string;
  nameEn: string; nameAr: string;
  categoryId: string;
  summaryEn: string; summaryAr: string;
  heroHeadlineEn: string; heroHeadlineAr: string;
  heroDescriptionEn: string; heroDescriptionAr: string;
  whatWeDoEn: string; whatWeDoAr: string;
  whyItMattersEn: string; whyItMattersAr: string;
  approachEn: string; approachAr: string;
  deliverablesRaw: string; benefitsRaw: string; processRaw: string; faqsRaw: string; galleryRaw: string;
  featuredImage: string;
  seoTitleEn: string; seoTitleAr: string;
  seoDescriptionEn: string; seoDescriptionAr: string;
  ogImage: string;
  noindex: boolean;
  status: string;
  order: number;
};

export function ServiceForm({
  values,
  categories,
}: {
  values: ServiceFormValues;
  categories: { id: string; nameEn: string }[];
}) {
  return (
    <AdminForm action={saveService} className="space-y-5">
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
              <Field label="Slug" htmlFor="slug" required hint={state.fieldErrors?.slug ?? 'Lowercase letters, numbers and hyphens.'}>
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
              <Field label="Summary (EN)" htmlFor="summaryEn" hint="Shown on the services index.">
                <textarea id="summaryEn" name="summaryEn" rows={3} defaultValue={values.summaryEn} className={inputClass} />
              </Field>
              <Field label="Summary (AR)" htmlFor="summaryAr">
                <textarea id="summaryAr" name="summaryAr" rows={3} defaultValue={values.summaryAr} dir="rtl" className={inputClass} />
              </Field>
            </Grid>
          </Card>

          <Card title="Hero">
            <Grid>
              <Field label="Hero headline (EN)" htmlFor="heroHeadlineEn">
                <textarea id="heroHeadlineEn" name="heroHeadlineEn" rows={2} defaultValue={values.heroHeadlineEn} className={inputClass} />
              </Field>
              <Field label="Hero headline (AR)" htmlFor="heroHeadlineAr">
                <textarea id="heroHeadlineAr" name="heroHeadlineAr" rows={2} defaultValue={values.heroHeadlineAr} dir="rtl" className={inputClass} />
              </Field>
              <Field label="Hero description (EN)" htmlFor="heroDescriptionEn">
                <textarea id="heroDescriptionEn" name="heroDescriptionEn" rows={3} defaultValue={values.heroDescriptionEn} className={inputClass} />
              </Field>
              <Field label="Hero description (AR)" htmlFor="heroDescriptionAr">
                <textarea id="heroDescriptionAr" name="heroDescriptionAr" rows={3} defaultValue={values.heroDescriptionAr} dir="rtl" className={inputClass} />
              </Field>
            </Grid>
          </Card>

          <Card title="Body" description="Leave a blank line between paragraphs.">
            <Grid>
              <Field label="What we do (EN)" htmlFor="whatWeDoEn">
                <textarea id="whatWeDoEn" name="whatWeDoEn" rows={5} defaultValue={values.whatWeDoEn} className={inputClass} />
              </Field>
              <Field label="What we do (AR)" htmlFor="whatWeDoAr">
                <textarea id="whatWeDoAr" name="whatWeDoAr" rows={5} defaultValue={values.whatWeDoAr} dir="rtl" className={inputClass} />
              </Field>
              <Field label="Why it matters (EN)" htmlFor="whyItMattersEn">
                <textarea id="whyItMattersEn" name="whyItMattersEn" rows={4} defaultValue={values.whyItMattersEn} className={inputClass} />
              </Field>
              <Field label="Why it matters (AR)" htmlFor="whyItMattersAr">
                <textarea id="whyItMattersAr" name="whyItMattersAr" rows={4} defaultValue={values.whyItMattersAr} dir="rtl" className={inputClass} />
              </Field>
              <Field label="Our approach (EN)" htmlFor="approachEn">
                <textarea id="approachEn" name="approachEn" rows={4} defaultValue={values.approachEn} className={inputClass} />
              </Field>
              <Field label="Our approach (AR)" htmlFor="approachAr">
                <textarea id="approachAr" name="approachAr" rows={4} defaultValue={values.approachAr} dir="rtl" className={inputClass} />
              </Field>
            </Grid>
          </Card>

          <Card title="Lists" description="One item per line. Use | to separate the columns.">
            <div className="space-y-4">
              <Field label="What you get" htmlFor="deliverablesRaw" hint="English | العربية">
                <textarea id="deliverablesRaw" name="deliverablesRaw" rows={6} defaultValue={values.deliverablesRaw} className={`${inputClass} font-mono text-xs`} />
              </Field>
              <Field label="Benefits" htmlFor="benefitsRaw" hint="English | العربية">
                <textarea id="benefitsRaw" name="benefitsRaw" rows={4} defaultValue={values.benefitsRaw} className={`${inputClass} font-mono text-xs`} />
              </Field>
              <Field label="Process steps" htmlFor="processRaw" hint="Title EN | Title AR | Body EN | Body AR">
                <textarea id="processRaw" name="processRaw" rows={5} defaultValue={values.processRaw} className={`${inputClass} font-mono text-xs`} />
              </Field>
              <Field label="FAQs" htmlFor="faqsRaw" hint="Question EN | Question AR | Answer EN | Answer AR">
                <textarea id="faqsRaw" name="faqsRaw" rows={5} defaultValue={values.faqsRaw} className={`${inputClass} font-mono text-xs`} />
              </Field>
              <Field label="Gallery" htmlFor="galleryRaw" hint="URL | Alt EN | Alt AR">
                <textarea id="galleryRaw" name="galleryRaw" rows={4} defaultValue={values.galleryRaw} className={`${inputClass} font-mono text-xs`} />
              </Field>
            </div>
          </Card>

          <Card title="Media & SEO">
            <Grid>
              <MediaField name="featuredImage" label="Featured image" defaultValue={values.featuredImage} />
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
              <Field label="Order" htmlFor="order" hint="Lower numbers appear first.">
                <input id="order" name="order" type="number" min={0} defaultValue={values.order} className={inputClass} />
              </Field>
              <Field label="Search engines" htmlFor="noindex">
                <label className="flex items-center gap-2 pt-2 text-sm text-slate-700">
                  <input id="noindex" name="noindex" type="checkbox" defaultChecked={values.noindex} className="h-4 w-4 rounded border-slate-300" />
                  Hide this page from search engines
                </label>
              </Field>
            </Grid>
          </Card>
        </>
      )}
    </AdminForm>
  );
}

export function DeleteServiceForm({ id, name }: { id: string; name: string }) {
  return (
    <form action={deleteService}>
      <input type="hidden" name="id" value={id} />
      <SubmitButton
        variant="danger"
        confirm={`Delete "${name}"? Its public page will 404 and it will be removed from any project it is linked to. This cannot be undone.`}
      >
        Delete service
      </SubmitButton>
    </form>
  );
}
