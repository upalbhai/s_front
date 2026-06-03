'use client';

import { Zap, Download, ShieldCheck } from 'lucide-react';
import { useTranslation } from '@/i18n';

export default function FeaturesSection() {
  const { t } = useTranslation();

  const features = [
    {
      title: t('home.features.f1_title'),
      desc: t('home.features.f1_desc'),
      icon: <Zap className="text-foreground" size={24} />,
    },
    {
      title: t('home.features.f2_title'),
      desc: t('home.features.f2_desc'),
      icon: <Download className="text-foreground" size={24} />,
    },
    {
      title: t('home.features.f3_title'),
      desc: t('home.features.f3_desc'),
      icon: <ShieldCheck className="text-foreground" size={24} />,
    }
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 border-t border-slate-200 dark:border-slate-800">
      <div className="flex flex-col items-center text-center space-y-3 mb-10 md:mb-16">
        <p className="text-[10px] font-black uppercase tracking-widest text-primary">{t('home.features.badge')}</p>
        <h2 className="text-2xl md:text-4xl font-black tracking-tight text-foreground">{t('home.features.title')}</h2>
        <p className="text-slate-500 dark:text-slate-400 font-medium max-w-xl text-sm md:text-base">
          {t('home.features.subtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
        {features.map((item, idx) => (
          <div key={idx} className="p-5 md:p-8 rounded-3xl border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900/50 hover:shadow-lg transition-all space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center">
              {item.icon}
            </div>
            <h3 className="text-lg font-black text-foreground">{item.title}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
