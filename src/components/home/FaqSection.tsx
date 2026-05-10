'use client';

import { useState } from 'react';
import { HelpCircle, Plus, Minus } from 'lucide-react';

const FAQ_ITEMS = [
  {
    question: "What are meme sound buttons?",
    answer: "Meme sound buttons are instant-play audio clips from popular internet culture, viral TikTok videos, and gaming. With a single click, you can play sound effects like the Vine Boom, Bruh, or Goofy Ahh instantly on your phone or PC."
  },
  {
    question: "Are all sound buttons free to play and download?",
    answer: "Yes, 100% free! You can play any sound button as many times as you like, and download them as high-quality MP3 files for your video editing, stream overlays, or phone ringtones."
  },
  {
    question: "Is Sound Buttons Max unblocked at school and work?",
    answer: "Yes. Our web app is optimized to load lightning-fast and run flawlessly across restricted networks, making it the perfect unblocked soundboard for school classrooms, discord channels, or office laughs."
  },
  {
    question: "How do I use these sounds on Discord or OBS?",
    answer: "Simple! You can download the high-quality MP3 file from our platform and upload it directly into your Discord Soundboard or OBS Studio media source overlays."
  }
];

export default function FaqSection() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <section className="max-w-4xl mx-auto px-4 md:px-6 py-16 md:py-24 border-t border-slate-100 dark:border-slate-900">
      <div className="flex flex-col items-center text-center space-y-4 mb-12">
        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
          <HelpCircle size={24} />
        </div>
        <p className="text-[10px] font-black uppercase tracking-widest text-primary">Got questions?</p>
        <h2 className="text-3xl font-black tracking-tight text-foreground">Frequently Asked Questions</h2>
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
