import { Reveal } from '../ui/Reveal';

export type Metric = { value: string; label: string; description?: string };

/** Only ever rendered from verified values entered in Admin. */
export function Metrics({ items, tone = 'dark' }: { items: Metric[]; tone?: 'dark' | 'light' }) {
  if (!items.length) return null;

  return (
    <dl className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((m, i) => (
        <Reveal key={`${m.label}-${i}`} delay={i * 70}>
          <dt className={tone === 'light' ? 'sr-only' : 'sr-only'}>{m.label}</dt>
          <dd>
            <span
              className={`block font-display text-[clamp(2.4rem,5vw,3.6rem)] font-extrabold leading-none tracking-tight ${
                tone === 'light' ? 'text-white' : 'text-ink-900'
              }`}
            >
              {m.value}
            </span>
            <span
              className={`mt-3 block text-sm font-semibold uppercase tracking-wide ${
                tone === 'light' ? 'text-white/70' : 'text-ink-600'
              }`}
            >
              {m.label}
            </span>
            {m.description && (
              <span className={`mt-1.5 block text-sm ${tone === 'light' ? 'text-white/45' : 'text-ink-400'}`}>
                {m.description}
              </span>
            )}
          </dd>
        </Reveal>
      ))}
    </dl>
  );
}
