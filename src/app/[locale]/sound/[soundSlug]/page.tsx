import api from '@/services/api';
import { Metadata } from 'next';
import Script from 'next/script';
import SoundDetailClient from './SoundDetailClient';
import { getRequestSite } from '@/lib/site';
import { buildSeoMetadata, buildNotFoundMetadata } from '@/lib/seo';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; soundSlug: string }>;
}): Promise<Metadata> {
  const { soundSlug } = await params;
  const site = await getRequestSite();

  try {
    const res = await api.get(`/sounds/${soundSlug}`);
    const sound = res.data;
    if (!sound) {
      throw new Error('Sound not found');
    }

    const soundName = sound.title;
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001';
    const mp3Url = sound.fileUrl
      ? sound.fileUrl.startsWith('http')
        ? sound.fileUrl
        : `${backendUrl}${sound.fileUrl}`
      : '';

    return buildSeoMetadata({
      site,
      title: `${soundName} Sound Effect Button | ${site.siteName}`,
      description: `Play and download ${soundName} sound effect buttons instantly on ${site.siteName}. Perfect for memes, pranks, gaming and hilarious fun reactions.`,
      canonicalPath: `/sound/${soundSlug}`,
      image: `${site.siteUrl}/sound/${soundSlug}/opengraph-image.png`,
      type: 'music.song',
      audioUrl: mp3Url,
      keywords: site.meta.soundDetail.keywordsTemplate,
    });
  } catch {
    return buildNotFoundMetadata(
      `Sound Not Found | ${site.siteName}`,
      `This sound could not be found on ${site.siteName}.`,
    );
  }
}

export default async function LocaleSoundDetailPage({
  params,
}: {
  params: Promise<{ locale: string; soundSlug: string }>;
}) {
  const { soundSlug } = await params;
  const site = await getRequestSite();

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

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001';
  const contentUrl = sound.fileUrl
    ? sound.fileUrl.startsWith('http')
      ? sound.fileUrl
      : `${backendUrl}${sound.fileUrl}`
    : '';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'AudioObject',
    name: sound.title,
    description: sound.seoDescription || sound.description,
    contentUrl,
    encodingFormat: 'audio/mpeg',
    duration: sound.audioDuration || 'PT0M2S',
    uploadDate: sound.createdAt,
    thumbnailUrl:
      sound.ogImage ||
      (sound.iconUrl
        ? sound.iconUrl.startsWith('http')
          ? sound.iconUrl
          : `${site.siteUrl}${sound.iconUrl}`
        : ''),
    transcript: sound.transcript || '',
  };

  return (
    <>
      <Script
        id={`jsonld-sound-${sound._id}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SoundDetailClient
        sound={sound}
        relatedSounds={relatedSounds}
        slug={soundSlug}
        h1Title={site.meta.soundDetail.h1Template.replace('{sound name}', sound.title)}
        uiDescription={site.meta.soundDetail.descriptionTemplate.replace('{sound name}', sound.title)}
      />
    </>
  );
}
