'use client';

import clsx from 'clsx';
import { useId, useState } from 'react';
import { ChevronIcon } from './FooterIcons';

/**
 * One column of footer links.
 *
 * On a phone the heading is a disclosure button and the list starts collapsed,
 * so a deep service taxonomy cannot turn the footer into a page of its own. On
 * a tablet and up the list is always shown and the heading stops behaving like
 * a control: the panel is forced visible with `lg:!block`, the button is made
 * inert with `lg:pointer-events-none`, and the chevron is hidden.
 *
 * There is one copy of the markup, not a mobile tree and a desktop tree, so
 * the links are crawled and read out once, and the server-rendered output is
 * already correct at both sizes before any JavaScript arrives. Without
 * JavaScript a phone keeps the headings but cannot open them; nothing becomes
 * unreachable, because every service also sits on the services index, which
 * the Explore column links to.
 */
export function FooterColumn({
  title,
  expandLabel,
  collapseLabel,
  collapsible = true,
  children,
}: {
  title: string;
  expandLabel: string;
  collapseLabel: string;
  /** When false the column is never collapsed, at any width. */
  collapsible?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  const headingText = (
    <span className="font-bold uppercase tracking-[0.16em] text-white">{title}</span>
  );

  return (
    <div className="border-b border-white/10 py-4 first:border-t last:border-b-0 sm:border-none sm:py-0 sm:first:border-t-0 lg:py-0">
      {/* The heading and its rule share a block with a minimum height on wide
          screens, so a two-line heading in one column does not push its list
          out of line with the columns beside it. */}
      <div className="lg:flex lg:min-h-[3rem] lg:flex-col">
        <h2 className="text-[0.7rem] sm:text-[0.72rem]">
          {collapsible ? (
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls={panelId}
              aria-label={open ? collapseLabel : expandLabel}
              className="flex w-full items-center justify-between gap-3 text-start sm:pointer-events-none sm:cursor-default"
            >
              {headingText}
              <ChevronIcon
                className={clsx(
                  'h-4 w-4 shrink-0 text-white/45 transition-transform duration-200 sm:hidden',
                  open && '-rotate-180',
                )}
              />
            </button>
          ) : (
            headingText
          )}
        </h2>

        {/* The accent rule under the heading, as in the reference. */}
        <span aria-hidden className="mt-2 hidden h-[2px] w-7 bg-brand sm:block" />
      </div>

      <div
        id={panelId}
        className={clsx(
          'sm:!block',
          collapsible && !open ? 'hidden' : 'block',
          'pt-3.5 sm:pt-3',
        )}
      >
        {children}
      </div>
    </div>
  );
}
