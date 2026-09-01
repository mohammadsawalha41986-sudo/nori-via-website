import { NextResponse } from 'next/server';
import { readStoredFile } from '@/lib/storage';
import { prisma } from '@/lib/db';

export const runtime = 'nodejs';

/**
 * Serves public media-library files. Only files that have a Media row are
 * served, so nothing can be probed out of the storage directory.
 */
export async function GET(_req: Request, { params }: { params: Promise<{ key: string[] }> }) {
  const { key } = await params;
  const path = key.join('/');

  const media = await prisma.media.findFirst({ where: { url: `/media/${path}` } });
  if (!media) return new NextResponse('Not found', { status: 404 });

  try {
    const file = await readStoredFile('public', path);
    return new NextResponse(new Uint8Array(file), {
      headers: {
        'content-type': media.mimeType,
        'content-length': String(file.length),
        'cache-control': 'public, max-age=31536000, immutable',
        'x-content-type-options': 'nosniff',
      },
    });
  } catch {
    return new NextResponse('Not found', { status: 404 });
  }
}
