import { cookies, headers } from 'next/headers';
import { getSiteConfig, resolveSiteId, type SiteConfig, type SiteId } from '@/config/sites';

const VALID_SITE_IDS: SiteId[] = ['soundbuttons', 'soundboard'];

export async function getRequestSite(): Promise<SiteConfig> {
  const cookieStore = await cookies();
  const siteFromCookie = cookieStore.get('site-id')?.value;

  if (siteFromCookie && VALID_SITE_IDS.includes(siteFromCookie as SiteId)) {
    return getSiteConfig(siteFromCookie);
  }

  const host = (await headers()).get('host') ?? '';
  return getSiteConfig(resolveSiteId(host));
}
