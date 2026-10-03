import type { Locale } from '@/lib/i18n';
import { practiceFor, practiceLabel } from '@/lib/service-discovery';
export function serviceAction(slug: string, locale: Locale) {
  return practiceLabel(practiceFor(slug), locale, true);
}
const evidence: Record<string, [string, string][]> = {
  delivery: [
    ['Platform commission and contract terms', 'عمولة المنصة وشروط الاتفاقية'],
    ['VAT treatment and recoverable tax', 'معالجة الضريبة وإمكانية استردادها'],
    ['Restaurant-funded discounts', 'الخصومات التي يتحملها المطعم'],
    ['Packaging, food cost and payment fees', 'التغليف وتكلفة الطعام ورسوم الدفع'],
    ['Contribution by item and delivery channel', 'المساهمة لكل صنف وقناة توصيل'],
  ],
  menu: [
    ['POS sales by item and daypart', 'مبيعات كل صنف وفترة من نظام نقاط البيع'],
    ['Recipe yield, portion and current purchase price', 'مردود الوصفة والحصة وسعر الشراء الحالي'],
    ['Popularity and contribution margin', 'الإقبال وهامش المساهمة'],
    ['Kitchen capacity and menu complexity', 'طاقة المطبخ وتعقيد القائمة'],
  ],
  operations: [
    ['Actual service flow at peak', 'تدفق الخدمة الفعلي وقت الذروة'],
    ['Staff schedules and station capacity', 'جداول الفريق وطاقة محطات العمل'],
    ['Receiving, stock counts and waste records', 'الاستلام وجرد المخزون وسجلات الهدر'],
    ['Quality standards and handover points', 'معايير الجودة ونقاط تسليم العمل'],
  ],
  finance: [
    ['Branch and channel P&L', 'أرباح وخسائر الفروع والقنوات'],
    ['Prime cost and fixed overheads', 'التكلفة الأولية والمصاريف الثابتة'],
    ['Cash flow and working capital', 'التدفق النقدي ورأس المال العامل'],
    ['Break-even assumptions and sensitivity', 'افتراضات نقطة التعادل وحساسيتها'],
  ],
  launch: [
    ['Target guests and occasions', 'الضيوف المستهدفون ومناسبات الزيارة'],
    ['Site, catchment and competitors', 'الموقع ونطاقه والمنافسون'],
    ['Menu, service model and opening capacity', 'القائمة ونموذج الخدمة وطاقة الافتتاح'],
    ['Capital, budget and pre-opening sequence', 'رأس المال والموازنة وتسلسل ما قبل الافتتاح'],
  ],
  brand: [
    ['Positioning and relevant competitors', 'التموضع والمنافسون المباشرون'],
    ['Arabic and English brand expression', 'التعبير عن العلامة بالعربية والإنجليزية'],
    ['Menu, packaging, signage and touchpoints', 'القائمة والتغليف واللوحات ونقاط التفاعل'],
    ['Guest journey and consistency', 'رحلة الضيف واتساق التجربة'],
  ],
  marketing: [
    ['Commercial objective and available capacity', 'الهدف التجاري والطاقة المتاحة'],
    ['Audience, offer and content production', 'الجمهور والعرض وإنتاج المحتوى'],
    ['Orders and visits attributable to campaigns', 'الطلبات والزيارات المنسوبة للحملات'],
    ['Acquisition cost and repeat visits', 'تكلفة اكتساب العميل وتكرار الزيارة'],
  ],
  growth: [
    ['Repeatable branch economics', 'اقتصاديات فرع قابلة للتكرار'],
    ['Demand, location and payback assumptions', 'الطلب والموقع وافتراضات استرداد الاستثمار'],
    ['Management depth and transferable standards', 'جاهزية الإدارة والمعايير القابلة للنقل'],
    ['Risks, capacity and investment sequence', 'المخاطر والطاقة وتسلسل الاستثمار'],
  ],
  strategy: [
    ['Concept, guests and market position', 'المفهوم والضيوف والموقع في السوق'],
    ['Menu, operating controls and financial performance', 'القائمة وضوابط التشغيل والأداء المالي'],
    ['Evidence behind the main business constraint', 'الأدلة وراء التحدي الرئيسي للمشروع'],
    ['Priorities, owners and implementation sequence', 'الأولويات والمسؤوليات وتسلسل التنفيذ'],
  ],
};
export function ServiceAnalysis({ slug, locale }: { slug: string; locale: Locale }) {
  const ar = locale === 'ar';
  return (
    <section className="bg-white py-16">
      <div className="shell grid gap-8 lg:grid-cols-[18rem_minmax(0,1fr)]">
        <h2 className="font-display text-2xl text-ink-900">
          {ar ? 'ما الذي نحلله؟' : 'What we analyze'}
        </h2>
        <ul className="grid gap-x-8 sm:grid-cols-2">
          {(evidence[practiceFor(slug).id] ?? evidence.strategy).map(([en, arabic]) => (
            <li key={en} className="border-b border-ink-900/15 py-5 text-sm leading-relaxed">
              {ar ? arabic : en}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
