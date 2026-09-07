'use client';

import { useActionState } from 'react';
import { SubmitButton } from './SubmitButton';
import type { ActionState } from '@/server/helpers';

/**
 * Compact server-action form used by the list-style admin screens.
 * `after` renders as a sibling of the form rather than inside it, so a delete
 * form can sit beside the save button without nesting one form in another.
 */
export function InlineForm({
  action,
  children,
  submitLabel = 'Save',
  after,
  className,
}: {
  action: (prev: ActionState, formData: FormData) => Promise<ActionState>;
  children: React.ReactNode;
  submitLabel?: string;
  after?: React.ReactNode;
  className?: string;
}) {
  const [state, formAction] = useActionState<ActionState, FormData>(action, {});

  return (
    <div className={className}>
      <form action={formAction}>
        {children}
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <SubmitButton>{submitLabel}</SubmitButton>
          {state.ok && (
            <span role="status" className="text-xs font-medium text-emerald-700">
              {state.message ?? 'Saved'}
            </span>
          )}
          {state.error && (
            <span role="alert" className="text-xs font-medium text-red-700">
              {state.error}
            </span>
          )}
        </div>
      </form>

      {after && <div className="mt-2">{after}</div>}
    </div>
  );
}
