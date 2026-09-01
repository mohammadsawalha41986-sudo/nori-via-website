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
  ]);

  const warnings: string[] = [];
  if (!isMailConfigured()) {
    warnings.push('SMTP is not configured — inquiries are saved but no email is sent. Set SMTP_HOST, SMTP_PORT, SMTP_USER and SMTP_PASSWORD.');
  }
  if (!settings?.inquiryEmail && !env.contactEmail) {
    warnings.push('No inquiry email address is set. Add one in Site settings so new inquiries reach the team.');
  }
  if (!settings?.logoUrl) warnings.push('No logo has been uploaded. Add one in Site settings.');
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
        <Stat label="Media files" value={mediaCount} href="/admin/media" />
        <Stat label="New inquiries" value={newInquiries} href="/admin/inquiries" />
      </div>

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
