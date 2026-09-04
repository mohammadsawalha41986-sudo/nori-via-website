import Link from 'next/link';
import { prisma } from '@/lib/db';
import { PageHeader, Card, Badge, EmptyRow, LinkButton } from '@/components/admin/ui';
import { SubmitButton } from '@/components/admin/SubmitButton';
import { toggleInsightStatus } from '@/server/actions';
import { ListFilter } from '@/components/admin/ListFilter';

export const metadata = { title: 'Insights' };
export const dynamic = 'force-dynamic';

export default async function InsightsAdmin({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string }>;
}) {
  const { q = '', status = '' } = await searchParams;

  const items = await prisma.insight.findMany({
    where: {
      ...(status === 'PUBLISHED' || status === 'DRAFT' ? { status } : {}),
      ...(q.trim()
        ? {
            OR: [
              { titleEn: { contains: q.trim(), mode: 'insensitive' as const } },
              { titleAr: { contains: q.trim(), mode: 'insensitive' as const } },
              { slug: { contains: q.trim(), mode: 'insensitive' as const } },
            ],
          }
        : {}),
    },
    orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
    include: { category: true },
  });

  const now = new Date();

  return (
    <>
      <PageHeader
        title="Insights"
        description="Editorial articles on restaurant marketing, menu engineering, food cost and growth."
        action={<LinkButton href="/admin/insights/new">New article</LinkButton>}
      />

      <ListFilter placeholder="Search articles…" />

      <Card>
        {items.length === 0 ? (
          <EmptyRow>{q || status ? 'No articles match that filter.' : 'No articles yet.'}</EmptyRow>
        ) : (
          <ul className="divide-y divide-slate-100">
            {items.map((a) => (
              <li key={a.id} className="flex flex-wrap items-center gap-3 py-3">
                <Link href={`/admin/insights/${a.id}`} className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium text-slate-900 hover:underline">{a.titleEn}</span>
                  <span className="block truncate text-xs text-slate-400">
                    /{a.slug}
                    {a.category ? ` · ${a.category.nameEn}` : ''}
                    {a.publishedAt ? ` · ${a.publishedAt.toISOString().slice(0, 10)}` : ''}
                  </span>
                </Link>

                {/* A published article dated in the future is scheduled, and
                    stays off the public site until that date. */}
                {a.status === 'PUBLISHED' && a.publishedAt && a.publishedAt > now ? (
                  <Badge tone="brand">SCHEDULED</Badge>
                ) : (
                  <Badge tone={a.status === 'PUBLISHED' ? 'green' : 'amber'}>{a.status}</Badge>
                )}

                <Link
                  href={`/en/insights/${a.slug}${a.status === 'PUBLISHED' ? '' : '?preview=1'}`}
                  target="_blank"
                  className="text-xs font-medium text-slate-500 hover:text-slate-900"
                >
                  {a.status === 'PUBLISHED' ? 'View ↗' : 'Preview ↗'}
                </Link>

                <form action={toggleInsightStatus}>
                  <input type="hidden" name="id" value={a.id} />
                  <SubmitButton variant="secondary" className="!px-2.5 !py-1 !text-xs" pendingLabel="…">
                    {a.status === 'PUBLISHED' ? 'Unpublish' : 'Publish'}
                  </SubmitButton>
                </form>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </>
  );
}
