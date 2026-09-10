import { NextResponse, type NextRequest } from 'next/server';
import { locales, resolveLocale, LOCALE_COOKIE } from '@/lib/i18n';

const PUBLIC_FILE = /\.[a-zA-Z0-9]+$/;

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Admin, API, media and static assets are not locale-prefixed.
  if (
    pathname.startsWith('/admin') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/media') ||
    pathname.startsWith('/_next') ||
    pathname === '/sitemap.xml' ||
    pathname === '/robots.txt' ||
    PUBLIC_FILE.test(pathname)
  ) {
    return NextResponse.next();
  }

  const hasLocale = locales.some((l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`));
  if (hasLocale) return NextResponse.next();

  const locale = resolveLocale(req.cookies.get(LOCALE_COOKIE)?.value);
  const url = req.nextUrl.clone();
  url.pathname = `/${locale}${pathname === '/' ? '' : pathname}`;

  const res = NextResponse.redirect(url);
  // The target depends on the visitor's stored choice, so a shared cache must
  // not serve one visitor's redirect to another.
  res.headers.set('Vary', 'Cookie');
  return res;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
