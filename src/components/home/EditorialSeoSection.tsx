'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { useTranslation } from '@/i18n';

export default function EditorialSeoSection() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && resolvedTheme === 'dark';

  return (
    <section className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-20 pb-28">
      <div className={`p-10 md:p-16 rounded-[2.5rem] border shadow-sm relative overflow-hidden transition-all duration-300 ${
        isDark 
          ? 'bg-zinc-900/50 border-zinc-800' 
          : 'bg-slate-50 border-slate-200'
      }`}>
        <div className={`absolute top-0 right-0 w-80 h-80 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none ${
          isDark ? 'bg-white/5' : 'bg-black/5'
        }`} />

        <h2 className={`text-3xl md:text-5xl font-black tracking-tight mb-8 leading-tight ${
          isDark ? 'text-white' : 'text-zinc-900'
        }`}>
          {t('hero.badge')}: <br />
          <span className={`bg-gradient-to-r bg-clip-text text-transparent ${
            isDark ? 'from-white to-zinc-500' : 'from-zinc-900 to-zinc-400'
          }`}>
            {t('hero.title')}
          </span>
        </h2>

        <div className="grid md:grid-cols-2 gap-12 leading-relaxed text-sm md:text-base">
          <div className="space-y-6">
            <h3 className={`text-lg md:text-xl font-black ${
              isDark ? 'text-white' : 'text-zinc-900'
            }`}>
              {t('seo.q_buttons_title')}
            </h3>
            <p className={`text-base md:text-lg font-medium leading-relaxed transition-all duration-300 ${
              isDark ? 'text-zinc-300' : 'text-zinc-800'
            }`}>
              {t('seo.q_buttons_desc1')}
            </p>
          </div>
          <div className="space-y-6">
            <h3 className={`text-lg md:text-xl font-black ${
              isDark ? 'text-white' : 'text-zinc-900'
            }`}>
              {t('seo.built_for_title')}
            </h3>
            <p className={`text-base md:text-lg font-medium leading-relaxed transition-all duration-300 ${
              isDark ? 'text-zinc-300' : 'text-zinc-800'
            }`}>
              {t('seo.built_for.students_desc')}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
