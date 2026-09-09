/**
 * Builds the render manifest for the Library documents.
 *
 * Mirrors `build-visual-manifest.mjs`: the editorial content stays in one
 * place, a manifest is derived from it, and the renderer consumes only the
 * manifest. Nothing here invents content — every string comes from the
 * catalogue module or the row the catalogue created, so a document can only
 * ever say what the Library already says about it.
 *
 *     node scripts/build-library-doc-manifest.mjs
 */
import 'dotenv/config';
import { writeFileSync } from 'node:fs';
import path from 'node:path';
import { PrismaClient } from '@prisma/client';
import { RESOURCE_DEPTH, NEW_RESOURCES } from './content/library.mjs';

const prisma = new PrismaClient();
const OUT = path.resolve(process.cwd(), 'scripts/library-doc-manifest.json');

/** Extension and renderer per catalogue type. */
const KIND = { EXCEL: 'xlsx', WORD: 'docx', PDF: 'pdf' };

const depthBySlug = new Map(
  [...RESOURCE_DEPTH, ...NEW_RESOURCES].map((entry) => [entry.slug, entry]),
);

async function main() {
  // The documents to render are exactly the published-catalogue rows that have
  // no file yet. Anything already carrying a file — bundled or uploaded in
  // Admin — is left alone.
  const rows = await prisma.resource.findMany({
    where: { fileKey: null, externalUrl: '' },
    select: { slug: true, titleEn: true, titleAr: true, summaryEn: true, summaryAr: true, type: true },
    orderBy: { slug: 'asc' },
  });

  const images = [];
  const skipped = [];

  for (const row of rows) {
    const depth = depthBySlug.get(row.slug);
    const kind = KIND[row.type];
    if (!depth || !kind) {
      skipped.push(`${row.slug} (${!kind ? `unsupported type ${row.type}` : 'no catalogue entry'})`);
      continue;
    }
    images.push({
      slug: row.slug,
      kind,
      file: `${row.slug}.${kind}`,
      titleEn: row.titleEn,
      titleAr: row.titleAr,
      summaryEn: row.summaryEn || '',
      summaryAr: row.summaryAr || '',
      descEn: depth.descEn || '',
      descAr: depth.descAr || '',
      // [en, ar] pairs — the sections of a document, the columns of a sheet.
      includes: depth.includes || [],
      audience: depth.audience || [],
    });
  }

  writeFileSync(OUT, `${JSON.stringify({ documents: images }, null, 2)}\n`);
  const byKind = images.reduce((acc, d) => ({ ...acc, [d.kind]: (acc[d.kind] || 0) + 1 }), {});
  console.log(`[library-doc-manifest] ${images.length} documents: ${JSON.stringify(byKind)}`);
  if (skipped.length) console.log(`[library-doc-manifest] skipped: ${skipped.join(', ')}`);
}

main()
  .catch((error) => {
    console.error('[library-doc-manifest] failed:', error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
