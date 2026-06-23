'use client';

import { useTranslation } from '@/i18n';
import { Mail, CheckCircle2, ShieldCheck, Heart, Zap, Sparkles } from 'lucide-react';

interface AboutClientProps {
  siteName: string;
  email: string;
}

export default function AboutClient({ siteName, email }: AboutClientProps) {
  const { t } = useTranslation();

  const features = [
    t('about.what_you_find.item1'),
    t('about.what_you_find.item2'),
    t('about.what_you_find.item3'),
    t('about.what_you_find.item4'),
    t('about.what_you_find.item5'),
    t('about.what_you_find.item6'),
  ].filter(Boolean);

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-8 py-12 md:py-20 animate-in fade-in slide-in-from-bottom-5 duration-700">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 text-xs font-black uppercase tracking-wider mb-6 text-primary">
          <Sparkles size={14} className="animate-pulse" />
          {t('about.title', { siteName })}
        </div>
        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-foreground mb-6 leading-tight">
          <span className="text-gradient">{t('about.title', { siteName })}</span>
        </h1>
        <p className="text-lg md:text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto font-medium">
          {t('about.who_we_are.desc', { siteName })}
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-16">
        {/* Our Mission Card */}
        <div className="glass-card flex flex-col justify-between p-8 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 dark:opacity-10 pointer-events-none group-hover:scale-110 transition-transform duration-500">
            <Heart size={120} className="text-primary" />
          </div>
          <div>
            <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-6">
              <Heart size={24} />
            </div>
            <h2 className="text-2xl font-black text-foreground mb-4">
              {t('about.mission.title')}
            </h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
              {t('about.mission.desc')}
            </p>
          </div>
        </div>

        {/* Why People Use Us Card */}
        <div className="glass-card flex flex-col justify-between p-8 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 dark:opacity-10 pointer-events-none group-hover:scale-110 transition-transform duration-500">
            <Zap size={120} className="text-primary" />
          </div>
          <div>
            <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-6">
              <Zap size={24} />
            </div>
            <h2 className="text-2xl font-black text-foreground mb-4">
              {t('about.why_us.title', { siteName })}
            </h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
              {t('about.why_us.desc', { siteName })}
            </p>
          </div>
        </div>
      </div>

      {/* What You'll Find Here */}
      <div className="glass-card p-8 md:p-12 mb-16 relative overflow-hidden">
        <h2 className="text-2xl md:text-3xl font-black text-foreground mb-8 text-center">
          {t('about.what_you_find.title')}
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          {features.map((feature, index) => (
            <div key={index} className="flex gap-4 items-start group">
              <div className="w-6 h-6 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-110 transition-transform">
                <CheckCircle2 size={16} />
              </div>
              <p className="text-slate-600 dark:text-slate-300 font-medium text-sm md:text-base">
                {feature}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Get In Touch */}
      <div className="glass-card p-8 md:p-12 text-center relative overflow-hidden group">
        <div className="w-16 h-16 rounded-3xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-6 group-hover:scale-105 transition-transform duration-300">
          <Mail size={32} />
        </div>
        <h2 className="text-2xl md:text-3xl font-black text-foreground mb-4">
          {t('about.contact.title')}
        </h2>
        <p className="text-slate-500 dark:text-slate-400 font-medium max-w-xl mx-auto mb-8 leading-relaxed">
          {t('about.contact.desc', { email })}
        </p>
        <a
          href={`mailto:${email}`}
          className="inline-flex items-center gap-2 px-8 py-3.5 bg-primary hover:bg-primary-hover text-primary-foreground font-black text-sm rounded-2xl shadow-lg hover:shadow-xl active:scale-95 transition-all cursor-pointer"
        >
          <Mail size={18} />
          {email}
        </a>
      </div>
    </div>
  );
}
