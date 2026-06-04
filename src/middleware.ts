import { NextRequest, NextResponse } from 'next/server';
import { resolveSiteId, getSiteConfig } from '@/config/sites';

function applySiteHeaders(response: NextResponse, siteId: string): NextResponse {
  response.headers.set('x-site-id', siteId);
  response.cookies.set('site-id', siteId, { path: '/', sameSite: 'lax' });
  return response;
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const host = request.headers.get('host') ?? '';
  const siteId = await resolveSiteId(host);
  const siteConfig = await getSiteConfig(siteId);

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

  // Check if pathname already has a locale prefix
  const pathArray = pathname.split('/').filter(Boolean);
  const firstSegment = pathArray[0] as import('@/i18n').Locale;
  
  // Is it a valid locale prefix globally?
  const isGlobalLocale = ['en', 'es', 'fr', 'pt', 'ru', 'it', 'ja', 'ko', 'de'].includes(firstSegment);
  const hasValidSiteLocale = siteConfig.supportedLocales.includes(firstSegment);

  // If there is no locale prefix, rewrite to default locale
  if (!isGlobalLocale) {
    const newPathname = `/${siteConfig.defaultLocale}${pathname}`;
    return applySiteHeaders(
      NextResponse.rewrite(new URL(newPathname, request.url)),
      siteId,
    );
  }

  // If the user tries to visit a locale not supported by the site, redirect to default locale
  if (!hasValidSiteLocale) {
    const newPathname = pathname.replace(`/${firstSegment}`, '');
    return applySiteHeaders(
      NextResponse.redirect(new URL(newPathname || '/', request.url)),
      siteId,
    );
  }

  // If default locale has a prefix in the URL, redirect to remove it
  if (firstSegment === siteConfig.defaultLocale) {
    const newPathname = pathname.slice(siteConfig.defaultLocale.length + 1) || '/';
    return applySiteHeaders(
      NextResponse.redirect(new URL(newPathname, request.url)),
      siteId,
    );
  }

  // Allow other supported locales to continue naturally
  return applySiteHeaders(NextResponse.next(), siteId);
}

export const config = {
  matcher: [
    // Match all routes except static files and API
    '/((?!_next|api|.*\\.).*)',
  ],
};
