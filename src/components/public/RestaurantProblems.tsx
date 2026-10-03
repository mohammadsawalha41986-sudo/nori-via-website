import Link from 'next/link';
import type { Locale } from '@/lib/i18n';
import { Reveal } from '../ui/Reveal';

const problems = [
  [
    'Sales are high. Profit is low.',
    'المبيعات مرتفعة، والربح منخفض.',
    'profitability-analysis',
    'finance',
  ],
  ['Food cost keeps climbing.', 'تكلفة الطعام ترتفع باستمرار.', 'food-cost-analysis', 'menu'],
  [
    'Delivery sells. Margin disappears.',
    'طلبات التوصيل تزيد، والهامش يتلاشى.',
    'delivery-menu-pricing',
    'delivery',
  ],
  [
    'A large menu. Too few profitable dishes.',
    'قائمة كبيرة وأصناف مربحة قليلة.',
    'menu-strategy-engineering-pricing',
    'menu',
  ],
  [
    'The team works harder. Service still slows.',
    'الفريق يبذل أكثر، والخدمة ما زالت تتأخر.',
    'operational-audit',
    'operations',
  ],
  [
    'Engagement grows. Orders do not.',
    'التفاعل يزيد، والطلبات لا تزيد.',
    'fnb-marketing',
    'marketing',
  ],
  [
    'Ready for another branch. Is the model?',
    'جاهز لفرع جديد. هل نموذجك جاهز؟',
    'expansion-study',
    'growth',
  ],
] as const;

export function RestaurantProblems({ locale, published }: { locale: Locale; published: string[] }) {
  const ar = locale === 'ar';
  return (
    <section className="bg-bone section-y">
      <div className="shell">
        <p className="editorial-kicker">{ar ? 'ابدأ بالتحدي' : 'START WITH THE CHALLENGE'}</p>
        <h2 className="mt-4 max-w-3xl font-display text-display-sm text-ink-900">
          {ar ? 'ما الذي يعيق نمو مطعمك؟' : 'What is holding your restaurant back?'}
        </h2>
        <div className="mt-10 grid gap-x-12 md:grid-cols-2">
          {problems.map(([en, arabic, slug], i) => (
            <Reveal key={slug + i}>
              <Link
                href={
                  published.includes(slug) ? `/${locale}/services/${slug}` : `/${locale}/services`
                }
                className="problem-link"
              >
                <span className="font-mono text-xs text-brand">0{i + 1}</span>
                <h3 className="flex-1 font-display text-lg sm:text-xl">{ar ? arabic : en}</h3>
                <span aria-hidden>↗</span>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
