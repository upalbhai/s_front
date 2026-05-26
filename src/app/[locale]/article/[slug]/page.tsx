import api from '@/services/api';
import { Metadata, Viewport } from 'next';
import ArticleClient from './ArticleClient';

export const viewport: Viewport = {
  themeColor: '#2563eb',
  width: 'device-width',
  initialScale: 1,
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  try {
    const res = await api.get(`/blogs/${slug}`);
    const blog = res.data;
    if (!blog) {
      throw new Error('Blog post not found');
    }

    const postTitle = blog.title;
    const authorName = blog.author || 'SoundboardMax';
    const canonicalUrl = `https://soundboardmax.net/blog/${slug}`;
    const ogImageUrl = blog.ogImage || blog.featuredImage || 'https://soundboardmax.net/blog/default-image.png';
    const publishedTime = blog.publishedDate ? new Date(blog.publishedDate).toISOString() : new Date(blog.createdAt).toISOString();
    const modifiedTime = blog.updatedAt ? new Date(blog.updatedAt).toISOString() : publishedTime;

    return {
      title: `${postTitle} | SoundboardMax Blog`,
      description: blog.seoDescription || blog.excerpt || `Read the latest guides, tips, and meme culture articles from SoundboardMax.`,
      alternates: {
        canonical: canonicalUrl,
      },
      keywords: `soundboard, sound effects, ${postTitle}, audio clips, meme sounds, sound buttons, blog`,
      authors: [{ name: authorName }],
      publisher: "SoundboardMax.net",
      creator: "SoundboardMax.net",
      applicationName: "SoundboardMax",
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          'max-video-preview': -1,
          'max-image-preview': 'large',
          'max-snippet': -1,
        },
      },
      formatDetection: {
        telephone: false,
      },
      appleWebApp: {
        capable: true,
        title: "SoundboardMax",
        statusBarStyle: "default",
      },
      openGraph: {
        title: `${postTitle} | SoundboardMax Blog`,
        description: blog.seoDescription || blog.excerpt || `Read the latest guides, tips, and meme culture articles from SoundboardMax.`,
        type: "article",
        url: canonicalUrl,
        siteName: "SoundboardMax",
        locale: "en_US",
        publishedTime: publishedTime,
        modifiedTime: modifiedTime,
        authors: [authorName],
        section: "SoundboardMax Blog",
        tags: ["soundboard", "sound effects", "audio clips", "meme sounds", "sound buttons"],
        images: [
          {
            url: ogImageUrl,
            alt: postTitle,
            width: 1200,
            height: 630,
            type: "image/png",
          }
        ],
      },
      twitter: {
        card: "summary_large_image",
        site: "@soundboardmax",
        creator: "@soundboardmax",
        title: `${postTitle} | SoundboardMax Blog`,
        description: blog.seoDescription || blog.excerpt || `Read the latest guides, tips, and meme culture articles from SoundboardMax.`,
        images: [
          {
            url: ogImageUrl,
            alt: postTitle,
            width: 1200,
            height: 630,
          }
        ],
      },
      other: {
        rating: "general",
        distribution: "global",
        coverage: "worldwide",
        target: "all",
        HandheldFriendly: "true",
        MobileOptimized: "width",
        'mobile-web-app-capable': "yes",
        'msapplication-TileColor': "#2563eb",
        'msapplication-config': "/browserconfig.xml",
      }
    };
  } catch (error) {
    return {
      title: 'Article Not Found | SoundboardMax Blog',
      description: 'This article could not be found on SoundboardMax Blog.',
      robots: { index: false, follow: true },
    };
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
