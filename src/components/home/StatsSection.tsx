'use client';

import { Volume2, Users, ShieldCheck } from 'lucide-react';
import { useTranslation } from '@/i18n';

export default function StatsSection() {
  const { t } = useTranslation();
  return (
    <section className="border-y border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/20 py-12">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left divide-y md:divide-y-0 md:divide-x divide-slate-200 dark:divide-slate-800">
          
          <div className="flex flex-col md:flex-row items-center gap-4 justify-center md:justify-start py-6 md:py-0 md:px-6">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800/50 flex items-center justify-center text-foreground shrink-0">
              <Volume2 size={24} />
            </div>
            <div>
              <h3 className="text-2xl md:text-3xl font-black text-foreground">100,000+</h3>
              <p className="text-sm text-slate-500 font-medium">{t('home.stats.s1_label')}</p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-4 justify-center md:justify-start py-6 md:py-0 md:px-6">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800/50 flex items-center justify-center text-foreground shrink-0">
              <Users size={24} />
            </div>
            <div>
              <h3 className="text-2xl md:text-3xl font-black text-foreground">5,000,000+</h3>
              <p className="text-sm text-slate-500 font-medium">{t('home.stats.s2_label')}</p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-4 justify-center md:justify-start py-6 md:py-0 md:px-6">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800/50 flex items-center justify-center text-foreground shrink-0">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h3 className="text-2xl md:text-3xl font-black text-foreground">{t('home.stats.s3_value')}</h3>
              <p className="text-sm text-slate-500 font-medium">{t('home.stats.s3_label')}</p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
