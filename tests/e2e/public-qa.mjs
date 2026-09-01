/**
 * Public-site QA sweep.
 *
 * Loads every public page at desktop, tablet and mobile widths and fails on
 * horizontal overflow, a wrong text direction, a missing or duplicated h1,
 * images without alt text or that failed to load, unlabelled form controls,
 * missing title / description / canonical / favicon, any 5xx, or any
 * client-side error. Screenshots are written to /tmp/qaf for eyeballing.
 *
 *   BASE_URL=... CHROMIUM_PATH=... node tests/e2e/public-qa.mjs
 */
import { chromium } from 'playwright';
import fs from 'node:fs';
const B = process.env.BASE_URL ?? 'http://127.0.0.1:3000';
const OUT='/tmp/qaf'; fs.rmSync(OUT,{recursive:true,force:true}); fs.mkdirSync(OUT,{recursive:true});
const b=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||undefined,args:['--no-sandbox']});
const issues=[];
const PAGES=[['home','/en'],['about','/en/about'],['services','/en/services'],['service','/en/services/menu-engineering'],
 ['work','/en/work'],['growth','/en/restaurant-growth'],['insights','/en/insights'],['contact','/en/contact'],
 ['start','/en/start-a-project'],['privacy','/en/privacy'],['terms','/en/terms'],['404','/en/nope'],
 ['home-ar','/ar'],['services-ar','/ar/services'],['work-ar','/ar/work'],['contact-ar','/ar/contact'],
 ['start-ar','/ar/start-a-project'],['privacy-ar','/ar/privacy']];
const MOB=['home','home-ar','work','services','start','contact'];
for (const [vpName,vp] of Object.entries({desktop:{width:1440,height:900},tablet:{width:834,height:1112},mobile:{width:390,height:844}})) {
  const ctx=await b.newContext({viewport:vp}); const p=await ctx.newPage();
  p.on('pageerror',e=>issues.push(`${vpName} JS error: ${String(e).slice(0,90)}`));
  p.on('response',r=>{ if(r.status()>=500) issues.push(`${vpName} 5xx: ${r.url().slice(0,60)}`); });
  for (const [name,path] of PAGES) {
    if (vpName!=='desktop' && !MOB.includes(name)) continue;
    await p.goto(B+path,{waitUntil:'networkidle'});
    await p.waitForTimeout(1200);
    await p.screenshot({path:`${OUT}/${vpName}-${name}.png`, fullPage: vpName==='desktop'});
    const r=await p.evaluate(()=>{const de=document.documentElement;
      const imgs=[...document.querySelectorAll('img')];
      const inputs=[...document.querySelectorAll('input,select,textarea')].filter(e=>e.type!=='hidden');
      return {ov:de.scrollWidth-de.clientWidth,dir:de.getAttribute('dir'),lang:de.getAttribute('lang'),
        h1:document.querySelectorAll('h1').length,
        noAlt:imgs.filter(i=>!i.hasAttribute('alt')).length,
        broken:imgs.filter(i=>i.complete&&i.naturalWidth===0).length,
        noLabel:inputs.filter(i=>!(i.getAttribute('aria-label')||i.closest('label')||(i.id&&document.querySelector(`label[for="${CSS.escape(i.id)}"]`)))).length,
        title:document.title, desc:document.querySelector('meta[name=description]')?.content||'',
        icon:document.querySelector('link[rel=icon]')?.getAttribute('href')||'',
        canon:document.querySelector('link[rel=canonical]')?.getAttribute('href')||''};});
    const t=`${vpName} ${path}`, want=path.startsWith('/ar')?'rtl':'ltr';
    if(r.ov>1) issues.push(`${t}: overflow ${r.ov}px`);
    if(r.dir!==want) issues.push(`${t}: dir=${r.dir}`);
    if(r.h1!==1) issues.push(`${t}: ${r.h1} h1`);
    if(r.noAlt) issues.push(`${t}: ${r.noAlt} img without alt`);
    if(r.broken) issues.push(`${t}: ${r.broken} broken image`);
    if(r.noLabel) issues.push(`${t}: ${r.noLabel} unlabelled control`);
    if(!r.title) issues.push(`${t}: no title`);
    if(name!=='404'&&!r.desc) issues.push(`${t}: no meta description`);
    if(!r.icon) issues.push(`${t}: no favicon`);
    if(name!=='404'&&!r.canon) issues.push(`${t}: no canonical`);
  }
  await ctx.close();
}
await b.close();
console.log(issues.length?'ISSUES:\n'+issues.map(i=>' - '+i).join('\n'):'CLEAN — no layout, accessibility, metadata or console issues.');
console.log('screenshots:',fs.readdirSync(OUT).length);
process.exit(issues.length ? 1 : 0);
