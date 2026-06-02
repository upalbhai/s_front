'use client';

import React, { createContext, useContext } from 'react';
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
