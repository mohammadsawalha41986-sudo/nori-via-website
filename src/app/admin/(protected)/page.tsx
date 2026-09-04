import Link from 'next/link';
import { prisma } from '@/lib/db';
import { PageHeader, Card, Stat, Badge, EmptyRow } from '@/components/admin/ui';
import { isMailConfigured, env } from '@/lib/env';

export const metadata = { title: 'Dashboard' };
export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const [
    servicesPublished,
    servicesTotal,
    projectsPublished,
    projectsTotal,
    caseStudies,
    insightsPublished,
    mediaCount,
    newInquiries,
    inquiries,
    newMessages,
    settings,
    resourcesPublished,
    resourcesTotal,
    toolsPublished,
    toolsTotal,
    draftCount,
    topDownloads,
    recentDownloads,
  ] = await Promise.all([
    prisma.service.count({ where: { status: 'PUBLISHED' } }),
    prisma.service.count(),
    prisma.project.count({ where: { status: 'PUBLISHED' } }),
    prisma.project.count(),
    prisma.caseStudy.count({ where: { status: 'PUBLISHED' } }),
    prisma.insight.count({ where: { status: 'PUBLISHED' } }),
    prisma.media.count(),
    prisma.projectInquiry.count({ where: { status: 'NEW' } }),
    prisma.projectInquiry.findMany({ orderBy: { createdAt: 'desc' }, take: 8 }),
    prisma.contactMessage.count({ where: { status: 'NEW' } }),
    prisma.siteSettings.findUnique({ where: { id: 'singleton' } }),
    prisma.resource.count({ where: { status: 'PUBLISHED' } }),
    prisma.resource.count(),
    prisma.tool.count({ where: { status: 'PUBLISHED' } }),
    prisma.tool.count(),
    // Everything still waiting to be finished and published.
    Promise.all([
      prisma.service.count({ where: { status: 'DRAFT' } }),
      prisma.project.count({ where: { status: 'DRAFT' } }),
      prisma.caseStudy.count({ where: { status: 'DRAFT' } }),
      prisma.insight.count({ where: { status: 'DRAFT' } }),
      prisma.resource.count({ where: { status: 'DRAFT' } }),
      prisma.tool.count({ where: { status: 'DRAFT' } }),
    ]).then((counts) => counts.reduce((total, n) => total + n, 0)),
    prisma.resource.findMany({
      where: { downloadCount: { gt: 0 } },
      orderBy: { downloadCount: 'desc' },
      take: 6,
      select: { id: true, titleEn: true, slug: true, downloadCount: true },
    }),
    prisma.analyticsEvent.count({
      where: { name: 'resource_download', createdAt: { gte: new Date(Date.now() - 30 * 864e5) } },
    }),
  ]);

  const warnings: string[] = [];
  if (!isMailConfigured()) {
    warnings.push('SMTP is not configured — inquiries are saved but no email is sent. Set SMTP_HOST, SMTP_PORT, SMTP_USER and SMTP_PASSWORD.');
  }
  if (!settings?.inquiryEmail && !env.contactEmail) {
    warnings.push('No inquiry email address is set. Add one in Site settings so new inquiries reach the team.');
  }
  if (!settings?.logoUrl) warnings.push('No logo has been uploaded. Add one in Site settings.');
  if (resourcesTotal === 0) {
    warnings.push('The Library is empty. Upload an Excel, Word or PDF resource in Library resources.');
  }
  if (projectsTotal === 0) warnings.push('No portfolio projects yet. Add real work in Portfolio — placeholder work is never invented.');

  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Everything published on noriva.sa is managed from here."
      />

      {warnings.length > 0 && (
        <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 p-4">
          <p className="text-sm font-semibold text-amber-900">Setup checklist</p>
          <ul className="mt-2 space-y-1.5">
            {warnings.map((w) => (
              <li key={w} className="text-sm text-amber-800">
                • {w}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <Stat label="Services live" value={`${servicesPublished}/${servicesTotal}`} href="/admin/services" />
        <Stat label="Projects live" value={`${projectsPublished}/${projectsTotal}`} href="/admin/work" />
        <Stat label="Case studies" value={caseStudies} href="/admin/case-studies" />
        <Stat label="Insights" value={insightsPublished} href="/admin/insights" />
        <Stat label="Resources live" value={`${resourcesPublished}/${resourcesTotal}`} href="/admin/resources" />
        <Stat label="Tools live" value={`${toolsPublished}/${toolsTotal}`} href="/admin/tools" />
        <Stat label="Media files" value={mediaCount} href="/admin/media" />
        <Stat label="New inquiries" value={newInquiries} href="/admin/inquiries" />
        <Stat label="Drafts" value={draftCount} href="/admin/preview" />
        <Stat label="Downloads (30 days)" value={recentDownloads} href="/admin/resources" />
      </div>

      {topDownloads.length > 0 && (
        <Card
          title="Most downloaded resources"
          description="Counted per visitor, so a refresh loop cannot inflate these numbers."
          className="mb-6"
        >
          <ul className="divide-y divide-slate-100">
            {topDownloads.map((r) => (
              <li key={r.id} className="flex items-center gap-3 py-2.5">
                <Link href={`/admin/resources/${r.id}`} className="min-w-0 flex-1 truncate text-sm text-slate-800 hover:underline">
                  {r.titleEn}
                </Link>
                <span className="text-sm font-semibold text-slate-900">{r.downloadCount}</span>
              </li>
            ))}
          </ul>
        </Card>
      )}

      {newMessages > 0 && (
        <div className="mb-6 rounded-lg border border-slate-200 bg-white p-4 text-sm text-slate-700">
          You have <strong>{newMessages}</strong> unread contact {newMessages === 1 ? 'message' : 'messages'}.{' '}
          <Link href="/admin/messages" className="font-medium text-slate-900 underline">
            Open messages
          </Link>
        </div>
      )}

      <Card title="Recent inquiries" description="Lead intake only — Noriva contacts each client outside this system.">
        {inquiries.length === 0 ? (
          <EmptyRow>No inquiries yet.</EmptyRow>
        ) : (
          <ul className="divide-y divide-slate-100">
            {inquiries.map((i) => (
              <li key={i.id}>
                <Link href={`/admin/inquiries/${i.id}`} className="flex flex-wrap items-center gap-3 py-3 transition-colors hover:bg-slate-50">
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium text-slate-900">
                      {i.name}
                      {i.business ? ` · ${i.business}` : ''}
                    </span>
                    <span className="block truncate text-xs text-slate-400">{i.email}</span>
                  </span>
                  <Badge tone={i.status === 'NEW' ? 'brand' : i.status === 'COMPLETED' ? 'green' : 'slate'}>
                    {i.status}
                  </Badge>
                  <span className="w-24 shrink-0 text-right text-xs text-slate-400">
                    {i.createdAt.toISOString().slice(0, 10)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </>
  );
}
