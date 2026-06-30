import { NextRequest, NextResponse } from 'next/server';
import { getRequestSite } from '@/config/sites';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const site = await getRequestSite();
  const filePath = path.join(process.cwd(), 'public', `sitemap-${site.id}-index.xml`);

  try {
    if (fs.existsSync(filePath)) {
      const xml = fs.readFileSync(filePath, 'utf8');
      return new NextResponse(xml, {
        headers: {
          'Content-Type': 'application/xml',
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        },
      });
    }
  } catch (error) {
    console.error('Error serving sitemap index:', error);
  }

  return new NextResponse('Sitemap index not found', { status: 404 });
}
