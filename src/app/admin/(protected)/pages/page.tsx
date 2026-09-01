import Link from 'next/link';
import { prisma } from '@/lib/db';
import { PageHeader, Card, EmptyRow } from '@/components/admin/ui';

export const metadata = { title: 'Pages' };
export const dynamic = 'force-dynamic';

/** Public routes backed by an editable Page record. */
const PAGE_LABELS: Record<string, { label: string; path: string }> = {
  about: { label: 'About', path: '/about' },
  'restaurant-growth': { label: 'Restaurant Growth', path: '/restaurant-growth' },
  services: { label: 'Services index', path: '/services' },
  work: { label: 'Work index', path: '/work' },
  insights: { label: 'Insights index', path: '/insights' },
  contact: { label: 'Contact', path: '/contact' },
  'start-a-project': { label: 'Start a Project', path: '/start-a-project' },
  privacy: { label: 'Privacy Policy', path: '/privacy' },
  terms: { label: 'Terms of Use', path: '/terms' },
};

export default async function PagesIndex() {
  const pages = await prisma.page.findMany({ orderBy: { key: 'asc' } });

  return (
    <>
      <PageHeader
        title="Pages"
        description="Headlines, intro copy and section content for the fixed pages of the site."
      />

      <Card>
        {pages.length === 0 ? (
          <EmptyRow>No pages found. Run the seed to create them.</EmptyRow>
        ) : (
          <ul className="divide-y divide-slate-100">
            {pages.map((p) => {
              const meta = PAGE_LABELS[p.key];
              return (
                <li key={p.id} className="flex flex-wrap items-center gap-3 py-3">
                  <Link href={`/admin/pages/${p.key}`} className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium text-slate-900 hover:underline">
                      {meta?.label ?? p.key}
                    </span>
                    <span className="block truncate text-xs text-slate-400">
                      {meta?.path ?? `/${p.key}`} · updated {p.updatedAt.toISOString().slice(0, 10)}
                    </span>
                  </Link>

                  {meta && (
                    <Link href={`/en${meta.path}`} target="_blank" className="text-xs font-medium text-slate-500 hover:text-slate-900">
                      View ↗
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </Card>
    </>
  );
}
