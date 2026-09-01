import Link from 'next/link';
import { prisma } from '@/lib/db';
import { PageHeader, Card, Badge, EmptyRow, inputClass } from '@/components/admin/ui';

export const metadata = { title: 'Inquiries' };
export const dynamic = 'force-dynamic';

const STATUSES = ['NEW', 'CONTACTED', 'COMPLETED', 'ARCHIVED'] as const;

export default async function InquiriesPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const { status = '' } = await searchParams;
  const filter = (STATUSES as readonly string[]).includes(status)
    ? { status: status as (typeof STATUSES)[number] }
    : {};

  const [inquiries, counts] = await Promise.all([
    prisma.projectInquiry.findMany({
      where: filter,
      orderBy: { createdAt: 'desc' },
      include: { _count: { select: { attachments: true } } },
      take: 200,
    }),
    prisma.projectInquiry.groupBy({ by: ['status'], _count: true }),
  ]);

  const countOf = (s: string) => counts.find((c) => c.status === s)?._count ?? 0;

  return (
    <>
      <PageHeader
        title="Inquiries"
        description="An inbox, not a CRM. Noriva contacts each client by email, phone or WhatsApp outside this system."
      />

      <nav className="mb-5 flex flex-wrap gap-2" aria-label="Filter by status">
        <Link
          href="/admin/inquiries"
          className={`rounded-md border px-3 py-1.5 text-sm ${!status ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-300 bg-white text-slate-600'}`}
        >
          All
        </Link>
        {STATUSES.map((s) => (
          <Link
            key={s}
            href={`/admin/inquiries?status=${s}`}
            className={`rounded-md border px-3 py-1.5 text-sm ${status === s ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-300 bg-white text-slate-600'}`}
          >
            {s} ({countOf(s)})
          </Link>
        ))}
      </nav>

      <Card>
        {inquiries.length === 0 ? (
          <EmptyRow>No inquiries in this view.</EmptyRow>
        ) : (
          <ul className="divide-y divide-slate-100">
            {inquiries.map((i) => (
              <li key={i.id}>
                <Link href={`/admin/inquiries/${i.id}`} className="flex flex-wrap items-center gap-3 py-3 hover:bg-slate-50">
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium text-slate-900">
                      {i.name}
                      {i.business ? ` · ${i.business}` : ''}
                    </span>
                    <span className="block truncate text-xs text-slate-400">
                      {i.email}
                      {i.budget ? ` · ${i.budget}` : ''}
                      {i._count.attachments ? ` · ${i._count.attachments} file(s)` : ''}
                    </span>
                  </span>

                  {!i.emailSentToTeam && <Badge tone="amber">Not emailed</Badge>}
                  <Badge tone={i.status === 'NEW' ? 'brand' : i.status === 'COMPLETED' ? 'green' : 'slate'}>{i.status}</Badge>
                  <span className="w-24 shrink-0 text-right text-xs text-slate-400">
                    {i.createdAt.toISOString().slice(0, 10)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Card>

      {/* Kept so the shared input style is applied consistently across admin forms. */}
      <span className={`hidden ${inputClass}`} aria-hidden />
    </>
  );
}
