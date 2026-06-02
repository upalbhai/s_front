import api from '@/services/api';
import CategoryGridSection from '@/components/home/CategoryGridSection';
import { Metadata } from 'next';
import { getRequestSite } from '@/lib/site';
import { buildSeoMetadata } from '@/lib/seo';

export async function generateMetadata(): Promise<Metadata> {
  const site = await getRequestSite();
  return buildSeoMetadata({
    site,
    title: site.meta.categories.title,
    description: site.meta.categories.description,
    canonicalPath: '/categories',
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
