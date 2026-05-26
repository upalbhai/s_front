'use client';

import { useState, useEffect, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/services/api';
import useDebounce from '@/hooks/useDebounce';
import HeroSection from '@/components/home/HeroSection';
import StatsSection from '@/components/home/StatsSection';
import SearchResultsSection from '@/components/home/SearchResultsSection';
import TrendingSoundsSection from '@/components/home/TrendingSoundsSection';
import CategoryGridSection from '@/components/home/CategoryGridSection';
import NewAdditionsSection from '@/components/home/NewAdditionsSection';
import FeaturesSection from '@/components/home/FeaturesSection';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import FaqSection from '@/components/home/FaqSection';
import EditorialSeoSection from '@/components/home/EditorialSeoSection';
import HomeSEOContent from '@/components/home/HomeSEOContent';
import TagsScrollSection from '@/components/home/TagsScrollSection';

export default function HomeClient({
  trendingSounds = [],
  newSounds = [],
  categories = [],
  searchResults = [],
  searchQuery
}: any) {
  const [query, setQuery] = useState(searchQuery || '');
  const debouncedQuery = useDebounce(query, 300);

  // States for tabbed sound selection
  const [activeTab, setActiveTab] = useState('trending');
  const [tabSounds, setTabSounds] = useState<any[]>(trendingSounds);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  // Sync state if initial searchQuery changes (e.g. page mount)
  useEffect(() => {
    setQuery(searchQuery || '');
  }, [searchQuery]);

  // Sync debounced query to URL search param in browser history dynamically without reload
  useEffect(() => {
    const basePath = window.location.pathname;
    if (debouncedQuery) {
      window.history.replaceState(null, '', `${basePath}?q=${encodeURIComponent(debouncedQuery)}`);
    } else {
      window.history.replaceState(null, '', basePath);
    }
  }, [debouncedQuery]);

  // Query to fetch optimized single-call homepage data
  const { data: homeData } = useQuery({
    queryKey: ['homepageData'],
    queryFn: async () => {
      const res = await api.get('/sounds/homepage');
      return res.data;
    },
    initialData: {
      trendingSounds,
      newSounds,
      categories
    },
    staleTime: 60 * 1000, // Keep fresh for 60s, then update silently in background
  });

  // Query to fetch search results dynamically if debouncedQuery is present
  const { data: searchSounds, isLoading } = useQuery({
    queryKey: ['searchSounds', debouncedQuery],
    queryFn: async () => {
      if (!debouncedQuery) return [];
      const res = await api.get(`/sounds?q=${encodeURIComponent(debouncedQuery)}&limit=40`);
      return res.data.sounds || [];
    },
    initialData: debouncedQuery === searchQuery ? searchResults : undefined,
    enabled: !!debouncedQuery,
    staleTime: 30 * 1000,
  });

  // Function to fetch sounds for the active tab (paginated)
  const fetchTabSounds = useCallback(async (tab: string, pageNum: number, append: boolean) => {
    // Optimistically use SSR/initial data for trending tab page 1 on first load
    if (tab === 'trending' && pageNum === 1 && trendingSounds.length > 0 && !append) {
      setTabSounds(trendingSounds);
      setHasMore(true);
      setPage(1);
      return;
    }

    setLoading(true);
    try {
      const res = await api.get(`/sounds?sort=${tab}&page=${pageNum}&limit=12`);
      const incoming = res.data.sounds || [];
      setTabSounds((prev) => (append ? [...prev, ...incoming] : incoming));
      setHasMore(res.data.hasNextPage || incoming.length === 12);
      setPage(pageNum);
    } catch (error) {
      console.error('Error fetching tab sounds:', error);
    } finally {
      setLoading(false);
    }
  }, [trendingSounds]);

  // Fetch new tab data whenever tab changes
  useEffect(() => {
    fetchTabSounds(activeTab, 1, false);
  }, [activeTab, fetchTabSounds]);

  const handleLoadMoreTabSounds = () => {
    fetchTabSounds(activeTab, page + 1, true);
  };

  const handleClearSearch = () => {
    setQuery('');
  };

  return (
    <div className="bg-background text-foreground animate-in fade-in duration-700 min-h-screen">
      <HeroSection
        searchQuery={query}
        onSearchChange={setQuery}
        isLoading={isLoading && debouncedQuery === query}
        trendingSounds={homeData.trendingSounds}
      />

      {/* Horizontal scrolling tags section */}
      {/* <TagsScrollSection /> */}

      {/* <StatsSection /> */}
      {query && (
        <SearchResultsSection
          searchQuery={query}
          searchResults={searchSounds || []}
          isLoading={isLoading && debouncedQuery === query}
          onClear={handleClearSearch}
        />
      )}

      {/* Unified Tabbed Sounds section */}
      <TrendingSoundsSection
        activeTab={activeTab}
        onTabChange={setActiveTab}
        sounds={tabSounds}
        loading={loading}
        hasMore={hasMore}
        onLoadMore={handleLoadMoreTabSounds}
      />

      {/* <CategoryGridSection categories={homeData.categories} /> */}
      {/* <NewAdditionsSection newSounds={homeData.newSounds} /> */}
      {/* <FeaturesSection /> */}
      {/* <TestimonialsSection /> */}
      {/* <FaqSection /> */}
      {/* <EditorialSeoSection /> */}
      <HomeSEOContent />
    </div>
  );
}

