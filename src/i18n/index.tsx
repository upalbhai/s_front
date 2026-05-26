'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import enTranslations from './locales/en.json';

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

// Lazy-load locale JSON files
const localeModules: Record<Locale, () => Promise<any>> = {
  en: () => import('./locales/en.json'),
  es: () => import('./locales/es.json'),
  fr: () => import('./locales/fr.json'),
  pt: () => import('./locales/pt.json'),
  ru: () => import('./locales/ru.json'),
  it: () => import('./locales/it.json'),
  ja: () => import('./locales/ja.json'),
  ko: () => import('./locales/ko.json'),
  de: () => import('./locales/de.json'),
};

interface LanguageContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, vars?: Record<string, string>) => string;
}

const LanguageContext = createContext<LanguageContextValue>({
  locale: 'en',
  setLocale: () => {},
  t: (key) => key,
});

const STORAGE_KEY = 'sbmax_locale';

function detectBrowserLocale(): Locale {
  if (typeof navigator === 'undefined') return 'en';
  const lang = (navigator.language || '').slice(0, 2).toLowerCase();
  const supported = SUPPORTED_LOCALES.map((l) => l.code);
  return supported.includes(lang as Locale) ? (lang as Locale) : 'en';
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('en');
  const [translations, setTranslations] = useState<Record<string, string>>({});

  const loadTranslations = useCallback(async (loc: Locale) => {
    try {
      const mod = await localeModules[loc]();
      setTranslations(mod.default || mod);
    } catch {
      // Fallback to English if locale file fails to load
      const mod = await localeModules['en']();
      setTranslations(mod.default || mod);
    }
  }, []);

  // On mount: detect locale ONLY from URL pathname to keep URL and language in sync
  useEffect(() => {
    let initial: Locale = 'en';
    
    if (typeof window !== 'undefined') {
      const pathSegments = window.location.pathname.split('/').filter(Boolean);
      const firstSegment = pathSegments[0] as Locale;
      if (SUPPORTED_LOCALES.some((l) => l.code === firstSegment)) {
        initial = firstSegment;
      }
      // If no locale in URL, default to English (URL is the source of truth)
    }
    
    setLocaleState(initial);
    loadTranslations(initial);
    localStorage.setItem(STORAGE_KEY, initial);
    
    if (typeof window !== 'undefined') {
      document.documentElement.lang = initial;
    }
  }, [loadTranslations]);

  const setLocale = useCallback((loc: Locale) => {
    setLocaleState(loc);
    localStorage.setItem(STORAGE_KEY, loc);
    loadTranslations(loc);
    // Update the html lang attribute
    document.documentElement.lang = loc;
  }, [loadTranslations]);

  const t = useCallback((key: string, vars?: Record<string, string>): string => {
    let str = translations[key] ?? (enTranslations as Record<string, string>)[key] ?? key;
    if (vars) {
      Object.entries(vars).forEach(([k, v]) => {
        str = str.replace(new RegExp(`\\{${k}\\}`, 'g'), v);
      });
    }
    return str;
  }, [translations]);

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
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
