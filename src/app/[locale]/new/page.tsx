import { Metadata } from 'next';
import NewClient from './NewClient';
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
    title: t('meta.new.title') !== 'meta.new.title' ? t('meta.new.title') : site.meta.new.title,
    description: t('meta.new.description') !== 'meta.new.description' ? t('meta.new.description') : site.meta.new.description,
    keywords: t('meta.new.keywords') !== 'meta.new.keywords' ? t('meta.new.keywords') : site.meta.new.keywords,
    canonicalPath: '/new',
    image: `${site.siteUrl}/new/opengraph-image.png`,
  });
}

export default async function NewSoundsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const site = await getRequestSite();
  const t = await getTranslations(site.id, locale as Locale);

  const h1Title = t('meta.new.h1') !== 'meta.new.h1' 
    ? t('meta.new.h1') 
    : (site.meta.new.h1 || site.meta.new.title);

  const shortDesc = t('meta.new.shortDescription') !== 'meta.new.shortDescription'
    ? t('meta.new.shortDescription')
    : site.meta.new.shortDescription;

  return <NewClient h1Title={h1Title} shortDescription={shortDesc} />;
}
