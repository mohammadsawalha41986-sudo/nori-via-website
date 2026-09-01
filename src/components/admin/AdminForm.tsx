'use client';

import { useActionState } from 'react';
import { SubmitButton } from './SubmitButton';
import type { ActionState } from '@/server/helpers';

/**
 * Wraps a server action with inline success/error feedback. Children receive
 * the current action state so individual fields can show their own errors.
 */
export function AdminForm({
  action,
  children,
  submitLabel,
  footer,
  className,
}: {
  action: (prev: ActionState, formData: FormData) => Promise<ActionState>;
  children: React.ReactNode | ((state: ActionState) => React.ReactNode);
  submitLabel?: string;
  footer?: React.ReactNode;
  className?: string;
}) {
  const [state, formAction] = useActionState<ActionState, FormData>(action, {});

  return (
    <form action={formAction} className={className}>
      {typeof children === 'function' ? children(state) : children}

      <div className="sticky bottom-0 z-10 mt-6 flex flex-wrap items-center gap-3 border-t border-slate-200 bg-slate-100/95 py-4 backdrop-blur">
        <SubmitButton>{submitLabel ?? 'Save changes'}</SubmitButton>
        {footer}

        {state.ok && (
          <span role="status" className="text-sm font-medium text-emerald-700">
            Saved. Public pages have been refreshed.
          </span>
        )}
        {state.error && (
          <span role="alert" className="text-sm font-medium text-red-700">
            {state.error}
          </span>
        )}
      </div>
    </form>
  );
}
