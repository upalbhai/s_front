import api from '@/services/api';
import CategoryGridSection from '@/components/home/CategoryGridSection';
import { Metadata, Viewport } from 'next';

export const viewport: Viewport = {
  themeColor: '#e53935',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "Meme Soundboard Categories: Explore All Sound Buttons | SoundboardMax",
  description: "Browse our full list of meme soundboard categories. Explore anime, gaming, movie reactions, TikTok sounds, and funny sound buttons on SoundboardMax.",
  alternates: {
    canonical: "https://soundboardmax.net/categories",
  },
  keywords: "soundboard categories, meme sounds, gaming sound effects, comedy audio, viral sounds, free sound effects, unblocked sound buttons, audio categories",
  robots: {
    index: true,
    follow: true,
  },
};

export default async function CategoriesPage() {
  let categories = [];
  try {
    const res = await api.get('/categories');
    categories = res.data.categories || [];
  } catch (error) {
    console.error('Error fetching categories:', error);
  }

  return (
    <div className="py-16">
      <CategoryGridSection categories={categories} />
    </div>
  );
}
