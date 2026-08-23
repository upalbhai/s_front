'use client';

import { useState, useEffect } from 'react';
import { Heart, Download, Send } from 'lucide-react';
import Link from 'next/link';
import api from '../services/api';
import { toast } from 'react-hot-toast';
import useAudio from '../hooks/useAudio';
import { useTranslation, useLocalePath } from '@/i18n';
import { usePathname } from 'next/navigation';
import { useSite } from '@/context/SiteProvider';
import ButtonRenderer from './buttons/ButtonRenderer';

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

export const SITE_BUTTON_COLORS: Record<string, Array<{main: string, dark: string, shadow: string}>> = {
  soundboard: [
    { main: '#3b82f6', dark: '#1d4ed8', shadow: 'rgba(59, 130, 246, 0.3)' }, // Blue
    { main: '#10b981', dark: '#047857', shadow: 'rgba(16, 185, 129, 0.3)' }, // Emerald
    { main: '#f43f5e', dark: '#be123c', shadow: 'rgba(244, 63, 94, 0.3)' }, // Rose
    { main: '#8b5cf6', dark: '#5b21b6', shadow: 'rgba(139, 92, 246, 0.3)' }, // Violet
    { main: '#f59e0b', dark: '#b45309', shadow: 'rgba(245, 158, 11, 0.3)' }, // Amber
    { main: '#06b6d4', dark: '#0e7490', shadow: 'rgba(6, 182, 212, 0.3)' }, // Cyan
  ],
  soundbuttons: [
    { main: '#14b8a6', dark: '#0f766e', shadow: 'rgba(20, 184, 166, 0.3)' }, // Teal
    { main: '#84cc16', dark: '#4d7c0f', shadow: 'rgba(132, 204, 22, 0.3)' }, // Lime
    { main: '#eab308', dark: '#a16207', shadow: 'rgba(234, 179, 8, 0.3)' }, // Yellow
    { main: '#ef4444', dark: '#b91c1c', shadow: 'rgba(239, 68, 68, 0.3)' }, // Red
    { main: '#6366f1', dark: '#3730a3', shadow: 'rgba(99, 102, 241, 0.3)' }, // Indigo
    { main: '#d946ef', dark: '#86198f', shadow: 'rgba(217, 70, 239, 0.3)' }, // Fuchsia
  ],
  soundbuttonsguys: [
    { main: '#f97316', dark: '#c2410c', shadow: 'rgba(249, 115, 22, 0.3)' }, // Orange
    { main: '#ec4899', dark: '#be185d', shadow: 'rgba(236, 72, 153, 0.3)' }, // Pink
    { main: '#a855f7', dark: '#7e22ce', shadow: 'rgba(168, 85, 247, 0.3)' }, // Purple
    { main: '#0ea5e9', dark: '#0369a1', shadow: 'rgba(14, 165, 233, 0.3)' }, // Sky
    { main: '#22c55e', dark: '#15803d', shadow: 'rgba(34, 197, 94, 0.3)' }, // Green
    { main: '#facc15', dark: '#ca8a04', shadow: 'rgba(250, 204, 21, 0.3)' }, // Yellow (Bright)
  ]
};

const getFullUrl = (url: string) => {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001';
  return `${baseUrl}${url}`;
};

const SoundCard: React.FC<SoundProps> = ({ sound }) => {
  const { currentSound, isPlaying, isLoading, playSound } = useAudio();
  const isThisPlaying = currentSound?._id === sound._id && isPlaying;
  const isThisLoading = currentSound?._id === sound._id && isLoading;
  const [isFavorited, setIsFavorited] = useState(false);
  const { t } = useTranslation();
  const lp = useLocalePath();
  const pathname = usePathname();
  const { siteId } = useSite();

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

  const buttonColors = SITE_BUTTON_COLORS[siteId] || SITE_BUTTON_COLORS.soundbuttons;
  const colorIndex =
    parseInt(sound._id.substring(sound._id.length - 2), 16) % buttonColors.length;
  const color = buttonColors[colorIndex];

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

  const handleDownload = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const response = await fetch(getFullUrl(sound.fileUrl));
      if (!response.ok) throw new Error('Network response was not ok');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `${sound.slug}.mp3`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      const a = document.createElement('a');
      a.href = getFullUrl(sound.fileUrl);
      a.download = `${sound.slug}.mp3`;
      a.target = '_blank';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
    // Track stats
    if (!pathname?.includes('/admin')) {
      api.patch(`/sounds/${sound._id}/stats`, { type: 'download' }).catch(() => { });
    }
  };

  const soundLink = lp(`/sound/${sound.slug}`);

  return (
    <div className="flex flex-col items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-2xl sm:rounded-3xl transition-all duration-300 hover:bg-slate-100 dark:hover:bg-slate-800/50 group w-full min-w-0">

      {/* ── 3D Button ── */}
      <ButtonRenderer
        siteId={siteId}
        color={color}
        isPlaying={isThisPlaying}
        isLoading={isThisLoading}
        onClick={handlePlay}
        size="small"
      />

      {/* ── Title ── */}
      <div className="text-center w-full min-w-0 px-1">
        <Link href={soundLink} className="block w-full">
          <h3 className="text-[11px] sm:text-[12px] md:text-[13px] font-bold text-foreground truncate hover:text-primary transition-colors cursor-pointer underline underline-offset-4 decoration-current group-hover:decoration-primary">
            {sound.title}
          </h3>
        </Link>
      </div>

      {/* ── Action Icons ── */}
      <div className="flex justify-center items-center gap-3 sm:gap-4 md:gap-5 pt-1 w-full flex-wrap">
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
          title="Download"
          onClick={handleDownload}
        >
          <Download size={16} strokeWidth={2} />
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