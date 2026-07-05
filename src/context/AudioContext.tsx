'use client';

import React, { createContext, useState, useEffect, useRef } from 'react';
import api from '@/services/api';
import { useTheme } from 'next-themes';


export interface Sound {
  _id: string;
  title: string;
  slug: string;
  fileUrl: string;
  iconUrl?: string;
  category?: { _id: string; name: string; slug: string };
}

interface AudioContextProps {
  currentSound: Sound | null;
  isPlaying: boolean;
  isLoading: boolean;
  currentTime: number;
  duration: number;
  playSound: (sound: Sound) => void;
  pauseSound: () => void;
  togglePlay: () => void;
  closePlayer: () => void;
}

export const AudioContext = createContext<AudioContextProps | undefined>(undefined);

const getFullUrl = (url: string) => {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001';
  return `${baseUrl}${url}`;
};

const formatTime = (time: number) => {
  if (isNaN(time)) return '0:00';
  const mins = Math.floor(time / 60);
  const secs = Math.floor(time % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && resolvedTheme === 'dark';

  const [currentSound, setCurrentSound] = useState<Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);


  const playSound = async (sound: Sound) => {
    if (!audioRef.current) return;

    if (currentSound?._id === sound._id) {
      togglePlay();
    } else {
      setIsLoading(true);
      setCurrentSound(sound);
      setIsPlaying(true);
      setCurrentTime(0);
      setDuration(0);
      audioRef.current.src = getFullUrl(sound.fileUrl);
      audioRef.current.load();
      try {
        await audioRef.current.play();
        if (sound._id && sound._id.match(/^[0-9a-fA-F]{24}$/)) {
          api.patch(`/sounds/${sound._id}/stats`, { type: 'play' }).catch(() => { });
        }
      } catch (err) {
        console.error('Audio playback failed:', err);
        setIsPlaying(false);
        setIsLoading(false);
      }
    }
  };

  const pauseSound = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const togglePlay = async () => {
    if (!audioRef.current || !currentSound) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      try {
        await audioRef.current.play();
        setIsPlaying(true);
      } catch (err) {
        console.error('Audio play failed:', err);
        setIsPlaying(false);
      }
    }
  };

  const closePlayer = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
    }
    setCurrentSound(null);
    setIsPlaying(false);
    setIsLoading(false);
    setCurrentTime(0);
    setDuration(0);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleDurationChange = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
    setCurrentSound(null);
  };


  useEffect(() => {
    if (!audioRef.current || !currentSound) return;
    if (isPlaying && audioRef.current.paused) {
      audioRef.current.play().catch(() => setIsPlaying(false));
    } else if (!isPlaying && !audioRef.current.paused) {
      audioRef.current.pause();
    }
  }, [isPlaying, currentSound]);

  return (
    <AudioContext.Provider value={{ currentSound, isPlaying, isLoading, currentTime, duration, playSound, pauseSound, togglePlay, closePlayer }}>
      {children}
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onDurationChange={handleDurationChange}
        onEnded={handleEnded}
        onWaiting={() => setIsLoading(true)}
        onPlaying={() => setIsLoading(false)}
        onCanPlay={() => setIsLoading(false)}
        onLoadStart={() => setIsLoading(true)}
        preload="none"
      />

      {currentSound && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-md animate-in slide-in-from-bottom-8 duration-300">
          <div className={`flex items-center justify-between gap-4 p-3 rounded-2xl border shadow-2xl backdrop-blur-md transition-colors duration-300 ${isDark
            ? 'bg-slate-900/95 text-white border-slate-800'
            : 'bg-white/95 text-slate-900 border-slate-200'
            }`}>

            {/* Left: Icon & Sound info */}
            <div className="flex items-center gap-3 min-w-0">
              {/* Icon */}
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0 overflow-hidden select-none border transition-colors duration-300 ${isDark
                ? 'bg-slate-800 border-slate-700'
                : 'bg-slate-100 border-slate-200'
                }`}>
                {currentSound.iconUrl ? (
                  <img
                    src={getFullUrl(currentSound.iconUrl)}
                    alt={currentSound.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                ) : (
                  <span>🎵</span>
                )}
              </div>

              {/* Title & Time */}
              <div className="min-w-0">
                <h4 className={`text-sm font-bold truncate pr-2 ${isDark ? 'text-white' : 'text-black'
                  }`}>
                  {currentSound.title}
                </h4>
                <div className={`text-[11px] font-medium font-mono mt-0.5 flex items-center gap-1.5 ${isDark ? 'text-slate-400' : 'text-slate-500'
                  }`}>
                  <span>{formatTime(currentTime)}</span>
                  <span className={isDark ? 'text-slate-600' : 'text-slate-300'}>/</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>
            </div>

            {/* Right: Controls */}
            <div className="flex items-center gap-2 shrink-0">
              {/* Play/Pause button */}
              <button
                onClick={togglePlay}
                className="w-9 h-9 rounded-xl bg-sky-500 hover:bg-sky-600 text-white flex items-center justify-center transition-all active:scale-95 cursor-pointer shadow-md shadow-sky-500/20"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : isPlaying ? (
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4 fill-current ml-0.5" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                )}
              </button>

              {/* Close button */}
              <button
                onClick={closePlayer}
                className={`w-9 h-9 rounded-xl border flex items-center justify-center transition-all active:scale-95 cursor-pointer ${isDark
                  ? 'border-slate-700 bg-slate-800/80 text-slate-400 hover:bg-slate-750 hover:text-white'
                  : 'border-slate-200 bg-slate-100/80 text-slate-500 hover:bg-slate-200 hover:text-slate-900'
                  }`}
              >
                <svg className="w-4 h-4 stroke-current fill-none" strokeWidth="2.5" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

          </div>
        </div>
      )}
    </AudioContext.Provider>
  );
};
