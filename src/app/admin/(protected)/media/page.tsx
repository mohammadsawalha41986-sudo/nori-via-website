import { prisma } from '@/lib/db';
import { PageHeader, Card, EmptyRow, inputClass } from '@/components/admin/ui';
import { MediaUploader } from '@/components/admin/MediaUploader';
import { SubmitButton } from '@/components/admin/SubmitButton';
import { deleteMedia, updateMediaAlt } from '@/server/actions';

export const metadata = { title: 'Media library' };
export const dynamic = 'force-dynamic';

function humanSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export default async function MediaPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; kind?: string }>;
}) {
  const { q = '', kind = '' } = await searchParams;

  const media = await prisma.media.findMany({
    where: {
      ...(q ? { filename: { contains: q, mode: 'insensitive' as const } } : {}),
      ...(kind === 'IMAGE' || kind === 'VIDEO' || kind === 'DOCUMENT' ? { kind } : {}),
    },
    orderBy: { createdAt: 'desc' },
    take: 200,
  });

  return (
    <>
      <PageHeader
        title="Media library"
        description="Images, PDFs and video used across the website. Images are served with long-lived caching."
      />

      <div className="mb-5">
        <MediaUploader />
      </div>

      <form method="get" className="mb-5 flex flex-wrap gap-2">
        <input name="q" defaultValue={q} placeholder="Search filenames…" className={`${inputClass} max-w-xs`} />
        <select name="kind" defaultValue={kind} className={`${inputClass} max-w-[10rem]`}>
          <option value="">All types</option>
          <option value="IMAGE">Images</option>
          <option value="VIDEO">Video</option>
          <option value="DOCUMENT">Documents</option>
        </select>
        <button type="submit" className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
          Filter
        </button>
      </form>

      <Card>
        {media.length === 0 ? (
          <EmptyRow>No files match. Upload images, PDFs or video above.</EmptyRow>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {media.map((m) => (
              <li key={m.id} className="overflow-hidden rounded-lg border border-slate-200">
                <div className="flex aspect-video items-center justify-center bg-slate-100">
                  {m.kind === 'IMAGE' ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={m.url} alt={m.altEn || m.filename} className="h-full w-full object-cover" loading="lazy" />
                  ) : (
                    <span className="text-xs font-medium text-slate-500">{m.kind}</span>
                  )}
                </div>

                <div className="space-y-2 p-3">
                  <p className="truncate text-xs font-medium text-slate-800" title={m.filename}>
                    {m.filename}
                  </p>
                  <p className="text-[0.6875rem] text-slate-400">
                    {humanSize(m.size)}
                    {m.width && m.height ? ` · ${m.width}×${m.height}` : ''} · {m.createdAt.toISOString().slice(0, 10)}
                  </p>

                  <input
                    readOnly
                    value={m.url}
                    onFocus={(e) => e.currentTarget.select()}
                    dir="ltr"
                    aria-label={`URL for ${m.filename}`}
                    className="w-full rounded border border-slate-200 bg-slate-50 px-2 py-1 text-[0.6875rem] text-slate-500"
                  />

                  <form action={updateMediaAlt} className="space-y-1.5">
                    <input type="hidden" name="id" value={m.id} />
                    <input
                      name="altEn"
                      defaultValue={m.altEn}
                      placeholder="Alt text (EN)"
                      aria-label={`Alt text English for ${m.filename}`}
                      className="w-full rounded border border-slate-200 px-2 py-1 text-xs"
                    />
                    <input
                      name="altAr"
                      defaultValue={m.altAr}
                      placeholder="النص البديل"
                      dir="rtl"
                      aria-label={`Alt text Arabic for ${m.filename}`}
                      className="w-full rounded border border-slate-200 px-2 py-1 text-xs"
                    />
                    <SubmitButton variant="secondary" className="!px-2.5 !py-1 !text-xs" pendingLabel="…">
                      Save alt
                    </SubmitButton>
                  </form>

                  <form action={deleteMedia}>
                    <input type="hidden" name="id" value={m.id} />
                    <SubmitButton
                      variant="danger"
                      className="!px-2.5 !py-1 !text-xs"
                      confirm={`Delete "${m.filename}"? Any page still referencing this file will show a broken image.`}
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
