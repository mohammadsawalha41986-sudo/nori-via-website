import { env } from '@/lib/env';
import { validIndexNowKey } from '@/lib/indexnow';
export const dynamic = 'force-dynamic';
export function GET() {
  if (!validIndexNowKey(env.indexNowKey)) return new Response('Not found', { status: 404 });
  return new Response(env.indexNowKey, { headers: { 'Content-Type': 'text/plain; charset=utf-8', 'X-Robots-Tag': 'noindex' } });
}
