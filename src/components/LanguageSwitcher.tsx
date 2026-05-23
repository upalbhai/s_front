'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { useLanguage, SUPPORTED_LOCALES, type Locale } from '@/i18n';

export default function LanguageSwitcher() {
  const { locale, setLocale } = useLanguage();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const current = SUPPORTED_LOCALES.find((l) => l.code === locale) ?? SUPPORTED_LOCALES[0];

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSelect = (code: Locale) => {
    setLocale(code);
    setOpen(false);
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-bold
          bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700
          text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700
          transition-all duration-200 select-none whitespace-nowrap"
      >
        <span className="text-base leading-none">{current.flag}</span>
        <span className="hidden sm:inline uppercase tracking-wider text-xs">{current.code}</span>
        <ChevronDown
          size={12}
          className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div
          role="listbox"
          className="absolute right-0 top-full mt-2 w-44 rounded-2xl overflow-hidden
            bg-white dark:bg-slate-900
            border border-slate-200 dark:border-slate-800
            shadow-2xl shadow-black/10 dark:shadow-black/40
            animate-in fade-in slide-in-from-top-2 duration-150 z-[200]"
        >
          {SUPPORTED_LOCALES.map((lang) => (
            <button
              key={lang.code}
              role="option"
              aria-selected={lang.code === locale}
              onClick={() => handleSelect(lang.code)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold transition-colors
                ${lang.code === locale
                  ? 'bg-primary/10 text-primary'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
            >
              <span className="text-base leading-none w-5 shrink-0">{lang.flag}</span>
              <span className="flex-1 text-left">{lang.name}</span>
              {lang.code === locale && (
                <Check size={14} className="text-primary shrink-0" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
