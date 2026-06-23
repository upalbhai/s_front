import { Metadata } from 'next';
import { getRequestSite } from '@/config/sites';
import { buildSeoMetadata } from '@/lib/seo';
import DMCAClient from './DMCAClient';
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

  let title = translations['dmca.meta.title'] || 'DMCA Policy – {siteName}';
  let description = translations['dmca.meta.description'] || 'Soundboard Max DMCA copyright policy. Learn how to file a copyright infringement notice and our procedures for handling DMCA requests.';

  title = title.replace(/{siteName}/g, site.siteName);
  description = description.replace(/{siteName}/g, site.siteName);

  return buildSeoMetadata({
    site,
    title,
    description,
    canonicalPath: '/dmca',
  });
}

export default async function DMCAPage() {
  const site = await getRequestSite();
  return <DMCAClient siteName={site.siteName} email={site.contactEmail} />;
}
