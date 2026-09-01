import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getSessionUser } from '@/lib/auth';
import { AdminShell } from '@/components/admin/AdminShell';
import { fontVars } from '@/app/fonts';
import '@/app/globals.css';

export const metadata: Metadata = {
  title: { default: 'Noriva Admin', template: '%s — Noriva Admin' },
  robots: { index: false, follow: false, nocache: true },
};

export const dynamic = 'force-dynamic';

export default async function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getSessionUser();
  if (!user) redirect('/admin/login');

  return (
    <html lang="en" dir="ltr" className={fontVars}>
      <body className="bg-slate-100 text-slate-900 antialiased">
        <AdminShell user={user}>{children}</AdminShell>
      </body>
    </html>
  );
}
