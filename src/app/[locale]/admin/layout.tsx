"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { FolderOpen, LayoutDashboard, LogOut, Menu, Music, Shield, Sparkles, X, RefreshCcw } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useTheme } from 'next-themes';
import { useState, useEffect } from 'react';
import api from '@/services/api';
import { toast } from 'react-hot-toast';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [generatingSitemap, setGeneratingSitemap] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  const isDark = mounted && resolvedTheme === 'dark';
  const userName = 'Admin';

  const isLoginPage = pathname === '/admin/login';
  const activeSection = pathname.startsWith('/admin/sounds')
    ? 'Sounds'
    : pathname.startsWith('/admin/categories')
      ? 'Categories'
      : pathname.startsWith('/admin/sites')
        ? 'Sites'
        : 'Dashboard';

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem('userInfo');
      window.dispatchEvent(new Event('userInfoChanged'));
    }

    router.push('/admin/login');
    router.refresh();
  };

  const handleGenerateSitemap = async () => {
    try {
      setGeneratingSitemap(true);
      await api.post('/sitemaps/generate');
      toast.success('Sitemap generation triggered successfully!');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Error triggering sitemap generation');
    } finally {
      setGeneratingSitemap(false);
    }
  };

  if (isLoginPage) {
    return (
      <div className={`min-h-screen grid place-items-center relative overflow-hidden p-8 transition-colors duration-300 ${
        isDark ? 'bg-zinc-950 text-zinc-100' : 'bg-zinc-50 text-zinc-900'
      }`}>
        <div className="absolute left-[-8rem] top-[-6rem] w-[28rem] h-[28rem] rounded-full blur-[80px] opacity-20 pointer-events-none bg-zinc-500/30 dark:bg-zinc-400/10" />
        <div className="absolute right-[-8rem] bottom-[-8rem] w-[28rem] h-[28rem] rounded-full blur-[80px] opacity-20 pointer-events-none bg-zinc-500/20 dark:bg-zinc-400/5" />
        <div className="relative z-10 w-full max-w-md">{children}</div>
      </div>
    );
  }

  const sidebarClassName = `fixed lg:sticky top-0 left-0 z-50 lg:z-auto h-screen w-[280px] max-w-[85vw] shrink-0 p-6 border-r flex flex-col gap-8 shadow-sm transition-all duration-300 ${
    sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
  } ${
    isDark
      ? 'border-zinc-800 bg-zinc-950 text-white'
      : 'border-zinc-200 bg-white text-zinc-900'
  }`;

  return (
    <div className={`min-h-screen flex transition-colors duration-300 ${
      isDark ? 'bg-zinc-950 text-zinc-100' : 'bg-zinc-50 text-zinc-900'
    }`}>
      {/* Mobile backdrop */}
      <div
        aria-hidden={!sidebarOpen}
        className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          sidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar */}
      <aside className={sidebarClassName}>
        <div className="flex items-center justify-between gap-3 lg:hidden">
          <div className="flex items-center gap-4 min-w-0">
            <div className={`w-10 h-10 grid place-items-center rounded-xl border transition-colors duration-300 ${
              isDark ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-zinc-100 border-zinc-200 text-black'
            }`}>
              <Sparkles size={18} />
            </div>
            <div className="min-w-0">
              <div className="text-sm font-black tracking-tight truncate uppercase">Sound Buttons</div>
              <div className={`mt-0.5 text-[10px] uppercase tracking-widest font-black ${
                isDark ? 'text-zinc-500' : 'text-zinc-400'
              }`}>Control center</div>
            </div>
          </div>
          <button
            className={`w-10 h-10 rounded-xl border grid place-items-center transition-all shrink-0 ${
              isDark
                ? 'border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-white'
                : 'border-zinc-200 bg-zinc-50 text-zinc-500 hover:text-zinc-900'
            }`}
            onClick={() => setSidebarOpen(false)}
            type="button"
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        </div>
        <div className="hidden lg:flex items-center gap-4">
          <div className={`w-10 h-10 grid place-items-center rounded-xl border transition-colors duration-300 ${
            isDark ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-zinc-100 border-zinc-200 text-black'
          }`}>
            <Sparkles size={18} />
          </div>
          <div className="min-w-0">
            <div className="text-sm font-black tracking-tight truncate uppercase">Sound Buttons</div>
            <div className={`mt-0.5 text-[10px] uppercase tracking-widest font-black ${
              isDark ? 'text-zinc-500' : 'text-zinc-400'
            }`}>Control center</div>
          </div>
        </div>

        <nav className="grid gap-1.5">
          {[
            { href: '/admin', icon: LayoutDashboard, label: 'Dashboard', active: pathname === '/admin' },
            { href: '/admin/sounds', icon: Music, label: 'Sounds', active: pathname.startsWith('/admin/sounds') },
            { href: '/admin/categories', icon: FolderOpen, label: 'Categories', active: pathname.startsWith('/admin/categories') },
            { href: '/admin/sites', icon: Sparkles, label: 'Sites', active: pathname.startsWith('/admin/sites') },
            { href: '/', icon: Shield, label: 'Open site' },
          ].map((item) => {
            const activeStyle = isDark
              ? 'bg-white text-zinc-950 border-white shadow-md shadow-white/5 font-black'
              : 'bg-black text-white border-zinc-900 shadow-md shadow-black/10 font-black';

            const inactiveStyle = isDark
              ? 'text-zinc-400 hover:text-white hover:bg-zinc-900 border-transparent font-bold'
              : 'text-zinc-600 hover:text-black hover:bg-zinc-100 border-transparent font-bold';

            return (
              <Link
                key={item.label}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 border ${
                  item.active ? activeStyle : inactiveStyle
                }`}
                href={item.href}
              >
                <item.icon size={18} />
                <span className="text-sm">{item.label}</span>
              </Link>
            );
          })}
          
          <button
            onClick={handleGenerateSitemap}
            disabled={generatingSitemap}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 border text-left mt-2 ${
              isDark
                ? 'text-zinc-400 hover:text-white hover:bg-zinc-900 border-transparent font-bold'
                : 'text-zinc-600 hover:text-black hover:bg-zinc-100 border-transparent font-bold'
            } ${generatingSitemap ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <RefreshCcw size={18} className={generatingSitemap ? 'animate-spin' : ''} />
            <span className="text-sm">{generatingSitemap ? 'Generating Sitemaps...' : 'Generate Sitemaps'}</span>
          </button>
        </nav>

        <div className={`mt-auto flex items-center justify-between gap-3 pt-6 border-t ${
          isDark ? 'border-zinc-800' : 'border-zinc-100'
        }`}>
          <div className="flex items-center gap-3 min-w-0">
            <div className={`w-10 h-10 rounded-full grid place-items-center font-black border transition-colors duration-300 ${
              isDark ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-zinc-100 border-zinc-200 text-zinc-900'
            }`}>
              {userName.slice(0, 1).toUpperCase()}
            </div>
            <div className="min-w-0">
              <div className="text-sm font-black truncate">{userName}</div>
              <div className={`text-[11px] font-black ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>{activeSection}</div>
            </div>
          </div>
          <div className="flex gap-2">
            <ThemeToggle />
            <button
              className={`w-10 h-10 rounded-xl border grid place-items-center transition-all hover:bg-red-500/10 active:scale-95 ${
                isDark ? 'border-red-500/30 text-red-400' : 'border-red-500/20 text-red-500'
              }`}
              onClick={handleLogout}
              title="Logout"
              type="button"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="min-w-0 flex-1 flex flex-col min-h-screen">
        <header className={`flex items-center justify-between gap-4 px-4 sm:px-8 py-6 border-b sticky top-0 z-30 backdrop-blur-md transition-colors duration-300 ${
          isDark 
            ? 'bg-zinc-950/70 border-zinc-800 text-white' 
            : 'bg-white/70 border-zinc-200 text-zinc-900 shadow-sm'
        }`}>
          <div className="flex items-center gap-3 min-w-0">
            <button
              className={`lg:hidden w-10 h-10 rounded-xl border grid place-items-center transition-all shrink-0 ${
                isDark
                  ? 'border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-white'
                  : 'border-zinc-200 bg-zinc-50 text-zinc-500 hover:text-zinc-900'
              }`}
              onClick={() => setSidebarOpen(true)}
              type="button"
              aria-label="Open menu"
            >
              <Menu size={18} />
            </button>
            <div className="min-w-0">
              <div className={`text-[10px] uppercase tracking-widest font-black ${
                isDark ? 'text-zinc-500' : 'text-zinc-400'
              }`}>Management</div>
              <h1 className="mt-1 text-2xl sm:text-3xl font-black tracking-tighter text-foreground uppercase truncate">{activeSection}</h1>
            </div>
          </div>
          <div className={`hidden sm:block px-5 py-2 rounded-full border text-[10px] font-black uppercase tracking-widest transition-colors duration-300 ${
            isDark ? 'border-zinc-800 bg-zinc-900/50 text-zinc-500' : 'border-zinc-200 bg-zinc-100 text-zinc-400'
          }`}>
            v1.0 Admin
          </div>
        </header>
        <main className="p-4 sm:p-8 flex-1 overflow-y-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
