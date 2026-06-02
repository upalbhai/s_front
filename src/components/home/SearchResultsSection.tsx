'use client';

import SoundCard from '@/components/SoundCard';
import { Loader2 } from 'lucide-react';
import { useTranslation } from '@/i18n';

interface SearchResultsSectionProps {
  searchQuery: string;
  searchResults: any[];
  isLoading?: boolean;
  onClear?: () => void;
}

export default function SearchResultsSection({
  searchQuery,
  searchResults,
  isLoading = false,
  onClear
}: SearchResultsSectionProps) {
  const { t } = useTranslation();

  const handleClear = () => {
    if (onClear) {
      onClear();
    } else {
      window.location.href = '/';
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-16 md:py-20 animate-in fade-in slide-in-from-bottom-6 duration-300">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-1.5 h-8 bg-primary rounded-full" />
        <h2 className="text-3xl font-black tracking-tight text-foreground">
          {isLoading 
            ? t('home.search.searching_for', { query: searchQuery }) 
            : t('home.search.results_for', { query: searchQuery })}
        </h2>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
          <span className="text-sm font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest animate-pulse">{t('home.search.searching_board')}</span>
        </div>
      ) : searchResults.length === 0 ? (
        <div className="text-center py-20 bg-slate-100 dark:bg-slate-900/50 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800">
          <p className="text-slate-500 font-bold italic text-xl">{t('home.search.no_results')}</p>
          <button onClick={handleClear} className="mt-4 text-primary font-bold hover:underline cursor-pointer">{t('home.search.clear')}</button>
        </div>
      ) : (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3 sm:gap-6">
          {searchResults.map((sound: any) => (
            <SoundCard key={sound._id} sound={sound} />
          ))}
        </div>
      )}

      <div className="mt-16 border-t border-slate-200 dark:border-slate-800" />
    </section>
  );
}

