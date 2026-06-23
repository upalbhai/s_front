import { MetadataRoute } from 'next';
import api from '@/services/api';
import { getRequestSite } from '@/config/sites';

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const site = await getRequestSite();
  const SITE_URL = site.siteUrl;

  // Fallback routes in case backend fetch fails
  const routes = [
    '',
    '/blog',
    '/about',
    '/contact',
    '/privacy',
    '/terms',
    '/trending',
    '/new',
    '/categories',
  ].map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1.0 : 0.8,
  }));

  try {
    // Determine backend URL by removing API prefix
    const backendUrl = api.defaults.baseURL?.replace('/api/v1', '') || 'http://localhost:5000';
    const sitemapUrl = `${backendUrl}/uploads/sitemaps/sitemap-${site.id}.json`;

    const res = await fetch(sitemapUrl, { next: { revalidate: 0 } });
    if (!res.ok) {
      throw new Error(`Failed to fetch sitemap json from backend: ${res.statusText}`);
    }

    const sitemapData = await res.json();
    return sitemapData;
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return routes;
  }
}
