'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Edit3, Plus, Trash2, FileText } from 'lucide-react';
import api from '@/services/api';
import { AdminBlogPost } from '../admin-types';
import { useAdminSession } from '../useAdminSession';
import { toast } from 'react-hot-toast';
import { DataTable, ColumnDef } from '@/components/DataTable';
import { useRouter } from 'next/navigation';

async function fetchBlogs(q: string, page: number, limit: number) {
  const params = new URLSearchParams({ limit: limit.toString(), page: page.toString(), admin: 'true' });
  if (q.trim()) params.set('q', q.trim());
  const res = await api.get(`/blogs?${params}`);
  return {
    blogs: Array.isArray(res.data.blogs) ? res.data.blogs as AdminBlogPost[] : Array.isArray(res.data.items) ? res.data.items as AdminBlogPost[] : [],
    total: res.data.total ?? 0,
  };
}

export default function AdminBlogsPage() {
  const { ready } = useAdminSession();
  const queryClient = useQueryClient();
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [blogToDelete, setBlogToDelete] = useState<string | null>(null);

  // ── TanStack Query ────────────────────────────────────────────────────────
  const { data: blogsData, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ['admin-blogs', query, page, limit],
    queryFn: () => fetchBlogs(query, page, limit),
    enabled: ready,
  });

  const blogs = blogsData?.blogs ?? [];
  const total = blogsData?.total ?? 0;

  // ── Delete mutation ───────────────────────────────────────────────────────
  const deleteMutation = useMutation({
    mutationFn: (blogId: string) => api.delete(`/blogs/${blogId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-blogs'] });
      toast.success('Blog deleted successfully');
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message ?? 'Failed to delete blog.');
    }
  });

  const handleDelete = (blogId: string) => {
    setBlogToDelete(blogId);
  };

  const confirmDelete = () => {
    if (blogToDelete) {
      deleteMutation.mutate(blogToDelete);
      setBlogToDelete(null);
    }
  };

  const columns: ColumnDef<AdminBlogPost>[] = [
    {
      header: 'Title',
      id: 'title',
      render: (blog) => (
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-500 shrink-0">
            <FileText size={16} />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-black text-foreground transition-colors truncate">{blog.title}</p>
            <p className="text-[11px] text-slate-400 font-medium truncate max-w-[220px]">{blog.excerpt || 'No excerpt'}</p>
          </div>
        </div>
      )
    },
    {
      header: 'Slug',
      id: 'slug',
      render: (blog) => (
        <span className="text-sm font-medium text-slate-500 dark:text-slate-400 font-mono">
          {blog.slug || '—'}
        </span>
      )
    },
    {
      header: 'Status',
      id: 'status',
      render: (blog) => (
        <span className={`px-2.5 py-1 text-[10px] font-black uppercase tracking-widest rounded-md ${blog.isPublished ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'}`}>
          {blog.isPublished ? 'Public' : 'Draft'}
        </span>
      )
    },
    {
      header: 'Date',
      id: 'date',
      render: (blog) => (
        <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
          {blog.publishedDate ? new Date(blog.publishedDate).toLocaleDateString() : '—'}
        </span>
      )
    },
    {
      header: 'Actions',
      id: 'actions',
      render: (blog) => (
        <div className="flex gap-2">
          <button
            onClick={(e) => { e.stopPropagation(); router.push(`/admin/blogs/${blog._id}`); }}
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-foreground transition-all duration-200"
            title="Edit"
          >
            <Edit3 size={14} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); handleDelete(blog._id); }}
            disabled={deleteMutation.isPending && deleteMutation.variables === blog._id}
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-red-500 hover:border-red-500/30 transition-all duration-200 disabled:opacity-50"
            title="Delete"
          >
            <Trash2 size={14} />
          </button>
        </div>
      )
    }
  ];

  if (!ready) return null;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between bg-white dark:bg-slate-900 p-4 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-500 shrink-0">
            <FileText size={24} />
          </div>
          <div>
            <h2 className="text-lg font-black text-foreground uppercase tracking-tight">Blogs</h2>
            <p className="text-sm text-slate-500 font-medium">Manage your blog posts</p>
          </div>
        </div>

        <button
          onClick={() => router.push('/admin/blogs/new')}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl transition-all shadow-sm hover:shadow-md hover:shadow-indigo-500/20 active:scale-95"
        >
          <Plus size={16} />
          <span>New Blog</span>
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
        <DataTable<AdminBlogPost>
          columns={columns}
          data={blogs}
          isLoading={isLoading || isRefetching}
          totalItems={total}
          page={page}
          limit={limit}
          onPageChange={setPage}
          onLimitChange={setLimit}
          searchQuery={query}
          onSearchChange={setQuery}
          onRefetch={refetch}
          refetchIntervalSeconds={15}
          placeholderText="Search blogs..."
          emptyStateText={query ? `No blogs found for "${query}"` : "No blogs found"}
          onClearFilters={() => setQuery('')}
          hasActiveFilters={!!query}
          onRowClick={(blog: AdminBlogPost) => router.push(`/admin/blogs/${blog._id}`)}
        />
      </div>

      {blogToDelete && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl max-w-sm w-full p-6 animate-in zoom-in-95 duration-200">
            <h3 className="text-lg font-black text-foreground mb-2">Delete Blog Post</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
              Are you sure you want to delete this blog post? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setBlogToDelete(null)}
                className="px-4 py-2 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 rounded-xl text-sm font-bold text-white bg-red-500 hover:bg-red-600 transition-colors shadow-sm hover:shadow-md hover:shadow-red-500/20 active:scale-95"
              >
                Delete Post
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
