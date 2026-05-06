"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { FolderOpen, LayoutDashboard, LogOut, Music, Shield, Sparkles } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const userName = 'Admin';

  const isLoginPage = pathname === '/admin/login';
  const activeSection = pathname.startsWith('/admin/sounds')
    ? 'Sounds'
    : pathname.startsWith('/admin/categories')
      ? 'Categories'
      : 'Dashboard';

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem('userInfo');
      window.dispatchEvent(new Event('userInfoChanged'));
    }

    router.push('/admin/login');
    router.refresh();
  };

  if (isLoginPage) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-50 grid place-items-center relative overflow-hidden p-8">
        <div className="absolute left-[-8rem] top-[-6rem] w-[28rem] h-[28rem] rounded-full blur-[80px] opacity-20 pointer-events-none bg-sky-500/30" />
        <div className="absolute right-[-8rem] bottom-[-8rem] w-[28rem] h-[28rem] rounded-full blur-[80px] opacity-20 pointer-events-none bg-indigo-500/20" />
        <div className="relative z-10 w-full max-w-md">{children}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-[280px_1fr] bg-background text-foreground transition-colors duration-300">
      {/* Sidebar */}
      <aside className="sticky top-0 h-screen p-6 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 flex flex-col gap-8 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 grid place-items-center rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-500">
            <Sparkles size={20} />
          </div>
          <div className="min-w-0">
            <div className="text-sm font-black tracking-tight truncate uppercase">Sound Buttons</div>
            <div className="mt-0.5 text-[10px] text-slate-400 uppercase tracking-widest font-black">Control center</div>
          </div>
        </div>

        <nav className="grid gap-1.5">
          {[
            { href: '/admin', icon: LayoutDashboard, label: 'Dashboard', active: pathname === '/admin' },
            { href: '/admin/sounds', icon: Music, label: 'Sounds', active: pathname.startsWith('/admin/sounds') },
            { href: '/admin/categories', icon: FolderOpen, label: 'Categories', active: pathname.startsWith('/admin/categories') },
            { href: '/', icon: Shield, label: 'Open site' },
          ].map((item) => (
            <Link
              key={item.label}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 border ${
                item.active
                  ? 'bg-sky-500 text-white border-sky-600 shadow-md shadow-sky-500/20'
                  : 'text-slate-500 dark:text-slate-400 hover:text-foreground hover:bg-slate-50 dark:hover:bg-slate-800/50 border-transparent hover:border-slate-200 dark:hover:border-slate-800 font-bold'
              }`}
              href={item.href}
            >
              <item.icon size={18} />
              <span className="text-sm">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="mt-auto flex items-center justify-between gap-3 pt-6 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-full grid place-items-center bg-slate-50 dark:bg-slate-800 text-foreground font-black border border-slate-200 dark:border-slate-700">
              {userName.slice(0, 1).toUpperCase()}
            </div>
            <div className="min-w-0">
              <div className="text-sm font-black truncate">{userName}</div>
              <div className="text-[11px] text-slate-400 font-black">{activeSection}</div>
            </div>
          </div>
          <div className="flex gap-2">
            <ThemeToggle />
            <button
              className="w-10 h-10 rounded-xl border border-red-500/20 text-red-500 grid place-items-center transition-all hover:bg-red-500/10 active:scale-95"
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
      <div className="min-w-0 flex flex-col">
        <header className="flex items-center justify-between gap-4 px-8 py-6 bg-white/70 dark:bg-black/50 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 sticky top-0 z-20">
          <div>
            <div className="text-[10px] text-sky-500 uppercase tracking-widest font-black">Management</div>
            <h1 className="mt-1 text-3xl font-black tracking-tighter text-foreground uppercase">{activeSection}</h1>
          </div>
          <div className="hidden sm:block px-5 py-2 rounded-full border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-[10px] font-black uppercase tracking-widest text-slate-400">
            v1.0 Admin
          </div>
        </header>
        <main className="p-8 flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
