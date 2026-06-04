import { cookies, headers } from 'next/headers';
import { getSiteConfig, resolveSiteId, type SiteConfig } from '@/config/sites';

export async function getRequestSite(): Promise<SiteConfig> {
  const cookieStore = await cookies();
  const siteFromCookie = cookieStore.get('site-id')?.value;

  if (siteFromCookie) {
    const siteConfig = await getSiteConfig(siteFromCookie);
    if (siteConfig) return siteConfig;
  }

  const host = (await headers()).get('host') ?? '';
  const siteId = await resolveSiteId(host);
  return await getSiteConfig(siteId);
}
