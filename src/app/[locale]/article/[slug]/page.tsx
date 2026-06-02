import api from '@/services/api';
import { Metadata } from 'next';
import ArticleClient from './ArticleClient';
import { getRequestSite } from '@/lib/site';
import { buildSeoMetadata, buildNotFoundMetadata } from '@/lib/seo';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const site = await getRequestSite();

  try {
    const res = await api.get(`/blogs/${slug}`);
    const blog = res.data;
    if (!blog) {
      throw new Error('Blog post not found');
    }

    const postTitle = blog.title;
    const authorName = blog.author || site.siteName;
    const ogImageUrl =
      blog.ogImage || blog.featuredImage || `${site.siteUrl}/blog/default-image.png`;
    const publishedTime = blog.publishedDate
      ? new Date(blog.publishedDate).toISOString()
      : new Date(blog.createdAt).toISOString();
    const modifiedTime = blog.updatedAt
      ? new Date(blog.updatedAt).toISOString()
      : publishedTime;

    const meta = buildSeoMetadata({
      site,
      title: `${postTitle} | ${site.siteName} Blog`,
      description:
        blog.seoDescription ||
        blog.excerpt ||
        `Read the latest guides, tips, and meme culture articles from ${site.siteName}.`,
      canonicalPath: `/blog/${slug}`,
      image: ogImageUrl,
      type: 'article',
    });

    return {
      ...meta,
      openGraph: {
        ...meta.openGraph,
        type: 'article' as const,
        publishedTime,
        modifiedTime,
        authors: [authorName],
        section: `${site.siteName} Blog`,
      },
    };
  } catch {
    return buildNotFoundMetadata(
      `Article Not Found | ${site.siteName} Blog`,
      `This article could not be found on ${site.siteName} Blog.`,
    );
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  try {
    const res = await api.get(`/blogs/${slug}`);
    return <ArticleClient blog={res.data} />;
  } catch {
    return <div className="container">Article not found</div>;
  }
}
