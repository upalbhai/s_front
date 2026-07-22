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
  { main: '#ff9500', dark: '#b36800', shadow: 'rgba(255, 149, 0, 0.3)' }, // Orange
  { main: '#007aff', dark: '#0055b3', shadow: 'rgba(0, 122, 255, 0.3)' },
  { main: '#34c759', dark: '#248a3d', shadow: 'rgba(52, 199, 89, 0.3)' },
];

const getFullUrl = (url: string) => {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001';
  return `${baseUrl}${url}`;
};

const SoundCard: React.FC<SoundProps> = ({ sound }) => {
  const { currentSound, isPlaying, playSound } = useAudio();
  const isThisPlaying = currentSound?._id === sound._id && isPlaying;
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
      api.patch(`/sounds/${sound._id}/stats`, { type: 'download', siteId }).catch(() => { });
    }
  };

  const soundLink = lp(`/sound/${sound.slug}`);

  return (
    <div className="flex flex-col items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-2xl sm:rounded-3xl transition-all duration-300 hover:bg-slate-100 dark:hover:bg-slate-800/50 group">

      {/* ── 3D Button ── */}
      <div
        className="relative cursor-pointer select-none active:scale-[0.97] transition-transform duration-75"
        style={{ width: 92, height: 102 }}
        onClick={handlePlay}
      >
        {/* Platter bottom rim (darkest, for depth) */}
        <div
          className="absolute rounded-[50%]"
          style={{
            width: 84,
            height: 63,
            bottom: 0,
            left: 4,
            background: '#7a7a7a',
            zIndex: 1,
          }}
        />

        {/* Platter top surface (lighter grey) */}
        <div
          className="absolute rounded-[50%]"
          style={{
            width: 84,
            height: 63,
            bottom: 8,
            left: 4,
            background: '#d0d0d0',
            zIndex: 2,
          }}
        />

        {/* Button cylinder bottom curve (darker shade of button color) */}
        <div
          className="absolute rounded-[50%] transition-all duration-100 ease-out"
          style={{
            width: 70,
            height: 52,
            bottom: isThisPlaying ? 10 : 14,
            left: 11,
            backgroundColor: color.dark,
            zIndex: 3,
          }}
        />

        {/* Button cylinder vertical wall connecting bottom and top cap */}
        <div
          className="absolute transition-all duration-100 ease-out"
          style={{
            width: 70,
            height: isThisPlaying ? 10 : 14,
            bottom: isThisPlaying ? 36 : 40,
            left: 11,
            backgroundColor: color.dark,
            zIndex: 3,
          }}
        />

        {/* Button top cap (main color) — moves down when playing */}
        <div
          className="absolute rounded-[50%] transition-all duration-100 ease-out"
          style={{
            width: 70,
            height: 52,
            bottom: isThisPlaying ? 20 : 28,
            left: 11,
            backgroundColor: color.main,
            boxShadow: isThisPlaying
              ? 'inset 0 -2px 4px rgba(0,0,0,0.15)'
              : 'inset 0 -4px 6px rgba(0,0,0,0.1), 0 2px 4px rgba(0,0,0,0.08)',
            zIndex: 4,
          }}
        />
      </div>

      {/* ── Title ── */}
      <div className="text-center w-full min-w-0">
        <Link href={soundLink}>
          <h3 className="text-[11px] sm:text-[12px] md:text-[13px] font-bold text-foreground truncate hover:text-primary transition-colors cursor-pointer underline underline-offset-4 decoration-current group-hover:decoration-primary px-1">
            {sound.title}
          </h3>
        </Link>
      </div>

      {/* ── Action Icons ── */}
      <div className="flex items-center gap-3 sm:gap-4 md:gap-5 pt-1">
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