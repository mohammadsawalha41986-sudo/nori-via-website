import Image from 'next/image';
import Link from 'next/link';
import clsx from 'clsx';
import type { Locale } from '@/lib/i18n';

export type ProjectCardData = {
  id: string;
  slug: string;
  title: string;
  client: string;
  category: string;
  services: string[];
  year: number | null;
  heroMediaUrl: string | null;
  caseStudySlug: string | null;
};

/**
 * Editorial project tile. Sizes alternate through the grid so the page reads
 * as a composed layout rather than a uniform card grid.
 */
export function ProjectCard({
  project,
  locale,
  index = 0,
  viewLabel,
}: {
  project: ProjectCardData;
  locale: Locale;
  index?: number;
  viewLabel: string;
}) {
  const wide = index % 5 === 0 || index % 5 === 3;
  const href = `/${locale}/work/${project.slug}`;

  return (
    <article
      className={clsx(
        'group animate-fade-up',
        wide ? 'lg:col-span-7' : 'lg:col-span-5',
        index % 5 === 3 && 'lg:mt-[-4rem]',
      )}
      style={{ animationDelay: `${Math.min(index, 6) * 70}ms` }}
    >
      <Link href={href} className="block">
        <div
          className={clsx(
            'relative overflow-hidden rounded-xl bg-ink-100',
            wide ? 'aspect-[16/10]' : 'aspect-[4/5]',
          )}
        >
          {project.heroMediaUrl ? (
            <Image
              src={project.heroMediaUrl}
              alt={project.title}
              fill
              sizes="(min-width:1024px) 55vw, 100vw"
              className="object-cover transition-transform duration-[900ms] ease-noriva group-hover:scale-[1.045]"
            />
          ) : (
            <div
              className="flex h-full w-full items-end p-8"
              style={{ background: `linear-gradient(${135 + index * 35}deg,#16213C 0%,#0B1225 55%,rgba(245,16,110,0.5) 130%)` }}
            >
              <span className="font-display text-3xl font-extrabold uppercase leading-none text-white/25">
                {project.title}
              </span>
            </div>
          )}

          <div className="absolute inset-0 bg-ink-950/0 transition-colors duration-500 group-hover:bg-ink-950/25" />

          <span className="pointer-events-none absolute bottom-5 end-5 translate-y-3 rounded-full bg-white px-5 py-2.5 text-xs font-bold text-ink-900 opacity-0 transition-all duration-500 ease-noriva group-hover:translate-y-0 group-hover:opacity-100">
            {viewLabel}
          </span>
        </div>

        <div className="mt-5 flex items-start justify-between gap-6">
          <div>
            <h3 className="font-display text-xl font-bold uppercase tracking-tight text-ink-900 sm:text-2xl">
              {project.title}
            </h3>
            {(project.client || project.category) && (
              <p className="mt-1.5 text-sm text-ink-400">
                {[project.client, project.category].filter(Boolean).join(' · ')}
              </p>
            )}
          </div>
          {project.year && <span className="shrink-0 pt-1 font-mono text-xs text-ink-300">{project.year}</span>}
        </div>

        {project.services.length > 0 && (
          <ul className="mt-3 flex flex-wrap gap-1.5">
            {project.services.slice(0, 4).map((s) => (
              <li key={s} className="rounded-full bg-ink-900/[0.06] px-3 py-1 text-[0.6875rem] font-medium text-ink-500">
                {s}
              </li>
            ))}
          </ul>
        )}
      </Link>
    </article>
  );
}
