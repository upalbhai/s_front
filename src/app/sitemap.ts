import { MetadataRoute } from 'next';
import api from '@/services/api';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://soundbuttonsmax.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const routes = [
    '',
    '/blog',
    '/about',
    '/contact',
    '/privacy',
    '/terms',
    '/copyright',
  ].map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 1.0,
  }));

  try {
    // Fetch Categories
    const catRes = await api.get('/categories?limit=500');
    const categories = Array.isArray(catRes.data.categories) ? catRes.data.categories : [];
    
    const categoryRoutes = categories.map((cat: any) => ({
      url: `${SITE_URL}${cat.canonicalUrl || `/${cat.slug}/${cat._id}`}`,
      lastModified: new Date(cat.updatedAt),
      changeFrequency: 'weekly' as const,
      priority: cat.priority || 0.8,
    }));

    // Fetch Sounds (Top 5000 for sitemap)
    const soundRes = await api.get('/sounds?limit=5000');
    const sounds = Array.isArray(soundRes.data.sounds) ? soundRes.data.sounds : [];

    const soundRoutes = sounds.map((sound: any) => ({
      url: `${SITE_URL}${sound.canonicalUrl || `/sound/${sound.slug}/${sound._id}`}`,
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
