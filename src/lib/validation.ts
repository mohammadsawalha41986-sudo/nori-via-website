import { z } from 'zod';

const trimmed = (max: number) => z.string().trim().max(max);

export const inquirySchema = z.object({
  name: trimmed(120).min(2),
  business: trimmed(160).default(''),
  website: trimmed(200).default(''),
  social: trimmed(200).default(''),
  services: z.array(trimmed(80)).min(1).max(20),
  goals: z.array(trimmed(120)).max(20).default([]),
  description: trimmed(5000).default(''),
  budget: trimmed(80).default(''),
  timeline: trimmed(80).default(''),
  email: z.string().trim().email().max(160),
  phone: trimmed(40).default(''),
  whatsapp: trimmed(40).default(''),
  preferredContact: z.enum(['email', 'phone', 'whatsapp']).default('email'),
  locale: z.enum(['en', 'ar']).default('en'),
  /** Honeypot: real visitors never fill this in. */
  company_website: z.string().max(0).optional().or(z.literal('')),
});

export type InquiryInput = z.infer<typeof inquirySchema>;

export const contactSchema = z.object({
  name: trimmed(120).min(2),
  email: z.string().trim().email().max(160),
  phone: trimmed(40).default(''),
  subject: trimmed(160).default(''),
  message: trimmed(4000).min(10),
  locale: z.enum(['en', 'ar']).default('en'),
  company_website: z.string().max(0).optional().or(z.literal('')),
});

export const loginSchema = z.object({
  email: z.string().trim().email().max(160),
  password: z.string().min(8).max(200),
});

const publishStatus = z.enum(['DRAFT', 'PUBLISHED']);
const jsonArray = z.array(z.any()).default([]);
const optionalUrl = z.string().trim().max(500).default('');

export const serviceSchema = z.object({
  slug: z.string().trim().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Use lowercase letters, numbers and hyphens').max(120),
  nameEn: trimmed(160).min(1),
  nameAr: trimmed(160).default(''),
  categoryId: z.string().trim().max(40).nullable().default(null),
  summaryEn: trimmed(600).default(''),
  summaryAr: trimmed(600).default(''),
  heroHeadlineEn: trimmed(300).default(''),
  heroHeadlineAr: trimmed(300).default(''),
  heroDescriptionEn: trimmed(1200).default(''),
  heroDescriptionAr: trimmed(1200).default(''),
  whatWeDoEn: trimmed(6000).default(''),
  whatWeDoAr: trimmed(6000).default(''),
  whyItMattersEn: trimmed(6000).default(''),
  whyItMattersAr: trimmed(6000).default(''),
  approachEn: trimmed(6000).default(''),
  approachAr: trimmed(6000).default(''),
  deliverables: jsonArray,
  process: jsonArray,
  benefits: jsonArray,
  faqs: jsonArray,
  featuredImage: optionalUrl,
  gallery: jsonArray,
  seoTitleEn: trimmed(200).default(''),
  seoTitleAr: trimmed(200).default(''),
  seoDescriptionEn: trimmed(400).default(''),
  seoDescriptionAr: trimmed(400).default(''),
  ogImage: optionalUrl,
  noindex: z.boolean().default(false),
  status: publishStatus.default('DRAFT'),
  order: z.coerce.number().int().min(0).max(9999).default(0),
});

export const projectSchema = z.object({
  slug: z.string().trim().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).max(120),
  titleEn: trimmed(200).min(1),
  titleAr: trimmed(200).default(''),
  client: trimmed(160).default(''),
  categoryId: z.string().trim().max(40).nullable().default(null),
  descriptionEn: trimmed(6000).default(''),
  descriptionAr: trimmed(6000).default(''),
  heroMediaUrl: optionalUrl,
  heroMediaKind: z.enum(['IMAGE', 'VIDEO', 'DOCUMENT']).default('IMAGE'),
  gallery: jsonArray,
  videos: jsonArray,
  downloads: jsonArray,
  year: z.coerce.number().int().min(1900).max(2200).nullable().default(null),
  location: trimmed(160).default(''),
  results: jsonArray,
  featured: z.boolean().default(false),
  status: publishStatus.default('DRAFT'),
  order: z.coerce.number().int().min(0).max(9999).default(0),
  serviceIds: z.array(z.string().max(40)).default([]),
  seoTitleEn: trimmed(200).default(''),
  seoTitleAr: trimmed(200).default(''),
  seoDescriptionEn: trimmed(400).default(''),
  seoDescriptionAr: trimmed(400).default(''),
  ogImage: optionalUrl,
  noindex: z.boolean().default(false),
});

export const caseStudySchema = z.object({
  slug: z.string().trim().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).max(120),
  titleEn: trimmed(200).min(1),
  titleAr: trimmed(200).default(''),
  projectId: z.string().trim().max(40).nullable().default(null),
  challengeEn: trimmed(6000).default(''), challengeAr: trimmed(6000).default(''),
  strategyEn: trimmed(6000).default(''), strategyAr: trimmed(6000).default(''),
  ideaEn: trimmed(6000).default(''), ideaAr: trimmed(6000).default(''),
  creativeEn: trimmed(6000).default(''), creativeAr: trimmed(6000).default(''),
  campaignEn: trimmed(6000).default(''), campaignAr: trimmed(6000).default(''),
  resultEn: trimmed(6000).default(''), resultAr: trimmed(6000).default(''),
  outcomeEn: trimmed(6000).default(''), outcomeAr: trimmed(6000).default(''),
  metrics: jsonArray,
  gallery: jsonArray,
  videos: jsonArray,
  files: jsonArray,
  heroMediaUrl: optionalUrl,
  serviceIds: z.array(z.string().max(40)).default([]),
  seoTitleEn: trimmed(200).default(''),
  seoTitleAr: trimmed(200).default(''),
  seoDescriptionEn: trimmed(400).default(''),
  seoDescriptionAr: trimmed(400).default(''),
  ogImage: optionalUrl,
  noindex: z.boolean().default(false),
  status: publishStatus.default('DRAFT'),
  order: z.coerce.number().int().min(0).max(9999).default(0),
});

export const insightSchema = z.object({
  slug: z.string().trim().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).max(120),
  titleEn: trimmed(200).min(1),
  titleAr: trimmed(200).default(''),
  excerptEn: trimmed(600).default(''),
  excerptAr: trimmed(600).default(''),
  contentEn: trimmed(60000).default(''),
  contentAr: trimmed(60000).default(''),
  coverImage: optionalUrl,
  categoryId: z.string().trim().max(40).nullable().default(null),
  tags: z.array(trimmed(60)).default([]),
  author: trimmed(120).default(''),
  publishedAt: z.string().trim().max(40).default(''),
  status: publishStatus.default('DRAFT'),
  seoTitleEn: trimmed(200).default(''),
  seoTitleAr: trimmed(200).default(''),
  seoDescriptionEn: trimmed(400).default(''),
  seoDescriptionAr: trimmed(400).default(''),
  ogImage: optionalUrl,
  noindex: z.boolean().default(false),
});

export const settingsSchema = z.object({
  companyNameEn: trimmed(160).default(''), companyNameAr: trimmed(160).default(''),
  taglineEn: trimmed(240).default(''), taglineAr: trimmed(240).default(''),
  descriptionEn: trimmed(1000).default(''), descriptionAr: trimmed(1000).default(''),
  logoUrl: optionalUrl, logoMarkUrl: optionalUrl, logoInverseUrl: optionalUrl,
  faviconUrl: optionalUrl, defaultOgImage: optionalUrl,
  inquiryEmail: trimmed(160).default(''), contactEmail: trimmed(160).default(''),
  phone: trimmed(60).default(''), whatsapp: trimmed(60).default(''),
  addressEn: trimmed(400).default(''), addressAr: trimmed(400).default(''), mapsUrl: optionalUrl,
  instagram: optionalUrl, tiktok: optionalUrl, linkedin: optionalUrl, x: optionalUrl, youtube: optionalUrl,
  footerDescriptionEn: trimmed(800).default(''), footerDescriptionAr: trimmed(800).default(''),
  copyrightEn: trimmed(300).default(''), copyrightAr: trimmed(300).default(''),
  seoTitleEn: trimmed(200).default(''), seoTitleAr: trimmed(200).default(''),
  seoDescriptionEn: trimmed(400).default(''), seoDescriptionAr: trimmed(400).default(''),
  gaId: trimmed(60).default(''), gtmId: trimmed(60).default(''),
});

export const homepageSchema = z.object({
  heroEyebrowEn: trimmed(200).default(''), heroEyebrowAr: trimmed(200).default(''),
  heroHeadlineEn: trimmed(400).default(''), heroHeadlineAr: trimmed(400).default(''),
  heroSubtitleEn: trimmed(600).default(''), heroSubtitleAr: trimmed(600).default(''),
  heroPrimaryCtaEn: trimmed(80).default(''), heroPrimaryCtaAr: trimmed(80).default(''),
  heroSecondaryCtaEn: trimmed(80).default(''), heroSecondaryCtaAr: trimmed(80).default(''),
  heroMediaUrl: optionalUrl,
  heroMediaKind: z.enum(['IMAGE', 'VIDEO', 'DOCUMENT']).default('IMAGE'),
  statementEn: trimmed(1200).default(''), statementAr: trimmed(1200).default(''),
  statementSupportEn: trimmed(1200).default(''), statementSupportAr: trimmed(1200).default(''),
  systemHeadlineEn: trimmed(300).default(''), systemHeadlineAr: trimmed(300).default(''),
  intelligenceHeadlineEn: trimmed(300).default(''), intelligenceHeadlineAr: trimmed(300).default(''),
  intelligenceBodyEn: trimmed(3000).default(''), intelligenceBodyAr: trimmed(3000).default(''),
  intelligenceItems: jsonArray,
  featuredCaseStudyId: z.string().trim().max(40).nullable().default(null),
  ctaHeadlineEn: trimmed(300).default(''), ctaHeadlineAr: trimmed(300).default(''),
  ctaDescriptionEn: trimmed(800).default(''), ctaDescriptionAr: trimmed(800).default(''),
  ctaLabelEn: trimmed(80).default(''), ctaLabelAr: trimmed(80).default(''),
});

export const statisticSchema = z.object({
  value: trimmed(40).min(1),
  labelEn: trimmed(160).min(1), labelAr: trimmed(160).default(''),
  descriptionEn: trimmed(400).default(''), descriptionAr: trimmed(400).default(''),
  visible: z.boolean().default(false),
  order: z.coerce.number().int().min(0).max(9999).default(0),
});

export const testimonialSchema = z.object({
  name: trimmed(120).min(1),
  company: trimmed(160).default(''),
  role: trimmed(160).default(''),
  quoteEn: trimmed(1200).min(1), quoteAr: trimmed(1200).default(''),
  imageUrl: optionalUrl,
  rating: z.coerce.number().int().min(1).max(5).nullable().default(null),
  published: z.boolean().default(false),
  order: z.coerce.number().int().min(0).max(9999).default(0),
});

export const navigationSchema = z.object({
  labelEn: trimmed(80).min(1), labelAr: trimmed(80).default(''),
  href: trimmed(300).min(1),
  location: z.enum(['header', 'footer']).default('header'),
  order: z.coerce.number().int().min(0).max(9999).default(0),
  visible: z.boolean().default(true),
  external: z.boolean().default(false),
});

export const pageSchema = z.object({
  titleEn: trimmed(300).default(''), titleAr: trimmed(300).default(''),
  bodyEn: trimmed(30000).default(''), bodyAr: trimmed(30000).default(''),
  content: z.any().default({}),
  seoTitleEn: trimmed(200).default(''), seoTitleAr: trimmed(200).default(''),
  seoDescriptionEn: trimmed(400).default(''), seoDescriptionAr: trimmed(400).default(''),
  canonical: optionalUrl,
  ogImage: optionalUrl,
  noindex: z.boolean().default(false),
});

export const systemStageSchema = z.object({
  step: trimmed(8).min(1),
  titleEn: trimmed(160).min(1), titleAr: trimmed(160).default(''),
  descriptionEn: trimmed(1200).default(''), descriptionAr: trimmed(1200).default(''),
  services: jsonArray,
  mediaUrl: optionalUrl,
  order: z.coerce.number().int().min(0).max(9999).default(0),
  visible: z.boolean().default(true),
});

export const taxonomySchema = z.object({
  slug: z.string().trim().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).max(120),
  nameEn: trimmed(160).min(1),
  nameAr: trimmed(160).default(''),
  descriptionEn: trimmed(600).default(''),
  descriptionAr: trimmed(600).default(''),
  order: z.coerce.number().int().min(0).max(9999).default(0),
  visible: z.boolean().default(true),
});

export function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 120);
}
