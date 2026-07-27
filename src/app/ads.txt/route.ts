import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { resolveSiteId, getSiteConfig } from '@/config/sites';

export async function GET(request: Request) {
  const headersList = await headers();
  const host = headersList.get('host') || 'soundbuttons.net';
  
  const siteId = resolveSiteId(host);
  const site = getSiteConfig(siteId);
  
  if (!site || !site.adsenseId) {
    return new NextResponse('google.com, pub-1092009788490991, DIRECT, f08c47fec0942fa0', {
      headers: { 'Content-Type': 'text/plain' },
    });
  }

  // Remove 'ca-' prefix if it exists in the adsenseId
  const pubId = site.adsenseId.replace(/^ca-/, '');

  // Generate the ads.txt content dynamically based on the site config
  const content = `google.com, ${pubId}, DIRECT, f08c47fec0942fa0`;

  return new NextResponse(content, {
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
