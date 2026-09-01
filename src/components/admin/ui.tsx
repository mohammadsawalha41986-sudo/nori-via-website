import Link from 'next/link';
import clsx from 'clsx';

export const inputClass =
  'w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 disabled:bg-slate-50';

export function PageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-slate-900">{title}</h1>
        {description && <p className="mt-1 max-w-2xl text-sm text-slate-500">{description}</p>}
      </div>
      {action}
    </div>
  );
}

export function Card({
  title,
  description,
  children,
  className,
}: {
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={clsx('rounded-lg border border-slate-200 bg-white', className)}>
      {(title || description) && (
        <header className="border-b border-slate-200 px-5 py-4">
          {title && <h2 className="text-sm font-semibold text-slate-900">{title}</h2>}
          {description && <p className="mt-0.5 text-xs text-slate-500">{description}</p>}
        </header>
      )}
      <div className="p-5">{children}</div>
    </section>
  );
}

export function Field({
  label,
  htmlFor,
  hint,
  required,
  children,
  className,
}: {
  label: string;
  htmlFor?: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label htmlFor={htmlFor} className="mb-1.5 block text-xs font-medium text-slate-700">
        {label} {required && <span className="text-brand">*</span>}
      </label>
      {children}
      {hint && <p className="mt-1 text-xs text-slate-400">{hint}</p>}
    </div>
  );
}

export function Grid({ children, cols = 2 }: { children: React.ReactNode; cols?: 1 | 2 | 3 }) {
  return (
    <div
      className={clsx('grid gap-4', cols === 2 && 'sm:grid-cols-2', cols === 3 && 'sm:grid-cols-2 lg:grid-cols-3')}
    >
      {children}
    </div>
  );
}

export function Badge({ tone = 'slate', children }: { tone?: 'slate' | 'green' | 'amber' | 'brand'; children: React.ReactNode }) {
  const tones = {
    slate: 'bg-slate-100 text-slate-600',
    green: 'bg-emerald-100 text-emerald-700',
    amber: 'bg-amber-100 text-amber-700',
    brand: 'bg-brand/10 text-brand-700',
  };
  return (
    <span className={clsx('inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium', tones[tone])}>{children}</span>
  );
}

export function LinkButton({
  href,
  children,
  variant = 'primary',
}: {
  href: string;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
}) {
  return (
    <Link
      href={href}
      className={clsx(
        'inline-flex items-center rounded-md px-3.5 py-2 text-sm font-medium transition-colors',
        variant === 'primary'
          ? 'bg-slate-900 text-white hover:bg-slate-800'
          : 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50',
      )}
    >
      {children}
    </Link>
  );
}

export function EmptyRow({ children }: { children: React.ReactNode }) {
  return <div className="px-5 py-14 text-center text-sm text-slate-400">{children}</div>;
}

export function Stat({ label, value, href }: { label: string; value: number | string; href?: string }) {
  const body = (
    <>
      <span className="block text-2xl font-semibold tracking-tight text-slate-900">{value}</span>
      <span className="mt-1 block text-xs font-medium uppercase tracking-wide text-slate-400">{label}</span>
    </>
  );

  if (href) {
    return (
      <Link href={href} className="block rounded-lg border border-slate-200 bg-white px-5 py-4 transition-colors hover:border-slate-400">
        {body}
      </Link>
    );
  }
  return <div className="rounded-lg border border-slate-200 bg-white px-5 py-4">{body}</div>;
}
