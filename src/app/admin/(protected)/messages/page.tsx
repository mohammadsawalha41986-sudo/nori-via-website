import { prisma } from '@/lib/db';
import { PageHeader, Card, Badge, EmptyRow, inputClass } from '@/components/admin/ui';
import { SubmitButton } from '@/components/admin/SubmitButton';
import { updateContactMessage, deleteContactMessage } from '@/server/actions';

export const metadata = { title: 'Contact messages' };
export const dynamic = 'force-dynamic';

export default async function MessagesPage() {
  const messages = await prisma.contactMessage.findMany({ orderBy: { createdAt: 'desc' }, take: 200 });

  return (
    <>
      <PageHeader title="Contact messages" description="Messages sent from the contact page." />

      <Card>
        {messages.length === 0 ? (
          <EmptyRow>No messages yet.</EmptyRow>
        ) : (
          <ul className="divide-y divide-slate-100">
            {messages.map((m) => (
              <li key={m.id} className="py-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-900">
                      {m.name}{' '}
                      <a href={`mailto:${m.email}`} className="font-normal text-slate-500 underline">
                        {m.email}
                      </a>
                    </p>
                    {m.subject && <p className="mt-0.5 text-xs font-medium text-slate-600">{m.subject}</p>}
                    <p className="mt-2 whitespace-pre-wrap text-sm text-slate-700">{m.message}</p>
                    {m.phone && <p className="mt-2 text-xs text-slate-400">{m.phone}</p>}
                  </div>

                  <div className="flex shrink-0 items-center gap-2">
                    <Badge tone={m.status === 'NEW' ? 'brand' : 'slate'}>{m.status}</Badge>
                    <span className="text-xs text-slate-400">{m.createdAt.toISOString().slice(0, 10)}</span>
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <form action={updateContactMessage} className="flex items-center gap-2">
                    <input type="hidden" name="id" value={m.id} />
                    <select name="status" defaultValue={m.status} aria-label="Status" className={`${inputClass} !w-auto !py-1 !text-xs`}>
                      <option value="NEW">New</option>
                      <option value="CONTACTED">Contacted</option>
                      <option value="COMPLETED">Completed</option>
                      <option value="ARCHIVED">Archived</option>
                    </select>
                    <SubmitButton variant="secondary" className="!px-2.5 !py-1 !text-xs" pendingLabel="…">
                      Update
                    </SubmitButton>
                  </form>

                  <form action={deleteContactMessage}>
                    <input type="hidden" name="id" value={m.id} />
                    <SubmitButton
                      variant="danger"
                      className="!px-2.5 !py-1 !text-xs"
                      confirm={`Delete the message from ${m.name}? This cannot be undone.`}
                    >
                      Delete
                    </SubmitButton>
                  </form>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </>
  );
}
