import type { SiteId } from '@/config/sites';
import type { Locale } from './index';

// We import the default fallback explicitly
import soundbuttonsEn from './locales/soundbuttons/en.json';

export async function getTranslations(siteId: SiteId, loc: Locale) {
  let translations: Record<string, string>;

  try {
    const mod = await import(`./locales/${siteId}/${loc}.json`);
    translations = mod.default || mod;
  } catch {
    if (loc !== 'en') {
      try {
        const mod = await import(`./locales/${siteId}/en.json`);
        translations = mod.default || mod;
      } catch {
        // fall through
      }
    }
    if (!translations && siteId !== 'soundbuttons') {
      try {
        const mod = await import(`./locales/soundbuttons/${loc}.json`);
        translations = mod.default || mod;
      } catch {
        const mod = await import('./locales/soundbuttons/en.json');
        translations = mod.default || mod;
      }
    }
    if (!translations) {
      translations = soundbuttonsEn as Record<string, string>;
    }
  }

  // Return a translation function `t`
  return function t(key: string, vars?: Record<string, string>): string {
    let str = translations[key] ?? (soundbuttonsEn as Record<string, string>)[key] ?? key;
    if (vars) {
      Object.entries(vars).forEach(([k, v]) => {
        str = str.replace(new RegExp(`\\{${k}\\}`, 'g'), v);
      });
    }
    return str;
  };
}
