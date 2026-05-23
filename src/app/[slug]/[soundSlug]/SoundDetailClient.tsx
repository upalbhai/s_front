'use client';

import { useEffect } from 'react';
import api from '@/services/api';
import SoundCard from '@/components/SoundCard';
import { Pause, Download, ChevronRight, Phone, Bell } from 'lucide-react';
import Link from 'next/link';
import useAudio from '@/hooks/useAudio';

const getFullUrl = (url: string) => {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001';
  return `${baseUrl}${url}`;
};

export default function SoundDetailClient({ sound, relatedSounds }: any) {
  const { currentSound, isPlaying, playSound, togglePlay } = useAudio();
  const isThisPlaying = currentSound?._id === sound._id && isPlaying;

  useEffect(() => {
    if (sound?._id) {
      api.patch(`/sounds/${sound._id}/stats`, { type: 'view' }).catch(() => {});
    }
  }, [sound?._id]);

  const handlePlayClick = () => {
    playSound(sound);
  };

  return (
    <div className="container mx-auto px-4 py-16">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400 mb-8">
        <Link href="/" className="hover:text-foreground transition-colors font-bold">Home</Link>
        <ChevronRight size={14} />
        <Link href={`/${sound.category?.slug}`} className="hover:text-foreground transition-colors font-bold">{sound.category?.name}</Link>
        <ChevronRight size={14} />
        <span className="text-primary font-black">{sound.title}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-10">
        {/* Main Content */}
        <div className="space-y-8">
          {/* Play Card */}
          <div className="text-center p-10 md:p-16 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <h1 className="text-3xl md:text-4xl font-black tracking-tighter text-foreground mb-10">
              {sound.title} <span className="text-primary">Sound Button</span>
            </h1>

            {/* Large Play Button */}
            <div className="relative inline-block mb-12">
              <div className="absolute inset-0 rounded-full bg-primary/20 blur-3xl scale-150 animate-pulse" />
              <button
                onClick={handlePlayClick}
                className={`relative w-40 h-40 rounded-full bg-primary flex items-center justify-center text-background shadow-2xl shadow-primary/40 transition-transform active:scale-90 hover:scale-105 ${
                  isThisPlaying ? 'scale-95' : ''
                }`}
              >
                {isThisPlaying ? <Pause size={64} fill="currentColor" /> : <span className="text-6xl">🔊</span>}
              </button>
            </div>

            {/* Stats */}
            <div className="flex justify-center gap-12 mb-10">
              {[
                { value: sound.playCount?.toLocaleString() || '0', label: 'Plays' },
                { value: sound.viewCount?.toLocaleString() || '0', label: 'Views' },
                { value: sound.favoriteCount?.toLocaleString() || '0', label: 'Favorites' },
              ].map(stat => (
                <div key={stat.label} className="text-center">
                  <span className="text-2xl font-black text-foreground">{stat.value}</span>
                  <span className="block text-xs text-slate-500 dark:text-slate-400 font-bold mt-1">{stat.label}</span>
                </div>
              ))}
            </div>

            {/* Download Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <a
                href={getFullUrl(sound.fileUrl)}
                download={`${sound.slug}.mp3`}
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-primary text-background font-black hover:bg-primary-hover transition-all active:scale-95 shadow-lg shadow-primary/20"
              >
                <Download size={18} /> Download MP3
              </a>
              <button className="flex items-center justify-center gap-2 px-6 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 text-foreground font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
                <Phone size={18} /> Get Ringtone
              </button>
              <button className="flex items-center justify-center gap-2 px-6 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 text-foreground font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
                <Bell size={18} /> Notification
              </button>
            </div>
          </div>

          {/* SEO Content Sections */}
          <div className="space-y-6">
            <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <h2 className="text-xl font-black text-foreground mb-4">About the {sound.title} Sound</h2>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                {sound.description || `The ${sound.title} sound button is one of the most popular clips in the ${sound.category?.name} category.`}
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <h2 className="text-xl font-black text-foreground mb-4">How to Use {sound.title} Sound</h2>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                {sound.howToUse || `You can use the ${sound.title} sound in your OBS streams, Discord soundboards, or video editing projects.`}
              </p>
            </div>

            {sound.transcript && (
              <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <h2 className="text-xl font-black text-foreground mb-4">Sound Transcript</h2>
                <p className="italic text-slate-600 dark:text-slate-400 border-l-4 border-primary pl-4 leading-relaxed font-medium">
                  &quot;{sound.transcript}&quot;
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-black text-foreground">You Might Also Like</h3>
            <Link href={`/${sound.category?.slug}`} className="text-sm font-bold text-sky-500 hover:underline">
              See All
            </Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">
            {relatedSounds.map((s: any) => (
              <SoundCard key={s._id} sound={s} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

