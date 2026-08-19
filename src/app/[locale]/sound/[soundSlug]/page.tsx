import api from '@/services/api';
import { Metadata } from 'next';
import Script from 'next/script';
import SchemaScript from '@/components/SchemaScript';
import SoundDetailClient from './SoundDetailClient';
import { getRequestSite } from '@/config/sites';
import { buildSeoMetadata, buildNotFoundMetadata } from '@/lib/seo';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; soundSlug: string }>;
}): Promise<Metadata> {
  const { locale, soundSlug } = await params;
  const site = await getRequestSite();
  const t = await import('@/i18n/server').then(m => m.getTranslations(site.id, locale as any));

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

    const titleTemplate = t('meta.soundDetail.titleTemplate') !== 'meta.soundDetail.titleTemplate'
      ? t('meta.soundDetail.titleTemplate')
      : `{sound name} Sound Effect Button | ${site.siteName}`;

    const descriptionTemplate = t('meta.soundDetail.descriptionTemplate') !== 'meta.soundDetail.descriptionTemplate'
      ? t('meta.soundDetail.descriptionTemplate')
      : site.meta.soundDetail.descriptionTemplate;

    const keywords = t('meta.soundDetail.keywordsTemplate') !== 'meta.soundDetail.keywordsTemplate'
      ? t('meta.soundDetail.keywordsTemplate')
      : site.meta.soundDetail.keywordsTemplate;

    return buildSeoMetadata({
      site,
      title: titleTemplate.replace('{sound name}', soundName),
      description: descriptionTemplate.replace('{sound name}', soundName),
      canonicalPath: `/sound/${soundSlug}`,
      locale,
      image: `${site.siteUrl}/sound/${soundSlug}/opengraph-image.png`,
      type: 'music.song',
      audioUrl: mp3Url,
      keywords: keywords,
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
  const { locale, soundSlug } = await params;
  const site = await getRequestSite();
  const t = await import('@/i18n/server').then(m => m.getTranslations(site.id, locale as any));

  let sound: any = null;
  let relatedSounds: any[] = [];

  try {
    const soundRes = await api.get(`/sounds/${soundSlug}`);
    sound = soundRes.data;

    if (sound && sound._id) {
      // View tracking has been moved to the Client Component (SoundDetailClient) to prevent 
      // Next.js Link prefetching from generating fake views.
    }

    if (sound && sound.category?._id) {
      const relatedRes = await api.get(`/sounds?category=${sound.category._id}&limit=16`);
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

  const audioSchema = {
    '@context': 'https://schema.org',
    '@type': 'AudioObject',
    name: sound.title,
    description: sound.seoDescription || sound.description,
    contentUrl,
    uploadDate: sound.createdAt ? new Date(sound.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    thumbnailUrl:
      sound.ogImage ||
      (sound.iconUrl
        ? sound.iconUrl.startsWith('http')
          ? sound.iconUrl
          : `${site.siteUrl}${sound.iconUrl}`
        : ''),
    isPartOf: {
      '@type': 'WebSite',
      name: site.siteName,
      url: site.siteUrl
    }
  };

  const categoryName = sound.category?.name || 'Uncategorized';
  const categorySlug = sound.category?.slug || 'uncategorized';

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": `${site.siteUrl}/`
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": `${categoryName} Soundboard`,
        "item": `${site.siteUrl}/categories/${categorySlug}`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": sound.title,
        "item": `${site.siteUrl}/sound/${soundSlug}`
      }
    ]
  };

  return (
    <>
      <SchemaScript schema={audioSchema} />
      <SchemaScript schema={breadcrumbSchema} />
      <SoundDetailClient
        sound={sound}
        relatedSounds={relatedSounds}
        slug={soundSlug}
        h1Title={(t('meta.soundDetail.h1Template') !== 'meta.soundDetail.h1Template' ? t('meta.soundDetail.h1Template') : site.meta.soundDetail.h1Template).replace('{sound name}', sound.title)}
        uiDescription={(t('meta.soundDetail.descriptionTemplate') !== 'meta.soundDetail.descriptionTemplate' ? t('meta.soundDetail.descriptionTemplate') : site.meta.soundDetail.descriptionTemplate).replace('{sound name}', sound.title)}
        siteName={site.siteName.replace(/\s+/g, '')}
      />
    </>
  );
}
