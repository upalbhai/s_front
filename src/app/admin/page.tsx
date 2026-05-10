'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import api from '@/services/api';
import { ArrowRight, FolderOpen, Music, Plus, RefreshCw } from 'lucide-react';
import { AdminCategory, AdminSound, getSoundCategoryName } from './admin-types';
import { useAdminSession } from './useAdminSession';
import { useTheme } from 'next-themes';

export default function AdminHomePage() {
  const { ready } = useAdminSession();
  const [sounds, setSounds] = useState<AdminSound[]>([]);
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!ready) {
      return;
    }

    const loadOverview = async () => {
      try {
        setLoading(true);
        const [soundsResponse, categoriesResponse] = await Promise.all([
          api.get('/sounds?limit=6&admin=true'),
          api.get('/categories?limit=6&admin=true'),
        ]);

        setSounds(Array.isArray(soundsResponse.data.sounds) ? soundsResponse.data.sounds : []);
        setCategories(Array.isArray(categoriesResponse.data.categories) ? categoriesResponse.data.categories : []);
      } catch (error) {
        console.error('Failed to load admin overview', error);
      } finally {
        setLoading(false);
      }
    };

    void loadOverview();
  }, [ready]);

  const isDark = mounted && resolvedTheme === 'dark';
  const liveSounds = sounds.filter((sound) => sound.isPublished !== false).length;

  if (!ready) {
    return (
      <div className={`flex items-center justify-center min-h-[400px] font-bold animate-pulse ${
        isDark ? 'text-zinc-500' : 'text-zinc-400'
      }`}>
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Hero Section */}
      <section className={`p-8 rounded-3xl border transition-all duration-300 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 ${
        isDark 
          ? 'border-zinc-800 bg-zinc-900/40 shadow-none' 
          : 'border-zinc-200 bg-white shadow-xl shadow-zinc-200/40'
      }`}>
        <div className="max-w-2xl">
          <p className="text-[10px] text-sky-500 font-bold uppercase tracking-widest mb-2">Overview</p>
          <h2 className="text-3xl md:text-4xl font-black tracking-tight text-foreground mb-3">Minimal admin, proper routing.</h2>
          <p className={`leading-relaxed font-medium ${
            isDark ? 'text-zinc-400' : 'text-zinc-500'
          }`}>
            Each admin task now has its own route, so the workspace stays small, the URLs stay meaningful, and the UI stays easy to scan.
          </p>
        </div>

        <div className="flex gap-3 w-full md:w-auto">
          <Link 
            href="/admin/sounds/new" 
            className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all active:scale-95 shadow-lg ${
              isDark 
                ? 'bg-white text-zinc-950 hover:bg-zinc-100 shadow-white/5' 
                : 'bg-zinc-950 text-white hover:bg-zinc-900 shadow-zinc-950/10'
            }`}
          >
            <Plus size={16} />
            <span>Add sound</span>
          </Link>
          <button 
            type="button" 
            onClick={() => window.location.reload()}
            className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-4 rounded-2xl border font-black text-xs uppercase tracking-widest transition-all active:scale-95 ${
              isDark 
                ? 'border-zinc-800 bg-zinc-900 text-white hover:bg-zinc-800' 
                : 'border-zinc-200 bg-white text-zinc-900 hover:bg-zinc-50 shadow-sm'
            }`} 
          >
            <RefreshCw size={14} />
            <span>Refresh</span>
          </button>
        </div>
      </section>

      {/* Metrics Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { icon: Music, label: 'Sounds', value: sounds.length, color: 'text-sky-500', bg: 'bg-sky-500/10' },
          { icon: FolderOpen, label: 'Categories', value: categories.length, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
          { icon: ArrowRight, label: 'Live sounds', value: liveSounds, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
        ].map((metric) => (
          <article 
            key={metric.label} 
            className={`p-6 rounded-3xl border transition-colors duration-300 flex items-center gap-5 ${
              isDark 
                ? 'border-zinc-800 bg-zinc-900/40' 
                : 'border-zinc-200 bg-white shadow-sm'
            }`}
          >
            <div className={`w-12 h-12 rounded-2xl ${metric.bg} ${metric.color} flex items-center justify-center`}>
              <metric.icon size={22} />
            </div>
            <div>
              <p className={`text-[10px] font-black uppercase tracking-widest ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>{metric.label}</p>
              <strong className="text-3xl font-black tracking-tight text-foreground block mt-1">
                {loading ? '...' : metric.value}
              </strong>
            </div>
          </article>
        ))}
      </section>

      {/* Preview Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Sounds */}
        <div className={`p-8 rounded-3xl border flex flex-col h-full transition-colors duration-300 ${
          isDark 
            ? 'border-zinc-800 bg-zinc-900/40' 
            : 'border-zinc-200 bg-white shadow-sm'
        }`}>
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="text-[10px] text-sky-500 font-bold uppercase tracking-widest mb-1">Recent sounds</p>
              <h3 className="text-xl font-black tracking-tight text-foreground">Latest entries</h3>
            </div>
            <Link href="/admin/sounds" className="text-xs font-black uppercase tracking-wider text-sky-500 hover:underline">
              View all
            </Link>
          </div>

          <div className="space-y-3 flex-1">
            {sounds.length > 0 ? (
              sounds.map((sound) => (
                <div 
                  key={sound._id} 
                  className={`p-4 rounded-2xl border flex items-center justify-between group hover:border-sky-500/30 transition-all ${
                    isDark 
                      ? 'border-zinc-800/50 bg-zinc-950/40' 
                      : 'border-zinc-100 bg-zinc-50/50'
                  }`}
                >
                  <div className="min-w-0">
                    <strong className="block font-black text-sm text-foreground truncate">{sound.title}</strong>
                    <span className={`text-[11px] font-black uppercase tracking-wider mt-0.5 block ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>
                      {getSoundCategoryName(sound)}
                    </span>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                    sound.isPublished !== false 
                      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' 
                      : 'bg-zinc-500/10 text-zinc-500 border-zinc-500/20'
                  }`}>
                    {sound.isPublished !== false ? 'Live' : 'Draft'}
                  </span>
                </div>
              ))
            ) : (
              <p className="py-8 text-center text-slate-500 font-medium italic">No sounds yet.</p>
            )}
          </div>
        </div>

        {/* Shortcuts */}
        <div className={`p-8 rounded-3xl border flex flex-col transition-colors duration-300 ${
          isDark 
            ? 'border-zinc-800 bg-zinc-900/40' 
            : 'border-zinc-200 bg-white shadow-sm'
        }`}>
          <div className="mb-8">
            <p className="text-[10px] text-sky-500 font-bold uppercase tracking-widest mb-1">Shortcuts</p>
            <h3 className="text-xl font-black tracking-tight text-foreground">Open a route</h3>
          </div>

          <div className="grid gap-3 flex-1">
            {[
              { href: '/admin/sounds', label: 'Manage sounds' },
              { href: '/admin/sounds/new', label: 'Create a sound' },
              { href: '/admin/categories', label: 'Review categories' },
            ].map((shortcut) => (
              <Link 
                key={shortcut.label}
                href={shortcut.href} 
                className={`flex items-center justify-between p-5 rounded-2xl border group hover:border-sky-500/30 transition-all ${
                  isDark 
                    ? 'border-zinc-800/50 bg-zinc-950/40 hover:bg-zinc-950/80' 
                    : 'border-zinc-100 bg-zinc-50/50 hover:bg-zinc-100/50'
                }`}
              >
                <span className="text-sm font-black text-foreground group-hover:text-sky-500 transition-colors">{shortcut.label}</span>
                <ArrowRight size={16} className="text-slate-400 group-hover:text-sky-500 group-hover:translate-x-1 transition-all" />
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
