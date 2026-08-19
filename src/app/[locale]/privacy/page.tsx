import { Metadata } from 'next';
import SchemaScript from '@/components/SchemaScript';
import { getRequestSite } from '@/config/sites';
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
    locale,
  });
}

export default async function PrivacyPage() {
  const site = await getRequestSite();
  const domain = site.domains[0];
  
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Privacy",
    "url": `${site.siteUrl}/privacy`,
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
        "name": "Privacy",
        "item": `${site.siteUrl}/privacy`
      }
    ]
  };

  return (
    <>
      <SchemaScript schema={schema} />
      <SchemaScript schema={breadcrumbSchema} />
      (
    <PrivacyClient
      siteName={site.siteName}
      domain={domain}
      email={site.contactEmail}
    />
  )
    </>
  );
}
