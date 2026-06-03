import { MetadataRoute } from 'next';
import { getRequestSite } from '@/lib/site';

export default async function robots(): Promise<MetadataRoute.Robots> {
  const site = await getRequestSite();

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/admin/',
    },
    sitemap: `${site.siteUrl}/sitemap.xml`,
  };
}
