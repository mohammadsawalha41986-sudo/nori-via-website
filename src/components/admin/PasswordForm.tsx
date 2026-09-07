'use client';

import { useActionState, useEffect, useRef } from 'react';
import { changePasswordAction } from '@/server/account-actions';
import { SubmitButton } from './SubmitButton';
import { Field, inputClass } from './ui';
import type { ActionState } from '@/server/helpers';

export function PasswordForm({ minLength }: { minLength: number }) {
  const [state, action] = useActionState<ActionState, FormData>(changePasswordAction, {});
  const form = useRef<HTMLFormElement>(null);

  // Three password fields must not sit filled in on screen once they have been
  // accepted — including in the tab the administrator then walks away from.
  useEffect(() => {
    if (state.ok) form.current?.reset();
  }, [state.ok]);

  return (
    <form ref={form} action={action} className="max-w-sm space-y-4">
      <Field label="Current password" htmlFor="currentPassword" required>
        <input
          id="currentPassword"
          name="currentPassword"
          type="password"
          required
          autoComplete="current-password"
          className={inputClass}
        />
      </Field>

      <Field
        label="New password"
        htmlFor="newPassword"
        required
        hint={`At least ${minLength} characters. Use something long rather than something clever.`}
      >
        <input
          id="newPassword"
          name="newPassword"
          type="password"
          required
          minLength={minLength}
          autoComplete="new-password"
          className={inputClass}
        />
      </Field>

      <Field label="Confirm new password" htmlFor="confirmPassword" required>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          required
          minLength={minLength}
          autoComplete="new-password"
          className={inputClass}
        />
      </Field>

      <div className="flex flex-wrap items-center gap-3">
        <SubmitButton pendingLabel="Changing…">Change password</SubmitButton>
        {state.ok && (
          <span role="status" className="text-xs font-medium text-emerald-700">
            {state.message ?? 'Password changed.'}
          </span>
        )}
        {state.error && (
          <span role="alert" className="text-xs font-medium text-red-700">
            {state.error}
          </span>
        )}
      </div>
    </form>
  );
}
