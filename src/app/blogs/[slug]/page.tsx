import api from '@/services/api';
import { getRequestSite } from '@/config/sites';
import { buildSeoMetadata } from '@/lib/seo';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Calendar, User, ArrowLeft, Eye } from 'lucide-react';
import { notFound } from 'next/navigation';
import { headers } from 'next/headers';
import { cache } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

const getImageUrl = (path: string) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  let url = '';
  if (process.env.NODE_ENV === 'production') {
    url = path;
  } else {
    url = API_URL.replace('/api/v1', '') + path;
  }
  console.log('getImageUrl log:', { path, url, env: process.env.NODE_ENV });
  return url;
};

const getBlog = cache(async (slug: string, siteId: string) => {
  const res = await api.get(`/blogs/${slug}?siteId=${siteId}`);
  return res.data;
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const site = await getRequestSite();
  const headersList = await headers();
  const locale = headersList.get('x-locale') || 'en';

  try {
    const blog = await getBlog(slug, site.id);
    
    const ogImagePath = blog.ogImage || blog.featuredImage;
    let absoluteOgImage = undefined;
    if (ogImagePath) {
      const imgUrl = getImageUrl(ogImagePath);
      absoluteOgImage = imgUrl.startsWith('http') ? imgUrl : `${site.siteUrl}${imgUrl}`;
    }

    return buildSeoMetadata({
      site,
      title: blog.seoTitle || `${blog.title} | ${site.siteName}`,
      description: blog.seoDescription || blog.excerpt || blog.title,
      canonicalPath: `/blogs/${slug}`,
      locale,
      image: absoluteOgImage,
    });
  } catch (error) {
    return buildSeoMetadata({
      site,
      title: `Blog | ${site.siteName}`,
      description: `Read our latest articles on ${site.siteName}`,
      canonicalPath: `/blogs/${slug}`,
      locale,
    });
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const site = await getRequestSite();

  let blog = null;

  try {
    blog = await getBlog(slug, site.id);
  } catch (error: any) {
    if (error.response?.status === 404) {
      notFound();
    }
  }

  if (!blog) return null;

  return (
    <article className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-24">
      {/* Hero Header */}
      <div className="relative pt-10 px-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-500/10 via-slate-50/50 dark:via-slate-900 to-slate-50 dark:to-slate-950" />

        <div className="max-w-4xl mx-auto relative z-10">
          <Link href="/blogs" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors mb-8 group">
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Back to Articles
          </Link>

          <div className="flex items-center gap-6 text-sm font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-6 flex-wrap">
            <div className="flex items-center gap-2">
              <Calendar size={16} className="text-indigo-500" />
              {new Date(blog.publishedDate).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
            <div className="flex items-center gap-2">
              <User size={16} className="text-purple-500" />
              {blog.author}
            </div>
            <div className="flex items-center gap-2">
              <Eye size={16} className="text-sky-500" />
              {blog.views?.toLocaleString() || 0} Views
            </div>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tighter text-black dark:text-white leading-[1.1] mb-8">
            {blog.title}
          </h1>

          {blog.excerpt && (
            <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 font-medium leading-relaxed max-w-3xl">
              {blog.excerpt}
            </p>
          )}
        </div>
      </div>

      {/* Featured Image */}
      {blog.featuredImage && (
        <div className="max-w-5xl mx-auto px-4 -mt-8 relative z-20">
          <div className="aspect-[21/9] bg-slate-200 dark:bg-slate-800 rounded-3xl overflow-hidden shadow-2xl shadow-indigo-500/10 border-4 border-white dark:border-slate-900">
            <img
              src={getImageUrl(blog.featuredImage)}
              alt={blog.title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}

      {/* Blog Content */}
      <div className={`max-w-3xl mx-auto px-4 ${blog.featuredImage ? 'pt-16' : 'pt-8'}`}>
        <div
          className="blog-content prose dark:prose-invert prose-slate prose-lg max-w-none 
          prose-headings:font-black prose-headings:tracking-tight 
          prose-a:text-indigo-600 dark:prose-a:text-indigo-400 prose-a:font-bold prose-a:no-underline hover:prose-a:underline
          prose-img:rounded-2xl prose-img:shadow-lg prose-img:border prose-img:border-slate-200 dark:prose-img:border-slate-800"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        .blog-content p { margin-bottom: 1.5em; line-height: 1.8; color: var(--tw-prose-body); font-weight: 500; }
        .blog-content h2 { font-size: 2em; margin-top: 2em; margin-bottom: 1em; }
        .blog-content h3 { font-size: 1.5em; margin-top: 1.5em; margin-bottom: 0.5em; }
        .blog-content ul, .blog-content ol { margin-left: 1.5em; margin-bottom: 1.5em; font-weight: 500; }
        .blog-content li { margin-bottom: 0.5em; }
        .blog-content blockquote { border-left: 4px solid #6366f1; padding-left: 1.5em; font-style: italic; color: var(--tw-prose-quotes); margin: 2em 0; }
      `}} />
    </article>
  );
}
