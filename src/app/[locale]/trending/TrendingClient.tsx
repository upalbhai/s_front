'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import api from '@/services/api';
import SoundCard from '@/components/SoundCard';
import useInfiniteScroll from '@/hooks/useInfiniteScroll';
import { Search } from 'lucide-react';
import HeroSection from '@/components/home/HeroSection';
import { useTranslation } from '@/i18n';

export default function TrendingClient({ h1Title, shortDescription, initialSounds = [], initialTotal = 0 }: any) {
  const { t } = useTranslation();
  const limit = 40;
  const [sounds, setSounds] = useState<any[]>(initialSounds);
  const [total, setTotal] = useState(initialTotal);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(initialSounds.length > 0);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const hasMore = useMemo(() => sounds.length < total, [sounds.length, total]);

  const fetchPage = useCallback(async (targetPage: number, append: boolean, queryText: string) => {
    setLoading(true);
    try {
      const res = await api.get(`/sounds?sort=trending&page=${targetPage}&limit=${limit}&q=${encodeURIComponent(queryText)}`);
      const incoming = Array.isArray(res.data.sounds) ? res.data.sounds : [];
      setSounds((prev) => (append ? [...prev, ...incoming] : incoming));
      setTotal(Number(res.data.total) || 0);
      setPage(targetPage);
    } catch (error) {
      console.error('Error fetching trending sounds:', error);
    } finally {
      setLoading(false);
      setInitialized(true);
    }
  }, []);

  // When debounced query changes, refetch page 1
  useEffect(() => {
    if (!debouncedQuery && initialSounds.length > 0 && sounds === initialSounds && page === 1) {
      return;
    }
    fetchPage(1, false, debouncedQuery);
  }, [debouncedQuery, fetchPage, initialSounds, sounds, page]);

  const loadMore = useCallback(() => {
    if (loading || !hasMore) return;
    fetchPage(page + 1, true, debouncedQuery);
  }, [fetchPage, hasMore, loading, page, debouncedQuery]);

  const sentinelRef = useInfiniteScroll({
    hasMore,
    isLoading: loading,
    onLoadMore: loadMore,
  });

  return (
    <div className="bg-background text-foreground animate-in fade-in duration-500 min-h-screen">
      <section className="max-w-7xl mx-auto px-4">

        <HeroSection
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          isLoading={loading}
          title={h1Title || t('trending.title')}
          subtitle={shortDescription || undefined}
          badge={t('trending.badge')}
          placeholder={t('trending.placeholder')}
        />

        {/* Sounds Grid */}
        {sounds.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {sounds.map((sound: any) => (
              <SoundCard key={sound._id} sound={sound} />
            ))}
          </div>
        ) : (
          initialized && !loading && (
            <div className="text-center py-20 bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 max-w-lg mx-auto shadow-sm">
              <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4 text-slate-400 dark:text-slate-500">
                <Search size={28} />
              </div>
              <h3 className="text-lg font-black text-foreground">{t('trending.no_results_title')}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-sm mx-auto font-medium">
                {t('trending.no_results_desc', { query: searchQuery })}
              </p>
              <button
                onClick={() => setSearchQuery('')}
                className="mt-6 px-5 py-2.5 bg-foreground text-background font-bold text-xs rounded-xl shadow-lg transition-all active:scale-95"
              >
                {t('common.clear_search')}
              </button>
            </div>
          )
        )}

        {/* Infinite Scroll / Loading State Indicator */}
        <div ref={sentinelRef} className="h-4" />

        {loading && (
          <div className="flex flex-col items-center justify-center mt-16 gap-3">
            <div className="w-8 h-8 rounded-full border-4 border-slate-200 dark:border-slate-800 border-t-primary dark:border-t-primary animate-spin" />
            <span className="text-xs font-black text-foreground/80 uppercase tracking-widest animate-pulse">{t('common.loading')}</span>
          </div>
        )}

        {!loading && initialized && hasMore && (
          <div className="flex justify-center mt-12">
            <span className="text-xs font-bold text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-900 px-4 py-2 rounded-full border border-slate-200/40 dark:border-slate-800/40 shadow-sm">
              {t('trending.scroll_more')}
            </span>
          </div>
        )}
      </section>
    </div>
  );
}
