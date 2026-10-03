import type { Locale } from './i18n';

/** Public discovery only: CMS category IDs and indexed service URLs stay intact. */
export const PRACTICES = [
  {
    id: 'strategy',
    en: 'Restaurant & Café Consulting',
    ar: 'استشارات المطاعم والمقاهي',
    needEn: 'Diagnose my restaurant',
    needAr: 'تشخيص أداء مطعمي',
    summaryEn: 'Find the constraints in your concept, service and business model.',
    summaryAr: 'نحدد ما يعيق مفهوم مشروعك وخدمته وأداءه التجاري.',
    match: /consulting|audit|management/,
    image: 'training',
  },
  {
    id: 'launch',
    en: 'New Restaurant Development',
    ar: 'تأسيس المطاعم والمقاهي',
    needEn: 'Start a restaurant',
    needAr: 'تأسيس مطعم',
    summaryEn: 'Connect the concept, site, menu and opening plan before investing.',
    summaryAr: 'نربط المفهوم والموقع والقائمة وخطة الافتتاح قبل الاستثمار.',
    match: /new-restaurant|new-cafe|concept-development|opening|launch/,
    image: 'launch',
  },
  {
    id: 'menu',
    en: 'Menu, Costing & Profitability',
    ar: 'القائمة والتكلفة والربحية',
    needEn: 'Improve my menu',
    needAr: 'تحسين قائمتي',
    summaryEn: 'Read every dish through demand, recipe cost and contribution.',
    summaryAr: 'نقرأ كل صنف من خلال الطلب وتكلفة الوصفة وهامش المساهمة.',
    match: /menu|recipe|food-cost/,
    image: 'menu',
  },
  {
    id: 'operations',
    en: 'Operations & Performance',
    ar: 'التشغيل والأداء',
    needEn: 'Fix operations',
    needAr: 'تحسين التشغيل',
    summaryEn: 'Control purchasing, stock, waste and the service bottleneck.',
    summaryAr: 'نضبط الشراء والمخزون والهدر ونقاط اختناق الخدمة.',
    match:
      /operat|inventory|waste|staff|labor|quality|cost-control|cost-reduction|performance-analysis|performance-improvement/,
    image: 'inventory',
  },
  {
    id: 'finance',
    en: 'Finance & Profitability',
    ar: 'المالية والربحية',
    needEn: 'Improve profit',
    needAr: 'تحسين الربح',
    summaryEn: 'Make branch P&L, cash flow and break-even useful for decisions.',
    summaryAr: 'نحوّل أرباح الفروع والتدفق النقدي ونقطة التعادل إلى قرارات.',
    match: /financ|profit|budget|cash|break-even|margin/,
    image: 'costing',
  },
  {
    id: 'brand',
    en: 'Brand Strategy & Identity',
    ar: 'استراتيجية العلامة وهويتها',
    needEn: 'Build my brand',
    needAr: 'بناء علامتي',
    summaryEn: 'A clear position expressed through menus, packaging and experience.',
    summaryAr: 'تموضع واضح يظهر في القائمة والتغليف وتجربة الضيف.',
    match: /brand|identity|graphic|creative-direction|customer-experience|packaging/,
    image: 'brand',
  },
  {
    id: 'marketing',
    en: 'Marketing & Content',
    ar: 'التسويق والمحتوى',
    needEn: 'Increase sales',
    needAr: 'زيادة المبيعات',
    summaryEn: 'Create restaurant content and campaigns tied to visits and orders.',
    summaryAr: 'نصنع محتوى وحملات مرتبطة بزيارات المطعم وطلباته.',
    match: /market|advertis|content|social|campaign|photo|video|reels|ads|community|roas/,
    image: 'training',
  },
  {
    id: 'delivery',
    en: 'Delivery & Digital Growth',
    ar: 'التوصيل والنمو الرقمي',
    needEn: 'Grow delivery',
    needAr: 'تنمية التوصيل',
    summaryEn: 'Price for commission, discounts, packaging and real channel margin.',
    summaryAr: 'نسعّر وفق العمولة والخصومات والتغليف وهامش القناة الفعلي.',
    match: /delivery|digital|web/,
    image: 'delivery',
  },
  {
    id: 'growth',
    en: 'Expansion & Feasibility',
    ar: 'التوسع والجدوى',
    needEn: 'Plan expansion',
    needAr: 'التخطيط للتوسع',
    summaryEn: 'Test demand, capacity and unit economics before adding branches.',
    summaryAr: 'نختبر الطلب والطاقة التشغيلية واقتصاديات الفرع قبل التوسع.',
    match: /growth|expan|branch|feasib/,
    image: 'launch',
  },
] as const;

export function practiceFor(slug: string) {
  // A delivery menu is a channel decision, before it is a menu decision.
  if (/delivery/.test(slug)) return PRACTICES[7];
  if (/operational/.test(slug)) return PRACTICES[3];
  return PRACTICES.find((p) => p.match.test(slug)) ?? PRACTICES[0];
}

export function practiceLabel(p: (typeof PRACTICES)[number], locale: Locale, byNeed = false) {
  return byNeed ? (locale === 'ar' ? p.needAr : p.needEn) : locale === 'ar' ? p.ar : p.en;
}

export function resourceKind(type: string, locale: Locale) {
  const kinds: Record<string, [string, string]> = {
    EXCEL: ['Working template', 'نموذج عمل'],
    WORD: ['Working template', 'نموذج عمل'],
    TEMPLATE: ['Working template', 'نموذج عمل'],
    PDF: ['Guide', 'دليل'],
    GUIDE: ['Guide', 'دليل'],
    REPORT: ['Framework', 'إطار عمل'],
  };
  const pair = kinds[type] ?? ['Resource', 'مورد'];
  return pair[locale === 'ar' ? 1 : 0];
}

export const RESOURCE_KINDS = ['guide', 'checklist', 'template', 'framework', 'sample'] as const;
export function resourcePurpose(slug: string, type: string): (typeof RESOURCE_KINDS)[number] {
  if (/sample|example/.test(slug)) return 'sample';
  if (/checklist|questions/.test(slug)) return 'checklist';
  if (/scorecard|matrix|framework|assessment/.test(slug) || type === 'REPORT') return 'framework';
  if (type === 'GUIDE' || type === 'PDF') return 'guide';
  return 'template';
}
export function resourcePurposeLabel(kind: string, locale: Locale) {
  const labels: Record<string, [string, string]> = {
    guide: ['Guides', 'أدلة'],
    checklist: ['Checklists', 'قوائم تحقق'],
    template: ['Templates', 'نماذج عمل'],
    framework: ['Frameworks', 'أطر عمل'],
    sample: ['Samples', 'أمثلة تطبيقية'],
  };
  return (labels[kind] ?? ['Resources', 'الموارد'])[locale === 'ar' ? 1 : 0];
}
