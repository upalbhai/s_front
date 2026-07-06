import api from '@/services/api';
import { getRequestSite } from '@/config/sites';
import { buildSeoMetadata } from '@/lib/seo';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Calendar, User, ArrowRight } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const site = await getRequestSite();

  return buildSeoMetadata({
    site,
    title: `Blog | ${site.siteName}`,
    description: `Read the latest articles and updates from ${site.siteName}`,
    canonicalPath: '/blog',
    locale,
  });
}

export default async function BlogPage({ params, searchParams }: { params: Promise<{ locale: string }>; searchParams: Promise<{ page?: string }> }) {
  const { locale } = await params;
  const { page } = await searchParams;
  const currentPage = Math.max(Number(page) || 1, 1);
  const site = await getRequestSite();

  let blogs = [];
  let totalPages = 1;

  try {
    const res = await api.get(`/blogs?page=${currentPage}&limit=12&isPublished=true`);
    blogs = res.data.blogs || res.data.items || [];
    totalPages = res.data.pages || 1;
  } catch (error) {
    console.error('Error fetching blogs:', error);
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-24">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-purple-500/5" />
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-500/10 blur-[100px] rounded-full" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 blur-[100px] rounded-full" />

        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tighter text-black dark:text-white">
              Latest <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500">Articles</span>
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 font-medium">
              Discover insights, updates, and stories from our team.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        {blogs.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-slate-500 font-medium">No blog posts available at the moment.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog: any) => (
              <Link key={blog._id} href={`/blog/${blog.slug}`} className="group flex flex-col bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300 hover:-translate-y-1">
                <div className="aspect-[16/10] bg-slate-100 dark:bg-slate-800 relative overflow-hidden">
                  {blog.featuredImage ? (
                    <img
                      src={API_URL.replace('/api/v1', '') + blog.featuredImage}
                      alt={blog.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-500/10 to-purple-500/10">
                      <span className="text-indigo-500/40 material-icons text-6xl">image</span>
                    </div>
                  )}
                </div>

                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex items-center gap-4 text-xs font-black uppercase tracking-widest text-slate-400 mb-4">
                    <div className="flex items-center gap-1.5">
                      <Calendar size={14} className="text-indigo-500" />
                      {new Date(blog.publishedDate).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <User size={14} className="text-purple-500" />
                      <span className="truncate max-w-[100px]">{blog.author}</span>
                    </div>
                  </div>

                  <h2 className="text-xl font-black text-black dark:text-white mb-3 line-clamp-2 group-hover:text-indigo-500 transition-colors">
                    {blog.title}
                  </h2>

                  <p className="text-sm text-slate-600 dark:text-slate-400 font-medium line-clamp-3 mb-6 flex-1">
                    {blog.excerpt || blog.content.replace(/<[^>]+>/g, '').substring(0, 150) + '...'}
                  </p>

                  <div className="flex items-center gap-2 text-sm font-bold text-indigo-500 mt-auto">
                    Read Article <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-16">
            {Array.from({ length: totalPages }).map((_, i) => (
              <Link
                key={i}
                href={`/blog?page=${i + 1}`}
                className={`w-10 h-10 rounded-xl flex items-center justify-center font-black transition-all ${currentPage === i + 1
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                  : 'bg-white dark:bg-slate-900 text-slate-500 border border-slate-200 dark:border-slate-800 hover:border-indigo-500/50 hover:text-indigo-500'
                  }`}
              >
                {i + 1}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
