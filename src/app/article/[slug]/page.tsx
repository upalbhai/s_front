import api from '@/services/api';
import { Metadata } from 'next';
import ArticleClient from './ArticleClient';
import { buildNotFoundMetadata, buildSeoMetadata, DEFAULT_IMAGE } from '@/lib/seo';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const canonicalPath = `/article/${slug}`;
  try {
    const res = await api.get(`/blogs/${slug}`);
    const blog = res.data;

    const title = blog.seoTitle || `${blog.title} | Sound Buttons Max Blog`;
    const description =
      blog.seoDescription ||
      blog.excerpt ||
      'Read the latest guides, tips, and meme culture articles from Sound Buttons Max.';

    return buildSeoMetadata({
      title,
      description,
      canonicalPath,
      image: blog.ogImage || blog.featuredImage || DEFAULT_IMAGE,
      type: 'article',
    });
  } catch (error) {
    return buildNotFoundMetadata('Article Not Found | Sound Buttons Max', 'This article could not be found on Sound Buttons Max.');
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  try {
    const res = await api.get(`/blogs/${slug}`);
    return <ArticleClient blog={res.data} />;
  } catch (error) {
    return <div className="container">Article not found</div>;
  }
}
