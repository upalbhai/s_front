'use client';

import { useState, useRef, useEffect } from 'react';
import { Download, Heart, Share2 } from 'lucide-react';
import Link from 'next/link';
import api from '../services/api';

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

const getFullUrl = (url: string) => {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001';
  return `${baseUrl}${url}`;
};

const SoundCard: React.FC<SoundProps> = ({ sound }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

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

  const handlePlay = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      try {
        await audioRef.current.play();
        setIsPlaying(true);
        api.patch(`/sounds/${sound._id}/stats`, { type: 'play' }).catch(() => {});
      } catch (err) {
        console.error('Playback failed:', err);
      }
    }
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
    <div className="flex flex-col items-center gap-4 p-4 rounded-3xl transition-all duration-300 hover:bg-slate-100 dark:hover:bg-slate-900 group">
      <div 
        className="relative w-28 h-28 flex items-center justify-center cursor-pointer perspective-1000 active:scale-95 transition-transform" 
        onClick={handlePlay}
      >
        <div className={`relative w-24 h-24 transition-transform duration-100 preserve-3d ${isPlaying ? 'translate-y-2' : ''}`}>
          {/* Button Top */}
          <div 
            className="absolute inset-0 h-20 rounded-full z-10 shadow-[inset_0_4px_10px_rgba(255,255,255,0.3),inset_0_-4px_10px_rgba(0,0,0,0.2)] transition-all overflow-hidden" 
            style={{ backgroundColor: color.main }}
          >
            <div className="absolute top-[10%] left-[15%] w-[40%] h-[20%] bg-white/40 rounded-full blur-[4px]" />
          </div>
          {/* Button Side/Bottom */}
          <div 
            className="absolute inset-0 h-20 rounded-full top-[8px] z-[5]" 
            style={{ backgroundColor: color.dark }}
          />
          {/* Button Base */}
          <div className="absolute top-[15px] -left-[4px] w-[104px] h-[84px] bg-slate-800 dark:bg-black rounded-full z-[1] shadow-xl shadow-black/20" />
        </div>
      </div>

      <div className="text-center w-full min-w-0">
        <Link href={soundLink}>
          <h3 className="text-sm font-bold text-foreground truncate hover:text-primary transition-colors cursor-pointer decoration-slate-300 dark:decoration-slate-700 underline underline-offset-4 decoration-dashed group-hover:decoration-primary">
            {sound.title}
          </h3>
        </Link>
      </div>

      <div className="flex items-center gap-5 pt-1">
        <button 
          onClick={handleFavoriteToggle}
          className={`${isFavorited ? 'text-red-500' : 'text-slate-400 dark:text-slate-500 hover:text-red-500'} hover:scale-125 transition-transform active:scale-90`} 
          title="Favorite"
        >
          <Heart size={18} fill={isFavorited ? 'currentColor' : 'none'} strokeWidth={3} />
        </button>
        <button 
          className="text-slate-400 dark:text-slate-500 hover:text-foreground hover:scale-125 transition-transform active:scale-90" 
          title="Share" 
          onClick={(e) => {
            e.preventDefault();
            navigator.clipboard.writeText(`${window.location.origin}${soundLink}`);
            alert('Link copied!');
          }}
        >
          <Share2 size={18} strokeWidth={3} />
        </button>
        <a 
          href={getFullUrl(sound.fileUrl)} 
          download={`${sound.slug}.mp3`} 
          className="text-slate-400 dark:text-slate-500 hover:text-foreground hover:scale-125 transition-transform active:scale-90" 
          title="Download" 
          onClick={(e) => {
            e.stopPropagation();
            api.patch(`/sounds/${sound._id}/stats`, { type: 'download' }).catch(() => {});
          }}
        >
          <Download size={18} strokeWidth={3} />
        </a>
      </div>

      <audio ref={audioRef} src={getFullUrl(sound.fileUrl)} onEnded={() => setIsPlaying(false)} preload="none" />
    </div>
  );
};

export default SoundCard;
