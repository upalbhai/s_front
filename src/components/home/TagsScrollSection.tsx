'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/services/api';
import useInView from '@/hooks/useInView';
import { useTranslation } from '@/i18n';
import { Hash } from 'lucide-react';

export default function TagsScrollSection() {
  const { t } = useTranslation();
  const [tags, setTags] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const fetchTags = useCallback(async (pageNum: number, append: boolean) => {
    if (loading) return;
    setLoading(true);
    try {
      const res = await api.get(`/sounds/tags?page=${pageNum}&limit=15`);
      const newTags = res.data.tags || [];
      setTags((prev) => (append ? [...prev, ...newTags] : newTags));
      setHasMore(res.data.hasNextPage || newTags.length === 15);
      setPage(pageNum);
    } catch (error) {
      console.error('Error fetching tags:', error);
    } finally {
      setLoading(false);
    }
  }, [loading]);

  // Initial fetch
  useEffect(() => {
    fetchTags(1, false);
  }, []);

  const [sentinelRef, inView] = useInView({
    rootMargin: '100px',
  });

  // Fetch next page when sentinel is in view
  useEffect(() => {
    if (inView && hasMore && !loading) {
      fetchTags(page + 1, true);
    }
  }, [inView, hasMore, loading, page, fetchTags]);

  return (
    <section className="max-w-7xl mx-auto px-4 mt-6 mb-8">
      <div className="flex items-center gap-3 mb-3 text-slate-500 dark:text-slate-400">
        <Hash size={16} className="text-primary" />
        <span className="text-[10px] font-black uppercase tracking-widest">
          {t('home.tags.title') || 'Popular Tags'}
        </span>
      </div>

      <div className="relative">
        {/* Horizontal scroll container */}
        <div className="flex items-center gap-3 overflow-x-auto pb-4 pt-1 scrollbar-none select-none scroll-smooth">
          {tags.map((tag) => {
            const slug = encodeURIComponent(tag.name.toLowerCase().replace(/\s+/g, '-'));
            return (
              <Link key={tag.name} href={`/tag/${slug}`}>
                <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-foreground hover:border-primary hover:bg-slate-50 dark:hover:bg-slate-850 active:scale-95 transition-all cursor-pointer whitespace-nowrap shadow-xs">
                  <span className="text-slate-450 dark:text-slate-500">#</span>
                  {tag.name}
                  {tag.count > 1 && (
                    <span className="ml-1 text-[10px] font-black bg-slate-100 dark:bg-slate-800 text-slate-450 dark:text-slate-450 px-1.5 py-0.5 rounded-md">
                      {tag.count}
                    </span>
                  )}
                </span>
              </Link>
            );
          })}

          {/* Sentinel element to trigger loading more tags */}
          <div
            ref={sentinelRef as any}
            className="w-12 h-10 shrink-0 flex items-center justify-center"
          >
            {loading && (
              <div className="w-5 h-5 rounded-full border-2 border-slate-250 dark:border-slate-750 border-t-primary dark:border-t-primary animate-spin" />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
