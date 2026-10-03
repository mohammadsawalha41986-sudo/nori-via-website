/** One-time, reviewable upgrade authorized for all public photography and original branding. */
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { readFileSync, existsSync, statSync } from 'node:fs';
import path from 'node:path';
const db = new PrismaClient();
const photos = JSON.parse(readFileSync('scripts/photographic-media.json', 'utf8'));
const byKey = Object.fromEntries(photos.map(p => [p.key, p]));
export function photoKey(slug) {
  if (/deliver|digital|web/.test(slug)) return 'delivery';
  if (/photo|content|social|advertis|campaign|ads|market|roas|community/.test(slug)) return 'photography';
  if (/brand|identity|graphic|creative|packag/.test(slug)) return 'brand';
  if (/inventory|waste|purchas|procure|cost-control|cost-reduction/.test(slug)) return 'inventory';
  if (/profit|financ|budget|feasib|cost|pricing|price|performance-analysis/.test(slug)) return 'costing';
  if (/menu|recipe/.test(slug)) return 'chef';
  if (/cafe/.test(slug)) return 'cafe';
  if (/open|launch|concept|new-restaurant|spatial|branch|expan/.test(slug)) return 'launch';
  if (/customer|guest|experience/.test(slug)) return 'dining';
  if (/growth|strategy|management/.test(slug)) return 'planning';
  return 'training';
}
async function main() {
  for (const p of photos) {
    const file = path.join('public', p.url);
    if (!existsSync(file)) throw new Error('Missing photograph: ' + p.url);
    await db.media.upsert({ where: { id: `photograph-${p.key}` }, create: {
      id: `photograph-${p.key}`, filename: path.basename(file), url: p.url, kind: 'IMAGE',
      mimeType: 'image/webp', size: statSync(file).size, width: p.width, height: p.height,
      altEn: p.altEn, altAr: p.altAr,
    }, update: {} });
  }
  const key = 'photography-original-brand-v1';
  if (await db.page.findUnique({ where: { key } })) return;
  const services = await db.service.findMany();
  const projects = await db.project.findMany();
  const cases = await db.caseStudy.findMany();
  const insights = await db.insight.findMany();
  const stages = await db.systemStage.findMany({orderBy:[{order:'asc'},{step:'asc'}]});
  const home = await db.homepageContent.findUnique({ where: { id: 'singleton' } });
  const settings = await db.siteSettings.findUnique({ where: { id: 'singleton' } });
  const about = await db.page.findUnique({ where: { key: 'about' } });
  // Retain the previous URLs in the receipt; future CMS uploads are left alone.
  const backup = { services: services.map(r => ({ id: r.id, featuredImage: r.featuredImage, gallery: r.gallery, ogImage: r.ogImage })),
    projects: projects.map(r => ({ id:r.id, heroMediaUrl:r.heroMediaUrl, gallery:r.gallery })),
    cases: cases.map(r => ({ id:r.id, heroMediaUrl:r.heroMediaUrl, gallery:r.gallery })),
    insights: insights.map(r => ({ id:r.id, coverImage:r.coverImage })),
    stages: stages.map(r => ({ id:r.id, mediaUrl:r.mediaUrl })),
    home: home ? { heroMediaUrl:home.heroMediaUrl, heroHeadlineEn:home.heroHeadlineEn, heroHeadlineAr:home.heroHeadlineAr } : null,
    settings: settings ? { logoUrl:settings.logoUrl, logoInverseUrl:settings.logoInverseUrl } : null,
    about: about?.content ?? null };
  await db.$transaction(async tx => {
    for (const row of services) {
      const p=byKey[photoKey(row.slug)];
      await tx.service.update({ where:{id:row.id}, data:{ featuredImage:p.url, ogImage:p.url, gallery:[] } });
    }
    for (const [model, rows] of [['project',projects],['caseStudy',cases]]) {
      for (const row of rows) {
        const p=byKey[photoKey(row.slug)];
        await tx[model].update({ where:{id:row.id}, data:{heroMediaUrl:p.url,ogImage:p.url,gallery:[]} });
      }
    }
    for (const row of insights) {
      const p=byKey[photoKey(row.slug)];
      await tx.insight.update({where:{id:row.id},data:{coverImage:p.url,ogImage:p.url}});
    }
    const stepKeys=['dining','training','costing','brand','inventory','chef','launch'];
    for (let i=0;i<stages.length;i++) await tx.systemStage.update({where:{id:stages[i].id},data:{mediaUrl:byKey[stepKeys[i%stepKeys.length]].url}});
    if(home) await tx.homepageContent.update({where:{id:home.id},data:{heroMediaUrl:byKey.dining.url,heroMediaKind:'IMAGE',
      heroHeadlineAr:'من فكرة مطعمك\nإلى مشروع أقوى',heroHeadlineEn:'Your restaurant.\nA stronger business.',
      heroSubtitleAr:'نفهم مشروعك من الداخل، ونربط القائمة والتشغيل والتسويق بأرقام واضحة وخطة قابلة للتنفيذ.',
      heroSubtitleEn:'We understand your business from the inside, connecting menu, operations and marketing to clear numbers and a practical plan.'}});
    if(settings) await tx.siteSettings.update({where:{id:settings.id},data:{logoUrl:'/brand/noriva-original.jpg',logoInverseUrl:null}});
    if(about) {
      const content={...about.content};
      // Only replace image URLs; retain every authored paragraph and section.
      const rewrite = value => typeof value==='string' && (/^\/img\//.test(value) || /^\/media\//.test(value) || /res\.cloudinary\.com/.test(value)) ? byKey.training.url :
        Array.isArray(value) ? value.map(rewrite) : value && typeof value==='object' ? Object.fromEntries(Object.entries(value).map(([k,v])=>[k,rewrite(v)])) : value;
      await tx.page.update({where:{id:about.id},data:{content:rewrite(content)}});
    }
    await tx.page.create({data:{key,titleEn:'Photographic media and original brand receipt',content:{appliedAt:new Date().toISOString(),backup,photos,
      note:'Licensed stock photography illustrating restaurant topics; not NORIVA client locations or team portraits.'}}});
  }, { timeout: 60000 });
  console.log('[photography] Original supplied logo and licensed photographs applied to public pages.');
}
main().finally(()=>db.$disconnect());
