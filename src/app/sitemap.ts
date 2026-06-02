import { MetadataRoute } from 'next';
import api from '@/services/api';
import { getRequestSite } from '@/lib/site';

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const site = await getRequestSite();
  const SITE_URL = site.siteUrl;

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
    const catRes = await api.get('/categories?limit=500');
    const categories = Array.isArray(catRes.data.categories) ? catRes.data.categories : [];

    const categoryRoutes = categories.map((cat: any) => ({
      url: `${SITE_URL}${cat.canonicalUrl || `/categories/${cat.slug}`}`,
      lastModified: new Date(cat.updatedAt),
      changeFrequency: 'weekly' as const,
      priority: cat.priority || 0.8,
    }));

    const soundRes = await api.get('/sounds?limit=5000');
    const sounds = Array.isArray(soundRes.data.sounds) ? soundRes.data.sounds : [];

    const soundRoutes = sounds.map((sound: any) => ({
      url: `${SITE_URL}${sound.canonicalUrl || `/sounds/${sound.slug}`}`,
      lastModified: new Date(sound.updatedAt),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }));

    return [...routes, ...categoryRoutes, ...soundRoutes];
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return routes;
  }
}
