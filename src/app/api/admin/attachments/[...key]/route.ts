import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSessionUser } from '@/lib/auth';
import { readStoredFile } from '@/lib/storage';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Serves client-uploaded inquiry attachments. These are private: a valid admin
 * session is required, and only keys that exist as attachment rows are served.
 */
export async function GET(_req: Request, { params }: { params: Promise<{ key: string[] }> }) {
  const user = await getSessionUser();
  if (!user) return new NextResponse('Not authorised', { status: 401 });

  const { key } = await params;
  const storageKey = key.join('/');

  const attachment = await prisma.projectInquiryAttachment.findUnique({ where: { storageKey } });
  if (!attachment) return new NextResponse('Not found', { status: 404 });

  try {
    const file = await readStoredFile('private', storageKey);
    return new NextResponse(new Uint8Array(file), {
      headers: {
        'content-type': attachment.mimeType,
        'content-length': String(file.length),
        // Force a download rather than inline rendering of untrusted content.
        'content-disposition': `attachment; filename="${attachment.filename.replace(/"/g, '')}"`,
        'cache-control': 'private, no-store',
        'x-content-type-options': 'nosniff',
      },
    });
  } catch {
    return new NextResponse('Not found', { status: 404 });
  }
}
