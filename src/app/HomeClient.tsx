'use client';

import { useState, useEffect } from 'react';
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

export default function HomeClient({
  trendingSounds = [],
  newSounds = [],
  categories = [],
  searchResults = [],
  searchQuery
}: any) {
  const [query, setQuery] = useState(searchQuery || '');
  const debouncedQuery = useDebounce(query, 300);

  // Sync state if initial searchQuery changes (e.g. page mount)
  useEffect(() => {
    setQuery(searchQuery || '');
  }, [searchQuery]);

  // Sync debounced query to URL search param in browser history dynamically without reload
  useEffect(() => {
    if (debouncedQuery) {
      window.history.replaceState(null, '', `/?q=${encodeURIComponent(debouncedQuery)}`);
    } else {
      window.history.replaceState(null, '', '/');
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
      {/* <StatsSection /> */}
      {query && (
        <SearchResultsSection
          searchQuery={query}
          searchResults={searchSounds || []}
          isLoading={isLoading && debouncedQuery === query}
          onClear={handleClearSearch}
        />
      )}
      <TrendingSoundsSection trendingSounds={homeData.trendingSounds} />
      {/* <CategoryGridSection categories={homeData.categories} /> */}
      <NewAdditionsSection newSounds={homeData.newSounds} />
      {/* <FeaturesSection /> */}
      {/* <TestimonialsSection /> */}
      {/* <FaqSection /> */}
      {/* <EditorialSeoSection /> */}
    </div>
  );
}

