import api from '@/services/api';
import HomeClient from './HomeClient';
import { getRequestSite } from '@/lib/site';

export default async function HomePage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams;
  const site = await getRequestSite();

  let trendingSounds = [];
  let newSounds = [];
  let categories = [];
  let searchResults = [];

  try {
    const [trendingRes, newRes, categoriesRes] = await Promise.all([
      api.get('/sounds?sort=trending&limit=12'),
      api.get('/sounds?limit=12'),
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

  return (
    <HomeClient
      trendingSounds={trendingSounds}
      newSounds={newSounds}
      categories={categories}
      searchResults={searchResults}
      searchQuery={q}
      h1Title={site.meta.home.h1 || site.meta.home.title}
    />
  );
}
