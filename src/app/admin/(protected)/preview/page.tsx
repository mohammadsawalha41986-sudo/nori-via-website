import { prisma } from '@/lib/db';
import { PageHeader, Card } from '@/components/admin/ui';
import { SitePreview, type PreviewRoute } from '@/components/admin/SitePreview';

export const metadata = { title: 'Preview' };
export const dynamic = 'force-dynamic';

/**
 * The route list is built from the CMS, so newly published content is
 * previewable immediately. Drafts are included: the preview frame passes
 * `?preview=1`, which the public pages honour only for a signed-in admin.
 */
export default async function PreviewAdmin() {
  const [services, projects, insights, resources, tools] = await Promise.all([
    prisma.service.findMany({ select: { slug: true, nameEn: true }, orderBy: { order: 'asc' }, take: 40 }),
    prisma.project.findMany({ select: { slug: true, titleEn: true }, orderBy: { order: 'asc' }, take: 40 }),
    prisma.insight.findMany({ select: { slug: true, titleEn: true }, orderBy: { createdAt: 'desc' }, take: 40 }),
    prisma.resource.findMany({ select: { slug: true, titleEn: true }, orderBy: { createdAt: 'desc' }, take: 40 }),
    prisma.tool.findMany({ select: { slug: true, nameEn: true }, orderBy: { order: 'asc' }, take: 40 }),
  ]);

  const routes: PreviewRoute[] = [
    { href: '/', label: 'Home', group: 'Pages' },
    { href: '/services', label: 'Solutions', group: 'Pages' },
    { href: '/work', label: 'Work', group: 'Pages' },
    { href: '/restaurant-growth', label: 'Restaurant Growth', group: 'Pages' },
    { href: '/insights', label: 'Insights', group: 'Pages' },
    { href: '/library', label: 'Library', group: 'Pages' },
    { href: '/tools', label: 'Tools', group: 'Pages' },
    { href: '/about', label: 'About', group: 'Pages' },
    { href: '/contact', label: 'Contact', group: 'Pages' },
    { href: '/start-a-project', label: 'Start a Project', group: 'Pages' },
    { href: '/search', label: 'Search', group: 'Pages' },
    ...services.map((s) => ({ href: `/services/${s.slug}`, label: s.nameEn, group: 'Solutions' })),
    ...projects.map((p) => ({ href: `/work/${p.slug}`, label: p.titleEn, group: 'Work' })),
    ...insights.map((a) => ({ href: `/insights/${a.slug}`, label: a.titleEn, group: 'Insights' })),
    ...resources.map((r) => ({ href: `/library/${r.slug}`, label: r.titleEn, group: 'Resources' })),
    ...tools.map((t) => ({ href: `/tools/${t.slug}`, label: t.nameEn, group: 'Tools' })),
  ];

  return (
    <>
      <PageHeader
        title="Preview"
        description="The live site at desktop, tablet and mobile widths, in English and Arabic. Draft pages are visible to you only."
      />
      <Card>
        <SitePreview routes={routes} />
      </Card>
    </>
  );
}
