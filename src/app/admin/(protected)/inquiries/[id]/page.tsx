import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import { PageHeader, Card, Badge, LinkButton, inputClass } from '@/components/admin/ui';
import { SubmitButton } from '@/components/admin/SubmitButton';
import { updateInquiry, deleteInquiry } from '@/server/actions';
import { asStringList } from '@/lib/content';

export const dynamic = 'force-dynamic';

export const metadata = { title: 'Inquiry' };

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  if (!children) return null;
  return (
    <div className="grid gap-1 border-b border-slate-100 py-3 sm:grid-cols-[10rem_minmax(0,1fr)] sm:gap-4">
      <dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</dt>
      <dd className="min-w-0 whitespace-pre-wrap break-words text-sm text-slate-800">{children}</dd>
    </div>
  );
}

export default async function InquiryDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const inquiry = await prisma.projectInquiry.findUnique({ where: { id }, include: { attachments: true } });
  if (!inquiry) notFound();

  const services = asStringList(inquiry.services);
  const goals = asStringList(inquiry.goals);

  return (
    <>
      <PageHeader
        title={inquiry.name}
        description={`Received ${inquiry.createdAt.toUTCString()}`}
        action={<LinkButton href="/admin/inquiries" variant="secondary">Back</LinkButton>}
      />

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="space-y-5">
          <Card title="Request">
            <dl>
              <Row label="Name">{inquiry.name}</Row>
              <Row label="Business">{inquiry.business}</Row>
              <Row label="Website">{inquiry.website}</Row>
              <Row label="Social">{inquiry.social}</Row>
              <Row label="Services">{services.join(', ')}</Row>
              <Row label="Goals">{goals.join(', ')}</Row>
              <Row label="Budget">{inquiry.budget}</Row>
              <Row label="Timeline">{inquiry.timeline}</Row>
              <Row label="Description">{inquiry.description}</Row>
            </dl>
          </Card>

          <Card title="Contact">
            <dl>
              <Row label="Email">
                <a href={`mailto:${inquiry.email}`} className="text-slate-900 underline">{inquiry.email}</a>
              </Row>
              <Row label="Phone">
                {inquiry.phone ? <a href={`tel:${inquiry.phone.replace(/\s/g, '')}`} className="text-slate-900 underline">{inquiry.phone}</a> : ''}
              </Row>
              <Row label="WhatsApp">
                {inquiry.whatsapp ? (
                  <a
                    href={`https://wa.me/${inquiry.whatsapp.replace(/[^\d]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-900 underline"
                  >
                    {inquiry.whatsapp}
                  </a>
                ) : ''}
              </Row>
              <Row label="Prefers">{inquiry.preferredContact}</Row>
              <Row label="Language">{inquiry.locale}</Row>
            </dl>
          </Card>

          <Card
            title="Attachments"
            description="Client uploads are private — they are only reachable while signed in and always download rather than render."
          >
            {inquiry.attachments.length === 0 ? (
              <p className="text-sm text-slate-400">No files were attached.</p>
            ) : (
              <ul className="space-y-2">
                {inquiry.attachments.map((a) => (
                  <li key={a.id}>
                    <a
                      href={`/api/admin/attachments/${a.storageKey}`}
                      className="flex items-center justify-between gap-4 rounded-md border border-slate-200 px-3 py-2.5 text-sm hover:bg-slate-50"
                    >
                      <span className="min-w-0 truncate text-slate-800">{a.filename}</span>
                      <span className="shrink-0 text-xs text-slate-400">
                        {Math.round(a.size / 1024)} KB ↓
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>

        <div className="space-y-5">
          <Card title="Status">
            <form action={updateInquiry} className="space-y-3">
              <input type="hidden" name="id" value={inquiry.id} />
              <select name="status" defaultValue={inquiry.status} className={inputClass} aria-label="Status">
                <option value="NEW">New</option>
                <option value="CONTACTED">Contacted</option>
                <option value="COMPLETED">Completed</option>
                <option value="ARCHIVED">Archived</option>
              </select>
              <textarea
                name="notes"
                rows={6}
                defaultValue={inquiry.notes}
                placeholder="Internal notes…"
                aria-label="Internal notes"
                className={inputClass}
              />
              <SubmitButton>Update</SubmitButton>
            </form>
          </Card>

          <Card title="Delivery">
            <ul className="space-y-2 text-sm">
              <li className="flex items-center justify-between gap-3">
                <span className="text-slate-500">Team notification</span>
                <Badge tone={inquiry.emailSentToTeam ? 'green' : 'amber'}>
                  {inquiry.emailSentToTeam ? 'Sent' : 'Not sent'}
                </Badge>
              </li>
              <li className="flex items-center justify-between gap-3">
                <span className="text-slate-500">Client confirmation</span>
                <Badge tone={inquiry.confirmationSent ? 'green' : 'amber'}>
                  {inquiry.confirmationSent ? 'Sent' : 'Not sent'}
                </Badge>
              </li>
            </ul>
            {!inquiry.emailSentToTeam && (
              <p className="mt-3 text-xs text-slate-400">
                The inquiry is stored safely. Configure SMTP to receive email notifications.
              </p>
            )}
          </Card>

          <Card title="Danger zone" className="border-red-200">
            <form action={deleteInquiry}>
              <input type="hidden" name="id" value={inquiry.id} />
              <SubmitButton
                variant="danger"
                confirm={`Permanently delete this inquiry from ${inquiry.name} and its ${inquiry.attachments.length} attachment(s)? This cannot be undone.`}
              >
                Delete inquiry
              </SubmitButton>
            </form>
          </Card>
        </div>
      </div>
    </>
  );
}
