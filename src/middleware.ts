import { NextRequest, NextResponse } from 'next/server';
import { resolveSiteId, getSiteConfig } from '@/config/sites';

const APP_MODE = process.env.NEXT_PUBLIC_APP_MODE || 'public';

function applySiteHeaders(response: NextResponse, siteId: string, locale?: string): NextResponse {
  response.headers.set('x-site-id', siteId);
  if (locale) {
    response.headers.set('x-locale', locale);
  }
  response.cookies.set('site-id', siteId, { path: '/', sameSite: 'lax' });
  return response;
}

function isAdminPath(pathname: string) {
  return (
    pathname === '/admin' ||
    pathname.startsWith('/admin/') ||
    pathname === '/login' ||
    pathname.startsWith('/login/') ||
    /^\/[a-z]{2}\/admin(\/|$)/.test(pathname) ||
    /^\/[a-z]{2}\/login(\/|$)/.test(pathname)
  );
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const host = request.headers.get('host') ?? '';
  const lockedId = process.env.NEXT_PUBLIC_SITE_ID;
  const siteId = lockedId || resolveSiteId(host);
  const siteConfig = getSiteConfig(siteId);
  const defaultLocale = (siteConfig as any).defaultLocale || 'en';

  if (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/api/') ||
    pathname === '/favicon.ico' ||
    pathname.startsWith('/public/') ||
    pathname.match(/\.(jpg|jpeg|png|gif|ico|svg|webp)$/)
  ) {
    return NextResponse.next();
  }

  if (APP_MODE === 'public' && isAdminPath(pathname)) {
    return new NextResponse('Not Found', { status: 404, headers: { 'content-type': 'text/plain' } });
  }

  if (APP_MODE === 'admin' && !isAdminPath(pathname) && pathname !== '/robots.txt') {
    return applySiteHeaders(
      NextResponse.redirect(new URL('/admin', request.url)),
      siteId,
      defaultLocale
    );
  }

  if (pathname.startsWith('/blogs')) {
    const localeCookie = request.cookies.get('sbmax_locale')?.value as import('@/i18n').Locale | undefined;
    const currentLocale = localeCookie && ['en', 'es', 'fr', 'pt', 'ru', 'it', 'ja', 'ko', 'de'].includes(localeCookie)
      ? localeCookie
      : defaultLocale;
    return applySiteHeaders(NextResponse.next(), siteId, currentLocale);
  }

  const pathArray = pathname.split('/').filter(Boolean);
  const firstSegment = pathArray[0] as import('@/i18n').Locale;

  const isGlobalLocale = ['en', 'es', 'fr', 'pt', 'ru', 'it', 'ja', 'ko', 'de'].includes(firstSegment);
  const supportedLocales = (siteConfig as any).supportedLocales || ['en', 'es', 'fr', 'pt', 'ru', 'it', 'ja', 'ko', 'de'];
  const hasValidSiteLocale = supportedLocales.includes(firstSegment);

  if (!isGlobalLocale) {
    const newPathname = `/${defaultLocale}${pathname}`;
    return applySiteHeaders(
      NextResponse.rewrite(new URL(newPathname, request.url)),
      siteId,
      defaultLocale
    );
  }

  if (!hasValidSiteLocale) {
    const newPathname = pathname.replace(`/${firstSegment}`, '');
    return applySiteHeaders(
      NextResponse.redirect(new URL(newPathname || '/', request.url)),
      siteId,
      defaultLocale
    );
  }

  if (firstSegment === defaultLocale) {
    const newPathname = pathname.slice(defaultLocale.length + 1) || '/';
    return applySiteHeaders(
      NextResponse.redirect(new URL(newPathname, request.url)),
      siteId,
      defaultLocale
    );
  }

  return applySiteHeaders(NextResponse.next(), siteId, firstSegment);
}

export const config = {
  matcher: [
    '/((?!_next|api|.*\\.).*)',
  ],
};
