'use client';

import Link from 'next/link';
import { Sparkles, ChevronRight } from 'lucide-react';
import SoundCard from '@/components/SoundCard';
import { useTranslation, useLocalePath } from '@/i18n';

interface NewAdditionsSectionProps {
  newSounds: any[];
}

export default function NewAdditionsSection({ newSounds = [] }: NewAdditionsSectionProps) {
  const { t } = useTranslation();
  const lp = useLocalePath();
  return (
    <section className="max-w-7xl mx-auto px-4 border-t border-slate-200 dark:border-slate-800">
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800/50 flex items-center justify-center text-foreground">
            <Sparkles size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-1">{t('home.new_additions.badge')}</p>
            <h2 className="text-2xl md:text-3xl font-black tracking-tight text-foreground">{t('home.new_additions.title')}</h2>
          </div>
        </div>
        <Link href={lp('/new')} className="flex items-center gap-1 font-bold text-sm text-slate-500 hover:text-foreground transition-colors group">
          {t('home.new_additions.see_all')} <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3 sm:gap-6">
        {newSounds.map((sound: any) => (
          <SoundCard key={sound._id} sound={sound} />
        ))}
      </div>
    </section>
  );
}
