'use client';

import { useCallback, useMemo, useState } from 'react';
import api from '@/services/api';
import SoundCard from '@/components/SoundCard';
import { Loader2 } from 'lucide-react';
import useInfiniteScroll from '@/hooks/useInfiniteScroll';
import { useTranslation, useLocalePath } from '@/i18n';

interface SearchPageClientProps {
  query: string;
  initialResults: any[];
  total: number;
}

export default function SearchPageClient({ query, initialResults, total }: SearchPageClientProps) {
  const { t } = useTranslation();
  const lp = useLocalePath();
  const limit = 40;
  
  const [results, setResults] = useState<any[]>(initialResults || []);
  const [totalResults, setTotalResults] = useState(total || 0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const hasMore = useMemo(() => results.length < totalResults, [results.length, totalResults]);

  const fetchPage = useCallback(async (targetPage: number) => {
    setLoading(true);
    try {
      const res = await api.get(
        `/sounds?q=${encodeURIComponent(query)}&page=${targetPage}&limit=${limit}`
      );
      const incomingSounds = Array.isArray(res.data.sounds) ? res.data.sounds : [];
      setResults(prev => [...prev, ...incomingSounds]);
      setTotalResults(Number(res.data.total) || 0);
      setPage(targetPage);
    } catch (err) {
      console.error('Error fetching more search results:', err);
    } finally {
      setLoading(false);
    }
  }, [query]);

  const loadMore = useCallback(() => {
    if (loading || !hasMore) return;
    fetchPage(page + 1);
  }, [fetchPage, hasMore, loading, page]);

  const sentinelRef = useInfiniteScroll({
    hasMore,
    isLoading: loading,
    onLoadMore: loadMore,
  });

  const handleClear = () => {
    window.location.href = lp('/');
  };

  return (
    <main className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-16 md:py-24">
        
        <div className="flex items-center gap-3 mb-12">
          <div className="w-1.5 h-8 bg-primary rounded-full" />
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-foreground">
            {t('home.search.results_for', { query }) || `Search results for "${query}"`}
          </h1>
          <span className="ml-2 text-sm font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">
            {totalResults}
          </span>
        </div>

        {results.length === 0 ? (
          <div className="text-center py-24 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800 max-w-2xl mx-auto">
            <p className="text-slate-500 font-bold italic text-xl">
              {t('home.search.no_results') || 'No results found'}
            </p>
            <button 
              onClick={handleClear} 
              className="mt-6 px-6 py-3 bg-primary text-primary-foreground font-black uppercase tracking-wide rounded-xl shadow-lg hover:shadow-primary/30 transition-all active:scale-95 cursor-pointer"
            >
              {t('home.search.clear') || 'Clear search'}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {results.map((sound: any) => (
              <SoundCard key={sound._id} sound={sound} />
            ))}
          </div>
        )}

        <div ref={sentinelRef} style={{ height: 1 }} className="mt-8" />
        
        {(loading || hasMore) && results.length > 0 && (
          <div className="flex flex-col items-center justify-center py-10 gap-3">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
            <span className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest animate-pulse">
              {t('common.loading') || 'Loading more...'}
            </span>
          </div>
        )}

      </div>
    </main>
  );
}
