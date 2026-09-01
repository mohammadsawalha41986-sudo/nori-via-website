'use client';

import { useFormStatus } from 'react-dom';
import clsx from 'clsx';

export function SubmitButton({
  children = 'Save changes',
  pendingLabel = 'Saving…',
  variant = 'primary',
  className,
  formAction,
  confirm,
}: {
  children?: React.ReactNode;
  pendingLabel?: string;
  variant?: 'primary' | 'secondary' | 'danger';
  className?: string;
  formAction?: (formData: FormData) => void | Promise<void>;
  /** When set, the click must be confirmed before the action runs. */
  confirm?: string;
}) {
  const { pending } = useFormStatus();

  const variants = {
    primary: 'bg-slate-900 text-white hover:bg-slate-800',
    secondary: 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50',
    danger: 'border border-red-300 bg-white text-red-700 hover:bg-red-50',
  };

  return (
    <button
      type="submit"
      formAction={formAction}
      disabled={pending}
      onClick={(e) => {
        if (confirm && !window.confirm(confirm)) e.preventDefault();
      }}
      className={clsx(
        'inline-flex items-center rounded-md px-4 py-2 text-sm font-medium transition-colors disabled:opacity-60',
        variants[variant],
        className,
      )}
    >
      {pending ? pendingLabel : children}
    </button>
  );
}
