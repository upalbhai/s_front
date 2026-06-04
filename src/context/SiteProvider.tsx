'use client';

import React, { createContext, useContext } from 'react';
import { getSiteConfig, type SiteConfig } from '@/config/sites';

type SiteContextValue = {
  siteId: string;
  config: SiteConfig;
};

const SiteContext = createContext<SiteContextValue | null>(null);

export function SiteProvider({
  siteId,
  config,
  children,
}: {
  siteId: string;
  config: SiteConfig;
  children: React.ReactNode;
}) {
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
