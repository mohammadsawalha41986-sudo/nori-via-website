import Link from 'next/link';
import Image from 'next/image';
import { Reveal } from '../ui/Reveal';
import { SectionHeading } from '../ui/SectionHeading';
import type { RelatedItem } from '@/lib/relations';

/**
 * Renders the article ↔ tool ↔ resource ↔ solution ↔ case-study graph. The
 * items come from ContentLink, so an editor changes what appears here without
 * a deployment.
 */
export function RelatedContent({
  items,
  title,
  eyebrow,
  tone = 'bone',
}: {
  items: RelatedItem[];
  title: string;
  eyebrow?: string;
  tone?: 'bone' | 'white';
}) {
  if (items.length === 0) return null;

  return (
    <section className={tone === 'white' ? 'bg-white section-y' : 'bg-bone section-y'}>
      <div className="shell">
        <SectionHeading eyebrow={eyebrow} title={title} />

        <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, i) => (
            <Reveal as="li" key={`${item.type}-${item.id}`} delay={Math.min(i, 6) * 55} y={14}>
              <Link
                href={item.href}
                className="group flex h-full flex-col overflow-hidden rounded-card border border-ink-900/10 bg-white transition-colors duration-300 hover:border-brand"
              >
                {item.image && (
                  <span className="relative block aspect-[16/9] overflow-hidden bg-ink-100">
                    <Image
                      src={item.image}
                      alt=""
                      fill
                      sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
                      className="object-cover transition-transform duration-700 ease-noriva group-hover:scale-105"
                    />
                  </span>
                )}
                <span className="flex flex-1 flex-col p-6">
                  <span className="text-xs font-bold uppercase tracking-[0.2em] text-brand">{item.badge}</span>
                  <span className="mt-2.5 font-display text-lg font-display-soft uppercase text-ink-900 transition-colors group-hover:text-brand">
                    {item.title}
                  </span>
                  {item.summary && (
                    <span className="mt-2.5 line-clamp-3 text-sm leading-relaxed text-ink-400">{item.summary}</span>
                  )}
                </span>
              </Link>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
