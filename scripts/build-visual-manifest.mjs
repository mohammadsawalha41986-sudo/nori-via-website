/**
 * Builds scripts/visual-manifest.json — the list of images generate_imagery.py
 * renders for the content the CMS holds.
 *
 * It reads the database rather than duplicating a list of slugs here, so an
 * image exists for every record that actually needs one and no record shares a
 * visual with another. The manifest and the rendered files are committed, so a
 * checkout without a database still builds; this script is only re-run when new
 * content is added.
 *
 * The images are composed abstract frames in the Noriva palette, not
 * photography. Alt text says so, because describing an abstract light study as
 * a hospitality interior would be inaccurate for anyone using a screen reader.
 *
 *   node scripts/build-visual-manifest.mjs
 */
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { writeFileSync } from 'node:fs';
import path from 'node:path';

const prisma = new PrismaClient();

/** Visual direction per practice, so a family reads as one set. */
const SERVICE_FAMILY = {
  'fnb-consulting-management': ['cool', 'operational review and management advisory', 'المراجعة التشغيلية والاستشارات الإدارية'],
  'fnb-development': ['cool', 'concept development and pre-opening work', 'تطوير المفاهيم وأعمال ما قبل الافتتاح'],
  'finance-profitability': ['signature', 'financial structure and profitability', 'الهيكل المالي والربحية'],
  'growth-profitability': ['signature', 'profitability and business performance', 'الربحية وأداء المشروع'],
  'menu-product': ['warm', 'menu architecture and product economics', 'بنية القائمة واقتصاديات المنتج'],
  'restaurant-menu': ['warm', 'menu development and costing', 'تطوير القائمة وحساب تكلفتها'],
  'marketing-advertising': ['brand', 'campaign and channel strategy', 'استراتيجية الحملات والقنوات'],
  'marketing-social': ['brand', 'content and channel management', 'إدارة المحتوى والقنوات'],
  'advertising-performance': ['brand', 'paid media and performance', 'الإعلانات المدفوعة والأداء'],
  'brand-customer-experience': ['signature', 'brand positioning and guest experience', 'تموضع العلامة وتجربة الضيف'],
  'creative-branding': ['signature', 'identity and art direction', 'الهوية والإدارة الفنية'],
  'growth-expansion': ['cool', 'growth and expansion planning', 'تخطيط النمو والتوسع'],
  _default: ['cool', 'food and beverage consulting', 'استشارات الأغذية والمشروبات'],
};

/** Visual direction per knowledge-centre category. */
const INSIGHT_FAMILY = {
  'menu-pricing': ['warm', 'menu and pricing', 'القائمة والتسعير'],
  'finance-profitability': ['signature', 'finance and profitability', 'المالية والربحية'],
  operations: ['cool', 'restaurant operations', 'تشغيل المطاعم'],
  'marketing-advertising': ['brand', 'marketing and advertising', 'التسويق والإعلان'],
  'customer-experience': ['signature', 'customer experience', 'تجربة العميل'],
  branding: ['signature', 'brand and positioning', 'العلامة والتموضع'],
  'expansion-growth': ['cool', 'growth and expansion', 'النمو والتوسع'],
  'development-new-concepts': ['cool', 'concept development', 'تطوير المفاهيم'],
  'purchasing-inventory': ['warm', 'purchasing and inventory', 'الشراء والمخزون'],
  'restaurant-management': ['cool', 'restaurant management', 'إدارة المطاعم'],
  digital: ['cool', 'digital experience', 'التجربة الرقمية'],
  _default: ['signature', 'food and beverage strategy', 'استراتيجية الأغذية والمشروبات'],
};

const altEn = (subject, name) =>
  `Composed abstract light study in the Noriva palette, used as the editorial visual for ${name} — ${subject}.`;
const altAr = (subject, name) =>
  `دراسة ضوئية مجرّدة بألوان نوريفا، تُستخدم كصورة تحريرية لـ${name} — ${subject}.`;

/** Slug-safe file name in the pattern the brief asked for. */
const fileName = (section, slug) => `noriva-${section}-${slug}`;

const images = [];
const links = { services: {}, insights: {}, projects: {}, caseStudies: {}, stages: {}, tools: {} };

const services = await prisma.service.findMany({ include: { category: true }, orderBy: { slug: 'asc' } });
for (const s of services) {
  const [ramp, subjEn, subjAr] = SERVICE_FAMILY[s.category?.slug ?? ''] ?? SERVICE_FAMILY._default;
  const name = fileName('service', s.slug);
  images.push({ name, width: 1400, height: 1050, ramp, role: 'content' });
  links.services[s.slug] = {
    url: `/img/${name}.webp`,
    altEn: altEn(subjEn, s.nameEn),
    altAr: altAr(subjAr, s.nameAr || s.nameEn),
  };
}

const insights = await prisma.insight.findMany({ include: { category: true }, orderBy: { slug: 'asc' } });
for (const a of insights) {
  const [ramp, subjEn, subjAr] = INSIGHT_FAMILY[a.category?.slug ?? ''] ?? INSIGHT_FAMILY._default;
  const name = fileName('insight', a.slug);
  images.push({ name, width: 1600, height: 900, ramp, role: 'content' });
  links.insights[a.slug] = {
    url: `/img/${name}.webp`,
    altEn: altEn(subjEn, a.titleEn),
    altAr: altAr(subjAr, a.titleAr || a.titleEn),
  };
}

/* Only the engagements this repository created as illustrations get generated
   artwork; anything an editor uploaded is left exactly as it is. */
const projects = await prisma.project.findMany({ where: { client: 'Sample project' }, orderBy: { slug: 'asc' } });
const projectRamps = ['signature', 'warm', 'cool', 'brand'];
for (const [i, p] of projects.entries()) {
  const ramp = projectRamps[i % projectRamps.length];
  const hero = fileName('work', p.slug.replace(/^sample-/, ''));
  images.push({ name: hero, width: 1800, height: 1150, ramp, role: 'content' });
  const gallery = [];
  for (let g = 1; g <= 3; g += 1) {
    const gName = `${hero}-${g}`;
    images.push({ name: gName, width: 1600, height: 1100, ramp: projectRamps[(i + g) % projectRamps.length], role: 'content' });
    gallery.push({
      url: `/img/${gName}.webp`,
      altEn: altEn('an illustrative engagement, not client photography', p.titleEn),
      altAr: altAr('نموذج توضيحي لا تصوير لعمل عميل', p.titleAr || p.titleEn),
    });
  }
  links.projects[p.slug] = {
    url: `/img/${hero}.webp`,
    altEn: altEn('an illustrative engagement, not client photography', p.titleEn),
    altAr: altAr('نموذج توضيحي لا تصوير لعمل عميل', p.titleAr || p.titleEn),
    gallery,
  };
}

const caseStudies = await prisma.caseStudy.findMany({ orderBy: { slug: 'asc' } });
for (const [i, c] of caseStudies.entries()) {
  const name = fileName('case-study', c.slug.replace(/-case-study$/, ''));
  images.push({ name, width: 1800, height: 1150, ramp: projectRamps[(i + 1) % projectRamps.length], role: 'content' });
  links.caseStudies[c.slug] = {
    url: `/img/${name}.webp`,
    altEn: altEn('an illustrative engagement, not client photography', c.titleEn),
    altAr: altAr('نموذج توضيحي لا تصوير لعمل عميل', c.titleAr || c.titleEn),
  };
}

const stages = await prisma.systemStage.findMany({ orderBy: { order: 'asc' } });
const stageRamps = ['signature', 'cool', 'warm', 'brand', 'cool', 'signature', 'brand', 'signature', 'cool', 'warm'];
for (const [i, s] of stages.entries()) {
  const name = `noriva-system-${s.step}`;
  images.push({ name, width: 1200, height: 900, ramp: stageRamps[i % stageRamps.length], role: 'content' });
  links.stages[s.step] = {
    url: `/img/${name}.webp`,
    altEn: altEn(`the ${s.titleEn} discipline of the Noriva System`, s.titleEn),
    altAr: altAr(`تخصص ${s.titleAr || s.titleEn} في نظام نوريفا`, s.titleAr || s.titleEn),
  };
}

const tools = await prisma.tool.findMany({ orderBy: { slug: 'asc' } });
for (const [i, t] of tools.entries()) {
  const name = fileName('tool', t.slug.replace(/-calculator$/, ''));
  images.push({ name, width: 1200, height: 900, ramp: ['cool', 'signature'][i % 2], role: 'content' });
  links.tools[t.slug] = {
    url: `/img/${name}.webp`,
    altEn: altEn('an interactive calculator for food and beverage decisions', t.nameEn),
    altAr: altAr('حاسبة تفاعلية لقرارات الأغذية والمشروبات', t.nameAr || t.nameEn),
  };
}

/* One default social share image for pages that have no image of their own. */
images.push({ name: 'noriva-og-default', width: 1200, height: 630, ramp: 'signature', role: 'backdrop' });

const outPath = path.join(process.cwd(), 'scripts', 'visual-manifest.json');
writeFileSync(outPath, `${JSON.stringify({ images, links }, null, 2)}\n`);
console.log(`[visual-manifest] ${images.length} images across ${Object.keys(links).length} content types → ${outPath}`);
await prisma.$disconnect();
