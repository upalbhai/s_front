import { Metadata } from 'next';
import { getRequestSite } from '@/lib/site';
import { buildSeoMetadata } from '@/lib/seo';
import PrivacyClient from './PrivacyClient';
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

  let title = translations['privacy.meta.title'] || 'Privacy Policy – {siteName}';
  let description = translations['privacy.meta.description'] || 'Read the {siteName} privacy policy to learn how we collect, use, and protect your personal information when you use our soundboard platform.';

  title = title.replace(/{siteName}/g, site.siteName);
  description = description.replace(/{siteName}/g, site.siteName);

  return buildSeoMetadata({
    site,
    title,
    description,
    canonicalPath: '/privacy',
  });
}

export default async function PrivacyPage() {
  const site = await getRequestSite();
  const domain = site.domains[0] || 'soundboardmax.net';
  return (
    <PrivacyClient
      siteName={site.siteName}
      domain={domain}
      email={site.contactEmail}
    />
  );
}
