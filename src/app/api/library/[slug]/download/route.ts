import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { publishedNow } from '@/lib/content';
import { readStoredFile } from '@/lib/storage';
import { rateLimit, clientIp } from '@/lib/rate-limit';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Serves a Library file.
 *
 * Resource files live in the private storage scope and are never linked
 * directly, so this route is the only way to reach one: it refuses anything
 * that is not published, resolves the randomised storage key itself, and never
 * echoes a filesystem path back to the client.
 */
export async function GET(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const resource = await prisma.resource.findFirst({
    where: { slug, ...publishedNow() },
    select: { id: true, slug: true, fileKey: true, fileName: true, fileMime: true, externalUrl: true },
  });
  if (!resource) return new NextResponse('Not found', { status: 404 });

  // Counted at most a few times per visitor per resource, so a refresh loop
  // cannot inflate the download statistics.
  const ip = clientIp(req);
  const countable = await rateLimit(`download:${resource.id}:${ip}`, 3, 3600_000);
  if (countable.ok) {
    await Promise.all([
      prisma.resource.update({ where: { id: resource.id }, data: { downloadCount: { increment: 1 } } }),
      prisma.analyticsEvent.create({
        data: { name: 'resource_download', path: `/library/${resource.slug}`, meta: { slug: resource.slug } },
      }),
    ]);
  }

  if (!resource.fileKey) {
    if (resource.externalUrl) return NextResponse.redirect(resource.externalUrl, 302);
    return new NextResponse('Not found', { status: 404 });
  }

  let file: Buffer;
  try {
    file = await readStoredFile('private', resource.fileKey);
  } catch {
    // The row exists but the file does not — report it as missing rather than
    // leaking the storage error.
    return new NextResponse('Not found', { status: 404 });
  }

  const name = resource.fileName || `${resource.slug}`;

  return new NextResponse(new Uint8Array(file), {
    headers: {
      'content-type': resource.fileMime || 'application/octet-stream',
      'content-length': String(file.length),
      'content-disposition': `attachment; filename*=UTF-8''${encodeURIComponent(name)}`,
      'cache-control': 'private, no-store',
      'x-content-type-options': 'nosniff',
    },
  });
}
