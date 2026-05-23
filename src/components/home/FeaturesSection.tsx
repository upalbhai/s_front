'use client';

import { Zap, Download, ShieldCheck } from 'lucide-react';

export default function FeaturesSection() {
  return (
    <section className="max-w-7xl mx-auto px-4 border-t border-slate-200 dark:border-slate-800">
      <div className="flex flex-col items-center text-center space-y-4 mb-16">
        <p className="text-[10px] font-black uppercase tracking-widest text-primary">Uncompromised Design</p>
        <h2 className="text-3xl md:text-4xl font-black tracking-tight text-foreground">Features Designed for Creators</h2>
        <p className="text-slate-500 dark:text-slate-400 font-medium max-w-xl">
          Stream, download, and share viral meme clips at peak performance without any platform limitations.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          {
            title: "Lightning Fast Playback",
            desc: "Engineered with modern compression, our unblocked soundboards deliver audio in milliseconds. Zero buffering, peak hilarity.",
            icon: <Zap className="text-foreground" size={24} />,
          },
          {
            title: "Free High-Quality MP3s",
            desc: "Every single button contains a high-fidelity download option. Seamless integration into Discord, OBS, or mobile devices.",
            icon: <Download className="text-foreground" size={24} />,
          },
          {
            title: "Completely Unblocked",
            desc: "Built to run seamlessly across educational, professional, or residential networks with strict local firewall policies.",
            icon: <ShieldCheck className="text-foreground" size={24} />,
          }
        ].map((item, idx) => (
          <div key={idx} className="p-8 rounded-3xl border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900/50 hover:shadow-lg transition-all space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center">
              {item.icon}
            </div>
            <h3 className="text-lg font-black text-foreground">{item.title}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
