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
      <div className="h-10 w-16 bg-foreground/[0.05] animate-pulse rounded-full" />
    );
  }

  const isDark = theme === 'dark';

  if (!mounted || supportedLocales.length === 0) {
    return (
      <div className="h-10 w-16 bg-foreground/[0.05] animate-pulse rounded-full" />
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

    // Use router.push for soft client-side navigation without full browser refresh
    if (newLocale === 'en') {
      router.push(pathWithoutLocale);
    } else {
      const suffix = pathWithoutLocale === '/' ? '' : pathWithoutLocale;
      router.push(`/${newLocale}${suffix}`);
    }
  };

  return (
    <Select value={locale} onValueChange={(val) => handleLanguageChange(val as Locale)}>
      <SelectTrigger
        className={`flex items-center gap-1.5 px-3 py-2.5 rounded-full text-sm font-black
          transition-all duration-200 select-none whitespace-nowrap border-2 cursor-pointer shadow-xs active:scale-95 h-10 w-fit
          bg-background text-foreground border-foreground hover:bg-foreground/[0.05]`}
      >
        <span className="text-base leading-none">{current.flag}</span>
        <span className="hidden sm:inline uppercase tracking-wider text-xs mr-1">{current.code}</span>
      </SelectTrigger>
      <SelectContent
        className="w-44 rounded-2xl overflow-hidden z-[200] bg-card border-border shadow-xl"
      >
        {supportedLocales.map((lang) => (
          <SelectItem
            key={lang.code}
            value={lang.code}
            className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold transition-colors cursor-pointer
              ${lang.code === locale
                ? 'bg-foreground/10 text-foreground'
                : 'text-foreground/80 hover:bg-foreground/[0.05]'
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
