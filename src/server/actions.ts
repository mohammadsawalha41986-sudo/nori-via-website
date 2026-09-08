'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import type { Prisma } from '@prisma/client';
import { prisma } from '@/lib/db';
import { locales } from '@/lib/i18n';
import { requireUser } from '@/lib/auth';
import { deleteStoredFile } from '@/lib/storage';
import { deleteContentLinksFor, setContentLinks, parseRef } from '@/lib/relations';
import { intakeSchema } from '@/lib/intake';
import {
  serviceSchema,
  projectSchema,
  caseStudySchema,
  insightSchema,
  settingsSchema,
  homepageSchema,
  homepageFaqSchema,
  statisticSchema,
  testimonialSchema,
  navigationSchema,
  pageSchema,
  systemStageSchema,
  taxonomySchema,
} from '@/lib/validation';
import {
  formToObject,
  checkbox,
  nullableId,
  parsePairs,
  parseMetrics,
  parseUrlList,
  parseBlocks,
  parseFaqs,
  toFieldErrors,
  type ActionState,
} from './helpers';

const J = (v: unknown) => v as Prisma.InputJsonValue;

/**
 * Refreshes the public routes affected by a content change.
 *
 * Concrete per-locale paths are used rather than the `/[locale]/...` route
 * pattern: mixing the pattern with a real slug matches nothing, which would
 * silently leave an unpublished page cached and still reachable.
 */
function revalidatePublic(...paths: string[]) {
  for (const locale of locales) {
    revalidatePath(`/${locale}`);
    for (const p of paths) revalidatePath(`/${locale}${p}`);
  }
  revalidatePath('/sitemap.xml');
}

/** Used when settings or navigation change, since those render in the layout. */
function revalidateEverything() {
  for (const locale of locales) revalidatePath(`/${locale}`, 'layout');
  revalidatePath('/sitemap.xml');
}

function fail(error: string): ActionState {
  return { error };
}

async function guard() {
  await requireUser();
}

/** Reads the related-content picker's selection off a submitted form. */
function relatedRefs(formData: FormData) {
  return formData
    .getAll('related[]')
    .map((value) => parseRef(String(value)))
    .filter((ref): ref is NonNullable<ReturnType<typeof parseRef>> => ref !== null);
}

// ---------------------------------------------------------------- settings

export async function saveSettings(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await guard();

  // Settings are spread across two screens (Site settings and SEO), so only the
  // fields actually submitted are written. Without this a save from one screen
  // would blank out every field owned by the other.
  const submitted = formToObject(formData);
  const parsed = settingsSchema.partial().safeParse(submitted);
  if (!parsed.success) return { error: 'Please check the highlighted fields.', fieldErrors: toFieldErrors(parsed.error) };

  const data = Object.fromEntries(
    Object.entries(parsed.data).filter(([key]) => key in submitted),
  ) as Record<string, string>;

  await prisma.siteSettings.upsert({
    where: { id: 'singleton' },
    update: data,
    create: { id: 'singleton', ...data },
  });

  revalidateEverything();
  revalidatePath('/admin/settings');
  return { ok: true };
}

// ---------------------------------------------------------------- homepage

export async function saveHomepage(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await guard();

  const raw = formToObject(formData);
  const parsed = homepageSchema.safeParse({
    ...raw,
    featuredCaseStudyId: nullableId(formData.get('featuredCaseStudyId')),
    featuredServiceId: nullableId(formData.get('featuredServiceId')),
    intelligenceItems: parsePairs(String(formData.get('intelligenceItemsRaw') ?? '')),
  });
  if (!parsed.success) return { error: 'Please check the highlighted fields.', fieldErrors: toFieldErrors(parsed.error) };

  const { intelligenceItems, ...rest } = parsed.data;

  await prisma.homepageContent.upsert({
    where: { id: 'singleton' },
    update: { ...rest, intelligenceItems: J(intelligenceItems) },
    create: { id: 'singleton', ...rest, intelligenceItems: J(intelligenceItems) },
  });

  revalidatePublic();
  revalidatePath('/admin/homepage');
  return { ok: true };
}

/**
 * Creates or updates one homepage question. The same action serves both
 * blocks; the submitted `group` decides which one the row belongs to.
 */
export async function saveHomepageFaq(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await guard();
  const id = String(formData.get('id') ?? '');
  const parsed = homepageFaqSchema.safeParse({
    ...formToObject(formData),
    visible: checkbox(formData, 'visible'),
  });
  if (!parsed.success) return { error: 'Please check the highlighted fields.', fieldErrors: toFieldErrors(parsed.error) };

  if (id) await prisma.homepageFaq.update({ where: { id }, data: parsed.data });
  else await prisma.homepageFaq.create({ data: parsed.data });

  revalidatePublic();
  revalidatePath('/admin/homepage/questions');
  return { ok: true };
}

export async function deleteHomepageFaq(formData: FormData) {
  await guard();
  const id = String(formData.get('id') ?? '');
  if (id) await prisma.homepageFaq.delete({ where: { id } });

  revalidatePublic();
  revalidatePath('/admin/homepage/questions');
}

// ---------------------------------------------------------------- services

export async function saveService(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await guard();

  // The request questionnaire travels as JSON from the builder, and is
  // re-validated here: the browser is never the authority on its shape.
  let intake: unknown = {};
  const rawIntake = String(formData.get('intakeJson') ?? '').trim();
  if (rawIntake) {
    try {
      intake = JSON.parse(rawIntake);
    } catch {
      return { error: 'The request form definition is not valid JSON.', fieldErrors: { intakeJson: 'Invalid JSON' } };
    }
  }
  const parsedIntake = intakeSchema.safeParse(intake);
  if (!parsedIntake.success) {
    return {
      error: 'Please check the request form questions.',
      fieldErrors: { intakeJson: Object.values(toFieldErrors(parsedIntake.error))[0] ?? 'Invalid' },
    };
  }
  const id = String(formData.get('id') ?? '');

  const parsed = serviceSchema.safeParse({
    ...formToObject(formData),
    categoryId: nullableId(formData.get('categoryId')),
    noindex: checkbox(formData, 'noindex'),
    deliverables: parsePairs(String(formData.get('deliverablesRaw') ?? '')),
    benefits: parsePairs(String(formData.get('benefitsRaw') ?? '')),
    process: parseBlocks(String(formData.get('processRaw') ?? '')),
    faqs: parseFaqs(String(formData.get('faqsRaw') ?? '')),
    gallery: parseUrlList(String(formData.get('galleryRaw') ?? '')),
  });
  if (!parsed.success) return { error: 'Please check the highlighted fields.', fieldErrors: toFieldErrors(parsed.error) };

  const { deliverables, benefits, process, faqs, gallery, ...rest } = parsed.data;
  const data = {
    ...rest,
    deliverables: J(deliverables),
    benefits: J(benefits),
    process: J(process),
    faqs: J(faqs),
    intake: J(parsedIntake.data),
    gallery: J(gallery),
  };

  const clash = await prisma.service.findFirst({ where: { slug: data.slug, NOT: id ? { id } : undefined } });
  if (clash) return fail('Another service already uses that slug.');

  const saved = id
    ? await prisma.service.update({ where: { id }, data })
    : await prisma.service.create({ data });

  await setContentLinks('SERVICE', saved.id, relatedRefs(formData));

  revalidatePublic('/services', `/services/${saved.slug}`);
  revalidatePath('/admin/services');
  if (!id) redirect(`/admin/services/${saved.id}`);
  return { ok: true };
}

export async function deleteService(formData: FormData) {
  await guard();
  const id = String(formData.get('id') ?? '');
  if (id) {
    await prisma.service.delete({ where: { id } });
    await deleteContentLinksFor('SERVICE', id);
  }
  revalidatePublic('/services');
  revalidatePath('/admin/services');
  redirect('/admin/services');
}

export async function toggleServiceStatus(formData: FormData) {
  await guard();
  const id = String(formData.get('id') ?? '');
  const service = await prisma.service.findUnique({ where: { id } });
  if (!service) return;
  await prisma.service.update({
    where: { id },
    data: { status: service.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED' },
  });
  revalidatePublic('/services', `/services/${service.slug}`);
  revalidatePath('/admin/services');
}

// ---------------------------------------------------------------- projects

export async function saveProject(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await guard();
  const id = String(formData.get('id') ?? '');

  const parsed = projectSchema.safeParse({
    ...formToObject(formData),
    categoryId: nullableId(formData.get('categoryId')),
    year: nullableId(formData.get('year')),
    featured: checkbox(formData, 'featured'),
    noindex: checkbox(formData, 'noindex'),
    serviceIds: formData.getAll('serviceIds[]').map(String),
    gallery: parseUrlList(String(formData.get('galleryRaw') ?? '')),
    videos: parseUrlList(String(formData.get('videosRaw') ?? '')),
    downloads: parseUrlList(String(formData.get('downloadsRaw') ?? ''), 'label'),
    results: parseMetrics(String(formData.get('resultsRaw') ?? '')),
  });
  if (!parsed.success) return { error: 'Please check the highlighted fields.', fieldErrors: toFieldErrors(parsed.error) };

  const { serviceIds, gallery, videos, downloads, results, ...rest } = parsed.data;
  const data = {
    ...rest,
    gallery: J(gallery),
    videos: J(videos),
    downloads: J(downloads),
    results: J(results),
  };

  const clash = await prisma.project.findFirst({ where: { slug: data.slug, NOT: id ? { id } : undefined } });
  if (clash) return fail('Another project already uses that slug.');

  const saved = id
    ? await prisma.project.update({ where: { id }, data })
    : await prisma.project.create({ data });

  await setContentLinks('PROJECT', saved.id, relatedRefs(formData));

  await prisma.projectService.deleteMany({ where: { projectId: saved.id } });
  if (serviceIds.length) {
    await prisma.projectService.createMany({
      data: serviceIds.map((serviceId) => ({ projectId: saved.id, serviceId })),
      skipDuplicates: true,
    });
  }

  revalidatePublic('/work', `/work/${saved.slug}`);
  revalidatePath('/admin/work');
  if (!id) redirect(`/admin/work/${saved.id}`);
  return { ok: true };
}

export async function deleteProject(formData: FormData) {
  await guard();
  const id = String(formData.get('id') ?? '');
  if (id) {
    await prisma.project.delete({ where: { id } });
    await deleteContentLinksFor('PROJECT', id);
  }
  revalidatePublic('/work');
  revalidatePath('/admin/work');
  redirect('/admin/work');
}

export async function toggleProjectStatus(formData: FormData) {
  await guard();
  const id = String(formData.get('id') ?? '');
  const project = await prisma.project.findUnique({ where: { id } });
  if (!project) return;
  await prisma.project.update({
    where: { id },
    data: { status: project.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED' },
  });
  revalidatePublic('/work', `/work/${project.slug}`);
  revalidatePath('/admin/work');
}

// ------------------------------------------------------------ case studies

export async function saveCaseStudy(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await guard();
  const id = String(formData.get('id') ?? '');

  const parsed = caseStudySchema.safeParse({
    ...formToObject(formData),
    projectId: nullableId(formData.get('projectId')),
    noindex: checkbox(formData, 'noindex'),
    serviceIds: formData.getAll('serviceIds[]').map(String),
    metrics: parseMetrics(String(formData.get('metricsRaw') ?? '')),
    gallery: parseUrlList(String(formData.get('galleryRaw') ?? '')),
    videos: parseUrlList(String(formData.get('videosRaw') ?? '')),
    files: parseUrlList(String(formData.get('filesRaw') ?? ''), 'label'),
  });
  if (!parsed.success) return { error: 'Please check the highlighted fields.', fieldErrors: toFieldErrors(parsed.error) };

  const { serviceIds, metrics, gallery, videos, files, projectId, ...rest } = parsed.data;

  if (projectId) {
    const taken = await prisma.caseStudy.findFirst({ where: { projectId, NOT: id ? { id } : undefined } });
    if (taken) return fail('That project already has a case study attached.');
  }

  const data = {
    ...rest,
    projectId,
    metrics: J(metrics),
    gallery: J(gallery),
    videos: J(videos),
    files: J(files),
  };

  const clash = await prisma.caseStudy.findFirst({ where: { slug: data.slug, NOT: id ? { id } : undefined } });
  if (clash) return fail('Another case study already uses that slug.');

  const saved = id
    ? await prisma.caseStudy.update({ where: { id }, data })
    : await prisma.caseStudy.create({ data });

  await setContentLinks('CASE_STUDY', saved.id, relatedRefs(formData));

  await prisma.caseStudyService.deleteMany({ where: { caseStudyId: saved.id } });
  if (serviceIds.length) {
    await prisma.caseStudyService.createMany({
      data: serviceIds.map((serviceId) => ({ caseStudyId: saved.id, serviceId })),
      skipDuplicates: true,
    });
  }

  revalidatePublic('/work');
  revalidatePath('/admin/case-studies');
  if (!id) redirect(`/admin/case-studies/${saved.id}`);
  return { ok: true };
}

export async function deleteCaseStudy(formData: FormData) {
  await guard();
  const id = String(formData.get('id') ?? '');
  if (id) {
    await prisma.caseStudy.delete({ where: { id } });
    await deleteContentLinksFor('CASE_STUDY', id);
  }
  revalidatePublic('/work');
  revalidatePath('/admin/case-studies');
  redirect('/admin/case-studies');
}

export async function toggleCaseStudyStatus(formData: FormData) {
  await guard();
  const id = String(formData.get('id') ?? '');
  const cs = await prisma.caseStudy.findUnique({ where: { id } });
  if (!cs) return;
  await prisma.caseStudy.update({
    where: { id },
    data: { status: cs.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED' },
  });
  revalidatePublic('/work');
  revalidatePath('/admin/case-studies');
}

// ---------------------------------------------------------------- insights

export async function saveInsight(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await guard();
  const id = String(formData.get('id') ?? '');

  const parsed = insightSchema.safeParse({
    ...formToObject(formData),
    categoryId: nullableId(formData.get('categoryId')),
    noindex: checkbox(formData, 'noindex'),
    tags: String(formData.get('tags') ?? '')
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean),
  });
  if (!parsed.success) return { error: 'Please check the highlighted fields.', fieldErrors: toFieldErrors(parsed.error) };

  const { publishedAt, tags, ...rest } = parsed.data;

  const publishDate = publishedAt ? new Date(publishedAt) : null;
  const data = {
    ...rest,
    tags: J(tags),
    // Publishing without an explicit date stamps it now.
    publishedAt:
      publishDate && !Number.isNaN(publishDate.getTime())
        ? publishDate
        : rest.status === 'PUBLISHED'
          ? new Date()
          : null,
  };

  const clash = await prisma.insight.findFirst({ where: { slug: data.slug, NOT: id ? { id } : undefined } });
  if (clash) return fail('Another article already uses that slug.');

  const saved = id
    ? await prisma.insight.update({ where: { id }, data })
    : await prisma.insight.create({ data });

  await setContentLinks('INSIGHT', saved.id, relatedRefs(formData));

  revalidatePublic('/insights', `/insights/${saved.slug}`);
  revalidatePath('/admin/insights');
  if (!id) redirect(`/admin/insights/${saved.id}`);
  return { ok: true };
}

export async function deleteInsight(formData: FormData) {
  await guard();
  const id = String(formData.get('id') ?? '');
  if (id) {
    await prisma.insight.delete({ where: { id } });
    // Content links are polymorphic, so they carry no cascade of their own.
    await deleteContentLinksFor('INSIGHT', id);
  }
  revalidatePublic('/insights');
  revalidatePath('/admin/insights');
  redirect('/admin/insights');
}

export async function toggleInsightStatus(formData: FormData) {
  await guard();
  const id = String(formData.get('id') ?? '');
  const a = await prisma.insight.findUnique({ where: { id } });
  if (!a) return;
  const next = a.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED';
  await prisma.insight.update({
    where: { id },
    data: { status: next, publishedAt: next === 'PUBLISHED' ? (a.publishedAt ?? new Date()) : a.publishedAt },
  });
  revalidatePublic('/insights', `/insights/${a.slug}`);
  revalidatePath('/admin/insights');
}

// ------------------------------------------------------------------- pages

export async function savePage(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await guard();
  const key = String(formData.get('key') ?? '');
  if (!key) return fail('Missing page key.');

  let content: unknown = {};
  const rawContent = String(formData.get('contentJson') ?? '').trim();
  if (rawContent) {
    try {
      content = JSON.parse(rawContent);
    } catch {
      return { error: 'Section content is not valid JSON.', fieldErrors: { contentJson: 'Invalid JSON' } };
    }
  }

  const parsed = pageSchema.safeParse({
    ...formToObject(formData),
    noindex: checkbox(formData, 'noindex'),
    content,
  });
  if (!parsed.success) return { error: 'Please check the highlighted fields.', fieldErrors: toFieldErrors(parsed.error) };

  const { content: parsedContent, ...rest } = parsed.data;
  const data = { ...rest, content: J(parsedContent) };

  const saved = await prisma.page.upsert({ where: { key }, update: data, create: { key, ...data } });

  await setContentLinks('PAGE', saved.id, relatedRefs(formData));

  revalidatePublic(`/${key === 'home' ? '' : key}`);
  revalidatePath('/admin/pages');
  return { ok: true };
}

// -------------------------------------------------------------- statistics

export async function saveStatistic(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await guard();
  const id = String(formData.get('id') ?? '');
  const parsed = statisticSchema.safeParse({ ...formToObject(formData), visible: checkbox(formData, 'visible') });
  if (!parsed.success) return { error: 'Please check the highlighted fields.', fieldErrors: toFieldErrors(parsed.error) };

  if (id) await prisma.statistic.update({ where: { id }, data: parsed.data });
  else await prisma.statistic.create({ data: parsed.data });

  revalidatePublic('/about');
  revalidatePath('/admin/statistics');
  return { ok: true };
}

export async function deleteStatistic(formData: FormData) {
  await guard();
  const id = String(formData.get('id') ?? '');
  if (id) await prisma.statistic.delete({ where: { id } });
  revalidatePublic('/about');
  revalidatePath('/admin/statistics');
}

// ------------------------------------------------------------ testimonials

export async function saveTestimonial(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await guard();
  const id = String(formData.get('id') ?? '');
  const parsed = testimonialSchema.safeParse({
    ...formToObject(formData),
    published: checkbox(formData, 'published'),
    rating: nullableId(formData.get('rating')),
  });
  if (!parsed.success) return { error: 'Please check the highlighted fields.', fieldErrors: toFieldErrors(parsed.error) };

  if (id) await prisma.testimonial.update({ where: { id }, data: parsed.data });
  else await prisma.testimonial.create({ data: parsed.data });

  revalidatePublic('/about');
  revalidatePath('/admin/testimonials');
  return { ok: true };
}

export async function deleteTestimonial(formData: FormData) {
  await guard();
  const id = String(formData.get('id') ?? '');
  if (id) await prisma.testimonial.delete({ where: { id } });
  revalidatePublic('/about');
  revalidatePath('/admin/testimonials');
}

// -------------------------------------------------------------- navigation

export async function saveNavigationItem(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await guard();
  const id = String(formData.get('id') ?? '');
  const parsed = navigationSchema.safeParse({
    ...formToObject(formData),
    visible: checkbox(formData, 'visible'),
    external: checkbox(formData, 'external'),
  });
  if (!parsed.success) return { error: 'Please check the highlighted fields.', fieldErrors: toFieldErrors(parsed.error) };

  if (id) await prisma.navigationItem.update({ where: { id }, data: parsed.data });
  else await prisma.navigationItem.create({ data: parsed.data });

  revalidateEverything();
  revalidatePath('/admin/navigation');
  return { ok: true };
}

export async function deleteNavigationItem(formData: FormData) {
  await guard();
  const id = String(formData.get('id') ?? '');
  if (id) await prisma.navigationItem.delete({ where: { id } });
  revalidateEverything();
  revalidatePath('/admin/navigation');
}

// ----------------------------------------------------------- system stages

export async function saveSystemStage(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await guard();
  const id = String(formData.get('id') ?? '');
  const parsed = systemStageSchema.safeParse({
    ...formToObject(formData),
    visible: checkbox(formData, 'visible'),
    services: String(formData.get('services') ?? '')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean),
  });
  if (!parsed.success) return { error: 'Please check the highlighted fields.', fieldErrors: toFieldErrors(parsed.error) };

  const { services, ...rest } = parsed.data;
  const data = { ...rest, services: J(services) };

  if (id) await prisma.systemStage.update({ where: { id }, data });
  else await prisma.systemStage.create({ data });

  revalidatePublic();
  revalidatePath('/admin/system');
  return { ok: true };
}

export async function deleteSystemStage(formData: FormData) {
  await guard();
  const id = String(formData.get('id') ?? '');
  if (id) await prisma.systemStage.delete({ where: { id } });
  revalidatePublic();
  revalidatePath('/admin/system');
}

// -------------------------------------------------------------- taxonomies

type TaxonomyKind = 'service' | 'work' | 'insight' | 'resource';

export async function saveTaxonomy(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await guard();
  const kind = String(formData.get('kind') ?? '') as TaxonomyKind;
  const id = String(formData.get('id') ?? '');

  const parsed = taxonomySchema.safeParse({ ...formToObject(formData), visible: checkbox(formData, 'visible') });
  if (!parsed.success) return { error: 'Please check the highlighted fields.', fieldErrors: toFieldErrors(parsed.error) };

  const { descriptionEn, descriptionAr, ...common } = parsed.data;

  if (kind === 'service') {
    const data = { ...common, descriptionEn, descriptionAr };
    if (id) await prisma.serviceCategory.update({ where: { id }, data });
    else await prisma.serviceCategory.create({ data });
  } else if (kind === 'work') {
    if (id) await prisma.workCategory.update({ where: { id }, data: common });
    else await prisma.workCategory.create({ data: common });
  } else if (kind === 'insight') {
    if (id) await prisma.insightCategory.update({ where: { id }, data: common });
    else await prisma.insightCategory.create({ data: common });
  } else if (kind === 'resource') {
    const data = { ...common, descriptionEn, descriptionAr };
    if (id) await prisma.resourceCategory.update({ where: { id }, data });
    else await prisma.resourceCategory.create({ data });
  } else {
    return fail('Unknown category type.');
  }

  revalidatePublic('/services', '/work', '/insights', '/library');
  revalidatePath('/admin/taxonomies');
  return { ok: true };
}

export async function deleteTaxonomy(formData: FormData) {
  await guard();
  const kind = String(formData.get('kind') ?? '') as TaxonomyKind;
  const id = String(formData.get('id') ?? '');
  if (!id) return;

  // Related content is detached rather than deleted (schema uses SetNull).
  if (kind === 'service') await prisma.serviceCategory.delete({ where: { id } });
  else if (kind === 'work') await prisma.workCategory.delete({ where: { id } });
  else if (kind === 'insight') await prisma.insightCategory.delete({ where: { id } });
  else if (kind === 'resource') await prisma.resourceCategory.delete({ where: { id } });

  revalidatePublic('/services', '/work', '/insights', '/library');
  revalidatePath('/admin/taxonomies');
}

// --------------------------------------------------------------- inquiries

export async function updateInquiry(formData: FormData) {
  await guard();
  const id = String(formData.get('id') ?? '');
  const status = String(formData.get('status') ?? '');
  const notes = String(formData.get('notes') ?? '').slice(0, 4000);

  const allowed = ['NEW', 'CONTACTED', 'COMPLETED', 'ARCHIVED'] as const;
  if (!id || !(allowed as readonly string[]).includes(status)) return;

  await prisma.projectInquiry.update({
    where: { id },
    data: { status: status as (typeof allowed)[number], notes },
  });
  revalidatePath('/admin/inquiries');
  revalidatePath(`/admin/inquiries/${id}`);
}

export async function deleteInquiry(formData: FormData) {
  await guard();
  const id = String(formData.get('id') ?? '');
  if (!id) return;

  // Remove the private attachments from disk before dropping the record.
  const attachments = await prisma.projectInquiryAttachment.findMany({ where: { inquiryId: id } });
  for (const a of attachments) await deleteStoredFile('private', a.storageKey);

  await prisma.projectInquiry.delete({ where: { id } });
  revalidatePath('/admin/inquiries');
  redirect('/admin/inquiries');
}

export async function updateContactMessage(formData: FormData) {
  await guard();
  const id = String(formData.get('id') ?? '');
  const status = String(formData.get('status') ?? '');
  const allowed = ['NEW', 'CONTACTED', 'COMPLETED', 'ARCHIVED'] as const;
  if (!id || !(allowed as readonly string[]).includes(status)) return;

  await prisma.contactMessage.update({ where: { id }, data: { status: status as (typeof allowed)[number] } });
  revalidatePath('/admin/messages');
}

export async function deleteContactMessage(formData: FormData) {
  await guard();
  const id = String(formData.get('id') ?? '');
  if (id) await prisma.contactMessage.delete({ where: { id } });
  revalidatePath('/admin/messages');
}

// ------------------------------------------------------------------- media

export async function deleteMedia(formData: FormData) {
  await guard();
  const id = String(formData.get('id') ?? '');
  const media = await prisma.media.findUnique({ where: { id } });
  if (!media) return;

  const key = media.url.replace(/^\/media\//, '');
  await deleteStoredFile('public', key);
  await prisma.media.delete({ where: { id } });

  revalidatePath('/admin/media');
}

export async function updateMediaAlt(formData: FormData) {
  await guard();
  const id = String(formData.get('id') ?? '');
  if (!id) return;
  await prisma.media.update({
    where: { id },
    data: {
      altEn: String(formData.get('altEn') ?? '').slice(0, 300),
      altAr: String(formData.get('altAr') ?? '').slice(0, 300),
    },
  });
  revalidatePath('/admin/media');
}
