import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSessionUser } from '@/lib/auth';
import {
  storeFile,
  sniffMime,
  safeDisplayName,
  kindOfMime,
  imageSize,
  MAX_MEDIA_BYTES,
  IMAGE_MIME,
  DOC_MIME,
  VIDEO_MIME,
} from '@/lib/storage';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const ALLOWED = [...IMAGE_MIME, ...DOC_MIME, ...VIDEO_MIME] as readonly string[];

/** Media library upload. Admin session required; content type is sniffed, not trusted. */
export async function POST(req: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  const form = await req.formData().catch(() => null);
  if (!form) return NextResponse.json({ error: 'Invalid request' }, { status: 400 });

  const files = form.getAll('files').filter((f): f is File => f instanceof File && f.size > 0);
  if (!files.length) return NextResponse.json({ error: 'No files received' }, { status: 400 });

  const created = [];
  for (const file of files) {
    if (file.size > MAX_MEDIA_BYTES) {
      return NextResponse.json({ error: `"${safeDisplayName(file.name)}" is larger than 50 MB.` }, { status: 422 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const mime = sniffMime(buffer);
    if (!mime || !ALLOWED.includes(mime)) {
      return NextResponse.json(
        { error: `"${safeDisplayName(file.name)}" is not an accepted file type.` },
        { status: 422 },
      );
    }

    const { url } = await storeFile(buffer, mime, 'public');
    const dims = kindOfMime(mime) === 'IMAGE' ? imageSize(buffer) : null;

    created.push(
      await prisma.media.create({
        data: {
          filename: safeDisplayName(file.name),
          url,
          kind: kindOfMime(mime),
          mimeType: mime,
          size: buffer.length,
          width: dims?.width ?? null,
          height: dims?.height ?? null,
          uploadedById: user.id,
        },
      }),
    );
  }

  return NextResponse.json({ ok: true, media: created });
}

/** Lists the library for the picker dialog. */
export async function GET(req: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  const url = new URL(req.url);
  const q = url.searchParams.get('q')?.trim() || '';
  const kind = url.searchParams.get('kind') || '';

  const media = await prisma.media.findMany({
    where: {
      ...(q ? { filename: { contains: q, mode: 'insensitive' as const } } : {}),
      ...(kind === 'IMAGE' || kind === 'VIDEO' || kind === 'DOCUMENT' ? { kind } : {}),
    },
    orderBy: { createdAt: 'desc' },
    take: 120,
  });

  return NextResponse.json({ media });
}
