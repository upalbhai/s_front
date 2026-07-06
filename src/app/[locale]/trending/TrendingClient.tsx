'use client';

import { useCallback, useEffect, useMemo, useState, useRef } from 'react';
import api from '@/services/api';
import SoundCard from '@/components/SoundCard';
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

  const isFirstRender = useRef(true);

  // When debounced query changes, refetch page 1
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    fetchPage(1, false, debouncedQuery);
  }, [debouncedQuery, fetchPage]);

  const loadMore = useCallback(() => {
    if (loading || !hasMore) return;
    fetchPage(page + 1, true, debouncedQuery);
  }, [fetchPage, hasMore, loading, page, debouncedQuery]);

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

        {/* Load More Button */}
        {hasMore && initialized && (
          <div className="flex justify-center mt-12">
            <button
              onClick={loadMore}
              disabled={loading}
              className="px-8 py-3 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors disabled:opacity-50 flex items-center justify-center min-w-[200px]"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full border-2 border-slate-400 dark:border-slate-500 border-t-transparent dark:border-t-transparent animate-spin" />
                  <span>{t('common.loading')}</span>
                </div>
              ) : (
                t('common.load_more')
              )}
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
