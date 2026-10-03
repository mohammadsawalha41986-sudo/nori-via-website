/** Publish compact replacements for bundled downloads; never overwrite custom uploaded files. */
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { readFileSync } from 'node:fs';
const db=new PrismaClient();
const {documents}=JSON.parse(readFileSync('scripts/brief-resource-manifest.json','utf8'));
try {
 const key='brief-library-v1';
 if(!(await db.page.findUnique({where:{key}}))){
  const backup=[];
  await db.$transaction(async tx=>{
   for(const doc of documents){
    const row=await tx.resource.findUnique({where:{slug:doc.slug}});
    if(!row || row.fileKey!==doc.storageKey || row.externalUrl) continue;
    backup.push({id:row.id,summaryEn:row.summaryEn,summaryAr:row.summaryAr,descriptionEn:row.descriptionEn,descriptionAr:row.descriptionAr,includes:row.includes});
    const brief=doc.type!=='EXCEL';
    await tx.resource.update({where:{id:row.id},data:{
     summaryEn:brief ? `A one-page starting worksheet for ${doc.titleEn.toLowerCase()}. Collect your evidence, then complete the review with NORIVA.`:doc.summaryEn,
     summaryAr:brief ? `نموذج بداية من صفحة واحدة حول ${doc.titleAr}. اجمع بياناتك ثم أكمل المراجعة مع نوريفا.`:doc.summaryAr,
     descriptionEn:brief ? 'This compact sample contains the three review areas below, evidence and action fields, and a next-step prompt. It is a starting worksheet. A complete project-specific study is prepared with NORIVA after reviewing your verified business data.':doc.descriptionEn,
     descriptionAr:brief ? 'يضم النموذج المختصر مجالات المراجعة الثلاثة أدناه وحقول الأدلة والإجراءات والخطوة التالية. يُعد نقطة بداية؛ تُجهز الدراسة الكاملة مع نوريفا بعد مراجعة بيانات مشروعك الموثقة.':doc.descriptionAr,
     ...(brief ? {includes:doc.includes.slice(0,3).map(([labelEn,labelAr])=>({labelEn,labelAr}))}:{}),
    }});
   }
   await tx.page.create({data:{key,titleEn:'Brief library upgrade receipt',content:{backup,appliedAt:new Date().toISOString()}}});
  },{timeout:60000});
 }
}finally{await db.$disconnect();}
