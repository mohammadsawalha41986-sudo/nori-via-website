import Link from 'next/link';
import type { Locale } from '@/lib/i18n';

/** Explicit fictional example. Values reconcile; this is not a client result. */
export function BusinessEvidence({ locale }: { locale: Locale }) {
  const ar = locale === 'ar';
  const rows = [
    [ar ? 'بيع الطلب، دون ضريبة' : 'Order revenue, excluding VAT', 60],
    [ar ? 'تكلفة الطعام' : 'Food cost', -18],
    [ar ? 'عمولة المنصة' : 'Platform commission', -15],
    [ar ? 'التغليف' : 'Packaging', -3],
    [ar ? 'خصم يتحمله المطعم' : 'Restaurant-funded discount', -6],
    [ar ? 'رسوم الدفع' : 'Payment fee', -1.5],
  ] as const;
  const contribution = rows.reduce((total, [, value]) => total + value, 0);
  return (
    <section className="bg-ink-900 text-white section-y">
      <div className="shell grid items-center gap-12 lg:grid-cols-2">
        <div>
          <p className="editorial-kicker">
            {ar ? 'من البيانات إلى القرار' : 'FROM DATA TO DECISIONS'}
          </p>
          <h2 className="mt-5 font-display text-display-sm">
            {ar ? 'الطلب يصل. هل يصل معه الربح؟' : 'The order arrives. Does the profit?'}
          </h2>
          <p className="mt-6 max-w-lg text-white/70">
            {ar
              ? 'نفصل إيراد القناة عن تكلفتها. ثم نختبر السعر والحصة والتغليف والعرض، قبل أن نزيد الإنفاق على اكتساب طلبات جديدة.'
              : 'Separate channel revenue from its cost. Then test price, portions, packaging and offers before spending more to acquire orders.'}
          </p>
          <Link
            href={`/${locale}/tools`}
            className="mt-8 inline-block font-semibold text-brand-300"
          >
            {ar ? 'اختبر أرقام مطعمك بالأدوات' : 'Test your restaurant numbers'} →
          </Link>
        </div>
        <figure className="evidence-panel">
          <figcaption className="mb-8 flex flex-wrap justify-between gap-3">
            <span>{ar ? 'اقتصاديات طلب توصيل' : 'Delivery order economics'}</span>
            <span className="text-xs text-white/60">
              {ar ? 'مثال افتراضي · ريال' : 'Fictional example · SAR'}
            </span>
          </figcaption>
          <dl className="space-y-4">
            {rows.map(([label, value]) => (
              <div key={label} className="grid grid-cols-[minmax(0,1fr)_4rem] gap-4">
                <dt className="text-sm text-white/75">
                  {label}
                  <span aria-hidden className="mt-2 block h-1 bg-white/10">
                    <span
                      className={`block h-1 ${value > 0 ? 'bg-white' : 'bg-brand-300'}`}
                      style={{ width: `${(Math.abs(value) / 60) * 100}%` }}
                    />
                  </span>
                </dt>
                <dd className="text-end font-mono text-sm" dir="ltr">
                  {value > 0 ? '+' : '−'}
                  {Math.abs(value).toFixed(2)}
                </dd>
              </div>
            ))}
          </dl>
          <div className="mt-7 flex justify-between border-t border-white/20 pt-5">
            <span>{ar ? 'المساهمة قبل التكاليف الثابتة' : 'Contribution before fixed costs'}</span>
            <strong dir="ltr">{contribution.toFixed(2)}</strong>
          </div>
          <p className="mt-5 text-xs leading-relaxed text-white/55">
            {ar
              ? 'جميع الأرقام دون الضريبة. المثال لا يشمل الأجور والإيجار والمصاريف الثابتة، وليس صافي ربح أو نتيجة عميل. معالجة الضريبة تعتمد على الاتفاقية وإمكانية استردادها.'
              : 'All amounts exclude tax. Labor, rent and fixed overheads are excluded. This is neither net profit nor a client result. Tax treatment depends on the agreement and recoverability.'}
          </p>
        </figure>
      </div>
    </section>
  );
}
