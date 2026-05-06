import { Metadata } from 'next';

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
  const canonicalUrl = `${SITE_URL}${canonicalPath}`;

  return {
    title,
    description,
    alternates: { canonical: canonicalUrl },
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
