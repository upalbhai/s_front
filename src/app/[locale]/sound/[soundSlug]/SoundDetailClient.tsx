'use client';

import React from 'react';
import api from '@/services/api';
import SoundCard from '@/components/SoundCard';
import { Pause, Download, ChevronRight, Copy, Send } from 'lucide-react';
import Link from 'next/link';
import useAudio from '@/hooks/useAudio';
import { toast } from 'react-hot-toast';
import { useLocalePath } from '@/i18n';

const BUTTON_COLORS = [
  { main: '#ff3b30', dark: '#a31a12', shadow: 'rgba(255, 59, 48, 0.3)' }, // Red
  { main: '#ffcc00', dark: '#b28f00', shadow: 'rgba(255, 204, 0, 0.3)' }, // Yellow
  { main: '#af52de', dark: '#7a399b', shadow: 'rgba(175, 82, 222, 0.3)' }, // Purple
  { main: '#ff9500', dark: '#b36800', shadow: 'rgba(255, 149, 0, 0.3)' }, // Orange
  { main: '#007aff', dark: '#0055b3', shadow: 'rgba(0, 122, 255, 0.3)' }, // Blue
  { main: '#34c759', dark: '#248a3d', shadow: 'rgba(52, 199, 89, 0.3)' }, // Green
];

const getFullUrl = (url: string) => {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001';
  return `${baseUrl}${url}`;
};

export default function SoundDetailClient({ sound, relatedSounds, h1Title, uiDescription, siteName = 'SoundButtonsMax' }: any) {
  const { currentSound, isPlaying, isLoading, playSound } = useAudio();
  const lp = useLocalePath();
  const isThisPlaying = currentSound?._id === sound._id && isPlaying;
  const isThisLoading = currentSound?._id === sound._id && isLoading;


  const handlePlayClick = () => {
    playSound(sound);
  };

  const handleCopyLink = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const soundLink = lp(`/sound/${sound.slug}`);
    navigator.clipboard.writeText(`${window.location.origin}${soundLink}`);
    toast.success('Link copied!');
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const soundLink = lp(`/sound/${sound.slug}`);
    if (navigator.share) {
      try {
        await navigator.share({
          title: sound.title,
          url: `${window.location.origin}${soundLink}`
        });
      } catch (_) { }
    } else {
      navigator.clipboard.writeText(`${window.location.origin}${soundLink}`);
      toast.success('Link copied!');
    }
  };

  const handleDownloadAction = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
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
      // Fallback if fetch fails (e.g. CORS)
      const a = document.createElement('a');
      a.href = getFullUrl(sound.fileUrl);
      a.download = `${sound.slug}.mp3`;
      a.target = '_blank';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
    // Track download stats
    api.patch(`/sounds/${sound._id}/stats`, { type: 'download' }).catch(() => { });
  };

  // Pick a color based on the sound ID
  const soundIdStr = sound?._id || '00';
  const colorIndex = parseInt(soundIdStr.substring(Math.max(0, soundIdStr.length - 2)), 16) % BUTTON_COLORS.length || 0;
  const color = BUTTON_COLORS[colorIndex] || BUTTON_COLORS[0];

  return (
    <div className="container mx-auto px-4 py-16">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400 mb-8">
        <Link href={lp('/')} className="hover:text-foreground transition-colors font-bold">Home</Link>
        <ChevronRight size={14} />
        <Link href={lp(`/categories/${sound.category?.slug}`)} className="hover:text-foreground transition-colors font-bold">{sound.category?.name}</Link>
        <ChevronRight size={14} />
        <span className="text-primary font-black">{sound.title}</span>
      </nav>

      <div className="space-y-12">
        {/* Main Sound Layout (Two-column Grid) */}
        <div className="p-8 md:p-12 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm grid grid-cols-1 md:grid-cols-[auto_1fr] gap-10 md:gap-16 items-center">

          {/* Left: Giant 3D Play Button */}
          <div className="relative flex justify-center select-none w-full md:w-[325px] h-[300px]">
            {/* Pulse / Glow Effect behind the button base */}
            <div
              className="absolute rounded-full blur-3xl opacity-35 animate-pulse transition-all duration-300"
              style={{
                width: '300px',
                height: '180px',
                backgroundColor: color.main,
                filter: 'blur(50px)',
                top: '20px',
              }}
            />

            <div
              className="relative cursor-pointer select-none transition-transform hover:scale-[1.02] active:scale-[0.98]"
              style={{ width: 325, height: 300 }}
              onClick={handlePlayClick}
            >
              {/* Platter bottom rim (darkest, for depth) */}
              <div
                className="absolute rounded-[50%]"
                style={{
                  width: 300,
                  height: 225,
                  bottom: 0,
                  left: 12.5,
                  background: '#7a7a7a',
                  zIndex: 1,
                }}
              />

              {/* Platter top surface (lighter grey) */}
              <div
                className="absolute rounded-[50%]"
                style={{
                  width: 300,
                  height: 225,
                  bottom: 30,
                  left: 12.5,
                  background: '#d0d0d0',
                  zIndex: 2,
                }}
              />

              {/* Button cylinder bottom curve (darker shade of button color) */}
              <div
                className="absolute rounded-[50%] transition-all duration-75 ease-out"
                style={{
                  width: 250,
                  height: 188,
                  bottom: isThisPlaying ? 30 : 50,
                  left: 37.5,
                  backgroundColor: color.dark,
                  zIndex: 3,
                }}
              />

              {/* Button cylinder vertical wall connecting bottom and top cap */}
              <div
                className="absolute transition-all duration-75 ease-out"
                style={{
                  width: 250,
                  height: isThisPlaying ? 30 : 50,
                  bottom: isThisPlaying ? 124 : 144,
                  left: 37.5,
                  backgroundColor: color.dark,
                  zIndex: 3,
                }}
              />

              {/* Button top cap (main color) — moves down when playing */}
              <div
                className="absolute rounded-[50%] transition-all duration-75 ease-out flex items-center justify-center text-white"
                style={{
                  width: 250,
                  height: 188,
                  bottom: isThisPlaying ? 60 : 100,
                  left: 37.5,
                  backgroundColor: color.main,
                  zIndex: 4,
                  boxShadow: isThisPlaying ? 'none' : `0 12px 24px ${color.shadow}`,
                }}
              >
                {isThisLoading && (
                  <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                )}
              </div>
            </div>
          </div>

          {/* Right: Sound Details */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <h1 className="text-3xl md:text-5xl font-black text-foreground underline decoration-2 underline-offset-8 decoration-foreground/30 leading-tight">
              {h1Title || sound.title}
            </h1>

            {/* Category and tag pills */}
            <div className="flex flex-wrap gap-2 items-center justify-center md:justify-start mt-6">
              {sound.category && (
                <Link href={`/${sound.category.slug}`} className="inline-block">
                  <span className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-bold bg-sky-500/10 text-sky-500 border border-sky-500/20 hover:bg-sky-500/20 transition-all">
                    #{sound.category.name}
                  </span>
                </Link>
              )}

              {sound.tags && sound.tags.length > 0 && sound.tags.map((tag: string) => {
                const tagTrimmed = tag.trim();
                if (!tagTrimmed) return null;
                const slug = encodeURIComponent(tagTrimmed.toLowerCase().replace(/\s+/g, '-'));
                return (
                  <Link key={tagTrimmed} href={`/tag/${slug}`} className="inline-block">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-650 dark:text-slate-350 border border-slate-205 dark:border-slate-750 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all">
                      #{tagTrimmed}
                    </span>
                  </Link>
                );
              })}
            </div>

            {/* Stats (Plays, Views) */}
            <div className="flex items-center gap-6 mt-6 text-sm md:text-base font-bold text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-2">
                <span className="text-sky-500 text-lg">▶</span>
                <span className="font-black text-foreground">{sound.playCount?.toLocaleString() || '0'}</span> plays
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sky-500 text-lg">👁</span>
                <span className="font-black text-foreground">{sound.viewCount?.toLocaleString() || '0'}</span> views
              </div>
            </div>

            {/* Uploaded By */}
            <div className="mt-3 text-xs md:text-sm font-bold text-slate-450 dark:text-slate-500">
              Uploaded by <span className="text-sky-500 font-extrabold">{siteName}</span>
            </div>

            {/* Action buttons (Copy link, Share, Download MP3) */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-8 w-full">
              <button
                onClick={handleCopyLink}
                className="flex items-center gap-2 px-5 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-foreground font-bold hover:bg-slate-50 dark:hover:bg-slate-850 active:scale-95 transition-all cursor-pointer text-sm"
              >
                <Copy size={16} /> Copy link
              </button>

              <button
                onClick={handleShare}
                className="flex items-center gap-2 px-5 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-foreground font-bold hover:bg-slate-50 dark:hover:bg-slate-850 active:scale-95 transition-all cursor-pointer text-sm"
              >
                <Send size={16} /> Share
              </button>

              <a
                href={getFullUrl(sound.fileUrl)}
                onClick={handleDownloadAction}
                download={`${sound.slug}.mp3`}
                className="flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-sky-400 to-blue-600 text-white font-black hover:from-sky-500 hover:to-blue-700 active:scale-95 transition-all duration-300 shadow-xl shadow-blue-500/30 text-sm md:text-base cursor-pointer hover:-translate-y-1"
              >
                <Download size={18} /> Download MP3
              </a>
            </div>
          </div>

        </div>

        {/* SEO Content Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <h2 className="text-xl font-black text-foreground mb-4">About the {sound.title} Sound</h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
              {sound.description || uiDescription || `The ${sound.title} sound button is one of the most popular clips in the ${sound.category?.name} category.`}
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <h2 className="text-xl font-black text-foreground mb-4">How to Use {sound.title} Sound</h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
              {sound.howToUse || `You can use the ${sound.title} sound in your OBS streams, Discord soundboards, or video editing projects.`}
            </p>
          </div>

          {sound.transcript && (
            <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 md:col-span-2">
              <h2 className="text-xl font-black text-foreground mb-4">Sound Transcript</h2>
              <p className="italic text-slate-600 dark:text-slate-400 border-l-4 border-primary pl-4 leading-relaxed font-medium">
                &quot;{sound.transcript}&quot;
              </p>
            </div>
          )}
        </div>

        {/* Related Sounds (You may also like) */}
        <div className="pt-6">
          <h2 className="text-2xl md:text-3xl font-black text-center text-foreground mb-10">
            You may also like
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 justify-items-center">
            {relatedSounds.slice(0, 6).map((s: any) => (
              <SoundCard key={s._id} sound={s} />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
