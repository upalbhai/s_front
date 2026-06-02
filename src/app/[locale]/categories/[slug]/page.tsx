import api from '@/services/api';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { Metadata } from 'next';
import Script from 'next/script';
import CategoryClient from './CategoryClient';
import { getRequestSite } from '@/lib/site';
import { buildSeoMetadata, buildNotFoundMetadata } from '@/lib/seo';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const site = await getRequestSite();

  try {
    const res = await api.get(`/categories/${slug}`);
    const category = res.data;
    if (!category) {
      throw new Error('Category not found');
    }

    const categoryName = category.name;

    return buildSeoMetadata({
      site,
      title: `${categoryName} Soundboard: Sound Buttons Unblocked | ${site.siteName}`,
      description: `Discover thousands of ${categoryName} soundboard collections with the sound buttons and meme soundboard. Play instantly & download on ${site.siteName}.`,
      canonicalPath: `/categories/${slug}`,
      image: `${site.siteUrl}/categories/${slug}/opengraph-image.png`,
    });
  } catch {
    return buildNotFoundMetadata(
      `Category Not Found | ${site.siteName}`,
      `This category could not be found on ${site.siteName}.`,
    );
  }
}

export default async function LocaleCategoryPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { slug } = await params;
  const site = await getRequestSite();

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

  if (!category) {
    return (
      <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>
        <h2>Category not found</h2>
      </div>
    );
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: category.name,
    description: category.seoDescription || category.description,
    url: `${site.siteUrl}/categories/${slug}`,
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: soundsData.sounds.slice(0, 10).map((sound: any, index: number) => ({
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
        id={`jsonld-category-${category._id}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav className="flex items-center gap-2 text-slate-500 dark:text-slate-400 mb-8 text-sm font-medium">
        <Link href="/" className="hover:text-foreground transition-colors">
          Home
        </Link>
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
          dangerouslySetInnerHTML={{
            __html:
              category.seoText ||
              `<p>Our ${category.name} soundboard features a curated collection of high-quality audio clips. All sounds are free to download and unblocked for use anywhere.</p>`,
          }}
        />
      </section>
    </div>
  );
}
