'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import api from '@/services/api';
import SoundCard from '@/components/SoundCard';
import useInfiniteScroll from '@/hooks/useInfiniteScroll';

export default function NewSoundsPage() {
  const limit = 40;
  const [sounds, setSounds] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);

  const hasMore = useMemo(() => sounds.length < total, [sounds.length, total]);

  const fetchPage = useCallback(async (targetPage: number, append: boolean) => {
    setLoading(true);
    try {
      const res = await api.get(`/sounds?page=${targetPage}&limit=${limit}`);
      const incoming = Array.isArray(res.data.sounds) ? res.data.sounds : [];
      setSounds((prev) => (append ? [...prev, ...incoming] : incoming));
      setTotal(Number(res.data.total) || 0);
      setPage(targetPage);
    } catch (error) {
      console.error('Error fetching new sounds:', error);
    } finally {
      setLoading(false);
      setInitialized(true);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchPage(1, false);
  }, [fetchPage]);

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
    <div className="container" style={{ padding: '4rem 0' }}>
      <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <h1 className="text-gradient" style={{ fontSize: '3rem', marginBottom: '1rem' }}>New Sound Buttons</h1>
        <p style={{ color: 'var(--text-muted)' }}>Latest meme sounds and viral audio clips added today.</p>
      </div>

      <div className="sound-grid">
        {sounds.map((sound: any) => (
          <SoundCard key={sound._id} sound={sound} />
        ))}
      </div>

      <div ref={sentinelRef} style={{ height: 1 }} />
      {(loading || (initialized && hasMore)) && (
        <div className="pagination" style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
          <span style={{ color: 'var(--text-muted)' }}>
            {loading ? 'Loading more sounds...' : 'Scroll to load more'}
          </span>
        </div>
      )}
    </div>
  );
}
