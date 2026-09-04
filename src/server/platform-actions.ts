'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import type { Prisma } from '@prisma/client';
import { prisma } from '@/lib/db';
import { locales } from '@/lib/i18n';
import { requireUser } from '@/lib/auth';
import { designTokensSchema } from '@/lib/design-tokens';
import { toolConfigSchema, checkFormula } from '@/lib/tool-engine';
import { setContentLinks, deleteContentLinksFor, parseRef } from '@/lib/relations';
import {
  deleteStoredFile,
  storeFile,
  sniffMime,
  safeDisplayName,
  RESOURCE_MIME,
  MAX_RESOURCE_BYTES,
} from '@/lib/storage';
import { resourceSchema, toolSchema, socialLinkSchema, floatingActionSchema } from '@/lib/validation';
import { formToObject, checkbox, nullableId, toFieldErrors, type ActionState } from './helpers';

const J = (v: unknown) => v as Prisma.InputJsonValue;

function revalidatePublic(...paths: string[]) {
  for (const locale of locales) {
    revalidatePath(`/${locale}`);
    for (const p of paths) revalidatePath(`/${locale}${p}`);
  }
  revalidatePath('/sitemap.xml');
}

/** Layout-level content (tokens, social, floating buttons) affects every page. */
function revalidateChrome() {
  for (const locale of locales) revalidatePath(`/${locale}`, 'layout');
}

async function guard() {
  await requireUser();
}

function fail(error: string): ActionState {
  return { error };
}

/** Reads the relation picker's `related[]` values into content refs. */
function relatedRefs(formData: FormData) {
  return formData
    .getAll('related[]')
    .map((value) => parseRef(String(value)))
    .filter((ref): ref is NonNullable<typeof ref> => ref !== null);
}

// --------------------------------------------------------------- design system

export async function saveDesignTokens(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await guard();
  const raw = formToObject(formData) as Record<string, string>;

  const section = (prefix: string) =>
    Object.fromEntries(
      Object.entries(raw)
        .filter(([key, value]) => key.startsWith(prefix) && String(value).trim() !== '')
        .map(([key, value]) => [key.slice(prefix.length), value]),
    );

  const parsed = designTokensSchema.safeParse({
    colors: section('color.'),
    typography: section('type.'),
    shape: section('shape.'),
  });
  if (!parsed.success) {
    return { error: 'Please check the highlighted values.', fieldErrors: toFieldErrors(parsed.error) };
  }

  const data = {
    colors: J(parsed.data.colors),
    typography: J(parsed.data.typography),
    shape: J(parsed.data.shape),
  };

  await prisma.designTokens.upsert({ where: { id: 'singleton' }, update: data, create: { id: 'singleton', ...data } });

  revalidateChrome();
  revalidatePath('/admin/design');
  return { ok: true };
}

/** Clears every override, returning the site to the shipped brand defaults. */
export async function resetDesignTokens() {
  await guard();
  await prisma.designTokens.upsert({
    where: { id: 'singleton' },
    update: { colors: J({}), typography: J({}), shape: J({}) },
    create: { id: 'singleton' },
  });
  revalidateChrome();
  revalidatePath('/admin/design');
}

// ------------------------------------------------------------ social & contact

export async function saveSocialLink(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await guard();
  const id = String(formData.get('id') ?? '');

  const parsed = socialLinkSchema.safeParse({ ...formToObject(formData), enabled: checkbox(formData, 'enabled') });
  if (!parsed.success) return { error: 'Please check the highlighted fields.', fieldErrors: toFieldErrors(parsed.error) };

  if (id) await prisma.socialLink.update({ where: { id }, data: parsed.data });
  else await prisma.socialLink.create({ data: parsed.data });

  revalidateChrome();
  revalidatePath('/admin/social');
  return { ok: true };
}

export async function deleteSocialLink(formData: FormData) {
  await guard();
  const id = String(formData.get('id') ?? '');
  if (id) await prisma.socialLink.delete({ where: { id } });
  revalidateChrome();
  revalidatePath('/admin/social');
}

export async function saveFloatingAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await guard();
  const id = String(formData.get('id') ?? '');

  const parsed = floatingActionSchema.safeParse({ ...formToObject(formData), enabled: checkbox(formData, 'enabled') });
  if (!parsed.success) return { error: 'Please check the highlighted fields.', fieldErrors: toFieldErrors(parsed.error) };

  if (id) await prisma.floatingAction.update({ where: { id }, data: parsed.data });
  else await prisma.floatingAction.create({ data: parsed.data });

  revalidateChrome();
  revalidatePath('/admin/social');
  return { ok: true };
}

export async function deleteFloatingAction(formData: FormData) {
  await guard();
  const id = String(formData.get('id') ?? '');
  if (id) await prisma.floatingAction.delete({ where: { id } });
  revalidateChrome();
  revalidatePath('/admin/social');
}

// ---------------------------------------------------------------- resources

/**
 * Validates and stores an uploaded document.
 *
 * The type is sniffed from the bytes rather than trusted from the browser, the
 * name on disk is random, and the file lands in the private scope — it is only
 * ever reachable through the download route, which checks the resource is
 * published first.
 */
type StoredResourceFile = { fileKey: string; fileName: string; fileMime: string; fileSize: number };

async function storeResourceFile(file: File): Promise<{ error: string } | { file: StoredResourceFile }> {
  if (file.size > MAX_RESOURCE_BYTES) {
    return { error: `"${safeDisplayName(file.name)}" is larger than 25 MB.` };
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const mime = sniffMime(buffer);
  if (!mime || !(RESOURCE_MIME as readonly string[]).includes(mime)) {
    return { error: 'Only PDF, Word (.doc/.docx) and Excel (.xls/.xlsx) files can be uploaded.' };
  }

  const { storageKey } = await storeFile(buffer, mime, 'private');
  return {
    file: {
      fileKey: storageKey,
      fileName: safeDisplayName(file.name),
      fileMime: mime,
      fileSize: buffer.length,
    },
  };
}

export async function saveResource(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await guard();
  const id = String(formData.get('id') ?? '');

  const parsed = resourceSchema.safeParse({
    ...formToObject(formData),
    categoryId: nullableId(formData.get('categoryId')),
    featured: checkbox(formData, 'featured'),
    noindex: checkbox(formData, 'noindex'),
    tags: String(formData.get('tags') ?? '')
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean),
    includes: String(formData.get('includes') ?? '')
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean)
      .map((line) => {
        const [en, ar] = line.split('|').map((part) => part.trim());
        return { labelEn: en ?? '', labelAr: ar ?? '' };
      }),
    audience: String(formData.get('audience') ?? '')
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean)
      .map((line) => {
        const [en, ar] = line.split('|').map((part) => part.trim());
        return { labelEn: en ?? '', labelAr: ar ?? '' };
      }),
  });
  if (!parsed.success) return { error: 'Please check the highlighted fields.', fieldErrors: toFieldErrors(parsed.error) };

  const { publishedAt, tags, includes, audience, ...rest } = parsed.data;

  const clash = await prisma.resource.findFirst({ where: { slug: rest.slug, NOT: id ? { id } : undefined } });
  if (clash) return fail('Another resource already uses that slug.');

  const existing = id ? await prisma.resource.findUnique({ where: { id } }) : null;
  if (id && !existing) return fail('That resource no longer exists.');

  let fileFields: StoredResourceFile | null = null;
  const upload = formData.get('file');
  if (upload instanceof File && upload.size > 0) {
    const result = await storeResourceFile(upload);
    if ('error' in result) return fail(result.error);
    fileFields = result.file;
  }

  const publishDate = publishedAt ? new Date(publishedAt) : null;
  const data = {
    ...rest,
    tags: J(tags),
    includes: J(includes),
    audience: J(audience),
    publishedAt:
      publishDate && !Number.isNaN(publishDate.getTime())
        ? publishDate
        : rest.status === 'PUBLISHED'
          ? (existing?.publishedAt ?? new Date())
          : (existing?.publishedAt ?? null),
    ...(fileFields ?? {}),
  };

  // A published resource with nothing to download is a dead end for the visitor.
  if (data.status === 'PUBLISHED' && !data.externalUrl && !(fileFields?.fileKey ?? existing?.fileKey)) {
    return fail('Attach a file or an external URL before publishing this resource.');
  }

  const saved = id
    ? await prisma.resource.update({ where: { id }, data })
    : await prisma.resource.create({ data });

  // The replaced file is removed only once the new row is safely written.
  if (fileFields && existing?.fileKey) await deleteStoredFile('private', existing.fileKey);

  await setContentLinks('RESOURCE', saved.id, relatedRefs(formData));

  revalidatePublic('/library', `/library/${saved.slug}`);
  revalidatePath('/admin/resources');
  if (!id) redirect(`/admin/resources/${saved.id}`);
  return { ok: true };
}

export async function deleteResource(formData: FormData) {
  await guard();
  const id = String(formData.get('id') ?? '');
  if (!id) return;

  const resource = await prisma.resource.findUnique({ where: { id } });
  if (resource) {
    await prisma.resource.delete({ where: { id } });
    await deleteContentLinksFor('RESOURCE', id);
    if (resource.fileKey) await deleteStoredFile('private', resource.fileKey);
  }

  revalidatePublic('/library');
  revalidatePath('/admin/resources');
  redirect('/admin/resources');
}

export async function toggleResourceStatus(formData: FormData) {
  await guard();
  const id = String(formData.get('id') ?? '');
  const resource = await prisma.resource.findUnique({ where: { id } });
  if (!resource) return;

  // Publishing is blocked for the same reason as in the form: no file, no page.
  if (resource.status === 'DRAFT' && !resource.fileKey && !resource.externalUrl) return;

  const next = resource.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED';
  await prisma.resource.update({
    where: { id },
    data: { status: next, publishedAt: next === 'PUBLISHED' ? (resource.publishedAt ?? new Date()) : resource.publishedAt },
  });

  revalidatePublic('/library', `/library/${resource.slug}`);
  revalidatePath('/admin/resources');
}

// -------------------------------------------------------------------- tools

export async function saveTool(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await guard();
  const id = String(formData.get('id') ?? '');

  const parsed = toolSchema.safeParse({
    ...formToObject(formData),
    featured: checkbox(formData, 'featured'),
    noindex: checkbox(formData, 'noindex'),
  });
  if (!parsed.success) return { error: 'Please check the highlighted fields.', fieldErrors: toFieldErrors(parsed.error) };

  let rawConfig: unknown;
  try {
    rawConfig = JSON.parse(String(formData.get('configJson') ?? '{}').trim() || '{}');
  } catch {
    return { error: 'The calculator definition is not valid JSON.', fieldErrors: { configJson: 'Invalid JSON' } };
  }

  const config = toolConfigSchema.safeParse(rawConfig);
  if (!config.success) {
    return {
      error: 'The calculator definition is not valid.',
      fieldErrors: { configJson: toFieldErrors(config.error).form ?? Object.values(toFieldErrors(config.error))[0] ?? 'Invalid' },
    };
  }

  // Formulas are checked here so a broken tool can never reach a visitor.
  const known = config.data.inputs.map((i) => i.key);
  for (const output of config.data.outputs) {
    const problem = checkFormula(output.expression, [...known, ...config.data.outputs.map((o) => o.key)]);
    if (problem) {
      return { error: `Formula for "${output.key}": ${problem}`, fieldErrors: { configJson: problem } };
    }
  }

  const clash = await prisma.tool.findFirst({ where: { slug: parsed.data.slug, NOT: id ? { id } : undefined } });
  if (clash) return fail('Another tool already uses that slug.');

  if (parsed.data.status === 'PUBLISHED' && config.data.outputs.length === 0) {
    return fail('Add at least one result before publishing this tool.');
  }

  const data = { ...parsed.data, config: J(config.data) };

  const saved = id ? await prisma.tool.update({ where: { id }, data }) : await prisma.tool.create({ data });

  await setContentLinks('TOOL', saved.id, relatedRefs(formData));

  revalidatePublic('/tools', `/tools/${saved.slug}`);
  revalidatePath('/admin/tools');
  if (!id) redirect(`/admin/tools/${saved.id}`);
  return { ok: true };
}

export async function deleteTool(formData: FormData) {
  await guard();
  const id = String(formData.get('id') ?? '');
  if (id) {
    await prisma.tool.delete({ where: { id } });
    await deleteContentLinksFor('TOOL', id);
  }
  revalidatePublic('/tools');
  revalidatePath('/admin/tools');
  redirect('/admin/tools');
}

export async function toggleToolStatus(formData: FormData) {
  await guard();
  const id = String(formData.get('id') ?? '');
  const tool = await prisma.tool.findUnique({ where: { id } });
  if (!tool) return;

  await prisma.tool.update({
    where: { id },
    data: { status: tool.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED' },
  });

  revalidatePublic('/tools', `/tools/${tool.slug}`);
  revalidatePath('/admin/tools');
}
