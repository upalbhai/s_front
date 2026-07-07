'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Music, Search, Menu, X, ChevronDown } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useTranslation, useLocalePath } from '@/i18n';
import { useSite } from '@/context/SiteProvider';

const Header = ({ categories = [] }: { categories?: any[] }) => {
  const { t } = useTranslation();
  const lp = useLocalePath();
  const { config } = useSite();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = lp(`/search/${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <>
      <header className={`sticky top-0 z-50 w-full transition-all duration-300 border-b border-slate-200 dark:border-slate-800 ${isScrolled
        ? 'py-3 bg-background/80 backdrop-blur-xl'
        : 'py-5 bg-background/80 md:bg-transparent backdrop-blur-xl md:backdrop-blur-none'
        }`}>
        <div className="container mx-auto px-4 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href={lp('/')} className="flex items-center gap-2 group shrink-0">
            <div className="w-10 h-10 rounded-xl overflow-hidden flex items-center justify-center transition-transform group-hover:scale-110 shadow-xs border border-slate-200/55 dark:border-slate-800/55">
              <img src={config.logo} alt={`${config.siteName} Logo`} className="w-full h-full object-cover" />
            </div>
            <span className="hidden lg:inline text-xl font-black tracking-tighter text-foreground whitespace-nowrap">
              {config.wordmark.line1} <span className="text-primary">{config.wordmark.accent}</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8 font-bold text-sm text-slate-500 dark:text-slate-400">
            <Link href={lp('/')} className="hover:text-foreground transition-colors">{t('nav.home')}</Link>
            <div className="relative group py-2">
              <button className="flex items-center gap-1 hover:text-foreground transition-colors font-bold text-sm text-slate-500 dark:text-slate-400 focus:outline-none">
                {t('common.categories') || 'Categories'}
                <ChevronDown size={14} className="transition-transform group-hover:rotate-180" />
              </button>
              <div className="absolute top-full left-0 mt-1 w-56 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 p-2 z-50">
                <div className="flex flex-col gap-1">
                  {categories.slice(0, 25).map((cat) => (
                    <Link
                      key={cat._id}
                      href={lp(`/categories/${cat.slug}`)}
                      className="px-4 py-2.5 text-sm rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-700 hover:text-black dark:hover:text-white transition-colors"
                    >
                      {cat.name}
                    </Link>
                  ))}
                  {/* <div className="border-t border-slate-100 dark:border-slate-800 my-1"></div>
                  <Link
                    href={lp('/categories')}
                    className="px-4 py-2 text-center text-xs font-bold text-primary hover:bg-primary/5 hover:text-black dark:hover:bg-primary/10 rounded-xl transition-colors block"
                  >
                    View All
                  </Link> */}
                </div>
              </div>
            </div>
            <Link href={lp('/new')} className="hover:text-foreground transition-colors">{t('nav.new')}</Link>
            <Link href={lp('/trending')} className="hover:text-foreground transition-colors">{t('nav.trending')}</Link>
            <Link href="/blogs" className="hover:text-foreground transition-colors">{t('nav.blog')}</Link>
          </nav>

          {/* Search & Actions */}
          <div className="flex items-center gap-3">
            <form onSubmit={handleSearch} className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 w-full max-w-[220px] focus-within:ring-2 focus-within:ring-primary/20 transition-all">
              <Search size={16} className="text-slate-400 shrink-0" />
              <input
                type="text"
                placeholder={t('nav.search_placeholder')}
                className="bg-transparent border-none outline-none text-sm w-full text-foreground placeholder:text-slate-400"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>

            <div className="flex items-center gap-2 border-l border-slate-200 dark:border-slate-800 pl-3">
              <LanguageSwitcher />
              <ThemeToggle />
              <button
                className="lg:hidden p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-foreground transition-colors"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[100] bg-background lg:hidden animate-in fade-in zoom-in-95 duration-200">
          <div className="p-6 flex flex-col h-full">
            <div className="flex items-center justify-between mb-8">
              <Link href={lp('/')} onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-2 group shrink-0">
                <div className="w-10 h-10 rounded-xl overflow-hidden flex items-center justify-center transition-transform group-hover:scale-110 shadow-xs border border-slate-200/55 dark:border-slate-800/55">
                  <img src={config.logo} alt={`${config.siteName} Logo`} className="w-full h-full object-cover" />
                </div>
                <span className="text-xl font-black tracking-tighter text-foreground whitespace-nowrap">
                  {config.wordmark.line1} <span className="text-primary">{config.wordmark.accent}</span>
                </span>
              </Link>
              <button className="p-2" onClick={() => setIsMobileMenuOpen(false)}>
                <X size={28} />
              </button>
            </div>

            <nav className="flex flex-col gap-6 text-2xl font-black tracking-tight">
              <Link href={lp('/')} onClick={() => setIsMobileMenuOpen(false)}>{t('nav.home')}</Link>
              <Link href={lp('/new')} onClick={() => setIsMobileMenuOpen(false)}>{t('nav.new')}</Link>
              <Link href={lp('/trending')} onClick={() => setIsMobileMenuOpen(false)}>{t('nav.trending')}</Link>
              <Link href="/blogs" onClick={() => setIsMobileMenuOpen(false)}>{t('nav.blog')}</Link>

              <div className="mt-4 pt-6 border-t border-slate-200 dark:border-slate-800">
                <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-4">{t('common.categories')}</p>
                <div className="grid grid-cols-2 gap-3">
                  {categories.slice(0, 25).map((cat) => (
                    <Link
                      key={cat._id}
                      href={lp(`/categories/${cat.slug}`)}
                      className="text-sm font-bold p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-center"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {cat.name}
                    </Link>
                  ))}
                  {/* <Link
                    href={lp('/categories')}
                    className="text-sm font-bold p-3 rounded-2xl bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 text-center flex items-center justify-center transition-colors col-span-2 mt-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    View All
                  </Link> */}
                </div>
              </div>
            </nav>

            <div className="mt-auto pt-6 flex items-center justify-center gap-4">
              <LanguageSwitcher />
              <ThemeToggle />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
