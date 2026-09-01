'use client';

/** Client-side event helper. Silently no-ops when no analytics is configured. */
export function track(name: string, meta: Record<string, string | number | boolean> = {}) {
  if (typeof window === 'undefined') return;
  const w = window as unknown as { dataLayer?: unknown[]; gtag?: (...a: unknown[]) => void };
  w.dataLayer?.push({ event: name, ...meta });
  w.gtag?.('event', name, meta);
}

export const EVENTS = {
  startProjectClick: 'start_project_click',
  formStart: 'inquiry_form_start',
  formStep: 'inquiry_form_step',
  formComplete: 'inquiry_form_complete',
  workView: 'work_view',
  caseStudyView: 'case_study_view',
  download: 'asset_download',
  ctaClick: 'cta_click',
} as const;
