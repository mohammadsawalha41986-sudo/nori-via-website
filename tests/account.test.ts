import { beforeEach, describe, expect, it, vi } from 'vitest';

/**
 * Until this action existed there was no way to change an administrator's
 * password at all: the CMS had no screen for it, and the provisioning script
 * was the only thing that ever wrote `passwordHash`. These cover the rules
 * that make a self-service change safe to expose.
 */

const findUnique = vi.fn();
const verifyPassword = vi.fn();
const changePassword = vi.fn();
const rateLimit = vi.fn();
const requireUser = vi.fn();

vi.mock('@/lib/db', () => ({ prisma: { adminUser: { findUnique: (...a: unknown[]) => findUnique(...a) } } }));
vi.mock('@/lib/auth', () => ({
  requireUser: () => requireUser(),
  verifyPassword: (...a: unknown[]) => verifyPassword(...a),
  changePassword: (...a: unknown[]) => changePassword(...a),
}));
vi.mock('@/lib/rate-limit', () => ({ rateLimit: (...a: unknown[]) => rateLimit(...a) }));

const { changePasswordAction } = await import('../src/server/account-actions');

function form(current: string, next: string, confirm = next) {
  const fd = new FormData();
  fd.set('currentPassword', current);
  fd.set('newPassword', next);
  fd.set('confirmPassword', confirm);
  return fd;
}

beforeEach(() => {
  vi.clearAllMocks();
  requireUser.mockResolvedValue({ id: 'u1', email: 'owner@noriva.sa', name: 'Owner', role: 'OWNER' });
  rateLimit.mockResolvedValue({ ok: true, remaining: 4 });
  findUnique.mockResolvedValue({ id: 'u1', passwordHash: 'hash', active: true });
  verifyPassword.mockResolvedValue(true);
  changePassword.mockResolvedValue({ revokedSessions: 0 });
});

describe('changing your own password', () => {
  it('changes it and says how many other sessions were signed out', async () => {
    changePassword.mockResolvedValue({ revokedSessions: 2 });
    const state = await changePasswordAction({}, form('old-password', 'a-much-longer-one'));
    expect(state.ok).toBe(true);
    expect(state.message).toBe('Password changed. 2 other sessions were signed out.');
    expect(changePassword).toHaveBeenCalledWith('u1', 'a-much-longer-one');
  });

  it('counts one revoked session in the singular', async () => {
    changePassword.mockResolvedValue({ revokedSessions: 1 });
    expect((await changePasswordAction({}, form('old-password', 'a-much-longer-one'))).message).toBe(
      'Password changed. 1 other session was signed out.',
    );
  });

  it('requires the current password to be right', async () => {
    verifyPassword.mockResolvedValue(false);
    const state = await changePasswordAction({}, form('wrong-password', 'a-much-longer-one'));
    expect(state.error).toBe('The current password is not correct.');
    expect(changePassword).not.toHaveBeenCalled();
  });

  it('refuses a new password shorter than the provisioning scripts allow', async () => {
    const state = await changePasswordAction({}, form('old-password', 'short'));
    expect(state.error).toMatch(/at least 10 characters/);
    expect(changePassword).not.toHaveBeenCalled();
  });

  it('refuses a mistyped confirmation', async () => {
    const state = await changePasswordAction({}, form('old-password', 'a-much-longer-one', 'a-much-longer-onf'));
    expect(state.error).toBe('The two new passwords do not match.');
    expect(changePassword).not.toHaveBeenCalled();
  });

  it('refuses reusing the current password', async () => {
    const state = await changePasswordAction({}, form('a-much-longer-one', 'a-much-longer-one'));
    expect(state.error).toMatch(/same as the current one/);
    expect(changePassword).not.toHaveBeenCalled();
  });

  it('asks for the current password when it is missing', async () => {
    expect((await changePasswordAction({}, form('', 'a-much-longer-one'))).error).toBe('Enter your current password.');
  });

  it('rate limits guessing, so a stolen session cannot fish for the password', async () => {
    rateLimit.mockResolvedValue({ ok: false, remaining: 0 });
    expect((await changePasswordAction({}, form('old-password', 'a-much-longer-one'))).error).toMatch(/Too many attempts/);
    expect(findUnique).not.toHaveBeenCalled();
  });

  it('refuses a deactivated account', async () => {
    findUnique.mockResolvedValue({ id: 'u1', passwordHash: 'hash', active: false });
    expect((await changePasswordAction({}, form('old-password', 'a-much-longer-one'))).error).toMatch(/no longer active/);
  });

  it('reports a database failure instead of crashing the screen', async () => {
    changePassword.mockRejectedValue(new Error("Can't reach database server"));
    expect((await changePasswordAction({}, form('old-password', 'a-much-longer-one'))).error).toMatch(
      /could not be changed/,
    );
  });

  it('lets an unauthenticated caller through to the session guard', async () => {
    requireUser.mockRejectedValue(new Error('Not authenticated'));
    await expect(changePasswordAction({}, form('old-password', 'a-much-longer-one'))).rejects.toThrow('Not authenticated');
  });
});
