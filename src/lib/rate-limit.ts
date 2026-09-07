import 'server-only';
import { prisma } from './db';

/**
 * Database-backed fixed-window limiter. Deliberately simple: the site is a
 * lead-capture form, not a high-throughput API, and this survives restarts
 * and multiple Node processes without extra infrastructure.
 */
export async function rateLimit(bucket: string, limit: number, windowMs: number) {
  const since = new Date(Date.now() - windowMs);
  await prisma.rateLimitHit.deleteMany({ where: { createdAt: { lt: new Date(Date.now() - 864e5) } } });

  const used = await prisma.rateLimitHit.count({ where: { bucket, createdAt: { gte: since } } });
  if (used >= limit) return { ok: false as const, remaining: 0 };

  await prisma.rateLimitHit.create({ data: { bucket } });
  return { ok: true as const, remaining: limit - used - 1 };
}

/**
 * Forget a bucket's recorded attempts. Used after a successful sign-in so an
 * administrator who mistyped their password several times is not then locked
 * out for fifteen minutes by the attempts that led up to getting it right.
 */
export async function clearRateLimit(bucket: string) {
  await prisma.rateLimitHit.deleteMany({ where: { bucket } });
}

export function clientIp(req: Request) {
  const h = req.headers;
  const fwd = h.get('x-forwarded-for');
  if (fwd) return fwd.split(',')[0]!.trim();
  return h.get('x-real-ip') || h.get('cf-connecting-ip') || 'unknown';
}
