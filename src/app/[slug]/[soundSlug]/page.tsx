import api from '@/services/api';
import { Metadata } from 'next';
import Script from 'next/script';
import SoundDetailClient from './SoundDetailClient';
import { buildNotFoundMetadata, buildSeoMetadata, DEFAULT_IMAGE, SITE_URL } from '@/lib/seo';

export async function generateMetadata({ params }: { params: Promise<{ slug: string; soundSlug: string }> }): Promise<Metadata> {
  const { slug, soundSlug } = await params;
  try {
    const res = await api.get(`/sounds/${soundSlug}`);
    const sound = res.data;
    
    const categorySlug = sound.category?.slug || slug;
    const canonicalPath = sound.canonicalUrl || `/${categorySlug}/${soundSlug}`;
    const title = sound.seoTitle || `${sound.title} Sound Button - Free Play & MP3 Download | Sound Buttons Max`;
    const description =
      sound.seoDescription ||
      `Play the ${sound.title} sound button for free. Instant browser playback — no download needed. Use in Discord, streams & videos. Free MP3 download available.`;
    const image = sound.ogImage || (sound.iconUrl ? `${SITE_URL}${sound.iconUrl}` : DEFAULT_IMAGE);

    return buildSeoMetadata({
      title,
      description,
      canonicalPath,
      image,
      type: 'music.song',
    });
  } catch (error) {
    return buildNotFoundMetadata('Sound Not Found | Sound Buttons Max', 'This sound could not be found on Sound Buttons Max.');
  }
}

export default async function SoundDetailPage({ params }: { params: Promise<{ slug: string; soundSlug: string }> }) {
  const { slug, soundSlug } = await params;
  
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
    "thumbnailUrl": sound.ogImage || (sound.iconUrl ? `${SITE_URL}${sound.iconUrl}` : DEFAULT_IMAGE),
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
