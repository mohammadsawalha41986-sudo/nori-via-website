/**
 * Downloadable resources shipped with the repository.
 *
 * These records are deliberately separate from the editorial catalogue. The
 * provisioning pass only publishes an entry after its matching file has been
 * copied into private storage, so a public resource can never lead to a dead
 * download.
 */

const xlsx = (file, slug, titleEn, titleAr, category) => ({
  file,
  slug,
  titleEn,
  titleAr,
  category,
  type: 'EXCEL',
  mime: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  summaryEn: `An editable restaurant workbook for ${titleEn.toLowerCase()}, with structured inputs, working calculations and an action-ready summary.`,
  summaryAr: `مصنف مطاعم قابل للتعديل من أجل ${titleAr}، ويضم مدخلات منظمة وحسابات عملية وملخصاً جاهزاً لاتخاذ القرار.`,
});

const docx = (file, slug, titleEn, titleAr, category) => ({
  file,
  slug,
  titleEn,
  titleAr,
  category,
  type: 'WORD',
  mime: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  summaryEn: `A bilingual, editable ${titleEn.toLowerCase()} with evidence prompts, decision fields and an owned action plan.`,
  summaryAr: `${titleAr} ثنائي اللغة وقابل للتعديل، مع حقول للأدلة والقرارات وخطة عمل محددة المسؤوليات.`,
});

const pdf = (file, slug, titleEn, titleAr, category) => ({
  file,
  slug,
  titleEn,
  titleAr,
  category,
  type: 'PDF',
  mime: 'application/pdf',
  summaryEn: `A bilingual working guide to ${titleEn.toLowerCase()}, designed to turn review points into documented actions.`,
  summaryAr: `دليل عمل ثنائي اللغة حول ${titleAr}، مصمم لتحويل نقاط المراجعة إلى إجراءات موثقة.`,
});

export const LIBRARY_ASSETS = [
  xlsx('noriva-restaurant-feasibility-study-template.xlsx', 'restaurant-feasibility-study-template', 'Noriva Restaurant Feasibility Study', 'دراسة جدوى المطاعم من نوريفا', 'strategy-development'),
  xlsx('restaurant-startup-budget.xlsx', 'restaurant-startup-budget', 'Restaurant Startup Budget', 'ميزانية تأسيس مطعم', 'finance'),
  xlsx('capex-budget.xlsx', 'capex-budget', 'CAPEX Budget', 'ميزانية النفقات الرأسمالية', 'finance'),
  xlsx('pre-opening-budget.xlsx', 'pre-opening-budget', 'Pre-opening Budget', 'ميزانية ما قبل الافتتاح', 'finance'),
  xlsx('monthly-pl.xlsx', 'restaurant-pl-template', 'Monthly Restaurant P&L', 'قائمة أرباح وخسائر شهرية للمطعم', 'finance'),
  xlsx('break-even-analysis.xlsx', 'break-even-model', 'Break-even Analysis', 'تحليل نقطة التعادل', 'finance'),
  xlsx('restaurant-sales-forecast.xlsx', 'restaurant-sales-forecast', 'Restaurant Sales Forecast', 'توقع مبيعات المطعم', 'finance'),
  xlsx('revenue-forecast-by-channel.xlsx', 'revenue-forecast-by-channel', 'Revenue Forecast by Channel', 'توقع الإيرادات حسب القناة', 'finance'),
  xlsx('food-cost-calculator.xlsx', 'food-cost-calculator', 'Food Cost Calculator', 'حاسبة تكلفة الطعام', 'menu'),
  xlsx('recipe-costing.xlsx', 'recipe-costing', 'Recipe Costing', 'تكلفة الوصفات', 'menu'),
  xlsx('menu-engineering.xlsx', 'menu-engineering-template', 'Menu Engineering', 'هندسة القائمة', 'menu'),
  xlsx('menu-pricing-calculator.xlsx', 'menu-pricing-worksheet', 'Menu Pricing Calculator', 'حاسبة تسعير القائمة', 'menu'),
  xlsx('inventory-count.xlsx', 'inventory-count', 'Inventory Count', 'جرد المخزون', 'operations'),
  xlsx('stock-movement.xlsx', 'stock-movement', 'Stock Movement', 'حركة المخزون', 'operations'),
  xlsx('purchasing-tracker.xlsx', 'purchasing-tracker', 'Purchasing Tracker', 'متتبع المشتريات', 'operations'),
  xlsx('supplier-comparison.xlsx', 'supplier-evaluation-template', 'Supplier Comparison', 'مقارنة الموردين', 'operations'),
  xlsx('waste-log.xlsx', 'waste-log', 'Waste Log', 'سجل الهدر', 'operations'),
  xlsx('theoretical-vs-actual-food-cost.xlsx', 'theoretical-vs-actual-food-cost', 'Theoretical vs Actual Food Cost', 'تكلفة الطعام النظرية مقابل الفعلية', 'operations'),
  xlsx('labor-cost-tracker.xlsx', 'labour-cost-tracker', 'Labor Cost Tracker', 'متتبع تكلفة العمالة', 'operations'),
  xlsx('staffing-plan.xlsx', 'staffing-plan', 'Staffing Plan', 'خطة التوظيف', 'operations'),
  xlsx('restaurant-kpi-dashboard.xlsx', 'restaurant-kpi-dashboard', 'Restaurant KPI Dashboard', 'لوحة مؤشرات أداء المطعم', 'finance'),
  xlsx('branch-performance-comparison.xlsx', 'branch-performance-comparison', 'Branch Performance Comparison', 'مقارنة أداء الفروع', 'growth-expansion'),
  xlsx('delivery-platform-performance.xlsx', 'delivery-platform-performance', 'Delivery Platform Performance', 'أداء منصات التوصيل', 'finance'),
  xlsx('marketing-budget.xlsx', 'marketing-budget', 'Marketing Budget', 'ميزانية التسويق', 'marketing'),
  xlsx('marketing-campaign-tracker.xlsx', 'marketing-campaign-planner', 'Marketing Campaign Tracker', 'متتبع الحملات التسويقية', 'marketing'),
  xlsx('restaurant-opening-checklist.xlsx', 'restaurant-opening-workbook', 'Restaurant Opening Checklist Workbook', 'مصنف قائمة تحقق افتتاح مطعم', 'strategy-development'),
  xlsx('site-evaluation-scorecard.xlsx', 'site-evaluation-scorecard', 'Site Evaluation Scorecard', 'بطاقة تقييم الموقع', 'strategy-development'),
  xlsx('competitor-analysis.xlsx', 'competitor-analysis-template', 'Competitor Analysis', 'تحليل المنافسين', 'strategy-development'),
  xlsx('swot-analysis.xlsx', 'swot-analysis', 'SWOT Analysis', 'تحليل نقاط القوة والضعف والفرص والتهديدات', 'strategy-development'),
  xlsx('customer-feedback-analysis.xlsx', 'customer-feedback-analysis', 'Customer Feedback Analysis', 'تحليل ملاحظات العملاء', 'brand-experience'),
  xlsx('restaurant-audit-scorecard.xlsx', 'restaurant-audit-scorecard', 'Restaurant Audit Scorecard', 'بطاقة تدقيق المطعم', 'operations'),
  xlsx('mystery-shopper-scorecard.xlsx', 'mystery-shopper-scorecard', 'Mystery Shopper Scorecard', 'بطاقة تقييم المتسوق الخفي', 'brand-experience'),
  xlsx('expansion-feasibility.xlsx', 'expansion-feasibility', 'Expansion Feasibility', 'جدوى التوسع', 'growth-expansion'),
  xlsx('franchise-readiness-scorecard.xlsx', 'franchise-readiness-scorecard', 'Franchise Readiness Scorecard', 'بطاقة الجاهزية للامتياز التجاري', 'growth-expansion'),
  xlsx('90-day-turnaround-plan.xlsx', '90-day-turnaround-plan', '90-day Turnaround Plan', 'خطة تحول لمدة 90 يوماً', 'growth-expansion'),

  docx('restaurant-feasibility-study-report.docx', 'restaurant-feasibility-study-report', 'Restaurant Feasibility Study Report', 'تقرير دراسة جدوى مطعم', 'strategy-development'),
  docx('restaurant-business-plan.docx', 'restaurant-business-plan-template', 'Restaurant Business Plan', 'خطة عمل مطعم', 'strategy-development'),
  docx('restaurant-audit-report.docx', 'restaurant-audit-report', 'Restaurant Audit Report', 'تقرير تدقيق مطعم', 'operations'),
  docx('restaurant-development-plan.docx', 'restaurant-development-plan', 'Restaurant Development Plan', 'خطة تطوير مطعم', 'growth-expansion'),
  docx('restaurant-opening-plan.docx', 'restaurant-opening-plan', 'Restaurant Opening Plan', 'خطة افتتاح مطعم', 'strategy-development'),
  docx('restaurant-operations-manual.docx', 'restaurant-operations-manual', 'Restaurant Operations Manual', 'دليل تشغيل مطعم', 'operations'),
  docx('restaurant-sop-template.docx', 'restaurant-sop-template', 'Restaurant SOP Template', 'قالب إجراء تشغيلي قياسي للمطعم', 'operations'),
  docx('restaurant-marketing-plan.docx', 'marketing-plan-template', 'Restaurant Marketing Plan', 'خطة تسويق مطعم', 'marketing'),
  docx('restaurant-brand-brief.docx', 'restaurant-brand-brief', 'Restaurant Brand Brief', 'موجز علامة مطعم', 'brand-experience'),
  docx('menu-development-brief.docx', 'menu-development-brief', 'Menu Development Brief', 'موجز تطوير قائمة', 'menu'),
  docx('site-visit-report.docx', 'site-visit-report', 'Restaurant Site Visit Report', 'تقرير زيارة موقع مطعم', 'strategy-development'),
  docx('mystery-shopping-report.docx', 'mystery-shopping-report', 'Mystery Shopping Report', 'تقرير المتسوق الخفي', 'brand-experience'),
  docx('restaurant-turnaround-report.docx', 'restaurant-turnaround-report', 'Restaurant Turnaround Report', 'تقرير تحول المطعم', 'growth-expansion'),
  docx('monthly-management-report.docx', 'monthly-management-report', 'Restaurant Monthly Management Report', 'تقرير الإدارة الشهري للمطعم', 'finance'),
  docx('branch-performance-review.docx', 'branch-performance-review', 'Branch Performance Review', 'مراجعة أداء الفروع', 'growth-expansion'),

  pdf('restaurant-feasibility-study-checklist.pdf', 'restaurant-feasibility-study-checklist', 'Restaurant Feasibility Study Checklist', 'قائمة تحقق دراسة جدوى مطعم', 'strategy-development'),
  pdf('30-questions-before-opening.pdf', '30-questions-before-opening', '30 Questions Before Opening a Restaurant', '30 سؤالاً قبل افتتاح مطعم', 'strategy-development'),
  pdf('restaurant-profitability-checklist.pdf', 'restaurant-profitability-checklist', 'Restaurant Profitability Checklist', 'قائمة تحقق ربحية المطعم', 'finance'),
  pdf('food-cost-control-guide.pdf', 'food-cost-control-guide', 'Food Cost Control Guide', 'دليل ضبط تكلفة الطعام', 'operations'),
  pdf('menu-engineering-quick-guide.pdf', 'menu-engineering-guide', 'Menu Engineering Quick Guide', 'دليل سريع لهندسة القائمة', 'menu'),
  pdf('restaurant-opening-checklist-guide.pdf', 'opening-checklist', 'Restaurant Opening Checklist', 'قائمة تحقق افتتاح مطعم', 'strategy-development'),
  pdf('restaurant-kpi-guide.pdf', 'restaurant-kpi-guide', 'Restaurant KPI Guide', 'دليل مؤشرات أداء المطاعم', 'finance'),
  pdf('restaurant-audit-checklist-guide.pdf', 'restaurant-audit-checklist', 'Restaurant Audit Checklist', 'قائمة تدقيق مطعم', 'operations'),
  pdf('delivery-profitability-checklist.pdf', 'delivery-profitability-checklist', 'Delivery Profitability Checklist', 'قائمة تحقق ربحية التوصيل', 'finance'),
  pdf('restaurant-marketing-planning-guide.pdf', 'restaurant-marketing-planning-guide', 'Restaurant Marketing Planning Guide', 'دليل تخطيط تسويق المطاعم', 'marketing'),
].map((asset, order) => ({
  ...asset,
  order: order + 1,
  sourcePath: `resources/library/${asset.type === 'EXCEL' ? 'xlsx' : asset.type === 'WORD' ? 'docx' : 'pdf'}/${asset.file}`,
  storageKey: `library/${asset.file}`,
  descriptionEn: `${asset.summaryEn} Use verified project inputs, retain the assumptions register and document the owner and review date for every material decision.`,
  descriptionAr: `${asset.summaryAr} استخدم مدخلات موثقة للمشروع، واحتفظ بسجل الافتراضات، وحدد المسؤول وتاريخ المراجعة لكل قرار جوهري.`,
  includes: asset.type === 'EXCEL'
    ? [
        ['Editable input sheets', 'أوراق مدخلات قابلة للتعديل'],
        ['Working formulas and checks', 'معادلات وفحوصات عملية'],
        ['Summary and action fields', 'حقول للملخص والإجراءات'],
      ]
    : asset.type === 'WORD'
      ? [
          ['Bilingual section prompts', 'إرشادات أقسام باللغتين'],
          ['Evidence and decision tables', 'جداول للأدلة والقرارات'],
          ['Owned action plan', 'خطة عمل محددة المسؤوليات'],
        ]
      : [
          ['Bilingual review points', 'نقاط مراجعة باللغتين'],
          ['Evidence and status fields', 'حقول للأدلة والحالة'],
          ['Action planning table', 'جدول لتخطيط الإجراءات'],
        ],
  audience: [
    ['Restaurant owners and operators', 'ملاك المطاعم والمشغلون'],
    ['Managers preparing a documented decision', 'المديرون الذين يعدون قراراً موثقاً'],
  ],
  tags: [asset.category, asset.type.toLowerCase(), 'restaurant', 'noriva'],
}));
