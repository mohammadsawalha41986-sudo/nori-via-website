import Link from 'next/link';
import { prisma } from '@/lib/db';
import { PageHeader, Card, Badge, EmptyRow, LinkButton } from '@/components/admin/ui';
import { SubmitButton } from '@/components/admin/SubmitButton';
import { toggleToolStatus } from '@/server/platform-actions';
import { parseToolConfig } from '@/lib/tool-engine';

export const metadata = { title: 'Tools' };
export const dynamic = 'force-dynamic';

export default async function ToolsAdmin() {
  const items = await prisma.tool.findMany({ orderBy: [{ order: 'asc' }, { createdAt: 'desc' }] });

  return (
    <>
      <PageHeader
        title="Tools"
        description="Interactive calculators and estimators. Inputs and formulas are authored here — no code needed."
        action={<LinkButton href="/admin/tools/new">New tool</LinkButton>}
      />

      <Card>
        {items.length === 0 ? (
          <EmptyRow>No tools yet.</EmptyRow>
        ) : (
          <ul className="divide-y divide-slate-100">
            {items.map((tool) => {
              const config = parseToolConfig(tool.config);
              return (
                <li key={tool.id} className="flex flex-wrap items-center gap-3 py-3">
                  <Link href={`/admin/tools/${tool.id}`} className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium text-slate-900 hover:underline">{tool.nameEn}</span>
                    <span className="block truncate text-xs text-slate-400">
                      /tools/{tool.slug} · {config.inputs.length} inputs · {config.outputs.length} results
                    </span>
                  </Link>

                  <Badge tone={tool.status === 'PUBLISHED' ? 'green' : 'amber'}>{tool.status}</Badge>

                  <Link
                    href={`/en/tools/${tool.slug}${tool.status === 'PUBLISHED' ? '' : '?preview=1'}`}
                    target="_blank"
                    className="text-xs font-medium text-slate-500 hover:text-slate-900"
                  >
                    {tool.status === 'PUBLISHED' ? 'View ↗' : 'Preview ↗'}
                  </Link>

                  <form action={toggleToolStatus}>
                    <input type="hidden" name="id" value={tool.id} />
                    <SubmitButton variant="secondary" className="!px-2.5 !py-1 !text-xs" pendingLabel="…">
                      {tool.status === 'PUBLISHED' ? 'Unpublish' : 'Publish'}
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
