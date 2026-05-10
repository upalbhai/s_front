'use client';

import Link from 'next/link';
import { TrendingUp, ChevronRight } from 'lucide-react';
import SoundCard from '@/components/SoundCard';

interface TrendingSoundsSectionProps {
  trendingSounds: any[];
}

export default function TrendingSoundsSection({ trendingSounds = [] }: TrendingSoundsSectionProps) {
  return (
    <section className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-16 md:py-24">
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800/50 flex items-center justify-center text-foreground">
            <TrendingUp size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-1">Viral hits</p>
            <h2 className="text-2xl md:text-3xl font-black tracking-tight text-foreground">Trending Sounds</h2>
          </div>
        </div>
        <Link href="/trending" className="flex items-center gap-1 font-bold text-sm text-slate-500 hover:text-foreground transition-colors group">
          See All <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {trendingSounds.map((sound: any) => (
          <SoundCard key={sound._id} sound={sound} />
        ))}
      </div>
    </section>
  );
}
