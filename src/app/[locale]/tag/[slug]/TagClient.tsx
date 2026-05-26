'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import api from '@/services/api';
import SoundCard from '@/components/SoundCard';
import { Search } from 'lucide-react';
import useInfiniteScroll from '@/hooks/useInfiniteScroll';
import useDebounce from '@/hooks/useDebounce';
import HeroSection from '@/components/home/HeroSection';
import { useTranslation } from '@/i18n';

export default function TagClient({ initialSounds, totalSounds, tagSlug, tagName }: any) {
  const { t } = useTranslation();
  const limit = 40;
  const [sounds, setSounds] = useState(initialSounds || []);
  const [total, setTotal] = useState(totalSounds);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const debouncedSearch = useDebounce(search, 300);

  const hasMore = useMemo(() => sounds.length < total, [sounds.length, total]);

  const fetchPage = useCallback(async (targetPage: number, append: boolean) => {
    setLoading(true);
    try {
      const res = await api.get(
        `/sounds?tag=${encodeURIComponent(tagSlug)}&page=${targetPage}&limit=${limit}&q=${encodeURIComponent(searchTerm)}`
      );
      const incomingSounds = Array.isArray(res.data.sounds) ? res.data.sounds : [];
      setSounds((prev: any[]) => (append ? [...prev, ...incomingSounds] : incomingSounds));
      setTotal(Number(res.data.total) || 0);
      setPage(targetPage);
    } catch (err) {
      console.error('Error fetching tag page:', err);
    } finally {
      setLoading(false);
    }
  }, [tagSlug, searchTerm]);

  useEffect(() => {
    setSearchTerm(debouncedSearch.trim());
  }, [debouncedSearch]);

  useEffect(() => {
    if (!searchTerm) {
      setSounds(initialSounds || []);
      setTotal(totalSounds || 0);
      setPage(1);
      return;
    }
    fetchPage(1, false);
  }, [searchTerm, tagSlug, initialSounds, totalSounds, fetchPage]);

  const loadMore = useCallback(() => {
    if (loading || !hasMore) return;
    fetchPage(page + 1, true);
  }, [fetchPage, hasMore, loading, page]);

  const sentinelRef = useInfiniteScroll({
    hasMore,
    isLoading: loading,
    onLoadMore: loadMore,
  });

  return (
    <>
      <HeroSection
        searchQuery={search}
        onSearchChange={setSearch}
        isLoading={loading}
        title={t('tag.title', { name: tagName }) || `${tagName} Soundboard`}
        subtitle={t('tag.subtitle', { name: tagName }) || `Explore the best free #${tagName} sound buttons online.`}
        badge={t('tag.badge') || 'Tag Collection'}
        placeholder={t('tag.placeholder', { name: tagName }) || `Search in #${tagName}...`}
      />
      <div className="mt-12" />

      {sounds.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {sounds.map((sound: any) => (
            <SoundCard key={sound._id} sound={sound} />
          ))}
        </div>
      ) : (
        !loading && (
          <div className="text-center py-20 bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 max-w-lg mx-auto shadow-sm">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4 text-slate-400 dark:text-slate-500">
              <Search size={28} />
            </div>
            <h3 className="text-lg font-black text-foreground">
              {t('tag.no_results_title') || 'No sounds match your search'}
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-sm mx-auto font-medium">
              {t('tag.no_results_desc', { query: search }) || `We couldn't find any sound buttons matching "${search}".`}
            </p>
            <button
              onClick={() => setSearch('')}
              className="mt-6 px-5 py-2.5 bg-foreground text-background font-bold text-xs rounded-xl shadow-lg transition-all active:scale-95 cursor-pointer"
            >
              {t('common.clear_search')}
            </button>
          </div>
        )
      )}

      <div ref={sentinelRef} style={{ height: 1 }} />
      {(loading || hasMore) && (
        <div className="pagination flex justify-center gap-8 mt-8 items-center">
          <span className="text-sm font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider animate-pulse">
            {loading ? t('common.loading') : t('tag.scroll_more', { name: tagName }) || t('common.scroll_more')}
          </span>
        </div>
      )}
    </>
  );
}
