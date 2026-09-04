import Link from 'next/link';
import { prisma } from '@/lib/db';
import { PageHeader, Card, Badge, EmptyRow, LinkButton } from '@/components/admin/ui';
import { SubmitButton } from '@/components/admin/SubmitButton';
import { toggleResourceStatus } from '@/server/platform-actions';
import { documentLabel, formatBytes } from '@/lib/storage';
import { ListFilter } from '@/components/admin/ListFilter';

export const metadata = { title: 'Resources' };
export const dynamic = 'force-dynamic';

export default async function ResourcesAdmin({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string }>;
}) {
  const { q = '', status = '' } = await searchParams;

  const items = await prisma.resource.findMany({
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
    orderBy: [{ status: 'asc' }, { order: 'asc' }, { createdAt: 'desc' }],
    include: { category: true },
  });

  return (
    <>
      <PageHeader
        title="Resources"
        description="The Library: Excel models, Word templates, PDFs, guides and reports visitors can download."
        action={<LinkButton href="/admin/resources/new">New resource</LinkButton>}
      />

      <ListFilter placeholder="Search resources…" />

      <Card>
        {items.length === 0 ? (
          <EmptyRow>
            {q || status ? 'No resources match that filter.' : 'No resources yet. Upload the first Excel, Word or PDF file.'}
          </EmptyRow>
        ) : (
          <ul className="divide-y divide-slate-100">
            {items.map((r) => {
              const publishable = Boolean(r.fileKey || r.externalUrl);
              return (
                <li key={r.id} className="flex flex-wrap items-center gap-3 py-3">
                  <Link href={`/admin/resources/${r.id}`} className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium text-slate-900 hover:underline">{r.titleEn}</span>
                    <span className="block truncate text-xs text-slate-400">
                      /library/{r.slug}
                      {r.category ? ` · ${r.category.nameEn}` : ''}
                      {r.fileKey ? ` · ${documentLabel(r.fileMime)} ${formatBytes(r.fileSize)}` : r.externalUrl ? ' · external' : ' · no file'}
                      {r.downloadCount > 0 ? ` · ${r.downloadCount} downloads` : ''}
                    </span>
                  </Link>

                  <Badge tone="slate">{r.type}</Badge>
                  <Badge tone={r.status === 'PUBLISHED' ? 'green' : 'amber'}>{r.status}</Badge>

                  <Link
                    href={`/en/library/${r.slug}${r.status === 'PUBLISHED' ? '' : '?preview=1'}`}
                    target="_blank"
                    className="text-xs font-medium text-slate-500 hover:text-slate-900"
                  >
                    {r.status === 'PUBLISHED' ? 'View ↗' : 'Preview ↗'}
                  </Link>

                  <form action={toggleResourceStatus}>
                    <input type="hidden" name="id" value={r.id} />
                    <SubmitButton
                      variant="secondary"
                      className="!px-2.5 !py-1 !text-xs"
                      pendingLabel="…"
                      confirm={
                        !publishable && r.status === 'DRAFT'
                          ? 'This resource has no file or external URL yet, so it cannot be published. Open it to add one.'
                          : undefined
                      }
                    >
                      {r.status === 'PUBLISHED' ? 'Unpublish' : 'Publish'}
                    </SubmitButton>
                  </form>
                </li>
              );
            })}
          </ul>
        )}
      </Card>
    </>
  );
}
