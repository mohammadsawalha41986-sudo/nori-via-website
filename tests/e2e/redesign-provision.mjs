/** Verify provisioning against a disposable local database only. */
import 'dotenv/config';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { PrismaClient } from '@prisma/client';
const url = new URL(process.env.DATABASE_URL);
assert.ok(['127.0.0.1', 'localhost'].includes(url.hostname), 'Use an isolated local QA database');
assert.equal(process.env.QA_ALLOW_CMS_EDITS, '1', 'Explicit local QA edit switch required');
const db = new PrismaClient();
const service = await db.service.findUniqueOrThrow({ where: { slug: 'brand-strategy-identity' } });
const home = await db.homepageContent.findUniqueOrThrow({ where: { id: 'singleton' } });
const media = await db.media.findUniqueOrThrow({ where: { id: 'editorial-dining' } });
const receipt = await db.page.findUniqueOrThrow({ where: { key: 'public-redesign-receipt' } });
const custom = '/media/editorially-selected-photo.webp';
try {
  await db.service.update({
    where: { id: service.id },
    data: { featuredImage: custom, ogImage: custom },
  });
  await db.homepageContent.update({
    where: { id: home.id },
    data: { heroMediaUrl: '/media/custom-film.mp4', heroMediaKind: 'VIDEO' },
  });
  await db.media.update({
    where: { id: media.id },
    data: { altEn: 'Editor selected description', altAr: 'وصف اختاره المحرر' },
  });
  await db.page.update({
    where: { id: receipt.id },
    data: { content: { ...receipt.content, [service.slug]: false, home: false } },
  });
  const before = {
    services: await db.service.count(),
    projects: await db.project.count(),
    resources: await db.resource.count(),
  };
  for (let i = 0; i < 2; i++)
    execFileSync(process.execPath, ['scripts/apply-public-redesign.mjs'], {
      encoding: 'utf8',
      timeout: 120000,
    });
  const current = await db.service.findUniqueOrThrow({ where: { id: service.id } });
  assert.equal(current.featuredImage, custom);
  assert.equal(current.ogImage, custom);
  assert.equal(current.nameAr, service.nameAr);
  assert.equal(current.whatWeDoEn, service.whatWeDoEn);
  assert.deepEqual(current.gallery, service.gallery);
  const homepage = await db.homepageContent.findUniqueOrThrow({ where: { id: home.id } });
  assert.equal(homepage.heroMediaUrl, '/media/custom-film.mp4');
  assert.equal(homepage.heroMediaKind, 'VIDEO');
  assert.equal(
    (await db.media.findUniqueOrThrow({ where: { id: media.id } })).altEn,
    'Editor selected description',
  );
  assert.deepEqual(
    {
      services: await db.service.count(),
      projects: await db.project.count(),
      resources: await db.resource.count(),
    },
    before,
  );
  console.log(
    'PASS custom media, video, editorial alt, translations, gallery and catalogue counts survive repeated provisioning',
  );
} finally {
  await db.service.update({
    where: { id: service.id },
    data: { featuredImage: service.featuredImage, ogImage: service.ogImage },
  });
  await db.homepageContent.update({
    where: { id: home.id },
    data: { heroMediaUrl: home.heroMediaUrl, heroMediaKind: home.heroMediaKind },
  });
  await db.media.update({
    where: { id: media.id },
    data: { altEn: media.altEn, altAr: media.altAr },
  });
  await db.page.update({ where: { id: receipt.id }, data: { content: receipt.content } });
  await db.$disconnect();
}
