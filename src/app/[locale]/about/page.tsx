import { Metadata } from 'next';
import { getRequestSite } from '@/lib/site';
import { buildSeoMetadata } from '@/lib/seo';
import AboutClient from './AboutClient';
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

  let title = translations['about.meta.title'] || 'About {siteName} – Free Meme Soundboards & Sound Buttons';
  let description = translations['about.meta.description'] || 'Learn about {siteName}, the free platform for meme soundboards, sound effects, and audio buttons. Discover our mission to make sounds fun for everyone.';

  title = title.replace(/{siteName}/g, site.siteName);
  description = description.replace(/{siteName}/g, site.siteName);

  return buildSeoMetadata({
    site,
    title,
    description,
    canonicalPath: '/about',
  });
}

export default async function AboutPage() {
  const site = await getRequestSite();
  return <AboutClient siteName={site.siteName} email={site.contactEmail} />;
}
