import { z } from 'zod';

/**
 * Service intake questionnaires.
 *
 * Each service carries its own set of questions, authored in Admin, so a
 * consultant receives a structured brief instead of a one-line message. The
 * questions are data — adding a service, or changing what it asks, needs no
 * code change — and the answers are stored on the existing ProjectInquiry
 * record rather than in a parallel system.
 */

const localised = (max: number) => z.string().trim().max(max).default('');

export const intakeQuestionSchema = z.object({
  key: z.string().trim().regex(/^[a-zA-Z0-9_-]+$/, 'Use letters, numbers, dashes and underscores').max(40),
  labelEn: z.string().trim().min(1).max(300),
  labelAr: localised(300),
  helpEn: localised(400),
  helpAr: localised(400),
  type: z.enum(['text', 'longtext', 'number', 'select', 'multiselect']).default('text'),
  required: z.boolean().default(false),
  /** `value|Arabic label` per line in Admin; both languages are kept. */
  options: z
    .array(z.object({ value: z.string().trim().max(120), labelEn: localised(160), labelAr: localised(160) }))
    .max(40)
    .default([]),
});

export const intakeSchema = z.object({
  headlineEn: localised(200),
  headlineAr: localised(200),
  introEn: localised(1000),
  introAr: localised(1000),
  /** Invitation to attach menus, POS exports, cost sheets and so on. */
  uploadsEn: localised(400),
  uploadsAr: localised(400),
  questions: z.array(intakeQuestionSchema).max(40).default([]),
});

export type IntakeQuestion = z.infer<typeof intakeQuestionSchema>;
export type Intake = z.infer<typeof intakeSchema>;

export const EMPTY_INTAKE: Intake = {
  headlineEn: '',
  headlineAr: '',
  introEn: '',
  introAr: '',
  uploadsEn: '',
  uploadsAr: '',
  questions: [],
};

/** Reads a stored `intake` column, discarding anything that no longer validates. */
export function parseIntake(value: unknown): Intake {
  const parsed = intakeSchema.safeParse(value ?? {});
  return parsed.success ? parsed.data : EMPTY_INTAKE;
}

/** One submitted answer, as stored on the inquiry. */
export const intakeAnswerSchema = z.object({
  key: z.string().trim().max(40),
  label: z.string().trim().max(300),
  value: z.string().trim().max(2000),
});

export type IntakeAnswer = z.infer<typeof intakeAnswerSchema>;

export function asAnswers(value: unknown): IntakeAnswer[] {
  const parsed = z.array(intakeAnswerSchema).safeParse(value);
  return parsed.success ? parsed.data : [];
}

/** The label to show for a question or option in the reader's language. */
export function labelOf(row: { labelEn: string; labelAr: string }, locale: 'en' | 'ar') {
  return (locale === 'ar' ? row.labelAr || row.labelEn : row.labelEn || row.labelAr) || '';
}

export function helpOf(row: { helpEn: string; helpAr: string }, locale: 'en' | 'ar') {
  return locale === 'ar' ? row.helpAr || row.helpEn : row.helpEn || row.helpAr;
}
