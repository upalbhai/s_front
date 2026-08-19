import { Metadata } from 'next';
import SchemaScript from '@/components/SchemaScript';
import { getRequestSite } from '@/config/sites';
import { buildSeoMetadata } from '@/lib/seo';
import ContactClient from './ContactClient';
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

  let title = translations['contact.meta.title'] || 'Contact {siteName} – Questions, Feedback & Support';
  let description = translations['contact.meta.description'] || 'Get in touch with the {siteName} team. Send us your questions, feedback, partnership ideas, or support requests.';

  title = title.replace(/{siteName}/g, site.siteName);
  description = description.replace(/{siteName}/g, site.siteName);

  return buildSeoMetadata({
    site,
    title,
    description,
    canonicalPath: '/contact',
    locale,
  });
}

export default async function ContactPage() {
  const site = await getRequestSite();
  
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Contact",
    "url": `${site.siteUrl}/contact`,
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
        "name": "Contact",
        "item": `${site.siteUrl}/contact`
      }
    ]
  };

  return (
    <>
      <SchemaScript schema={schema} />
      <SchemaScript schema={breadcrumbSchema} />
      <ContactClient siteName={site.siteName} email={site.contactEmail} />
    </>
  );
}
