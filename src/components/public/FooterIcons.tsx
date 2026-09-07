/**
 * The footer's glyph set.
 *
 * Inline SVG rather than an icon dependency: there are only a handful of
 * shapes, they never change at runtime, and inlining them keeps the footer a
 * server component with no extra request before first paint.
 *
 * Every icon is decorative — the label next to it, or the link's own
 * `aria-label`, carries the meaning — so each one is marked `aria-hidden`.
 */

type IconProps = { className?: string };

const stroke = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

function Frame({ className, children }: IconProps & { children: React.ReactNode }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className ?? 'h-4 w-4'}>
      {children}
    </svg>
  );
}

export function MailIcon(props: IconProps) {
  return (
    <Frame {...props}>
      <rect x="3" y="5.5" width="18" height="13" rx="2" {...stroke} />
      <path d="m3.8 7 8.2 6 8.2-6" {...stroke} />
    </Frame>
  );
}

export function PhoneIcon(props: IconProps) {
  return (
    <Frame {...props}>
      <path
        d="M6.2 3.6h3l1.4 3.5-2 1.4a10.5 10.5 0 0 0 5 5l1.4-2 3.5 1.4v3a1.7 1.7 0 0 1-1.9 1.7A14.4 14.4 0 0 1 4.5 5.5 1.7 1.7 0 0 1 6.2 3.6Z"
        {...stroke}
      />
    </Frame>
  );
}

export function PinIcon(props: IconProps) {
  return (
    <Frame {...props}>
      <path d="M12 21s6.4-6.1 6.4-11A6.4 6.4 0 0 0 5.6 10c0 4.9 6.4 11 6.4 11Z" {...stroke} />
      <circle cx="12" cy="10" r="2.3" {...stroke} />
    </Frame>
  );
}

export function GlobeIcon(props: IconProps) {
  return (
    <Frame {...props}>
      <circle cx="12" cy="12" r="8.4" {...stroke} />
      <path d="M3.6 12h16.8M12 3.6c2.2 2.3 3.3 5.1 3.3 8.4S14.2 18.1 12 20.4c-2.2-2.3-3.3-5.1-3.3-8.4S9.8 5.9 12 3.6Z" {...stroke} />
    </Frame>
  );
}

export function ArrowIcon(props: IconProps) {
  return (
    // Mirrored under RTL so the arrow always points the way the text reads.
    <svg
      viewBox="0 0 24 24"
      aria-hidden
      className={`${props.className ?? 'h-4 w-4'} rtl:-scale-x-100`}
    >
      <path d="M4 12h15m-6-6 6 6-6 6" {...stroke} />
    </svg>
  );
}

export function ChevronIcon(props: IconProps) {
  return (
    <Frame {...props}>
      <path d="m6 9.5 6 6 6-6" {...stroke} />
    </Frame>
  );
}

/**
 * Social marks, keyed by the platform stored on each social row in Admin. An
 * unrecognised platform falls back to a globe, so adding a channel in Admin
 * never renders an empty circle.
 */
const SOCIAL_PATHS: Record<string, React.ReactNode> = {
  linkedin: (
    <path
      d="M6.94 8.5H4.06V20h2.88V8.5ZM5.5 4a1.7 1.7 0 1 0 0 3.4 1.7 1.7 0 0 0 0-3.4ZM20 13.7c0-3.1-1.65-4.5-3.85-4.5-1.77 0-2.57.97-3.02 1.66V8.5H10.3V20h2.88v-6.1c0-1.6.3-2.6 1.83-2.6 1.48 0 1.7 1.15 1.7 2.7V20H20v-6.3Z"
      fill="currentColor"
    />
  ),
  instagram: (
    <>
      <rect x="3.4" y="3.4" width="17.2" height="17.2" rx="5" {...stroke} />
      <circle cx="12" cy="12" r="4" {...stroke} />
      <circle cx="17" cy="7" r="1.15" fill="currentColor" />
    </>
  ),
  youtube: (
    <>
      <rect x="2.6" y="5.6" width="18.8" height="12.8" rx="4" {...stroke} />
      <path d="M10.4 9.5v5l4.4-2.5-4.4-2.5Z" fill="currentColor" />
    </>
  ),
  x: (
    <path
      d="M4 4h3.7l4.06 5.44L16.5 4H20l-6.16 7.02L20.4 20h-3.72l-4.3-5.76L7.2 20H3.7l6.4-7.3L4 4Z"
      fill="currentColor"
    />
  ),
  tiktok: (
    <path
      d="M13.4 3h2.5c.2 1.9 1.4 3.2 3.3 3.4v2.5a6.3 6.3 0 0 1-3.3-1.05v5.6a5.1 5.1 0 1 1-5.1-5.1c.27 0 .53.02.78.07v2.6a2.5 2.5 0 1 0 1.82 2.4V3Z"
      fill="currentColor"
    />
  ),
  facebook: (
    <path
      d="M13.6 20v-7h2.4l.4-2.9h-2.8V8.3c0-.84.23-1.4 1.43-1.4H16.5V4.2A19 19 0 0 0 14.4 4c-2.13 0-3.6 1.3-3.6 3.7v2.4H8.4V13h2.4v7h2.8Z"
      fill="currentColor"
    />
  ),
  whatsapp: (
    <path
      d="M12 3.4a8.6 8.6 0 0 0-7.3 13.1L3.4 20.6l4.2-1.25A8.6 8.6 0 1 0 12 3.4Zm4.5 11.9c-.2.55-1.15 1.07-1.6 1.1-.44.04-.83.15-2.6-.68-2.1-.98-3.4-3.2-3.5-3.35-.1-.15-.8-1.15-.8-2.2 0-1.05.55-1.55.75-1.77.2-.22.43-.27.58-.27h.42c.13 0 .32-.05.5.38.17.43.6 1.5.65 1.6.05.1.08.23 0 .37-.08.15-.42.6-.6.78-.12.13-.25.27-.1.52.15.25.65 1.07 1.4 1.73.96.85 1.75 1.12 2 1.25.25.12.4.1.55-.06.15-.17.62-.72.79-.97.17-.25.34-.2.57-.12.23.08 1.45.68 1.7.8.25.13.42.2.48.3.07.1.07.6-.13 1.16Z"
      fill="currentColor"
    />
  ),
  snapchat: (
    <path
      d="M12 3.6c2.4 0 3.9 1.7 3.9 4.1 0 .9-.07 1.6-.1 2 .3.16.75.2 1.2.03.6-.22 1.1.55.6.98-.4.34-1.2.6-1.3.95-.1.4 1 2.4 3 3 .5.15.4.7-.1.9-.7.28-1.6.2-1.9.5-.2.2-.1.7-.5.85-.5.18-1.4-.3-2.4-.05-.9.23-1.4 1.24-2.4 1.24s-1.5-1-2.4-1.24c-1-.25-1.9.23-2.4.05-.4-.15-.3-.65-.5-.85-.3-.3-1.2-.22-1.9-.5-.5-.2-.6-.75-.1-.9 2-.6 3.1-2.6 3-3-.1-.35-.9-.6-1.3-.95-.5-.43 0-1.2.6-.98.45.17.9.13 1.2-.03-.03-.4-.1-1.1-.1-2 0-2.4 1.5-4.1 3.9-4.1Z"
      fill="currentColor"
    />
  ),
  threads: (
    <path
      d="M12.2 3.6c4.3 0 6.6 2.6 6.9 6.7l-1.9.2c-.25-3-1.7-4.9-5-4.9-3.4 0-5.2 2.4-5.2 6.4 0 4.1 1.9 6.4 5.3 6.4 2.4 0 3.9-1 3.9-2.6 0-1.1-.8-1.9-2.2-2.2.1 1.9-.9 3.2-2.7 3.2-1.6 0-2.7-1-2.7-2.5 0-1.8 1.5-2.9 3.9-2.9h.7c0-1-.5-1.6-1.5-1.6-.7 0-1.2.3-1.5.9l-1.7-.8c.6-1.2 1.7-1.9 3.2-1.9 2.2 0 3.4 1.3 3.4 3.7v.1c2 .5 3.1 1.9 3.1 3.9 0 2.8-2.4 4.6-5.9 4.6-4.7 0-7.4-3-7.4-8.3 0-5.2 2.7-8.3 7.3-8.3Zm.1 9.9c-1.3 0-2 .4-2 1.2 0 .5.4.9 1 .9.9 0 1.4-.7 1.3-2.1h-.3Z"
      fill="currentColor"
    />
  ),
  pinterest: (
    <path
      d="M12 3.6a8.4 8.4 0 0 0-3.1 16.2l.9-3.3c-.25-.5-.4-1.1-.4-1.7 0-2.2 1.5-4.1 3.9-4.1 2 0 3.5 1.4 3.5 3.4 0 2.4-1.3 4.3-3.1 4.3-.9 0-1.5-.7-1.3-1.6l.6-2.3c.15-.6-.15-1.1-.7-1.1-.75 0-1.3.8-1.3 1.85 0 .5.15.85.15.85l-1.1 4.4A8.4 8.4 0 1 0 12 3.6Z"
      fill="currentColor"
    />
  ),
};

export function SocialIcon({ platform, className }: { platform: string; className?: string }) {
  const glyph = SOCIAL_PATHS[platform];
  if (!glyph) return <GlobeIcon className={className} />;
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className ?? 'h-4 w-4'}>
      {glyph}
    </svg>
  );
}
