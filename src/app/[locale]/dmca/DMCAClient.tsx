'use client';

import { useTranslation } from '@/i18n';
import { ShieldAlert } from 'lucide-react';

interface DMCAClientProps {
  siteName: string;
  email: string;
}

export default function DMCAClient({ siteName, email }: DMCAClientProps) {
  const { t } = useTranslation();

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-8 py-12 md:py-20 animate-in fade-in slide-in-from-bottom-5 duration-700">
      {/* Title */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 text-xs font-black uppercase tracking-wider mb-6 text-primary">
          <ShieldAlert size={14} className="animate-pulse" />
          {t('dmca.title')}
        </div>
        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-foreground mb-4">
          <span className="text-gradient">{t('dmca.title')}</span>
        </h1>
        <p className="text-sm font-bold text-slate-450 uppercase tracking-widest">
          {t('dmca.last_updated')}
        </p>
      </div>

      {/* Content Card */}
      <div className="glass-card p-8 md:p-12 space-y-10 prose prose-slate dark:prose-invert max-w-none">
        
        {/* 1. Overview */}
        <section className="space-y-4">
          <h2 className="text-xl md:text-2xl font-black text-foreground">
            {t('dmca.overview.title')}
          </h2>
          <p className="text-slate-600 dark:text-slate-355 leading-relaxed font-medium">
            {t('dmca.overview.desc', { siteName })}
          </p>
        </section>

        {/* 2. Filing a DMCA Notice */}
        <section className="space-y-4">
          <h2 className="text-xl md:text-2xl font-black text-foreground">
            {t('dmca.filing.title')}
          </h2>
          <p className="text-slate-600 dark:text-slate-355 leading-relaxed font-medium mb-3">
            {t('dmca.filing.desc')}
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-600 dark:text-slate-355 font-medium">
            <li>{t('dmca.filing.item1')}</li>
            <li>{t('dmca.filing.item2')}</li>
            <li>{t('dmca.filing.item3')}</li>
            <li>{t('dmca.filing.item4')}</li>
            <li>{t('dmca.filing.item5')}</li>
            <li>{t('dmca.filing.item6')}</li>
          </ul>
        </section>

        {/* 3. Where to Send */}
        <section className="space-y-4">
          <h2 className="text-xl md:text-2xl font-black text-foreground">
            {t('dmca.where_to_send.title')}
          </h2>
          <p className="text-slate-650 dark:text-slate-300 leading-relaxed font-bold bg-slate-50 dark:bg-slate-900/60 p-4 rounded-xl border border-slate-200/50 dark:border-slate-800/50 inline-block break-all">
            {t('dmca.where_to_send.desc', { email })}
          </p>
        </section>

        {/* 4. Our Response */}
        <section className="space-y-4">
          <h2 className="text-xl md:text-2xl font-black text-foreground">
            {t('dmca.response.title')}
          </h2>
          <p className="text-slate-600 dark:text-slate-355 leading-relaxed font-medium mb-3">
            {t('dmca.response.desc')}
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-600 dark:text-slate-355 font-medium">
            <li>{t('dmca.response.item1')}</li>
            <li>{t('dmca.response.item2')}</li>
            <li>{t('dmca.response.item3')}</li>
            <li>{t('dmca.response.item4')}</li>
          </ul>
        </section>

        {/* 5. Counter Notification */}
        <section className="space-y-4">
          <h2 className="text-xl md:text-2xl font-black text-foreground">
            {t('dmca.counter.title')}
          </h2>
          <p className="text-slate-600 dark:text-slate-355 leading-relaxed font-medium mb-3">
            {t('dmca.counter.desc')}
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-600 dark:text-slate-355 font-medium">
            <li>{t('dmca.counter.item1')}</li>
            <li>{t('dmca.counter.item2')}</li>
            <li>{t('dmca.counter.item3')}</li>
            <li>{t('dmca.counter.item4')}</li>
            <li>{t('dmca.counter.item5')}</li>
          </ul>
        </section>

        {/* 6. Repeat Infringers */}
        <section className="space-y-4">
          <h2 className="text-xl md:text-2xl font-black text-foreground">
            {t('dmca.repeat.title')}
          </h2>
          <p className="text-slate-600 dark:text-slate-355 leading-relaxed font-medium">
            {t('dmca.repeat.desc')}
          </p>
        </section>

        {/* 7. Fair Use */}
        <section className="space-y-4">
          <h2 className="text-xl md:text-2xl font-black text-foreground">
            {t('dmca.fair_use.title')}
          </h2>
          <p className="text-slate-600 dark:text-slate-355 leading-relaxed font-medium">
            {t('dmca.fair_use.desc')}
          </p>
        </section>

        {/* 8. False Claims */}
        <section className="space-y-4">
          <h2 className="text-xl md:text-2xl font-black text-foreground">
            {t('dmca.false_claims.title')}
          </h2>
          <p className="text-slate-600 dark:text-slate-355 leading-relaxed font-medium">
            {t('dmca.false_claims.desc')}
          </p>
        </section>

        {/* 9. Contact */}
        <section className="space-y-4">
          <h2 className="text-xl md:text-2xl font-black text-foreground">
            {t('dmca.contact.title')}
          </h2>
          <p className="text-slate-600 dark:text-slate-355 leading-relaxed font-medium">
            {t('dmca.contact.desc', { email })}
          </p>
        </section>

      </div>
    </div>
  );
}
