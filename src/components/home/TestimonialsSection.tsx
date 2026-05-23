'use client';

import { Star } from 'lucide-react';
import { useTranslation } from '@/i18n';

export default function TestimonialsSection() {
  const { t } = useTranslation();

  const TESTIMONIALS = [
    {
      name: "Alex Rivera",
      role: t('home.testimonials.t1_role'),
      quote: t('home.testimonials.t1_quote'),
      rating: 5,
      avatar: "AR"
    },
    {
      name: "Devon Carter",
      role: t('home.testimonials.t2_role'),
      quote: t('home.testimonials.t2_quote'),
      rating: 5,
      avatar: "DC"
    },
    {
      name: "Sophia Martinez",
      role: t('home.testimonials.t3_role'),
      quote: t('home.testimonials.t3_quote'),
      rating: 5,
      avatar: "SM"
    }
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 border-t border-slate-100 dark:border-slate-900">
      <div className="flex flex-col items-center text-center space-y-4 mb-16">
        <p className="text-[10px] font-black uppercase tracking-widest text-primary">{t('home.testimonials.badge')}</p>
        <h2 className="text-3xl md:text-4xl font-black tracking-tight text-foreground">{t('home.testimonials.title')}</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {TESTIMONIALS.map((t, idx) => (
          <div key={idx} className="p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/30 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              {/* Rating stars */}
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(t.rating)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
              </div>
              <p className="text-slate-600 dark:text-slate-400 font-medium leading-relaxed italic">
                &quot;{t.quote}&quot;
              </p>
            </div>

            <div className="flex items-center gap-3 pt-4 border-t border-slate-100 dark:border-slate-800/80">
              <div className="w-10 h-10 rounded-full bg-primary/10 text-primary font-black flex items-center justify-center text-sm shrink-0">
                {t.avatar}
              </div>
              <div>
                <h4 className="text-sm font-black text-foreground leading-none">{t.name}</h4>
                <span className="text-xs text-slate-400 font-bold mt-1 block">{t.role}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
