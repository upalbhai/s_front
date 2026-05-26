'use client';

import { useEffect, useState } from 'react';
import api from '@/services/api';
import Link from 'next/link';

export default function BlogListClient({ initialBlogs }: { initialBlogs: any[] }) {
  const [blogs, setBlogs] = useState(initialBlogs || []);
  const [loading, setLoading] = useState(!initialBlogs?.length);

  useEffect(() => {
    if (initialBlogs?.length) return;

    const fetchBlogs = async () => {
      try {
        const res = await api.get('/blogs');
        setBlogs(res.data.blogs || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, [initialBlogs]);

  return (
    <div className="container" style={{ padding: '4rem 0' }}>
      <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <h1 className="text-gradient" style={{ fontSize: '3rem', marginBottom: '1rem' }}>Blog</h1>
        <p style={{ color: 'var(--text-muted)' }}>Guides, tips, and meme culture articles.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
        {blogs.map((blog: any) => (
          <Link href={`/article/${blog.slug}`} key={blog._id} className="glass-card blog-card">
            {blog.featuredImage && (
              <img src={blog.featuredImage} alt={blog.title} style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '12px', marginBottom: '1.5rem' }} />
            )}
            <h2 style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>{blog.title}</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>{blog.excerpt}</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{new Date(blog.publishedDate).toLocaleDateString()}</span>
              <span className="text-primary" style={{ fontWeight: '600' }}>Read More →</span>
            </div>
          </Link>
        ))}
      </div>

      {blogs.length === 0 && !loading && (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
          No blog posts found. Check back soon!
        </div>
      )}
    </div>
  );
}
