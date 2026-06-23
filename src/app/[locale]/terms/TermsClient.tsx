'use client';

import { useTranslation } from '@/i18n';
import { FileText } from 'lucide-react';

interface TermsClientProps {
  siteName: string;
  email: string;
}

export default function TermsClient({ siteName, email }: TermsClientProps) {
  const { t } = useTranslation();

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-8 py-12 md:py-20 animate-in fade-in slide-in-from-bottom-5 duration-700">
      {/* Title */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 text-xs font-black uppercase tracking-wider mb-6 text-primary">
          <FileText size={14} className="animate-pulse" />
          {t('terms.title')}
        </div>
        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-foreground mb-4">
          <span className="text-gradient">{t('terms.title')}</span>
        </h1>
        <p className="text-sm font-bold text-slate-450 uppercase tracking-widest">
          {t('terms.last_updated')}
        </p>
      </div>

      {/* Content Card */}
      <div className="glass-card p-8 md:p-12 space-y-10 prose prose-slate dark:prose-invert max-w-none">
        
        {/* 1. Acceptance */}
        <section className="space-y-4">
          <h2 className="text-xl md:text-2xl font-black text-foreground">
            {t('terms.acceptance.title')}
          </h2>
          <p className="text-slate-600 dark:text-slate-350 leading-relaxed font-medium">
            {t('terms.acceptance.desc', { siteName })}
          </p>
        </section>

        {/* 2. Use of Service */}
        <section className="space-y-4">
          <h2 className="text-xl md:text-2xl font-black text-foreground">
            {t('terms.use.title')}
          </h2>
          
          <div className="space-y-2">
            <h3 className="text-md font-bold text-foreground/95">
              {t('terms.use.p1')}
            </h3>
            <p className="text-slate-600 dark:text-slate-350 leading-relaxed font-medium">
              {t('terms.use.p1.desc', { siteName })}
            </p>
          </div>

          <div className="space-y-2 pt-2">
            <h3 className="text-md font-bold text-foreground/95">
              {t('terms.use.p2')}
            </h3>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-600 dark:text-slate-355 font-medium">
              <li>{t('terms.use.p2.item1')}</li>
              <li>{t('terms.use.p2.item2')}</li>
              <li>{t('terms.use.p2.item3')}</li>
              <li>{t('terms.use.p2.item4')}</li>
              <li>{t('terms.use.p2.item5')}</li>
              <li>{t('terms.use.p2.item6')}</li>
            </ul>
          </div>
        </section>

        {/* 3. User Accounts */}
        <section className="space-y-4">
          <h2 className="text-xl md:text-2xl font-black text-foreground">
            {t('terms.accounts.title')}
          </h2>
          <p className="text-slate-600 dark:text-slate-350 leading-relaxed font-medium">
            {t('terms.accounts.desc')}
          </p>
        </section>

        {/* 4. User Content */}
        <section className="space-y-4">
          <h2 className="text-xl md:text-2xl font-black text-foreground">
            {t('terms.content.title')}
          </h2>
          <p className="text-slate-600 dark:text-slate-350 leading-relaxed font-medium mb-3">
            {t('terms.content.desc')}
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-600 dark:text-slate-355 font-medium">
            <li>{t('terms.content.item1')}</li>
            <li>{t('terms.content.item2')}</li>
            <li>{t('terms.content.item3')}</li>
          </ul>
        </section>

        {/* 5. Intellectual Property */}
        <section className="space-y-4">
          <h2 className="text-xl md:text-2xl font-black text-foreground">
            {t('terms.ip.title')}
          </h2>
          <p className="text-slate-600 dark:text-slate-350 leading-relaxed font-medium">
            {t('terms.ip.desc', { siteName })}
          </p>
        </section>

        {/* 6. Copyright and DMCA */}
        <section className="space-y-4">
          <h2 className="text-xl md:text-2xl font-black text-foreground">
            {t('terms.copyright.title')}
          </h2>
          <p className="text-slate-600 dark:text-slate-350 leading-relaxed font-medium">
            {t('terms.copyright.desc', { email })}
          </p>
        </section>

        {/* 7. Disclaimer of Warranties */}
        <section className="space-y-4">
          <h2 className="text-xl md:text-2xl font-black text-foreground">
            {t('terms.disclaimer.title')}
          </h2>
          <p className="text-slate-600 dark:text-slate-350 leading-relaxed font-medium">
            {t('terms.disclaimer.desc')}
          </p>
        </section>

        {/* 8. Limitation of Liability */}
        <section className="space-y-4">
          <h2 className="text-xl md:text-2xl font-black text-foreground">
            {t('terms.liability.title')}
          </h2>
          <p className="text-slate-600 dark:text-slate-350 leading-relaxed font-medium">
            {t('terms.liability.desc', { siteName })}
          </p>
        </section>

        {/* 9. Indemnification */}
        <section className="space-y-4">
          <h2 className="text-xl md:text-2xl font-black text-foreground">
            {t('terms.indemnity.title')}
          </h2>
          <p className="text-slate-600 dark:text-slate-350 leading-relaxed font-medium">
            {t('terms.indemnity.desc', { siteName })}
          </p>
        </section>

        {/* 10. Modifications */}
        <section className="space-y-4">
          <h2 className="text-xl md:text-2xl font-black text-foreground">
            {t('terms.modifications.title')}
          </h2>
          <p className="text-slate-600 dark:text-slate-350 leading-relaxed font-medium">
            {t('terms.modifications.desc')}
          </p>
        </section>

        {/* 11. Governing Law */}
        <section className="space-y-4">
          <h2 className="text-xl md:text-2xl font-black text-foreground">
            {t('terms.law.title')}
          </h2>
          <p className="text-slate-600 dark:text-slate-350 leading-relaxed font-medium">
            {t('terms.law.desc')}
          </p>
        </section>

        {/* 12. Contact */}
        <section className="space-y-4">
          <h2 className="text-xl md:text-2xl font-black text-foreground">
            {t('terms.contact.title')}
          </h2>
          <p className="text-slate-600 dark:text-slate-350 leading-relaxed font-medium">
            {t('terms.contact.desc', { email })}
          </p>
        </section>

      </div>
    </div>
  );
}
