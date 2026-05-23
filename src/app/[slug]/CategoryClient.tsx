'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import api from '@/services/api';
import SoundCard from '@/components/SoundCard';
import { Search } from 'lucide-react';
import useInfiniteScroll from '@/hooks/useInfiniteScroll';
import useDebounce from '@/hooks/useDebounce';
import HeroSection from '@/components/home/HeroSection';

export default function CategoryClient({ initialSounds, totalSounds, categoryId, categoryName }: any) {
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
      const res = await api.get(`/sounds?category=${categoryId}&page=${targetPage}&limit=${limit}&q=${encodeURIComponent(searchTerm)}`);
      const incomingSounds = Array.isArray(res.data.sounds) ? res.data.sounds : [];
      setSounds((prev: any[]) => (append ? [...prev, ...incomingSounds] : incomingSounds));
      setTotal(Number(res.data.total) || 0);
      setPage(targetPage);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [categoryId, searchTerm]);

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
  }, [searchTerm, categoryId, initialSounds, totalSounds, fetchPage]);

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
        title={`${categoryName} Soundboard`}
        subtitle={`Explore the best ${categoryName} sounds online. Play or download free clips instantly.`}
        badge="Category Soundboard"
        placeholder={`Search in ${categoryName}...`}
      />
      <div className="mt-12" />

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {sounds.map((sound: any) => (
          <SoundCard key={sound._id} sound={sound} />
        ))}
      </div>

      <div ref={sentinelRef} style={{ height: 1 }} />
      {(loading || hasMore) && (
        <div className="pagination" style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginTop: '2rem', alignItems: 'center' }}>
          <span className="text-sm font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider animate-pulse">
            {loading ? 'Loading more sounds...' : 'Scroll to load more'}
          </span>
        </div>
      )}
    </>
  );
}

