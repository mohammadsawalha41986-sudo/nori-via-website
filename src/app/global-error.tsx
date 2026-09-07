'use client';

import { useEffect } from 'react';

/**
 * The last boundary in the app. Admin has no `<html>`-providing layout above
 * its pages, so a failure while signing in has nowhere else to land: without
 * this, the browser shows an unstyled crash page and the administrator is told
 * nothing at all.
 *
 * The common cause is a stale tab. Server Action ids are minted per build, so
 * a login page left open across a deploy posts an id the new server does not
 * know ("Failed to find Server Action") and the sign-in silently fails. A
 * reload fetches the current page and the same credentials then work, which is
 * why reloading — not retrying the dead action — is the primary button here.
 */
export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error('[noriva] unhandled error', error.digest ?? error.message);
  }, [error]);

  return (
    <html lang="en">
      <body style={{ margin: 0 }}>
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '3rem 1.25rem',
            background: '#080C18',
            color: '#fff',
            fontFamily: 'ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif',
          }}
        >
          <div style={{ maxWidth: '28rem', textAlign: 'center' }}>
            <h1 style={{ fontSize: '1.125rem', fontWeight: 600, margin: 0 }}>Something went wrong.</h1>
            <p style={{ marginTop: '0.75rem', fontSize: '0.875rem', lineHeight: 1.6, color: 'rgba(255,255,255,0.5)' }}>
              If you were signing in, this page was probably left open while the site was updated. Reload and sign in
              again — your email and password have not changed.
            </p>
            <div style={{ marginTop: '1.75rem', display: 'flex', gap: '0.625rem', justifyContent: 'center' }}>
              <button
                type="button"
                onClick={() => window.location.reload()}
                style={{
                  borderRadius: '0.5rem',
                  border: 0,
                  background: '#F5106E',
                  color: '#fff',
                  padding: '0.75rem 1.25rem',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Reload the page
              </button>
              <button
                type="button"
                onClick={reset}
                style={{
                  borderRadius: '0.5rem',
                  border: '1px solid rgba(255,255,255,0.16)',
                  background: 'transparent',
                  color: '#fff',
                  padding: '0.75rem 1.25rem',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Try again
              </button>
            </div>
            {error.digest && (
              <p style={{ marginTop: '1.5rem', fontSize: '0.75rem', color: 'rgba(255,255,255,0.25)' }}>
                Reference: {error.digest}
              </p>
            )}
          </div>
        </div>
      </body>
    </html>
  );
}
