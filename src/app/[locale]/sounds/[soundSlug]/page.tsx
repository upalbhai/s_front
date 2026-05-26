import api from '@/services/api';
import { Metadata, Viewport } from 'next';
import Link from 'next/link';
import Script from 'next/script';
import SoundDetailClient from './SoundDetailClient';
import { SITE_URL } from '@/lib/seo';

export const viewport: Viewport = {
  themeColor: '#e53935',
  width: 'device-width',
  initialScale: 1,
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string; soundSlug: string }> }): Promise<Metadata> {
  const { soundSlug } = await params;
  try {
    const res = await api.get(`/sounds/${soundSlug}`);
    const sound = res.data;
    if (!sound) {
      throw new Error('Sound not found');
    }

    const soundName = sound.title;
    const canonicalUrl = `https://soundboardmax.net/sounds/${soundSlug}`;
    const ogImageUrl = `https://soundboardmax.net/sounds/${soundSlug}/opengraph-image.png`;

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001';
    const mp3Url = sound.fileUrl ? (sound.fileUrl.startsWith('http') ? sound.fileUrl : `${backendUrl}${sound.fileUrl}`) : '';

    return {
      title: `${soundName} Sound Effect Button | SoundboardMax`,
      description: `Play and download ${soundName} sound effect buttons instantly on SoundboardMax. Perfect for memes, pranks, gaming and hilarious fun reactions.`,
      alternates: {
        canonical: canonicalUrl,
      },
      keywords: "soundboard, meme sounds, sound effects, unblocked sound buttons, free sound effects, viral sounds, meme soundboard, audio effects, soundboard download, funny sounds, notification sounds, sound buttons for discord, sound buttons for tiktok, sound buttons for youtube, sound buttons for streaming, sound buttons for gaming, sound buttons for pranks, sound buttons for memes, sound buttons for reactions, sound buttons for content creation",
      authors: [{ name: "SoundboardMax.net" }],
      publisher: "SoundboardMax.net",
      creator: "SoundboardMax.net",
      applicationName: "SoundboardMax: 100K+ Meme Soundboard Unblocked and Sound Buttons",
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
        title: `${soundName} Sound Effect Button | SoundboardMax`,
        description: `Play and download ${soundName} sound effect buttons instantly on SoundboardMax. Perfect for memes, pranks, gaming and hilarious fun reactions.`,
        type: "music.song",
        url: canonicalUrl,
        siteName: "SoundboardMax",
        locale: "en_US",
        alternateLocale: ["fr_FR"],
        images: [
          {
            url: ogImageUrl,
            alt: `${soundName} - SoundboardMax.net`,
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
        title: `${soundName} Sound Effect Button | SoundboardMax`,
        description: `Play and download ${soundName} sound effect buttons instantly on SoundboardMax. Perfect for memes, pranks, gaming and hilarious fun reactions.`,
        images: [
          {
            url: ogImageUrl,
            alt: `${soundName} - SoundboardMax.net`,
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
        'og:audio': mp3Url,
      }
    };
  } catch (error) {
    return {
      title: 'Sound Not Found | SoundboardMax',
      description: 'This sound could not be found on SoundboardMax.',
      robots: { index: false, follow: true },
    };
  }
}

export default async function LocaleSoundDetailPage({ params }: { params: Promise<{ locale: string; soundSlug: string }> }) {
  const { soundSlug } = await params;

  let sound: any = null;
  let relatedSounds: any[] = [];

  try {
    const soundRes = await api.get(`/sounds/${soundSlug}`);
    sound = soundRes.data;

    if (sound && sound.category?._id) {
      const relatedRes = await api.get(`/sounds?category=${sound.category._id}&limit=12`);
      relatedSounds = relatedRes.data.sounds.filter((s: any) => s._id !== sound._id);
    }
  } catch (error) {
    console.error('Error fetching sound details:', error);
  }

  if (!sound) {
    return (
      <div className="container mx-auto px-4" style={{ padding: '4rem 0', textAlign: 'center' }}>
        <h2 className="text-2xl font-black mb-2">Sound not found</h2>
        <p className="text-slate-500">The sound you are looking for does not exist or has been removed.</p>
      </div>
    );
  }

  // JSON-LD for AudioObject
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "AudioObject",
    "name": sound.title,
    "description": sound.seoDescription || sound.description,
    "contentUrl": `${SITE_URL}${sound.fileUrl}`,
    "encodingFormat": "audio/mpeg",
    "duration": sound.audioDuration || "PT0M2S",
    "uploadDate": sound.createdAt,
    "thumbnailUrl": sound.ogImage || (sound.iconUrl ? `${SITE_URL}${sound.iconUrl}` : ''),
    "transcript": sound.transcript || ""
  };

  return (
    <>
      <Script
        id={`jsonld-sound-${sound._id}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SoundDetailClient sound={sound} relatedSounds={relatedSounds} slug={soundSlug} />
    </>
  );
}
