import api from '@/services/api';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { Metadata, Viewport } from 'next';
import Script from 'next/script';
import TagClient from './TagClient';
import { SITE_URL } from '@/lib/seo';

export const viewport: Viewport = {
  themeColor: '#2563eb',
  width: 'device-width',
  initialScale: 1,
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  try {
    const decodedTag = decodeURIComponent(slug).replace(/-/g, ' ');
    const tagName = decodedTag.replace(/\b\w/g, (c) => c.toUpperCase());
    const canonicalUrl = `${SITE_URL}/tag/${slug}`;
    const ogImageUrl = `${SITE_URL}/tag/${slug}/opengraph-image.png`;

    return {
      title: `${tagName} Soundboard: Free ${tagName} Sound Buttons | SoundboardMax`,
      description: `Discover thousands of ${tagName} soundboard collections with the sound buttons and meme soundboard. Play instantly & download on SoundboardMax.`,
      alternates: {
        canonical: canonicalUrl,
      },
      keywords: `${tagName} sounds, ${tagName} soundboard, meme sounds, gaming sound effects, comedy audio, viral sounds, free sound effects, unblocked sound buttons, audio categories`,
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
        title: `${tagName} Soundboard: Free ${tagName} Sound Buttons | SoundboardMax`,
        description: `Discover thousands of ${tagName} soundboard collections with the sound buttons and meme soundboard. Play instantly & download on SoundboardMax.`,
        type: "website",
        url: canonicalUrl,
        siteName: "SoundboardMax",
        locale: "en_US",
        images: [
          {
            url: ogImageUrl,
            alt: `${tagName} Soundboard | SoundboardMax`,
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
        title: `${tagName} Soundboard: Free ${tagName} Sound Buttons | SoundboardMax`,
        description: `Discover thousands of ${tagName} soundboard collections with the sound buttons and meme soundboard. Play instantly & download on SoundboardMax.`,
        images: [
          {
            url: ogImageUrl,
            alt: `${tagName} Soundboard | SoundboardMax`,
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
        'bingbot': "index, follow",
      }
    };
  } catch (error) {
    return {
      title: 'Tag Not Found | SoundboardMax',
      description: 'This tag page could not be found on SoundboardMax.',
      robots: { index: false, follow: true },
    };
  }
}

export default async function TagPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  let decodedTag = '';
  let tagName = '';
  let soundsData: any = { sounds: [], total: 0 };

  try {
    decodedTag = decodeURIComponent(slug).replace(/-/g, ' ');
    tagName = decodedTag.replace(/\b\w/g, (c) => c.toUpperCase());
    const soundsRes = await api.get(`/sounds?tag=${encodeURIComponent(slug)}&page=1&limit=40`);
    soundsData = soundsRes.data;
  } catch (error) {
    console.error('Error fetching tag data:', error);
  }

  // JSON-LD for CollectionPage
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": `${tagName} Sounds`,
    "description": `Free ${tagName} sound buttons and meme soundboard audio clips online. Play instantly and download MP3s.`,
    "url": `${SITE_URL}/tag/${slug}`,
    "mainEntity": {
      "@type": "ItemList",
      "itemListElement": (soundsData.sounds || []).slice(0, 10).map((sound: any, index: number) => ({
        "@type": "ListItem",
        "position": index + 1,
        "url": `${SITE_URL}/${sound.category?.slug || 'uncategorized'}/${sound.slug}`,
        "name": sound.title
      }))
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-16">
      <Script
        id={`jsonld-tag-${slug}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav className="flex items-center gap-2 text-slate-500 dark:text-slate-400 mb-8 text-sm font-medium">
        <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
        <ChevronRight size={14} className="shrink-0" />
        <span className="text-primary font-bold">Tag</span>
        <ChevronRight size={14} className="shrink-0" />
        <span className="text-primary font-bold">#{tagName}</span>
      </nav>

      <TagClient 
        initialSounds={soundsData.sounds || []} 
        totalSounds={soundsData.total || 0} 
        tagSlug={slug} 
        tagName={tagName}
      />

      <section className="glass-card mt-24 p-8 md:p-12">
        <h2 className="text-2xl font-black text-foreground mb-6">About #{tagName} Soundboard</h2>
        <div className="prose prose-slate dark:prose-invert max-w-none text-slate-600 dark:text-slate-400 font-medium space-y-4">
          <p>
            Explore our curated list of high-quality #{tagName} sound buttons and viral audio reactions. 
            All sounds are completely free to play, share with friends, and download as unblocked MP3 files for use at school, work, or in video edits.
          </p>
        </div>
      </section>
    </div>
  );
}
