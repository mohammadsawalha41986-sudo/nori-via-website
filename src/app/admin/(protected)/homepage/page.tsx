import Link from 'next/link';
import { prisma } from '@/lib/db';
import { getHomepage } from '@/lib/content';
import { saveHomepage } from '@/server/actions';
import { AdminForm } from '@/components/admin/AdminForm';
import { MediaField } from '@/components/admin/MediaField';
import { PageHeader, Card, Field, Grid, inputClass, LinkButton } from '@/components/admin/ui';
import { stringifyPairs } from '@/server/helpers';

export const metadata = { title: 'Homepage' };
export const dynamic = 'force-dynamic';

export default async function HomepageEditor() {
  const [home, caseStudies, services, questionCounts] = await Promise.all([
    getHomepage(),
    prisma.caseStudy.findMany({ orderBy: { titleEn: 'asc' }, select: { id: true, titleEn: true, status: true } }),
    prisma.service.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: [{ order: 'asc' }, { nameEn: 'asc' }],
      select: { id: true, nameEn: true, featuredImage: true },
    }),
    prisma.homepageFaq.groupBy({ by: ['group'], _count: { _all: true } }),
  ]);

  const countFor = (group: 'NUMBERED' | 'ACCORDION') =>
    questionCounts.find((row) => row.group === group)?._count._all ?? 0;

  return (
    <>
      <PageHeader
        title="Homepage"
        description="Hero, brand statement, the Noriva System, restaurant intelligence and the closing call to action."
        action={<LinkButton href="/en" variant="secondary">Preview site ↗</LinkButton>}
      />

      <AdminForm action={saveHomepage} className="space-y-5">
        <Card title="Hero" description="The first thing a restaurant owner sees. Use a line break to control where the headline wraps.">
          <Grid>
            <Field label="Eyebrow (EN)" htmlFor="heroEyebrowEn">
              <input id="heroEyebrowEn" name="heroEyebrowEn" defaultValue={home.heroEyebrowEn} className={inputClass} />
            </Field>
            <Field label="Eyebrow (AR)" htmlFor="heroEyebrowAr">
              <input id="heroEyebrowAr" name="heroEyebrowAr" defaultValue={home.heroEyebrowAr} dir="rtl" className={inputClass} />
            </Field>
            <Field label="Headline (EN)" htmlFor="heroHeadlineEn" hint="One line per row.">
              <textarea id="heroHeadlineEn" name="heroHeadlineEn" rows={3} defaultValue={home.heroHeadlineEn} className={inputClass} />
            </Field>
            <Field label="Headline (AR)" htmlFor="heroHeadlineAr" hint="سطر واحد لكل صف.">
              <textarea id="heroHeadlineAr" name="heroHeadlineAr" rows={3} defaultValue={home.heroHeadlineAr} dir="rtl" className={inputClass} />
            </Field>
            <Field label="Subtitle (EN)" htmlFor="heroSubtitleEn">
              <textarea id="heroSubtitleEn" name="heroSubtitleEn" rows={3} defaultValue={home.heroSubtitleEn} className={inputClass} />
            </Field>
            <Field label="Subtitle (AR)" htmlFor="heroSubtitleAr">
              <textarea id="heroSubtitleAr" name="heroSubtitleAr" rows={3} defaultValue={home.heroSubtitleAr} dir="rtl" className={inputClass} />
            </Field>
            <Field label="Primary CTA (EN)" htmlFor="heroPrimaryCtaEn">
              <input id="heroPrimaryCtaEn" name="heroPrimaryCtaEn" defaultValue={home.heroPrimaryCtaEn} className={inputClass} />
            </Field>
            <Field label="Primary CTA (AR)" htmlFor="heroPrimaryCtaAr">
              <input id="heroPrimaryCtaAr" name="heroPrimaryCtaAr" defaultValue={home.heroPrimaryCtaAr} dir="rtl" className={inputClass} />
            </Field>
            <Field label="Secondary CTA (EN)" htmlFor="heroSecondaryCtaEn">
              <input id="heroSecondaryCtaEn" name="heroSecondaryCtaEn" defaultValue={home.heroSecondaryCtaEn} className={inputClass} />
            </Field>
            <Field label="Secondary CTA (AR)" htmlFor="heroSecondaryCtaAr">
              <input id="heroSecondaryCtaAr" name="heroSecondaryCtaAr" defaultValue={home.heroSecondaryCtaAr} dir="rtl" className={inputClass} />
            </Field>
          </Grid>

          <Grid>
            <div className="mt-4">
              <MediaField name="heroMediaUrl" label="Hero image or video" defaultValue={home.heroMediaUrl ?? ''} hint="Leave empty to use the built-in gradient." />
            </div>
            <Field label="Hero media type" htmlFor="heroMediaKind" className="mt-4">
              <select id="heroMediaKind" name="heroMediaKind" defaultValue={home.heroMediaKind} className={inputClass}>
                <option value="IMAGE">Image</option>
                <option value="VIDEO">Video</option>
              </select>
            </Field>
          </Grid>
        </Card>

        <Card title="Brand statement" description="The large editorial statement. Each line brightens as the visitor scrolls.">
          <Grid>
            <Field label="Statement (EN)" htmlFor="statementEn" hint="One line per row.">
              <textarea id="statementEn" name="statementEn" rows={6} defaultValue={home.statementEn} className={inputClass} />
            </Field>
            <Field label="Statement (AR)" htmlFor="statementAr">
              <textarea id="statementAr" name="statementAr" rows={6} defaultValue={home.statementAr} dir="rtl" className={inputClass} />
            </Field>
            <Field label="Supporting copy (EN)" htmlFor="statementSupportEn">
              <textarea id="statementSupportEn" name="statementSupportEn" rows={3} defaultValue={home.statementSupportEn} className={inputClass} />
            </Field>
            <Field label="Supporting copy (AR)" htmlFor="statementSupportAr">
              <textarea id="statementSupportAr" name="statementSupportAr" rows={3} defaultValue={home.statementSupportAr} dir="rtl" className={inputClass} />
            </Field>
          </Grid>
        </Card>

        <Card title="Noriva System" description="The four-stage headline. Edit the stages themselves under Noriva System.">
          <Grid>
            <Field label="Section headline (EN)" htmlFor="systemHeadlineEn">
              <input id="systemHeadlineEn" name="systemHeadlineEn" defaultValue={home.systemHeadlineEn} className={inputClass} />
            </Field>
            <Field label="Section headline (AR)" htmlFor="systemHeadlineAr">
              <input id="systemHeadlineAr" name="systemHeadlineAr" defaultValue={home.systemHeadlineAr} dir="rtl" className={inputClass} />
            </Field>
          </Grid>
        </Card>

        <Card title="Restaurant intelligence" description="What sets Noriva apart from a generic marketing agency.">
          <Grid>
            <Field label="Headline (EN)" htmlFor="intelligenceHeadlineEn">
              <input id="intelligenceHeadlineEn" name="intelligenceHeadlineEn" defaultValue={home.intelligenceHeadlineEn} className={inputClass} />
            </Field>
            <Field label="Headline (AR)" htmlFor="intelligenceHeadlineAr">
              <input id="intelligenceHeadlineAr" name="intelligenceHeadlineAr" defaultValue={home.intelligenceHeadlineAr} dir="rtl" className={inputClass} />
            </Field>
            <Field label="Body (EN)" htmlFor="intelligenceBodyEn">
              <textarea id="intelligenceBodyEn" name="intelligenceBodyEn" rows={4} defaultValue={home.intelligenceBodyEn} className={inputClass} />
            </Field>
            <Field label="Body (AR)" htmlFor="intelligenceBodyAr">
              <textarea id="intelligenceBodyAr" name="intelligenceBodyAr" rows={4} defaultValue={home.intelligenceBodyAr} dir="rtl" className={inputClass} />
            </Field>
          </Grid>

          <Field
            label="Capability list"
            htmlFor="intelligenceItemsRaw"
            hint="One per line, as: English | العربية"
            className="mt-4"
          >
            <textarea
              id="intelligenceItemsRaw"
              name="intelligenceItemsRaw"
              rows={9}
              defaultValue={stringifyPairs(home.intelligenceItems)}
              className={`${inputClass} font-mono text-xs`}
            />
          </Field>
        </Card>

        <Card title="Featured case study">
          <Field label="Case study" htmlFor="featuredCaseStudyId" hint="Only published case studies appear on the site.">
            <select id="featuredCaseStudyId" name="featuredCaseStudyId" defaultValue={home.featuredCaseStudyId ?? ''} className={inputClass}>
              <option value="">None</option>
              {caseStudies.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.titleEn} {c.status === 'DRAFT' ? '(draft)' : ''}
                </option>
              ))}
            </select>
          </Field>
        </Card>

        <Card
          title="Questions block"
          description="The numbered questions whose answers are always visible. Write the questions themselves under Homepage questions."
        >
          <Grid>
            <Field label="Eyebrow (EN)" htmlFor="questionsEyebrowEn">
              <input id="questionsEyebrowEn" name="questionsEyebrowEn" defaultValue={home.questionsEyebrowEn} className={inputClass} />
            </Field>
            <Field label="Eyebrow (AR)" htmlFor="questionsEyebrowAr">
              <input id="questionsEyebrowAr" name="questionsEyebrowAr" defaultValue={home.questionsEyebrowAr} dir="rtl" className={inputClass} />
            </Field>
            <Field label="Headline (EN)" htmlFor="questionsHeadlineEn">
              <input id="questionsHeadlineEn" name="questionsHeadlineEn" defaultValue={home.questionsHeadlineEn} className={inputClass} />
            </Field>
            <Field label="Headline (AR)" htmlFor="questionsHeadlineAr">
              <input id="questionsHeadlineAr" name="questionsHeadlineAr" defaultValue={home.questionsHeadlineAr} dir="rtl" className={inputClass} />
            </Field>
            <Field label="Intro (EN)" htmlFor="questionsBodyEn">
              <textarea id="questionsBodyEn" name="questionsBodyEn" rows={3} defaultValue={home.questionsBodyEn} className={inputClass} />
            </Field>
            <Field label="Intro (AR)" htmlFor="questionsBodyAr">
              <textarea id="questionsBodyAr" name="questionsBodyAr" rows={3} defaultValue={home.questionsBodyAr} dir="rtl" className={inputClass} />
            </Field>
          </Grid>
          <p className="mt-4 text-sm text-slate-500">
            {countFor('NUMBERED')} question(s) in this block.{' '}
            <Link href="/admin/homepage/questions" className="font-semibold text-slate-700 underline">
              Edit the questions
            </Link>
          </p>
        </Card>

        <Card
          title="Services showcase"
          description="The services grid. Pick one service to promote to the large image card — it needs a featured image of its own."
        >
          <Grid>
            <Field label="Headline (EN)" htmlFor="servicesHeadlineEn" hint="Leave empty to use “Services”.">
              <input id="servicesHeadlineEn" name="servicesHeadlineEn" defaultValue={home.servicesHeadlineEn} className={inputClass} />
            </Field>
            <Field label="Headline (AR)" htmlFor="servicesHeadlineAr">
              <input id="servicesHeadlineAr" name="servicesHeadlineAr" defaultValue={home.servicesHeadlineAr} dir="rtl" className={inputClass} />
            </Field>
            <Field label="Intro (EN)" htmlFor="servicesBodyEn">
              <textarea id="servicesBodyEn" name="servicesBodyEn" rows={3} defaultValue={home.servicesBodyEn} className={inputClass} />
            </Field>
            <Field label="Intro (AR)" htmlFor="servicesBodyAr">
              <textarea id="servicesBodyAr" name="servicesBodyAr" rows={3} defaultValue={home.servicesBodyAr} dir="rtl" className={inputClass} />
            </Field>
          </Grid>

          <Field
            label="Promoted service"
            htmlFor="featuredServiceId"
            hint="Only published services are listed. One without an image stays a normal card."
            className="mt-4"
          >
            <select id="featuredServiceId" name="featuredServiceId" defaultValue={home.featuredServiceId ?? ''} className={inputClass}>
              <option value="">None</option>
              {services.map((service) => (
                <option key={service.id} value={service.id}>
                  {service.nameEn} {service.featuredImage ? '' : '(no image)'}
                </option>
              ))}
            </select>
          </Field>
        </Card>

        <Card
          title="Image banner"
          description="The full-width band that sends visitors to one destination, such as the library."
        >
          <Grid>
            <Field label="Eyebrow (EN)" htmlFor="bannerEyebrowEn">
              <input id="bannerEyebrowEn" name="bannerEyebrowEn" defaultValue={home.bannerEyebrowEn} className={inputClass} />
            </Field>
            <Field label="Eyebrow (AR)" htmlFor="bannerEyebrowAr">
              <input id="bannerEyebrowAr" name="bannerEyebrowAr" defaultValue={home.bannerEyebrowAr} dir="rtl" className={inputClass} />
            </Field>
            <Field label="Headline (EN)" htmlFor="bannerHeadlineEn" hint="The banner is hidden until this is filled in.">
              <input id="bannerHeadlineEn" name="bannerHeadlineEn" defaultValue={home.bannerHeadlineEn} className={inputClass} />
            </Field>
            <Field label="Headline (AR)" htmlFor="bannerHeadlineAr">
              <input id="bannerHeadlineAr" name="bannerHeadlineAr" defaultValue={home.bannerHeadlineAr} dir="rtl" className={inputClass} />
            </Field>
            <Field label="Body (EN)" htmlFor="bannerBodyEn">
              <textarea id="bannerBodyEn" name="bannerBodyEn" rows={3} defaultValue={home.bannerBodyEn} className={inputClass} />
            </Field>
            <Field label="Body (AR)" htmlFor="bannerBodyAr">
              <textarea id="bannerBodyAr" name="bannerBodyAr" rows={3} defaultValue={home.bannerBodyAr} dir="rtl" className={inputClass} />
            </Field>
            <Field label="Button label (EN)" htmlFor="bannerCtaLabelEn">
              <input id="bannerCtaLabelEn" name="bannerCtaLabelEn" defaultValue={home.bannerCtaLabelEn} className={inputClass} />
            </Field>
            <Field label="Button label (AR)" htmlFor="bannerCtaLabelAr">
              <input id="bannerCtaLabelAr" name="bannerCtaLabelAr" defaultValue={home.bannerCtaLabelAr} dir="rtl" className={inputClass} />
            </Field>
          </Grid>

          <Grid>
            <Field
              label="Button link"
              htmlFor="bannerCtaHref"
              hint="A path on this site, for example /library. Leave empty for a banner without a button."
              className="mt-4"
            >
              <input id="bannerCtaHref" name="bannerCtaHref" defaultValue={home.bannerCtaHref} placeholder="/library" className={inputClass} />
            </Field>
            <div className="mt-4">
              <MediaField
                name="bannerImageUrl"
                label="Background image"
                defaultValue={home.bannerImageUrl ?? ''}
                hint="Wide artwork works best. Without one the band uses the brand's dark ink."
              />
            </div>
          </Grid>
        </Card>

        <Card
          title="FAQ block"
          description="The collapsible questions near the bottom of the page. Write them under Homepage questions."
        >
          <Grid>
            <Field label="Eyebrow (EN)" htmlFor="faqEyebrowEn">
              <input id="faqEyebrowEn" name="faqEyebrowEn" defaultValue={home.faqEyebrowEn} className={inputClass} />
            </Field>
            <Field label="Eyebrow (AR)" htmlFor="faqEyebrowAr">
              <input id="faqEyebrowAr" name="faqEyebrowAr" defaultValue={home.faqEyebrowAr} dir="rtl" className={inputClass} />
            </Field>
            <Field label="Headline (EN)" htmlFor="faqHeadlineEn" hint="Leave empty to use “Frequently Asked Questions”.">
              <input id="faqHeadlineEn" name="faqHeadlineEn" defaultValue={home.faqHeadlineEn} className={inputClass} />
            </Field>
            <Field label="Headline (AR)" htmlFor="faqHeadlineAr">
              <input id="faqHeadlineAr" name="faqHeadlineAr" defaultValue={home.faqHeadlineAr} dir="rtl" className={inputClass} />
            </Field>
            <Field label="Intro (EN)" htmlFor="faqBodyEn">
              <textarea id="faqBodyEn" name="faqBodyEn" rows={3} defaultValue={home.faqBodyEn} className={inputClass} />
            </Field>
            <Field label="Intro (AR)" htmlFor="faqBodyAr">
              <textarea id="faqBodyAr" name="faqBodyAr" rows={3} defaultValue={home.faqBodyAr} dir="rtl" className={inputClass} />
            </Field>
          </Grid>
          <p className="mt-4 text-sm text-slate-500">
            {countFor('ACCORDION')} question(s) in this block.{' '}
            <Link href="/admin/homepage/questions" className="font-semibold text-slate-700 underline">
              Edit the questions
            </Link>
          </p>
        </Card>

        <Card title="Closing call to action">
          <Grid>
            <Field label="Headline (EN)" htmlFor="ctaHeadlineEn">
              <textarea id="ctaHeadlineEn" name="ctaHeadlineEn" rows={2} defaultValue={home.ctaHeadlineEn} className={inputClass} />
            </Field>
            <Field label="Headline (AR)" htmlFor="ctaHeadlineAr">
              <textarea id="ctaHeadlineAr" name="ctaHeadlineAr" rows={2} defaultValue={home.ctaHeadlineAr} dir="rtl" className={inputClass} />
            </Field>
            <Field label="Description (EN)" htmlFor="ctaDescriptionEn">
              <textarea id="ctaDescriptionEn" name="ctaDescriptionEn" rows={3} defaultValue={home.ctaDescriptionEn} className={inputClass} />
            </Field>
            <Field label="Description (AR)" htmlFor="ctaDescriptionAr">
              <textarea id="ctaDescriptionAr" name="ctaDescriptionAr" rows={3} defaultValue={home.ctaDescriptionAr} dir="rtl" className={inputClass} />
            </Field>
            <Field label="Button label (EN)" htmlFor="ctaLabelEn">
              <input id="ctaLabelEn" name="ctaLabelEn" defaultValue={home.ctaLabelEn} className={inputClass} />
            </Field>
            <Field label="Button label (AR)" htmlFor="ctaLabelAr">
              <input id="ctaLabelAr" name="ctaLabelAr" defaultValue={home.ctaLabelAr} dir="rtl" className={inputClass} />
            </Field>
          </Grid>
        </Card>
      </AdminForm>
    </>
  );
}
