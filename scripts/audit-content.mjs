/** Launch-readiness audit for the database-backed public catalogue. */
import 'dotenv/config';
import { existsSync, statSync } from 'node:fs';
import path from 'node:path';
import { PrismaClient } from '@prisma/client';
import { LIBRARY_ASSETS } from './content/library-assets.mjs';

const prisma = new PrismaClient();
const SUMMARY = process.argv.includes('--summary');
const empty = (field) => ({ [field]: '' });

const models = {
  services: ['service', ['nameEn', 'nameAr', 'summaryEn', 'summaryAr', 'heroDescriptionEn', 'heroDescriptionAr', 'whatWeDoEn', 'whatWeDoAr', 'approachEn', 'approachAr', 'whyItMattersEn', 'whyItMattersAr']],
  insights: ['insight', ['titleEn', 'titleAr', 'excerptEn', 'excerptAr', 'contentEn', 'contentAr']],
  resources: ['resource', ['titleEn', 'titleAr', 'summaryEn', 'summaryAr', 'descriptionEn', 'descriptionAr']],
  tools: ['tool', ['nameEn', 'nameAr', 'summaryEn', 'summaryAr', 'descriptionEn', 'descriptionAr', 'purposeEn', 'purposeAr']],
  projects: ['project', ['titleEn', 'titleAr', 'descriptionEn', 'descriptionAr']],
  caseStudies: ['caseStudy', ['titleEn', 'titleAr', 'challengeEn', 'challengeAr', 'ideaEn', 'ideaAr', 'strategyEn', 'strategyAr', 'outcomeEn', 'outcomeAr', 'resultEn', 'resultAr']],
};

async function missingTranslationRows(model, fields) {
  return prisma[model].findMany({
    where: { status: 'PUBLISHED', OR: fields.map(empty) },
    select: { id: true, slug: true },
  });
}

async function draftReason(model, row) {
  if (model === 'resource' && !row.fileKey && !row.externalUrl) {
    return 'No verified downloadable file is attached; publishing would create a dead download.';
  }
  if (model === 'project' && row.client === 'Sample project') {
    return 'Legacy studio placeholder retained in Admin and superseded by explicitly labelled illustrative F&B examples.';
  }
  if (model === 'caseStudy' && !(row.challengeEn || '').startsWith('This is an illustrative engagement')) {
    return 'Legacy case-study record is not verified client work and is not managed by the illustrative-content provisioner.';
  }
  return 'Existing editorial record is outside the managed launch catalogue and still requires an owner evidence review.';
}

async function main() {
  const published = {};
  const missingTranslations = {};
  const drafts = [];

  for (const [label, [model, fields]] of Object.entries(models)) {
    published[label] = await prisma[model].count({ where: { status: 'PUBLISHED' } });
    missingTranslations[label] = await missingTranslationRows(model, fields);
    const rows = await prisma[model].findMany({
      where: { status: 'DRAFT' },
      select: { id: true, slug: true, ...(model === 'resource' ? { fileKey: true, externalUrl: true } : {}), ...(model === 'project' ? { client: true } : {}), ...(model === 'caseStudy' ? { challengeEn: true } : {}) },
      orderBy: { slug: 'asc' },
    });
    for (const row of rows) drafts.push({ type: label, slug: row.slug, reason: await draftReason(model, row) });
  }

  const configuredAssets = await prisma.resource.findMany({
    where: { slug: { in: LIBRARY_ASSETS.map((asset) => asset.slug) } },
    select: { slug: true, status: true, fileKey: true, fileName: true, fileSize: true },
  });
  const storageRoot = path.resolve(process.cwd(), process.env.STORAGE_DIR || './storage', 'private');
  const missingDownloads = configuredAssets.filter((row) =>
    row.status !== 'PUBLISHED' || !row.fileKey || !row.fileName || row.fileSize <= 0 || !existsSync(path.resolve(storageRoot, row.fileKey || 'missing')),
  );
  const missingAssetRecords = LIBRARY_ASSETS.filter((asset) => !configuredAssets.some((row) => row.slug === asset.slug));

  /* Every published resource must actually be downloadable — not only the ones
     this repository ships. A row published through Admin with a lost file is
     the same dead download to a visitor, so the check follows the promise the
     page makes rather than the manifest. */
  const publishedResources = await prisma.resource.findMany({
    where: { status: 'PUBLISHED' },
    select: { slug: true, fileKey: true, fileName: true, fileSize: true, externalUrl: true },
  });
  const brokenDownloads = publishedResources.filter((row) => {
    if (row.externalUrl) return false;
    if (!row.fileKey || !row.fileName || row.fileSize <= 0) return true;
    const onDisk = path.resolve(storageRoot, row.fileKey);
    if (!existsSync(onDisk)) return true;
    // A file that exists but is empty answers 200 with nothing in it.
    return statSync(onDisk).size === 0;
  });

  /* A link is only useful if both ends still exist. contentLink stores plain
     ids with no foreign key, so a deleted row leaves a link pointing nowhere
     and the related-content rail renders a gap. */
  const linkIds = {
    SERVICE: new Set((await prisma.service.findMany({ select: { id: true } })).map((r) => r.id)),
    INSIGHT: new Set((await prisma.insight.findMany({ select: { id: true } })).map((r) => r.id)),
    RESOURCE: new Set((await prisma.resource.findMany({ select: { id: true } })).map((r) => r.id)),
    TOOL: new Set((await prisma.tool.findMany({ select: { id: true } })).map((r) => r.id)),
    PROJECT: new Set((await prisma.project.findMany({ select: { id: true } })).map((r) => r.id)),
    CASE_STUDY: new Set((await prisma.caseStudy.findMany({ select: { id: true } })).map((r) => r.id)),
  };
  const danglingLinks = (await prisma.contentLink.findMany({ select: { id: true, fromType: true, fromId: true, toType: true, toId: true } }))
    .filter((link) => !linkIds[link.fromType]?.has(link.fromId) || !linkIds[link.toType]?.has(link.toId))
    .map((link) => `${link.fromType}:${link.fromId} -> ${link.toType}:${link.toId}`);

  const imageCounts = {
    services: await prisma.service.count({ where: { status: 'PUBLISHED', featuredImage: { not: null } } }),
    insights: await prisma.insight.count({ where: { status: 'PUBLISHED', coverImage: { not: null } } }),
    resources: await prisma.resource.count({ where: { status: 'PUBLISHED', thumbnail: { not: null } } }),
    tools: await prisma.tool.count({ where: { status: 'PUBLISHED', thumbnail: { not: null } } }),
    projects: await prisma.project.count({ where: { status: 'PUBLISHED', heroMediaUrl: { not: null } } }),
    caseStudies: await prisma.caseStudy.count({ where: { status: 'PUBLISHED', heroMediaUrl: { not: null } } }),
  };
  /* Counts alone cannot say which record is missing its image. */
  const missingImages = [];
  for (const [label, [model, field]] of Object.entries({
    services: ['service', 'featuredImage'], insights: ['insight', 'coverImage'],
    resources: ['resource', 'thumbnail'], tools: ['tool', 'thumbnail'],
    projects: ['project', 'heroMediaUrl'], caseStudies: ['caseStudy', 'heroMediaUrl'],
  })) {
    const rows = await prisma[model].findMany({
      where: { status: 'PUBLISHED', OR: [{ [field]: null }, { [field]: '' }] },
      select: { slug: true },
    });
    for (const row of rows) missingImages.push(`${label}:${row.slug}`);
  }

  const report = {
    published,
    downloadableFiles: configuredAssets.length - missingDownloads.length,
    generatedFiles: {
      xlsx: LIBRARY_ASSETS.filter((asset) => asset.type === 'EXCEL').length,
      docx: LIBRARY_ASSETS.filter((asset) => asset.type === 'WORD').length,
      pdf: LIBRARY_ASSETS.filter((asset) => asset.type === 'PDF').length,
    },
    imageCounts,
    relationships: await prisma.contentLink.count(),
    missingTranslations,
    missingDownloads: missingDownloads.map((row) => row.slug),
    missingAssetRecords: missingAssetRecords.map((asset) => asset.slug),
    brokenDownloads: brokenDownloads.map((row) => row.slug),
    danglingLinks,
    missingImages,
    drafts,
  };
  if (SUMMARY) {
    // One line, for boot logs on a host where the only way to see production
    // state is what the deploy prints.
    const t = Object.values(missingTranslations).flat().length;
    console.log(
      `[content-audit] services=${published.services} insights=${published.insights} ` +
        `resources=${published.resources} tools=${published.tools} projects=${published.projects} ` +
        `caseStudies=${published.caseStudies} downloads=${report.downloadableFiles}/${LIBRARY_ASSETS.length} ` +
        `relations=${report.relationships} missingTranslations=${t} ` +
        `missingDownloads=${missingDownloads.length} brokenDownloads=${brokenDownloads.length} ` +
        `danglingLinks=${danglingLinks.length} missingImages=${missingImages.length} drafts=${drafts.length}`,
    );
    // Naming them turns "3 rows are short a translation" into something an
    // editor can act on, which matters most where the database cannot be
    // queried directly and the log is the only view of it.
    for (const [label, rows] of Object.entries(missingTranslations)) {
      if (rows.length) console.log(`[content-audit] ${label} missing a translation: ${rows.map((r) => r.slug).join(', ')}`);
    }
  } else {
    console.log(JSON.stringify(report, null, 2));
  }

  const translationFailures = Object.values(missingTranslations).flat().length;
  /* The resource floor is the size of the shipped manifest, so adding a
     document to the Library raises the bar automatically and no number here
     has to be maintained by hand. */
  const failed = published.services < 56 || published.insights < 20 || published.resources < LIBRARY_ASSETS.length ||
    published.tools < 14 || published.projects < 6 || published.caseStudies < 6 ||
    missingDownloads.length || missingAssetRecords.length || translationFailures ||
    brokenDownloads.length || danglingLinks.length || missingImages.length;
  if (failed) process.exitCode = 1;
}

main().catch((error) => {
  console.error('[content-audit] failed:', error);
  process.exitCode = 1;
}).finally(() => prisma.$disconnect());
