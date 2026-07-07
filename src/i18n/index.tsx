'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
// No SiteId import
import soundbuttonsEn from './locales/soundbuttons/en.json';

export type Locale = 'en' | 'es' | 'fr' | 'pt' | 'ru' | 'it' | 'ja' | 'ko' | 'de';

export const SUPPORTED_LOCALES: { code: Locale; name: string; flag: string }[] = [
  { code: 'en', name: 'English',    flag: '🇺🇸' },
  { code: 'es', name: 'Español',    flag: '🇪🇸' },
  { code: 'fr', name: 'Français',   flag: '🇫🇷' },
  { code: 'pt', name: 'Português',  flag: '🇧🇷' },
  { code: 'ru', name: 'Русский',    flag: '🇷🇺' },
  { code: 'it', name: 'Italiano',   flag: '🇮🇹' },
  { code: 'ja', name: '日本語',      flag: '🇯🇵' },
  { code: 'ko', name: '한국어',      flag: '🇰🇷' },
  { code: 'de', name: 'Deutsch',    flag: '🇩🇪' },
];

async function loadLocaleFile(siteId: string, loc: Locale): Promise<Record<string, string>> {
  try {
    const mod = await import(`./locales/${siteId}/${loc}.json`);
    return mod.default || mod;
  } catch {
    if (loc !== 'en') {
      try {
        const mod = await import(`./locales/${siteId}/en.json`);
        return mod.default || mod;
      } catch {
        // fall through
      }
    }
    if (siteId !== 'soundbuttons') {
      try {
        const mod = await import(`./locales/soundbuttons/${loc}.json`);
        return mod.default || mod;
      } catch {
        const mod = await import('./locales/soundbuttons/en.json');
        return mod.default || mod;
      }
    }
    return soundbuttonsEn as Record<string, string>;
  }
}

interface LanguageContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, vars?: Record<string, string>) => string;
  localePath: (path: string) => string;
}

const LanguageContext = createContext<LanguageContextValue>({
  locale: 'en',
  setLocale: () => {},
  t: (key) => key,
  localePath: (path) => path,
});

const STORAGE_KEY = 'sbmax_locale';

export function LanguageProvider({
  siteId,
  initialLocale = 'en',
  initialTranslations = {},
  children,
}: {
  siteId: string;
  initialLocale?: Locale;
  initialTranslations?: Record<string, string>;
  children: React.ReactNode;
}) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);
  const [translations, setTranslations] = useState<Record<string, string>>(initialTranslations);

  const loadTranslations = useCallback(
    async (loc: Locale) => {
      const data = await loadLocaleFile(siteId, loc);
      setTranslations(data);
    },
    [siteId],
  );

  useEffect(() => {
    // We already have initialLocale and initialTranslations from the server.
    // However, if we need to sync localStorage:
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && stored !== initialLocale && SUPPORTED_LOCALES.some((l) => l.code === stored)) {
      // we might want to respect URL over local storage, so let's stick with initialLocale,
      // but ensure it's in localStorage and document lang is correct.
    }
    
    localStorage.setItem(STORAGE_KEY, initialLocale);
    
    if (typeof window !== 'undefined') {
      document.documentElement.lang = initialLocale;
    }
  }, [initialLocale]);

  const setLocale = useCallback(
    (loc: Locale) => {
      setLocaleState(loc);
      localStorage.setItem(STORAGE_KEY, loc);
      if (typeof document !== 'undefined') {
        document.cookie = `sbmax_locale=${loc}; path=/; max-age=31536000; SameSite=Lax`;
      }
      loadTranslations(loc);
      document.documentElement.lang = loc;
    },
    [loadTranslations],
  );

  const t = useCallback(
    (key: string, vars?: Record<string, string>): string => {
      let str =
        translations[key] ??
        (soundbuttonsEn as Record<string, string>)[key] ??
        key;
      if (vars) {
        Object.entries(vars).forEach(([k, v]) => {
          str = str.replace(new RegExp(`\\{${k}\\}`, 'g'), v);
        });
      }
      return str;
    },
    [translations],
  );

  const localePath = useCallback(
    (path: string): string => {
      if (locale === 'en') return path;
      const normalizedPath = path.startsWith('/') ? path : `/${path}`;
      if (normalizedPath === '/') return `/${locale}`;
      return `/${locale}${normalizedPath}`;
    },
    [locale],
  );

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t, localePath }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}

export function useTranslation() {
  const { t } = useContext(LanguageContext);
  return { t };
}

export function useLocalePath() {
  const { localePath } = useContext(LanguageContext);
  return localePath;
}
