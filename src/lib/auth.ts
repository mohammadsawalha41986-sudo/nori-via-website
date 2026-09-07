import 'server-only';
import { createHash, randomBytes } from 'node:crypto';
import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';
import { SignJWT, jwtVerify } from 'jose';
import { prisma } from './db';
import { assertAuthSecret } from './env';
import type { Role } from '@prisma/client';

export const SESSION_COOKIE = 'noriva_session';
const SESSION_DAYS = 7;

export type SessionUser = { id: string; email: string; name: string; role: Role };

function secretKey() {
  return new TextEncoder().encode(assertAuthSecret());
}

/** Sessions are stored hashed so a database leak cannot be replayed as a login. */
function hashToken(token: string) {
  return createHash('sha256').update(token).digest('hex');
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export async function createSession(userId: string, meta: { ip?: string; userAgent?: string } = {}) {
  const token = randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 864e5);

  await prisma.adminSession.create({
    data: { userId, tokenHash: hashToken(token), expiresAt, ip: meta.ip, userAgent: meta.userAgent?.slice(0, 255) },
  });

  const jwt = await new SignJWT({ sid: token, uid: userId })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DAYS}d`)
    .sign(secretKey());

  const store = await cookies();
  store.set(SESSION_COOKIE, jwt, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    expires: expiresAt,
  });

  await prisma.adminUser.update({ where: { id: userId }, data: { lastLoginAt: new Date() } });
  return token;
}

export async function getSessionUser(): Promise<SessionUser | null> {
  const store = await cookies();
  const raw = store.get(SESSION_COOKIE)?.value;
  if (!raw) return null;

  let sid: string;
  try {
    const { payload } = await jwtVerify(raw, secretKey());
    sid = String(payload.sid || '');
  } catch {
    return null;
  }
  if (!sid) return null;

  const session = await prisma.adminSession.findUnique({
    where: { tokenHash: hashToken(sid) },
    include: { user: true },
  });

  if (!session || session.expiresAt < new Date() || !session.user.active) return null;

  const { id, email, name, role } = session.user;
  return { id, email, name, role };
}

export async function requireUser(): Promise<SessionUser> {
  const user = await getSessionUser();
  if (!user) throw new AuthError('Not authenticated');
  return user;
}

export async function requireOwner(): Promise<SessionUser> {
  const user = await requireUser();
  if (user.role !== 'OWNER') throw new AuthError('Not authorised');
  return user;
}

/**
 * The hashed id of the session making this request, or null. Used to change a
 * password without signing the administrator out of the tab they are working
 * in while every other session is revoked.
 */
async function currentTokenHash(): Promise<string | null> {
  const store = await cookies();
  const raw = store.get(SESSION_COOKIE)?.value;
  if (!raw) return null;
  try {
    const { payload } = await jwtVerify(raw, secretKey());
    const sid = String(payload.sid || '');
    return sid ? hashToken(sid) : null;
  } catch {
    return null;
  }
}

/**
 * Replaces a password and revokes every session but this one.
 *
 * Changing a password has to end anyone else's access: a password is changed
 * precisely when it may have been seen, and a session cookie outlives it
 * otherwise. The caller has already proved it knows the current password.
 */
export async function changePassword(userId: string, newPassword: string) {
  const keep = await currentTokenHash();

  await prisma.adminUser.update({
    where: { id: userId },
    data: { passwordHash: await hashPassword(newPassword) },
  });

  const { count } = await prisma.adminSession.deleteMany({
    where: { userId, ...(keep ? { NOT: { tokenHash: keep } } : {}) },
  });

  return { revokedSessions: count };
}

export async function destroySession() {
  const store = await cookies();
  const raw = store.get(SESSION_COOKIE)?.value;
  if (raw) {
    try {
      const { payload } = await jwtVerify(raw, secretKey());
      const sid = String(payload.sid || '');
      if (sid) await prisma.adminSession.deleteMany({ where: { tokenHash: hashToken(sid) } });
    } catch {
      /* expired or tampered token — clearing the cookie is enough */
    }
  }
  store.delete(SESSION_COOKIE);
}

export class AuthError extends Error {}

export async function pruneExpiredSessions() {
  await prisma.adminSession.deleteMany({ where: { expiresAt: { lt: new Date() } } });
}
