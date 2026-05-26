import { Metadata, Viewport } from 'next';
import TrendingClient from './TrendingClient';

export const viewport: Viewport = {
  themeColor: '#e53935',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "Trending Meme Soundboard: Popular Sound Buttons | SoundboardMax",
  description: "Explore trending meme soundboard and the most viral sound buttons used in gaming, streaming and social media. Play or download your favorite meme buttons.",
  alternates: {
    canonical: "https://soundboardmax.net/trending",
  },
  keywords: "trending sounds, viral soundboard, popular sound effects, trending audio clips, viral meme sounds, popular meme soundboard, popular audio effects, viral sound effects, trending gaming sounds, viral tiktok sounds, trending notification sounds, viral streaming sounds, popular comedy sounds, viral entertainment sounds, trending viral effects, popular social media sounds",
  authors: [{ name: "SoundboardMax.net" }],
  publisher: "SoundboardMax.net",
  creator: "SoundboardMax.net",
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
    statusBarStyle: "black-translucent",
  },
  openGraph: {
    title: "Trending Meme Soundboard: Popular Sound Buttons | SoundboardMax",
    description: "Explore trending meme soundboard and the most viral sound buttons used in gaming, streaming and social media. Play or download your favorite meme buttons.",
    type: "website",
    url: "https://soundboardmax.net/trending",
    siteName: "SoundboardMax",
    locale: "en_US",
    images: [
      {
        url: "https://soundboardmax.net/trending/opengraph-image.png",
        alt: "Trending Soundboard & Viral Meme Sounds | SoundboardMax",
        width: 1200,
        height: 630,
        type: "image/png",
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@soundboardmax",
    creator: "@soundboardmax",
    title: "Trending Meme Soundboard: Popular Sound Buttons | SoundboardMax",
    description: "Explore trending meme soundboard and the most viral sound buttons used in gaming, streaming and social media. Play or download your favorite meme buttons.",
    images: [
      {
        url: "https://soundboardmax.net/trending/opengraph-image.png",
        alt: "Trending Meme Soundboard: Popular Sound Buttons | SoundboardMax",
        width: 1200,
        height: 630,
      }
    ],
  },
  other: {
    HandheldFriendly: "true",
    MobileOptimized: "width",
    'mobile-web-app-capable': "yes",
    'msapplication-TileColor': "#e53935",
  }
};

export default function TrendingSoundsPage() {
  return <TrendingClient />;
}
