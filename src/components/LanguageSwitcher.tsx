'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
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
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  const [supportedLocales, setSupportedLocales] = useState<typeof SUPPORTED_LOCALES>([]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    import('@/config/sites').then(mod => {
      const siteId = typeof document !== 'undefined' ? document.documentElement.dataset.site || '' : '';
      const config = mod.getSiteConfig(siteId) as any;
      if (config) {
        const supported = config.supportedLocales || ['en', 'es', 'fr', 'pt', 'ru', 'it', 'ja', 'ko', 'de'];
        setSupportedLocales(SUPPORTED_LOCALES.filter(l => supported.includes(l.code)));
      } else {
        setSupportedLocales([]);
      }
    });
  }, []);

  if (!mounted) {
    return (
      <div className="h-10 w-16 bg-slate-100 dark:bg-slate-800/40 animate-pulse rounded-full" />
    );
  }

  const isDark = theme === 'dark';

  if (!mounted || supportedLocales.length === 0) {
    return (
      <div className="h-10 w-16 bg-slate-100 dark:bg-slate-800/40 animate-pulse rounded-full" />
    );
  }

  if (supportedLocales.length <= 1) {
    return null;
  }

  const current = supportedLocales.find((l) => l.code === locale) ?? supportedLocales[0];

  // Helper to get the route path without locale prefix
  const getPathWithoutLocale = (path: string): string => {
    const localePrefix = SUPPORTED_LOCALES.map((l) => `/${l.code}`);
    for (const prefix of localePrefix) {
      if (path.startsWith(prefix + '/') || path === prefix) {
        return path.slice(prefix.length) || '/';
      }
    }
    return path;
  };

  // Handle language change and navigate to new locale-prefixed route
  const handleLanguageChange = (newLocale: Locale) => {
    setLocale(newLocale);
    const pathWithoutLocale = getPathWithoutLocale(pathname);
    
    // Use full navigation so the middleware processes the locale prefix correctly
    if (newLocale === 'en') {
      window.location.href = pathWithoutLocale;
    } else {
      const suffix = pathWithoutLocale === '/' ? '' : pathWithoutLocale;
      window.location.href = `/${newLocale}${suffix}`;
    }
  };

  return (
    <Select value={locale} onValueChange={(val) => handleLanguageChange(val as Locale)}>
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
        {supportedLocales.map((lang) => (
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
