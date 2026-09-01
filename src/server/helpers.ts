import 'server-only';
import type { z } from 'zod';

export type ActionState = { ok?: boolean; error?: string; fieldErrors?: Record<string, string> };

/** FormData → plain object, expanding `field[]` keys into arrays. */
export function formToObject(formData: FormData): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [key, value] of formData.entries()) {
    if (value instanceof File) continue;
    if (key.endsWith('[]')) {
      const k = key.slice(0, -2);
      (out[k] ??= [] as string[]) as string[];
      (out[k] as string[]).push(value);
    } else {
      out[key] = value;
    }
  }
  return out;
}

export function checkbox(formData: FormData, name: string) {
  const v = formData.get(name);
  return v === 'on' || v === 'true' || v === '1';
}

export function nullableId(value: FormDataEntryValue | null) {
  const v = String(value ?? '').trim();
  return v === '' ? null : v;
}

/** Parses `label|labelAr` lines from a textarea into localised objects. */
export function parsePairs(raw: string, key = 'label') {
  return raw
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [en, ar] = line.split('|').map((p) => p.trim());
      return { [`${key}En`]: en ?? '', [`${key}Ar`]: ar ?? '' };
    });
}

export function stringifyPairs(items: unknown, key = 'label') {
  if (!Array.isArray(items)) return '';
  return items
    .map((i) => {
      if (!i || typeof i !== 'object') return '';
      const rec = i as Record<string, unknown>;
      const en = String(rec[`${key}En`] ?? '');
      const ar = String(rec[`${key}Ar`] ?? '');
      return ar ? `${en} | ${ar}` : en;
    })
    .filter(Boolean)
    .join('\n');
}

/** Parses `value|labelEn|labelAr` lines into metric objects. */
export function parseMetrics(raw: string) {
  return raw
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
    .map((line) => {
      const [value, labelEn, labelAr] = line.split('|').map((p) => p.trim());
      return { value: value ?? '', labelEn: labelEn ?? '', labelAr: labelAr ?? '' };
    })
    .filter((m) => m.value && m.labelEn);
}

export function stringifyMetrics(items: unknown) {
  if (!Array.isArray(items)) return '';
  return items
    .map((i) => {
      const r = (i ?? {}) as Record<string, unknown>;
      return [r.value, r.labelEn, r.labelAr].filter(Boolean).join(' | ');
    })
    .filter(Boolean)
    .join('\n');
}

/** Parses `url|altEn|altAr` lines into gallery/download entries. */
export function parseUrlList(raw: string, labelKey: 'alt' | 'label' = 'alt') {
  return raw
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
    .map((line) => {
      const [url, en, ar] = line.split('|').map((p) => p.trim());
      return { url: url ?? '', [`${labelKey}En`]: en ?? '', [`${labelKey}Ar`]: ar ?? '' };
    })
    .filter((g) => g.url);
}

export function stringifyUrlList(items: unknown, labelKey: 'alt' | 'label' = 'alt') {
  if (!Array.isArray(items)) return '';
  return items
    .map((i) => {
      const r = (i ?? {}) as Record<string, unknown>;
      return [r.url, r[`${labelKey}En`], r[`${labelKey}Ar`]].filter(Boolean).join(' | ');
    })
    .filter(Boolean)
    .join('\n');
}

/** Parses `titleEn|titleAr|bodyEn|bodyAr` lines into process/section entries. */
export function parseBlocks(raw: string) {
  return raw
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
    .map((line) => {
      const [titleEn, titleAr, bodyEn, bodyAr] = line.split('|').map((p) => p.trim());
      return { titleEn: titleEn ?? '', titleAr: titleAr ?? '', bodyEn: bodyEn ?? '', bodyAr: bodyAr ?? '' };
    })
    .filter((b) => b.titleEn);
}

export function stringifyBlocks(items: unknown) {
  if (!Array.isArray(items)) return '';
  return items
    .map((i) => {
      const r = (i ?? {}) as Record<string, unknown>;
      return [r.titleEn, r.titleAr, r.bodyEn, r.bodyAr].map((v) => String(v ?? '')).join(' | ');
    })
    .join('\n');
}

/** Parses `questionEn|questionAr|answerEn|answerAr` lines. */
export function parseFaqs(raw: string) {
  return raw
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
    .map((line) => {
      const [questionEn, questionAr, answerEn, answerAr] = line.split('|').map((p) => p.trim());
      return { questionEn: questionEn ?? '', questionAr: questionAr ?? '', answerEn: answerEn ?? '', answerAr: answerAr ?? '' };
    })
    .filter((f) => f.questionEn && f.answerEn);
}

export function stringifyFaqs(items: unknown) {
  if (!Array.isArray(items)) return '';
  return items
    .map((i) => {
      const r = (i ?? {}) as Record<string, unknown>;
      return [r.questionEn, r.questionAr, r.answerEn, r.answerAr].map((v) => String(v ?? '')).join(' | ');
    })
    .join('\n');
}

export function toFieldErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.join('.') || 'form';
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}
