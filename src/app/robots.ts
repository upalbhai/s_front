import { MetadataRoute } from 'next';
import { getRequestSite } from '@/config/sites';

export default async function robots(): Promise<MetadataRoute.Robots> {
  const site = await getRequestSite();

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: '/admin/',
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: '/admin/',
      }
    ],
    sitemap: `${site.siteUrl}/sitemap.xml`,
  };
}
