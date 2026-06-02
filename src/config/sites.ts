export type SiteId = 'soundbuttons' | 'soundboard';

export type SiteConfig = {
  id: SiteId;
  domains: string[];
  siteName: string;
  wordmark: { line1: string; accent: string };
  siteUrl: string;
  logo: string;
  ogImage: string;
  themeColor: string;
  primaryColor: string;
  primaryHoverColor: string;
  contactEmail: string;
  dmcaEmail: string;
  twitterHandle: string;
  meta: {
    home: { title: string; description: string; keywords: string };
    trending: { title: string; description: string };
    new: { title: string; description: string };
    categories: { title: string; description: string };
  };
};

const SITES: Record<SiteId, SiteConfig> = {
  soundbuttons: {
    id: 'soundbuttons',
    domains: ['soundbuttonsmax.net', 'www.soundbuttonsmax.net', 'soundbuttonsmax.com', 'www.soundbuttonsmax.com'],
    siteName: 'Sound Buttons Max',
    wordmark: { line1: 'SOUND BUTTONS', accent: 'MAX' },
    siteUrl: 'https://soundbuttonsmax.net',
    logo: '/sites/soundbuttons/logo.jpeg',
    ogImage: '/sites/soundbuttons/og-home.svg',
    themeColor: '#2563eb',
    primaryColor: '#2563eb',
    primaryHoverColor: '#1d4ed8',
    contactEmail: 'contact@soundbuttonsmax.com',
    dmcaEmail: 'dmca@soundbuttonsmax.com',
    twitterHandle: '@soundbuttonsmax',
    meta: {
      home: {
        title: 'Sound Buttons Max: Free Meme Soundboard Unblocked',
        description:
          'Play 100,000+ free meme sound buttons instantly. Vine Boom, Bruh, Goofy Ahh & more. No download, no login. Unblocked on school and work networks.',
        keywords:
          'sound buttons, meme sound buttons, unblocked sound buttons, free soundboard, meme sounds, viral meme sounds, funny meme sounds, sound effects, online soundboard',
      },
      trending: {
        title: 'Trending Sound Buttons - Sound Buttons Max',
        description: 'Play the most trending meme sound buttons online for free. Updated daily with viral clips.',
      },
      new: {
        title: 'New Sound Buttons - Sound Buttons Max',
        description: 'Discover the latest meme sound buttons added daily. Play and download free MP3 clips instantly.',
      },
      categories: {
        title: 'Soundboard Categories - Sound Buttons Max',
        description: 'Browse meme soundboard categories. Anime, gaming, TikTok, pranks and more — all free and unblocked.',
      },
    },
  },
  soundboard: {
    id: 'soundboard',
    domains: ['soundboardmax.net', 'www.soundboardmax.net'],
    siteName: 'SoundboardMax',
    wordmark: { line1: 'SOUNDBOARD', accent: 'MAX' },
    siteUrl: 'https://soundboardmax.net',
    logo: '/sites/soundboard/logo.svg',
    ogImage: '/sites/soundboard/og-home.svg',
    themeColor: '#e53935',
    primaryColor: '#e53935',
    primaryHoverColor: '#c62828',
    contactEmail: 'hello@soundboardmax.net',
    dmcaEmail: 'dmca@soundboardmax.net',
    twitterHandle: '@soundboardmax',
    meta: {
      home: {
        title: 'SoundboardMax: 100K+ Meme Soundboard Unblocked and Sound Buttons',
        description:
          'Explore thousands of meme soundboard including sound buttons, soundboard unblocked, prank sounds, meme buttons, and sound effects on soundboardmax.net.',
        keywords:
          'soundboard, meme soundboard, meme soundboard unblocked, unblocked soundboard, sound buttons, meme sounds, viral meme sounds, funny meme sounds, meme sound effects, free soundboard, free sound effects, viral sounds, unblocked sound buttons, audio effects, online soundboard, soundboard online, prank sounds, funny soundboard',
      },
      trending: {
        title: 'Trending Meme Soundboard - SoundboardMax',
        description: 'Play the most trending meme soundboard clips online for free. Updated daily with viral sounds.',
      },
      new: {
        title: 'New Meme Soundboard Clips - SoundboardMax',
        description: 'Discover the latest meme soundboard additions. Play and download free sound buttons instantly.',
      },
      categories: {
        title: 'Soundboard Categories - SoundboardMax',
        description: 'Browse meme soundboard categories. Anime, gaming, TikTok, pranks and more — all free and unblocked.',
      },
    },
  },
};

export const DEFAULT_SITE_ID: SiteId =
  (process.env.NEXT_PUBLIC_DEFAULT_SITE as SiteId) || 'soundbuttons';

export function normalizeHost(host: string): string {
  return host.split(':')[0].toLowerCase().replace(/^www\./, '');
}

export function resolveSiteId(host: string): SiteId {
  const normalized = normalizeHost(host);

  for (const site of Object.values(SITES)) {
    if (site.domains.some((domain) => normalizeHost(domain) === normalized)) {
      return site.id;
    }
  }

  return DEFAULT_SITE_ID;
}

export function getSiteConfig(siteId: string): SiteConfig {
  if (siteId in SITES) {
    return SITES[siteId as SiteId];
  }
  return SITES[DEFAULT_SITE_ID];
}

export function getAllSites(): SiteConfig[] {
  return Object.values(SITES);
}
