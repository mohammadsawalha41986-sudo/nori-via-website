'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { loginAction, type LoginState } from '@/app/admin/actions';

const field =
  'w-full rounded-lg border border-white/12 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-white/25 focus:border-brand';

function Submit() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-lg bg-brand px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-600 disabled:opacity-60"
    >
      {pending ? 'Signing in…' : 'Sign in'}
    </button>
  );
}

export function LoginForm() {
  const [state, action] = useActionState<LoginState, FormData>(loginAction, {});

  return (
    <form action={action} className="space-y-4">
      <div>
        <label htmlFor="email" className="mb-1.5 block text-xs font-medium text-white/55">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="username"
          defaultValue={state.email ?? ''}
          key={state.email ?? ''}
          className={field}
        />
      </div>

      <div>
        <label htmlFor="password" className="mb-1.5 block text-xs font-medium text-white/55">
          Password
        </label>
        <input id="password" name="password" type="password" required autoComplete="current-password" className={field} />
      </div>

      {state.error && (
        <p role="alert" className="rounded-lg bg-brand/15 px-3.5 py-2.5 text-sm text-brand-300">
          {state.error}
        </p>
      )}

      <Submit />
    </form>
  );
}
