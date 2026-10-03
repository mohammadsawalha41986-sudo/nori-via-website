import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { mkdirSync, copyFileSync, statSync } from 'node:fs';
import path from 'node:path';
const db = new PrismaClient();
const samples = [
  {
    slug: 'sample-delivery-contribution-review',
    source: 'delivery-profitability-checklist',
    titleEn: 'Delivery contribution review: a worked example',
    titleAr: 'مراجعة مساهمة التوصيل: مثال تطبيقي',
    summaryEn:
      'Follow a fictional order from revenue to contribution, then identify the decisions behind its margin.',
    summaryAr: 'تتبّع طلبًا افتراضيًا من الإيراد إلى هامش المساهمة وحدد القرارات التي تحكم ربحيته.',
    descriptionEn:
      'Illustrative example, not client results. Amounts are SAR and exclude VAT.\n\nOrder revenue: 60.00\nFood cost: 18.00\nPlatform commission: 15.00\nPackaging: 3.00\nRestaurant-funded discount: 6.00\nOther variable fulfilment cost: 1.50\nOrder contribution: 16.50 (27.5% of revenue)\n\nThis contribution must still cover fixed costs; it is not net profit. Confirm the commission base and who funds promotions from your platform contract.\n\nDecision: test bundles and channel pricing before adding discounts. Compare contribution per order and total contribution at the resulting order volume. The download is the supporting working checklist; use the interactive delivery calculator to test your own assumptions.',
    descriptionAr:
      'مثال توضيحي افتراضي وليس نتيجة عميل. القيم بالريال السعودي ومن دون ضريبة القيمة المضافة.\n\nإيراد الطلب: 60.00\nتكلفة الطعام: 18.00\nعمولة المنصة: 15.00\nالتغليف: 3.00\nخصم يموله المطعم: 6.00\nتكاليف تنفيذ متغيرة أخرى: 1.50\nمساهمة الطلب: 16.50 (27.5% من الإيراد)\n\nتُستخدم المساهمة لتغطية التكاليف الثابتة؛ وهي ليست صافي الربح. تحقق من أساس احتساب العمولة ومن يتحمل العروض وفق عقد المنصة.\n\nالقرار: اختبر الباقات وتسعير القناة قبل زيادة الخصومات. قارن مساهمة الطلب والمساهمة الإجمالية عند حجم الطلبات المتوقع. التنزيل هو قائمة العمل المساندة؛ استخدم حاسبة التوصيل لاختبار افتراضاتك.',
  },
  {
    slug: 'sample-monthly-restaurant-review',
    source: 'restaurant-pl-template',
    titleEn: 'Monthly restaurant review: a worked example',
    titleAr: 'مراجعة شهرية للمطعم: مثال تطبيقي',
    summaryEn: 'A compact fictional month-end review that links sales, costs and action ownership.',
    summaryAr: 'مراجعة افتراضية مختصرة تربط المبيعات والتكاليف ومسؤولية تنفيذ القرارات.',
    descriptionEn:
      'Fictional management example. All amounts in SAR, excluding VAT.\n\nMonthly revenue: 300,000\nFood and beverage cost: 90,000\nLabour: 75,000\nOccupancy: 30,000\nOther operating costs: 60,000\nOperating result before depreciation, interest and tax: 45,000 (15%).\n\nFood cost is 30% and labour is 25% of revenue. These are example inputs, not recommended benchmarks.\n\nNext month: the chef reconciles recipe yield with actual purchases; the manager matches labour hours to demand; finance verifies cut-off and accruals. Record each action owner and review date. The download is a supporting financial working template.',
    descriptionAr:
      'مثال إداري افتراضي. جميع القيم بالريال السعودي ومن دون ضريبة القيمة المضافة.\n\nالإيراد الشهري: 300,000\nتكلفة الطعام والمشروبات: 90,000\nالعمالة: 75,000\nالإشغال: 30,000\nتكاليف تشغيل أخرى: 60,000\nالنتيجة التشغيلية قبل الإهلاك والفوائد والضرائب: 45,000 (15%).\n\nتكلفة الطعام 30% والعمالة 25% من الإيراد. هذه مدخلات توضيحية وليست معايير مستهدفة.\n\nالشهر التالي: يطابق الشيف مردود الوصفات بالمشتريات الفعلية، ويربط المدير ساعات العمل بالطلب، وتتحقق المالية من الاستحقاقات وإقفال الفترة. سجّل المسؤول وموعد مراجعة كل إجراء. التنزيل نموذج العمل المالي المساند.',
  },
  {
    slug: 'sample-menu-decision-review',
    source: 'menu-engineering-template',
    titleEn: 'Menu decision review: a worked example',
    titleAr: 'مراجعة قرارات القائمة: مثال تطبيقي',
    summaryEn:
      'Compare three fictional dishes by demand and contribution, then choose what to test.',
    summaryAr: 'قارن ثلاثة أصناف افتراضية وفق الطلب والمساهمة وحدد ما ينبغي اختباره.',
    descriptionEn:
      'Illustrative menu analysis. SAR per portion; prices exclude VAT. Contribution below deducts recipe ingredients only, before labour, waste and channel costs.\n\nGrilled chicken: price 48, recipe cost 15, contribution 33; 240 portions sold.\nMushroom pasta: price 42, recipe cost 13, contribution 29; 180 portions sold.\nRoasted vegetable bowl: price 38, recipe cost 11, contribution 27; 70 portions sold.\n\nTotal item contribution: 15,030 across 490 portions. Mix matters alongside contribution per portion. Do not remove the bowl solely because of low demand: test visibility, occasion fit and guest feedback first.\n\nDecision: verify recipe yield, compare placement and test one change at a time. The supporting download is a menu analysis working template.',
    descriptionAr:
      'تحليل توضيحي للقائمة. القيم بالريال لكل حصة والأسعار دون الضريبة. تخصم المساهمة أدناه تكلفة مكونات الوصفة فقط، قبل العمالة والهدر وتكاليف القنوات.\n\nدجاج مشوي: السعر 48، تكلفة الوصفة 15، المساهمة 33؛ بيع 240 حصة.\nباستا بالفطر: السعر 42، تكلفة الوصفة 13، المساهمة 29؛ بيع 180 حصة.\nطبق خضار مشوية: السعر 38، تكلفة الوصفة 11، المساهمة 27؛ بيع 70 حصة.\n\nمساهمة الأصناف الإجمالية: 15,030 من 490 حصة. مزيج المبيعات مهم إلى جانب مساهمة الحصة. لا تحذف طبق الخضار بسبب ضعف الطلب وحده؛ اختبر ظهوره وملاءمته لمناسبة الزيارة وملاحظات الضيوف أولًا.\n\nالقرار: تحقق من مردود الوصفة وقارن موضع الصنف واختبر تغييرًا واحدًا في كل مرة. التنزيل المساند نموذج عمل لتحليل القائمة.',
  },
];
try {
  for (const sample of samples) {
    const source = await db.resource.findFirst({
      where: { slug: sample.source, status: 'PUBLISHED', fileKey: { not: null } },
    });
    if (!source) {
      console.log('[samples] Supporting resource unavailable: ' + sample.source);
      continue;
    }
    const { source: _, ...content } = sample;
    const fileName = `${sample.slug}.pdf`;
    const sourcePath = path.resolve('resources/library/pdf', fileName);
    const fileKey = `library/brief-v1/${fileName}`;
    const target = path.resolve(process.env.STORAGE_DIR || './storage', 'private', fileKey);
    mkdirSync(path.dirname(target), { recursive: true });
    copyFileSync(sourcePath, target);
    const fileFields = { type: 'PDF', fileKey, fileName, fileMime: 'application/pdf', fileSize: statSync(sourcePath).size };
    content.descriptionEn = content.descriptionEn.replace(/The download is[^]*$/, 'Download the one-page worked example. Contact NORIVA to complete a review with your verified data.').replace(/The supporting download[^]*$/, 'Download the one-page worked example. Contact NORIVA to complete your menu review.');
    content.descriptionAr = content.descriptionAr.replace(/التنزيل[^]*$/, 'حمّل المثال التطبيقي المختصر. تواصل مع نوريفا لإكمال المراجعة ببيانات مشروعك الموثقة.');
    const existing = await db.resource.findUnique({ where: { slug: sample.slug } });
    const update = existing?.fileKey === fileKey ? fileFields : (!existing?.fileKey || existing.fileKey === source.fileKey ? { ...fileFields, ...content } : {});
    await db.resource.upsert({
      where: { slug: sample.slug },
      create: {
        ...content,
        ...fileFields,
        categoryId: source.categoryId,
        status: 'PUBLISHED',
        publishedAt: new Date(),
        order: 5,
        includes: [
          {
            labelEn: 'One-page worked decision example',
            labelAr: 'مثال تطبيقي مختصر في صفحة واحدة',
          },
        ],
        audience: [{ labelEn: 'Restaurant owners and managers', labelAr: 'ملاك المطاعم ومديروها' }],
        seoDescriptionEn: sample.summaryEn,
        seoDescriptionAr: sample.summaryAr,
      },
      update,
    });
  }
} finally {
  await db.$disconnect();
}
