import { cache } from 'react';
import { z } from 'zod';
import { prisma } from './db';

/**
 * Editable brand design tokens.
 *
 * Every token has a shipped default that matches the Noriva brand, and Admin
 * stores only the values that were actually changed. The public site renders
 * the overrides as CSS custom properties, which Tailwind reads through
 * `rgb(var(--c-…) / <alpha-value>)` — so an edit propagates everywhere,
 * opacity modifiers included, without touching a single component.
 */

const HEX = /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;
const hex = z.string().trim().regex(HEX, 'Use a hex colour such as #F5106E');

/** Colour tokens exposed in Admin. The rest of the ramp keeps its defaults. */
export const COLOR_TOKENS = [
  { key: 'brand', cssVar: '--c-brand-500', label: 'Brand / primary', default: '#F5106E' },
  { key: 'brandDark', cssVar: '--c-brand-600', label: 'Brand pressed', default: '#D6005A' },
  { key: 'brandLight', cssVar: '--c-brand-300', label: 'Brand on dark', default: '#FF8DBB' },
  { key: 'ink', cssVar: '--c-ink-900', label: 'Headings / dark surface', default: '#0B1225' },
  { key: 'inkBody', cssVar: '--c-ink-600', label: 'Body text', default: '#222E4D' },
  { key: 'inkMuted', cssVar: '--c-ink-400', label: 'Muted text', default: '#5F6B8C' },
  { key: 'border', cssVar: '--c-ink-100', label: 'Borders', default: '#E6E9F0' },
  { key: 'background', cssVar: '--c-bone', label: 'Page background', default: '#F7F5F2' },
] as const;

export type ColorKey = (typeof COLOR_TOKENS)[number]['key'];

/**
 * Font choices are a fixed, self-hosted set loaded through `next/font`. An
 * arbitrary family name is never accepted: it would either fail to load or
 * pull a third-party request into the critical path.
 */
export const SANS_FONTS = [
  { key: 'inter', label: 'Inter' },
  { key: 'manrope', label: 'Manrope' },
  { key: 'jakarta', label: 'Plus Jakarta Sans' },
] as const;

export const DISPLAY_FONTS = [
  { key: 'bricolage', label: 'Bricolage Grotesque' },
  { key: 'space', label: 'Space Grotesk' },
  { key: 'archivo', label: 'Archivo' },
] as const;

export const ARABIC_FONTS = [
  { key: 'plex-arabic', label: 'IBM Plex Sans Arabic' },
  { key: 'tajawal', label: 'Tajawal' },
  { key: 'cairo', label: 'Cairo' },
] as const;

const colorsSchema = z.object(
  Object.fromEntries(COLOR_TOKENS.map((t) => [t.key, hex.optional()])) as Record<ColorKey, z.ZodOptional<typeof hex>>,
).partial();

const typographySchema = z
  .object({
    sansFont: z.enum(SANS_FONTS.map((f) => f.key) as [string, ...string[]]),
    displayFont: z.enum(DISPLAY_FONTS.map((f) => f.key) as [string, ...string[]]),
    arabicFont: z.enum(ARABIC_FONTS.map((f) => f.key) as [string, ...string[]]),
    /** Bounded so a bad value can never make the site unreadable. */
    baseSize: z.coerce.number().min(14).max(20),
    lineHeight: z.coerce.number().min(1.3).max(2.2),
    headingWeight: z.coerce.number().int().min(400).max(900),
    headingTracking: z.coerce.number().min(-0.06).max(0.06),
  })
  .partial();

const shapeSchema = z
  .object({
    radiusButton: z.coerce.number().min(0).max(999),
    radiusCard: z.coerce.number().min(0).max(64),
    radiusInput: z.coerce.number().min(0).max(64),
    containerWidth: z.coerce.number().min(64).max(160),
    sectionSpacing: z.coerce.number().min(3).max(12),
  })
  .partial();

export const designTokensSchema = z.object({
  colors: colorsSchema,
  typography: typographySchema,
  shape: shapeSchema,
});

export type DesignTokenValues = z.infer<typeof designTokensSchema>;

export const TOKEN_DEFAULTS: Required<{
  [K in keyof DesignTokenValues]: Required<NonNullable<DesignTokenValues[K]>>;
}> = {
  colors: Object.fromEntries(COLOR_TOKENS.map((t) => [t.key, t.default])) as Record<ColorKey, string>,
  typography: {
    sansFont: 'inter',
    displayFont: 'bricolage',
    arabicFont: 'plex-arabic',
    baseSize: 17,
    lineHeight: 1.75,
    headingWeight: 800,
    headingTracking: -0.03,
  },
  shape: {
    radiusButton: 999,
    radiusCard: 16,
    radiusInput: 10,
    containerWidth: 108,
    sectionSpacing: 6,
  },
};

/** Parses a stored JSON column, discarding anything that no longer validates. */
function safeSection<T extends z.ZodTypeAny>(schema: T, value: unknown): z.infer<T> {
  const parsed = schema.safeParse(value ?? {});
  return parsed.success ? parsed.data : ({} as z.infer<T>);
}

export type ResolvedTokens = {
  colors: Record<ColorKey, string>;
  typography: Required<NonNullable<DesignTokenValues['typography']>>;
  shape: Required<NonNullable<DesignTokenValues['shape']>>;
};

export function resolveTokens(row: {
  colors?: unknown;
  typography?: unknown;
  shape?: unknown;
} | null): ResolvedTokens {
  return {
    colors: { ...TOKEN_DEFAULTS.colors, ...safeSection(colorsSchema, row?.colors) },
    typography: { ...TOKEN_DEFAULTS.typography, ...safeSection(typographySchema, row?.typography) },
    shape: { ...TOKEN_DEFAULTS.shape, ...safeSection(shapeSchema, row?.shape) },
  };
}

export const getDesignTokens = cache(async (): Promise<ResolvedTokens> => {
  const row = await prisma.designTokens.findUnique({ where: { id: 'singleton' } });
  return resolveTokens(row);
});

/** `#F5106E` → `245 16 110`, the channel form Tailwind's alpha modifiers need. */
export function hexToChannels(value: string): string | null {
  if (!HEX.test(value)) return null;
  let h = value.slice(1);
  if (h.length === 3) h = h.split('').map((c) => c + c).join('');
  const n = Number.parseInt(h, 16);
  return `${(n >> 16) & 255} ${(n >> 8) & 255} ${n & 255}`;
}

/**
 * Renders the token overrides as a `:root` block. Only values that differ from
 * the stylesheet defaults are emitted, keeping the inline style tiny.
 */
export function tokensToCss(tokens: ResolvedTokens): string {
  const decls: string[] = [];

  for (const token of COLOR_TOKENS) {
    const value = tokens.colors[token.key];
    if (!value || value.toLowerCase() === token.default.toLowerCase()) continue;
    const channels = hexToChannels(value);
    if (channels) decls.push(`${token.cssVar}:${channels}`);
  }

  const { typography: t, shape: s } = tokens;
  const d = TOKEN_DEFAULTS;

  if (t.baseSize !== d.typography.baseSize) decls.push(`--font-size-base:${t.baseSize}px`);
  if (t.lineHeight !== d.typography.lineHeight) decls.push(`--leading-body:${t.lineHeight}`);
  if (t.headingWeight !== d.typography.headingWeight) decls.push(`--weight-heading:${t.headingWeight}`);
  if (t.headingTracking !== d.typography.headingTracking) decls.push(`--tracking-heading:${t.headingTracking}em`);

  if (s.radiusButton !== d.shape.radiusButton) decls.push(`--radius-btn:${s.radiusButton}px`);
  if (s.radiusCard !== d.shape.radiusCard) decls.push(`--radius-card:${s.radiusCard}px`);
  if (s.radiusInput !== d.shape.radiusInput) decls.push(`--radius-input:${s.radiusInput}px`);
  if (s.containerWidth !== d.shape.containerWidth) decls.push(`--shell-max:${s.containerWidth}rem`);
  if (s.sectionSpacing !== d.shape.sectionSpacing) decls.push(`--section-y:${s.sectionSpacing}rem`);

  return decls.length ? `:root{${decls.join(';')}}` : '';
}
