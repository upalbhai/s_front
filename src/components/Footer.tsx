'use client';

import Link from 'next/link';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { useTranslation, useLocalePath } from '@/i18n';
import { useSite } from '@/context/SiteProvider';

const FALLBACK_CATEGORIES = [
  { _id: 'cat-memes', name: 'Memes', slug: 'memes' },
  { _id: 'cat-gaming', name: 'Gaming', slug: 'gaming' },
  { _id: 'cat-anime', name: 'Anime', slug: 'anime' },
  { _id: 'cat-effects', name: 'Effects', slug: 'effects' },
  { _id: 'cat-meme-sb', name: 'Meme Soundboard', slug: 'meme-soundboard' },
  { _id: 'cat-reaction', name: 'Reaction', slug: 'reaction-soundboard' },
  { _id: 'cat-tiktok', name: 'TikTok', slug: 'tiktok-soundboard' },
  { _id: 'cat-prank', name: 'Pranks', slug: 'prank-soundboard' },
];

const Footer = ({ categories = [] }: { categories?: any[] }) => {
  const { resolvedTheme } = useTheme();
  const { t } = useTranslation();
  const lp = useLocalePath();
  const { config } = useSite();
  const [mounted, setMounted] = useState(false);

  const [cats, setCats] = useState<any[]>(categories);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (categories && categories.length > 0) {
      setCats(categories);
    } else {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || '/api/v1';
      fetch(`${apiUrl}/categories?limit=15`, {
        headers: {
          'x-api-secret': process.env.NEXT_PUBLIC_API_SECRET || 'sb-api-secret-key'
        }
      })
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data?.categories) && data.categories.length > 0) {
            setCats(data.categories);
          } else {
            setCats(FALLBACK_CATEGORIES);
          }
        })
        .catch(() => {
          setCats(FALLBACK_CATEGORIES);
        });
    }
  }, [categories]);

  const displayCategories = cats.length > 0 ? cats : FALLBACK_CATEGORIES;

  const isDark = mounted && resolvedTheme === 'dark';
  const year = new Date().getFullYear().toString();

  const quickLinks = [
    { key: 'footer.link_home', href: '/' },
    { key: 'footer.link_new', href: '/new' },
    { key: 'footer.link_trending', href: '/trending' },
    { key: 'footer.link_blog', href: '/blogs' },
    { key: 'footer.link_about', href: '/about' },
    { key: 'footer.link_contact', href: '/contact' },
  ];

  const legalLinks = [
    { key: 'footer.privacy', href: '/privacy' },
    { key: 'footer.terms', href: '/terms' },
    { key: 'footer.dmca', href: '/dmca' },
    { key: 'footer.disclaimer', href: '/disclaimer' },
  ];

  return (
    <footer className={`mt-16 border-t pt-20 pb-10 transition-all duration-300 ${isDark
      ? 'bg-zinc-950 border-zinc-800'
      : 'bg-white border-zinc-200'
      }`}>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Column */}
          <div className="space-y-6">
            <h2 className={`text-2xl font-black tracking-tighter ${isDark ? 'text-white' : 'text-zinc-900'}`}>
              {config.wordmark.line1} <span className="text-primary">{config.wordmark.accent}</span>
            </h2>
            <p className={`font-medium leading-relaxed transition-all duration-300 ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
              {t('footer.tagline')}
            </p>
            <div className={`space-y-2 text-sm font-bold transition-all duration-300 ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
              <p>{config.contactEmail}</p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className={`text-lg font-black tracking-tight mb-6 ${isDark ? 'text-white' : 'text-zinc-900'}`}>
              {t('footer.quick_links')}
            </h3>
            <ul className={`space-y-4 font-bold transition-all duration-300 ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
              {quickLinks.map((link) => (
                <li key={link.key}>
                  <Link href={link.href === '/blogs' ? '/blogs' : lp(link.href)} className="hover:text-primary transition-colors">{t(link.key)}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className={`text-lg font-black tracking-tight mb-6 ${isDark ? 'text-white' : 'text-zinc-900'}`}>
              {t('footer.categories')}
            </h3>
            <ul className={`space-y-4 font-bold transition-all duration-300 ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
              {displayCategories.map(cat => (
                <li key={cat._id || cat.slug}>
                  <Link href={lp(`/categories/${cat.slug}`)} className="hover:text-primary transition-colors">{cat.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-6">
            <h3 className={`text-lg font-black tracking-tight mb-6 ${isDark ? 'text-white' : 'text-zinc-900'}`}>
              Contact
            </h3>
            <div className={`space-y-3 font-bold transition-all duration-300 ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
              <p>1555 Doctors Drive, El Segundo, CA 90245</p>
              <p>310-364-1511</p>
              <p>
                <a href={`mailto:${config.contactEmail}`} className="hover:text-primary transition-colors">
                  {config.contactEmail}
                </a>
              </p>
            </div>
          </div>
        </div>

        <div className={`pt-10 border-t flex flex-col md:flex-row justify-between items-center gap-6 ${isDark ? 'border-zinc-800' : 'border-zinc-200'}`}>
          <p className={`text-sm font-bold transition-all duration-300 ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
            {t('footer.copyright').replace('{year}', year)}
          </p>
          <div className={`flex flex-wrap justify-center gap-6 text-sm font-bold transition-all duration-300 ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
            {legalLinks.map((link) => (
              <Link
                key={link.key}
                href={lp(link.href)}
                className="hover:text-primary transition-colors"
              >
                {t(link.key)}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
