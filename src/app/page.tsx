import api from '@/services/api';
import { Metadata } from 'next';
import HomeClient from './HomeClient';

export const metadata: Metadata = {
  title: "Sound Buttons Max: Free Meme Soundboard Unblocked | 100,000+ Sounds",
  description: "Play 100,000+ free meme sound buttons instantly. Vine Boom, Bruh, Goofy Ahh & more. No download, no login. Unblocked on school and work networks.",
  alternates: { canonical: 'https://soundbuttonsmax.com/' }
};

export default async function HomePage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams;
  
  let trendingSounds = [];
  let newSounds = [];
  let categories = [];
  let searchResults = [];

  try {
    const [trendingRes, newRes, categoriesRes] = await Promise.all([
      api.get('/sounds?sort=trending&limit=12'),
      api.get('/sounds?limit=12'),
      api.get('/categories')
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

  return (
    <HomeClient 
      trendingSounds={trendingSounds} 
      newSounds={newSounds} 
      categories={categories}
      searchResults={searchResults}
      searchQuery={q}
    />
  );
}
