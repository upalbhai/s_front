"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { FolderOpen, LayoutDashboard, LogOut, Menu, Music, Shield, Sparkles, X, RefreshCcw } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { AppSidebar } from '@/components/ui/app-sidebar';
import { SidebarProvider, SidebarTrigger, SidebarInset } from '@/components/ui/sidebar';
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
  const [generatingSitemap, setGeneratingSitemap] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // any route change logic if needed
  }, [pathname]);

  const isDark = mounted && resolvedTheme === 'dark';
  const userName = 'Admin';

  const isLoginPage = pathname === '/admin/login';
  const activeSection = pathname.startsWith('/admin/sounds')
    ? 'Sounds'
    : pathname.startsWith('/admin/categories')
      ? 'Categories'
      : pathname.startsWith('/admin/blogs')
        ? 'Blogs'
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
      <div className={`min-h-screen grid place-items-center relative overflow-hidden p-8 transition-colors duration-300 ${isDark ? 'bg-zinc-950 text-zinc-100' : 'bg-zinc-50 text-zinc-900'
        }`}>
        <div className="absolute left-[-8rem] top-[-6rem] w-[28rem] h-[28rem] rounded-full blur-[80px] opacity-20 pointer-events-none bg-zinc-500/30 dark:bg-zinc-400/10" />
        <div className="absolute right-[-8rem] bottom-[-8rem] w-[28rem] h-[28rem] rounded-full blur-[80px] opacity-20 pointer-events-none bg-zinc-500/20 dark:bg-zinc-400/5" />
        <div className="relative z-10 w-full max-w-md">{children}</div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className={`min-h-screen flex w-full transition-colors duration-300 ${isDark ? 'bg-zinc-950 text-zinc-100' : 'bg-zinc-50 text-zinc-900'
        }`}>
        {/* Shadcn Sidebar Component */}
        <AppSidebar
          onLogout={handleLogout}
          onGenerateSitemap={handleGenerateSitemap}
          generatingSitemap={generatingSitemap}
        />

        {/* Main Content */}
        <SidebarInset className="min-w-0 flex-1 flex flex-col min-h-screen bg-transparent border-none m-0 shadow-none">
          <header className={`flex items-center justify-between gap-4 px-4 sm:px-8 py-6 border-b sticky top-0 z-30 backdrop-blur-md transition-colors duration-300 ${isDark
            ? 'bg-zinc-950/70 border-zinc-800 text-white'
            : 'bg-white/70 border-zinc-200 text-zinc-900 shadow-sm'
            }`}>
            <div className="flex items-center gap-3 min-w-0">
              <SidebarTrigger
                className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-all shrink-0 ${isDark
                  ? 'border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-white'
                  : 'border-zinc-200 bg-zinc-50 text-zinc-500 hover:text-zinc-900'
                  }`}
              />
              <div className="min-w-0">
                <div className={`text-[10px] uppercase tracking-widest font-black ${isDark ? 'text-zinc-500' : 'text-zinc-400'
                  }`}>Management</div>
                <h1 className="mt-1 text-2xl sm:text-3xl font-black tracking-tighter text-foreground uppercase truncate">{activeSection}</h1>
              </div>
            </div>
            {/* <div className={`hidden sm:block px-5 py-2 rounded-full border text-[10px] font-black uppercase tracking-widest transition-colors duration-300 ${isDark ? 'border-zinc-800 bg-zinc-900/50 text-zinc-500' : 'border-zinc-200 bg-zinc-100 text-zinc-400'
              }`}>
              v1.0 Admin
            </div> */}
            <ThemeToggle />
          </header>
          <main className="p-4 sm:p-8 flex-1 overflow-y-auto w-full">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
