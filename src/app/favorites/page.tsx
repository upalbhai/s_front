'use client';

import { useEffect, useState } from 'react';
import api from '@/services/api';
import SoundCard from '@/components/SoundCard';
import { Heart } from 'lucide-react';

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadFavorites = async () => {
    try {
      const favIds = JSON.parse(localStorage.getItem('favorites') || '[]');
      if (favIds.length === 0) {
        setFavorites([]);
        setLoading(false);
        return;
      }
      
      // Fetch details of all locally favorited sound IDs in a single batched query
      const res = await api.get(`/sounds?ids=${favIds.join(',')}&limit=100`);
      const sounds = Array.isArray(res.data.sounds) ? res.data.sounds : [];
      setFavorites(sounds);
    } catch (error) {
      console.error('Error fetching favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFavorites();

    // Listen to favorites toggled in other cards to dynamically re-sync the list!
    window.addEventListener('favoritesChanged', loadFavorites);
    return () => {
      window.removeEventListener('favoritesChanged', loadFavorites);
    };
  }, []);

  return (
    <div className="bg-background text-foreground animate-in fade-in duration-500 min-h-screen py-16 md:py-24">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/10 text-red-500 text-xs font-black uppercase tracking-wider mb-4 animate-pulse">
            <Heart size={12} className="fill-red-500" />
            <span>My Collection</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-foreground tracking-tight mb-4 leading-tight">
            Your Favorite <span className="bg-gradient-to-r from-red-500 to-rose-500 bg-clip-text text-transparent">Sounds</span>
          </h1>
          <p className="text-base text-slate-500 dark:text-slate-400 font-bold max-w-xl mx-auto">
            These are your custom saved meme sounds and audio triggers, stored locally in your web browser.
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="w-8 h-8 rounded-full border-4 border-slate-200 dark:border-slate-800 border-t-red-500 dark:border-t-red-500 animate-spin" />
            <span className="text-xs font-black text-red-500/80 uppercase tracking-widest animate-pulse">Retrieving collection...</span>
          </div>
        ) : favorites.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 max-w-lg mx-auto shadow-sm">
            <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center mx-auto mb-4 text-red-500">
              <Heart size={28} className="fill-red-500/30" />
            </div>
            <h3 className="text-lg font-black text-foreground">No favorites saved yet</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-sm mx-auto font-medium">
              Start exploring the soundboard library, press the heart icon on any button, and they will display here instantly!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {favorites.map((sound: any) => (
              <SoundCard key={sound._id} sound={sound} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
