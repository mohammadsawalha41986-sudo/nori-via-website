import { getSettings } from '@/lib/content';
import { saveSettings } from '@/server/actions';
import { AdminForm } from '@/components/admin/AdminForm';
import { MediaField } from '@/components/admin/MediaField';
import { PageHeader, Card, Field, Grid, inputClass } from '@/components/admin/ui';

export const metadata = { title: 'Site settings' };
export const dynamic = 'force-dynamic';

export default async function SettingsPage() {
  const s = await getSettings();

  return (
    <>
      <PageHeader
        title="Site settings"
        description="Company details, contact information and social links. Every field here updates the public website."
      />

      <AdminForm action={saveSettings} className="space-y-5">
        <Card title="Company">
          <Grid>
            <Field label="Company name (EN)" htmlFor="companyNameEn" required>
              <input id="companyNameEn" name="companyNameEn" defaultValue={s.companyNameEn} className={inputClass} />
            </Field>
            <Field label="Company name (AR)" htmlFor="companyNameAr">
              <input id="companyNameAr" name="companyNameAr" defaultValue={s.companyNameAr} dir="rtl" className={inputClass} />
            </Field>
            <Field label="Tagline (EN)" htmlFor="taglineEn">
              <input id="taglineEn" name="taglineEn" defaultValue={s.taglineEn} className={inputClass} />
            </Field>
            <Field label="Tagline (AR)" htmlFor="taglineAr">
              <input id="taglineAr" name="taglineAr" defaultValue={s.taglineAr} dir="rtl" className={inputClass} />
            </Field>
          </Grid>

          <Grid>
            <Field label="Description (EN)" htmlFor="descriptionEn" className="mt-4">
              <textarea id="descriptionEn" name="descriptionEn" rows={4} defaultValue={s.descriptionEn} className={inputClass} />
            </Field>
            <Field label="Description (AR)" htmlFor="descriptionAr" className="mt-4">
              <textarea id="descriptionAr" name="descriptionAr" rows={4} defaultValue={s.descriptionAr} dir="rtl" className={inputClass} />
            </Field>
          </Grid>
        </Card>

        <Card
          title="Brand assets"
          description="Upload from the media library or paste a URL. Artwork is only ever scaled — never recoloured or cropped."
        >
          <Grid>
            <MediaField
              name="logoUrl"
              label="Logo"
              defaultValue={s.logoUrl ?? ''}
              hint="Used in the header and footer. PNG or WEBP at roughly 3× the display size (about 450×108) stays sharp on retina screens."
            />
            <MediaField
              name="logoInverseUrl"
              label="Logo for dark backgrounds"
              defaultValue={s.logoInverseUrl ?? ''}
              hint="Optional light/reversed version. Leave empty and the main logo is shown on a white plate over dark sections instead."
            />
            <MediaField name="logoMarkUrl" label="Logo mark (icon only)" defaultValue={s.logoMarkUrl ?? ''} />
            <MediaField
              name="faviconUrl"
              label="Favicon"
              defaultValue={s.faviconUrl ?? ''}
              hint="Square PNG, 512×512. Falls back to the built-in Noriva mark when empty."
            />
          </Grid>
        </Card>

        <Card title="Contact" description="Where inquiries are delivered and what visitors see on the contact page.">
          <Grid>
            <Field label="Inquiry email" htmlFor="inquiryEmail" hint="New project inquiries are emailed here.">
              <input id="inquiryEmail" name="inquiryEmail" type="email" defaultValue={s.inquiryEmail} className={inputClass} />
            </Field>
            <Field label="Public contact email" htmlFor="contactEmail">
              <input id="contactEmail" name="contactEmail" type="email" defaultValue={s.contactEmail} className={inputClass} />
            </Field>
            <Field label="Phone" htmlFor="phone">
              <input id="phone" name="phone" defaultValue={s.phone} dir="ltr" className={inputClass} />
            </Field>
            <Field label="WhatsApp" htmlFor="whatsapp" hint="Include the country code, e.g. +966…">
              <input id="whatsapp" name="whatsapp" defaultValue={s.whatsapp} dir="ltr" className={inputClass} />
            </Field>
            <Field label="Address (EN)" htmlFor="addressEn">
              <input id="addressEn" name="addressEn" defaultValue={s.addressEn} className={inputClass} />
            </Field>
            <Field label="Address (AR)" htmlFor="addressAr">
              <input id="addressAr" name="addressAr" defaultValue={s.addressAr} dir="rtl" className={inputClass} />
            </Field>
            <Field label="Google Maps URL" htmlFor="mapsUrl">
              <input id="mapsUrl" name="mapsUrl" defaultValue={s.mapsUrl} dir="ltr" className={inputClass} />
            </Field>
          </Grid>
        </Card>

        <Card title="Social">
          <Grid cols={3}>
            {(['instagram', 'tiktok', 'linkedin', 'x', 'youtube'] as const).map((key) => (
              <Field key={key} label={key === 'x' ? 'X (Twitter)' : key[0]!.toUpperCase() + key.slice(1)} htmlFor={key}>
                <input id={key} name={key} defaultValue={s[key]} dir="ltr" placeholder="https://" className={inputClass} />
              </Field>
            ))}
          </Grid>
        </Card>

        <Card title="Footer">
          <Grid>
            <Field label="Footer description (EN)" htmlFor="footerDescriptionEn">
              <textarea id="footerDescriptionEn" name="footerDescriptionEn" rows={3} defaultValue={s.footerDescriptionEn} className={inputClass} />
            </Field>
            <Field label="Footer description (AR)" htmlFor="footerDescriptionAr">
              <textarea id="footerDescriptionAr" name="footerDescriptionAr" rows={3} defaultValue={s.footerDescriptionAr} dir="rtl" className={inputClass} />
            </Field>
            <Field label="Copyright (EN)" htmlFor="copyrightEn">
              <input id="copyrightEn" name="copyrightEn" defaultValue={s.copyrightEn} className={inputClass} />
            </Field>
            <Field label="Copyright (AR)" htmlFor="copyrightAr">
              <input id="copyrightAr" name="copyrightAr" defaultValue={s.copyrightAr} dir="rtl" className={inputClass} />
            </Field>
          </Grid>

          {/* Backdrop. The image is kept on file even while Colour is selected,
              so switching back and forth costs nothing. Neither option changes
              how tall the footer is. */}
          <Grid cols={2}>
            <Field
              label="Footer background"
              htmlFor="footerBackgroundType"
              hint="Image uses the picture below behind a dark overlay. Colour uses the swatch, and an empty swatch falls back to the brand ink."
            >
              <select
                id="footerBackgroundType"
                name="footerBackgroundType"
                defaultValue={s.footerBackgroundType}
                className={inputClass}
              >
                <option value="COLOR">Colour</option>
                <option value="IMAGE">Image</option>
              </select>
            </Field>
            <Field
              label="Footer background colour"
              htmlFor="footerBackgroundColor"
              hint="Hex, e.g. #0B1225. Leave empty for the default brand ink."
            >
              <input
                id="footerBackgroundColor"
                name="footerBackgroundColor"
                defaultValue={s.footerBackgroundColor}
                dir="ltr"
                placeholder="#0B1225"
                className={inputClass}
              />
            </Field>
          </Grid>
          <MediaField
            name="footerBackgroundImage"
            label="Footer background image"
            defaultValue={s.footerBackgroundImage ?? ''}
            hint="Used only when the background is set to Image. It is drawn full-bleed behind an overlay and never changes the footer's height."
          />
        </Card>

        {/* SEO, the share image and analytics live on the SEO screen. Saves only
            write the fields actually submitted, so nothing there is affected. */}
      </AdminForm>
    </>
  );
}
