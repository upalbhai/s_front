import api from '@/services/api';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { Metadata } from 'next';
import Script from 'next/script';
import CategoryClient from '@/app/[slug]/CategoryClient';
import { buildNotFoundMetadata, buildSeoMetadata, DEFAULT_IMAGE, SITE_URL } from '@/lib/seo';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  try {
    const res = await api.get(`/categories/${slug}`);
    const category = res.data;
    
    const canonicalPath = category.canonicalUrl || `/${slug}`;
    const title = category.seoTitle || `${category.name} - Free Sound Buttons & Clips | Sound Buttons Max`;
    const description =
      category.seoDescription ||
      `Browse the best ${category.name} sound buttons online. Play or download free ${category.name} clips instantly. No login, no download. Fully unblocked.`;
    const image = category.ogImage || DEFAULT_IMAGE;

    return buildSeoMetadata({
      title,
      description,
      canonicalPath,
      image,
      type: 'website',
    });
  } catch (error) {
    return buildNotFoundMetadata('Category Not Found | Sound Buttons Max', 'This category could not be found on Sound Buttons Max.');
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

      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-black text-foreground tracking-tight mb-4 leading-tight text-gradient">
          {category.name} Soundboard
        </h1>
        <p className="text-base text-slate-500 dark:text-slate-400 font-bold max-w-2xl mx-auto">
          {category.seoDescription || category.description || `Explore the best ${category.name} sounds online. Play or download free clips instantly.`}
        </p>
      </div>

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
