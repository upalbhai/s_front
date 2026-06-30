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

export default async function CategoriesPage() {
  let categories = [];
  try {
    const res = await api.get('/categories');
    categories = res.data.categories || [];
  } catch (error) {
    console.error('Error fetching categories:', error);
  }

  return (
    <div className="py-16">
      <CategoryGridSection categories={categories} />
    </div>
  );
}
