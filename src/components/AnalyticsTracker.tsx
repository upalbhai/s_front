'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { useSite } from '@/context/SiteProvider';
import api from '@/services/api';

const generateVisitorId = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

export default function AnalyticsTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { siteId } = useSite();

  useEffect(() => {
    // Determine or generate a unique visitor ID
    let visitorId = localStorage.getItem('visitorId');
    if (!visitorId) {
      visitorId = generateVisitorId();
      localStorage.setItem('visitorId', visitorId);
    }

    // Ignore admin routes
    if (pathname && pathname.includes('/admin')) {
      return;
    }

    const trackVisit = async () => {
      try {
        await api.post('/analytics/track', {
          url: pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : ''),
          referrer: document.referrer || '',
          visitorId,
        });
      } catch (err) {
        console.error('Failed to track analytics:', err);
      }
    };

    trackVisit();
  }, [pathname, searchParams, siteId]);

  return null; // This component doesn't render anything
}
