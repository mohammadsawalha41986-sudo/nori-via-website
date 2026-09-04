/**
 * Non-destructive content provisioning.
 *
 * The site renders entirely from the database, so an empty database renders an
 * empty site. This fills the gaps — and only the gaps — so a fresh deployment
 * reads as a finished website that can then be edited in Admin.
 *
 * Guarantees:
 *   - It never updates or deletes a row that already exists. Existing content
 *     always wins; every write is "create only if absent".
 *   - Singleton rows (site settings, homepage) are filled field by field, and
 *     only where the field is still empty.
 *   - It fabricates no facts: no statistics, no testimonials, no project
 *     results. Those stay empty until someone enters real ones.
 *   - It is idempotent. Running it twice changes nothing the second time.
 *
 * Usage:
 *   node scripts/ensure-content.mjs           provision missing content
 *   node scripts/ensure-content.mjs --report  inspect only, write nothing
 *   node scripts/ensure-content.mjs --admin   also upsert the admin account
 *                                             from ADMIN_EMAIL/ADMIN_PASSWORD
 */
import { PrismaClient } from '@prisma/client';
import {
  POSITIONING,
  SERVICE_GROUPS,
  FNB_SERVICES,
  FNB_TOOLS,
  FNB_RESOURCES,
  INSIGHT_CATEGORIES as FNB_INSIGHT_CATEGORIES,
  SERVICE_REPOSITIONING,
  START_HERE_PATHS_FNB,
} from './fnb-content.mjs';
import bcrypt from 'bcryptjs';
import { statSync } from 'node:fs';
import path from 'node:path';

const prisma = new PrismaClient();
const REPORT_ONLY = process.argv.includes('--report');
const WITH_ADMIN = process.argv.includes('--admin');

const created = [];
const note = (what) => created.push(what);

/* Images are served from /public/img. They are temporary art direction and are
 * replaced by uploading real media in Admin — the value is just a URL field. */
const img = (n) => `/img/${n}.jpg`;

/* ---------------------------------------------------------------- content */

const SERVICES = [
  {
    slug: 'brand-strategy-identity',
    nameEn: 'Brand Strategy & Identity',
    nameAr: 'استراتيجية وهوية العلامة',
    summaryEn:
      'Positioning, naming, visual identity and the guidelines that keep a brand coherent everywhere it appears.',
    summaryAr: 'التموضع والتسمية والهوية البصرية والإرشادات التي تحافظ على اتساق العلامة أينما ظهرت.',
    heroDescriptionEn:
      'A brand is a decision about what you stand for, made legible. We work from positioning through to the identity system, so the result is defensible rather than decorative.',
    heroDescriptionAr:
      'العلامة قرار حول ما تمثّله، مصاغ بوضوح. نعمل من التموضع وصولاً إلى نظام الهوية، ليكون الناتج مبنياً على أساس لا مجرد زينة.',
    whatWeDoEn:
      'We start with the commercial question, not the logo. Research, category audit and stakeholder interviews establish where you can credibly win. From there we build the verbal and visual system: positioning, messaging hierarchy, naming where needed, identity, typography, colour, art direction and the guidelines that let a team apply it without us in the room.',
    whatWeDoAr:
      'نبدأ من السؤال التجاري لا من الشعار. البحث ومراجعة الفئة ومقابلات أصحاب المصلحة تحدد أين يمكنك المنافسة بمصداقية. ثم نبني النظام اللفظي والبصري: التموضع، وتسلسل الرسائل، والتسمية عند الحاجة، والهوية، والخطوط، والألوان، والتوجيه الفني، والإرشادات التي تمكّن الفريق من تطبيقها دون وجودنا.',
    approachEn:
      'Identity work fails when it is handed over as a PDF and nothing changes. We build the system alongside the people who will use it, and we ship it with the templates, components and worked examples that make adoption the path of least resistance.',
    approachAr:
      'يفشل عمل الهوية حين يُسلَّم كملف ولا يتغير شيء. نبني النظام مع من سيستخدمه، ونسلّمه مع القوالب والمكوّنات والأمثلة التطبيقية التي تجعل التبنّي أسهل الطرق.',
    deliverables: [
      ['Positioning and messaging platform', 'منصة التموضع والرسائل'],
      ['Visual identity system', 'نظام الهوية البصرية'],
      ['Typography and colour direction', 'توجيه الخطوط والألوان'],
      ['Brand guidelines', 'دليل العلامة'],
      ['Asset library and templates', 'مكتبة الأصول والقوالب'],
    ],
    featuredImage: img('service-brand'),
    order: 1,
  },
  {
    slug: 'digital-product-web',
    nameEn: 'Digital Product & Web',
    nameAr: 'المنتجات الرقمية والويب',
    summaryEn:
      'Websites and product interfaces designed and built to be fast, accessible and genuinely maintainable.',
    summaryAr: 'مواقع وواجهات منتجات مصمّمة ومبنية لتكون سريعة وسهلة الوصول وقابلة للصيانة فعلياً.',
    heroDescriptionEn:
      'Design and engineering in the same room, so what is drawn is what ships — and what ships stays fast a year later.',
    heroDescriptionAr:
      'التصميم والهندسة في غرفة واحدة، ليكون ما يُرسم هو ما يُطلق، وليبقى سريعاً بعد عام.',
    whatWeDoEn:
      'Information architecture, interface design, design systems, and front-end engineering. We build on modern, well-supported foundations, with content managed by the people who own it rather than by a developer ticket. Performance, accessibility and search visibility are treated as requirements, not as a later optimisation pass.',
    whatWeDoAr:
      'هندسة المعلومات، وتصميم الواجهات، وأنظمة التصميم، وهندسة الواجهة الأمامية. نبني على أسس حديثة مدعومة جيداً، ويُدار المحتوى من قِبل أصحابه لا عبر طلب برمجي. الأداء وسهولة الوصول والظهور في البحث متطلبات لا تحسينات لاحقة.',
    approachEn:
      'We prototype early and in the browser, because a real page on a real device answers questions that a static mockup cannot. Bilingual work is designed in both directions from the first screen, never mirrored at the end.',
    approachAr:
      'ننشئ النماذج مبكراً وداخل المتصفح، لأن صفحة حقيقية على جهاز حقيقي تجيب عمّا لا يجيب عنه التصميم الساكن. والعمل ثنائي اللغة يُصمَّم بالاتجاهين من أول شاشة، لا يُعكَس في النهاية.',
    deliverables: [
      ['Information architecture', 'هندسة المعلومات'],
      ['Interface design and design system', 'تصميم الواجهات ونظام التصميم'],
      ['Front-end engineering', 'هندسة الواجهة الأمامية'],
      ['CMS integration', 'ربط نظام إدارة المحتوى'],
      ['Performance and accessibility', 'الأداء وسهولة الوصول'],
    ],
    featuredImage: img('service-digital'),
    order: 2,
  },
  {
    slug: 'content-production',
    nameEn: 'Content & Production',
    nameAr: 'المحتوى والإنتاج',
    summaryEn:
      'Food and product photography, short-form video and social content, produced against a plan rather than one shoot at a time.',
    summaryAr: 'تصوير الطعام والمنتجات والفيديو القصير ومحتوى المنصات، يُنتَج وفق خطة لا جلسة تصوير في كل مرة.',
    heroDescriptionEn:
      'Distinctive assets, produced in volume, consistent enough to build recognition over time.',
    heroDescriptionAr: 'أصول مميزة تُنتَج بكمية كافية وباتساق يبني التميّز مع الوقت.',
    whatWeDoEn:
      'Art direction, food and product photography, short-form video for social, campaign assets, and the content system that holds them together in both Arabic and English. We plan production in cycles, so one shoot supplies a quarter of scheduled content rather than a fortnight of scrambling.',
    whatWeDoAr:
      'التوجيه الفني، وتصوير الطعام والمنتجات، والفيديو القصير للمنصات، وأصول الحملات، ونظام المحتوى الذي يربطها بالعربية والإنجليزية. نخطط الإنتاج على دورات، لتغذّي جلسة واحدة محتوى ربع كامل بدل أسبوعين من الارتجال.',
    approachEn:
      'Production without art direction produces volume and no recognition. We define the visual rules first — framing, light, palette, tone of voice — and then produce against them, so the work compounds instead of resetting each month.',
    approachAr:
      'الإنتاج بلا توجيه فني ينتج كمّاً بلا تميّز. نحدد القواعد البصرية أولاً — التأطير والإضاءة واللون ونبرة الصوت — ثم ننتج وفقها، ليتراكم الأثر بدل أن يبدأ من الصفر كل شهر.',
    deliverables: [
      ['Food photography', 'تصوير الطعام'],
      ['Product photography', 'تصوير المنتجات'],
      ['Short-form video', 'الفيديو القصير'],
      ['Social media content', 'محتوى منصات التواصل'],
      ['Campaign assets', 'أصول الحملات'],
      ['Content systems', 'أنظمة المحتوى'],
    ],
    featuredImage: img('service-content'),
    order: 3,
  },
  {
    slug: 'growth-performance',
    nameEn: 'Growth & Performance',
    nameAr: 'النمو والأداء',
    summaryEn:
      'Paid media, lifecycle and measurement, reported against outcomes rather than impressions.',
    summaryAr: 'الإعلانات المدفوعة ودورة حياة العميل والقياس، بتقارير تقيس النتائج لا الانطباعات.',
    heroDescriptionEn:
      'Spend that is accountable to a number you actually care about.',
    heroDescriptionAr: 'إنفاق مسؤول أمام رقم يهمّك فعلاً.',
    whatWeDoEn:
      'Channel strategy, campaign build and creative testing across paid social and search, alongside the measurement plan that makes results legible. We instrument properly first, agree the definition of a conversion, and report against it — including when the honest answer is that a channel is not working.',
    whatWeDoAr:
      'استراتيجية القنوات، وبناء الحملات، واختبار المواد الإبداعية عبر الإعلانات الاجتماعية والبحث، مع خطة قياس تجعل النتائج واضحة. نضبط أدوات القياس أولاً، ونتفق على تعريف التحويل، ثم نرفع التقارير وفقه — بما في ذلك حين تكون الإجابة الصادقة أن قناة ما لا تعمل.',
    approachEn:
      'Creative is the largest lever in performance, so testing is structured around it rather than around bid settings. Every account we run is owned by the client, on the client’s billing, and remains theirs if we part ways.',
    approachAr:
      'المواد الإبداعية هي أكبر عامل مؤثر في الأداء، لذا نبني الاختبارات حولها لا حول إعدادات المزايدة. وكل حساب نديره مملوك للعميل وعلى فوترته، ويبقى له إذا افترقنا.',
    deliverables: [
      ['Channel and budget strategy', 'استراتيجية القنوات والميزانية'],
      ['Campaign build and management', 'بناء الحملات وإدارتها'],
      ['Creative testing', 'اختبار المواد الإبداعية'],
      ['Measurement and tracking setup', 'إعداد القياس والتتبع'],
      ['Reporting against agreed outcomes', 'تقارير وفق نتائج متفق عليها'],
    ],
    featuredImage: img('service-growth'),
    order: 4,
  },
  {
    slug: 'spatial-experience',
    nameEn: 'Spatial & Experience',
    nameAr: 'التجربة والمكان',
    summaryEn:
      'Where the brand meets the room: signage, menus, packaging, wayfinding and the details guests touch.',
    summaryAr: 'حيث تلتقي العلامة بالمكان: اللافتات والقوائم والتغليف والإرشاد والتفاصيل التي يلمسها الضيف.',
    heroDescriptionEn:
      'A brand is judged in the room long before it is judged in a deck.',
    heroDescriptionAr: 'يُحكم على العلامة في المكان قبل أن يُحكم عليها في العرض التقديمي.',
    whatWeDoEn:
      'Applied identity across physical touchpoints: signage and wayfinding, menu systems, packaging, uniforms, print collateral and the specification needed to have them produced correctly. We work with fabricators and printers directly so the drawing survives contact with production.',
    whatWeDoAr:
      'تطبيق الهوية على نقاط التماس المادية: اللافتات والإرشاد، وأنظمة القوائم، والتغليف، والأزياء، والمطبوعات، والمواصفات اللازمة لتنفيذها بشكل صحيح. نعمل مباشرة مع المصنّعين والمطابع ليبقى التصميم سليماً عند التنفيذ.',
    approachEn:
      'Specification is the deliverable that matters here. Materials, finishes, sizes and tolerances are documented, so what arrives on site matches what was approved.',
    approachAr:
      'المواصفات هي المُخرج الأهم هنا. توثَّق المواد والتشطيبات والمقاسات والسماحات، ليطابق ما يصل الموقع ما تمت الموافقة عليه.',
    deliverables: [
      ['Signage and wayfinding', 'اللافتات والإرشاد'],
      ['Menu and print systems', 'أنظمة القوائم والمطبوعات'],
      ['Packaging', 'التغليف'],
      ['Production specification', 'مواصفات التنفيذ'],
      ['Fabrication support', 'الإشراف على التصنيع'],
    ],
    featuredImage: img('service-experience'),
    order: 5,
  },
];

const WORK_CATEGORIES = [
  { slug: 'brand-identity', nameEn: 'Brand Identity', nameAr: 'هوية العلامة', order: 1 },
  { slug: 'digital', nameEn: 'Digital', nameAr: 'رقمي', order: 2 },
  { slug: 'campaign', nameEn: 'Campaign', nameAr: 'حملة', order: 3 },
  { slug: 'spatial', nameEn: 'Spatial', nameAr: 'مكاني', order: 4 },
];

const gallery = (a, b, c) => [
  { url: img(`gallery-${a}`), altEn: 'Project visual', altAr: 'صورة من المشروع' },
  { url: img(`gallery-${b}`), altEn: 'Project visual', altAr: 'صورة من المشروع' },
  { url: img(`gallery-${c}`), altEn: 'Project visual', altAr: 'صورة من المشروع' },
];

/* Illustrative sample projects. The client names are placeholders for layout
 * purposes and are not Noriva clients; `results` is deliberately left empty
 * because no real metrics exist to report. */
const PROJECTS = [
  {
    slug: 'sample-hospitality-identity',
    titleEn: 'Hospitality Identity System',
    titleAr: 'نظام هوية لمشروع ضيافة',
    client: 'Sample project',
    categorySlug: 'brand-identity',
    descriptionEn:
      'A full identity system for a multi-site dining concept: positioning, wordmark, typographic palette, menu architecture and the signage specification that carried it into the space.',
    descriptionAr:
      'نظام هوية متكامل لمفهوم مطاعم متعدد الفروع: التموضع، وعلامة الاسم، ونظام الخطوط، وبنية القوائم، ومواصفات اللافتات التي نقلته إلى المكان.',
    heroMediaUrl: img('work-1'),
    gallery: gallery(1, 2, 3),
    year: 2025,
    location: 'Riyadh',
    featured: true,
    order: 1,
    serviceSlugs: ['brand-strategy-identity', 'spatial-experience'],
  },
  {
    slug: 'sample-editorial-platform',
    titleEn: 'Editorial Content Platform',
    titleAr: 'منصة محتوى تحريري',
    client: 'Sample project',
    categorySlug: 'digital',
    descriptionEn:
      'A bilingual publishing platform designed around long-form reading, with an editing experience the in-house team runs without developer involvement.',
    descriptionAr:
      'منصة نشر ثنائية اللغة مصمّمة حول القراءة الطويلة، بتجربة تحرير يديرها الفريق الداخلي دون تدخل المطورين.',
    heroMediaUrl: img('work-2'),
    gallery: gallery(4, 5, 6),
    year: 2025,
    location: 'Jeddah',
    featured: true,
    order: 2,
    serviceSlugs: ['digital-product-web', 'content-production'],
  },
  {
    slug: 'sample-launch-campaign',
    titleEn: 'Opening Campaign',
    titleAr: 'حملة افتتاح',
    client: 'Sample project',
    categorySlug: 'campaign',
    descriptionEn:
      'Art direction, production and paid media for an opening: one production cycle supplying a full quarter of scheduled content across channels.',
    descriptionAr:
      'توجيه فني وإنتاج وإعلانات مدفوعة لافتتاح: دورة إنتاج واحدة غذّت ربعاً كاملاً من المحتوى المجدول عبر القنوات.',
    heroMediaUrl: img('work-3'),
    gallery: gallery(7, 8, 9),
    year: 2024,
    location: 'Riyadh',
    featured: true,
    order: 3,
    serviceSlugs: ['content-production', 'growth-performance'],
  },
  {
    slug: 'sample-retail-experience',
    titleEn: 'Retail Experience Design',
    titleAr: 'تصميم تجربة التجزئة',
    client: 'Sample project',
    categorySlug: 'spatial',
    descriptionEn:
      'Applied identity across a retail footprint: wayfinding, packaging, print collateral and the production specification issued to fabricators.',
    descriptionAr:
      'تطبيق الهوية عبر مساحة تجزئة: الإرشاد، والتغليف، والمطبوعات، ومواصفات التنفيذ المسلّمة للمصنّعين.',
    heroMediaUrl: img('work-4'),
    gallery: gallery(10, 11, 12),
    year: 2024,
    location: 'Dammam',
    featured: true,
    order: 4,
    serviceSlugs: ['spatial-experience', 'brand-strategy-identity'],
  },
  {
    slug: 'sample-brand-refresh',
    titleEn: 'Brand Refresh',
    titleAr: 'تحديث علامة',
    client: 'Sample project',
    categorySlug: 'brand-identity',
    descriptionEn:
      'A restrained refresh of an established mark: retaining the equity already built while resolving how the identity behaves in digital contexts.',
    descriptionAr:
      'تحديث متحفظ لعلامة قائمة: الحفاظ على الرصيد المتراكم مع معالجة سلوك الهوية في السياقات الرقمية.',
    heroMediaUrl: img('work-5'),
    gallery: gallery(2, 6, 10),
    year: 2024,
    location: 'Riyadh',
    featured: false,
    order: 5,
    serviceSlugs: ['brand-strategy-identity'],
  },
  {
    slug: 'sample-booking-experience',
    titleEn: 'Booking Experience',
    titleAr: 'تجربة الحجز',
    client: 'Sample project',
    categorySlug: 'digital',
    descriptionEn:
      'An end-to-end reservation journey rebuilt around fewer steps, clearer availability and a bilingual interface designed in both directions from the first screen.',
    descriptionAr:
      'رحلة حجز أُعيد بناؤها بخطوات أقل، وإتاحة أوضح، وواجهة ثنائية اللغة مصمّمة بالاتجاهين من أول شاشة.',
    heroMediaUrl: img('work-6'),
    gallery: gallery(3, 7, 11),
    year: 2023,
    location: 'Jeddah',
    featured: false,
    order: 6,
    serviceSlugs: ['digital-product-web'],
  },
];

const INSIGHT_CATEGORIES = [
  { slug: 'brand', nameEn: 'Brand', nameAr: 'العلامة', order: 1 },
  { slug: 'digital', nameEn: 'Digital', nameAr: 'رقمي', order: 2 },
  { slug: 'growth', nameEn: 'Growth', nameAr: 'النمو', order: 3 },
];

const INSIGHTS = [
  {
    slug: 'what-a-brand-guideline-is-actually-for',
    categorySlug: 'brand',
    titleEn: 'What a brand guideline is actually for',
    titleAr: 'ما الغرض الحقيقي من دليل العلامة',
    excerptEn:
      'Most guidelines are written to end arguments. The useful ones are written to let people make decisions without calling a meeting.',
    excerptAr:
      'تُكتب معظم الأدلة لإنهاء الجدل. أما المفيدة منها فتُكتب لتمكين الناس من اتخاذ القرار دون اجتماع.',
    contentEn:
      'A guideline that only documents the logo is a specification, not a system. The teams that actually apply a brand are making dozens of small decisions a week that no logo sheet answers: how a promotion looks when it is not on brand-colour backgrounds, how a headline breaks on a narrow screen, which of two typefaces wins in a dense table.\n\nThe test of a guideline is whether someone outside the design team can use it to make one of those decisions and be right. That means worked examples rather than rules in the abstract, the awkward cases rather than only the flattering ones, and a clear statement of what is fixed versus what is left to judgement.\n\nWhen a guideline is written that way, adoption stops being an enforcement problem. People follow it because it is the fastest route to a decision they can defend.',
    contentAr:
      'الدليل الذي يوثّق الشعار فقط هو مواصفة لا نظام. الفرق التي تطبّق العلامة فعلياً تتخذ عشرات القرارات الصغيرة أسبوعياً لا يجيب عنها ملف الشعار: كيف يبدو العرض الترويجي على خلفية ليست بألوان العلامة، وكيف ينكسر العنوان على شاشة ضيقة، وأي الخطين يفوز في جدول كثيف.\n\nاختبار الدليل هو ما إذا كان شخص من خارج فريق التصميم يستطيع استخدامه لاتخاذ أحد تلك القرارات بشكل صحيح. وهذا يعني أمثلة تطبيقية بدل قواعد مجردة، والحالات الصعبة لا الحالات المثالية فقط، وبياناً واضحاً لما هو ثابت وما هو متروك للاجتهاد.\n\nحين يُكتب الدليل بهذه الطريقة، يتوقف التبنّي عن كونه مشكلة فرض. يتبعه الناس لأنه أسرع طريق إلى قرار يمكنهم الدفاع عنه.',
    coverImage: img('insight-1'),
    daysAgo: 12,
  },
  {
    slug: 'designing-arabic-and-english-together',
    categorySlug: 'digital',
    titleEn: 'Designing Arabic and English together',
    titleAr: 'تصميم العربية والإنجليزية معاً',
    excerptEn:
      'Bilingual design fails at the point where one language is treated as the translation of the other.',
    excerptAr: 'يفشل التصميم ثنائي اللغة عند اللحظة التي تُعامل فيها لغة كترجمة للأخرى.',
    contentEn:
      'Mirroring a layout is the easy half. The half that decides whether a bilingual site feels designed is typographic: Arabic and Latin type have different vertical proportions, different comfortable line lengths, and different densities at the same nominal size. A heading scale tuned for one will look either timid or shouted in the other.\n\nThe practical consequence is that both directions have to be designed, not derived. That means choosing the Arabic face for its own merits rather than for its resemblance to the Latin one, setting separate size and leading scales, and reviewing real content in both languages before the layout is agreed.\n\nIt also means numerals, icons and directional affordances get decided deliberately. An arrow that means forward in one direction means back in the other, and no amount of CSS logic saves a layout where that was never considered.',
    contentAr:
      'عكس التخطيط هو النصف السهل. أما النصف الذي يحدد ما إذا كان الموقع ثنائي اللغة يبدو مصمّماً فهو الطباعة: للخطوط العربية واللاتينية نسب رأسية مختلفة، وأطوال أسطر مريحة مختلفة، وكثافات مختلفة عند الحجم الاسمي نفسه. ومقياس عناوين مضبوط لإحداهما سيبدو إما خجولاً أو صارخاً في الأخرى.\n\nالنتيجة العملية أن الاتجاهين يجب أن يُصمَّما لا أن يُشتقّ أحدهما من الآخر. أي اختيار الخط العربي لجدارته لا لتشابهه مع اللاتيني، ووضع مقاييس حجم وتباعد منفصلة، ومراجعة محتوى حقيقي باللغتين قبل اعتماد التخطيط.\n\nويعني ذلك أيضاً حسم الأرقام والأيقونات والدلالات الاتجاهية بشكل مقصود. فالسهم الذي يعني «التالي» في اتجاه يعني «السابق» في الآخر، ولا تنقذ أي حيلة برمجية تخطيطاً لم يُراعَ فيه ذلك.',
    coverImage: img('insight-2'),
    daysAgo: 26,
  },
  {
    slug: 'production-cycles-beat-one-off-shoots',
    categorySlug: 'growth',
    titleEn: 'Production cycles beat one-off shoots',
    titleAr: 'دورات الإنتاج تتفوق على الجلسات المتفرقة',
    excerptEn:
      'The constraint on most content programmes is not budget or talent. It is scheduling.',
    excerptAr: 'القيد على معظم برامج المحتوى ليس الميزانية ولا المواهب، بل الجدولة.',
    contentEn:
      'A team that shoots when it runs out of content is always shooting under pressure, which shows. Planning production in cycles inverts that: one properly art-directed day can supply a quarter of scheduled posts, and the calendar is built before the camera comes out.\n\nThe gain is not only efficiency. Consistency is what builds recognition, and consistency is a scheduling property as much as a design one. When assets are produced against a defined set of visual rules in batches, the feed accumulates a look. When they are produced reactively, each month resets.\n\nThe discipline required is unglamorous: a content calendar agreed in advance, a shot list derived from it, and the willingness to leave good ideas out of a cycle rather than extend it indefinitely.',
    contentAr:
      'الفريق الذي يصوّر حين ينفد محتواه يصوّر دائماً تحت الضغط، وهذا يظهر في النتيجة. تخطيط الإنتاج على دورات يقلب المعادلة: يوم واحد بتوجيه فني سليم يكفي لربع كامل من المنشورات المجدولة، ويُبنى التقويم قبل إخراج الكاميرا.\n\nوالمكسب ليس الكفاءة فحسب. الاتساق هو ما يبني التميّز، والاتساق خاصية جدولة بقدر ما هو خاصية تصميم. فحين تُنتَج الأصول دفعةً وفق قواعد بصرية محددة، يتراكم للحساب مظهر مميز. وحين تُنتَج بردّ الفعل، يبدأ كل شهر من الصفر.\n\nوالانضباط المطلوب غير برّاق: تقويم محتوى متفق عليه مسبقاً، وقائمة لقطات مشتقة منه، والاستعداد لاستبعاد أفكار جيدة من الدورة بدل تمديدها بلا نهاية.',
    coverImage: img('insight-3'),
    daysAgo: 41,
  },
  {
    slug: 'measure-fewer-things',
    categorySlug: 'growth',
    titleEn: 'Measure fewer things',
    titleAr: 'قِس أشياء أقل',
    excerptEn:
      'A dashboard with forty metrics is a way of avoiding the two that would force a decision.',
    excerptAr: 'لوحة بأربعين مؤشراً هي طريقة لتجنّب المؤشرين اللذين يفرضان قراراً.',
    contentEn:
      'Reporting expands to fill the space available. The result is a monthly deck nobody acts on, because no single number in it is uncomfortable enough to change a plan.\n\nA more useful arrangement is to agree, before spend starts, on the one or two outcomes the work is accountable to, and to define them precisely enough that they cannot drift. What counts as a conversion. Over what window. Attributed how. Written down, so that a disappointing month is a disappointing month rather than an opportunity to change the denominator.\n\nEverything else is diagnostic. Useful when a headline number moves and you need to know why, but not the thing being reported against.',
    contentAr:
      'تتمدد التقارير لتملأ المساحة المتاحة. والنتيجة عرض شهري لا يتصرف أحد بناءً عليه، لأن لا رقم فيه مزعج بما يكفي لتغيير خطة.\n\nالترتيب الأنفع هو الاتفاق، قبل بدء الإنفاق، على نتيجة أو نتيجتين يكون العمل مسؤولاً أمامهما، وتعريفهما بدقة تمنع انزلاقهما. ما الذي يُحتسب تحويلاً؟ وخلال أي نافذة؟ ومنسوباً كيف؟ مكتوباً، ليكون الشهر الضعيف شهراً ضعيفاً لا فرصة لتغيير المقام.\n\nوكل ما عدا ذلك تشخيصي: مفيد حين يتحرك الرقم الرئيسي وتحتاج أن تعرف السبب، لكنه ليس ما تُرفع التقارير وفقه.',
    coverImage: img('insight-4'),
    daysAgo: 63,
  },
];

const STAGES = [
  {
    step: '01',
    titleEn: 'Discover',
    titleAr: 'الاستكشاف',
    descriptionEn:
      'Commercial context, category, audience and the constraints that are real. We would rather find the awkward facts now than design around them later.',
    descriptionAr:
      'السياق التجاري والفئة والجمهور والقيود الحقيقية. نفضّل اكتشاف الحقائق الصعبة الآن بدل الالتفاف حولها لاحقاً.',
    services: ['Research', 'Audit', 'Interviews'],
  },
  {
    step: '02',
    titleEn: 'Strategy',
    titleAr: 'الاستراتيجية',
    descriptionEn:
      'Positioning and the messaging hierarchy that follows from it, agreed before a single visual decision is taken.',
    descriptionAr: 'التموضع وتسلسل الرسائل المنبثق عنه، يُتفق عليهما قبل أي قرار بصري.',
    services: ['Positioning', 'Messaging', 'Naming'],
  },
  {
    step: '03',
    titleEn: 'Create',
    titleAr: 'الإبداع',
    descriptionEn:
      'Identity, interface and content produced as one system, so the parts still agree with each other at launch.',
    descriptionAr: 'الهوية والواجهة والمحتوى تُنتَج كنظام واحد، لتبقى الأجزاء متسقة عند الإطلاق.',
    services: ['Identity', 'Design', 'Production'],
  },
  {
    step: '04',
    titleEn: 'Launch',
    titleAr: 'الإطلاق',
    descriptionEn:
      'Build, quality assurance and handover, including the templates and training that let the team run it themselves.',
    descriptionAr: 'التنفيذ وضبط الجودة والتسليم، مع القوالب والتدريب الذي يمكّن الفريق من إدارته بنفسه.',
    services: ['Build', 'QA', 'Handover'],
  },
  {
    step: '05',
    titleEn: 'Grow',
    titleAr: 'النمو',
    descriptionEn:
      'Measurement, iteration and the ongoing production cycle — reported against the outcome agreed at the start.',
    descriptionAr: 'القياس والتحسين ودورة الإنتاج المستمرة، بتقارير وفق النتيجة المتفق عليها في البداية.',
    services: ['Measurement', 'Iteration', 'Content'],
  },
];

const HEADER_NAV = [
  { labelEn: 'Start Here', labelAr: 'ابدأ من هنا', href: '/start-here', order: 0 },
  { labelEn: 'About', labelAr: 'من نحن', href: '/about', order: 1 },
  { labelEn: 'Services', labelAr: 'خدماتنا', href: '/services', order: 2 },
  { labelEn: 'Work', labelAr: 'أعمالنا', href: '/work', order: 3 },
  { labelEn: 'Insights', labelAr: 'رؤى', href: '/insights', order: 4 },
  { labelEn: 'Library', labelAr: 'المكتبة', href: '/library', order: 5 },
  { labelEn: 'Tools', labelAr: 'الأدوات', href: '/tools', order: 6 },
  { labelEn: 'Contact', labelAr: 'تواصل', href: '/contact', order: 7 },
];

const FOOTER_NAV = [
  { labelEn: 'About', labelAr: 'من نحن', href: '/about', order: 1 },
  { labelEn: 'Services', labelAr: 'خدماتنا', href: '/services', order: 2 },
  { labelEn: 'Work', labelAr: 'أعمالنا', href: '/work', order: 3 },
  { labelEn: 'Insights', labelAr: 'رؤى', href: '/insights', order: 4 },
  { labelEn: 'Contact', labelAr: 'تواصل', href: '/contact', order: 5 },
  { labelEn: 'Library', labelAr: 'المكتبة', href: '/library', order: 5 },
  { labelEn: 'Tools', labelAr: 'الأدوات', href: '/tools', order: 6 },
  { labelEn: 'Privacy', labelAr: 'الخصوصية', href: '/privacy', order: 7 },
  { labelEn: 'Terms', labelAr: 'الشروط', href: '/terms', order: 8 },
];

const SETTINGS_FILL = {
  /* Destination for contact and project inquiries. Filled only when still
   * empty, and editable in Admin -> Site settings at any time. */
  inquiryEmail: process.env.DEFAULT_INQUIRY_EMAIL || '',
  contactEmail: process.env.DEFAULT_INQUIRY_EMAIL || '',
  descriptionEn:
    'Noriva is a brand, digital and growth studio. We build identity systems, digital products and content programmes for businesses that need to be understood quickly and remembered afterwards.',
  descriptionAr:
    'نوريفا استوديو للعلامة والرقمنة والنمو. نبني أنظمة الهوية والمنتجات الرقمية وبرامج المحتوى للأعمال التي تحتاج أن تُفهم بسرعة وأن تُذكر بعدها.',
  footerDescriptionEn:
    'A brand, digital and growth studio working across identity, product and content.',
  footerDescriptionAr: 'استوديو للعلامة والرقمنة والنمو، يعمل عبر الهوية والمنتج والمحتوى.',
  seoTitleEn: 'Noriva — Brand, Digital & Growth Studio',
  seoTitleAr: 'نوريفا — استوديو العلامة والرقمنة والنمو',
  seoDescriptionEn:
    'Noriva builds identity systems, digital products and content programmes for businesses that need to be understood quickly and remembered afterwards.',
  seoDescriptionAr:
    'تبني نوريفا أنظمة الهوية والمنتجات الرقمية وبرامج المحتوى للأعمال التي تحتاج أن تُفهم بسرعة وأن تُذكر بعدها.',
  copyrightEn: '© Noriva. All rights reserved.',
  copyrightAr: '© نوريفا. جميع الحقوق محفوظة.',
};

const HOMEPAGE_FILL = {
  heroEyebrowEn: 'Brand · Digital · Growth',
  heroEyebrowAr: 'علامة · رقمنة · نمو',
  heroHeadlineEn: 'WORK WORTH\nREMEMBERING.',
  heroHeadlineAr: 'أعمال\nتستحق أن تُذكر.',
  heroSubtitleEn:
    'We build brands, digital products and content programmes that make a business understood quickly — and remembered afterwards.',
  heroSubtitleAr:
    'نبني العلامات والمنتجات الرقمية وبرامج المحتوى التي تجعل العمل مفهوماً بسرعة، ومذكوراً بعدها.',
  heroPrimaryCtaEn: 'Start a conversation',
  heroPrimaryCtaAr: 'ابدأ محادثة',
  heroSecondaryCtaEn: 'See our work',
  heroSecondaryCtaAr: 'شاهد أعمالنا',
  heroMediaUrl: img('hero'),
  statementEn:
    'Most businesses are not misunderstood because they lack a logo. They are misunderstood because nobody decided what they stand for, and then held every decision to it.',
  statementAr:
    'معظم الأعمال لا يُساء فهمها لنقص في الشعار، بل لأن أحداً لم يحسم ما تمثّله، ثم يُخضع كل قرار لذلك.',
  statementSupportEn:
    'We work from positioning through to what ships — identity, product, content and the measurement that tells you whether it worked. One team, one system, accountable to the same outcome.',
  statementSupportAr:
    'نعمل من التموضع وصولاً إلى ما يُطلق — الهوية والمنتج والمحتوى والقياس الذي يخبرك إن كان قد نجح. فريق واحد، ونظام واحد، ومسؤولية أمام النتيجة نفسها.',
  systemHeadlineEn: 'HOW WE WORK',
  systemHeadlineAr: 'كيف نعمل',
  intelligenceHeadlineEn: 'WHY NORIVA',
  intelligenceHeadlineAr: 'لماذا نوريفا',
  intelligenceBodyEn:
    'Strategy, design, engineering and production sit in one team, so nothing is lost in the handover between them. We design in Arabic and English in both directions from the first screen. And what we build is handed over so you can run it — templates, training and accounts that stay yours.',
  intelligenceBodyAr:
    'الاستراتيجية والتصميم والهندسة والإنتاج في فريق واحد، فلا يضيع شيء في التسليم بينها. نصمّم بالعربية والإنجليزية بالاتجاهين من أول شاشة. وما نبنيه يُسلَّم لتديره بنفسك: قوالب وتدريب وحسابات تبقى ملكك.',
  ctaHeadlineEn: "LET'S BUILD SOMETHING\nWORTH REMEMBERING.",
  ctaHeadlineAr: 'لنبنِ شيئاً\nيستحق أن يُذكر.',
  ctaDescriptionEn:
    'Tell us what you are working on. We will tell you honestly whether we are the right studio for it.',
  ctaDescriptionAr: 'أخبرنا بما تعمل عليه، وسنخبرك بصراحة إن كنا الاستوديو المناسب له.',
  ctaLabelEn: 'Start a conversation',
  ctaLabelAr: 'ابدأ محادثة',
};

const ABOUT_SECTIONS = [
  {
    key: 'story',
    titleEn: 'Who we are',
    titleAr: 'من نحن',
    bodyEn:
      'Noriva is a brand, digital and growth studio. We work with businesses at the point where what they do has outgrown how they explain it — where the offer is good, the room is competitive, and the difference is not landing.\n\nWe are deliberately structured as one team rather than as departments that hand work to each other. Strategy, design, engineering and production sit together, because the losses in this kind of work almost always happen at the seams.',
    bodyAr:
      'نوريفا استوديو للعلامة والرقمنة والنمو. نعمل مع الأعمال عند النقطة التي يتجاوز فيها ما تقدّمه قدرتها على شرحه — حيث يكون العرض جيداً، والسوق مزدحماً، والفارق لا يصل.\n\nنحن مبنيون عمداً كفريق واحد لا كأقسام تسلّم العمل لبعضها. الاستراتيجية والتصميم والهندسة والإنتاج معاً، لأن الخسائر في هذا النوع من العمل تقع دائماً عند المفاصل.',
  },
  {
    key: 'approach',
    titleEn: 'How we approach work',
    titleAr: 'كيف نتعامل مع العمل',
    bodyEn:
      'We start from the commercial question rather than the creative one. What decision is a customer actually making, what would change it, and what is the shortest honest route to that change.\n\nThat tends to produce quieter work than a pitch deck would. It also tends to survive contact with a real audience, a real budget and a real operations team, which is the only test that counts.',
    bodyAr:
      'نبدأ من السؤال التجاري لا الإبداعي: ما القرار الذي يتخذه العميل فعلاً، وما الذي قد يغيّره، وما أقصر طريق صادق إلى ذلك التغيير.\n\nينتج عن ذلك عادةً عمل أهدأ مما يقدّمه عرض تنافسي، لكنه عمل يصمد أمام جمهور حقيقي وميزانية حقيقية وفريق تشغيل حقيقي — وهو الاختبار الوحيد المهم.',
  },
  {
    key: 'bilingual',
    titleEn: 'Arabic and English, designed together',
    titleAr: 'العربية والإنجليزية، مصمّمتان معاً',
    bodyEn:
      'Bilingual work is designed in both directions from the first screen. Arabic is not treated as a translation layer applied at the end, and the typographic scale is set separately for each language rather than inherited from one.\n\nIn practice this is the difference between a site that works in Arabic and a site that was built in English and then mirrored.',
    bodyAr:
      'العمل ثنائي اللغة يُصمَّم بالاتجاهين من أول شاشة. لا تُعامل العربية كطبقة ترجمة تُضاف في النهاية، ويُضبط مقياس الخطوط لكل لغة على حدة بدل توريثه من إحداهما.\n\nعملياً، هذا هو الفرق بين موقع يعمل بالعربية وموقع بُني بالإنجليزية ثم عُكس.',
  },
  {
    key: 'handover',
    titleEn: 'What you own at the end',
    titleAr: 'ما تملكه في النهاية',
    bodyEn:
      'Work is handed over so that you can run it. That means editable content rather than developer tickets, templates and components rather than one-off artwork, documentation written for the people who will actually use it, and advertising accounts that remain in your name and on your billing.\n\nIf we stop working together, nothing you depend on leaves with us.',
    bodyAr:
      'يُسلَّم العمل لتتمكن من إدارته: محتوى قابل للتحرير بدل طلبات برمجية، وقوالب ومكوّنات بدل تصاميم لمرة واحدة، وتوثيق مكتوب لمن سيستخدمه فعلاً، وحسابات إعلانية تبقى باسمك وعلى فوترتك.\n\nوإذا توقّف تعاوننا، لا يغادر معنا شيء تعتمد عليه.',
  },
];

/* The Start Here router. Every card points at a section that already exists,
 * and all of it is editable in Admin — nothing here is hard-coded in a page. */
const START_HERE_PATHS = [
  {
    titleEn: 'I know which service I need',
    titleAr: 'أعرف الخدمة التي أحتاجها',
    bodyEn: 'Browse the full set of solutions and how each one works.',
    bodyAr: 'تصفح الخدمات كاملة وكيف تعمل كل واحدة منها.',
    href: '/services',
    labelEn: 'See solutions',
    labelAr: 'استعرض الخدمات',
  },
  {
    titleEn: 'I want to see the work first',
    titleAr: 'أريد الاطلاع على الأعمال أولًا',
    bodyEn: 'Selected projects and the thinking behind them.',
    bodyAr: 'مشاريع مختارة والتفكير الذي وراءها.',
    href: '/work',
    labelEn: 'See work',
    labelAr: 'استعرض الأعمال',
  },
  {
    titleEn: 'I want to work the numbers',
    titleAr: 'أريد العمل على الأرقام',
    bodyEn: 'Interactive calculators you can use right now.',
    bodyAr: 'حاسبات تفاعلية يمكنك استخدامها الآن.',
    href: '/tools',
    labelEn: 'Open tools',
    labelAr: 'افتح الأدوات',
  },
  {
    titleEn: 'I need templates and guides',
    titleAr: 'أحتاج قوالب وأدلة',
    bodyEn: 'Downloadable models, documents and guides.',
    bodyAr: 'نماذج ومستندات وأدلة قابلة للتحميل.',
    href: '/library',
    labelEn: 'Open the library',
    labelAr: 'افتح المكتبة',
  },
  {
    titleEn: 'I want to read first',
    titleAr: 'أريد القراءة أولًا',
    bodyEn: 'Articles on brand, digital and growth.',
    bodyAr: 'مقالات في العلامة والرقمنة والنمو.',
    href: '/insights',
    labelEn: 'Read insights',
    labelAr: 'اقرأ الرؤى',
  },
  {
    titleEn: 'I am ready to start a project',
    titleAr: 'أنا جاهز لبدء مشروع',
    bodyEn: 'Answer a few questions and the team will come back to you.',
    bodyAr: 'أجب عن بضعة أسئلة وسيعود إليك الفريق.',
    href: '/start-a-project',
    labelEn: 'Start a project',
    labelAr: 'ابدأ مشروعك',
  },
];

const PAGES = [
  {
    key: 'about',
    titleEn: 'A studio built as one team',
    titleAr: 'استوديو مبني كفريق واحد',
    bodyEn:
      'Brand, digital and growth in one place — because the losses in this kind of work happen at the handovers between them.',
    bodyAr: 'العلامة والرقمنة والنمو في مكان واحد، لأن الخسائر في هذا العمل تقع عند التسليم بينها.',
    content: { sections: ABOUT_SECTIONS },
  },
  {
    key: 'start-here',
    titleEn: 'Start here',
    titleAr: 'ابدأ من هنا',
    bodyEn: 'Tell us where you are and we will point you at the right place to begin.',
    bodyAr: 'أخبرنا أين أنت الآن وسنوجهك إلى النقطة المناسبة للبدء.',
    content: { paths: START_HERE_PATHS },
  },
  {
    key: 'library',
    titleEn: 'Library',
    titleAr: 'المكتبة',
    bodyEn: 'Templates, models and guides you can put to work today. Add resources from Admin.',
    bodyAr: 'قوالب ونماذج وأدلة جاهزة للاستخدام اليوم. أضف الموارد من لوحة التحكم.',
    content: {},
  },
  {
    key: 'tools',
    titleEn: 'Tools',
    titleAr: 'الأدوات',
    bodyEn: 'Interactive calculators built around the numbers that decide a result. Add tools from Admin.',
    bodyAr: 'حاسبات تفاعلية مبنية على الأرقام التي تصنع الفرق. أضف الأدوات من لوحة التحكم.',
    content: {},
  },
];


/* The shipped art direction, registered in the Media library so each image is
 * selectable in Admin's media picker and can be swapped for real photography
 * without touching code. Dimensions mirror scripts/generate_imagery.py. */
const MEDIA = [
  ['hero', 2400, 1350],
  ['about', 1800, 1200],
  ['cta', 2000, 1000],
  ['service-brand', 1400, 1050],
  ['service-digital', 1400, 1050],
  ['service-content', 1400, 1050],
  ['service-growth', 1400, 1050],
  ['service-experience', 1400, 1050],
  ...Array.from({ length: 6 }, (_, i) => [`work-${i + 1}`, i % 2 ? 1400 : 1800, i % 2 ? 1750 : 1150]),
  ...Array.from({ length: 12 }, (_, i) => [`gallery-${i + 1}`, 1600, 1100]),
  ...Array.from({ length: 4 }, (_, i) => [`insight-${i + 1}`, 1600, 900]),
  ...Array.from({ length: 5 }, (_, i) => [`stage-${i + 1}`, 1200, 900]),
];

/* --------------------------------------------------------------- helpers */

/**
 * Fills only the fields that are still empty on a singleton row. An empty fill
 * value is skipped, so an unset environment variable does not report a write
 * that changes nothing on every deploy.
 */
function missingFields(row, fill) {
  const patch = {};
  for (const [k, v] of Object.entries(fill)) {
    const current = row?.[k];
    if (current === undefined) continue;
    if (v === '' || v === null || v === undefined) continue;
    if (current === null || current === '') patch[k] = v;
  }
  return patch;
}


/* --------------------------------------------------- Food & Beverage ----
 * Positioning, the service catalogue, the menu tools and the library entries.
 *
 * Singleton copy is only rewritten while it still holds a value this
 * repository shipped, so anything edited in Admin is never overwritten. Rows
 * are created only when absent. Nothing here is published on the client's
 * behalf except the menu service and the calculators, which are complete.
 */

/** Values previous versions of this script wrote, plus the empty string. */
const SHIPPED_DEFAULTS = new Set([
  '',
  'Restaurant · Creative · Growth',
  'مطاعم · إبداع · نمو',
  'Noriva — Brand, Digital & Growth Studio',
  'نوريفا — استوديو العلامة والرقمنة والنمو',
  'A brand, digital and growth studio working across identity, product and content.',
  'استوديو للعلامة والرقمنة والنمو، يعمل عبر الهوية والمنتج والمحتوى.',
  'Noriva is a brand, digital and growth studio. We build identity systems, digital products and content programmes for businesses that need to be understood quickly and remembered afterwards.',
  'نوريفا استوديو للعلامة والرقمنة والنمو. نبني أنظمة الهوية والمنتجات الرقمية وبرامج المحتوى للأعمال التي تحتاج أن تُفهم بسرعة وأن تُذكر بعدها.',
  'Noriva builds identity systems, digital products and content programmes for businesses that need to be understood quickly and remembered afterwards.',
  'WE MAKE RESTAURANTS\nIMPOSSIBLE TO IGNORE.',
  // The generic studio hero this script shipped before the F&B positioning.
  'Brand · Digital · Growth',
  'علامة · رقمنة · نمو',
  'WORK WORTH\nREMEMBERING.',
  'أعمال\nتستحق أن تُذكر.',
  'We build brands, digital products and content programmes that make a business understood quickly — and remembered afterwards.',
  'نبني العلامات والمنتجات الرقمية وبرامج المحتوى التي تجعل العمل مفهوماً بسرعة، ومذكوراً بعدها.',
  'Start a conversation',
  'ابدأ محادثة',
  'See our work',
  'شاهد أعمالنا',
  'Most businesses are not misunderstood because they lack a logo. They are misunderstood because nobody decided what they stand for, and then held every decision to it.',
  'معظم الأعمال لا يُساء فهمها لنقص في الشعار، بل لأن أحداً لم يحسم ما تمثّله، ثم يُخضع كل قرار لذلك.',
  // The restaurant-era hero and tagline shipped in prisma/seed.ts.
  'Restaurant Marketing · Creative · Advertising · Growth',
  'تسويق المطاعم · إبداع · إعلانات · نمو',
  'WE MAKE RESTAURANTS\nIMPOSSIBLE TO IGNORE.',
  'نجعل المطاعم\nمستحيلة التجاهل.',
  'We build the attention that turns a brand, an experience and a venue into growth.',
  'نبني الانتباه الذي يحوّل العلامة والتجربة والنشاط إلى نمو.',
  'Start a Project',
  'ابدأ مشروعك',
  'Explore Our Work',
  'استعرض أعمالنا',
]);

/** Rewrites a field only when it still carries shipped copy. */
function repositionable(row, fill) {
  const patch = {};
  for (const [key, value] of Object.entries(fill)) {
    const current = row?.[key];
    if (typeof current !== 'string') continue;
    if (current === value) continue;
    if (SHIPPED_DEFAULTS.has(current.trim())) patch[key] = value;
  }
  return patch;
}

async function applyFoodAndBeverage() {
  const settingsRow = await prisma.siteSettings.findUnique({ where: { id: 'singleton' } });
  const settingsPatch = repositionable(settingsRow, POSITIONING.settings);
  if (Object.keys(settingsPatch).length && !REPORT_ONLY) {
    await prisma.siteSettings.update({ where: { id: 'singleton' }, data: settingsPatch });
    note(`positioning:settings(${Object.keys(settingsPatch).length})`);
  }

  const homeRow = await prisma.homepageContent.findUnique({ where: { id: 'singleton' } });
  const homePatch = repositionable(homeRow, POSITIONING.homepage);
  if (Object.keys(homePatch).length && !REPORT_ONLY) {
    await prisma.homepageContent.update({ where: { id: 'singleton' }, data: homePatch });
    note(`positioning:homepage(${Object.keys(homePatch).length})`);
  }

  if (REPORT_ONLY) return;

  /* Services whose shipped copy no longer matches what the business does.
     Rewritten field by field, and only while the stored value is still the
     text this repository shipped. */
  for (const entry of SERVICE_REPOSITIONING) {
    const row = await prisma.service.findUnique({ where: { slug: entry.slug } });
    if (!row) continue;

    const patch = {};
    for (const [key, oldValue] of Object.entries(entry.was)) {
      if (row[key] === oldValue) patch[key] = entry.now[key];
    }
    // The SEO description follows the summary when it was left as the summary.
    for (const key of ['seoDescriptionEn', 'seoDescriptionAr']) {
      const source = key.endsWith('En') ? 'summaryEn' : 'summaryAr';
      if (row[key] === entry.was[source]) patch[key] = entry.now[key];
    }
    if (entry.deliverables && JSON.stringify(row.deliverables) !== JSON.stringify(entry.deliverables)) {
      const shipped = ['Art direction', 'Photography', 'Motion and short-form video'];
      const current = Array.isArray(row.deliverables) ? row.deliverables.map((d) => d?.labelEn) : [];
      if (shipped.every((label) => current.includes(label))) patch.deliverables = entry.deliverables;
    }

    if (Object.keys(patch).length) {
      await prisma.service.update({ where: { slug: entry.slug }, data: patch });
      note(`repositioned:${entry.slug}(${Object.keys(patch).length})`);
    }
  }

  /* Service groups */
  const groupIdBySlug = {};
  for (const group of SERVICE_GROUPS) {
    const row = await prisma.serviceCategory.upsert({
      where: { slug: group.slug },
      update: {},
      create: { slug: group.slug, nameEn: group.nameEn, nameAr: group.nameAr, order: group.order },
    });
    groupIdBySlug[group.slug] = row.id;
  }

  /* Services */
  for (const service of FNB_SERVICES) {
    const existing = await prisma.service.findUnique({ where: { slug: service.slug } });
    if (existing) continue;

    await prisma.service.create({
      data: {
        slug: service.slug,
        nameEn: service.nameEn,
        nameAr: service.nameAr,
        categoryId: groupIdBySlug[service.group] ?? null,
        summaryEn: service.summaryEn,
        summaryAr: service.summaryAr,
        heroHeadlineEn: service.nameEn,
        heroHeadlineAr: service.nameAr,
        heroDescriptionEn: service.heroDescriptionEn,
        heroDescriptionAr: service.heroDescriptionAr,
        whatWeDoEn: service.whatWeDoEn,
        whatWeDoAr: service.whatWeDoAr,
        approachEn: service.approachEn,
        approachAr: service.approachAr,
        deliverables: service.deliverables.map(([en, ar]) => ({ labelEn: en, labelAr: ar })),
        process: service.process.map(([titleEn, titleAr, bodyEn, bodyAr]) => ({ titleEn, titleAr, bodyEn, bodyAr })),
        faqs: service.faqs.map(([questionEn, questionAr, answerEn, answerAr]) => ({
          questionEn, questionAr, answerEn, answerAr,
        })),
        intake: service.intake,
        seoDescriptionEn: service.summaryEn,
        seoDescriptionAr: service.summaryAr,
        status: service.status,
        order: service.order,
      },
    });
    note(`service:${service.slug}${service.status === 'DRAFT' ? ' (draft)' : ''}`);
  }

  /* The menu service carries an illustrative example on its page. */
  const menu = FNB_SERVICES.find((s) => s.example);
  if (menu) {
    const page = await prisma.page.findUnique({ where: { key: 'menu-example' } });
    if (!page) {
      await prisma.page.create({
        data: {
          key: 'menu-example',
          titleEn: menu.example.titleEn,
          titleAr: menu.example.titleAr,
          bodyEn: menu.example.bodyEn,
          bodyAr: menu.example.bodyAr,
          noindex: true,
          content: {},
        },
      });
      note('page:menu-example');
    }
  }

  /* Tools — complete calculators, so they ship published. */
  for (const tool of FNB_TOOLS) {
    const existing = await prisma.tool.findUnique({ where: { slug: tool.slug } });
    if (existing) continue;
    await prisma.tool.create({
      data: {
        slug: tool.slug,
        nameEn: tool.nameEn,
        nameAr: tool.nameAr,
        summaryEn: tool.summaryEn,
        summaryAr: tool.summaryAr,
        seoDescriptionEn: tool.summaryEn,
        seoDescriptionAr: tool.summaryAr,
        config: tool.config,
        featured: tool.featured,
        status: 'PUBLISHED',
        order: tool.order,
      },
    });
    note(`tool:${tool.slug}`);
  }

  /* Library categories and entries. Entries stay draft until a file is added. */
  const libraryGroups = [
    ['menu', 'Menu', 'القائمة', 1],
    ['finance', 'Finance & Profitability', 'المالية والربحية', 2],
    ['operations', 'Operations', 'التشغيل', 3],
    ['marketing', 'Marketing', 'التسويق', 4],
  ];
  const resourceCatBySlug = {};
  for (const [slug, nameEn, nameAr, order] of libraryGroups) {
    const row = await prisma.resourceCategory.upsert({
      where: { slug },
      update: {},
      create: { slug, nameEn, nameAr, order },
    });
    resourceCatBySlug[slug] = row.id;
  }

  const categoryForResource = (slug) => {
    if (slug.includes('menu') || slug.includes('food-cost') || slug.includes('product-mix') || slug.includes('item-profitability')) return 'menu';
    if (slug.includes('budget') || slug.includes('kpi')) return 'finance';
    if (slug.includes('marketing') || slug.includes('campaign')) return 'marketing';
    return 'operations';
  };

  for (const [slug, type, titleEn, titleAr, summaryEn, summaryAr] of FNB_RESOURCES) {
    const existing = await prisma.resource.findUnique({ where: { slug } });
    if (existing) continue;
    await prisma.resource.create({
      data: {
        slug,
        type,
        titleEn,
        titleAr,
        summaryEn,
        summaryAr,
        seoDescriptionEn: summaryEn,
        seoDescriptionAr: summaryAr,
        categoryId: resourceCatBySlug[categoryForResource(slug)] ?? null,
        /* Draft by design: a resource cannot be published until its file is
           uploaded in Admin, so the Library never offers a dead download. */
        status: 'DRAFT',
      },
    });
    note(`resource:${slug} (draft, awaiting file)`);
  }

  /* Knowledge-centre categories */
  for (const [slug, nameEn, nameAr] of FNB_INSIGHT_CATEGORIES) {
    const existing = await prisma.insightCategory.findUnique({ where: { slug } });
    if (existing) continue;
    await prisma.insightCategory.create({ data: { slug, nameEn, nameAr } });
    note(`insight-category:${slug}`);
  }

  /* Start Here: replace the generic router with the F&B one, but only while it
     still holds the cards this repository shipped. */
  const startHere = await prisma.page.findUnique({ where: { key: 'start-here' } });
  if (startHere) {
    const paths = Array.isArray(startHere.content?.paths) ? startHere.content.paths : [];
    const untouched = paths.length === 0 || paths.every((p) => SHIPPED_START_HERE.has(p?.href));
    if (untouched) {
      const same = JSON.stringify(paths) === JSON.stringify(START_HERE_PATHS_FNB);
      if (!same) {
        await prisma.page.update({
          where: { key: 'start-here' },
          data: { content: { ...(startHere.content ?? {}), paths: START_HERE_PATHS_FNB } },
        });
        note('start-here:F&B routing');
      }
    }
  }
}

/** The hrefs the generic Start Here shipped with. */
const SHIPPED_START_HERE = new Set(['/services', '/work', '/tools', '/library', '/insights', '/start-a-project']);

async function main() {
  const counts = {
    services: await prisma.service.count(),
    projects: await prisma.project.count(),
    insights: await prisma.insight.count(),
    stages: await prisma.systemStage.count(),
    navigation: await prisma.navigationItem.count(),
    pages: await prisma.page.count(),
    admins: await prisma.adminUser.count(),
    statistics: await prisma.statistic.count(),
    testimonials: await prisma.testimonial.count(),
  };

  console.log('[ensure-content] existing rows:', JSON.stringify(counts));

  if (REPORT_ONLY) {
    await prisma.$disconnect();
    return;
  }

  /* --- Singletons: fill empty fields only. ------------------------------ */
  const settings = await prisma.siteSettings.upsert({
    where: { id: 'singleton' },
    update: {},
    create: { id: 'singleton' },
  });
  const settingsPatch = missingFields(settings, SETTINGS_FILL);
  if (Object.keys(settingsPatch).length) {
    await prisma.siteSettings.update({ where: { id: 'singleton' }, data: settingsPatch });
    note(`siteSettings(${Object.keys(settingsPatch).length} empty fields)`);
  }

  const home = await prisma.homepageContent.upsert({
    where: { id: 'singleton' },
    update: {},
    create: { id: 'singleton' },
  });
  const homePatch = missingFields(home, HOMEPAGE_FILL);
  if (Object.keys(homePatch).length) {
    await prisma.homepageContent.update({ where: { id: 'singleton' }, data: homePatch });
    note(`homepageContent(${Object.keys(homePatch).length} empty fields)`);
  }

  /* --- Navigation ------------------------------------------------------- */
  for (const [location, items] of [
    ['header', HEADER_NAV],
    ['footer', FOOTER_NAV],
  ]) {
    for (const item of items) {
      const exists = await prisma.navigationItem.findFirst({ where: { location, href: item.href } });
      if (!exists) {
        await prisma.navigationItem.create({ data: { ...item, location } });
        note(`nav:${location}${item.href}`);
      }
    }
  }

  /* --- Process stages --------------------------------------------------- */
  for (const [i, s] of STAGES.entries()) {
    const exists = await prisma.systemStage.findFirst({ where: { step: s.step } });
    if (!exists) {
      await prisma.systemStage.create({
        data: { ...s, order: i, mediaUrl: img(`stage-${i + 1}`) },
      });
      note(`stage:${s.step}`);
    }
  }

  /* --- Services --------------------------------------------------------- */
  const serviceIdBySlug = {};
  for (const svc of SERVICES) {
    const existing = await prisma.service.findUnique({ where: { slug: svc.slug } });
    if (existing) {
      serviceIdBySlug[svc.slug] = existing.id;
      continue;
    }
    const row = await prisma.service.create({
      data: {
        slug: svc.slug,
        nameEn: svc.nameEn,
        nameAr: svc.nameAr,
        summaryEn: svc.summaryEn,
        summaryAr: svc.summaryAr,
        heroHeadlineEn: svc.nameEn,
        heroHeadlineAr: svc.nameAr,
        heroDescriptionEn: svc.heroDescriptionEn,
        heroDescriptionAr: svc.heroDescriptionAr,
        whatWeDoEn: svc.whatWeDoEn,
        whatWeDoAr: svc.whatWeDoAr,
        approachEn: svc.approachEn,
        approachAr: svc.approachAr,
        deliverables: svc.deliverables.map(([en, ar]) => ({ labelEn: en, labelAr: ar })),
        featuredImage: svc.featuredImage,
        status: 'PUBLISHED',
        order: svc.order,
        seoDescriptionEn: svc.summaryEn,
        seoDescriptionAr: svc.summaryAr,
      },
    });
    serviceIdBySlug[svc.slug] = row.id;
    note(`service:${svc.slug}`);
  }

  /* --- Work categories -------------------------------------------------- */
  const workCatIdBySlug = {};
  for (const c of WORK_CATEGORIES) {
    const row = await prisma.workCategory.upsert({
      where: { slug: c.slug },
      update: {},
      create: c,
    });
    workCatIdBySlug[c.slug] = row.id;
  }

  /* --- Projects ---------------------------------------------------------
   * These are placeholders, not client work: they carry the client name
   * "Sample project" and no verified results. They are created as DRAFT so an
   * editor can see the shape of a case study in Admin, and they never reach a
   * visitor until real work replaces them. */
  for (const p of PROJECTS) {
    const existing = await prisma.project.findUnique({ where: { slug: p.slug } });
    if (existing) continue;
    const row = await prisma.project.create({
      data: {
        slug: p.slug,
        titleEn: p.titleEn,
        titleAr: p.titleAr,
        client: p.client,
        categoryId: workCatIdBySlug[p.categorySlug] ?? null,
        descriptionEn: p.descriptionEn,
        descriptionAr: p.descriptionAr,
        heroMediaUrl: p.heroMediaUrl,
        gallery: p.gallery,
        year: p.year,
        location: p.location,
        featured: false,
        status: 'DRAFT',
        noindex: true,
        order: p.order,
        seoDescriptionEn: p.descriptionEn,
        seoDescriptionAr: p.descriptionAr,
        /* results intentionally left empty: no verified metrics exist. */
      },
    });
    for (const slug of p.serviceSlugs) {
      const serviceId = serviceIdBySlug[slug];
      if (serviceId) {
        await prisma.projectService.create({ data: { projectId: row.id, serviceId } });
      }
    }
    note(`project:${p.slug}`);
  }

  /* --- Retire previously published placeholders --------------------------
   * Earlier versions of this script published the sample projects. They are
   * demo content, so they must not sit on the public site presenting
   * themselves as real client work. Only rows this script created are touched
   * — matched on both the sample slug and the "Sample project" client — and
   * the rows are unpublished, never deleted, so nothing an editor wrote is
   * lost and Admin can republish if a placeholder was adopted deliberately. */
  const placeholderSlugs = PROJECTS.map((p) => p.slug);
  const stillLive = await prisma.project.findMany({
    where: { slug: { in: placeholderSlugs }, client: 'Sample project', status: 'PUBLISHED' },
    select: { id: true, slug: true },
  });
  if (stillLive.length && !REPORT_ONLY) {
    await prisma.project.updateMany({
      where: { id: { in: stillLive.map((r) => r.id) } },
      data: { status: 'DRAFT', featured: false, noindex: true },
    });
    for (const row of stillLive) note(`unpublished placeholder:${row.slug}`);
  } else if (stillLive.length) {
    for (const row of stillLive) note(`would unpublish placeholder:${row.slug}`);
  }

  /* --- Insights --------------------------------------------------------- */
  const insightCatIdBySlug = {};
  for (const c of INSIGHT_CATEGORIES) {
    const row = await prisma.insightCategory.upsert({
      where: { slug: c.slug },
      update: {},
      create: c,
    });
    insightCatIdBySlug[c.slug] = row.id;
  }

  for (const a of INSIGHTS) {
    const existing = await prisma.insight.findUnique({ where: { slug: a.slug } });
    if (existing) continue;
    await prisma.insight.create({
      data: {
        slug: a.slug,
        titleEn: a.titleEn,
        titleAr: a.titleAr,
        excerptEn: a.excerptEn,
        excerptAr: a.excerptAr,
        contentEn: a.contentEn,
        contentAr: a.contentAr,
        coverImage: a.coverImage,
        categoryId: insightCatIdBySlug[a.categorySlug] ?? null,
        author: 'Noriva',
        publishedAt: new Date(Date.now() - a.daysAgo * 86400000),
        status: 'PUBLISHED',
        seoDescriptionEn: a.excerptEn,
        seoDescriptionAr: a.excerptAr,
      },
    });
    note(`insight:${a.slug}`);
  }

  /* --- Editorial pages -------------------------------------------------- */
  for (const p of PAGES) {
    const existing = await prisma.page.findUnique({ where: { key: p.key } });
    if (!existing) {
      await prisma.page.create({ data: p });
      note(`page:${p.key}`);
    }
  }

  /* --- Media library ---------------------------------------------------- */
  for (const [name, width, height] of MEDIA) {
    const url = img(name);
    const exists = await prisma.media.findFirst({ where: { url } });
    if (exists) continue;
    let size = 0;
    try {
      size = statSync(path.join(process.cwd(), 'public', 'img', `${name}.jpg`)).size;
    } catch {
      /* File missing from the build: skip rather than register a dead row. */
      continue;
    }
    await prisma.media.create({
      data: {
        filename: `${name}.jpg`,
        url,
        kind: 'IMAGE',
        mimeType: 'image/jpeg',
        size,
        width,
        height,
        altEn: 'Noriva art direction',
        altAr: 'توجيه فني — نوريفا',
      },
    });
    note(`media:${name}`);
  }

  /* --- Admin account (only when explicitly requested and configured) ---- */
  if (WITH_ADMIN) {
    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;
    if (!email || !password) {
      console.log('[ensure-content] --admin given but ADMIN_EMAIL/ADMIN_PASSWORD are not set; skipping.');
    } else if (password.length < 10) {
      throw new Error('ADMIN_PASSWORD must be at least 10 characters.');
    } else {
      const passwordHash = await bcrypt.hash(password, 12);
      await prisma.adminUser.upsert({
        where: { email: email.toLowerCase() },
        update: { passwordHash, active: true },
        create: {
          email: email.toLowerCase(),
          name: process.env.ADMIN_NAME || 'Noriva',
          passwordHash,
          role: 'OWNER',
          active: true,
        },
      });
      /* The password itself is never logged. */
      note(`adminUser:${email.toLowerCase()}`);
    }
  }

  // Runs last, so the F&B positioning writes over content this script has
  // just created rather than racing it.
  await applyFoodAndBeverage();

  console.log(
    created.length
      ? `[ensure-content] created ${created.length} records: ${created.join(', ')}`
      : '[ensure-content] nothing missing; no changes made.',
  );
  await prisma.$disconnect();
}

main().catch(async (err) => {
  console.error('[ensure-content] failed:', err);
  await prisma.$disconnect();
  process.exit(1);
});
