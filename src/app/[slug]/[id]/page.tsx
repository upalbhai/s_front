import api from '@/services/api';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { Metadata } from 'next';
import CategoryClient from './CategoryClient';
import { buildNotFoundMetadata, buildSeoMetadata, DEFAULT_IMAGE, SITE_URL } from '@/lib/seo';

export async function generateMetadata({ params }: { params: Promise<{ slug: string, id: string }> }): Promise<Metadata> {
  const { slug, id } = await params;
  try {
    const res = await api.get(`/categories/${id}`);
    const category = res.data;
    
    const canonicalPath = category.canonicalUrl || `/${slug}/${id}`;
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

export default async function CategoryPage({ params }: { params: Promise<{ slug: string, id: string }> }) {
  const { slug, id } = await params;
  
  let category = null;
  let soundsData = { sounds: [], total: 0 };

  try {
    const [catRes, soundsRes] = await Promise.all([
      api.get(`/categories/${id}`),
      api.get(`/sounds?category=${id}&page=1&limit=40`)
    ]);
    category = catRes.data;
    soundsData = soundsRes.data;
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
    "url": `${SITE_URL}/${slug}/${id}`,
    "mainEntity": {
      "@type": "ItemList",
      "itemListElement": soundsData.sounds.slice(0, 10).map((sound: any, index: number) => ({
        "@type": "ListItem",
        "position": index + 1,
        "url": `${SITE_URL}/sound/${sound.slug}/${sound._id}`,
        "name": sound.title
      }))
    }
  };

  return (
    <div className="container category-page" style={{ padding: '4rem 0' }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav className="breadcrumbs" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '0.9rem' }}>
        <Link href="/">Home</Link>
        <ChevronRight size={16} />
        <span className="text-primary">{category.name}</span>
      </nav>

      <div className="category-header" style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <h1 className="text-gradient" style={{ fontSize: '3rem', marginBottom: '1rem' }}>{category.name} Soundboard</h1>
        <p className="category-desc" style={{ color: 'var(--text-muted)', maxWidth: '800px', margin: '0 auto 2rem' }}>
          {category.seoDescription || category.description || `Explore the best ${category.name} sounds online. Play or download free clips instantly.`}
        </p>
      </div>

      <CategoryClient 
        initialSounds={soundsData.sounds} 
        totalSounds={soundsData.total} 
        categoryId={id} 
        categoryName={category.name}
      />

      <section className="glass-card seo-text-block" style={{ marginTop: '6rem', padding: '3rem' }}>
        <h2>About {category.name} Soundboard</h2>
        <div dangerouslySetInnerHTML={{ __html: category.seoText || `<p>Our ${category.name} soundboard features a curated collection of high-quality audio clips. All sounds are free to download and unblocked for use anywhere.</p>` }} />
      </section>
    </div>
  );
}
