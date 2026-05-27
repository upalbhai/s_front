import { Metadata } from 'next';
import api from '@/services/api';
import SearchPageClient from './SearchPageClient';

type Props = {
  params: Promise<{ query: string; locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { query } = await params;
  const decoded = decodeURIComponent(query);

  return {
    title: `"${decoded}" - Search Results | SoundboardMax`,
    description: `Search results for "${decoded}" on SoundboardMax. Find meme soundboard buttons, sound effects, and audio clips matching "${decoded}".`,
    robots: { index: false, follow: true },
  };
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

  return (
    <SearchPageClient
      query={decoded}
      initialResults={initialResults}
      total={total}
    />
  );
}
