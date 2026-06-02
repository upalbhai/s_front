'use client';

import { TrendingUp, Sparkles, Heart, Eye, ChevronRight } from 'lucide-react';
import SoundCard from '@/components/SoundCard';
import { useTranslation } from '@/i18n';

interface TrendingSoundsSectionProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  sounds: any[];
  loading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
}

export default function TrendingSoundsSection({
  activeTab,
  onTabChange,
  sounds = [],
  loading,
  hasMore,
  onLoadMore,
}: TrendingSoundsSectionProps) {
  const { t } = useTranslation();

  const TABS = [
    { id: 'trending', label: t('home.tabs.trending') || 'Trending', icon: TrendingUp },
    { id: 'popular', label: t('home.tabs.popular') || 'Popular', icon: Heart },
    // { id: 'views', label: t('home.tabs.views') || 'Views', icon: Eye },
    { id: 'latest', label: t('home.tabs.latest') || 'Latest', icon: Sparkles },
  ];

  const activeTabInfo = TABS.find((t) => t.id === activeTab) || TABS[0];
  const ActiveIcon = activeTabInfo.icon;

  return (
    <section className="max-w-7xl mx-auto px-4 py-8">
      {/* Header and Tabs container */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800/50 flex items-center justify-center text-foreground transition-all duration-300">
            <ActiveIcon size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-1">
              {t('home.trending.viral_hits') || 'Viral Hits'}
            </p>
            <h2 className="text-2xl md:text-3xl font-black tracking-tight text-foreground transition-all duration-300">
              {activeTabInfo.label} {t('home.tabs.title') || 'Sounds'}
            </h2>
          </div>
        </div>

        {/* Tab switch group */}
        <div className="flex items-center bg-slate-100 dark:bg-slate-900/80 p-1 rounded-full border border-slate-200/60 dark:border-slate-800/60 self-start md:self-auto shadow-xs">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`px-5 py-2.5 rounded-full font-extrabold text-xs uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-slate-950 text-white dark:bg-white dark:text-slate-950 shadow-md border-2 border-yellow-400 dark:border-yellow-450 scale-[1.03] ring-2 ring-yellow-400/20'
                  : 'text-slate-500 hover:text-foreground dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/40'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Sounds Grid */}
      {sounds.length > 0 ? (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3 sm:gap-6">
          {sounds.map((sound: any) => (
            <SoundCard key={sound._id} sound={sound} />
          ))}
        </div>
      ) : (
        !loading && (
          <div className="text-center py-16 bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-850 rounded-3xl max-w-sm mx-auto">
            <p className="text-sm text-slate-500 font-bold">No sounds found</p>
          </div>
        )
      )}

      {/* Load More Pagination Button */}
      {hasMore && (
        <div className="flex flex-col items-center justify-center mt-12 gap-4">
          <button
            onClick={onLoadMore}
            disabled={loading}
            className="px-8 py-3 bg-white dark:bg-slate-900 text-foreground border border-slate-200 dark:border-slate-800 rounded-2xl font-black text-sm hover:bg-slate-50 dark:hover:bg-slate-850 active:scale-95 transition-all shadow-sm flex items-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 rounded-full border-2 border-slate-350 dark:border-slate-650 border-t-primary dark:border-t-primary animate-spin" />
                {t('common.loading') || 'Loading...'}
              </>
            ) : (
              <>
                {t('common.load_more') || 'Load More Sounds'}
                <ChevronRight size={16} />
              </>
            )}
          </button>
        </div>
      )}
    </section>
  );
}
