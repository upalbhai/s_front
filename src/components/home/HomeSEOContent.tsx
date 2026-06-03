'use client';

import React from 'react';
import { useTranslation } from '@/i18n';
import {
  HelpCircle,
  Sparkles,
  CheckCircle2,
  ListFilter,
  UserCheck,
  Info
} from 'lucide-react';

export default function HomeSEOContent() {
  const { t } = useTranslation();

  const useCases = [
    {
      title: t('seo.built_for.streamers_title'),
      desc: t('seo.built_for.streamers_desc'),
      icon: '🎮'
    },
    {
      title: t('seo.built_for.discord_title'),
      desc: t('seo.built_for.discord_desc'),
      icon: '💬'
    },
    {
      title: t('seo.built_for.students_title'),
      desc: t('seo.built_for.students_desc'),
      icon: '🎒'
    },
    {
      title: t('seo.built_for.creators_title'),
      desc: t('seo.built_for.creators_desc'),
      icon: '🎨'
    },
    {
      title: t('seo.built_for.pranksters_title'),
      desc: t('seo.built_for.pranksters_desc'),
      icon: '🎭'
    }
  ];

  const categories = [
    { text: t('seo.category.meme'), color: 'bg-red-500/10 border-red-500/20 text-red-500' },
    { text: t('seo.category.effects'), color: 'bg-amber-500/10 border-amber-500/20 text-amber-500' },
    { text: t('seo.category.reaction'), color: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' },
    { text: t('seo.category.tiktok'), color: 'bg-pink-500/10 border-pink-500/20 text-pink-500' },
    { text: t('seo.category.games'), color: 'bg-blue-500/10 border-blue-500/20 text-blue-500' },
    { text: t('seo.category.anime'), color: 'bg-purple-500/10 border-purple-500/20 text-purple-500' },
    { text: t('seo.category.movies'), color: 'bg-indigo-500/10 border-indigo-500/20 text-indigo-500' },
    { text: t('seo.category.pranks'), color: 'bg-orange-500/10 border-orange-500/20 text-orange-500' },
    { text: t('seo.category.politics'), color: 'bg-cyan-500/10 border-cyan-500/20 text-cyan-500' },
    { text: t('seo.category.creativity'), color: 'bg-teal-500/10 border-teal-500/20 text-teal-500' }
  ];

  const differences = [
    t('seo.different.points.1'),
    t('seo.different.points.2'),
    t('seo.different.points.3'),
    t('seo.different.points.4'),
    t('seo.different.points.5'),
    t('seo.different.points.6')
  ];

  const faqs = [
    { q: t('seo.faq.q1'), a: t('seo.faq.a1') },
    { q: t('seo.faq.q2'), a: t('seo.faq.a2') },
    { q: t('seo.faq.q3'), a: t('seo.faq.a3') },
    { q: t('seo.faq.q4'), a: t('seo.faq.a4') },
    { q: t('seo.faq.q5'), a: t('seo.faq.a5') }
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-16 md:py-24 border-t border-slate-200 dark:border-slate-800 space-y-16">

      {/* Welcome & Introduction */}
      <div className="space-y-6 text-center">
        <h2 className="text-3xl md:text-4xl font-black tracking-tight text-foreground">
          {t('seo.home_title')}
        </h2>
        <p className="text-base md:text-lg text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
          {t('seo.welcome_text')}
        </p>
      </div>

      {/* Two Column: What is Meme Soundboard & What is Sound Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
        <div className="p-8 rounded-3xl border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900/50 space-y-4">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            <Info size={20} />
          </div>
          <h3 className="text-xl font-black text-foreground">
            {t('seo.q_meme_title')}
          </h3>
          <div className="space-y-3 text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
            <p>{t('seo.q_meme_desc1')}</p>
            <p>{t('seo.q_meme_desc2')}</p>
          </div>
        </div>

        <div className="p-8 rounded-3xl border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900/50 space-y-4">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            <Sparkles size={20} />
          </div>
          <h3 className="text-xl font-black text-foreground">
            {t('seo.q_buttons_title')}
          </h3>
          <div className="space-y-3 text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
            <p>{t('seo.q_buttons_desc1')}</p>
            <p>{t('seo.q_buttons_desc2')}</p>
          </div>
        </div>
      </div>

      {/* Built For Use Cases */}
      <div className="space-y-8">
        <div className="space-y-2">
          <h3 className="text-2xl md:text-3xl font-black tracking-tight text-foreground">
            {t('seo.built_for_title')}
          </h3>
          <p className="text-sm md:text-base text-slate-500 dark:text-slate-400 font-bold">
            {t('seo.built_for_subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {useCases.map((uc, i) => (
            <div
              key={i}
              className={`p-6 rounded-3xl border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900/30 space-y-4 transition-all duration-300 hover:shadow-lg ${i === 4 ? 'sm:col-span-2 lg:col-span-1' : ''
                }`}
            >
              <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-800/80 flex items-center justify-center text-2xl">
                {uc.icon}
              </div>
              <h4 className="text-base font-black text-foreground">{uc.title}</h4>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">{uc.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Explore Categories */}
      <div className="space-y-8">
        <div className="space-y-2">
          <h3 className="text-2xl md:text-3xl font-black tracking-tight text-foreground">
            {t('seo.explore_categories_title')}
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
            {t('seo.explore_categories_desc')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {categories.map((cat, i) => {
            const splitIndex = cat.text.indexOf(' — ') !== -1
              ? cat.text.indexOf(' — ')
              : cat.text.indexOf(': ');

            const hasSeparator = splitIndex !== -1;
            const prefix = hasSeparator ? cat.text.substring(0, splitIndex) : cat.text;
            const suffix = hasSeparator ? cat.text.substring(splitIndex) : '';

            return (
              <div
                key={i}
                className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/10 hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
              >
                <p className="text-sm text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
                  <strong className="text-foreground font-black">{prefix}</strong>
                  {suffix}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Different & Value Propositions */}
      <div className="space-y-8">
        <div className="space-y-2 text-center">
          <h3 className="text-2xl md:text-3xl font-black tracking-tight text-foreground">
            {t('seo.different_title')}
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed whitespace-pre-line">
            {t('seo.different_subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {differences.map((diff, i) => (
            <div
              key={i}
              className="flex items-start gap-4 p-5 rounded-2xl border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900/20"
            >
              <CheckCircle2 className="text-primary shrink-0 mt-0.5" size={18} />
              <p className="text-sm text-slate-600 dark:text-slate-400 font-bold leading-relaxed">{diff}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Frequently Asked Questions */}
      <div className="space-y-8">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
            <HelpCircle size={24} />
          </div>
          <h3 className="text-2xl md:text-3xl font-black tracking-tight text-foreground">
            {t('seo.faq_title')}
          </h3>
        </div>

        <div className="max-w-4xl mx-auto space-y-4">
          {faqs.map((faq, idx) => {
            return (
              <div
                key={idx}
                className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 p-6 transition-all"
              >
                <h3 className="font-black text-base text-foreground mb-3">
                  {faq.q}
                </h3>
                <div className="text-slate-500 dark:text-slate-400 font-medium text-sm leading-relaxed">
                  {faq.a}
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </section>
  );
}
