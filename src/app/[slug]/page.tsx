import api from '@/services/api';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { Metadata, Viewport } from 'next';
import Script from 'next/script';
import CategoryClient from '@/app/[slug]/CategoryClient';
import { SITE_URL } from '@/lib/seo';

export const viewport: Viewport = {
  themeColor: '#2563eb',
  width: 'device-width',
  initialScale: 1,
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  try {
    const res = await api.get(`/categories/${slug}`);
    const category = res.data;
    if (!category) {
      throw new Error('Category not found');
    }
    
    const categoryName = category.name;
    const canonicalUrl = `https://soundboardmax.net/category/${slug}`;
    const ogImageUrl = `https://soundboardmax.net/category/${slug}/opengraph-image.png`;

    return {
      title: `${categoryName} Soundboard: Sound Buttons Unblocked | SoundboardMax`,
      description: `Discover thousands of ${categoryName} soundboard collections with the sound buttons and meme soundboard. Play instantly & download on SoundboardMax.`,
      alternates: {
        canonical: canonicalUrl,
      },
      keywords: "soundboard categories, meme sounds, gaming sound effects, comedy audio, viral sounds, free sound effects, unblocked sound buttons, audio categories, soundboard categories, sound effects library, meme audio, gaming audio, comedy sounds, viral audio, free audio, unblocked audio,",
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
        title: `${categoryName} Soundboard: Sound Buttons Unblocked | SoundboardMax`,
        description: `Discover thousands of ${categoryName} soundboard collections with the sound buttons and meme soundboard. Play instantly & download on SoundboardMax.`,
        type: "website",
        url: canonicalUrl,
        siteName: "SoundboardMax",
        locale: "en_US",
        alternateLocale: ["fr_FR"],
        images: [
          {
            url: ogImageUrl,
            alt: `${categoryName} Soundboard | SoundboardMax`,
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
        title: `${categoryName} Soundboard: Sound Buttons Unblocked | SoundboardMax`,
        description: `Discover thousands of ${categoryName} soundboard collections with the sound buttons and meme soundboard. Play instantly & download on SoundboardMax.`,
        images: [
          {
            url: ogImageUrl,
            alt: `${categoryName} Soundboard | SoundboardMax`,
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
      title: 'Category Not Found | SoundboardMax',
      description: 'This category could not be found on SoundboardMax.',
      robots: { index: false, follow: true },
    };
  }
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  let category: any = null;
  let soundsData: any = { sounds: [], total: 0 };

  try {
    const catRes = await api.get(`/categories/${slug}`);
    category = catRes.data;
    if (category) {
      const soundsRes = await api.get(`/sounds?category=${category._id}&page=1&limit=40`);
      soundsData = soundsRes.data;
    }
  } catch (error) {
    console.error('Error fetching category data:', error);
  }

  if (!category) return <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}><h2>Category not found</h2></div>;

  // JSON-LD for CollectionPage
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": category.name,
    "description": category.seoDescription || category.description,
    "url": `${SITE_URL}/${slug}`,
    "mainEntity": {
      "@type": "ItemList",
      "itemListElement": soundsData.sounds.slice(0, 10).map((sound: any, index: number) => ({
        "@type": "ListItem",
        "position": index + 1,
        "url": `${SITE_URL}/${slug}/${sound.slug}`,
        "name": sound.title
      }))
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-16">
      <Script
        id={`jsonld-category-${category._id}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav className="flex items-center gap-2 text-slate-500 dark:text-slate-400 mb-8 text-sm font-medium">
        <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
        <ChevronRight size={14} className="shrink-0" />
        <span className="text-primary font-bold">{category.name}</span>
      </nav>

      <CategoryClient 
        initialSounds={soundsData.sounds} 
        totalSounds={soundsData.total} 
        categoryId={category._id} 
        categoryName={category.name}
      />

      <section className="glass-card mt-24 p-8 md:p-12">
        <h2 className="text-2xl font-black text-foreground mb-6">About {category.name} Soundboard</h2>
        <div 
          className="prose prose-slate dark:prose-invert max-w-none text-slate-600 dark:text-slate-400 font-medium space-y-4"
          dangerouslySetInnerHTML={{ __html: category.seoText || `<p>Our ${category.name} soundboard features a curated collection of high-quality audio clips. All sounds are free to download and unblocked for use anywhere.</p>` }} 
        />
      </section>
    </div>
  );
}
