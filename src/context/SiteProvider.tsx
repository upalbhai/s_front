'use client';

import React, { createContext, useContext, useEffect } from 'react';
import { getSiteConfig, type SiteConfig, type SiteId } from '@/config/sites';

type SiteContextValue = {
  siteId: SiteId;
  config: SiteConfig;
};

const SiteContext = createContext<SiteContextValue | null>(null);

export function SiteProvider({
  siteId,
  children,
}: {
  siteId: SiteId;
  children: React.ReactNode;
}) {
  const config = getSiteConfig(siteId);

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--primary', config.primaryColor);
    root.style.setProperty('--primary-hover', config.primaryHoverColor);
  }, [config.primaryColor, config.primaryHoverColor]);

  return (
    <SiteContext.Provider value={{ siteId, config }}>
      {children}
    </SiteContext.Provider>
  );
}

export function useSite(): SiteContextValue {
  const ctx = useContext(SiteContext);
  if (!ctx) {
    throw new Error('useSite must be used within SiteProvider');
  }
  return ctx;
}
