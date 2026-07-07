import { NextRequest, NextResponse } from 'next/server';
import { resolveSiteId, getSiteConfig } from '@/config/sites';

function applySiteHeaders(response: NextResponse, siteId: string, locale?: string): NextResponse {
  response.headers.set('x-site-id', siteId);
  if (locale) {
    response.headers.set('x-locale', locale);
  }
  response.cookies.set('site-id', siteId, { path: '/', sameSite: 'lax' });
  return response;
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const host = request.headers.get('host') ?? '';
  const siteId = await resolveSiteId(host);
  const siteConfig = await getSiteConfig(siteId);
  const defaultLocale = (siteConfig as any).defaultLocale || 'en';

  // Skip middleware for:
  // - Static files (public folder)
  // - API routes
  // - Next.js internals
  if (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/api/') ||
    pathname === '/favicon.ico' ||
    pathname.startsWith('/public/') ||
    pathname.match(/\.(jpg|jpeg|png|gif|ico|svg|webp)$/)
  ) {
    return NextResponse.next();
  }

  if (pathname.startsWith('/blogs')) {
    const localeCookie = request.cookies.get('sbmax_locale')?.value as import('@/i18n').Locale | undefined;
    const currentLocale = localeCookie && ['en', 'es', 'fr', 'pt', 'ru', 'it', 'ja', 'ko', 'de'].includes(localeCookie)
      ? localeCookie
      : defaultLocale;
    return applySiteHeaders(NextResponse.next(), siteId, currentLocale);
  }

  // Check if pathname already has a locale prefix
  const pathArray = pathname.split('/').filter(Boolean);
  const firstSegment = pathArray[0] as import('@/i18n').Locale;
  
  // Is it a valid locale prefix globally?
  const isGlobalLocale = ['en', 'es', 'fr', 'pt', 'ru', 'it', 'ja', 'ko', 'de'].includes(firstSegment);
  const supportedLocales = (siteConfig as any).supportedLocales || ['en', 'es', 'fr', 'pt', 'ru', 'it', 'ja', 'ko', 'de'];
  const hasValidSiteLocale = supportedLocales.includes(firstSegment);

  // If there is no locale prefix, rewrite to default locale
  if (!isGlobalLocale) {
    const newPathname = `/${defaultLocale}${pathname}`;
    return applySiteHeaders(
      NextResponse.rewrite(new URL(newPathname, request.url)),
      siteId,
      defaultLocale
    );
  }

  // If the user tries to visit a locale not supported by the site, redirect to default locale
  if (!hasValidSiteLocale) {
    const newPathname = pathname.replace(`/${firstSegment}`, '');
    return applySiteHeaders(
      NextResponse.redirect(new URL(newPathname || '/', request.url)),
      siteId,
      defaultLocale
    );
  }

  // If default locale has a prefix in the URL, redirect to remove it
  if (firstSegment === defaultLocale) {
    const newPathname = pathname.slice(defaultLocale.length + 1) || '/';
    return applySiteHeaders(
      NextResponse.redirect(new URL(newPathname, request.url)),
      siteId,
      defaultLocale
    );
  }

  // Allow other supported locales to continue naturally
  return applySiteHeaders(NextResponse.next(), siteId, firstSegment);
}

export const config = {
  matcher: [
    // Match all routes except static files and API
    '/((?!_next|api|.*\\.).*)',
  ],
};
