'use client';

import React from 'react';
import { useState, useRef, useEffect } from 'react';
import { Search, Sparkles, Loader2 } from 'lucide-react';
import api from '@/services/api';
import { useTranslation } from '@/i18n';

interface HeroSectionProps {
  searchQuery?: string;
  trendingSounds?: any[];
  onSearchChange: (value: string) => void;
  isLoading?: boolean;
  title?: string;
  subtitle?: string;
  badge?: string;
  placeholder?: string;
}

const getFullUrl = (url: string) => {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001';
  return `${baseUrl}${url}`;
};

export default function HeroSection({
  searchQuery = '',
  trendingSounds = [],
  onSearchChange,
  isLoading = false,
  title,
  subtitle,
  badge,
  placeholder,
}: HeroSectionProps) {
  const { t } = useTranslation();
  const resolvedTitle = title ?? t('hero.title');
  const resolvedBadge = badge ?? t('hero.badge');
  const resolvedPlaceholder = placeholder ?? t('hero.placeholder');
  const [localSearch, setLocalSearch] = useState(searchQuery);
  const [activePlayingId, setActivePlayingId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    setLocalSearch(searchQuery);
  }, [searchQuery]);

  const handlePlayClick = (soundId: string, fileUrl: string) => {
    if (!audioRef.current) return;

    if (activePlayingId === soundId) {
      audioRef.current.pause();
      setActivePlayingId(null);
    } else {
      audioRef.current.src = getFullUrl(fileUrl);
      audioRef.current.play()
        .then(() => {
          setActivePlayingId(soundId);
          if (soundId.match(/^[0-9a-fA-F]{24}$/)) {
            api.patch(`/sounds/${soundId}/stats`, { type: 'play' }).catch(() => { });
          }
        })
        .catch(err => {
          console.error('Playback failed:', err);
          setActivePlayingId(null);
        });
    }
  };

  const defaultItems = [
    { _id: '1', name: 'Vine Boom Effect', plays: '12M+ Plays', icon: '💥', color: 'from-red-500 to-rose-600', fileUrl: '' },
    { _id: '2', name: 'Bruh Sound', plays: '8M+ Plays', icon: '🗣️', color: 'from-amber-500 to-orange-600', fileUrl: '' },
    { _id: '3', name: 'Goofy Ahh Car', plays: '5M+ Plays', icon: '🚗', color: 'from-indigo-500 to-blue-600', fileUrl: '' },
  ];

  const displaySounds = trendingSounds && trendingSounds.length > 0
    ? trendingSounds.slice(0, 3).map((sound: any, idx: number) => ({
      _id: sound._id,
      name: sound.title,
      plays: `${(sound.playCount || 0).toLocaleString()} Plays`,
      icon: sound.iconUrl ? getFullUrl(sound.iconUrl) : null,
      color: idx === 0 ? 'from-red-500 to-rose-600' : idx === 1 ? 'from-amber-500 to-orange-600' : 'from-indigo-500 to-blue-600',
      fileUrl: sound.fileUrl,
      fallbackEmoji: idx === 0 ? '💥' : idx === 1 ? '🗣️' : '🚗'
    }))
    : defaultItems;

  return (
    <section className="relative overflow-hidden p-10">
      {/* Subtle dynamic background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-gradient-to-b from-primary/10 via-transparent to-transparent blur-3xl -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 relative">
        <div className="flex flex-col items-center text-center space-y-8">

          {/* Context & Call to action */}
          <div className="space-y-6 flex flex-col items-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/25 text-xs font-black uppercase tracking-widest">
              <Sparkles size={14} />
              <span>{resolvedBadge}</span>
            </div>

            <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-[1.05] text-foreground max-w-4xl mx-auto">
              {resolvedTitle}
            </h1>

            {subtitle && (
              <p className="text-base text-slate-500 dark:text-slate-400 font-bold max-w-2xl mx-auto">
                {subtitle}
              </p>
            )}
          </div>

          {/* Advanced Search bar */}
          <form onSubmit={(e) => e.preventDefault()} className="p-1.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl flex items-center gap-3 focus-within:ring-4 focus-within:ring-primary/10 transition-all max-w-2xl w-full mx-auto">
            <div className="flex-1 flex items-center gap-3 px-4 w-full">
              {isLoading ? (
                <Loader2 size={22} className="text-primary animate-spin shrink-0" />
              ) : (
                <Search size={22} className="text-slate-500 dark:text-slate-400 shrink-0" />
              )}
              <input
                type="text"
                placeholder={resolvedPlaceholder}
                value={localSearch}
                onChange={(e) => {
                  const val = e.target.value;
                  setLocalSearch(val);
                  onSearchChange(val);
                }}
                className="w-full bg-transparent border-none outline-none py-3.5 font-bold text-foreground placeholder-slate-400 text-sm md:text-base"
              />
            </div>
          </form>

        </div>
      </div>
      <audio ref={audioRef} className="hidden" />
    </section>
  );
}
