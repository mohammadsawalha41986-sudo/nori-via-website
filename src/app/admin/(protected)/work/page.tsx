import Link from 'next/link';
import { prisma } from '@/lib/db';
import { PageHeader, Card, Badge, EmptyRow, LinkButton } from '@/components/admin/ui';
import { SubmitButton } from '@/components/admin/SubmitButton';
import { toggleProjectStatus } from '@/server/actions';

export const metadata = { title: 'Portfolio' };
export const dynamic = 'force-dynamic';

export default async function WorkAdmin() {
  const projects = await prisma.project.findMany({
    orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    include: { category: true, caseStudy: { select: { id: true } } },
  });

  return (
    <>
      <PageHeader
        title="Portfolio"
        description="Real client work only. Never publish a project or a result that cannot be evidenced."
        action={<LinkButton href="/admin/work/new">New project</LinkButton>}
      />

      <Card>
        {projects.length === 0 ? (
          <EmptyRow>
            No projects yet. Add real work here — the public Work page shows an honest empty state until then.
          </EmptyRow>
        ) : (
          <ul className="divide-y divide-slate-100">
            {projects.map((p) => (
              <li key={p.id} className="flex flex-wrap items-center gap-3 py-3">
                <span className="w-8 shrink-0 text-xs text-slate-400">{p.order}</span>

                <Link href={`/admin/work/${p.id}`} className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium text-slate-900 hover:underline">{p.titleEn}</span>
                  <span className="block truncate text-xs text-slate-400">
                    /{p.slug}
                    {p.client ? ` · ${p.client}` : ''}
                    {p.category ? ` · ${p.category.nameEn}` : ''}
                  </span>
                </Link>

                {p.featured && <Badge tone="brand">Featured</Badge>}
                {p.caseStudy && <Badge>Case study</Badge>}
                <Badge tone={p.status === 'PUBLISHED' ? 'green' : 'amber'}>{p.status}</Badge>

                <Link href={`/en/work/${p.slug}`} target="_blank" className="text-xs font-medium text-slate-500 hover:text-slate-900">
                  View ↗
                </Link>

                <form action={toggleProjectStatus}>
                  <input type="hidden" name="id" value={p.id} />
                  <SubmitButton variant="secondary" className="!px-2.5 !py-1 !text-xs" pendingLabel="…">
                    {p.status === 'PUBLISHED' ? 'Unpublish' : 'Publish'}
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
