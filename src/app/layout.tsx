import type { Metadata, Viewport } from 'next';
import './globals.css';
import AppChrome from '@/components/AppChrome';
import { ThemeProvider } from '@/components/ThemeProvider';
import { QueryProvider } from '@/components/QueryProvider';
import { AudioProvider } from '@/context/AudioContext';
import { LanguageProvider } from '@/i18n';
import { SiteProvider } from '@/context/SiteProvider';
import { Geist } from 'next/font/google';
import { cn } from '@/lib/utils';
import { getRequestSite } from '@/config/sites';
import { buildSeoMetadata } from '@/lib/seo';
import { Toaster } from 'react-hot-toast';
import { headers } from 'next/headers';
import { getTranslationsRaw } from '@/i18n/server';
import type { Locale } from '@/i18n';

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' });

export async function generateMetadata(): Promise<Metadata> {
  const site = await getRequestSite();

  return buildSeoMetadata({
    site,
    title: site.meta.home.title,
    description: site.meta.home.description,
    canonicalPath: '/',
    keywords: site.meta.home.keywords,
  });
}

export async function generateViewport(): Promise<Viewport> {
  const site = await getRequestSite();

  return {
    themeColor: site.themeColor,
    width: 'device-width',
    initialScale: 1,
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const site = await getRequestSite();

  let categories = [];
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
    const res = await fetch(`${apiUrl}/categories?limit=5`, { next: { revalidate: 3600 } });
    const data = await res.json();
    categories = Array.isArray(data?.categories) ? data.categories : [];
  } catch (err) {
    console.error('Failed to fetch categories:', err);
  }

  const headersList = await headers();
  const initialLocale = (headersList.get('x-locale') as Locale) || 'en';
  const initialTranslations = await getTranslationsRaw(site.id, initialLocale);


  return (
    <html
      lang={initialLocale}
      suppressHydrationWarning
      className={cn('font-sans', geist.variable)}
      data-site={site.id}
      style={
        {
          '--primary': site.primaryColor,
          '--primary-hover': site.primaryHoverColor,
        } as React.CSSProperties
      }
    >
      <head>
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
      </head>
      <body className="antialiased transition-colors duration-300">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <QueryProvider>
            <AudioProvider>
              <SiteProvider siteId={site.id} config={site}>
                <LanguageProvider siteId={site.id} initialLocale={initialLocale} initialTranslations={initialTranslations}>
                  <AppChrome categories={categories}>{children}</AppChrome>
                  <Toaster
                    position="bottom-right"
                    toastOptions={{
                      style: {
                        background: '#333',
                        color: '#fff',
                        borderRadius: '12px',
                      },
                    }}
                  />
                </LanguageProvider>
              </SiteProvider>
            </AudioProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
