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
  /** Set when the request came from a service page's own questionnaire. */
  serviceSlug: trimmed(120).default(''),
  answers: z
    .array(
      z.object({
        key: trimmed(40),
        label: trimmed(300),
        value: trimmed(2000),
      }),
    )
    .max(40)
    .default([]),
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

/**
 * Ten characters is the floor the provisioning scripts already enforce on
 * ADMIN_PASSWORD; the screen must not accept a password the CLI would refuse.
 * The confirmation is compared in the action so the mismatch gets its own
 * message rather than a schema error on a field the administrator did fill in.
 */
export const MIN_PASSWORD_LENGTH = 10;

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1).max(200),
  newPassword: z.string().min(MIN_PASSWORD_LENGTH).max(200),
});

const publishStatus = z.enum(['DRAFT', 'PUBLISHED']);
const jsonArray = z.array(z.any()).default([]);
const optionalUrl = z.string().trim().max(500).default('');

/**
 * An image address the site can actually render: a same-origin path
 * (`/img/…`, `/media/…`) or an `https://` URL, which is what the image
 * optimiser is configured to fetch. Anything else — a `javascript:` paste, a
 * bare filename, a plain-`http` host — is rejected when the form is saved,
 * rather than throwing while a public page renders.
 */
export const IMAGE_URL_HINT = 'Use a path starting with / or a full https:// URL';

export const HEX_COLOUR_HINT = 'Use a hex colour such as #0B1225';
/**
 * A hex colour or nothing. Deliberately strict: the value reaches an inline
 * `style` attribute, so anything that is not a colour must not get through.
 */
export const optionalHexColour = z
  .string()
  .trim()
  .max(9)
  .default('')
  .refine((v) => v === '' || /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/.test(v), HEX_COLOUR_HINT);
const optionalImageUrl = optionalUrl.refine(
  (v) => v === '' || v.startsWith('/') || /^https:\/\/\S+$/i.test(v),
  IMAGE_URL_HINT,
);

/** A gallery row: the image plus its bilingual alt text. */
const galleryList = z
  .array(
    z
      .object({ url: z.string(), altEn: z.string().optional(), altAr: z.string().optional() })
      .passthrough(),
  )
  .default([])
  .superRefine((rows, ctx) => {
    rows.forEach((row, i) => {
      if (!optionalImageUrl.safeParse(row.url).success) {
        ctx.addIssue({ code: 'custom', path: [i, 'url'], message: `Row ${i + 1}: ${IMAGE_URL_HINT}` });
      }
    });
  });


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
  featuredImage: optionalImageUrl,
  gallery: galleryList,
  seoTitleEn: trimmed(200).default(''),
  seoTitleAr: trimmed(200).default(''),
  seoDescriptionEn: trimmed(400).default(''),
  seoDescriptionAr: trimmed(400).default(''),
  ogImage: optionalImageUrl,
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
  heroMediaUrl: optionalImageUrl,
  heroMediaKind: z.enum(['IMAGE', 'VIDEO', 'DOCUMENT']).default('IMAGE'),
  gallery: galleryList,
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
  ogImage: optionalImageUrl,
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
  gallery: galleryList,
  videos: jsonArray,
  files: jsonArray,
  heroMediaUrl: optionalImageUrl,
  serviceIds: z.array(z.string().max(40)).default([]),
  seoTitleEn: trimmed(200).default(''),
  seoTitleAr: trimmed(200).default(''),
  seoDescriptionEn: trimmed(400).default(''),
  seoDescriptionAr: trimmed(400).default(''),
  ogImage: optionalImageUrl,
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
  coverImage: optionalImageUrl,
  categoryId: z.string().trim().max(40).nullable().default(null),
  tags: z.array(trimmed(60)).default([]),
  author: trimmed(120).default(''),
  publishedAt: z.string().trim().max(40).default(''),
  status: publishStatus.default('DRAFT'),
  seoTitleEn: trimmed(200).default(''),
  seoTitleAr: trimmed(200).default(''),
  seoDescriptionEn: trimmed(400).default(''),
  seoDescriptionAr: trimmed(400).default(''),
  ogImage: optionalImageUrl,
  noindex: z.boolean().default(false),
});

export const settingsSchema = z.object({
  companyNameEn: trimmed(160).default(''), companyNameAr: trimmed(160).default(''),
  taglineEn: trimmed(240).default(''), taglineAr: trimmed(240).default(''),
  descriptionEn: trimmed(1000).default(''), descriptionAr: trimmed(1000).default(''),
  logoUrl: optionalImageUrl, logoMarkUrl: optionalImageUrl, logoInverseUrl: optionalImageUrl,
  faviconUrl: optionalImageUrl, defaultOgImage: optionalImageUrl,
  inquiryEmail: trimmed(160).default(''), contactEmail: trimmed(160).default(''),
  phone: trimmed(60).default(''), whatsapp: trimmed(60).default(''),
  addressEn: trimmed(400).default(''), addressAr: trimmed(400).default(''), mapsUrl: optionalUrl,
  instagram: optionalUrl, tiktok: optionalUrl, linkedin: optionalUrl, x: optionalUrl, youtube: optionalUrl,
  footerDescriptionEn: trimmed(800).default(''), footerDescriptionAr: trimmed(800).default(''),
  footerBackgroundType: z.enum(['COLOR', 'IMAGE']).default('COLOR'),
  footerBackgroundImage: optionalImageUrl,
  footerBackgroundColor: optionalHexColour,
  footerBackgroundPosition: z.enum(['CENTER', 'TOP', 'BOTTOM', 'LEFT', 'RIGHT']).default('CENTER'),
  footerOverlayColor: optionalHexColour,
  // An empty field means "unset", not 0 — otherwise clearing the box would
  // strip the overlay and leave the type sitting on a bare photograph.
  footerOverlayOpacity: z.preprocess(
    (v) => (v === '' || v === null || v === undefined ? 80 : v),
    z.coerce.number().int().min(0).max(100),
  ),
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
  heroMediaUrl: optionalImageUrl,
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
  imageUrl: optionalImageUrl,
  rating: z.coerce.number().int().min(1).max(5).nullable().default(null),
  published: z.boolean().default(false),
  order: z.coerce.number().int().min(0).max(9999).default(0),
});

/**
 * Routes an internal navigation link may point at. Anything else is refused at
 * save time, so the CMS cannot publish a link that 404s. Detail routes are
 * matched by prefix because their slugs live in the database.
 */
const INTERNAL_ROUTES = [
  '/', '/start-here', '/services', '/work', '/insights', '/library', '/tools',
  '/restaurant-growth', '/about', '/contact', '/start-a-project', '/search',
  '/privacy', '/terms',
] as const;

const PREFIX_ROUTES = ['/services/', '/work/', '/insights/', '/library/', '/tools/'] as const;

export function isKnownInternalRoute(href: string) {
  const path = href.split(/[?#]/)[0] ?? '';
  if ((INTERNAL_ROUTES as readonly string[]).includes(path)) return true;
  return PREFIX_ROUTES.some((prefix) => path.startsWith(prefix) && path.length > prefix.length);
}

export const navigationSchema = z
  .object({
    labelEn: trimmed(80).min(1), labelAr: trimmed(80).default(''),
    href: trimmed(300).min(1),
    location: z.enum(['header', 'footer']).default('header'),
    order: z.coerce.number().int().min(0).max(9999).default(0),
    visible: z.boolean().default(true),
    external: z.boolean().default(false),
  })
  .superRefine((value, ctx) => {
    if (value.external) {
      if (!/^https?:\/\//i.test(value.href)) {
        ctx.addIssue({
          code: 'custom',
          path: ['href'],
          message: 'An external link must start with http:// or https://',
        });
      }
      return;
    }

    if (!value.href.startsWith('/')) {
      ctx.addIssue({
        code: 'custom',
        path: ['href'],
        message: 'Internal links start with / — tick “External link” for another site.',
      });
      return;
    }

    if (!isKnownInternalRoute(value.href)) {
      ctx.addIssue({
        code: 'custom',
        path: ['href'],
        message: `“${value.href}” is not a page on this site, so the link would 404.`,
      });
    }
  });

export const pageSchema = z.object({
  titleEn: trimmed(300).default(''), titleAr: trimmed(300).default(''),
  bodyEn: trimmed(30000).default(''), bodyAr: trimmed(30000).default(''),
  content: z.any().default({}),
  seoTitleEn: trimmed(200).default(''), seoTitleAr: trimmed(200).default(''),
  seoDescriptionEn: trimmed(400).default(''), seoDescriptionAr: trimmed(400).default(''),
  canonical: optionalUrl,
  ogImage: optionalImageUrl,
  noindex: z.boolean().default(false),
});

export const systemStageSchema = z.object({
  step: trimmed(8).min(1),
  titleEn: trimmed(160).min(1), titleAr: trimmed(160).default(''),
  descriptionEn: trimmed(1200).default(''), descriptionAr: trimmed(1200).default(''),
  services: jsonArray,
  mediaUrl: optionalImageUrl,
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

const slug = z.string().trim().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Use lowercase letters, numbers and hyphens').max(120);

export const resourceSchema = z.object({
  slug,
  titleEn: trimmed(200).min(1),
  titleAr: trimmed(200).default(''),
  summaryEn: trimmed(600).default(''),
  summaryAr: trimmed(600).default(''),
  descriptionEn: trimmed(20000).default(''),
  descriptionAr: trimmed(20000).default(''),
  type: z.enum(['EXCEL', 'WORD', 'PDF', 'TEMPLATE', 'GUIDE', 'REPORT']).default('PDF'),
  categoryId: z.string().trim().max(40).nullable().default(null),
  tags: z.array(trimmed(60)).default([]),
  externalUrl: optionalUrl,
  thumbnail: optionalImageUrl,
  includes: jsonArray,
  audience: jsonArray,
  featured: z.boolean().default(false),
  publishedAt: z.string().trim().max(40).default(''),
  status: publishStatus.default('DRAFT'),
  order: z.coerce.number().int().min(0).max(9999).default(0),
  seoTitleEn: trimmed(200).default(''), seoTitleAr: trimmed(200).default(''),
  seoDescriptionEn: trimmed(400).default(''), seoDescriptionAr: trimmed(400).default(''),
  ogImage: optionalImageUrl,
  noindex: z.boolean().default(false),
});

export const toolSchema = z.object({
  slug,
  nameEn: trimmed(160).min(1),
  nameAr: trimmed(160).default(''),
  summaryEn: trimmed(600).default(''),
  summaryAr: trimmed(600).default(''),
  descriptionEn: trimmed(20000).default(''),
  descriptionAr: trimmed(20000).default(''),
  purposeEn: trimmed(1200).default(''),
  purposeAr: trimmed(1200).default(''),
  thumbnail: optionalImageUrl,
  featured: z.boolean().default(false),
  status: publishStatus.default('DRAFT'),
  order: z.coerce.number().int().min(0).max(9999).default(0),
  seoTitleEn: trimmed(200).default(''), seoTitleAr: trimmed(200).default(''),
  seoDescriptionEn: trimmed(400).default(''), seoDescriptionAr: trimmed(400).default(''),
  ogImage: optionalImageUrl,
  noindex: z.boolean().default(false),
});

/** Known platforms keep the icon set and the JSON-LD `sameAs` output honest. */
export const SOCIAL_PLATFORMS = [
  'instagram',
  'linkedin',
  'x',
  'facebook',
  'youtube',
  'tiktok',
  'whatsapp',
  'snapchat',
  'threads',
  'pinterest',
  'website',
] as const;

export const socialLinkSchema = z.object({
  platform: z.enum(SOCIAL_PLATFORMS),
  labelEn: trimmed(60).default(''),
  labelAr: trimmed(60).default(''),
  url: z.string().trim().url('Enter a full URL, including https://').max(500),
  enabled: z.boolean().default(true),
  order: z.coerce.number().int().min(0).max(9999).default(0),
});

export const FLOATING_ACTION_KINDS = ['whatsapp', 'phone', 'email', 'link'] as const;

export const floatingActionSchema = z.object({
  kind: z.enum(FLOATING_ACTION_KINDS),
  labelEn: trimmed(60).default(''),
  labelAr: trimmed(60).default(''),
  /** A phone number, an email address or a URL, depending on `kind`. */
  value: trimmed(300).min(1),
  enabled: z.boolean().default(true),
  order: z.coerce.number().int().min(0).max(9999).default(0),
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
