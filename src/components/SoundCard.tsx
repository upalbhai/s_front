'use client';

import { useState, useEffect } from 'react';
import { Heart, Copy, Send } from 'lucide-react';
import Link from 'next/link';
import api from '../services/api';
import { toast } from 'react-hot-toast';
import useAudio from '../hooks/useAudio';

interface SoundProps {
  sound: {
    _id: string;
    title: string;
    slug: string;
    fileUrl: string;
    iconUrl?: string;
    playCount: number;
    category?: { _id: string; name: string; slug: string };
  };
  isFavorite?: boolean;
}

const BUTTON_COLORS = [
  { main: '#ff3b30', dark: '#a31a12', shadow: 'rgba(255, 59, 48, 0.3)' }, // Red
  { main: '#ffcc00', dark: '#b28f00', shadow: 'rgba(255, 204, 0, 0.3)' }, // Yellow
  { main: '#af52de', dark: '#7a399b', shadow: 'rgba(175, 82, 222, 0.3)' }, // Purple
  { main: '#555555', dark: '#222222', shadow: 'rgba(85, 85, 85, 0.3)' }, // Black
  { main: '#007aff', dark: '#0055b3', shadow: 'rgba(0, 122, 255, 0.3)' }, // Blue
  { main: '#34c759', dark: '#248a3d', shadow: 'rgba(52, 199, 89, 0.3)' }, // Green
];

const SoundCard: React.FC<SoundProps> = ({ sound }) => {
  const { currentSound, isPlaying, playSound } = useAudio();
  const isThisPlaying = currentSound?._id === sound._id && isPlaying;
  const [isFavorited, setIsFavorited] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const favs = JSON.parse(localStorage.getItem('favorites') || '[]');
    setIsFavorited(favs.includes(sound._id));

    const syncFav = () => {
      const updatedFavs = JSON.parse(localStorage.getItem('favorites') || '[]');
      setIsFavorited(updatedFavs.includes(sound._id));
    };

    window.addEventListener('favoritesChanged', syncFav);
    return () => {
      window.removeEventListener('favoritesChanged', syncFav);
    };
  }, [sound._id]);

  // Pick a color based on the sound ID
  const colorIndex = parseInt(sound._id.substring(sound._id.length - 2), 16) % BUTTON_COLORS.length;
  const color = BUTTON_COLORS[colorIndex];

  const handlePlay = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    playSound(sound);
  };

  const handleFavoriteToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const favs = JSON.parse(localStorage.getItem('favorites') || '[]');
    let updated;
    if (favs.includes(sound._id)) {
      updated = favs.filter((id: string) => id !== sound._id);
    } else {
      updated = [...favs, sound._id];
    }
    localStorage.setItem('favorites', JSON.stringify(updated));
    window.dispatchEvent(new Event('favoritesChanged'));
  };

  const categorySlug = sound.category?.slug || 'uncategorized';
  const soundLink = `/${categorySlug}/${sound.slug}`;

  return (
    <div className="flex flex-col items-center gap-4 p-4 rounded-3xl transition-all duration-300 hover:bg-slate-100 dark:hover:bg-slate-800/50 group">
      <div 
        className="relative w-[110px] h-[100px] flex items-center justify-center cursor-pointer select-none transition-transform" 
        onClick={handlePlay}
      >
        {/* Layer 1: Grey base platter bottom rim (darkest grey, for depth) */}
        <div 
          className="absolute rounded-[50%] z-[1]"
          style={{
            width: '100px',
            height: '50px',
            bottom: '0px',
            left: '5px',
            background: 'linear-gradient(to bottom, #b0b0b0, #909090)',
          }}
        />

        {/* Layer 2: Grey base platter top surface */}
        <div 
          className="absolute rounded-[50%] z-[2]"
          style={{
            width: '100px',
            height: '50px',
            bottom: '6px',
            left: '5px',
            background: 'linear-gradient(to bottom, #e8e8e8, #c8c8c8)',
          }}
        />

        {/* Layer 3: Colored button cylinder wall (darker shade) */}
        <div 
          className="absolute rounded-[50%] z-[3] transition-all duration-100 ease-out"
          style={{
            width: '84px',
            height: '42px',
            bottom: isThisPlaying ? '8px' : '12px',
            left: '13px',
            backgroundColor: color.dark,
          }}
        />

        {/* Layer 4: Colored button top cap (main color) */}
        <div 
          className="absolute rounded-[50%] z-[4] transition-all duration-100 ease-out"
          style={{
            width: '84px',
            height: '42px',
            bottom: isThisPlaying ? '22px' : '34px',
            left: '13px',
            background: `linear-gradient(to bottom, ${color.main}, ${color.main}dd)`,
          }}
        />
      </div>

      <div className="text-center w-full min-w-0">
        <Link href={soundLink}>
          <h3 className="text-[13px] font-bold text-foreground truncate hover:text-primary transition-colors cursor-pointer underline underline-offset-4 decoration-current group-hover:decoration-primary px-1">
            {sound.title}
          </h3>
        </Link>
      </div>

      <div className="flex items-center gap-6 pt-1">
        <button 
          onClick={handleFavoriteToggle}
          className={`${isFavorited ? 'text-red-500' : 'text-slate-500 dark:text-slate-400 hover:text-red-500'} hover:scale-110 transition-transform active:scale-95`} 
          title="Favorite"
        >
          <Heart size={16} fill={isFavorited ? 'currentColor' : 'none'} strokeWidth={2} />
        </button>
        <button 
          className="text-slate-500 dark:text-slate-400 hover:text-foreground hover:scale-110 transition-transform active:scale-95" 
          title="Copy Link" 
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            navigator.clipboard.writeText(`${window.location.origin}${soundLink}`);
            toast.success('Link copied!');
          }}
        >
          <Copy size={16} strokeWidth={2} />
        </button>
        <button 
          className="text-slate-500 dark:text-slate-400 hover:text-foreground hover:scale-110 transition-transform active:scale-95" 
          title="Share" 
          onClick={async (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (navigator.share) {
              try {
                await navigator.share({
                  title: sound.title,
                  url: `${window.location.origin}${soundLink}`
                });
              } catch (err) {}
            } else {
              navigator.clipboard.writeText(`${window.location.origin}${soundLink}`);
              toast.success('Link copied!');
            }
          }}
        >
          <Send size={16} strokeWidth={2} />
        </button>
      </div>
    </div>
  );
};

export default SoundCard;

