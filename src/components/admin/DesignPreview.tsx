import type { ResolvedTokens } from '@/lib/design-tokens';

/**
 * Renders the saved tokens as inline styles rather than Tailwind classes, so
 * this sample shows the public site's values inside the admin theme.
 */
export function DesignPreview({ tokens }: { tokens: ResolvedTokens }) {
  const { colors, shape, typography } = tokens;

  return (
    <div
      className="rounded-lg border border-slate-200 p-6"
      style={{ background: colors.background, fontSize: `${typography.baseSize}px` }}
    >
      <p
        style={{
          color: colors.ink,
          fontWeight: typography.headingWeight,
          letterSpacing: `${typography.headingTracking}em`,
          fontSize: '1.6rem',
          textTransform: 'uppercase',
        }}
      >
        Headline sample
      </p>
      <p style={{ color: colors.inkBody, lineHeight: typography.lineHeight, marginTop: '0.75rem', maxWidth: '46rem' }}>
        Body copy uses the body colour, the base size and the line height you set here. Arabic and English both follow
        these tokens.
      </p>
      <p style={{ color: colors.inkMuted, marginTop: '0.5rem', fontSize: '0.875rem' }}>Muted supporting text.</p>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginTop: '1.5rem', alignItems: 'center' }}>
        <span
          style={{
            background: colors.brand,
            color: '#fff',
            borderRadius: `${shape.radiusButton}px`,
            padding: '0.75rem 1.5rem',
            fontWeight: 600,
            fontSize: '0.9375rem',
          }}
        >
          Primary button
        </span>
        <span
          style={{
            border: `1px solid ${colors.border}`,
            color: colors.ink,
            borderRadius: `${shape.radiusButton}px`,
            padding: '0.75rem 1.5rem',
            fontWeight: 600,
            fontSize: '0.9375rem',
          }}
        >
          Secondary
        </span>
        <span
          style={{
            background: colors.brandDark,
            color: '#fff',
            borderRadius: `${shape.radiusButton}px`,
            padding: '0.75rem 1.5rem',
            fontWeight: 600,
            fontSize: '0.9375rem',
          }}
        >
          Pressed
        </span>
      </div>

      <div
        style={{
          marginTop: '1.5rem',
          background: '#fff',
          border: `1px solid ${colors.border}`,
          borderRadius: `${shape.radiusCard}px`,
          padding: '1.5rem',
          maxWidth: '24rem',
        }}
      >
        <p style={{ color: colors.brand, fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.2em' }}>CARD</p>
        <p style={{ color: colors.ink, fontWeight: typography.headingWeight, marginTop: '0.5rem' }}>Card surface</p>
        <p style={{ color: colors.inkMuted, marginTop: '0.5rem', fontSize: '0.875rem' }}>
          Card radius {shape.radiusCard}px · input radius {shape.radiusInput}px
        </p>
      </div>
    </div>
  );
}
