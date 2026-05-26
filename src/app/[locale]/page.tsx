import api from '@/services/api';
import { Metadata, Viewport } from 'next';
import HomeClient from './HomeClient';

export const viewport: Viewport = {
  themeColor: '#e53935',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "SoundboardMax: 100K+ Meme Soundboard Unblocked and Sound Buttons",
  description: "Explore thousands of meme soundboard including sound buttons, soundboard unblocked, prank sounds, meme buttons, and sound effects on soundboardmax.net.",
  alternates: {
    canonical: "https://soundboardmax.net/",
    languages: {
      'en': 'http://soundboardmax.net/',
      'es': 'http://soundboardmax.net/es/',
      'fr': 'http://soundboardmax.net/fr/',
      'pt': 'http://soundboardmax.net/pt/',
      'ru': 'http://soundboardmax.net/ru/',
      'it': 'http://soundboardmax.net/it/',
      'ja': 'http://soundboardmax.net/ja/',
      'ko': 'http://soundboardmax.net/ko/',
      'de': 'http://soundboardmax.net/de/',
      'x-default': 'http://soundboardmax.net/',
    },
  },
  keywords: "soundboard, meme soundboard, meme soundboard unblocked, unblocked soundboard, sound buttons, meme sounds, viral meme sounds, funny meme sounds, meme sound effects, free soundboard, free sound effects, viral sounds, unblocked sound buttons, audio effects, online soundboard, soundboard online, prank sounds, funny soundboard",
  authors: [{ name: "SoundboardMax.net" }],
  publisher: "SoundboardMax.net",
  creator: "SoundboardMax.net",
  generator: "SoundboardMax.net",
  applicationName: "SoundboardMax",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  formatDetection: {
    telephone: false,
  },
  appleWebApp: {
    capable: true,
    title: "SoundboardMax: 100K+ Meme Soundboard Unblocked and Sound Buttons",
    statusBarStyle: "default",
  },
  openGraph: {
    title: "SoundboardMax: 100K+ Meme Soundboard Unblocked and Sound Buttons",
    description: "Explore thousands of meme soundboard including sound buttons, soundboard unblocked, prank sounds, meme buttons, and sound effects on soundboardmax.net.",
    type: "website",
    url: "https://soundboardmax.net/",
    siteName: "SoundboardMax.net",
    locale: "en_US",
    alternateLocale: ["fr_FR"],
    images: [
      {
        url: "https://soundboardmax.net/home.jpg",
        alt: "SoundboardMax: 100K+ Meme Soundboard Unblocked and Sound Buttons",
        width: 1200,
        height: 630,
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@soundboardmax",
    creator: "@soundboardmax",
    title: "SoundboardMax: 100K+ Meme Soundboard Unblocked and Sound Buttons",
    description: "Explore thousands of meme soundboard including sound buttons, soundboard unblocked, prank sounds, meme buttons, and sound effects on soundboardmax.net.",
    images: [
      {
        url: "https://soundboardmax.net/home.jpg",
        alt: "SoundboardMax: 100K+ Meme Soundboard Unblocked and Sound Buttons",
        width: 1200,
        height: 630,
      }
    ],
  },
  other: {
    copyright: "© 2026 SoundboardMax.net",
    language: "en",
    distribution: "global",
    coverage: "worldwide",
    target: "all",
    HandheldFriendly: "true",
    MobileOptimized: "width",
    'mobile-web-app-capable': "yes",
    'msapplication-TileColor': "#e53935",
    'msapplication-config': "/browserconfig.xml",
  }
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
