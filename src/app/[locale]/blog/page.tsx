import api from '@/services/api';
import { Metadata } from 'next';
import { buildSeoMetadata } from '@/lib/seo';
import { getRequestSite } from '@/lib/site';
import BlogListClient from './BlogListClient';

export async function generateMetadata(): Promise<Metadata> {
  const site = await getRequestSite();
  return buildSeoMetadata({
    site,
    title: `Blog | ${site.siteName}`,
    description: `Guides, tips, and meme culture articles from ${site.siteName}.`,
    canonicalPath: '/blog',
    type: 'article',
  });
}

export default async function BlogListPage() {
  try {
    const res = await api.get('/blogs?limit=12&page=1');
    return <BlogListClient initialBlogs={res.data.blogs || []} />;
  } catch (error) {
    return <BlogListClient initialBlogs={[]} />;
  }
}
