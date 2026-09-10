'use client';

import Image from 'next/image';
import { useState } from 'react';
import clsx from 'clsx';
import { Reveal } from '../ui/Reveal';

export type Stage = {
  id: string;
  step: string;
  title: string;
  description: string;
  services: string[];
  mediaUrl: string | null;
};

/**
 * The Noriva System. On desktop the stages behave as an accordion with a
 * changing visual; on small screens they stack as an ordered list so the
 * sequence stays readable without interaction.
 */
export function SystemStages({ headline, stages }: { headline: string; stages: Stage[] }) {
  const [active, setActive] = useState(0);
  if (!stages.length) return null;

  const current = stages[Math.min(active, stages.length - 1)]!;

  return (
    <section className="relative overflow-hidden bg-ink-900 py-24 text-white sm:py-32">
      <div aria-hidden className="grain absolute inset-0" />
      <div className="shell relative">
        {headline && (
          <Reveal>
            <h2 className="max-w-3xl font-display text-display-sm uppercase">
              {headline}
              <span className="text-brand">.</span>
            </h2>
          </Reveal>
        )}

        <div className="mt-14 grid gap-12 lg:mt-20 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
          <ol className="border-t border-white/12">
            {stages.map((stage, i) => {
              const open = i === active;
              return (
                <li key={stage.id} className="border-b border-white/12">
                  <h3>
                    <button
                      type="button"
                      onClick={() => setActive(i)}
                      onMouseEnter={() => setActive(i)}
                      aria-expanded={open}
                      className="group flex w-full items-start gap-5 py-7 text-start sm:gap-8"
                    >
                      <span
                        className={clsx(
                          'mt-1.5 shrink-0 font-mono text-xs font-bold tracking-widest transition-colors duration-300',
                          open ? 'text-brand' : 'text-white/30',
                        )}
                      >
                        {stage.step}
                      </span>

                      <span className="flex-1">
                        <span
                          className={clsx(
                            'block font-display text-2xl uppercase leading-tight transition-colors duration-300 sm:text-[2rem]',
                            open ? 'text-white' : 'text-white/40 group-hover:text-white/75',
                          )}
                        >
                          {stage.title}
                        </span>

                        <span
                          className="grid transition-[grid-template-rows,opacity] duration-500 ease-noriva"
                          style={{ gridTemplateRows: open ? '1fr' : '0fr', opacity: open ? 1 : 0 }}
                        >
                          <span className="overflow-hidden">
                            {stage.description && (
                              <span className="mt-4 block max-w-lg text-sm leading-relaxed text-white/60">
                                {stage.description}
                              </span>
                            )}
                            {stage.services.length > 0 && (
                              <span className="mt-5 flex flex-wrap gap-2">
                                {stage.services.map((s) => (
                                  <span
                                    key={s}
                                    className="rounded-full border border-white/20 px-3.5 py-1.5 text-xs font-medium text-white/70"
                                  >
                                    {s}
                                  </span>
                                ))}
                              </span>
                            )}
                          </span>
                        </span>
                      </span>
                    </button>
                  </h3>
                </li>
              );
            })}
          </ol>

          <div className="relative hidden aspect-[4/5] overflow-hidden rounded-2xl lg:block">
            {stages.map((stage, i) => (
              <div
                key={stage.id}
                aria-hidden={i !== active}
                className="absolute inset-0 transition-opacity duration-700 ease-noriva"
                style={{ opacity: i === active ? 1 : 0 }}
              >
                {stage.mediaUrl ? (
                  <Image src={stage.mediaUrl} alt="" fill sizes="(min-width:1024px) 40vw, 100vw" className="object-cover" />
                ) : (
                  <div
                    className="h-full w-full"
                    style={{
                      background: `linear-gradient(${150 + i * 40}deg, rgba(245,16,110,${0.85 - i * 0.16}) 0%, #16213C 62%, #0B1225 100%)`,
                    }}
                  />
                )}
              </div>
            ))}

            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink-950/85 to-transparent p-8">
              <p className="font-mono text-xs font-bold tracking-widest text-brand-300">{current.step}</p>
              <p className="mt-2 font-display text-xl uppercase">{current.title}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
