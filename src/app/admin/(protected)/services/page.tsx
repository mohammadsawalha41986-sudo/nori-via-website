import Link from 'next/link';
import { prisma } from '@/lib/db';
import { PageHeader, Card, Badge, EmptyRow, LinkButton } from '@/components/admin/ui';
import { SubmitButton } from '@/components/admin/SubmitButton';
import { toggleServiceStatus } from '@/server/actions';

export const metadata = { title: 'Services' };
export const dynamic = 'force-dynamic';

export default async function ServicesAdmin() {
  const services = await prisma.service.findMany({
    orderBy: [{ order: 'asc' }, { nameEn: 'asc' }],
    include: { category: true },
  });

  return (
    <>
      <PageHeader
        title="Services"
        description="Every service has its own public page. Reorder with the Order field on each service."
        action={<LinkButton href="/admin/services/new">New service</LinkButton>}
      />

      <Card>
        {services.length === 0 ? (
          <EmptyRow>No services yet.</EmptyRow>
        ) : (
          <ul className="divide-y divide-slate-100">
            {services.map((s) => (
              <li key={s.id} className="flex flex-wrap items-center gap-3 py-3">
                <span className="w-8 shrink-0 text-xs text-slate-400">{s.order}</span>

                <Link href={`/admin/services/${s.id}`} className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium text-slate-900 hover:underline">{s.nameEn}</span>
                  <span className="block truncate text-xs text-slate-400">
                    /{s.slug}
                    {s.category ? ` · ${s.category.nameEn}` : ''}
                  </span>
                </Link>

                <Badge tone={s.status === 'PUBLISHED' ? 'green' : 'amber'}>{s.status}</Badge>

                <Link
                  href={`/en/services/${s.slug}`}
                  target="_blank"
                  className="text-xs font-medium text-slate-500 hover:text-slate-900"
                >
                  View ↗
                </Link>

                <form action={toggleServiceStatus}>
                  <input type="hidden" name="id" value={s.id} />
                  <SubmitButton variant="secondary" className="!px-2.5 !py-1 !text-xs" pendingLabel="…">
                    {s.status === 'PUBLISHED' ? 'Unpublish' : 'Publish'}
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
