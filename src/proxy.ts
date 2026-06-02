import { NextRequest, NextResponse } from 'next/server';
import { resolveSiteId } from '@/config/sites';

const SUPPORTED_LOCALES = ['en', 'es', 'fr', 'pt', 'ru', 'it', 'ja', 'ko', 'de'];
const DEFAULT_LOCALE = 'en';

function applySiteHeaders(response: NextResponse, siteId: string): NextResponse {
  response.headers.set('x-site-id', siteId);
  response.cookies.set('site-id', siteId, { path: '/', sameSite: 'lax' });
  return response;
}

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const host = request.headers.get('host') ?? '';
  const siteId = resolveSiteId(host);

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
  const firstSegment = pathArray[0];
  const hasLocalePrefix = SUPPORTED_LOCALES.includes(firstSegment);

  // If there is no locale prefix, rewrite to default locale (en)
  if (!hasLocalePrefix) {
    const newPathname = `/${DEFAULT_LOCALE}${pathname}`;
    return applySiteHeaders(
      NextResponse.rewrite(new URL(newPathname, request.url)),
      siteId,
    );
  }

  // If English (default locale) has a prefix in the URL, redirect to remove it
  if (firstSegment === DEFAULT_LOCALE) {
    const newPathname = pathname.slice(3) || '/'; // Remove '/en'
    return applySiteHeaders(
      NextResponse.redirect(new URL(newPathname, request.url)),
      siteId,
    );
  }

  // Allow other locales to continue naturally
  return applySiteHeaders(NextResponse.next(), siteId);
}

export const config = {
  matcher: [
    // Match all routes except static files and API
    '/((?!_next|api|.*\\.).*)',
  ],
};
