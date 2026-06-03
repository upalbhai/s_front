import { Metadata } from 'next';
import NewClient from './NewClient';
import { getRequestSite } from '@/lib/site';
import { buildSeoMetadata } from '@/lib/seo';

export async function generateMetadata(): Promise<Metadata> {
  const site = await getRequestSite();
  return buildSeoMetadata({
    site,
    title: site.meta.new.title,
    description: site.meta.new.description,
    canonicalPath: '/new',
    image: `${site.siteUrl}/new/opengraph-image.png`,
  });
}

export default async function NewSoundsPage() {
  const site = await getRequestSite();
  return <NewClient h1Title={site.meta.new.h1} shortDescription={site.meta.new.shortDescription} />;
}
