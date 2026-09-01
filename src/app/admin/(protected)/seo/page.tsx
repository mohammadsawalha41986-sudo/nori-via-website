import Link from 'next/link';
import { getSettings } from '@/lib/content';
import { saveSettings } from '@/server/actions';
import { AdminForm } from '@/components/admin/AdminForm';
import { MediaField } from '@/components/admin/MediaField';
import { PageHeader, Card, Field, Grid, inputClass } from '@/components/admin/ui';
import { env } from '@/lib/env';

export const metadata = { title: 'SEO' };
export const dynamic = 'force-dynamic';

export default async function SeoPage() {
  const s = await getSettings();

  return (
    <>
      <PageHeader
        title="SEO & analytics"
        description="Site-wide defaults. Per-page titles and descriptions are set on each service, project, article and page."
      />

      <div className="mb-5 rounded-lg border border-slate-200 bg-white px-5 py-4 text-sm text-slate-600">
        <p className="font-medium text-slate-900">Generated automatically</p>
        <ul className="mt-2 space-y-1">
          <li>
            <Link href="/sitemap.xml" target="_blank" className="underline">/sitemap.xml</Link> — every published page in both languages, with hreflang alternates.
          </li>
          <li>
            <Link href="/robots.txt" target="_blank" className="underline">/robots.txt</Link> — allows the site, blocks <code>/admin</code> and <code>/api</code>.
          </li>
          <li>Organization, Service, Article and BreadcrumbList structured data on the relevant pages.</li>
        </ul>
        <p className="mt-3 text-xs text-slate-400">Canonical host: {env.siteUrl}</p>
      </div>

      <AdminForm action={saveSettings} className="space-y-5">
        <Card title="Default metadata">
          <Grid>
            <Field label="Site title (EN)" htmlFor="seoTitleEn">
              <input id="seoTitleEn" name="seoTitleEn" defaultValue={s.seoTitleEn} className={inputClass} />
            </Field>
            <Field label="Site title (AR)" htmlFor="seoTitleAr">
              <input id="seoTitleAr" name="seoTitleAr" defaultValue={s.seoTitleAr} dir="rtl" className={inputClass} />
            </Field>
            <Field label="Default description (EN)" htmlFor="seoDescriptionEn">
              <textarea id="seoDescriptionEn" name="seoDescriptionEn" rows={3} defaultValue={s.seoDescriptionEn} className={inputClass} />
            </Field>
            <Field label="Default description (AR)" htmlFor="seoDescriptionAr">
              <textarea id="seoDescriptionAr" name="seoDescriptionAr" rows={3} defaultValue={s.seoDescriptionAr} dir="rtl" className={inputClass} />
            </Field>
          </Grid>

          <Grid>
            <div className="mt-4">
              <MediaField name="defaultOgImage" label="Default social share image" defaultValue={s.defaultOgImage ?? ''} hint="1200×630 works best." />
            </div>
            <div className="mt-4">
              <MediaField name="faviconUrl" label="Favicon" defaultValue={s.faviconUrl ?? ''} />
            </div>
          </Grid>
        </Card>

        <Card title="Analytics" description="Leave empty to load no tracking scripts at all.">
          <Grid>
            <Field label="Google Analytics ID" htmlFor="gaId" hint="e.g. G-XXXXXXXXXX">
              <input id="gaId" name="gaId" defaultValue={s.gaId} dir="ltr" className={inputClass} />
            </Field>
            <Field label="Google Tag Manager ID" htmlFor="gtmId" hint="e.g. GTM-XXXXXXX">
              <input id="gtmId" name="gtmId" defaultValue={s.gtmId} dir="ltr" className={inputClass} />
            </Field>
          </Grid>
          <p className="mt-3 text-xs text-slate-400">
            Tracked events: page views, Start a Project clicks, form start, per-step progress, form completion, work and
            case study views, downloads and CTA clicks. No inquiry content is ever sent to analytics.
          </p>
        </Card>

        {/* Company, contact and brand fields live on Site settings. Saves only
            write the fields actually submitted, so nothing there is affected. */}
      </AdminForm>
    </>
  );
}
