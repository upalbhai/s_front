'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/services/api';
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

  // Query to fetch search results dynamically if search query is present
  const { data: searchSounds } = useQuery({
    queryKey: ['searchSounds', searchQuery],
    queryFn: async () => {
      if (!searchQuery) return [];
      const res = await api.get(`/sounds?q=${encodeURIComponent(searchQuery)}&limit=40`);
      return res.data.sounds || [];
    },
    initialData: searchResults,
    enabled: !!searchQuery,
    staleTime: 30 * 1000,
  });

  return (
    <div className="bg-background text-foreground animate-in fade-in duration-700 min-h-screen">
      <HeroSection searchQuery={searchQuery} trendingSounds={homeData.trendingSounds} />
      <StatsSection />
      {searchQuery && (
        <SearchResultsSection searchQuery={searchQuery} searchResults={searchSounds} />
      )}
      <TrendingSoundsSection trendingSounds={homeData.trendingSounds} />
      <CategoryGridSection categories={homeData.categories} />
      <NewAdditionsSection newSounds={homeData.newSounds} />
      <FeaturesSection />
      <TestimonialsSection />
      <FaqSection />
      <EditorialSeoSection />
    </div>
  );
}
