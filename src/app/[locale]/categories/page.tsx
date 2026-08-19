import api from '@/services/api';
import CategoryGridSection from '@/components/home/CategoryGridSection';
import { Metadata } from 'next';
import { getRequestSite } from '@/config/sites';
import { buildSeoMetadata } from '@/lib/seo';

import { getTranslations } from '@/i18n/server';
import type { Locale } from '@/i18n';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const site = await getRequestSite();
  const t = await getTranslations(site.id, locale as Locale);

  return buildSeoMetadata({
    site,
    title: t('meta.categories.title') !== 'meta.categories.title' ? t('meta.categories.title') : site.meta.categories.title,
    description: t('meta.categories.description') !== 'meta.categories.description' ? t('meta.categories.description') : site.meta.categories.description,
    canonicalPath: '/categories',
    locale,
  });
}

import SchemaScript from '@/components/SchemaScript';

export default async function CategoriesPage() {
  const site = await getRequestSite();
  let categories = [];
  try {
    const res = await api.get('/categories');
    categories = res.data.categories || [];
  } catch (error) {
    console.error('Error fetching categories:', error);
  }

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Soundboard Categories",
    "url": `${site.siteUrl}/categories`,
    "description": "Browse meme soundboard categories including Anime, Gaming, TikTok, Prank and more, all free and unblocked.",
    "isPartOf": {
      "@type": "WebSite",
      "name": site.siteName,
      "url": site.siteUrl
    }
  };

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
        "name": "Categories",
        "item": `${site.siteUrl}/categories`
      }
    ]
  };

  return (
    <div className="py-16">
      <SchemaScript schema={collectionSchema} />
      <SchemaScript schema={breadcrumbSchema} />
      <CategoryGridSection categories={categories} />
    </div>
  );
}
