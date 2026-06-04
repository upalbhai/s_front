export type SiteConfig = {
  id: string;
  domains: string[];
  supportedLocales: import('@/i18n').Locale[];
  defaultLocale: import('@/i18n').Locale;
  siteName: string;
  wordmark: { line1: string; accent: string };
  siteUrl: string;
  logo: string;
  ogImage: string;
  themeColor: string;
  primaryColor: string;
  primaryHoverColor: string;
  contactEmail: string;
  dmcaEmail: string;
  twitterHandle: string;
  meta: {
    home: { title: string; description: string; keywords: string; h1?: string };
    trending: { title: string; description: string; h1?: string; shortDescription?: string; keywords?: string };
    new: { title: string; description: string; h1?: string; shortDescription?: string; keywords?: string };
    categories: { title: string; description: string };
    categoryDetail: { titleTemplate: string; descriptionTemplate: string; h1Template: string; keywordsTemplate?: string };
    soundDetail: { h1Template: string; descriptionTemplate: string; keywordsTemplate?: string };
    search: { titleTemplate: string; descriptionTemplate: string; h1Template: string };
  };
};

export const DEFAULT_SITE_ID =
  (process.env.NEXT_PUBLIC_DEFAULT_SITE as string) || 'soundbuttons';

export function normalizeHost(host: string): string {
  return host.split(':')[0].toLowerCase().replace(/^www\./, '');
}

export async function getAllSites(): Promise<SiteConfig[]> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
    // Edge cache is supported in App Router middleware via fetch options
    const res = await fetch(`${apiUrl}/sites`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) {
      console.error('Error fetching sites:', res.statusText);
      return [];
    }
    return await res.json();
  } catch (error) {
    console.error('Failed to fetch sites from backend:', error);
    return [];
  }
}

export async function resolveSiteId(host: string): Promise<string> {
  const normalized = normalizeHost(host);
  const sites = await getAllSites();

  for (const site of sites) {
    if (site.domains.some((domain) => normalizeHost(domain) === normalized)) {
      return site.id;
    }
  }

  return DEFAULT_SITE_ID;
}

export async function getSiteConfig(siteId: string): Promise<SiteConfig> {
  const sites = await getAllSites();
  const site = sites.find(s => s.id === siteId);
  if (site) return site;
  
  const defaultSite = sites.find(s => s.id === DEFAULT_SITE_ID);
  if (defaultSite) return defaultSite;

  // Fallback for build time or empty DB
  return {
    id: DEFAULT_SITE_ID,
    domains: [],
    supportedLocales: ['en'],
    defaultLocale: 'en',
    siteName: 'Fallback Site',
    wordmark: { line1: 'SOUND', accent: 'MAX' },
    siteUrl: 'http://localhost:3000',
    logo: '',
    ogImage: '',
    themeColor: '#000000',
    primaryColor: '#000000',
    primaryHoverColor: '#000000',
    contactEmail: '',
    dmcaEmail: '',
    twitterHandle: '',
    meta: {
      home: { title: 'Home', description: 'Fallback description', keywords: '', h1: 'Home' },
      trending: { title: 'Trending', description: 'Fallback description', h1: 'Trending' },
      new: { title: 'New', description: 'Fallback description', h1: 'New' },
      categories: { title: 'Categories', description: 'Fallback description' },
      categoryDetail: { titleTemplate: '{category name}', descriptionTemplate: 'Fallback', h1Template: '{category name}' },
      soundDetail: { h1Template: '{sound name}', descriptionTemplate: 'Fallback' },
      search: { titleTemplate: 'Search', descriptionTemplate: 'Search', h1Template: 'Search' }
    }
  };
}
