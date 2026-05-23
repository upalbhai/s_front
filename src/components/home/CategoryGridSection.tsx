'use client';

import Link from 'next/link';
import { LayoutGrid } from 'lucide-react';
import { useTranslation } from '@/i18n';

interface CategoryGridSectionProps {
  categories: any[];
}

export default function CategoryGridSection({ categories = [] }: CategoryGridSectionProps) {
  const { t } = useTranslation();
  return (
    <section className="max-w-7xl mx-auto px-4 border-t border-slate-200 dark:border-slate-800">
      <div className="flex flex-col items-center text-center space-y-4 mb-12">
        <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800/50 flex items-center justify-center text-foreground">
          <LayoutGrid size={24} />
        </div>
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">{t('home.categories.badge')}</p>
        <h2 className="text-3xl font-black tracking-tight text-foreground">{t('home.categories.title')}</h2>
        <p className="text-slate-500 dark:text-slate-400 font-medium max-w-xl">
          {t('home.categories.subtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((cat: any) => {
          const isGoogleIcon = cat.icon && /^[a-z0-9_]+$/.test(cat.icon);
          return (
            <Link
              href={`/${cat.slug}`}
              key={cat._id}
              className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-primary/50 hover:shadow-xl hover:-translate-y-1 transition-all group"
            >
              <div className="flex items-center gap-4">
                {isGoogleIcon ? (
                  <span className="material-icons text-4xl text-primary/80 group-hover:text-primary transition-colors shrink-0">
                    {cat.icon}
                  </span>
                ) : (
                  <span className="text-4xl grayscale group-hover:grayscale-0 transition-all duration-300 shrink-0">
                    {cat.icon || '🎵'}
                  </span>
                )}
                <div className="min-w-0">
                  <h3 className="text-base font-black text-foreground truncate group-hover:text-primary transition-colors">{cat.name}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-1 mt-1">{cat.description || t('home.categories.fallback_desc')}</p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
