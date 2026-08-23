import api from '@/services/api';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { Metadata } from 'next';
import Script from 'next/script';
import SchemaScript from '@/components/SchemaScript';
import CategoryClient from './CategoryClient';
import { getRequestSite } from '@/config/sites';
import { buildSeoMetadata, buildNotFoundMetadata } from '@/lib/seo';

import { getTranslations } from '@/i18n/server';
import type { Locale } from '@/i18n';
import { getCategoryDescriptionHTML, getCategoryFaqHTML } from '@/lib/categoryContent';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const site = await getRequestSite();
  const t = await getTranslations(site.id, locale as Locale);

  try {
    const res = await api.get(`/categories/${slug}`);
    const category = res.data;
    if (!category) {
      throw new Error('Category not found');
    }

    const categoryName = category.name;

    const titleFallback = site.meta.categoryDetail.titleTemplate.replace('{category name}', categoryName);
    const descFallback = site.meta.categoryDetail.descriptionTemplate.replace('{category name}', categoryName);

    const titleTemplate = t('meta.categoryDetail.titleTemplate') !== 'meta.categoryDetail.titleTemplate' 
      ? t('meta.categoryDetail.titleTemplate') 
      : site.meta.categoryDetail.titleTemplate;
      
    const descTemplate = t('meta.categoryDetail.descriptionTemplate') !== 'meta.categoryDetail.descriptionTemplate'
      ? t('meta.categoryDetail.descriptionTemplate')
      : site.meta.categoryDetail.descriptionTemplate;

    return buildSeoMetadata({
      site,
      title: titleTemplate.replace('{category name}', categoryName),
      description: descTemplate.replace('{category name}', categoryName),
      keywords: t('meta.categoryDetail.keywordsTemplate') !== 'meta.categoryDetail.keywordsTemplate' ? t('meta.categoryDetail.keywordsTemplate') : site.meta.categoryDetail.keywordsTemplate,
      canonicalPath: `/categories/${slug}`,
      locale,
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
  const { locale, slug } = await params;
  const site = await getRequestSite();
  const t = await getTranslations(site.id, locale as Locale);

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

  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${category.name} Soundboard`,
    description: category.seoDescription || category.description,
    url: `${site.siteUrl}/categories/${slug}`,
    isPartOf: {
      '@type': 'WebSite',
      name: site.siteName,
      url: site.siteUrl
    },
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: soundsData.sounds.slice(0, 10).map((sound: any, index: number) => ({
        '@type': 'ListItem',
        position: index + 1,
        url: `${site.siteUrl}/sound/${sound.slug}`,
        name: sound.title,
      })),
    },
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
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": `${category.name} Soundboard`,
        "item": `${site.siteUrl}/categories/${slug}`
      }
    ]
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-16">
      <SchemaScript schema={collectionSchema} />
      <SchemaScript schema={breadcrumbSchema} />
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
        h1Title={t('meta.categoryDetail.h1Template') !== 'meta.categoryDetail.h1Template' 
          ? t('meta.categoryDetail.h1Template').replace('{category name}', category.name) 
          : site.meta.categoryDetail.h1Template.replace('{category name}', category.name)}
      />

      {category.description ? (
        <section className="glass-card mt-24 p-8 md:p-12">
          <div
            className="prose prose-slate dark:prose-invert max-w-none prose-headings:font-black prose-p:font-medium prose-p:leading-relaxed prose-a:text-sky-500 hover:prose-a:text-sky-600 prose-li:font-medium text-slate-600 dark:text-slate-400"
            dangerouslySetInnerHTML={{
              __html: category.description
            }}
          />
        </section>
      ) : (
        <>
          <section className="glass-card mt-24 p-8 md:p-12">
            <h2 className="text-2xl font-black text-foreground mb-6">About {category.name} Soundboard</h2>
            <div
              className="prose prose-slate dark:prose-invert max-w-none prose-headings:font-black prose-p:font-medium prose-p:leading-relaxed prose-a:text-sky-500 hover:prose-a:text-sky-600 prose-li:font-medium text-slate-600 dark:text-slate-400"
              dangerouslySetInnerHTML={{
                __html: getCategoryDescriptionHTML(category.name, category.seoText)
              }}
            />
          </section>

          <section className="glass-card mt-8 p-8 md:p-12">
            <div
              className="prose prose-slate dark:prose-invert max-w-none prose-headings:font-black prose-p:font-medium prose-p:leading-relaxed prose-a:text-sky-500 hover:prose-a:text-sky-600 prose-li:font-medium text-slate-600 dark:text-slate-400"
              dangerouslySetInnerHTML={{
                __html: getCategoryFaqHTML(category.name)
              }}
            />
          </section>
        </>
      )}
    </div>
  );
}
