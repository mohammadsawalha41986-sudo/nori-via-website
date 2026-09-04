import clsx from 'clsx';

export type FloatingActionItem = { id: string; kind: string; label: string; value: string };

/**
 * Admin-configured quick contact buttons. Nothing here is hard-coded: an empty
 * configuration renders nothing at all.
 */
function hrefFor(action: FloatingActionItem): string | null {
  const value = action.value.trim();
  if (!value) return null;

  switch (action.kind) {
    case 'whatsapp': {
      const digits = value.replace(/[^\d]/g, '');
      return digits ? `https://wa.me/${digits}` : null;
    }
    case 'phone':
      return `tel:${value.replace(/\s/g, '')}`;
    case 'email':
      return `mailto:${value}`;
    case 'link':
      return value.startsWith('http') || value.startsWith('/') ? value : null;
    default:
      return null;
  }
}

function Icon({ kind }: { kind: string }) {
  const common = { width: 20, height: 20, viewBox: '0 0 24 24', 'aria-hidden': true } as const;

  if (kind === 'whatsapp') {
    return (
      <svg {...common} fill="currentColor">
        <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.46 1.32 4.96L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm0 18.02h-.01a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.11.82.83-3.04-.2-.31a8.17 8.17 0 0 1-1.26-4.35c0-4.54 3.7-8.23 8.24-8.23 2.2 0 4.27.86 5.82 2.42a8.18 8.18 0 0 1 2.41 5.82c0 4.54-3.69 8.2-8.23 8.2Zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.24-.64.8-.78.97-.15.16-.29.18-.54.06-.25-.13-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.01-.38.11-.5.11-.11.25-.29.37-.44.13-.15.17-.25.25-.41.09-.17.04-.31-.02-.44-.06-.12-.56-1.34-.76-1.84-.2-.48-.41-.42-.56-.43h-.48c-.16 0-.43.06-.65.31-.23.25-.86.84-.86 2.05s.88 2.38 1 2.54c.13.17 1.74 2.65 4.21 3.71.59.26 1.05.41 1.4.52.59.19 1.13.16 1.55.1.47-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.15-1.18-.06-.1-.22-.16-.47-.29Z" />
      </svg>
    );
  }
  if (kind === 'phone') {
    return (
      <svg {...common} fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.4-1.2a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2Z" />
      </svg>
    );
  }
  if (kind === 'email') {
    return (
      <svg {...common} fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="m2 7 10 6 10-6" />
      </svg>
    );
  }
  return (
    <svg {...common} fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2Z" />
    </svg>
  );
}

export function FloatingActions({ actions }: { actions: FloatingActionItem[] }) {
  const usable = actions
    .map((action) => ({ action, href: hrefFor(action) }))
    .filter((entry): entry is { action: FloatingActionItem; href: string } => entry.href !== null);

  if (usable.length === 0) return null;

  return (
    <div className="pointer-events-none fixed bottom-5 z-40 flex flex-col items-end gap-2.5 end-4 sm:bottom-7 sm:end-6">
      {usable.map(({ action, href }) => (
        <a
          key={action.id}
          href={href}
          target={action.kind === 'whatsapp' || action.kind === 'link' ? '_blank' : undefined}
          rel={action.kind === 'whatsapp' || action.kind === 'link' ? 'noopener noreferrer' : undefined}
          className={clsx(
            'pointer-events-auto group inline-flex items-center gap-2.5 rounded-btn px-4 py-3 text-sm font-semibold shadow-lg shadow-ink-900/15',
            'transition-transform duration-300 ease-noriva hover:-translate-y-0.5',
            action.kind === 'whatsapp' ? 'bg-[#25D366] text-white' : 'bg-ink-900 text-white',
          )}
        >
          <Icon kind={action.kind} />
          <span className="hidden sm:inline">{action.label}</span>
          <span className="sr-only sm:hidden">{action.label}</span>
        </a>
      ))}
    </div>
  );
}
