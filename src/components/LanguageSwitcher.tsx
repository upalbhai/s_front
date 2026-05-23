'use client';

import { useEffect, useState } from 'react';
import { useLanguage, SUPPORTED_LOCALES, type Locale } from '@/i18n';
import { useTheme } from 'next-themes';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/components/ui/select';

export default function LanguageSwitcher() {
  const { locale, setLocale } = useLanguage();
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="h-10 w-16 bg-slate-100 dark:bg-slate-800/40 animate-pulse rounded-full" />
    );
  }

  const isDark = theme === 'dark';
  const current = SUPPORTED_LOCALES.find((l) => l.code === locale) ?? SUPPORTED_LOCALES[0];

  return (
    <Select value={locale} onValueChange={(val) => setLocale(val as Locale)}>
      <SelectTrigger
        className={`flex items-center gap-1.5 px-3 py-2.5 rounded-full text-sm font-black
          transition-all duration-200 select-none whitespace-nowrap border-2 cursor-pointer shadow-xs active:scale-95 h-10 w-fit
          ${isDark
            ? 'bg-slate-900 text-white border-white hover:bg-slate-800'
            : 'bg-white text-slate-950 border-slate-950 hover:bg-slate-50'
          }`}
      >
        <span className="text-base leading-none">{current.flag}</span>
        <span className="hidden sm:inline uppercase tracking-wider text-xs mr-1">{current.code}</span>
      </SelectTrigger>
      <SelectContent
        className={`w-44 rounded-2xl overflow-hidden z-[200]
          ${isDark
            ? 'bg-slate-900 border-slate-800 text-white shadow-black/40'
            : 'bg-white border-slate-200 text-slate-700 shadow-black/10'
          }`}
      >
        {SUPPORTED_LOCALES.map((lang) => (
          <SelectItem
            key={lang.code}
            value={lang.code}
            className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold transition-colors cursor-pointer
              ${lang.code === locale
                ? (isDark ? 'bg-white/10 text-white' : 'bg-slate-950/10 text-slate-950')
                : (isDark ? 'text-slate-300 hover:bg-slate-800' : 'text-slate-700 hover:bg-slate-100')
              }`}
          >
            <span className="text-base leading-none w-5 shrink-0">{lang.flag}</span>
            <span className="flex-1 text-left">{lang.name}</span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
