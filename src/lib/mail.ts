import 'server-only';
import nodemailer, { type Transporter } from 'nodemailer';
import { env, isMailConfigured } from './env';

let cached: Transporter | null = null;

function transporter(): Transporter | null {
  if (!isMailConfigured()) return null;
  if (cached) return cached;
  cached = nodemailer.createTransport({
    host: env.smtp.host,
    port: env.smtp.port,
    secure: env.smtp.secure || env.smtp.port === 465,
    auth: env.smtp.user ? { user: env.smtp.user, pass: env.smtp.password } : undefined,
  });
  return cached;
}

export type MailAttachment = { filename: string; content: Buffer; contentType: string };

export async function sendMail(opts: {
  to: string;
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
  attachments?: MailAttachment[];
}): Promise<{ sent: boolean; reason?: string }> {
  const t = transporter();
  if (!t) return { sent: false, reason: 'SMTP is not configured' };
  if (!opts.to) return { sent: false, reason: 'No recipient configured' };

  try {
    await t.sendMail({
      from: env.smtp.from || env.contactEmail || env.smtp.user,
      to: opts.to,
      subject: opts.subject,
      html: opts.html,
      text: opts.text,
      replyTo: opts.replyTo,
      attachments: opts.attachments,
    });
    return { sent: true };
  } catch (error) {
    // Never surface transport internals to the visitor; the inquiry is already saved.
    console.error('[mail] delivery failed:', error instanceof Error ? error.message : error);
    return { sent: false, reason: 'Delivery failed' };
  }
}

export function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
