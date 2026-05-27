import { Metadata } from 'next';

const SUPPORTED_LOCALES = ['en', 'es', 'fr', 'pt', 'ru', 'it', 'ja', 'ko', 'de'];

const SITE_NAME = 'Sound Buttons Max';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://soundbuttonsmax.com';
const DEFAULT_IMAGE = `${SITE_URL}/images/og-home.jpg`;

type BuildSeoMetadataArgs = {
  title: string;
  description: string;
  canonicalPath: string;
  image?: string;
  type?: 'website' | 'article' | 'music.song';
};

export function buildSeoMetadata({
  title,
  description,
  canonicalPath,
  image = DEFAULT_IMAGE,
  type = 'website',
}: BuildSeoMetadataArgs): Metadata {
  const canonicalUrl = `${SITE_URL}${canonicalPath === '/' ? '' : canonicalPath}`;

  // Generate hreflang mapping for all supported locales
  const languages: Record<string, string> = {};
  SUPPORTED_LOCALES.forEach((code) => {
    if (code === 'en') {
      languages['en'] = `${SITE_URL}${canonicalPath === '/' ? '' : canonicalPath}`;
    } else {
      languages[code] = `${SITE_URL}/${code}${canonicalPath === '/' ? '' : canonicalPath}`;
    }
  });
  // x-default points to english
  languages['x-default'] = `${SITE_URL}${canonicalPath === '/' ? '' : canonicalPath}`;

  return {
    title,
    description,
    alternates: { 
      canonical: canonicalUrl,
      languages 
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: SITE_NAME,
      type,
      images: [{ url: image }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
  };
}

export function buildNotFoundMetadata(title: string, description: string): Metadata {
  return {
    title,
    description,
    robots: { index: false, follow: true },
  };
}

export { SITE_URL, DEFAULT_IMAGE };
