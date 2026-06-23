import { Metadata } from 'next';
import { getRequestSite } from '@/lib/site';
import { buildSeoMetadata } from '@/lib/seo';
import DisclaimerClient from './DisclaimerClient';
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

  let title = translations['disclaimer.meta.title'] || 'Disclaimer – {siteName}';
  let description = translations['disclaimer.meta.description'] || 'Read {siteName}’s disclaimer regarding the use of our website, sound content, and services. Understand limitations of liability and user responsibilities.';

  title = title.replace(/{siteName}/g, site.siteName);
  description = description.replace(/{siteName}/g, site.siteName);

  return buildSeoMetadata({
    site,
    title,
    description,
    canonicalPath: '/disclaimer',
  });
}

export default async function DisclaimerPage() {
  const site = await getRequestSite();
  const domain = site.domains[0] || 'soundboardmax.net';
  return (
    <DisclaimerClient
      siteName={site.siteName}
      domain={domain}
      email={site.contactEmail}
    />
  );
}
