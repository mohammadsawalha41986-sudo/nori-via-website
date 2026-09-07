import { prisma } from '@/lib/db';
import { requireUser } from '@/lib/auth';
import { MIN_PASSWORD_LENGTH } from '@/lib/validation';
import { PageHeader, Card } from '@/components/admin/ui';
import { PasswordForm } from '@/components/admin/PasswordForm';

export const metadata = { title: 'Your account' };
export const dynamic = 'force-dynamic';

function when(date: Date | null) {
  if (!date) return '—';
  return new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'UTC' }).format(date) + ' UTC';
}

export default async function AccountAdmin() {
  const user = await requireUser();
  const [row, sessions] = await Promise.all([
    prisma.adminUser.findUnique({ where: { id: user.id } }),
    prisma.adminSession.count({ where: { userId: user.id, expiresAt: { gt: new Date() } } }),
  ]);

  return (
    <>
      <PageHeader title="Your account" description="Your sign-in details for the Noriva CMS." />

      <div className="grid gap-5 lg:grid-cols-2">
        <Card title="Account" description="Sign in with this address.">
          <dl className="space-y-3 text-sm">
            <div>
              <dt className="text-xs font-medium text-slate-500">Email</dt>
              <dd className="text-slate-900" dir="ltr">{user.email}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium text-slate-500">Name</dt>
              <dd className="text-slate-900">{user.name}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium text-slate-500">Role</dt>
              <dd className="text-slate-900">{user.role}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium text-slate-500">Last sign-in</dt>
              <dd className="text-slate-900">{when(row?.lastLoginAt ?? null)}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium text-slate-500">Active sessions</dt>
              <dd className="text-slate-900">
                {sessions} {sessions === 1 ? 'device' : 'devices'}
              </dd>
            </div>
          </dl>
        </Card>

        <Card
          title="Change password"
          description="Changing it signs out every other device. This one stays signed in."
        >
          <PasswordForm minLength={MIN_PASSWORD_LENGTH} />
          <p className="mt-5 border-t border-slate-100 pt-4 text-xs text-slate-500">
            Once you have set a password here, delete <code className="font-mono">ADMIN_PASSWORD</code> from the
            hosting environment. It is only read when provisioning an account, and it is not what signs you in.
          </p>
        </Card>
      </div>
    </>
  );
}
