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
import { getRequestSite } from '@/lib/site';
import { buildSeoMetadata } from '@/lib/seo';
import { Toaster } from 'react-hot-toast';

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

  return (
    <html
      lang="en"
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
              <SiteProvider siteId={site.id}>
                <LanguageProvider siteId={site.id}>
                  <AppChrome>{children}</AppChrome>
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
