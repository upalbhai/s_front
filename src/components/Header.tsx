'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Music, Search, Menu, X, ChevronDown } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    const fetchCategories = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
        const res = await fetch(`${apiUrl}/categories`);
        const data = await res.json();
        setCategories(Array.isArray(data?.categories) ? data.categories : []);
      } catch (err) {
        console.error('Failed to fetch categories:', err);
      }
    };
    window.addEventListener('scroll', handleScroll);
    fetchCategories();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <header className={`sticky top-0 z-50 w-full transition-all duration-300 ${
      isScrolled 
        ? 'py-3 bg-background/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800' 
        : 'py-5 bg-transparent'
    }`}>
      <div className="container mx-auto px-4 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary transition-transform group-hover:scale-110">
            <Music size={24} />
          </div>
          <span className="text-xl font-black tracking-tighter text-foreground whitespace-nowrap">
            SOUND BUTTONS <span className="text-primary">MAX</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-8 font-bold text-sm text-slate-500 dark:text-slate-400">
          <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
          <Link href="/new" className="hover:text-foreground transition-colors">New</Link>
          <Link href="/trending" className="hover:text-foreground transition-colors">Trending</Link>
          
          <div className="relative group">
            <button className="flex items-center gap-1 hover:text-foreground transition-colors">
              Soundboards <ChevronDown size={14} />
            </button>
            <div className="absolute top-full left-0 mt-2 w-56 p-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-200">
              <div className="grid gap-1">
                {categories.slice(0, 10).map((cat) => (
                  <Link 
                    key={cat._id} 
                    href={`/${cat.slug}`}
                    className="px-4 py-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-sm transition-colors"
                  >
                    {cat.name}
                  </Link>
                ))}
                {categories.length === 0 && <p className="p-4 text-[10px] text-center italic text-slate-500">No categories loaded</p>}
              </div>
            </div>
          </div>
          
          <Link href="/blog" className="hover:text-foreground transition-colors">Blog</Link>
        </nav>

        {/* Search & Actions */}
        <div className="flex items-center gap-3">
          <form onSubmit={handleSearch} className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 w-full max-w-[240px] focus-within:ring-2 focus-within:ring-primary/20 transition-all">
            <Search size={16} className="text-slate-400" />
            <input 
              type="text" 
              placeholder="Search sounds..." 
              className="bg-transparent border-none outline-none text-sm w-full text-foreground placeholder:text-slate-400"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>

          <div className="flex items-center gap-2 border-l border-slate-200 dark:border-slate-800 pl-3">
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

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[60] bg-background lg:hidden animate-in fade-in slide-in-from-top duration-300">
          <div className="p-6 flex flex-col h-full">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2">
                <Music size={24} className="text-primary" />
                <span className="text-lg font-black">SOUND BUTTONS</span>
              </div>
              <button className="p-2" onClick={() => setIsMobileMenuOpen(false)}>
                <X size={28} />
              </button>
            </div>

            <nav className="flex flex-col gap-6 text-2xl font-black tracking-tight">
              <Link href="/" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
              <Link href="/new" onClick={() => setIsMobileMenuOpen(false)}>New</Link>
              <Link href="/trending" onClick={() => setIsMobileMenuOpen(false)}>Trending</Link>
              <Link href="/blog" onClick={() => setIsMobileMenuOpen(false)}>Blog</Link>
              
              <div className="mt-4 pt-6 border-t border-slate-200 dark:border-slate-800">
                <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-4">Categories</p>
                <div className="grid grid-cols-2 gap-3">
                  {categories.slice(0, 8).map((cat) => (
                    <Link 
                      key={cat._id} 
                      href={`/${cat.slug}`} 
                      className="text-sm font-bold p-3 rounded-2xl bg-slate-100 dark:bg-slate-800"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              </div>
            </nav>
            
            <div className="mt-auto pt-6 flex justify-center">
               <ThemeToggle />
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
