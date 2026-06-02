import api from '@/services/api';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { Metadata } from 'next';
import Script from 'next/script';
import TagClient from './TagClient';
import { getRequestSite } from '@/lib/site';
import { buildSeoMetadata, buildNotFoundMetadata } from '@/lib/seo';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const site = await getRequestSite();

  try {
    const decodedTag = decodeURIComponent(slug).replace(/-/g, ' ');
    const tagName = decodedTag.replace(/\b\w/g, (c) => c.toUpperCase());

    return buildSeoMetadata({
      site,
      title: `${tagName} Soundboard: Free ${tagName} Sound Buttons | ${site.siteName}`,
      description: `Discover thousands of ${tagName} soundboard collections with the sound buttons and meme soundboard. Play instantly & download on ${site.siteName}.`,
      canonicalPath: `/tag/${slug}`,
      image: `${site.siteUrl}/tag/${slug}/opengraph-image.png`,
    });
  } catch {
    return buildNotFoundMetadata(
      `Tag Not Found | ${site.siteName}`,
      `This tag page could not be found on ${site.siteName}.`,
    );
  }
}

export default async function TagPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const site = await getRequestSite();

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

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${tagName} Sounds`,
    description: `Free ${tagName} sound buttons and meme soundboard audio clips online. Play instantly and download MP3s.`,
    url: `${site.siteUrl}/tag/${slug}`,
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: (soundsData.sounds || []).slice(0, 10).map((sound: any, index: number) => ({
        '@type': 'ListItem',
        position: index + 1,
        url: `${site.siteUrl}/sounds/${sound.slug}`,
        name: sound.title,
      })),
    },
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-16">
      <Script
        id={`jsonld-tag-${slug}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav className="flex items-center gap-2 text-slate-500 dark:text-slate-400 mb-8 text-sm font-medium">
        <Link href="/" className="hover:text-foreground transition-colors">
          Home
        </Link>
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
            All sounds are completely free to play, share with friends, and download as unblocked MP3 files
            for use at school, work, or in video edits.
          </p>
        </div>
      </section>
    </div>
  );
}
