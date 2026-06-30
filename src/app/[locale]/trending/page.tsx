import { Metadata } from 'next';
import TrendingClient from './TrendingClient';
import { getRequestSite } from '@/config/sites';
import { buildSeoMetadata } from '@/lib/seo';

import { getTranslations } from '@/i18n/server';
import type { Locale } from '@/i18n';
import api from '@/services/api';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const site = await getRequestSite();
  const t = await getTranslations(site.id, locale as Locale);

  return buildSeoMetadata({
    site,
    title: t('meta.trending.title') !== 'meta.trending.title' ? t('meta.trending.title') : site.meta.trending.title,
    description: t('meta.trending.description') !== 'meta.trending.description' ? t('meta.trending.description') : site.meta.trending.description,
    keywords: t('meta.trending.keywords') !== 'meta.trending.keywords' ? t('meta.trending.keywords') : site.meta.trending.keywords,
    canonicalPath: '/trending',
    locale,
    image: `${site.siteUrl}/trending/opengraph-image.png`,
  });
}

export default async function TrendingSoundsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const site = await getRequestSite();
  const t = await getTranslations(site.id, locale as Locale);

  const h1Title = t('meta.trending.h1') !== 'meta.trending.h1' 
    ? t('meta.trending.h1') 
    : (site.meta.trending.h1 || site.meta.trending.title);

  const shortDesc = t('meta.trending.shortDescription') !== 'meta.trending.shortDescription'
    ? t('meta.trending.shortDescription')
    : site.meta.trending.shortDescription;

  let initialSounds = [];
  let initialTotal = 0;
  try {
    const res = await api.get('/sounds?sort=trending&page=1&limit=40');
    initialSounds = res.data.sounds || [];
    initialTotal = res.data.total || 0;
  } catch (error) {
    console.error('Error fetching initial trending sounds:', error);
  }

  return <TrendingClient h1Title={h1Title} shortDescription={shortDesc} initialSounds={initialSounds} initialTotal={initialTotal} />;
}
