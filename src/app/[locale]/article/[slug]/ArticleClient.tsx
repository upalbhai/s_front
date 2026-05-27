'use client';

import Link from 'next/link';
import { ChevronRight, Calendar, User } from 'lucide-react';
import { useLocalePath } from '@/i18n';

export default function ArticleClient({ blog }: { blog: any }) {
  const lp = useLocalePath();
  return (
    <div className="container mx-auto px-4 py-16 max-w-3xl">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400 mb-8">
        <Link href={lp('/')} className="hover:text-foreground transition-colors">Home</Link>
        <ChevronRight size={14} />
        <Link href={lp('/blog')} className="hover:text-foreground transition-colors">Blog</Link>
        <ChevronRight size={14} />
        <span className="text-primary font-bold">{blog.title}</span>
      </nav>

      <article>
        <h1 className="text-4xl md:text-5xl font-black tracking-tighter leading-tight text-foreground mb-6">{blog.title}</h1>

        <div className="flex gap-6 mb-10 text-sm font-medium text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <Calendar size={16} />
            {new Date(blog.publishedDate).toLocaleDateString()}
          </div>
          <div className="flex items-center gap-2">
            <User size={16} />
            {blog.author}
          </div>
        </div>

        {blog.featuredImage && (
          <img
            src={blog.featuredImage}
            alt={blog.title}
            className="w-full rounded-3xl mb-10 shadow-lg"
          />
        )}

        <div
          className="prose prose-lg dark:prose-invert max-w-none text-foreground leading-relaxed [&_p]:mb-6 [&_h2]:mt-12 [&_h2]:mb-6 [&_h2]:text-3xl [&_h2]:font-black [&_h2]:tracking-tight"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />
      </article>
    </div>
  );
}
