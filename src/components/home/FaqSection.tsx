'use client';

import { HelpCircle } from 'lucide-react';
import { useTranslation } from '@/i18n';

export default function FaqSection() {
  const { t } = useTranslation();

  const FAQ_ITEMS = [
    {
      question: t('home.faq.q1'),
      answer: t('home.faq.a1')
    },
    {
      question: t('home.faq.q2'),
      answer: t('home.faq.a2')
    },
    {
      question: t('home.faq.q3'),
      answer: t('home.faq.a3')
    },
    {
      question: t('home.faq.q4'),
      answer: t('home.faq.a4')
    }
  ];

  return (
    <section className="max-w-4xl mx-auto px-4 md:px-6 py-10 md:py-20 border-t border-slate-100 dark:border-slate-900">
      <div className="flex flex-col items-center text-center space-y-3 mb-8 md:mb-12">
        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
          <HelpCircle size={24} />
        </div>
        <p className="text-[10px] font-black uppercase tracking-widest text-primary">{t('home.faq.badge')}</p>
        <h2 className="text-2xl md:text-3xl font-black tracking-tight text-foreground">{t('home.faq.title')}</h2>
      </div>

      <div className="space-y-4">
        {FAQ_ITEMS.map((item, idx) => {
          return (
            <div
              key={idx}
              className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 p-6 transition-all"
            >
              <h3 className="font-black text-base text-foreground mb-3">
                {item.question}
              </h3>
              <p className="text-slate-500 dark:text-slate-400 font-medium text-sm leading-relaxed">
                {item.answer}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
