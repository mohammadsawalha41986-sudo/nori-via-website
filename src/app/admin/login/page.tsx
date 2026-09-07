import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getSessionUser } from '@/lib/auth';
import { LoginForm } from '@/components/admin/LoginForm';
import { fontVars } from '@/app/fonts';
import '@/app/globals.css';

export const metadata: Metadata = {
  title: 'Sign in — Noriva Admin',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

/**
 * Reading the existing session must never stop the form from rendering. If
 * the database is unreachable or AUTH_SECRET is missing, the visitor is not
 * signed in either way — showing the form (and letting the sign-in attempt
 * report the real fault) beats a crash on the one page used to recover.
 */
async function currentUser() {
  try {
    return await getSessionUser();
  } catch (err) {
    console.error('[noriva] could not read the session on the login page', err);
    return null;
  }
}

export default async function LoginPage() {
  const user = await currentUser();
  if (user) redirect('/admin');

  return (
    <html lang="en" className={fontVars}>
      <body className="flex min-h-screen items-center justify-center bg-ink-950 px-5 py-12">
        <div className="w-full max-w-sm">
          <div className="mb-9 text-center">
            <svg viewBox="0 0 40 36" className="mx-auto h-9 w-10" role="img" aria-label="Noriva">
              <path d="M3 4h9v28H3V4Z" fill="#fff" />
              <path d="M28 4h9v28h-9V4Z" fill="#fff" />
              <path d="M3 4h9l25 28h-9L3 4Z" fill="#F5106E" />
            </svg>
            <h1 className="mt-5 text-lg font-semibold text-white">Noriva Admin</h1>
            <p className="mt-1.5 text-sm text-white/40">Sign in to manage the website.</p>
          </div>

          <LoginForm />

          <p className="mt-8 text-center text-xs text-white/25">
            Authorised access only. All sign-ins are recorded.
          </p>
        </div>
      </body>
    </html>
  );
}
