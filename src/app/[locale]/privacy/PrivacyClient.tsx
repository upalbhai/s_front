'use client';

import { useTranslation } from '@/i18n';
import { Shield, Sparkles } from 'lucide-react';

interface PrivacyClientProps {
  siteName: string;
  domain: string;
  email: string;
}

export default function PrivacyClient({ siteName, domain, email }: PrivacyClientProps) {
  const { t } = useTranslation();

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-8 py-12 md:py-20 animate-in fade-in slide-in-from-bottom-5 duration-700">
      {/* Title */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 text-xs font-black uppercase tracking-wider mb-6 text-primary">
          <Shield size={14} className="animate-pulse" />
          {t('privacy.title')}
        </div>
        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-foreground mb-4">
          <span className="text-gradient">{t('privacy.title')}</span>
        </h1>
        <p className="text-sm font-bold text-slate-450 uppercase tracking-widest">
          {t('privacy.last_updated')}
        </p>
      </div>

      {/* Main Content Card */}
      <div className="glass-card p-8 md:p-12 space-y-10 prose prose-slate dark:prose-invert max-w-none">
        
        {/* 1. Introduction */}
        <section className="space-y-4">
          <h2 className="text-xl md:text-2xl font-black text-foreground">
            {t('privacy.intro.title')}
          </h2>
          <p className="text-slate-600 dark:text-slate-350 leading-relaxed font-medium">
            {t('privacy.intro.desc', { siteName, domain })}
          </p>
        </section>

        {/* 2. Information We Collect */}
        <section className="space-y-4">
          <h2 className="text-xl md:text-2xl font-black text-foreground">
            {t('privacy.collect.title')}
          </h2>
          
          <div className="space-y-3">
            <h3 className="text-md font-bold text-foreground/95">
              {t('privacy.collect.p1')}
            </h3>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-600 dark:text-slate-355 font-medium">
              <li>{t('privacy.collect.p1.item1')}</li>
              <li>{t('privacy.collect.p1.item2')}</li>
              <li>{t('privacy.collect.p1.item3')}</li>
            </ul>
          </div>

          <div className="space-y-3 pt-2">
            <h3 className="text-md font-bold text-foreground/95">
              {t('privacy.collect.p2')}
            </h3>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-600 dark:text-slate-355 font-medium">
              <li>{t('privacy.collect.p2.item1')}</li>
              <li>{t('privacy.collect.p2.item2')}</li>
              <li>{t('privacy.collect.p2.item3')}</li>
              <li>{t('privacy.collect.p2.item4')}</li>
            </ul>
          </div>
        </section>

        {/* 3. How We Use Your Information */}
        <section className="space-y-4">
          <h2 className="text-xl md:text-2xl font-black text-foreground">
            {t('privacy.use.title')}
          </h2>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-600 dark:text-slate-355 font-medium">
            <li>{t('privacy.use.item1')}</li>
            <li>{t('privacy.use.item2')}</li>
            <li>{t('privacy.use.item3')}</li>
            <li>{t('privacy.use.item4')}</li>
            <li>{t('privacy.use.item5')}</li>
            <li>{t('privacy.use.item6')}</li>
          </ul>
        </section>

        {/* 4. Cookies and Tracking */}
        <section className="space-y-4">
          <h2 className="text-xl md:text-2xl font-black text-foreground">
            {t('privacy.cookies.title')}
          </h2>
          <p className="text-slate-600 dark:text-slate-350 leading-relaxed font-medium">
            {t('privacy.cookies.desc')}
          </p>
        </section>

        {/* 5. Advertising */}
        <section className="space-y-4">
          <h2 className="text-xl md:text-2xl font-black text-foreground">
            {t('privacy.advertising.title')}
          </h2>
          <p className="text-slate-600 dark:text-slate-350 leading-relaxed font-medium">
            {t('privacy.advertising.desc')}
          </p>
        </section>

        {/* 6. Data Sharing and Disclosure */}
        <section className="space-y-4">
          <h2 className="text-xl md:text-2xl font-black text-foreground">
            {t('privacy.sharing.title')}
          </h2>
          <p className="text-slate-600 dark:text-slate-350 leading-relaxed font-medium mb-3">
            {t('privacy.sharing.desc')}
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-600 dark:text-slate-355 font-medium">
            <li>{t('privacy.sharing.item1')}</li>
            <li>{t('privacy.sharing.item2')}</li>
            <li>{t('privacy.sharing.item3')}</li>
            <li>{t('privacy.sharing.item4')}</li>
            <li>{t('privacy.sharing.item5')}</li>
          </ul>
        </section>

        {/* 7. Data Security */}
        <section className="space-y-4">
          <h2 className="text-xl md:text-2xl font-black text-foreground">
            {t('privacy.security.title')}
          </h2>
          <p className="text-slate-600 dark:text-slate-350 leading-relaxed font-medium">
            {t('privacy.security.desc')}
          </p>
        </section>

        {/* 8. Your Rights */}
        <section className="space-y-4">
          <h2 className="text-xl md:text-2xl font-black text-foreground">
            {t('privacy.rights.title')}
          </h2>
          <p className="text-slate-600 dark:text-slate-350 leading-relaxed font-medium">
            {t('privacy.rights.desc')}
          </p>
        </section>

        {/* 9. Children's Privacy */}
        <section className="space-y-4">
          <h2 className="text-xl md:text-2xl font-black text-foreground">
            {t('privacy.children.title')}
          </h2>
          <p className="text-slate-600 dark:text-slate-350 leading-relaxed font-medium">
            {t('privacy.children.desc')}
          </p>
        </section>

        {/* 10. Changes to This Policy */}
        <section className="space-y-4">
          <h2 className="text-xl md:text-2xl font-black text-foreground">
            {t('privacy.changes.title')}
          </h2>
          <p className="text-slate-600 dark:text-slate-350 leading-relaxed font-medium">
            {t('privacy.changes.desc')}
          </p>
        </section>

        {/* 11. Contact Us */}
        <section className="space-y-4">
          <h2 className="text-xl md:text-2xl font-black text-foreground">
            {t('privacy.contact.title')}
          </h2>
          <p className="text-slate-600 dark:text-slate-350 leading-relaxed font-medium">
            {t('privacy.contact.desc', { email })}
          </p>
        </section>

      </div>
    </div>
  );
}
