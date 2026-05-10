'use client';

import { useState, useRef } from 'react';
import { Search, Sparkles, Play, Pause } from 'lucide-react';
import api from '@/services/api';

interface HeroSectionProps {
  searchQuery?: string;
  trendingSounds?: any[];
}

const getFullUrl = (url: string) => {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001';
  return `${baseUrl}${url}`;
};

export default function HeroSection({ searchQuery = '', trendingSounds = [] }: HeroSectionProps) {
  const [localSearch, setLocalSearch] = useState(searchQuery);
  const [activePlayingId, setActivePlayingId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (localSearch.trim()) {
      window.location.href = `/?q=${encodeURIComponent(localSearch)}`;
    }
  };

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
          // Increment play count if it is a database object
          if (soundId.match(/^[0-9a-fA-F]{24}$/)) {
            api.patch(`/sounds/${soundId}/stats`, { type: 'play' }).catch(() => {});
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
    <section className="relative overflow-hidden pt-20 pb-20 md:pt-32 md:pb-28">
      {/* Subtle dynamic background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-gradient-to-b from-primary/10 via-transparent to-transparent blur-3xl -z-10 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Context & Call to action */}
          <div className="lg:col-span-7 text-left space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/25 text-xs font-black uppercase tracking-widest">
              <Sparkles size={14} />
              <span>Unblocked Soundboard</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[1.05] text-foreground">
              Unlimited Free Meme <br />
              <span className="bg-gradient-to-r from-foreground to-slate-400 dark:to-slate-500 bg-clip-text text-transparent">
                Sound Buttons
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 font-medium max-w-2xl leading-relaxed">
              World's largest library of viral soundboards, meme sound effects, and reaction buttons. Unblocked for school and free forever. Play instantly!
            </p>

            {/* Advanced Search bar */}
            <form onSubmit={handleSearch} className="p-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl flex flex-col sm:flex-row items-center gap-2 focus-within:ring-4 focus-within:ring-primary/10 transition-all max-w-2xl">
              <div className="flex-1 flex items-center gap-3 px-4 w-full">
                <Search size={22} className="text-slate-500 dark:text-slate-400 shrink-0" />
                <input 
                  type="text" 
                  placeholder="Search 100,000+ meme sounds..." 
                  value={localSearch}
                  onChange={(e) => setLocalSearch(e.target.value)}
                  className="w-full bg-transparent border-none outline-none py-3 font-bold text-foreground placeholder-slate-400 text-sm md:text-base"
                />
              </div>
              <button 
                type="submit" 
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-primary text-background font-black hover:bg-primary-hover transition-all active:scale-95 shadow-lg shadow-primary/25 text-sm uppercase tracking-wider"
              >
                Search
              </button>
            </form>
          </div>

          {/* Right Column: Interactive SaaS Console preview */}
          <div className="lg:col-span-5 relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-violet-500/10 rounded-[2.5rem] blur-2xl -z-10" />
            
            <div className="p-8 rounded-[2rem] border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl shadow-2xl relative overflow-hidden space-y-6">
              
              {/* Visual Audio Wave */}
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-black uppercase tracking-wider text-slate-600 dark:text-slate-400">Live Sound Console</span>
                </div>
                <div className="flex items-end gap-1 h-4">
                  <div className={`w-1 bg-primary rounded-full transition-all duration-300 ${activePlayingId ? 'animate-bounce' : 'h-2'}`} style={{ height: activePlayingId ? undefined : '8px' }} />
                  <div className={`w-1 bg-violet-500 rounded-full transition-all duration-300 ${activePlayingId ? 'animate-bounce' : 'h-4'}`} style={{ height: activePlayingId ? undefined : '16px' }} />
                  <div className={`w-1 bg-primary rounded-full transition-all duration-300 ${activePlayingId ? 'animate-bounce' : 'h-1.5'}`} style={{ height: activePlayingId ? undefined : '6px' }} />
                  <div className={`w-1 bg-violet-500 rounded-full transition-all duration-300 ${activePlayingId ? 'animate-bounce' : 'h-3'}`} style={{ height: activePlayingId ? undefined : '12px' }} />
                </div>
              </div>

              {/* Simulated Sounds Board */}
              <div className="space-y-4">
                {displaySounds.map((item: any, idx: number) => {
                  const isCurrentPlaying = activePlayingId === item._id;
                  const hasValidFile = !!item.fileUrl;
                  return (
                    <div 
                      key={item._id} 
                      onClick={() => hasValidFile && handlePlayClick(item._id, item.fileUrl)}
                      className={`flex items-center justify-between p-4 rounded-2xl bg-white/40 dark:bg-slate-950/40 border transition-all cursor-pointer select-none ${
                        isCurrentPlaying 
                          ? 'border-primary shadow-md scale-[1.02] bg-white/80 dark:bg-slate-950/80' 
                          : 'border-slate-200 dark:border-slate-800/80 hover:border-primary/20 hover:bg-white/50 dark:hover:bg-slate-950/50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl w-8 h-8 flex items-center justify-center shrink-0">
                          {item.icon ? (
                            <img src={item.icon} alt={item.name} className="w-8 h-8 object-contain rounded-lg" onError={(e) => { (e.target as HTMLImageElement).src = '💥' }} />
                          ) : (
                            item.fallbackEmoji || '💥'
                          )}
                        </span>
                        <div>
                          <h4 className="text-sm font-black text-foreground line-clamp-1">{item.name}</h4>
                          <span className="text-xs text-slate-500 dark:text-slate-400 font-bold">{item.plays}</span>
                        </div>
                      </div>
                      <button 
                        className={`px-4 py-2 rounded-xl bg-gradient-to-r ${item.color} text-white text-[10px] font-black shadow-lg shadow-black/10 active:scale-90 transition-transform uppercase tracking-wider shrink-0 flex items-center gap-1.5`}
                      >
                        {isCurrentPlaying ? (
                          <>
                            <Pause size={10} fill="currentColor" />
                            <span>Stop</span>
                          </>
                        ) : (
                          <>
                            <Play size={10} fill="currentColor" />
                            <span>Play</span>
                          </>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Stats badge */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-primary/5 to-violet-500/5 border border-primary/10 text-center">
                <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Instant streaming optimized at </span>
                <span className="text-xs font-black text-primary">12ms response latency</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Hidden Global Audio Element */}
      <audio 
        ref={audioRef} 
        onEnded={() => setActivePlayingId(null)} 
        preload="none" 
      />
    </section>
  );
}
