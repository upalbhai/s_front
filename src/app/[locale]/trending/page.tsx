import { Metadata } from 'next';
import TrendingClient from './TrendingClient';
import { getRequestSite } from '@/lib/site';
import { buildSeoMetadata } from '@/lib/seo';

export async function generateMetadata(): Promise<Metadata> {
  const site = await getRequestSite();
  return buildSeoMetadata({
    site,
    title: site.meta.trending.title,
    description: site.meta.trending.description,
    canonicalPath: '/trending',
    image: `${site.siteUrl}/trending/opengraph-image.png`,
  });
}

export default async function TrendingSoundsPage() {
  const site = await getRequestSite();
  return <TrendingClient h1Title={site.meta.trending.h1} shortDescription={site.meta.trending.shortDescription} />;
}
