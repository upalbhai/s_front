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
    home: { title: string; description: string; keywords: string; h1?: string };
    trending: { title: string; description: string; h1?: string; shortDescription?: string; keywords?: string };
    new: { title: string; description: string; h1?: string; shortDescription?: string; keywords?: string };
    categories: { title: string; description: string };
    categoryDetail: { titleTemplate: string; descriptionTemplate: string; h1Template: string; keywordsTemplate?: string };
    soundDetail: { titleTemplate?: string; h1Template: string; descriptionTemplate: string; keywordsTemplate?: string };
    search: { titleTemplate: string; descriptionTemplate: string; h1Template: string };
  };
};

const SITES: Record<SiteId, SiteConfig> = {
  soundbuttons: {
    id: 'soundbuttons',
    domains: ['soundbuttonsmax.net', 'www.soundbuttonsmax.net', 'soundbuttonsmax.net', 'www.soundbuttonsmax.net'],
    siteName: 'Sound Buttons Max',
    wordmark: { line1: 'SOUND BUTTONS', accent: 'MAX' },
    siteUrl: 'https://soundbuttonsmax.net',
    logo: '/logo-soundbuttons.png',
    ogImage: '/sites/soundbuttons/og-home.svg',
    themeColor: '#2563eb',
    primaryColor: '#2563eb',
    primaryHoverColor: '#1d4ed8',
    contactEmail: 'contact@soundbuttonsmax.net',
    dmcaEmail: 'dmca@soundbuttonsmax.net',
    twitterHandle: '@soundbuttonsmax',
    meta: {
      home: {
        title: 'Sound Buttons Max: Play Viral Meme Soundboard Unblocked',
        description:
          'Explore thousands of sound buttons, meme soundboard, sound buttons unblocked, prank sounds and viral sound effects for play & download on SoundbuttonsMax.',
        keywords:
          'sound buttons, meme sound buttons, unblocked sound buttons, free soundboard, meme sounds, viral meme sounds, funny meme sounds, sound effects, online soundboard',
        h1: 'Sound Buttons Max: Explore Free Meme Soundboard and Sound Buttons Unblocked',
      },
      trending: {
        title: 'Trending Sound Buttons: Popular Meme Soundboard',
        description: 'Explore trending sound buttons, popular meme soundboard clips, prank sounds, viral effects, sound buttons unblocked, free play & download.',
        h1: 'Trending Sound Buttons: Meme Soundboard',
        shortDescription: 'Daily-updated trending sound buttons and meme soundboard, viral prank sounds, soundboard unblocked and free for instant play.',
        keywords: 'trending sounds, viral soundboard, popular sound effects, trending audio clips, viral meme sounds, popular meme soundboard, popular audio effects, viral sound effects, trending gaming sounds, viral tiktok sounds, trending notification sounds, viral streaming sounds, popular comedy sounds, viral entertainment sounds, trending viral effects, popular social media sounds',
      },
      new: {
        title: 'New Sound Buttons: Latest Meme Soundboard',
        description: 'Discover the latest sound buttons, meme soundboard, prank sounds, viral sound effects and meme buttons free on soundbuttonsmax.',
        h1: 'New Sound Buttons: Meme Soundboard',
        shortDescription: 'Explore newly added sound buttons and meme soundboard collection.',
        keywords: 'new soundboard sounds, latest sound effects, fresh audio clips, new meme sounds, trending soundboard, latest sound buttons, new audio effects, fresh sound effects, new gaming sounds, new notification sounds, new viral sounds, new comedy sounds, new tiktok sounds, new discord sounds, new streaming sounds, new content creation sounds, new social media sounds',
      },
      categories: {
        title: 'Soundboard Categories - Sound Buttons Max',
        description: 'Browse meme soundboard categories. Anime, gaming, TikTok, pranks and more — all free and unblocked.',
      },
      categoryDetail: {
        titleTemplate: '{category name}: Sound Buttons Unblocked',
        descriptionTemplate: 'Explore {category name}, sound buttons, meme soundboard, prank sounds and viral sound effects. Play instantly & download on SoundbuttonsMax.',
        h1Template: '{category name}',
        keywordsTemplate: 'soundboard categories, meme sounds, gaming sound effects, comedy audio, viral sounds, free sound effects, unblocked sound buttons, audio categories, soundboard categories, sound effects library, meme audio, gaming audio, comedy sounds, viral audio, free audio, unblocked audio',
      },
      soundDetail: {
        titleTemplate: '{sound name} - Sound Buttons | SoundbuttonsMax',
        h1Template: '{sound name}',
        descriptionTemplate: 'Play and download the {sound name} sound button instantly! Ideal for memes, pranks, gaming, editing, and sharing fun moments with everyone.',
      },
      search: {
        titleTemplate: '{sound name} Soundboard | Sound Buttons Unblocked',
        descriptionTemplate: 'Play and download {search name} sound effect buttons for free! Instant play, high-quality MP3 downloads. Perfect for memes, TikTok, Discord, and content creation.',
        h1Template: '{sound name} Sound Buttons',
      },
    },
  },
  soundboard: {
    id: 'soundboard',
    domains: ['soundboardmax.net', 'www.soundboardmax.net'],
    siteName: 'SoundboardMax',
    wordmark: { line1: 'SOUNDBOARD', accent: 'MAX' },
    siteUrl: 'https://soundboardmax.net',
    logo: '/sites/soundbuttons/logo.jpeg',
    ogImage: '/sites/soundboard/og-home.svg',
    themeColor: '#e53935',
    primaryColor: '#e53935',
    primaryHoverColor: '#c62828',
    contactEmail: 'soundboardmax.net@gmail.com',
    dmcaEmail: 'dmca@soundboardmax.net',
    twitterHandle: '@soundboardmax',
    meta: {
      home: {
        title: 'SoundboardMax: 100K+ Meme Soundboard Unblocked and Sound Buttons',
        description:
          'Soundboard Max offers instant access to trending sound buttons and meme soundboards. Play and download meme sound effects, prank sounds, and soundboard unblocked',
        keywords:
          'soundboard, meme soundboard, meme soundboard unblocked, unblocked soundboard, sound buttons, meme sounds, viral meme sounds, funny meme sounds, meme sound effects, free soundboard, free sound effects, viral sounds, unblocked sound buttons, audio effects, online soundboard, soundboard online, prank sounds, funny soundboard',
        h1: 'Play Viral Meme Soundboard and Sound Buttons Unblocked',
      },
      trending: {
        title: 'Trending Meme Soundboard: Popular Sound Buttons',
        description: 'Explore trending meme soundboard and the most viral sound buttons used in gaming, streaming and social media. Play or download your favorite meme buttons.',
        h1: 'Trending Sound Buttons: Meme Soundboard',
        shortDescription: 'Check out the latest trending sound buttons and meme soundboard collection.',
        keywords: 'trending sounds, viral soundboard, popular sound effects, trending audio clips, viral meme sounds, popular meme soundboard, popular audio effects, viral sound effects, trending gaming sounds, viral tiktok sounds, trending notification sounds, viral streaming sounds, popular comedy sounds, viral entertainment sounds, trending viral effects, popular social media sounds',
      },
      new: {
        title: 'New Meme Soundboard: Latest Sound Buttons',
        description: 'Discover new soundboard buttons, meme soundboard and sound effects. Play and download the newest soundboard and meme buttons free on SoundboardMax.',
        h1: 'New Sound Buttons: Meme Soundboard',
        shortDescription: 'Explore newly added sound buttons and meme soundboard collection.',
        keywords: 'new soundboard sounds, latest sound effects, fresh audio clips, new meme sounds, trending soundboard, latest sound buttons, new audio effects, fresh sound effects, new gaming sounds, new notification sounds, new viral sounds, new comedy sounds, new tiktok sounds, new discord sounds, new streaming sounds, new content creation sounds, new social media sounds',
      },
      categories: {
        title: 'Soundboard Categories - SoundboardMax',
        description: 'Browse meme soundboard categories. Anime, gaming, TikTok, pranks and more — all free and unblocked.',
      },
      categoryDetail: {
        titleTemplate: '{category name}: Sound Buttons Unblocked',
        descriptionTemplate: 'Discover thousands of {category name} collections with the sound buttons and meme soundboard. Play instantly & download on SoundboardMax.',
        h1Template: '{category name}',
        keywordsTemplate: 'soundboard categories, meme sounds, gaming sound effects, comedy audio, viral sounds, free sound effects, unblocked sound buttons, audio categories, soundboard categories, sound effects library, meme audio, gaming audio, comedy sounds, viral audio, free audio, unblocked audio',
      },
      soundDetail: {
        h1Template: '{sound name} Sound Buttons',
        descriptionTemplate: 'Play and download the {sound name} sound effect button instantly! Ideal for memes, pranks, gaming, editing, and sharing fun moments with everyone.',
      },
      search: {
        titleTemplate: '{sound name} Soundboard | SoundboardMax',
        descriptionTemplate: 'Play and download {search name} sound effect buttons for free! Instant play, high-quality MP3 downloads. Perfect for memes, TikTok, Discord, and content creation.',
        h1Template: '{sound name} Soundboard',
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

export async function getRequestSite(): Promise<SiteConfig> {
  const { cookies, headers } = await import('next/headers');
  const cookieStore = await cookies();
  const siteFromCookie = cookieStore.get('site-id')?.value;

  if (siteFromCookie) {
    const siteConfig = getSiteConfig(siteFromCookie);
    if (siteConfig) return siteConfig;
  }

  const host = (await headers()).get('host') ?? '';
  const siteId = resolveSiteId(host);
  return getSiteConfig(siteId);
}

