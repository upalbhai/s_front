'use client';

import { useState } from 'react';
import { HelpCircle, Plus, Minus } from 'lucide-react';
import { useTranslation } from '@/i18n';

export default function FaqSection() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
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

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <section className="max-w-4xl mx-auto px-4 md:px-6 py-16 md:py-24 border-t border-slate-100 dark:border-slate-900">
      <div className="flex flex-col items-center text-center space-y-4 mb-12">
        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
          <HelpCircle size={24} />
        </div>
        <p className="text-[10px] font-black uppercase tracking-widest text-primary">{t('home.faq.badge')}</p>
        <h2 className="text-3xl font-black tracking-tight text-foreground">{t('home.faq.title')}</h2>
      </div>

      <div className="space-y-4">
        {FAQ_ITEMS.map((item, idx) => {
          const isOpen = openFaqIndex === idx;
          return (
            <div 
              key={idx} 
              className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 overflow-hidden transition-all"
            >
              <button
                onClick={() => toggleFaq(idx)}
                className="w-full px-6 py-5 flex items-center justify-between text-left font-black text-base text-foreground hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
              >
                <span>{item.question}</span>
                <span className="text-slate-400">
                  {isOpen ? <Minus size={18} /> : <Plus size={18} />}
                </span>
              </button>
              
              {isOpen && (
                <div className="px-6 pb-6 pt-2 text-slate-500 dark:text-slate-400 font-medium text-sm leading-relaxed border-t border-slate-100 dark:border-slate-800 animate-in fade-in slide-in-from-top-1 duration-200">
                  {item.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
