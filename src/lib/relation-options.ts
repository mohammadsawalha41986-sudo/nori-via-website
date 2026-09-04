import 'server-only';
import type { ContentType } from '@prisma/client';
import { prisma } from './db';
import { pagePath } from './relations';
import type { RelationOption } from '@/components/admin/RelationPicker';

/**
 * Everything an editor can attach to a piece of content. Drafts are included
 * so a set of new items can be connected before any of them is published —
 * the public pages only ever render the published ones.
 */
export async function getRelationOptions(exclude?: { type: ContentType; id: string }): Promise<RelationOption[]> {
  const [insights, resources, tools, services, projects, caseStudies, pages] = await Promise.all([
    prisma.insight.findMany({ select: { id: true, titleEn: true, status: true }, orderBy: { titleEn: 'asc' } }),
    prisma.resource.findMany({ select: { id: true, titleEn: true, status: true }, orderBy: { titleEn: 'asc' } }),
    prisma.tool.findMany({ select: { id: true, nameEn: true, status: true }, orderBy: { nameEn: 'asc' } }),
    prisma.service.findMany({ select: { id: true, nameEn: true, status: true }, orderBy: { nameEn: 'asc' } }),
    prisma.project.findMany({ select: { id: true, titleEn: true, status: true }, orderBy: { titleEn: 'asc' } }),
    prisma.caseStudy.findMany({ select: { id: true, titleEn: true, status: true }, orderBy: { titleEn: 'asc' } }),
    prisma.page.findMany({ select: { id: true, key: true, titleEn: true }, orderBy: { key: 'asc' } }),
  ]);

  const label = (name: string, status: string) => (status === 'PUBLISHED' ? name : `${name} (draft)`);

  const options: RelationOption[] = [
    ...insights.map((r) => ({ type: 'INSIGHT' as const, id: r.id, label: label(r.titleEn, r.status), group: 'Insights' })),
    ...resources.map((r) => ({ type: 'RESOURCE' as const, id: r.id, label: label(r.titleEn, r.status), group: 'Resources' })),
    ...tools.map((r) => ({ type: 'TOOL' as const, id: r.id, label: label(r.nameEn, r.status), group: 'Tools' })),
    ...services.map((r) => ({ type: 'SERVICE' as const, id: r.id, label: label(r.nameEn, r.status), group: 'Solutions' })),
    ...projects.map((r) => ({ type: 'PROJECT' as const, id: r.id, label: label(r.titleEn, r.status), group: 'Work' })),
    ...caseStudies.map((r) => ({ type: 'CASE_STUDY' as const, id: r.id, label: label(r.titleEn, r.status), group: 'Case studies' })),
    ...pages
      .filter((r) => pagePath(r.key) !== undefined)
      .map((r) => ({ type: 'PAGE' as const, id: r.id, label: r.titleEn || r.key, group: 'Pages' })),
  ];

  return exclude ? options.filter((o) => !(o.type === exclude.type && o.id === exclude.id)) : options;
}
