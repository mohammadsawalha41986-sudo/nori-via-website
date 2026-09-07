'use server';

import { prisma } from '@/lib/db';
import { requireUser, verifyPassword, changePassword } from '@/lib/auth';
import { changePasswordSchema, MIN_PASSWORD_LENGTH } from '@/lib/validation';
import { rateLimit } from '@/lib/rate-limit';
import type { ActionState } from './helpers';

/**
 * Changing your own password. Until this existed the only way to set an
 * administrator's password was to redeploy with ADMIN_PASSWORD and the
 * `--admin` flag, which meant the credential lived in the hosting panel and
 * every rotation was a deployment.
 */
export async function changePasswordAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const user = await requireUser();

  try {
    // A stolen session should not become a way to guess the password that
    // would survive signing that session out.
    const limit = await rateLimit(`password:${user.id}`, 5, 15 * 60 * 1000);
    if (!limit.ok) return { error: 'Too many attempts. Please wait 15 minutes and try again.' };

    const currentPassword = String(formData.get('currentPassword') ?? '');
    const newPassword = String(formData.get('newPassword') ?? '');
    const confirmPassword = String(formData.get('confirmPassword') ?? '');

    const parsed = changePasswordSchema.safeParse({ currentPassword, newPassword });
    if (!parsed.success) {
      return {
        error: currentPassword
          ? `The new password must be at least ${MIN_PASSWORD_LENGTH} characters.`
          : 'Enter your current password.',
      };
    }

    if (newPassword !== confirmPassword) return { error: 'The two new passwords do not match.' };
    if (newPassword === currentPassword) return { error: 'The new password is the same as the current one.' };

    const row = await prisma.adminUser.findUnique({ where: { id: user.id } });
    if (!row || !row.active) return { error: 'This account is no longer active.' };
    if (!(await verifyPassword(currentPassword, row.passwordHash))) {
      return { error: 'The current password is not correct.' };
    }

    const { revokedSessions } = await changePassword(user.id, newPassword);

    return {
      ok: true,
      error: undefined,
      message:
        revokedSessions > 0
          ? `Password changed. ${revokedSessions} other ${revokedSessions === 1 ? 'session was' : 'sessions were'} signed out.`
          : 'Password changed.',
    };
  } catch (err) {
    console.error('[noriva] password change failed', err);
    return { error: 'The password could not be changed. Please try again in a moment.' };
  }
}
