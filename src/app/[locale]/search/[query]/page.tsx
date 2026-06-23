import { Metadata } from 'next';
import api from '@/services/api';
import SearchPageClient from './SearchPageClient';
import { getRequestSite } from '@/config/sites';
import { buildSeoMetadata } from '@/lib/seo';
import { getTranslations } from '@/i18n/server';
import type { Locale } from '@/i18n';

type Props = {
  params: Promise<{ query: string; locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { query, locale } = await params;
  const decoded = decodeURIComponent(query);
  const site = await getRequestSite();
  const t = await getTranslations(site.id, locale as Locale);

  const titleFallback = site.meta.search.titleTemplate.replace('{sound name}', decoded);
  const descFallback = site.meta.search.descriptionTemplate.replace('{search name}', decoded);

  const titleTemplate = t('meta.search.titleTemplate') !== 'meta.search.titleTemplate'
    ? t('meta.search.titleTemplate')
    : site.meta.search.titleTemplate;

  const descTemplate = t('meta.search.descriptionTemplate') !== 'meta.search.descriptionTemplate'
    ? t('meta.search.descriptionTemplate')
    : site.meta.search.descriptionTemplate;

  return buildSeoMetadata({
    site,
    title: titleTemplate.replace('{sound name}', decoded),
    description: descTemplate.replace('{search name}', decoded),
    canonicalPath: `/search/${query}`,
    keywords: 'sound buttons, soundboard, sound effects, meme soundboard',
  });
}

export default async function SearchPage({ params }: Props) {
  const { query, locale } = await params;
  const decoded = decodeURIComponent(query);

  let initialResults: any[] = [];
  let total = 0;

  try {
    const res = await api.get(`/sounds?q=${encodeURIComponent(decoded)}&limit=40`);
    initialResults = res.data.sounds || [];
    total = res.data.total || initialResults.length;
  } catch (error) {
    console.error('Error fetching search results:', error);
  }

  const site = await getRequestSite();
  const t = await getTranslations(site.id, locale as Locale);

  const h1TitleTemplate = t('meta.search.h1Template') !== 'meta.search.h1Template'
    ? t('meta.search.h1Template')
    : site.meta.search.h1Template;

  return (
    <SearchPageClient
      query={decoded}
      initialResults={initialResults}
      total={total}
      h1Title={h1TitleTemplate.replace('{sound name}', decoded)}
    />
  );
}
