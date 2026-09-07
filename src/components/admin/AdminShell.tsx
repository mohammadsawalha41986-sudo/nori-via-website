'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import clsx from 'clsx';
import { logoutAction } from '@/app/admin/actions';

export const NAV_GROUPS = [
  {
    label: 'Overview',
    items: [
      { href: '/admin', label: 'Dashboard', exact: true },
      { href: '/admin/preview', label: 'Preview site' },
      { href: '/admin/inquiries', label: 'Inquiries' },
      { href: '/admin/messages', label: 'Contact messages' },
    ],
  },
  {
    label: 'Content',
    items: [
      { href: '/admin/homepage', label: 'Homepage' },
      { href: '/admin/system', label: 'Noriva System' },
      { href: '/admin/services', label: 'Solutions' },
      { href: '/admin/work', label: 'Portfolio' },
      { href: '/admin/case-studies', label: 'Case studies' },
      { href: '/admin/insights', label: 'Insights' },
      { href: '/admin/pages', label: 'Pages' },
    ],
  },
  {
    label: 'Knowledge platform',
    items: [
      { href: '/admin/resources', label: 'Library resources' },
      { href: '/admin/tools', label: 'Tools' },
      { href: '/admin/taxonomies', label: 'Categories' },
    ],
  },
  {
    label: 'Assets',
    items: [
      { href: '/admin/media', label: 'Media' },
      { href: '/admin/statistics', label: 'Statistics' },
      { href: '/admin/testimonials', label: 'Testimonials' },
    ],
  },
  {
    label: 'Configuration',
    items: [
      { href: '/admin/design', label: 'Design system' },
      { href: '/admin/settings', label: 'Site settings' },
      { href: '/admin/navigation', label: 'Navigation' },
      { href: '/admin/social', label: 'Social & contact' },
      { href: '/admin/seo', label: 'SEO' },
      { href: '/admin/account', label: 'Your account' },
    ],
  },
] as const;

export function AdminShell({
  user,
  children,
}: {
  user: { name: string; email: string; role: string };
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState('');

  const term = filter.trim().toLowerCase();
  const groups = term
    ? NAV_GROUPS.map((group) => ({
        ...group,
        items: group.items.filter((item) => item.label.toLowerCase().includes(term)),
      })).filter((group) => group.items.length > 0)
    : NAV_GROUPS;

  const active = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <div className="flex min-h-screen bg-slate-100">
      {/* Sidebar */}
      <aside
        className={clsx(
          'fixed inset-y-0 z-40 flex w-64 flex-col border-e border-slate-200 bg-white transition-transform duration-300 lg:static lg:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="flex h-14 shrink-0 items-center gap-2.5 border-b border-slate-200 px-5">
          <svg viewBox="0 0 40 36" className="h-5 w-6" aria-hidden>
            <path d="M3 4h9v28H3V4Z" fill="#111C3A" />
            <path d="M28 4h9v28h-9V4Z" fill="#111C3A" />
            <path d="M3 4h9l25 28h-9L3 4Z" fill="#F5106E" />
          </svg>
          <span className="text-sm font-semibold text-slate-900">Noriva Admin</span>
        </div>

        <div className="px-3 pt-3">
          <label>
            <span className="sr-only">Filter admin sections</span>
            <input
              type="search"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="Jump to…"
              className="w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none transition-colors placeholder:text-slate-400 focus:border-slate-900 focus:bg-white"
            />
          </label>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4" aria-label="Admin">
          {groups.length === 0 && (
            <p className="px-2.5 py-6 text-center text-xs text-slate-400">No section matches that.</p>
          )}
          {groups.map((group) => (
            <div key={group.label} className="mb-5">
              <p className="px-2.5 pb-1.5 text-[0.6875rem] font-semibold uppercase tracking-wider text-slate-400">
                {group.label}
              </p>
              <ul className="space-y-0.5">
                {group.items.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      aria-current={active(item.href, 'exact' in item ? item.exact : false) ? 'page' : undefined}
                      className={clsx(
                        'block rounded-md px-2.5 py-2 text-sm transition-colors',
                        active(item.href, 'exact' in item ? item.exact : false)
                          ? 'bg-slate-900 font-medium text-white'
                          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
                      )}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        <div className="shrink-0 border-t border-slate-200 p-3">
          <div className="px-2.5 pb-2">
            <p className="truncate text-sm font-medium text-slate-800">{user.name}</p>
            <p className="truncate text-xs text-slate-400">{user.email}</p>
          </div>
          <div className="flex gap-2">
            <Link
              href="/en"
              target="_blank"
              className="flex-1 rounded-md border border-slate-200 px-3 py-2 text-center text-xs font-medium text-slate-600 transition-colors hover:bg-slate-50"
            >
              View site ↗
            </Link>
            <form action={logoutAction}>
              <button
                type="submit"
                className="rounded-md border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-50"
              >
                Sign out
              </button>
            </form>
          </div>
        </div>
      </aside>

      {open && (
        <button
          type="button"
          aria-label="Close menu"
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-30 bg-slate-900/40 lg:hidden"
        />
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b border-slate-200 bg-white px-4 lg:hidden">
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            className="rounded-md border border-slate-200 px-3 py-1.5 text-sm text-slate-700"
          >
            ☰
          </button>
          <span className="text-sm font-semibold text-slate-900">Noriva Admin</span>
        </header>

        <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
