import Link from 'next/link';
import { prisma } from '@/lib/db';
import { PageHeader, Card, Badge, EmptyRow, LinkButton } from '@/components/admin/ui';
import { SubmitButton } from '@/components/admin/SubmitButton';
import { toggleCaseStudyStatus } from '@/server/actions';

export const metadata = { title: 'Case studies' };
export const dynamic = 'force-dynamic';

export default async function CaseStudiesAdmin() {
  const items = await prisma.caseStudy.findMany({
    orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    include: { project: { select: { slug: true, titleEn: true } } },
  });

  return (
    <>
      <PageHeader
        title="Case studies"
        description="The challenge → outcome story shown on a project page."
        action={<LinkButton href="/admin/case-studies/new">New case study</LinkButton>}
      />

      <Card>
        {items.length === 0 ? (
          <EmptyRow>No case studies yet.</EmptyRow>
        ) : (
          <ul className="divide-y divide-slate-100">
            {items.map((c) => (
              <li key={c.id} className="flex flex-wrap items-center gap-3 py-3">
                <Link href={`/admin/case-studies/${c.id}`} className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium text-slate-900 hover:underline">{c.titleEn}</span>
                  <span className="block truncate text-xs text-slate-400">
                    {c.project ? `Project: ${c.project.titleEn}` : 'Not linked to a project'}
                  </span>
                </Link>

                <Badge tone={c.status === 'PUBLISHED' ? 'green' : 'amber'}>{c.status}</Badge>

                {c.project && (
                  <Link href={`/en/work/${c.project.slug}`} target="_blank" className="text-xs font-medium text-slate-500 hover:text-slate-900">
                    View ↗
                  </Link>
                )}

                <form action={toggleCaseStudyStatus}>
                  <input type="hidden" name="id" value={c.id} />
                  <SubmitButton variant="secondary" className="!px-2.5 !py-1 !text-xs" pendingLabel="…">
                    {c.status === 'PUBLISHED' ? 'Unpublish' : 'Publish'}
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
