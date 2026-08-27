import { MetadataRoute } from 'next';
import { getRequestSite } from '@/config/sites';

export default async function robots(): Promise<MetadataRoute.Robots> {
  const isAdmin = process.env.NEXT_PUBLIC_APP_MODE === 'admin';
  if (isAdmin) {
    return {
      rules: [{ userAgent: '*', disallow: '/' }],
    };
  }

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
    sitemap: [
      `${site.siteUrl}/sitemap.xml`,
      `${site.siteUrl}/sitemap_index.xml`,
    ],
  };
}
