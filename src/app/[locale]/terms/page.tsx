import { Metadata } from 'next';
import { getRequestSite } from '@/lib/site';
import { buildSeoMetadata } from '@/lib/seo';
import TermsClient from './TermsClient';
import { SiteId } from '@/config/sites';

async function getTranslations(siteId: SiteId, locale: string) {
  try {
    const mod = await import(`@/i18n/locales/${siteId}/${locale}.json`);
    return mod.default || mod;
  } catch {
    try {
      const mod = await import(`@/i18n/locales/${siteId}/en.json`);
      return mod.default || mod;
    } catch {
      return {};
    }
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const site = await getRequestSite();
  const translations = await getTranslations(site.id, locale);

  let title = translations['terms.meta.title'] || 'Terms and Conditions – {siteName}';
  let description = translations['terms.meta.description'] || 'Read the terms and conditions for using {siteName}. Understand your rights and responsibilities when using our free meme soundboard platform.';

  title = title.replace(/{siteName}/g, site.siteName);
  description = description.replace(/{siteName}/g, site.siteName);

  return buildSeoMetadata({
    site,
    title,
    description,
    canonicalPath: '/terms',
  });
}

export default async function TermsPage() {
  const site = await getRequestSite();
  return <TermsClient siteName={site.siteName} email={site.contactEmail} />;
}
