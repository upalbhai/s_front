import api from '@/services/api';
import { Metadata } from 'next';
import { buildSeoMetadata } from '@/lib/seo';
import BlogListClient from './BlogListClient';

export const metadata: Metadata = buildSeoMetadata({
  title: 'Blog | Sound Buttons Max',
  description: 'Guides, tips, and meme culture articles from Sound Buttons Max.',
  canonicalPath: '/blog',
  type: 'article',
});

export default async function BlogListPage() {
  try {
    const res = await api.get('/blogs?limit=12&page=1');
    return <BlogListClient initialBlogs={res.data.blogs || []} />;
  } catch (error) {
    return <BlogListClient initialBlogs={[]} />;
  }
}
