import { Metadata } from 'next';
import type { SiteConfig } from '@/config/sites';

const SUPPORTED_LOCALES = ['en', 'es', 'fr', 'pt', 'ru', 'it', 'ja', 'ko', 'de'];

type BuildSeoMetadataArgs = {
  site: SiteConfig;
  title: string;
  description: string;
  canonicalPath: string;
  image?: string;
  type?: 'website' | 'article' | 'music.song';
  keywords?: string;
  publishedTime?: string;
  modifiedTime?: string;
  authorName?: string;
  tags?: string[];
  audioUrl?: string;
};

export function buildSeoMetadata({
  site,
  title,
  description,
  canonicalPath,
  image,
  type = 'website',
  keywords,
  publishedTime,
  modifiedTime,
  authorName,
  tags,
  audioUrl,
}: BuildSeoMetadataArgs): Metadata {
  const siteUrl = site.siteUrl;
  const ogImage = image ?? `${siteUrl}${site.ogImage}`;
  const canonicalUrl = `${siteUrl}${canonicalPath === '/' ? '' : canonicalPath}`;

  const languages: Record<string, string> = {};
  SUPPORTED_LOCALES.forEach((code) => {
    if (code === 'en') {
      languages['en'] = `${siteUrl}${canonicalPath === '/' ? '' : canonicalPath}`;
    } else {
      languages[code] = `${siteUrl}/${code}${canonicalPath === '/' ? '' : canonicalPath}`;
    }
  });
  languages['x-default'] = `${siteUrl}${canonicalPath === '/' ? '' : canonicalPath}`;

  return {
    title,
    description,
    ...(keywords ? { keywords } : {}),
    alternates: {
      canonical: canonicalUrl,
      languages,
    },
    authors: [{ name: site.siteName }],
    publisher: site.siteName,
    creator: site.siteName,
    generator: site.siteName,
    applicationName: site.siteName,
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    formatDetection: { telephone: false },
    appleWebApp: {
      capable: true,
      title,
      statusBarStyle: 'default',
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: site.siteName,
      type,
      locale: 'en_US',
      images: [{ url: ogImage, alt: title, width: 1200, height: 630 }],
      ...(type === 'article' ? {
        publishedTime,
        modifiedTime,
        authors: authorName ? [authorName] : undefined,
        tags,
      } : {}),
      ...(type === 'music.song' && audioUrl ? {
        audio: [{ url: audioUrl, secureUrl: audioUrl, type: 'audio/mpeg' }]
      } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      site: site.twitterHandle,
      creator: site.twitterHandle,
      title,
      description,
      images: [{ url: ogImage, alt: title, width: 1200, height: 630 }],
    },
    other: {
      'msapplication-TileColor': site.themeColor,
      'msapplication-config': '/browserconfig.xml',
      HandheldFriendly: 'true',
      MobileOptimized: 'width',
      'mobile-web-app-capable': 'yes',
      copyright: `© ${new Date().getFullYear()} ${site.siteName}`,
      language: 'en',
      distribution: 'global',
      coverage: 'worldwide',
      target: 'all',
    },
  };
}

export function buildPageMetadata(args: BuildSeoMetadataArgs): Metadata {
  return buildSeoMetadata(args);
}

export function buildNotFoundMetadata(title: string, description: string): Metadata {
  return {
    title,
    description,
    robots: { index: false, follow: true },
  };
}

export function getSiteOgImage(site: SiteConfig, path?: string): string {
  if (path) {
    return `${site.siteUrl}${path}`;
  }
  return `${site.siteUrl}${site.ogImage}`;
}
