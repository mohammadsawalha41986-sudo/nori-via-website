/** Additive, idempotent presentation upgrade. Custom uploads and all content survive. */
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { existsSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
const db = new PrismaClient();
const manifestPath = 'scripts/editorial-media.json';
const entries = existsSync(manifestPath) ? JSON.parse(readFileSync(manifestPath, 'utf8')) : [];
const oldManifest = JSON.parse(readFileSync('scripts/visual-manifest.json', 'utf8'));
const shipped = new Set(oldManifest.images.map((i) => `/img/${i.name}.webp`));
for (const name of [
  'hero',
  'about',
  'cta',
  'service-brand',
  'service-content',
  'service-growth',
  'service-experience',
  'service-digital',
  'insight-1',
  'insight-2',
  'insight-3',
  'insight-4',
])
  shipped.add(`/img/${name}.jpg`);
const replaceable = (url) => !url || shipped.has(url);
const exists = (url) => existsSync(path.join('public', url));
const urlFor = (key) => `/img/noriva-editorial-${key}.webp`;
const steps = [
  [
    'Discover',
    'نفهم',
    'Understand the restaurant, guests and the decision that needs to be made.',
    'نفهم المطعم وضيوفه والقرار المطلوب اتخاذه.',
    'dining',
  ],
  [
    'Diagnose',
    'نشخّص',
    'Observe service, review the menu and identify the business constraint.',
    'نراقب الخدمة ونراجع القائمة ونحدد ما يعيق أداء المشروع.',
    'training',
  ],
  [
    'Measure',
    'نقيس',
    'Reconcile sales, recipe costs, purchasing and channel contribution.',
    'نطابق المبيعات وتكلفة الوصفات والمشتريات ومساهمة القنوات.',
    'costing',
  ],
  [
    'Design',
    'نصمّم',
    'Build a practical menu, brand and operating plan around the findings.',
    'نبني خطة عملية للقائمة والعلامة والتشغيل وفق نتائج التحليل.',
    'brand',
  ],
  [
    'Implement',
    'ننفّذ',
    'Turn the plan into standards, responsibilities and work on the floor.',
    'نحوّل الخطة إلى معايير ومسؤوليات وعمل داخل المطعم.',
    'inventory',
  ],
  [
    'Optimize',
    'نحسّن',
    'Review what changed in portions, offers, service and margin.',
    'نراجع أثر التغييرات في الحصص والعروض والخدمة والهامش.',
    'menu',
  ],
  [
    'Grow',
    'ننمو',
    'Validate the model and management capacity before adding channels or branches.',
    'نختبر النموذج وجاهزية الإدارة قبل إضافة قنوات أو فروع.',
    'launch',
  ],
];
async function main() {
  const pageCopy = [
    ['library', 'titleEn', 'Library', 'Resources'],
    [
      'library',
      'bodyEn',
      'Templates, models and guides from the Noriva team. Edit this introduction, and add resources, from the Noriva Admin.',
      'Practical guides, checklists, working templates and worked examples for decisions in restaurant operations and growth.',
    ],
    [
      'library',
      'bodyAr',
      'قوالب ونماذج وأدلة من فريق نوريفا. يمكنك تعديل هذه المقدمة وإضافة الموارد من لوحة تحكم نوريفا.',
      'أدلة وقوائم تحقق ونماذج عمل وأمثلة تطبيقية لقرارات تشغيل المطاعم وتنميتها.',
    ],
    [
      'tools',
      'bodyEn',
      'Interactive calculators built around the numbers that decide a result. Edit this introduction, and add tools, from the Noriva Admin.',
      'Test the numbers behind recipe cost, pricing, delivery, contribution and break-even.',
    ],
    [
      'tools',
      'bodyAr',
      'حاسبات تفاعلية مبنية على الأرقام التي تصنع الفرق. يمكنك تعديل هذه المقدمة وإضافة الأدوات من لوحة تحكم نوريفا.',
      'اختبر الأرقام وراء تكلفة الوصفة والتسعير والتوصيل وهامش المساهمة ونقطة التعادل.',
    ],
    [
      'services',
      'bodyEn',
      'Five practices, built to work together: marketing and social, advertising and performance, creative and branding, restaurant and menu, growth and profitability.',
      'Explore services by your business challenge or area of expertise. Start with the constraint that matters, then connect the right disciplines.',
    ],
    [
      'services',
      'bodyAr',
      'خمس ممارسات مصممة للعمل معًا: التسويق والتواصل، الإعلانات والأداء، الإبداع والهوية، المطعم والقائمة، النمو والربحية.',
      'استكشف الخدمات حسب تحدي مشروعك أو مجال التخصص. ابدأ بالأولوية الأهم ثم اربط التخصصات المناسبة.',
    ],
  ];
  // Exact-match upgrades of shipped introductions; authored CMS copy wins.
  for (const [key, field, from, to] of pageCopy)
    await db.page.updateMany({ where: { key, [field]: from }, data: { [field]: to } });
  let changed = 0;
  const receipt = await db.page.findUnique({ where: { key: 'public-redesign-receipt' } });
  const applied = { ...(receipt?.content ?? {}) };
  for (const entry of entries) {
    if (!exists(entry.url)) throw new Error(`Missing editorial asset: ${entry.url}`);
    const file = path.join('public', entry.url);
    await db.media.upsert({
      where: { id: `editorial-${entry.key}` },
      create: {
        id: `editorial-${entry.key}`,
        filename: path.basename(file),
        url: entry.url,
        kind: 'IMAGE',
        mimeType: 'image/webp',
        size: statSync(file).size,
        width: entry.width,
        height: entry.height,
        altEn: entry.altEn,
        altAr: entry.altAr,
      },
      update: {},
    });
    if (entry.serviceSlug) {
      const service = await db.service.findUnique({ where: { slug: entry.serviceSlug } });
      if (service && !applied[entry.serviceSlug]) {
        if (replaceable(service.featuredImage)) {
          const result = await db.service.updateMany({
            where: {
              id: service.id,
              featuredImage: service.featuredImage,
              updatedAt: service.updatedAt,
            },
            data: {
              featuredImage: entry.url,
              ...(replaceable(service.ogImage) ? { ogImage: entry.url } : {}),
            },
          });
          changed += result.count;
        }
        applied[entry.serviceSlug] = true;
      }
    }
    for (const [model, slug] of [
      ['project', entry.projectSlug],
      ['caseStudy', entry.caseStudySlug],
    ]) {
      if (!slug || applied[`${model}:${slug}`]) continue;
      const row = await db[model].findUnique({ where: { slug } });
      if (row && replaceable(row.heroMediaUrl))
        await db[model].updateMany({
          where: { id: row.id, updatedAt: row.updatedAt },
          data: {
            heroMediaUrl: entry.url,
            ...(replaceable(row.ogImage) ? { ogImage: entry.url } : {}),
          },
        });
      if (row) applied[`${model}:${slug}`] = true;
    }
  }
  const home = await db.homepageContent.findUnique({ where: { id: 'singleton' } });
  if (home && !applied.home && replaceable(home.heroMediaUrl) && exists(urlFor('dining')))
    await db.homepageContent.update({
      where: { id: home.id },
      data: { heroMediaUrl: urlFor('dining'), heroMediaKind: 'IMAGE' },
    });
  applied.home = true;
  await db.page.upsert({
    where: { key: 'public-redesign-receipt' },
    create: {
      key: 'public-redesign-receipt',
      titleEn: 'Public redesign receipt',
      content: applied,
    },
    update: { content: applied },
  });
  for (let i = 0; i < steps.length; i++) {
    const [titleEn, titleAr, descriptionEn, descriptionAr, key] = steps[i];
    const step = `P${String(i + 1).padStart(2, '0')}`;
    if (!(await db.systemStage.findFirst({ where: { step } })) && exists(urlFor(key)))
      await db.systemStage.create({
        data: {
          step,
          titleEn,
          titleAr,
          descriptionEn,
          descriptionAr,
          mediaUrl: urlFor(key),
          order: i + 1,
          visible: true,
        },
      });
  }
  await db.page.upsert({
    where: { key: 'public-media' },
    create: {
      key: 'public-media',
      titleEn: 'Public media register',
      titleAr: 'سجل صور الموقع',
      content: {
        assets: entries.map(({ prompt, ...entry }) => entry),
        methodology:
          'Generated editorial illustrations. Not photographs of actual NORIVA client engagements.',
      },
    },
    update: {},
  });
  console.log(
    `[public-redesign] ${entries.length} media assets registered; ${changed} shipped service images upgraded. Custom content preserved.`,
  );
}
try {
  await main();
} finally {
  await db.$disconnect();
}
