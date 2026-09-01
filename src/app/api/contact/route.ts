import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { contactSchema } from '@/lib/validation';
import { rateLimit, clientIp } from '@/lib/rate-limit';
import { sendMail } from '@/lib/mail';
import { contactMessageEmail } from '@/lib/emails';
import { getSettings } from '@/lib/content';
import { env, isMailConfigured } from '@/lib/env';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const ip = clientIp(req);

  const limit = await rateLimit(`contact:${ip}`, 5, 60 * 60 * 1000);
  if (!limit.ok) {
    return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 });
  }

  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });

  if (String((body as Record<string, unknown>).company_website || '').length > 0) {
    return NextResponse.json({ ok: true });
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Please check the highlighted fields and try again.' }, { status: 422 });
  }
  const data = parsed.data;

  await prisma.contactMessage.create({
    data: {
      name: data.name,
      email: data.email,
      phone: data.phone,
      subject: data.subject,
      message: data.message,
      locale: data.locale,
      ip,
    },
  });

  if (isMailConfigured()) {
    const settings = await getSettings();
    const to = settings.contactEmail || settings.inquiryEmail || env.contactEmail;
    if (to) {
      await sendMail({ to, replyTo: data.email, ...contactMessageEmail(data) });
    }
  }

  return NextResponse.json({ ok: true });
}
