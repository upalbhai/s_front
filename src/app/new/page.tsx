import { Metadata, Viewport } from 'next';
import NewClient from './NewClient';

export const viewport: Viewport = {
  themeColor: '#2563eb',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "New Meme Soundboard: Latest Sound Buttons | SoundboardMax",
  description: "Discover new soundboard buttons, meme soundboard and sound effects. Play and download the newest soundboard and meme buttons free on SoundboardMax.",
  alternates: {
    canonical: "https://soundboardmax.net/new",
  },
  keywords: "new soundboard sounds, latest sound effects, fresh audio clips, new meme sounds, trending soundboard, latest sound buttons, new audio effects, fresh sound effects, new gaming sounds, new notification sounds, new viral sounds, new comedy sounds, new tiktok sounds, new discord sounds, new streaming sounds, new content creation sounds, new social media sounds",
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
    title: "SoundboardMax",
    statusBarStyle: "default",
  },
  openGraph: {
    title: "New Meme Soundboard: Latest Sound Buttons | SoundboardMax",
    description: "Discover new soundboard buttons, meme soundboard and sound effects. Play and download the newest soundboard and meme buttons free on SoundboardMax.",
    type: "website",
    url: "https://soundboardmax.net/new",
    siteName: "SoundboardMax",
    locale: "en_US",
    images: [
      {
        url: "https://soundboardmax.net/new/opengraph-image.png",
        alt: "New Soundboard Sounds - Fresh Meme Audio Updated Daily",
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
    title: "New Meme Soundboard: Latest Sound Buttons | SoundboardMax",
    description: "Discover new soundboard buttons, meme soundboard and sound effects. Play and download the newest soundboard and meme buttons free on SoundboardMax.",
    images: [
      {
        url: "https://soundboardmax.net/new/opengraph-image.png",
        alt: "New Meme Soundboard: Latest Sound Buttons",
        width: 1200,
        height: 630,
      }
    ],
  },
  other: {
    rating: "general",
    distribution: "global",
    coverage: "worldwide",
    target: "all",
    HandheldFriendly: "true",
    MobileOptimized: "width",
    'mobile-web-app-capable': "yes",
    'msapplication-TileColor': "#2563eb",
    'msapplication-config': "/browserconfig.xml",
  }
};

export default function NewSoundsPage() {
  return <NewClient />;
}
