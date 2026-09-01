import { escapeHtml } from './mail';
import type { Locale } from './i18n';

type Row = { label: string; value: string };

function rows(items: Row[]) {
  return items
    .filter((r) => r.value && r.value.trim())
    .map(
      (r) =>
        `<tr><td style="padding:10px 16px;background:#F7F5F2;font:600 12px/1.4 system-ui,sans-serif;color:#5F6B8C;text-transform:uppercase;letter-spacing:.06em;white-space:nowrap;vertical-align:top">${escapeHtml(r.label)}</td><td style="padding:10px 16px;font:400 15px/1.6 system-ui,sans-serif;color:#0B1225">${escapeHtml(r.value).replace(/\n/g, '<br>')}</td></tr>`,
    )
    .join('');
}

function shell(title: string, body: string, footer: string) {
  return `<!doctype html><html><body style="margin:0;background:#EFEDEA;padding:32px 12px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center">
<table role="presentation" width="640" cellpadding="0" cellspacing="0" style="max-width:640px;width:100%;background:#fff;border-radius:14px;overflow:hidden;border:1px solid #E6E9F0">
<tr><td style="background:#0B1225;padding:26px 28px">
  <div style="font:700 13px/1 system-ui,sans-serif;color:#F5106E;letter-spacing:.28em;text-transform:uppercase">Noriva</div>
  <div style="font:700 24px/1.2 system-ui,sans-serif;color:#fff;margin-top:10px">${escapeHtml(title)}</div>
</td></tr>
<tr><td style="padding:8px 0 0">${body}</td></tr>
<tr><td style="padding:20px 28px;border-top:1px solid #E6E9F0;font:400 12px/1.6 system-ui,sans-serif;color:#5F6B8C">${footer}</td></tr>
</table></td></tr></table></body></html>`;
}

export type InquiryPayload = {
  id: string;
  name: string;
  business: string;
  website: string;
  social: string;
  services: string[];
  goals: string[];
  description: string;
  budget: string;
  timeline: string;
  email: string;
  phone: string;
  whatsapp: string;
  preferredContact: string;
  attachments: { filename: string; size: number }[];
  createdAt: Date;
};

export function teamInquiryEmail(p: InquiryPayload, adminUrl: string) {
  const items: Row[] = [
    { label: 'Name', value: p.name },
    { label: 'Business', value: p.business },
    { label: 'Website', value: p.website },
    { label: 'Social', value: p.social },
    { label: 'Services', value: p.services.join(', ') },
    { label: 'Goals', value: p.goals.join(', ') },
    { label: 'Budget', value: p.budget },
    { label: 'Timeline', value: p.timeline },
    { label: 'Description', value: p.description },
    { label: 'Email', value: p.email },
    { label: 'Phone', value: p.phone },
    { label: 'WhatsApp', value: p.whatsapp },
    { label: 'Preferred contact', value: p.preferredContact },
    {
      label: 'Attachments',
      value: p.attachments.length
        ? p.attachments.map((a) => `${a.filename} (${Math.round(a.size / 1024)} KB)`).join('\n')
        : 'None',
    },
  ];

  const html = shell(
    'New Noriva Inquiry',
    `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse">${rows(items)}</table>
     <div style="padding:22px 28px 6px">
       <a href="${escapeHtml(adminUrl)}" style="display:inline-block;background:#F5106E;color:#fff;font:600 14px/1 system-ui,sans-serif;padding:14px 22px;border-radius:999px;text-decoration:none">Open in Admin</a>
       <a href="mailto:${escapeHtml(p.email)}" style="display:inline-block;margin-left:10px;color:#0B1225;font:600 14px/1 system-ui,sans-serif;padding:14px 4px;text-decoration:none;border-bottom:2px solid #0B1225">Reply to ${escapeHtml(p.name)}</a>
     </div>`,
    `Reference ${escapeHtml(p.id)} · Received ${p.createdAt.toUTCString()}`,
  );

  const text = [
    'NEW NORIVA INQUIRY',
    '',
    ...items.filter((i) => i.value).map((i) => `${i.label}: ${i.value}`),
    '',
    `Admin: ${adminUrl}`,
  ].join('\n');

  return { subject: `New Noriva inquiry — ${p.name}${p.business ? ` · ${p.business}` : ''}`, html, text };
}

export function clientConfirmationEmail(p: { name: string; locale: Locale }) {
  const ar = p.locale === 'ar';
  const title = ar ? 'شكرًا لتواصلك مع نوريفا' : 'Thank you for reaching out to Noriva';
  const body = ar
    ? `مرحبًا ${p.name}،<br><br>لقد استلمنا طلبك وسيقوم فريقنا بمراجعته قريبًا.<br><br>سنتواصل معك في أقرب وقت.`
    : `Hi ${p.name},<br><br>We've received your request and our team will review it shortly.<br><br>We'll be in touch soon.`;

  const html = shell(
    title,
    `<div style="padding:24px 28px;font:400 16px/1.7 system-ui,sans-serif;color:#0B1225;direction:${ar ? 'rtl' : 'ltr'};text-align:${ar ? 'right' : 'left'}">${body}</div>`,
    ar ? 'نوريفا — تسويق وإبداع ونمو المطاعم' : 'Noriva — Restaurant Marketing, Creative & Growth',
  );

  const text = ar
    ? `مرحبًا ${p.name}،\n\nلقد استلمنا طلبك وسيقوم فريقنا بمراجعته قريبًا. سنتواصل معك في أقرب وقت.\n\nنوريفا`
    : `Hi ${p.name},\n\nWe've received your request and our team will review it shortly. We'll be in touch soon.\n\nNoriva`;

  return { subject: title, html, text };
}

export function contactMessageEmail(p: { name: string; email: string; phone: string; subject: string; message: string }) {
  const html = shell(
    'New Contact Message',
    `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse">${rows([
      { label: 'Name', value: p.name },
      { label: 'Email', value: p.email },
      { label: 'Phone', value: p.phone },
      { label: 'Subject', value: p.subject },
      { label: 'Message', value: p.message },
    ])}</table>`,
    'Sent from the Noriva contact page.',
  );
  const text = `NEW CONTACT MESSAGE\n\nName: ${p.name}\nEmail: ${p.email}\nPhone: ${p.phone}\nSubject: ${p.subject}\n\n${p.message}`;
  return { subject: `Contact message — ${p.name}`, html, text };
}
