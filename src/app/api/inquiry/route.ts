import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { inquirySchema } from '@/lib/validation';
import { rateLimit, clientIp } from '@/lib/rate-limit';
import { sendMail, type MailAttachment } from '@/lib/mail';
import { teamInquiryEmail, clientConfirmationEmail } from '@/lib/emails';
import { getSettings } from '@/lib/content';
import { env, isMailConfigured } from '@/lib/env';
import {
  storeFile,
  sniffMime,
  safeDisplayName,
  MAX_UPLOAD_BYTES,
  MAX_FILES_PER_INQUIRY,
  IMAGE_MIME,
  RESOURCE_MIME,
} from '@/lib/storage';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Only these types may be attached to an inquiry. Never executables.
 * A menu, a POS export or a cost sheet arrives as a PDF, a spreadsheet or a
 * photograph, so all three families are accepted — sniffed from the bytes.
 */
const ALLOWED = [...IMAGE_MIME, ...RESOURCE_MIME] as readonly string[];

export async function POST(req: Request) {
  const ip = clientIp(req);

  // Three submissions per IP per hour is generous for a real enquirer.
  const limit = await rateLimit(`inquiry:${ip}`, 3, 60 * 60 * 1000);
  if (!limit.ok) {
    return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 });
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  // Honeypot — a filled value means a bot; respond as success so it learns nothing.
  if (String(form.get('company_website') || '').length > 0) {
    return NextResponse.json({ ok: true });
  }

  let raw: unknown;
  try {
    raw = JSON.parse(String(form.get('payload') || '{}'));
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  const parsed = inquirySchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Please check the highlighted fields and try again.' }, { status: 422 });
  }
  const data = parsed.data;

  // ---- Validate attachments before writing anything -----------------------
  const uploads = form.getAll('files').filter((f): f is File => f instanceof File && f.size > 0);
  if (uploads.length > MAX_FILES_PER_INQUIRY) {
    return NextResponse.json({ error: `A maximum of ${MAX_FILES_PER_INQUIRY} files can be attached.` }, { status: 422 });
  }

  const accepted: { filename: string; buffer: Buffer; mime: string }[] = [];
  for (const file of uploads) {
    if (file.size > MAX_UPLOAD_BYTES) {
      return NextResponse.json({ error: `"${safeDisplayName(file.name)}" is larger than 10 MB.` }, { status: 422 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const sniffed = sniffMime(buffer);

    // The declared type and the actual bytes must agree, and both must be allowed.
    if (!sniffed || !ALLOWED.includes(sniffed)) {
      return NextResponse.json(
        {
          error: `"${safeDisplayName(file.name)}" is not an accepted file type. Use JPG, PNG, WEBP, PDF, Word or Excel.`,
        },
        { status: 422 },
      );
    }

    accepted.push({ filename: safeDisplayName(file.name), buffer, mime: sniffed });
  }

  // ---- Persist ------------------------------------------------------------
  const stored: { filename: string; storageKey: string; mimeType: string; size: number }[] = [];
  for (const a of accepted) {
    const { storageKey } = await storeFile(a.buffer, a.mime, 'private');
    stored.push({ filename: a.filename, storageKey, mimeType: a.mime, size: a.buffer.length });
  }

  const inquiry = await prisma.projectInquiry.create({
    data: {
      name: data.name,
      business: data.business,
      website: data.website,
      social: data.social,
      services: data.services,
      goals: data.goals,
      serviceSlug: data.serviceSlug,
      serviceId: data.serviceSlug
        ? (await prisma.service.findUnique({ where: { slug: data.serviceSlug }, select: { id: true } }))?.id ?? null
        : null,
      answers: data.answers,
      description: data.description,
      budget: data.budget,
      timeline: data.timeline,
      email: data.email,
      phone: data.phone,
      whatsapp: data.whatsapp,
      preferredContact: data.preferredContact,
      locale: data.locale,
      ip,
      userAgent: req.headers.get('user-agent')?.slice(0, 255) ?? null,
      attachments: { create: stored },
    },
    include: { attachments: true },
  });

  // ---- Notify -------------------------------------------------------------
  let emailSentToTeam = false;
  let confirmationSent = false;

  if (isMailConfigured()) {
    const settings = await getSettings();
    const to = settings.inquiryEmail || settings.contactEmail || env.contactEmail;

    if (to) {
      // Attach only what comfortably fits in an email; everything is in Admin regardless.
      const attachments: MailAttachment[] = [];
      let budget = 12 * 1024 * 1024;
      for (const a of accepted) {
        if (a.buffer.length <= budget) {
          attachments.push({ filename: a.filename, content: a.buffer, contentType: a.mime });
          budget -= a.buffer.length;
        }
      }

      const mail = teamInquiryEmail(
        {
          id: inquiry.id,
          name: inquiry.name,
          business: inquiry.business,
          website: inquiry.website,
          social: inquiry.social,
          services: data.services,
          goals: data.goals,
          description: inquiry.description,
          budget: inquiry.budget,
          timeline: inquiry.timeline,
          email: inquiry.email,
          phone: inquiry.phone,
          whatsapp: inquiry.whatsapp,
          preferredContact: inquiry.preferredContact,
          attachments: stored.map((s) => ({ filename: s.filename, size: s.size })),
          createdAt: inquiry.createdAt,
        },
        `${env.siteUrl}/admin/inquiries/${inquiry.id}`,
      );

      const result = await sendMail({ to, replyTo: inquiry.email, attachments, ...mail });
      emailSentToTeam = result.sent;
    }

    const confirmation = clientConfirmationEmail({ name: inquiry.name, locale: data.locale });
    const confirmResult = await sendMail({ to: inquiry.email, ...confirmation });
    confirmationSent = confirmResult.sent;
  }

  await prisma.projectInquiry.update({
    where: { id: inquiry.id },
    data: { emailSentToTeam, confirmationSent },
  });

  // The inquiry is safely stored even when mail delivery is unavailable.
  return NextResponse.json({ ok: true, id: inquiry.id });
}
