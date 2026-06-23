'use client';

import { useTranslation } from '@/i18n';
import { AlertCircle } from 'lucide-react';

interface DisclaimerClientProps {
  siteName: string;
  domain: string;
  email: string;
}

export default function DisclaimerClient({ siteName, domain, email }: DisclaimerClientProps) {
  const { t } = useTranslation();

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-8 py-12 md:py-20 animate-in fade-in slide-in-from-bottom-5 duration-700">
      {/* Title */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 text-xs font-black uppercase tracking-wider mb-6 text-primary">
          <AlertCircle size={14} className="animate-pulse" />
          {t('disclaimer.title')}
        </div>
        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-foreground mb-4">
          <span className="text-gradient">{t('disclaimer.title')}</span>
        </h1>
        <p className="text-sm font-bold text-slate-450 uppercase tracking-widest">
          {t('disclaimer.last_updated')}
        </p>
      </div>

      {/* Content Card */}
      <div className="glass-card p-8 md:p-12 space-y-10 prose prose-slate dark:prose-invert max-w-none">
        
        {/* 1. General Information */}
        <section className="space-y-4">
          <h2 className="text-xl md:text-2xl font-black text-foreground">
            {t('disclaimer.general.title')}
          </h2>
          <p className="text-slate-600 dark:text-slate-355 leading-relaxed font-medium">
            {t('disclaimer.general.desc', { siteName, domain })}
          </p>
        </section>

        {/* 2. Use at Your Own Risk */}
        <section className="space-y-4">
          <h2 className="text-xl md:text-2xl font-black text-foreground">
            {t('disclaimer.risk.title')}
          </h2>
          <p className="text-slate-600 dark:text-slate-355 leading-relaxed font-medium">
            {t('disclaimer.risk.desc')}
          </p>
        </section>

        {/* 3. Content Disclaimer */}
        <section className="space-y-4">
          <h2 className="text-xl md:text-2xl font-black text-foreground">
            {t('disclaimer.content.title')}
          </h2>
          <p className="text-slate-600 dark:text-slate-355 leading-relaxed font-medium mb-3">
            {t('disclaimer.content.desc', { siteName })}
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-600 dark:text-slate-355 font-medium">
            <li>{t('disclaimer.content.item1')}</li>
            <li>{t('disclaimer.content.item2')}</li>
            <li>{t('disclaimer.content.item3')}</li>
          </ul>
          <p className="text-slate-600 dark:text-slate-355 leading-relaxed font-medium mt-3">
            {t('disclaimer.content.footer')}
          </p>
        </section>

        {/* 4. External Links */}
        <section className="space-y-4">
          <h2 className="text-xl md:text-2xl font-black text-foreground">
            {t('disclaimer.links.title')}
          </h2>
          <p className="text-slate-600 dark:text-slate-355 leading-relaxed font-medium">
            {t('disclaimer.links.desc')}
          </p>
        </section>

        {/* 5. Professional Disclaimer */}
        <section className="space-y-4">
          <h2 className="text-xl md:text-2xl font-black text-foreground">
            {t('disclaimer.professional.title')}
          </h2>
          <p className="text-slate-600 dark:text-slate-355 leading-relaxed font-medium">
            {t('disclaimer.professional.desc')}
          </p>
        </section>

        {/* 6. Fair Use and Copyright */}
        <section className="space-y-4">
          <h2 className="text-xl md:text-2xl font-black text-foreground">
            {t('disclaimer.fair_use.title')}
          </h2>
          <p className="text-slate-600 dark:text-slate-355 leading-relaxed font-medium">
            {t('disclaimer.fair_use.desc')}
          </p>
        </section>

        {/* 7. No Warranties */}
        <section className="space-y-4">
          <h2 className="text-xl md:text-2xl font-black text-foreground">
            {t('disclaimer.warranties.title')}
          </h2>
          <p className="text-slate-600 dark:text-slate-355 leading-relaxed font-medium">
            {t('disclaimer.warranties.desc')}
          </p>
        </section>

        {/* 8. Limitation of Liability */}
        <section className="space-y-4">
          <h2 className="text-xl md:text-2xl font-black text-foreground">
            {t('disclaimer.liability.title')}
          </h2>
          <p className="text-slate-600 dark:text-slate-355 leading-relaxed font-medium">
            {t('disclaimer.liability.desc')}
          </p>
        </section>

        {/* 9. Accuracy of Materials */}
        <section className="space-y-4">
          <h2 className="text-xl md:text-2xl font-black text-foreground">
            {t('disclaimer.materials.title')}
          </h2>
          <p className="text-slate-600 dark:text-slate-355 leading-relaxed font-medium">
            {t('disclaimer.materials.desc')}
          </p>
        </section>

        {/* 10. User Responsibility */}
        <section className="space-y-4">
          <h2 className="text-xl md:text-2xl font-black text-foreground">
            {t('disclaimer.responsibility.title')}
          </h2>
          <p className="text-slate-600 dark:text-slate-355 leading-relaxed font-medium">
            {t('disclaimer.responsibility.desc', { siteName })}
          </p>
        </section>

        {/* 11. Changes */}
        <section className="space-y-4">
          <h2 className="text-xl md:text-2xl font-black text-foreground">
            {t('disclaimer.changes.title')}
          </h2>
          <p className="text-slate-600 dark:text-slate-355 leading-relaxed font-medium">
            {t('disclaimer.changes.desc')}
          </p>
        </section>

        {/* 12. Contact */}
        <section className="space-y-4">
          <h2 className="text-xl md:text-2xl font-black text-foreground">
            {t('disclaimer.contact.title')}
          </h2>
          <p className="text-slate-600 dark:text-slate-355 leading-relaxed font-medium">
            {t('disclaimer.contact.desc', { email })}
          </p>
        </section>

      </div>
    </div>
  );
}
