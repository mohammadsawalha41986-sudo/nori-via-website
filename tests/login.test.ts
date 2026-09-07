import { beforeEach, describe, expect, it, vi } from 'vitest';

/**
 * The sign-in action is the one door into the CMS, and every failure mode
 * behind it used to look the same from the outside: a wrong password, an
 * unreachable database and a missing AUTH_SECRET all ended the same way, the
 * last two as an unhandled crash on a page with no error boundary above it.
 * These lock in that each one now reports itself.
 */

const findUnique = vi.fn();
const verifyPassword = vi.fn();
const createSession = vi.fn();
const rateLimit = vi.fn();
const clearRateLimit = vi.fn();
const redirect = vi.fn(() => {
  throw new Error('NEXT_REDIRECT');
});

vi.mock('next/headers', () => ({
  headers: async () => new Headers({ 'x-forwarded-for': '203.0.113.7', 'user-agent': 'vitest' }),
}));
vi.mock('next/navigation', () => ({ redirect: (...args: unknown[]) => redirect(...(args as [])) }));
vi.mock('@/lib/db', () => ({ prisma: { adminUser: { findUnique: (...a: unknown[]) => findUnique(...a) } } }));
vi.mock('@/lib/auth', () => ({
  verifyPassword: (...a: unknown[]) => verifyPassword(...a),
  createSession: (...a: unknown[]) => createSession(...a),
  destroySession: vi.fn(),
}));
vi.mock('@/lib/rate-limit', () => ({
  rateLimit: (...a: unknown[]) => rateLimit(...a),
  clearRateLimit: (...a: unknown[]) => clearRateLimit(...a),
}));

const { loginAction } = await import('../src/app/admin/actions');

function form(email: string, password: string) {
  const fd = new FormData();
  fd.set('email', email);
  fd.set('password', password);
  return fd;
}

const account = { id: 'u1', email: 'owner@noriva.sa', passwordHash: 'hash', active: true };

beforeEach(() => {
  vi.clearAllMocks();
  rateLimit.mockResolvedValue({ ok: true, remaining: 7 });
  findUnique.mockResolvedValue(account);
  verifyPassword.mockResolvedValue(true);
  createSession.mockResolvedValue('token');
});

describe('signing in', () => {
  it('redirects into Admin and forgets the failed attempts that preceded it', async () => {
    await expect(loginAction({}, form('owner@noriva.sa', 'correct-horse'))).rejects.toThrow('NEXT_REDIRECT');
    expect(createSession).toHaveBeenCalledWith('u1', { ip: '203.0.113.7', userAgent: 'vitest' });
    expect(clearRateLimit).toHaveBeenCalledWith('login:203.0.113.7');
    expect(redirect).toHaveBeenCalledWith('/admin');
  });

  it('rejects a wrong password without saying whether the address exists', async () => {
    verifyPassword.mockResolvedValue(false);
    const state = await loginAction({}, form('owner@noriva.sa', 'wrong-password'));
    expect(state.error).toBe('Invalid email or password.');
    // Echoed back so the administrator does not retype it every attempt.
    expect(state.email).toBe('owner@noriva.sa');
    expect(clearRateLimit).not.toHaveBeenCalled();
  });

  it('gives an unknown address the same answer as a wrong password', async () => {
    findUnique.mockResolvedValue(null);
    expect((await loginAction({}, form('nobody@noriva.sa', 'whatever12'))).error).toBe('Invalid email or password.');
  });

  it('refuses a deactivated account', async () => {
    findUnique.mockResolvedValue({ ...account, active: false });
    expect((await loginAction({}, form('owner@noriva.sa', 'correct-horse'))).error).toBe('Invalid email or password.');
    expect(createSession).not.toHaveBeenCalled();
  });

  it('reports the lockout rather than checking the password', async () => {
    rateLimit.mockResolvedValue({ ok: false, remaining: 0 });
    const state = await loginAction({}, form('owner@noriva.sa', 'correct-horse'));
    expect(state.error).toMatch(/Too many attempts/);
    expect(findUnique).not.toHaveBeenCalled();
  });

  it('reports an unreachable database instead of crashing the page', async () => {
    findUnique.mockRejectedValue(new Error("Can't reach database server"));
    const state = await loginAction({}, form('owner@noriva.sa', 'correct-horse'));
    expect(state.error).toMatch(/temporarily unavailable/);
    expect(state.email).toBe('owner@noriva.sa');
  });

  it('reports a missing AUTH_SECRET instead of crashing the page', async () => {
    createSession.mockRejectedValue(new Error('AUTH_SECRET must be set to a random string of at least 32 characters.'));
    const state = await loginAction({}, form('owner@noriva.sa', 'correct-horse'));
    expect(state.error).toMatch(/temporarily unavailable/);
    expect(redirect).not.toHaveBeenCalled();
  });
});
