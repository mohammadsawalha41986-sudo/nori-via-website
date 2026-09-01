'use server';

import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { prisma } from '@/lib/db';
import { loginSchema } from '@/lib/validation';
import { verifyPassword, createSession, destroySession } from '@/lib/auth';
import { rateLimit } from '@/lib/rate-limit';

export type LoginState = { error?: string; email?: string };

export async function loginAction(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const h = await headers();
  const ip = h.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';

  // Echoed back so a failed attempt does not clear what the user typed.
  const email = String(formData.get('email') ?? '');

  const limit = await rateLimit(`login:${ip}`, 8, 15 * 60 * 1000);
  if (!limit.ok) return { email, error: 'Too many attempts. Please wait 15 minutes and try again.' };

  const parsed = loginSchema.safeParse({ email, password: formData.get('password') });
  // Deliberately vague: never reveal whether the address exists.
  if (!parsed.success) return { email, error: 'Invalid email or password.' };

  const user = await prisma.adminUser.findUnique({ where: { email: parsed.data.email.toLowerCase() } });
  if (!user || !user.active || !(await verifyPassword(parsed.data.password, user.passwordHash))) {
    return { email, error: 'Invalid email or password.' };
  }

  await createSession(user.id, { ip, userAgent: h.get('user-agent') ?? undefined });
  redirect('/admin');
}

export async function logoutAction() {
  await destroySession();
  redirect('/admin/login');
}
