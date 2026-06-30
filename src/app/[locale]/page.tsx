import api from '@/services/api';
import HomeClient from './HomeClient';
import { getRequestSite } from '@/config/sites';
import { getTranslations } from '@/i18n/server';
import { buildSeoMetadata } from '@/lib/seo';
import type { Metadata } from 'next';
import type { Locale } from '@/i18n';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const site = await getRequestSite();
  const t = await getTranslations(site.id, locale as Locale);

  return buildSeoMetadata({
    site,
    title: t('meta.home.title') !== 'meta.home.title' ? t('meta.home.title') : site.meta.home.title,
    description: t('meta.home.description') !== 'meta.home.description' ? t('meta.home.description') : site.meta.home.description,
    canonicalPath: '/',
    locale,
    keywords: t('meta.home.keywords') !== 'meta.home.keywords' ? t('meta.home.keywords') : site.meta.home.keywords,
  });
}

export default async function HomePage({ params, searchParams }: { params: Promise<{ locale: string }>; searchParams: Promise<{ q?: string }> }) {
  const { locale } = await params;
  const { q } = await searchParams;
  const site = await getRequestSite();
  const t = await getTranslations(site.id, locale as Locale);

  let trendingSounds = [];
  let newSounds = [];
  let categories = [];
  let searchResults = [];

  try {
    const [trendingRes, newRes, categoriesRes] = await Promise.all([
      api.get('/sounds?sort=trending&limit=24'),
      api.get('/sounds?limit=24'),
      api.get('/categories'),
    ]);

    trendingSounds = trendingRes.data.sounds || [];
    newSounds = newRes.data.sounds || [];
    categories = categoriesRes.data.categories || [];

    if (q) {
      const searchRes = await api.get(`/sounds?q=${encodeURIComponent(q)}&limit=40`);
      searchResults = searchRes.data.sounds || [];
    }
  } catch (error) {
    console.error('Error fetching home data:', error);
  }

  const h1Title = t('meta.home.h1') !== 'meta.home.h1' 
    ? t('meta.home.h1') 
    : (site.meta.home.h1 || site.meta.home.title);

  return (
    <HomeClient
      trendingSounds={trendingSounds}
      newSounds={newSounds}
      categories={categories}
      searchResults={searchResults}
      searchQuery={q}
      h1Title={h1Title}
    />
  );
}
