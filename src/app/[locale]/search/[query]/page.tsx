import { Metadata } from 'next';
import api from '@/services/api';
import SearchPageClient from './SearchPageClient';
import { getRequestSite } from '@/lib/site';
import { buildSeoMetadata } from '@/lib/seo';

type Props = {
  params: Promise<{ query: string; locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { query } = await params;
  const decoded = decodeURIComponent(query);
  const site = await getRequestSite();

  return buildSeoMetadata({
    site,
    title: site.meta.search.titleTemplate.replace('{sound name}', decoded),
    description: site.meta.search.descriptionTemplate.replace('{search name}', decoded),
    canonicalPath: `/search/${query}`,
    keywords: 'sound buttons, soundboard, sound effects, meme soundboard',
  });
}

export default async function SearchPage({ params }: Props) {
  const { query } = await params;
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

  return (
    <SearchPageClient
      query={decoded}
      initialResults={initialResults}
      total={total}
      h1Title={site.meta.search.h1Template.replace('{sound name}', decoded)}
    />
  );
}
