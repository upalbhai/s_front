'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import api from '@/services/api';
import SoundCard from '@/components/SoundCard';
import { Search } from 'lucide-react';
import useInfiniteScroll from '@/hooks/useInfiniteScroll';

export default function CategoryClient({ initialSounds, totalSounds, categoryId, categoryName }: any) {
  const limit = 40;
  const [sounds, setSounds] = useState(initialSounds || []);
  const [total, setTotal] = useState(totalSounds);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

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
    if (!searchTerm) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSounds(initialSounds || []);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTotal(totalSounds || 0);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPage(1);
      return;
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
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
      <div className="category-search-wrapper" style={{ display: 'flex', justifyContent: 'center', marginBottom: '3rem' }}>
        <div className="category-search glass-card" style={{ display: 'flex', alignItems: 'center', padding: '0.75rem 1.5rem', gap: '1rem', borderRadius: '100px', width: '100%', maxWidth: '500px' }}>
          <Search size={20} className="text-muted" />
          <input 
            type="text" 
            placeholder={`Search in ${categoryName}...`} 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                setSearchTerm(search.trim());
              }
            }}
            style={{ background: 'none', border: 'none', color: 'white', width: '100%', fontSize: '1rem', outline: 'none' }}
          />
        </div>
      </div>

      <div className="sound-grid">
        {sounds.map((sound: any) => (
          <SoundCard key={sound._id} sound={sound} />
        ))}
      </div>

      <div ref={sentinelRef} style={{ height: 1 }} />
      {(loading || hasMore) && (
        <div className="pagination" style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginTop: '2rem', alignItems: 'center' }}>
          <span style={{ color: 'var(--text-muted)' }}>
            {loading ? 'Loading more sounds...' : 'Scroll to load more'}
          </span>
        </div>
      )}
    </>
  );
}
