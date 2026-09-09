/** Launch-readiness audit for the database-backed public catalogue. */
import 'dotenv/config';
import { existsSync } from 'node:fs';
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

  const imageCounts = {
    services: await prisma.service.count({ where: { status: 'PUBLISHED', featuredImage: { not: null } } }),
    insights: await prisma.insight.count({ where: { status: 'PUBLISHED', coverImage: { not: null } } }),
    resources: await prisma.resource.count({ where: { status: 'PUBLISHED', thumbnail: { not: null } } }),
    tools: await prisma.tool.count({ where: { status: 'PUBLISHED', thumbnail: { not: null } } }),
    projects: await prisma.project.count({ where: { status: 'PUBLISHED', heroMediaUrl: { not: null } } }),
    caseStudies: await prisma.caseStudy.count({ where: { status: 'PUBLISHED', heroMediaUrl: { not: null } } }),
  };
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
        `missingDownloads=${missingDownloads.length} drafts=${drafts.length}`,
    );
  } else {
    console.log(JSON.stringify(report, null, 2));
  }

  const translationFailures = Object.values(missingTranslations).flat().length;
  const failed = published.services < 56 || published.insights < 20 || published.resources < 60 || published.tools < 14 ||
    published.projects < 6 || published.caseStudies < 6 || missingDownloads.length || missingAssetRecords.length || translationFailures;
  if (failed) process.exitCode = 1;
}

main().catch((error) => {
  console.error('[content-audit] failed:', error);
  process.exitCode = 1;
}).finally(() => prisma.$disconnect());
