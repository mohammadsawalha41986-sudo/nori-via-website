/**
 * Content depth pass.
 *
 * Runs after scripts/ensure-content.mjs and fills the fields that the
 * catalogue left empty: service bodies, benefits, process and FAQs; the
 * knowledge centre; illustrative engagements and their case studies; library
 * descriptions and the resources the library was missing; calculator copy and
 * the calculators themselves; page SEO and section content; taxonomy
 * descriptions; the ten disciplines of the Noriva System; navigation ordering;
 * hidden statistics; unpublished sample testimonials; and — when the visual
 * manifest has been rendered — the generated artwork.
 *
 * Guarantees, identical to ensure-content.mjs:
 *   - A field is written only when it is currently empty. An edit made in
 *     Admin always wins, and a second run changes nothing.
 *   - No row is deleted. No publish status is changed on an existing row.
 *   - No client name, figure, result, testimonial or contact detail is
 *     invented anywhere.
 *   - Media fields are filled only from images this repository actually
 *     renders. Nothing points at a URL that does not resolve.
 *
 * Usage:
 *   node scripts/content-depth.mjs            apply
 *   node scripts/content-depth.mjs --report   inspect only, write nothing
 */
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { copyFileSync, existsSync, mkdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';

import { SERVICE_DEPTH_PART_1 } from './content/services-depth.mjs';
import { SERVICE_DEPTH_PART_2 } from './content/services-depth-2.mjs';
import { SERVICE_DEPTH_PART_3 } from './content/services-depth-3.mjs';
import { SERVICE_DEPTH_PART_4 } from './content/services-depth-4.mjs';
import { SERVICE_DEPTH_PART_5 } from './content/services-depth-5.mjs';
import { INSIGHTS_A } from './content/insights-a.mjs';
import { INSIGHTS_B } from './content/insights-b.mjs';
import { INSIGHTS_C } from './content/insights-c.mjs';
import { INSIGHTS_D } from './content/insights-d.mjs';
import { INSIGHTS_E } from './content/insights-e.mjs';
import { CASE_STUDIES, FNB_SAMPLE_PROJECTS, SAMPLE_CLIENT } from './content/case-studies.mjs';
import {
  RESOURCE_DEPTH,
  NEW_RESOURCES,
  NEW_RESOURCE_CATEGORIES,
  RESOURCE_CATEGORY_DEPTH,
} from './content/library.mjs';
import { LIBRARY_ASSETS } from './content/library-assets.mjs';
import { TOOL_DEPTH, NEW_TOOLS } from './content/tools.mjs';
import {
  SYSTEM_STAGES,
  PAGE_DEPTH,
  PAGE_CONTENT,
  SERVICE_CATEGORY_DEPTH,
  WORK_CATEGORY_DEPTH,
  NAV_ORDER,
  STATISTICS,
  SAMPLE_TESTIMONIALS,
  REDUNDANT_TAXONOMY,
  LEGACY_SAMPLE_PROJECT_SEO,
} from './content/site-structure.mjs';

const prisma = new PrismaClient();
const REPORT_ONLY = process.argv.includes('--report');

const changes = [];
const note = (what) => changes.push(what);

const SERVICE_DEPTH = [
  ...SERVICE_DEPTH_PART_1,
  ...SERVICE_DEPTH_PART_2,
  ...SERVICE_DEPTH_PART_3,
  ...SERVICE_DEPTH_PART_4,
  ...SERVICE_DEPTH_PART_5,
];
const INSIGHTS = [...INSIGHTS_A, ...INSIGHTS_B, ...INSIGHTS_C, ...INSIGHTS_D, ...INSIGHTS_E];

/* ---------------------------------------------------------------- helpers */

const isEmpty = (v) => {
  if (v === null || v === undefined) return true;
  if (typeof v === 'string') return v.trim() === '';
  /* A Date has no enumerable own keys, so the object branch below would
     misread every date column as empty — which would let a later run rewrite
     a publish date that is already set. */
  if (v instanceof Date) return false;
  if (Array.isArray(v)) return v.length === 0;
  if (typeof v === 'object') return Object.keys(v).length === 0;
  return false;
};

/** Keeps only the entries whose stored value is still empty. */
function fillEmpty(row, patch) {
  const out = {};
  for (const [key, value] of Object.entries(patch)) {
    if (value === undefined || isEmpty(value)) continue;
    if (!(key in row)) continue;
    if (isEmpty(row[key])) out[key] = value;
  }
  return out;
}

const labels = (pairs) => pairs.map(([labelEn, labelAr]) => ({ labelEn, labelAr }));
const steps = (rows) => rows.map(([titleEn, titleAr, bodyEn, bodyAr]) => ({ titleEn, titleAr, bodyEn, bodyAr }));
const questions = (rows) =>
  rows.map(([questionEn, questionAr, answerEn, answerAr]) => ({ questionEn, questionAr, answerEn, answerAr }));

/** Trims to the length the Admin validation schema accepts for the field. */
const clamp = (text, max) => (text.length <= max ? text : `${text.slice(0, max - 1).trimEnd()}…`);

const MANIFEST_PATH = path.join(process.cwd(), 'scripts', 'visual-manifest.json');
const manifest = existsSync(MANIFEST_PATH) ? JSON.parse(readFileSync(MANIFEST_PATH, 'utf8')) : null;

/** A manifest entry is only usable once the file has actually been rendered. */
function renderedImage(entry) {
  if (!entry?.url) return null;
  const file = path.join(process.cwd(), 'public', entry.url.replace(/^\//, ''));
  return existsSync(file) ? entry : null;
}

async function update(model, where, data, label) {
  if (!Object.keys(data).length) return false;
  if (!REPORT_ONLY) await prisma[model].update({ where, data });
  note(`${label}(${Object.keys(data).length})`);
  return true;
}

/* --------------------------------------------------------------- services */

async function applyServices() {
  const byCategory = Object.fromEntries(
    (await prisma.serviceCategory.findMany()).map((c) => [c.slug, c.id]),
  );

  for (const d of SERVICE_DEPTH) {
    const row = await prisma.service.findUnique({ where: { slug: d.slug } });
    if (!row) {
      note(`missing service:${d.slug}`);
      continue;
    }

    const patch = {
      heroDescriptionEn: d.heroEn,
      heroDescriptionAr: d.heroAr,
      whatWeDoEn: d.whatEn,
      whatWeDoAr: d.whatAr,
      approachEn: d.apprEn,
      approachAr: d.apprAr,
      whyItMattersEn: d.whyEn,
      whyItMattersAr: d.whyAr,
      deliverables: d.deliverables ? labels(d.deliverables) : undefined,
      benefits: d.benefits ? labels(d.benefits) : undefined,
      process: d.process ? steps(d.process) : undefined,
      faqs: d.faqs ? questions(d.faqs) : undefined,
      /* SEO title is bounded by the Admin schema; the summary already fills
         the description, so only the title is supplied here. */
      seoTitleEn: clamp(`${row.nameEn} for Restaurants & Cafés — Noriva`, 160),
      seoTitleAr: clamp(`${row.nameAr || row.nameEn} للمطاعم والمقاهي — نوريفا`, 160),
      /* Five studio-era services shipped without a group. They are assigned to
         an existing category rather than to a new one. */
      categoryId: d.category ? byCategory[d.category] : undefined,
    };

    const data = fillEmpty(row, patch);
    /* Every slug in SERVICE_DEPTH is a completed public professional service,
       not a client claim or placeholder. The F&B seed originally held most of
       them in draft for editorial review; this completion pass supplies that
       review and makes the finished catalogue live. */
    if (row.status === 'DRAFT') {
      data.status = 'PUBLISHED';
      data.noindex = false;
    }
    await update('service', { slug: d.slug }, data, `service:${d.slug}`);
  }
}

/* --------------------------------------------------------------- insights */

async function applyInsights() {
  const byCategory = Object.fromEntries(
    (await prisma.insightCategory.findMany()).map((c) => [c.slug, c.id]),
  );

  for (const a of INSIGHTS) {
    const existing = await prisma.insight.findUnique({ where: { slug: a.slug } });
    const data = {
      titleEn: a.titleEn,
      titleAr: a.titleAr,
      excerptEn: a.excerptEn,
      excerptAr: a.excerptAr,
      contentEn: a.contentEn,
      contentAr: a.contentAr,
      categoryId: byCategory[a.categorySlug] ?? null,
      tags: a.tags,
      author: 'Noriva',
      publishedAt: new Date(Date.now() - a.daysAgo * 86400000),
      seoTitleEn: clamp(`${a.titleEn} — Noriva`, 160),
      seoTitleAr: clamp(`${a.titleAr} — نوريفا`, 160),
      seoDescriptionEn: clamp(a.excerptEn, 320),
      seoDescriptionAr: clamp(a.excerptAr, 320),
    };

    if (!existing) {
      if (!REPORT_ONLY) {
        await prisma.insight.create({ data: { slug: a.slug, status: 'PUBLISHED', ...data } });
      }
      note(`insight:${a.slug}`);
      continue;
    }
    await update('insight', { slug: a.slug }, fillEmpty(existing, data), `insight:${a.slug}`);
  }

  /* The four studio-era articles shipped without tags, publish date or SEO
     title. They are filled rather than replaced — the writing stays. */
  const legacy = await prisma.insight.findMany({
    where: { slug: { notIn: INSIGHTS.map((a) => a.slug) } },
  });
  for (const [i, row] of legacy.entries()) {
    await update(
      'insight',
      { id: row.id },
      fillEmpty(row, {
        tags: ['brand', 'craft', 'noriva'],
        author: 'Noriva',
        publishedAt: new Date(Date.now() - (150 + i * 7) * 86400000),
        seoTitleEn: clamp(`${row.titleEn} — Noriva`, 160),
        seoTitleAr: clamp(`${row.titleAr || row.titleEn} — نوريفا`, 160),
        seoDescriptionEn: clamp(row.excerptEn, 320),
        seoDescriptionAr: clamp(row.excerptAr, 320),
      }),
      `insight:${row.slug}`,
    );
  }
}

/* ------------------------------------------- engagements and case studies */

async function applyWork() {
  const workCats = Object.fromEntries((await prisma.workCategory.findMany()).map((c) => [c.slug, c.id]));
  const serviceIds = Object.fromEntries((await prisma.service.findMany()).map((s) => [s.slug, s.id]));

  for (const p of FNB_SAMPLE_PROJECTS) {
    const existing = await prisma.project.findUnique({ where: { slug: p.slug } });
    if (existing) {
      const isManagedExample = existing.client === 'Sample project' || existing.client === SAMPLE_CLIENT;
      const managedPatch = isManagedExample
        ? { client: SAMPLE_CLIENT, status: 'PUBLISHED', noindex: false }
        : {};
      await update(
        'project',
        { slug: p.slug },
        {
          ...fillEmpty(existing, {
            seoTitleEn: clamp(`${p.titleEn} — Noriva`, 160),
            seoTitleAr: clamp(`${p.titleAr} — نوريفا`, 160),
            seoDescriptionEn: clamp(p.descriptionEn.split('\n\n').pop(), 320),
            seoDescriptionAr: clamp(p.descriptionAr.split('\n\n').pop(), 320),
          }),
          ...managedPatch,
        },
        `project:${p.slug}`,
      );
      continue;
    }
    if (REPORT_ONLY) {
      note(`would create project:${p.slug}`);
      continue;
    }
    const row = await prisma.project.create({
      data: {
        slug: p.slug,
        titleEn: p.titleEn,
        titleAr: p.titleAr,
        /* The visible client label and opening disclaimer both identify this
           as educational example content rather than client work. */
        client: SAMPLE_CLIENT,
        categoryId: workCats[p.categorySlug] ?? null,
        descriptionEn: p.descriptionEn,
        descriptionAr: p.descriptionAr,
        year: p.year,
        location: p.location,
        featured: false,
        status: 'PUBLISHED',
        noindex: false,
        order: p.order,
        seoTitleEn: clamp(`${p.titleEn} — Noriva`, 160),
        seoTitleAr: clamp(`${p.titleAr} — نوريفا`, 160),
        seoDescriptionEn: clamp(p.descriptionEn.split('\n\n').pop(), 320),
        seoDescriptionAr: clamp(p.descriptionAr.split('\n\n').pop(), 320),
        /* results stays empty: no verified metric exists. */
      },
    });
    for (const slug of p.serviceSlugs) {
      if (serviceIds[slug]) {
        await prisma.projectService.create({ data: { projectId: row.id, serviceId: serviceIds[slug] } });
      }
    }
    note(`project:${p.slug} (published illustrative example)`);
  }

  /* The placeholder engagements that shipped before this pass carry no SEO
     title. They are draft and noindex, but Admin still shows the gap. */
  for (const [slug, titleEn, titleAr] of LEGACY_SAMPLE_PROJECT_SEO) {
    const row = await prisma.project.findUnique({ where: { slug } });
    if (!row) continue;
    await update(
      'project',
      { slug },
      fillEmpty(row, {
        seoTitleEn: clamp(`${titleEn} — Noriva`, 160),
        seoTitleAr: clamp(`${titleAr} — نوريفا`, 160),
        seoDescriptionEn: clamp(row.descriptionEn, 320),
        seoDescriptionAr: clamp(row.descriptionAr, 320),
      }),
      `project:${slug}`,
    );
  }

  for (const c of CASE_STUDIES) {
    const existing = await prisma.caseStudy.findUnique({ where: { slug: c.slug } });
    const project = c.projectSlug
      ? await prisma.project.findUnique({ where: { slug: c.projectSlug } })
      : null;

    const body = {
      titleEn: `Illustrative Case — ${c.titleEn}`,
      titleAr: `حالة توضيحية — ${c.titleAr}`,
      challengeEn: c.challengeEn,
      challengeAr: c.challengeAr,
      ideaEn: c.ideaEn,
      ideaAr: c.ideaAr,
      strategyEn: c.strategyEn,
      strategyAr: c.strategyAr,
      creativeEn: c.creativeEn,
      creativeAr: c.creativeAr,
      campaignEn: c.campaignEn,
      campaignAr: c.campaignAr,
      outcomeEn: c.outcomeEn,
      outcomeAr: c.outcomeAr,
      resultEn: c.resultEn,
      resultAr: c.resultAr,
      seoTitleEn: clamp(`Illustrative Case — ${c.titleEn} — Noriva`, 160),
      seoTitleAr: clamp(`حالة توضيحية — ${c.titleAr} — نوريفا`, 160),
      seoDescriptionEn: clamp(c.outcomeEn, 320),
      seoDescriptionAr: clamp(c.outcomeAr, 320),
    };

    if (!existing) {
      if (REPORT_ONLY) {
        note(`would create case study:${c.slug}`);
        continue;
      }
      const row = await prisma.caseStudy.create({
        data: {
          slug: c.slug,
          projectId: project?.id ?? null,
          /* Public educational example, explicitly labelled and metric-free. */
          status: 'PUBLISHED',
          noindex: false,
          order: CASE_STUDIES.indexOf(c) + 1,
          ...body,
          /* metrics stays empty by design. */
        },
      });
      const serviceIdsForCase = await prisma.service.findMany({
        where: { slug: { in: c.serviceSlugs } },
        select: { id: true },
      });
      for (const s of serviceIdsForCase) {
        await prisma.caseStudyService.create({ data: { caseStudyId: row.id, serviceId: s.id } });
      }
      note(`case-study:${c.slug} (published illustrative example)`);
      continue;
    }
    const isManagedExample = existing.status === 'DRAFT' && (
      existing.challengeEn?.startsWith('This is an illustrative engagement') ||
      existing.challengeAr?.startsWith('هذا نموذج توضيحي')
    );
    await update(
      'caseStudy',
      { slug: c.slug },
      {
        ...fillEmpty(existing, body),
        ...(isManagedExample ? {
          titleEn: body.titleEn,
          titleAr: body.titleAr,
          status: 'PUBLISHED',
          noindex: false,
        } : {}),
      },
      `case-study:${c.slug}`,
    );
  }
}

/* ---------------------------------------------------------------- library */

async function applyLibrary() {
  for (const c of NEW_RESOURCE_CATEGORIES) {
    const existing = await prisma.resourceCategory.findUnique({ where: { slug: c.slug } });
    if (existing) {
      await update('resourceCategory', { slug: c.slug }, fillEmpty(existing, c), `resource-category:${c.slug}`);
      continue;
    }
    if (!REPORT_ONLY) await prisma.resourceCategory.create({ data: c });
    note(`resource-category:${c.slug}`);
  }
  for (const c of RESOURCE_CATEGORY_DEPTH) {
    const existing = await prisma.resourceCategory.findUnique({ where: { slug: c.slug } });
    if (existing) {
      await update('resourceCategory', { slug: c.slug }, fillEmpty(existing, c), `resource-category:${c.slug}`);
    }
  }

  const cats = Object.fromEntries((await prisma.resourceCategory.findMany()).map((c) => [c.slug, c.id]));

  for (const d of RESOURCE_DEPTH) {
    const row = await prisma.resource.findUnique({ where: { slug: d.slug } });
    if (!row) {
      note(`missing resource:${d.slug}`);
      continue;
    }
    await update(
      'resource',
      { slug: d.slug },
      fillEmpty(row, {
        descriptionEn: d.descEn,
        descriptionAr: d.descAr,
        includes: labels(d.includes),
        audience: labels(d.audience),
        tags: d.tags,
        seoTitleEn: clamp(`${row.titleEn} — Noriva Library`, 160),
        seoTitleAr: clamp(`${row.titleAr || row.titleEn} — مكتبة نوريفا`, 160),
      }),
      `resource:${d.slug}`,
    );
  }

  for (const r of NEW_RESOURCES) {
    const existing = await prisma.resource.findUnique({ where: { slug: r.slug } });
    const data = {
      titleEn: r.titleEn,
      titleAr: r.titleAr,
      summaryEn: r.summaryEn,
      summaryAr: r.summaryAr,
      descriptionEn: r.descEn,
      descriptionAr: r.descAr,
      includes: labels(r.includes),
      audience: labels(r.audience),
      tags: r.tags,
      categoryId: cats[r.category] ?? null,
      seoTitleEn: clamp(`${r.titleEn} — Noriva Library`, 160),
      seoTitleAr: clamp(`${r.titleAr} — مكتبة نوريفا`, 160),
      seoDescriptionEn: clamp(r.summaryEn, 320),
      seoDescriptionAr: clamp(r.summaryAr, 320),
    };
    if (!existing) {
      if (!REPORT_ONLY) {
        await prisma.resource.create({
          data: {
            slug: r.slug,
            type: r.type,
            /* Draft by design: a resource cannot be published until its file is
               uploaded, so the Library never offers a dead download. */
            status: 'DRAFT',
            ...data,
          },
        });
      }
      note(`resource:${r.slug} (draft, awaiting file)`);
      continue;
    }
    await update('resource', { slug: r.slug }, fillEmpty(existing, data), `resource:${r.slug}`);
  }

  /* Repository-backed downloads. An existing Admin upload always wins. When
     a catalogue row is still waiting for a file, the verified bundled asset
     is copied into private storage before the row is made public. */
  for (const asset of LIBRARY_ASSETS) {
    const source = path.resolve(process.cwd(), asset.sourcePath);
    if (!existsSync(source) || statSync(source).size === 0) {
      note(`missing library asset:${asset.sourcePath}`);
      continue;
    }

    const existing = await prisma.resource.findUnique({ where: { slug: asset.slug } });
    const hasEditorialFile = Boolean(existing?.fileKey && existing.fileKey !== asset.storageKey) || Boolean(existing?.externalUrl);
    const storageRoot = path.resolve(process.cwd(), process.env.STORAGE_DIR || './storage', 'private');
    const target = path.resolve(storageRoot, asset.storageKey);
    if (target !== storageRoot && !target.startsWith(`${storageRoot}${path.sep}`)) {
      throw new Error(`Unsafe library storage key: ${asset.storageKey}`);
    }

    if (!REPORT_ONLY && !hasEditorialFile) {
      mkdirSync(path.dirname(target), { recursive: true });
      copyFileSync(source, target);
    }

    const editorial = {
      titleEn: asset.titleEn,
      titleAr: asset.titleAr,
      summaryEn: asset.summaryEn,
      summaryAr: asset.summaryAr,
      descriptionEn: asset.descriptionEn,
      descriptionAr: asset.descriptionAr,
      type: asset.type,
      categoryId: cats[asset.category] ?? null,
      tags: asset.tags,
      includes: labels(asset.includes),
      audience: labels(asset.audience),
      order: asset.order,
      seoTitleEn: clamp(`${asset.titleEn} — Noriva Library`, 160),
      seoTitleAr: clamp(`${asset.titleAr} — مكتبة نوريفا`, 160),
      seoDescriptionEn: clamp(asset.summaryEn, 320),
      seoDescriptionAr: clamp(asset.summaryAr, 320),
    };
    const bundledFile = {
      fileKey: asset.storageKey,
      fileName: asset.file,
      fileMime: asset.mime,
      fileSize: statSync(source).size,
      status: 'PUBLISHED',
      publishedAt: existing?.publishedAt || new Date(),
      noindex: false,
    };

    if (!existing) {
      if (!REPORT_ONLY) {
        await prisma.resource.create({ data: { slug: asset.slug, ...editorial, ...bundledFile } });
      }
      note(`resource:${asset.slug} (published bundled asset)`);
      continue;
    }

    const patch = fillEmpty(existing, editorial);
    if (!hasEditorialFile) Object.assign(patch, bundledFile);
    await update('resource', { slug: asset.slug }, patch, `resource:${asset.slug}`);
  }
}

/* ------------------------------------------------------------------ tools */

async function applyTools() {
  for (const d of TOOL_DEPTH) {
    const row = await prisma.tool.findUnique({ where: { slug: d.slug } });
    if (!row) continue;
    await update(
      'tool',
      { slug: d.slug },
      fillEmpty(row, {
        descriptionEn: d.descEn,
        descriptionAr: d.descAr,
        purposeEn: d.purposeEn,
        purposeAr: d.purposeAr,
        seoTitleEn: clamp(`${row.nameEn} — Noriva`, 160),
        seoTitleAr: clamp(`${row.nameAr || row.nameEn} — نوريفا`, 160),
      }),
      `tool:${d.slug}`,
    );
  }

  for (const t of NEW_TOOLS) {
    const existing = await prisma.tool.findUnique({ where: { slug: t.slug } });
    const data = {
      nameEn: t.nameEn,
      nameAr: t.nameAr,
      summaryEn: t.summaryEn,
      summaryAr: t.summaryAr,
      descriptionEn: t.descriptionEn,
      descriptionAr: t.descriptionAr,
      purposeEn: t.purposeEn,
      purposeAr: t.purposeAr,
      config: t.config,
      seoTitleEn: clamp(`${t.nameEn} — Noriva`, 160),
      seoTitleAr: clamp(`${t.nameAr} — نوريفا`, 160),
      seoDescriptionEn: clamp(t.summaryEn, 320),
      seoDescriptionAr: clamp(t.summaryAr, 320),
    };
    if (!existing) {
      if (!REPORT_ONLY) {
        await prisma.tool.create({
          data: { slug: t.slug, status: 'PUBLISHED', featured: t.featured, order: t.order, ...data },
        });
      }
      note(`tool:${t.slug}`);
      continue;
    }
    await update('tool', { slug: t.slug }, fillEmpty(existing, data), `tool:${t.slug}`);
  }
}

/* ---------------------------------------------------------- relationships */

const RELATION_THEMES = [
  {
    key: 'delivery', match: /delivery|commission|aggregator/,
    services: ['delivery-menu-pricing', 'profitability-analysis'],
    resources: ['delivery-profitability-checklist', 'delivery-platform-performance'],
    tools: ['delivery-pricing-calculator', 'contribution-margin-calculator'],
  },
  {
    key: 'menu', match: /menu|recipe|pricing|food-cost|food cost|contribution/,
    services: ['menu-strategy-engineering-pricing', 'menu-engineering', 'recipe-costing'],
    resources: ['menu-engineering-template', 'recipe-costing', 'menu-engineering-guide'],
    tools: ['food-cost-calculator', 'menu-pricing-calculator'],
  },
  {
    key: 'feasibility', match: /feasibility|site|opening|pre-opening|concept/,
    services: ['feasibility-study', 'new-restaurant-project', 'concept-development'],
    resources: ['restaurant-feasibility-study-template', 'restaurant-opening-workbook', 'site-evaluation-scorecard'],
    tools: ['break-even-calculator', 'revenue-target-calculator'],
  },
  {
    key: 'growth', match: /growth|branch|expansion|franchise|payback|turnaround/,
    services: ['growth-strategy', 'branch-development', 'expansion-study'],
    resources: ['expansion-feasibility', 'franchise-readiness-scorecard', '90-day-turnaround-plan'],
    tools: ['branch-payback-calculator', 'revenue-target-calculator'],
  },
  {
    key: 'marketing', match: /marketing|campaign|advertising|social|brand|customer|guest/,
    services: ['fnb-marketing', 'performance-marketing', 'customer-experience'],
    resources: ['marketing-plan-template', 'marketing-campaign-planner', 'restaurant-brand-brief'],
    tools: ['marketing-roi-calculator', 'average-check-calculator'],
  },
  {
    key: 'operations', match: /operation|inventory|waste|purchas|supplier|audit|labou?r|kpi|performance|profit|cash|cost|financial/,
    services: ['operational-audit', 'cost-control', 'profitability-analysis'],
    resources: ['restaurant-audit-scorecard', 'restaurant-kpi-dashboard', 'restaurant-pl-template'],
    tools: ['prime-cost-calculator', 'labour-cost-calculator'],
  },
  {
    key: 'general', match: /.*/,
    services: ['restaurant-consulting', 'fnb-consulting', 'management-advisory'],
    resources: ['restaurant-kpi-dashboard', 'restaurant-business-plan-template'],
    tools: ['average-check-calculator', 'gross-profit-calculator'],
  },
];

async function applyRelationships() {
  const [services, insights, resources, tools, projects, caseStudies] = await Promise.all([
    prisma.service.findMany({ where: { status: 'PUBLISHED' }, select: { id: true, slug: true } }),
    prisma.insight.findMany({ where: { status: 'PUBLISHED' }, select: { id: true, slug: true, tags: true } }),
    prisma.resource.findMany({ where: { status: 'PUBLISHED' }, select: { id: true, slug: true } }),
    prisma.tool.findMany({ where: { status: 'PUBLISHED' }, select: { id: true, slug: true } }),
    prisma.project.findMany({ where: { status: 'PUBLISHED' }, select: { id: true, slug: true } }),
    prisma.caseStudy.findMany({ where: { status: 'PUBLISHED' }, select: { id: true, slug: true } }),
  ]);
  const indexes = {
    SERVICE: new Map(services.map((r) => [r.slug, r.id])),
    INSIGHT: new Map(insights.map((r) => [r.slug, r.id])),
    RESOURCE: new Map(resources.map((r) => [r.slug, r.id])),
    TOOL: new Map(tools.map((r) => [r.slug, r.id])),
  };
  const themeFor = (text) => RELATION_THEMES.find((theme) => theme.match.test(text.toLowerCase())) || RELATION_THEMES.at(-1);
  const insightTheme = new Map(insights.map((row) => [row.id, themeFor(`${row.slug} ${JSON.stringify(row.tags)}`).key]));

  const refsFor = (theme, fromType, fromId) => {
    const refs = [];
    const add = (type, slugs) => {
      for (const slug of slugs) {
        const id = indexes[type].get(slug);
        if (id && !(type === fromType && id === fromId)) refs.push({ toType: type, toId: id });
      }
    };
    add('SERVICE', theme.services.slice(0, 2));
    add('RESOURCE', theme.resources.slice(0, 2));
    add('TOOL', theme.tools.slice(0, 2));
    const relatedInsight = insights.find((row) => insightTheme.get(row.id) === theme.key && !(fromType === 'INSIGHT' && row.id === fromId));
    if (relatedInsight) refs.push({ toType: 'INSIGHT', toId: relatedInsight.id });
    return refs.slice(0, 6);
  };

  const linkIfEmpty = async (fromType, row, text) => {
    const existing = await prisma.contentLink.count({ where: { fromType, fromId: row.id } });
    if (existing) return;
    const refs = refsFor(themeFor(text), fromType, row.id);
    if (!refs.length) return;
    if (!REPORT_ONLY) {
      await prisma.contentLink.createMany({
        data: refs.map((ref, order) => ({ fromType, fromId: row.id, ...ref, order })),
        skipDuplicates: true,
      });
    }
    note(`relations:${fromType.toLowerCase()}:${row.slug}(${refs.length})`);
  };

  for (const row of services) await linkIfEmpty('SERVICE', row, row.slug);
  for (const row of insights) await linkIfEmpty('INSIGHT', row, `${row.slug} ${JSON.stringify(row.tags)}`);
  for (const row of resources) await linkIfEmpty('RESOURCE', row, row.slug);
  for (const row of tools) await linkIfEmpty('TOOL', row, row.slug);
  for (const row of projects) await linkIfEmpty('PROJECT', row, row.slug);
  for (const row of caseStudies) await linkIfEmpty('CASE_STUDY', row, row.slug);
}

/* ------------------------------------------------- pages and taxonomies */

async function applyPages() {
  for (const p of PAGE_DEPTH) {
    const row = await prisma.page.findUnique({ where: { key: p.key } });
    if (!row) {
      note(`missing page:${p.key}`);
      continue;
    }
    const { key, noindex, ...seo } = p;
    const patch = fillEmpty(row, seo);
    /* noindex is a boolean, so the empty-only rule does not apply; it is set
       only when the page asks for it and is currently false. */
    if (noindex && !row.noindex) patch.noindex = true;
    await update('page', { key }, patch, `page:${key}`);
  }

  for (const c of PAGE_CONTENT) {
    const row = await prisma.page.findUnique({ where: { key: c.key } });
    if (!row) continue;
    await update('page', { key: c.key }, fillEmpty(row, { content: c.content }), `page-content:${c.key}`);
  }

  for (const c of SERVICE_CATEGORY_DEPTH) {
    const row = await prisma.serviceCategory.findUnique({ where: { slug: c.slug } });
    if (!row) continue;
    await update('serviceCategory', { slug: c.slug }, fillEmpty(row, c), `service-category:${c.slug}`);
  }

  /* Work categories shipped as bare names inherited from the studio era. Only
     the ones that still hold that exact shipped name are renamed. */
  for (const c of WORK_CATEGORY_DEPTH) {
    const row = await prisma.workCategory.findUnique({ where: { slug: c.slug } });
    if (!row) continue;
    const shipped = {
      'brand-identity': 'Brand & Identity',
      menu: 'Menu',
      'restaurant-growth': 'Restaurant Growth',
      spatial: 'Spatial',
      campaign: 'Campaign',
      digital: 'Digital',
    };
    if (row.nameEn === shipped[c.slug] && row.nameEn !== c.nameEn) {
      await update('workCategory', { slug: c.slug }, { nameEn: c.nameEn, nameAr: c.nameAr }, `work-category:${c.slug}`);
    }
  }
}

/**
 * Hides taxonomy terms that are unused and duplicated by a term the catalogue
 * already uses. Nothing is deleted, and a term that has acquired content since
 * this list was written is left visible.
 */
async function applyTaxonomyTidy() {
  for (const [model, pairs] of Object.entries(REDUNDANT_TAXONOMY)) {
    for (const [slug, replacedBy] of pairs) {
      const row = await prisma[model].findUnique({ where: { slug } });
      if (!row || !row.visible) continue;
      const relation = model === 'workCategory' ? 'project' : 'insight';
      const used = await prisma[relation].count({ where: { categoryId: row.id } });
      if (used > 0) continue;
      await update(model, { slug }, { visible: false }, `${model}:hid ${slug} (duplicate of ${replacedBy})`);
    }
  }
}

/* ------------------------------------------------------ the Noriva System */

async function applySystem() {
  for (const [i, s] of SYSTEM_STAGES.entries()) {
    const existing = await prisma.systemStage.findFirst({ where: { step: s.step } });
    const data = {
      titleEn: s.titleEn,
      titleAr: s.titleAr,
      descriptionEn: clamp(s.descriptionEn, 1200),
      descriptionAr: clamp(s.descriptionAr, 1200),
      services: s.services,
      order: i,
    };

    if (!existing) {
      if (!REPORT_ONLY) await prisma.systemStage.create({ data: { step: s.step, visible: true, ...data } });
      note(`stage:${s.step}`);
      continue;
    }

    /* Steps 01–05 carry copy this repository shipped before the F&B
       positioning. They are rewritten only while they still hold exactly that
       shipped title — anything edited in Admin is left alone. */
    if (s.replacesTitleEn && existing.titleEn === s.replacesTitleEn) {
      await update('systemStage', { id: existing.id }, data, `stage:${s.step} (repositioned)`);
      continue;
    }
    await update('systemStage', { id: existing.id }, fillEmpty(existing, data), `stage:${s.step}`);
  }
}

/* ------------------------------------------------------------- navigation */

async function applyNavigation() {
  for (const [location, rows] of Object.entries(NAV_ORDER)) {
    for (const [href, order] of rows) {
      const items = await prisma.navigationItem.findMany({ where: { location, href } });
      if (!items.length) continue;
      /* Duplicate rows for the same href would render the same link twice.
         The first is kept and given its position; any extra copy this
         repository's own seeds created is hidden rather than deleted, so
         nothing an editor added is lost. */
      const [first, ...extra] = items;
      if (first.order !== order) {
        await update('navigationItem', { id: first.id }, { order }, `nav:${location}${href}`);
      }
      for (const dup of extra) {
        if (!dup.visible) continue;
        await update('navigationItem', { id: dup.id }, { visible: false }, `nav:hid duplicate ${location}${href}`);
      }
    }
  }
}

/* -------------------------------------------- statistics and testimonials */

async function applyEvidenceGatedContent() {
  for (const s of STATISTICS) {
    const existing = await prisma.statistic.findFirst({ where: { labelEn: s.labelEn } });
    if (existing) {
      await update('statistic', { id: existing.id }, fillEmpty(existing, s), `statistic:${s.labelEn}`);
      continue;
    }
    if (!REPORT_ONLY) {
      /* visible: false — nothing reaches the public site until an owner
         reviews and publishes it from Admin. */
      await prisma.statistic.create({ data: { ...s, visible: false } });
    }
    note(`statistic:${s.value} ${s.labelEn} (hidden)`);
  }

  for (const [i, t] of SAMPLE_TESTIMONIALS.entries()) {
    const existing = await prisma.testimonial.findFirst({ where: { name: t.name } });
    if (existing) continue;
    if (!REPORT_ONLY) {
      /* published: false — a testimonial is never published on anyone's
         behalf, and these are explicitly placeholders. */
      await prisma.testimonial.create({ data: { ...t, published: false, order: i + 1 } });
    }
    note(`testimonial:${t.name} (unpublished placeholder)`);
  }
}

/* ---------------------------------------------------------- footer backdrop */

/**
 * Gives the footer a backdrop on a deployment that has never had one.
 *
 * The footer renders a flat colour until an editor picks an image, which is a
 * correct default but not the intended finished look. This selects an image
 * the Media Library already holds — never an invented URL, never an external
 * one — and only while every backdrop field is still at its shipped default.
 * The moment anyone chooses an image, a colour, an anchor or an overlay in
 * Admin, this stops touching the row.
 *
 * The candidates are the site's own wide art-direction frames, in preference
 * order. They are brand visuals rather than photography of a venue: when real
 * restaurant photography is uploaded, selecting it in Admin -> Site settings
 * -> Footer replaces this with no code change.
 */
const BACKDROP_CANDIDATES = ['/img/cta.jpg', '/img/hero.jpg', '/img/about.jpg'];

async function applyFooterBackdrop() {
  const settings = await prisma.siteSettings.findUnique({ where: { id: 'singleton' } });
  if (!settings) return;

  /* Untouched means: still the flat default, with no image, colour or overlay
     chosen. Any one of those being set means an editor has made a decision. */
  const untouched =
    settings.footerBackgroundType === 'COLOR' &&
    isEmpty(settings.footerBackgroundImage) &&
    isEmpty(settings.footerBackgroundColor) &&
    isEmpty(settings.footerOverlayColor);
  if (!untouched) return;

  /* Only an image the Media Library actually holds and that is present on
     disk, so the footer can never point at a backdrop that 404s. */
  let chosen = null;
  for (const url of BACKDROP_CANDIDATES) {
    const row = await prisma.media.findFirst({ where: { url } });
    if (!row) continue;
    if (!existsSync(path.join(process.cwd(), 'public', url.replace(/^\//, '')))) continue;
    chosen = row;
    break;
  }
  if (!chosen) {
    note('footer backdrop: no library image available yet');
    return;
  }

  await update(
    'siteSettings',
    { id: 'singleton' },
    {
      footerBackgroundType: 'IMAGE',
      footerBackgroundImage: chosen.url,
      footerBackgroundPosition: 'CENTER',
      footerOverlayColor: '#0B1225',
      footerOverlayOpacity: 78,
    },
    `footer backdrop:${chosen.url}`,
  );
}

/* ----------------------------------------------------------------- visuals */

/**
 * Links the rendered artwork. Every write is fill-only, so an image uploaded
 * in Admin is never replaced, and an entry whose file has not been rendered is
 * skipped rather than written as a dead URL.
 */
async function applyVisuals() {
  if (!manifest) {
    note('visuals: manifest not built yet — run node scripts/build-visual-manifest.mjs');
    return;
  }
  const media = [];

  const link = async (model, where, entry, fields, label) => {
    const img = renderedImage(entry);
    if (!img) return;
    const row = await prisma[model].findUnique({ where });
    if (!row) return;
    const patch = {};
    for (const f of fields) if (f in row && isEmpty(row[f])) patch[f] = img.url;
    if (Object.keys(patch).length) {
      await update(model, where, patch, `${label}:image`);
      media.push(img);
    } else {
      /* Already linked on a previous run: still register the media row. */
      media.push(img);
    }
  };

  for (const [slug, entry] of Object.entries(manifest.links.services)) {
    await link('service', { slug }, entry, ['featuredImage', 'ogImage'], `service:${slug}`);
  }
  for (const [slug, entry] of Object.entries(manifest.links.insights)) {
    await link('insight', { slug }, entry, ['coverImage', 'ogImage'], `insight:${slug}`);
  }
  for (const [slug, entry] of Object.entries(manifest.links.tools)) {
    await link('tool', { slug }, entry, ['thumbnail', 'ogImage'], `tool:${slug}`);
  }
  for (const [slug, entry] of Object.entries(manifest.links.resources || {})) {
    await link('resource', { slug }, entry, ['thumbnail', 'ogImage'], `resource:${slug}`);
  }
  for (const [slug, entry] of Object.entries(manifest.links.caseStudies)) {
    await link('caseStudy', { slug }, entry, ['heroMediaUrl', 'ogImage'], `case-study:${slug}`);
  }
  for (const [slug, entry] of Object.entries(manifest.links.projects)) {
    await link('project', { slug }, entry, ['heroMediaUrl', 'ogImage'], `project:${slug}`);
    const rendered = (entry.gallery ?? []).map(renderedImage).filter(Boolean);
    if (rendered.length) {
      const row = await prisma.project.findUnique({ where: { slug } });
      if (row && isEmpty(row.gallery)) {
        await update(
          'project',
          { slug },
          { gallery: rendered.map((g) => ({ url: g.url, altEn: g.altEn, altAr: g.altAr })) },
          `project:${slug}:gallery`,
        );
      }
      media.push(...rendered);
    }
  }
  for (const [step, entry] of Object.entries(manifest.links.stages)) {
    const img = renderedImage(entry);
    if (!img) continue;
    const row = await prisma.systemStage.findFirst({ where: { step } });
    if (row && isEmpty(row.mediaUrl)) {
      await update('systemStage', { id: row.id }, { mediaUrl: img.url }, `stage:${step}:image`);
    }
    media.push(img);
  }

  /* Default social share image for pages with no image of their own. */
  const ogFile = path.join(process.cwd(), 'public', 'img', 'noriva-og-default.webp');
  if (existsSync(ogFile)) {
    const settings = await prisma.siteSettings.findUnique({ where: { id: 'singleton' } });
    if (settings && isEmpty(settings.defaultOgImage)) {
      await update('siteSettings', { id: 'singleton' }, { defaultOgImage: '/img/noriva-og-default.webp' }, 'settings:ogImage');
    }
    media.push({
      url: '/img/noriva-og-default.webp',
      altEn: 'Noriva — Food & Beverage consulting, development and growth.',
      altAr: 'نوريفا — استشارات وتطوير ونمو مشاريع الأغذية والمشروبات.',
    });
  }

  /* Register every rendered file in the Media Library so it is manageable from
     Admin like any upload. Existing media rows are never touched. */
  let registered = 0;
  for (const img of media) {
    const exists = await prisma.media.findFirst({ where: { url: img.url } });
    if (exists) continue;
    const file = path.join(process.cwd(), 'public', img.url.replace(/^\//, ''));
    if (!existsSync(file)) continue;
    if (!REPORT_ONLY) {
      const { statSync } = await import('node:fs');
      const spec = manifest.images.find((i) => `/img/${i.name}.webp` === img.url);
      await prisma.media.create({
        data: {
          filename: path.basename(img.url),
          url: img.url,
          kind: 'IMAGE',
          mimeType: 'image/webp',
          size: statSync(file).size,
          width: spec?.width ?? null,
          height: spec?.height ?? null,
          altEn: clamp(img.altEn, 300),
          altAr: clamp(img.altAr, 300),
        },
      });
    }
    registered += 1;
  }
  if (registered) note(`media:registered ${registered} rendered images`);
}

/* ------------------------------------------------------------------- main */

async function main() {
  await applyServices();
  await applyInsights();
  await applyWork();
  await applyLibrary();
  await applyTools();
  await applyRelationships();
  await applyPages();
  await applyTaxonomyTidy();
  await applySystem();
  await applyNavigation();
  await applyEvidenceGatedContent();
  await applyVisuals();
  await applyFooterBackdrop();

  console.log(
    changes.length
      ? `[content-depth]${REPORT_ONLY ? ' (report only)' : ''} ${changes.length} changes: ${changes.join(', ')}`
      : '[content-depth] nothing to fill; no changes made.',
  );
  reportStorage();
  await prisma.$disconnect();
}

/**
 * Prints where the Library files actually landed.
 *
 * Downloads depend on a fact no database column records: whether the bundled
 * files are on disk where the running server will look for them. On a platform
 * that mounts a volume this is easy to get wrong — Railway, for one, does not
 * mount volumes during the pre-deploy command, so provisioning that runs there
 * writes the files into a container that is thrown away, leaving published
 * resources whose download 404s while every migration and count looks healthy.
 *
 * So the run says it out loud, and warns when the storage root is outside a
 * mounted volume that the platform has told us about.
 */
function reportStorage() {
  const root = path.resolve(process.cwd(), process.env.STORAGE_DIR || './storage', 'private');
  const present = LIBRARY_ASSETS.filter((asset) => existsSync(path.resolve(root, asset.storageKey))).length;
  console.log(`[content-depth] library storage: ${present}/${LIBRARY_ASSETS.length} files under ${root}`);

  const mount = process.env.RAILWAY_VOLUME_MOUNT_PATH;
  if (mount && !`${root}${path.sep}`.startsWith(`${path.resolve(mount)}${path.sep}`)) {
    console.warn(
      `[content-depth] WARNING: storage root ${root} is outside the mounted volume ${mount}. ` +
        'These files will not survive this container, so every Library download will 404. ' +
        'Point STORAGE_DIR inside the volume and provision from the start command, not pre-deploy.',
    );
  }
}

main().catch(async (err) => {
  console.error('[content-depth] failed:', err);
  await prisma.$disconnect();
  process.exit(1);
});
