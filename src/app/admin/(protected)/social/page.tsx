import { prisma } from '@/lib/db';
import { PageHeader, Card, Field, Grid, inputClass, EmptyRow } from '@/components/admin/ui';
import { InlineForm } from '@/components/admin/InlineForm';
import { SubmitButton } from '@/components/admin/SubmitButton';
import {
  saveSocialLink,
  deleteSocialLink,
  saveFloatingAction,
  deleteFloatingAction,
} from '@/server/platform-actions';
import { SOCIAL_PLATFORMS, FLOATING_ACTION_KINDS } from '@/lib/validation';

export const metadata = { title: 'Social & contact' };
export const dynamic = 'force-dynamic';

type SocialRow = {
  id: string; platform: string; labelEn: string; labelAr: string; url: string; enabled: boolean; order: number;
};
type ActionRow = {
  id: string; kind: string; labelEn: string; labelAr: string; value: string; enabled: boolean; order: number;
};

function SocialFields({ row }: { row?: SocialRow }) {
  const k = row?.id ?? 'new-social';
  return (
    <>
      {row && <input type="hidden" name="id" value={row.id} />}
      <Grid cols={3}>
        <Field label="Platform" htmlFor={`platform-${k}`} required>
          <select id={`platform-${k}`} name="platform" defaultValue={row?.platform ?? 'instagram'} className={inputClass}>
            {SOCIAL_PLATFORMS.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </Field>
        <Field label="URL" htmlFor={`url-${k}`} required hint="Full address, including https://">
          <input id={`url-${k}`} name="url" defaultValue={row?.url ?? ''} required dir="ltr" placeholder="https://" className={inputClass} />
        </Field>
        <Field label="Order" htmlFor={`order-${k}`}>
          <input id={`order-${k}`} name="order" type="number" min={0} defaultValue={row?.order ?? 0} className={inputClass} />
        </Field>
        <Field label="Label (EN)" htmlFor={`labelEn-${k}`} hint="Optional — defaults to the platform name.">
          <input id={`labelEn-${k}`} name="labelEn" defaultValue={row?.labelEn ?? ''} className={inputClass} />
        </Field>
        <Field label="Label (AR)" htmlFor={`labelAr-${k}`}>
          <input id={`labelAr-${k}`} name="labelAr" defaultValue={row?.labelAr ?? ''} dir="rtl" className={inputClass} />
        </Field>
        <label className="mt-7 flex items-center gap-2 text-sm text-slate-700">
          <input name="enabled" type="checkbox" defaultChecked={row?.enabled ?? true} className="h-4 w-4 rounded border-slate-300" />
          Show on the site
        </label>
      </Grid>
    </>
  );
}

function ActionFields({ row }: { row?: ActionRow }) {
  const k = row?.id ?? 'new-action';
  return (
    <>
      {row && <input type="hidden" name="id" value={row.id} />}
      <Grid cols={3}>
        <Field label="Type" htmlFor={`kind-${k}`} required>
          <select id={`kind-${k}`} name="kind" defaultValue={row?.kind ?? 'whatsapp'} className={inputClass}>
            {FLOATING_ACTION_KINDS.map((kind) => (
              <option key={kind} value={kind}>{kind}</option>
            ))}
          </select>
        </Field>
        <Field
          label="Value"
          htmlFor={`value-${k}`}
          required
          hint="WhatsApp/phone: full number with country code. Email: an address. Link: a URL or /path."
        >
          <input id={`value-${k}`} name="value" defaultValue={row?.value ?? ''} required dir="ltr" className={inputClass} />
        </Field>
        <Field label="Order" htmlFor={`aorder-${k}`}>
          <input id={`aorder-${k}`} name="order" type="number" min={0} defaultValue={row?.order ?? 0} className={inputClass} />
        </Field>
        <Field label="Label (EN)" htmlFor={`alabelEn-${k}`}>
          <input id={`alabelEn-${k}`} name="labelEn" defaultValue={row?.labelEn ?? ''} className={inputClass} />
        </Field>
        <Field label="Label (AR)" htmlFor={`alabelAr-${k}`}>
          <input id={`alabelAr-${k}`} name="labelAr" defaultValue={row?.labelAr ?? ''} dir="rtl" className={inputClass} />
        </Field>
        <label className="mt-7 flex items-center gap-2 text-sm text-slate-700">
          <input name="enabled" type="checkbox" defaultChecked={row?.enabled ?? true} className="h-4 w-4 rounded border-slate-300" />
          Show the button
        </label>
      </Grid>
    </>
  );
}

export default async function SocialAdmin() {
  const [socials, actions, settings] = await Promise.all([
    prisma.socialLink.findMany({ orderBy: { order: 'asc' } }),
    prisma.floatingAction.findMany({ orderBy: { order: 'asc' } }),
    prisma.siteSettings.findUnique({ where: { id: 'singleton' } }),
  ]);

  const legacy = [
    ['Instagram', settings?.instagram],
    ['TikTok', settings?.tiktok],
    ['LinkedIn', settings?.linkedin],
    ['X', settings?.x],
    ['YouTube', settings?.youtube],
  ].filter(([, url]) => Boolean(url)) as [string, string][];

  return (
    <>
      <PageHeader
        title="Social & contact"
        description="Social channels and the floating contact buttons. Nothing here is hard-coded in the site."
      />

      {socials.length === 0 && legacy.length > 0 && (
        <div className="mb-5 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          The footer is still using the older social fields from Site settings ({legacy.map(([n]) => n).join(', ')}).
          Add them below to manage them here — the old fields keep working until you do.
        </div>
      )}

      <Card title="Add a social channel" className="mb-5">
        <InlineForm action={saveSocialLink} submitLabel="Add channel">
          <SocialFields />
        </InlineForm>
      </Card>

      <Card title="Social channels" className="mb-8">
        {socials.length === 0 ? (
          <EmptyRow>No social channels yet.</EmptyRow>
        ) : (
          <ul className="space-y-6">
            {socials.map((row) => (
              <li key={row.id} className="border-b border-slate-100 pb-6 last:border-0 last:pb-0">
                <InlineForm
                  action={saveSocialLink}
                  after={
                    <form action={deleteSocialLink}>
                      <input type="hidden" name="id" value={row.id} />
                      <SubmitButton variant="danger" className="!px-3 !py-1.5 !text-xs" confirm={`Remove ${row.platform}?`}>
                        Remove
                      </SubmitButton>
                    </form>
                  }
                >
                  <SocialFields row={row} />
                </InlineForm>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <Card title="Add a floating contact button" className="mb-5">
        <InlineForm action={saveFloatingAction} submitLabel="Add button">
          <ActionFields />
        </InlineForm>
      </Card>

      <Card title="Floating contact buttons">
        {actions.length === 0 ? (
          <EmptyRow>No floating buttons — the site shows none.</EmptyRow>
        ) : (
          <ul className="space-y-6">
            {actions.map((row) => (
              <li key={row.id} className="border-b border-slate-100 pb-6 last:border-0 last:pb-0">
                <InlineForm
                  action={saveFloatingAction}
                  after={
                    <form action={deleteFloatingAction}>
                      <input type="hidden" name="id" value={row.id} />
                      <SubmitButton variant="danger" className="!px-3 !py-1.5 !text-xs" confirm={`Remove the ${row.kind} button?`}>
                        Remove
                      </SubmitButton>
                    </form>
                  }
                >
                  <ActionFields row={row} />
                </InlineForm>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </>
  );
}
