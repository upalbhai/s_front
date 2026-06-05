import { Metadata } from 'next';
import { getRequestSite } from '@/lib/site';
import { buildSeoMetadata } from '@/lib/seo';
import { getTranslations } from '@/i18n/server';
import type { Locale } from '@/i18n';
import ContactClient from './ContactClient';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const site = await getRequestSite();
  const t = await getTranslations(site.id, locale as Locale);

  const title = t('contact.meta.title', { siteName: site.siteName }) !== 'contact.meta.title'
    ? t('contact.meta.title', { siteName: site.siteName })
    : `Contact - ${site.siteName} – Questions, Feedback & Support`;

  const description = t('contact.meta.description', { siteName: site.siteName }) !== 'contact.meta.description'
    ? t('contact.meta.description', { siteName: site.siteName })
    : `Get in touch with the ${site.siteName} team. Send us your questions, feedback, partnership ideas, or support requests.`;

  return buildSeoMetadata({
    site,
    title,
    description,
    canonicalPath: '/contact',
  });
}

export default async function ContactPage() {
  return <ContactClient />;
}
