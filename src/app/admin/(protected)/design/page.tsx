import { PageHeader, Card, Field, Grid, inputClass } from '@/components/admin/ui';
import { AdminForm } from '@/components/admin/AdminForm';
import { SubmitButton } from '@/components/admin/SubmitButton';
import { DesignPreview } from '@/components/admin/DesignPreview';
import { saveDesignTokens, resetDesignTokens } from '@/server/platform-actions';
import {
  getDesignTokens,
  COLOR_TOKENS,
  SANS_FONTS,
  DISPLAY_FONTS,
  ARABIC_FONTS,
  TOKEN_DEFAULTS,
} from '@/lib/design-tokens';

export const metadata = { title: 'Design system' };
export const dynamic = 'force-dynamic';

/**
 * A Server Component: it reads the saved tokens directly from the database and
 * hands `AdminForm` (a Client Component) plain serialisable children. The
 * render-prop form of `AdminForm` is only available to Client Components,
 * because a function cannot cross the server/client boundary.
 */
export default async function DesignSystemAdmin() {
  const tokens = await getDesignTokens();

  return (
    <>
      <PageHeader
        title="Design system"
        description="Brand colours, typography and shape for the public site. Changes apply everywhere the moment you save."
      />

      <AdminForm action={saveDesignTokens} className="space-y-5">
        <Card title="Colours" description="Used across buttons, headings, borders and backgrounds.">
          <Grid cols={3}>
            {COLOR_TOKENS.map((token) => (
              <Field
                key={token.key}
                label={token.label}
                htmlFor={`color-${token.key}`}
                hint={`Default ${token.default}`}
              >
                <div className="flex gap-2">
                  <input
                    id={`color-${token.key}`}
                    name={`color.${token.key}`}
                    type="color"
                    defaultValue={tokens.colors[token.key]}
                    aria-label={`${token.label} colour swatch`}
                    className="h-[38px] w-12 shrink-0 cursor-pointer rounded-md border border-slate-300 bg-white p-1"
                  />
                  <input
                    name={`color.${token.key}`}
                    type="text"
                    defaultValue={tokens.colors[token.key]}
                    dir="ltr"
                    aria-label={`${token.label} hex value`}
                    className={inputClass}
                  />
                </div>
              </Field>
            ))}
          </Grid>
          <p className="mt-4 text-xs text-slate-400">
            Both fields write the same token — use the swatch to pick, or paste a hex value.
          </p>
        </Card>

        <Card title="Typography" description="Fonts are self-hosted; only these vetted families can be selected.">
          <Grid cols={3}>
            <Field label="English body font" htmlFor="type-sans">
              <select id="type-sans" name="type.sansFont" defaultValue={tokens.typography.sansFont} className={inputClass}>
                {SANS_FONTS.map((f) => (
                  <option key={f.key} value={f.key}>{f.label}</option>
                ))}
              </select>
            </Field>
            <Field label="Display / heading font" htmlFor="type-display">
              <select
                id="type-display"
                name="type.displayFont"
                defaultValue={tokens.typography.displayFont}
                className={inputClass}
              >
                {DISPLAY_FONTS.map((f) => (
                  <option key={f.key} value={f.key}>{f.label}</option>
                ))}
              </select>
            </Field>
            <Field label="Arabic font" htmlFor="type-arabic">
              <select
                id="type-arabic"
                name="type.arabicFont"
                defaultValue={tokens.typography.arabicFont}
                className={inputClass}
              >
                {ARABIC_FONTS.map((f) => (
                  <option key={f.key} value={f.key}>{f.label}</option>
                ))}
              </select>
            </Field>

            <Field label="Base font size (px)" htmlFor="type-size" hint="14–20">
              <input
                id="type-size"
                name="type.baseSize"
                type="number"
                min={14}
                max={20}
                step={0.5}
                defaultValue={tokens.typography.baseSize}
                className={inputClass}
              />
            </Field>
            <Field label="Body line height" htmlFor="type-leading" hint="1.3–2.2">
              <input
                id="type-leading"
                name="type.lineHeight"
                type="number"
                min={1.3}
                max={2.2}
                step={0.05}
                defaultValue={tokens.typography.lineHeight}
                className={inputClass}
              />
            </Field>
            <Field label="Heading weight" htmlFor="type-weight" hint="400–900">
              <input
                id="type-weight"
                name="type.headingWeight"
                type="number"
                min={400}
                max={900}
                step={100}
                defaultValue={tokens.typography.headingWeight}
                className={inputClass}
              />
            </Field>
            <Field label="Heading letter spacing (em)" htmlFor="type-tracking" hint="-0.06 to 0.06">
              <input
                id="type-tracking"
                name="type.headingTracking"
                type="number"
                min={-0.06}
                max={0.06}
                step={0.005}
                defaultValue={tokens.typography.headingTracking}
                className={inputClass}
              />
            </Field>
          </Grid>
        </Card>

        <Card title="Shape & spacing" description="Corner radii, page width and section rhythm.">
          <Grid cols={3}>
            <Field label="Button radius (px)" htmlFor="shape-btn" hint="999 = fully rounded">
              <input
                id="shape-btn"
                name="shape.radiusButton"
                type="number"
                min={0}
                max={999}
                defaultValue={tokens.shape.radiusButton}
                className={inputClass}
              />
            </Field>
            <Field label="Card radius (px)" htmlFor="shape-card" hint="0–64">
              <input
                id="shape-card"
                name="shape.radiusCard"
                type="number"
                min={0}
                max={64}
                defaultValue={tokens.shape.radiusCard}
                className={inputClass}
              />
            </Field>
            <Field label="Input radius (px)" htmlFor="shape-input" hint="0–64">
              <input
                id="shape-input"
                name="shape.radiusInput"
                type="number"
                min={0}
                max={64}
                defaultValue={tokens.shape.radiusInput}
                className={inputClass}
              />
            </Field>
            <Field label="Container width (rem)" htmlFor="shape-container" hint="64–160">
              <input
                id="shape-container"
                name="shape.containerWidth"
                type="number"
                min={64}
                max={160}
                defaultValue={tokens.shape.containerWidth}
                className={inputClass}
              />
            </Field>
            <Field label="Section spacing (rem)" htmlFor="shape-section" hint="3–12">
              <input
                id="shape-section"
                name="shape.sectionSpacing"
                type="number"
                min={3}
                max={12}
                step={0.5}
                defaultValue={tokens.shape.sectionSpacing}
                className={inputClass}
              />
            </Field>
          </Grid>
        </Card>

        <Card title="Preview" description="A live sample of the saved tokens. Open Preview for the full site.">
          <DesignPreview tokens={tokens} />
        </Card>
      </AdminForm>

      <form action={resetDesignTokens} className="mt-4">
        <SubmitButton
          variant="danger"
          confirm={`Reset every design token back to the Noriva defaults (brand ${TOKEN_DEFAULTS.colors.brand})?`}
        >
          Reset to brand defaults
        </SubmitButton>
      </form>
    </>
  );
}
