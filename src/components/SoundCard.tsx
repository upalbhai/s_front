'use client';

import { useState, useEffect } from 'react';
import { Heart, Copy, Send } from 'lucide-react';
import Link from 'next/link';
import api from '../services/api';
import { toast } from 'react-hot-toast';
import useAudio from '../hooks/useAudio';
import { useTranslation, useLocalePath } from '@/i18n';

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
  { main: '#ff3b30', dark: '#a31a12', shadow: 'rgba(255, 59, 48, 0.3)' },
  { main: '#ffcc00', dark: '#b28f00', shadow: 'rgba(255, 204, 0, 0.3)' },
  { main: '#af52de', dark: '#7a399b', shadow: 'rgba(175, 82, 222, 0.3)' },
  { main: '#555555', dark: '#222222', shadow: 'rgba(85, 85, 85, 0.3)' },
  { main: '#007aff', dark: '#0055b3', shadow: 'rgba(0, 122, 255, 0.3)' },
  { main: '#34c759', dark: '#248a3d', shadow: 'rgba(52, 199, 89, 0.3)' },
];

const SoundCard: React.FC<SoundProps> = ({ sound }) => {
  const { currentSound, isPlaying, playSound } = useAudio();
  const isThisPlaying = currentSound?._id === sound._id && isPlaying;
  const [isFavorited, setIsFavorited] = useState(false);
  const { t } = useTranslation();
  const lp = useLocalePath();

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const favs = JSON.parse(localStorage.getItem('favorites') || '[]');
    setIsFavorited(favs.includes(sound._id));

    const syncFav = () => {
      const updatedFavs = JSON.parse(localStorage.getItem('favorites') || '[]');
      setIsFavorited(updatedFavs.includes(sound._id));
    };

    window.addEventListener('favoritesChanged', syncFav);
    return () => window.removeEventListener('favoritesChanged', syncFav);
  }, [sound._id]);

  const colorIndex =
    parseInt(sound._id.substring(sound._id.length - 2), 16) % BUTTON_COLORS.length;
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
    const updated = favs.includes(sound._id)
      ? favs.filter((id: string) => id !== sound._id)
      : [...favs, sound._id];
    localStorage.setItem('favorites', JSON.stringify(updated));
    window.dispatchEvent(new Event('favoritesChanged'));
  };

  const soundLink = lp(`/sounds/${sound.slug}`);

  return (
    <div className="flex flex-col items-center gap-4 p-4 rounded-3xl transition-all duration-300 hover:bg-slate-100 dark:hover:bg-slate-800/50 group">

      {/* ── 3D Button ── */}
      <div
        className="relative cursor-pointer select-none"
        style={{ width: 130, height: 145 }}
        onClick={handlePlay}
      >
        {/* Platter bottom rim (darkest, for depth) */}
        <div
          className="absolute rounded-[50%]"
          style={{
            width: 120,
            height: 90,
            bottom: 0,
            left: 5,
            background: '#7a7a7a',
            zIndex: 1,
          }}
        />

        {/* Platter top surface (lighter grey) */}
        <div
          className="absolute rounded-[50%]"
          style={{
            width: 120,
            height: 90,
            bottom: 12,
            left: 5,
            background: '#d0d0d0',
            zIndex: 2,
          }}
        />

        {/* Button cylinder bottom curve (darker shade of button color) */}
        <div
          className="absolute rounded-[50%] transition-all duration-75 ease-out"
          style={{
            width: 100,
            height: 75,
            bottom: isThisPlaying ? 12 : 20,
            left: 15,
            backgroundColor: color.dark,
            zIndex: 3,
          }}
        />

        {/* Button cylinder vertical wall connecting bottom and top cap */}
        <div
          className="absolute transition-all duration-75 ease-out"
          style={{
            width: 100,
            height: isThisPlaying ? 12 : 20,
            bottom: isThisPlaying ? 49.5 : 57.5,
            left: 15,
            backgroundColor: color.dark,
            zIndex: 3,
          }}
        />

        {/* Button top cap (main color) — moves down when playing */}
        <div
          className="absolute rounded-[50%] transition-all duration-75 ease-out"
          style={{
            width: 100,
            height: 75,
            bottom: isThisPlaying ? 24 : 40,
            left: 15,
            backgroundColor: color.main,
            zIndex: 4,
          }}
        />
      </div>

      {/* ── Title ── */}
      <div className="text-center w-full min-w-0">
        <Link href={soundLink}>
          <h3 className="text-[13px] font-bold text-foreground truncate hover:text-primary transition-colors cursor-pointer underline underline-offset-4 decoration-current group-hover:decoration-primary px-1">
            {sound.title}
          </h3>
        </Link>
      </div>

      {/* ── Action Icons ── */}
      <div className="flex items-center gap-6 pt-1">
        <button
          onClick={handleFavoriteToggle}
          className={`${isFavorited
            ? 'text-red-500'
            : 'text-slate-500 dark:text-slate-400 hover:text-red-500'
            } hover:scale-110 transition-transform active:scale-95`}
          title={t('sound.fav_tooltip')}
        >
          <Heart size={16} fill={isFavorited ? 'currentColor' : 'none'} strokeWidth={2} />
        </button>

        <button
          className="text-slate-500 dark:text-slate-400 hover:text-foreground hover:scale-110 transition-transform active:scale-95"
          title={t('sound.copy_tooltip')}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            navigator.clipboard.writeText(`${window.location.origin}${soundLink}`);
            toast.success(t('sound.link_copied'));
          }}
        >
          <Copy size={16} strokeWidth={2} />
        </button>

        <button
          className="text-slate-500 dark:text-slate-400 hover:text-foreground hover:scale-110 transition-transform active:scale-95"
          title={t('sound.share_tooltip')}
          onClick={async (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (navigator.share) {
              try {
                await navigator.share({ title: sound.title, url: `${window.location.origin}${soundLink}` });
              } catch (_) { }
            } else {
              navigator.clipboard.writeText(`${window.location.origin}${soundLink}`);
              toast.success(t('sound.link_copied'));
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