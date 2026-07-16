'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import api from '@/services/api';
import {
  ArrowRight,
  FolderOpen,
  Music,
  Plus,
  RefreshCw,
  Eye,
  BarChart3,
  ArrowUpDown,
  TrendingUp,
  ChevronUp,
  ChevronDown,
} from 'lucide-react';
import { AdminCategory, AdminSound, getSoundCategoryName } from './admin-types';
import { useAdminSession } from './useAdminSession';
import { useTheme } from 'next-themes';

interface CategoryStats {
  _id: string;
  name: string;
  soundCount: number;
  totalPlays: number;
  totalViews: number;
}

export default function AdminHomePage() {
  const { ready } = useAdminSession();
  const [sounds, setSounds] = useState<AdminSound[]>([]);
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [totalSounds, setTotalSounds] = useState(0);
  const [totalCategories, setTotalCategories] = useState(0);
  const [loading, setLoading] = useState(true);
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Top sounds
  const [topPlayed, setTopPlayed] = useState<AdminSound[]>([]);
  const [topViewed, setTopViewed] = useState<AdminSound[]>([]);
  const [recentPlayed, setRecentPlayed] = useState<AdminSound[]>([]);
  const [recentViewed, setRecentViewed] = useState<AdminSound[]>([]);
  const [playedOrder, setPlayedOrder] = useState<'desc' | 'asc'>('desc');
  const [viewedOrder, setViewedOrder] = useState<'desc' | 'asc'>('desc');

  // Category stats
  const [categoryStats, setCategoryStats] = useState<CategoryStats[]>([]);
  const [catSortKey, setCatSortKey] = useState<'soundCount' | 'totalPlays' | 'totalViews'>('soundCount');
  const [catSortDir, setCatSortDir] = useState<'desc' | 'asc'>('desc');

  // Aggregate totals
  const [totalPlays, setTotalPlays] = useState(0);
  const [totalViews, setTotalViews] = useState(0);
  
  // Site traffic
  const [siteTraffic, setSiteTraffic] = useState<{ siteId: string; plays: number; views: number }[]>([]);

  useEffect(() => {
    setMounted(true);
    if (!ready) return;

    const loadOverview = async () => {
      try {
        setLoading(true);

        const [soundsRes, categoriesRes, topPlayedRes, topViewedRes, recentPlayedRes, recentViewedRes, allSoundsRes] =
          await Promise.all([
            api.get('/sounds?limit=6&admin=true'),
            api.get('/categories?limit=200&admin=true'),
            api.get('/sounds?sort=trending&limit=10&admin=true'),
            api.get('/sounds?sort=views&limit=10&admin=true'),
            api.get('/sounds?sort=recent_plays&limit=10&admin=true'),
            api.get('/sounds?sort=recent_views&limit=10&admin=true'),
            api.get('/sounds?limit=10000&admin=true'),
          ]);

        const allSounds: AdminSound[] = Array.isArray(allSoundsRes.data.sounds)
          ? allSoundsRes.data.sounds
          : [];
        const cats: AdminCategory[] = Array.isArray(categoriesRes.data.categories)
          ? categoriesRes.data.categories
          : [];

        setSounds(
          Array.isArray(soundsRes.data.sounds) ? soundsRes.data.sounds : []
        );
        setTotalSounds(soundsRes.data.total || 0);
        setCategories(cats);
        setTotalCategories(categoriesRes.data.total || 0);

        setTopPlayed(
          Array.isArray(topPlayedRes.data.sounds)
            ? topPlayedRes.data.sounds
            : []
        );
        setTopViewed(
          Array.isArray(topViewedRes.data.sounds)
            ? topViewedRes.data.sounds
            : []
        );
        setRecentPlayed(
          Array.isArray(recentPlayedRes.data.sounds)
            ? recentPlayedRes.data.sounds
            : []
        );
        setRecentViewed(
          Array.isArray(recentViewedRes.data.sounds)
            ? recentViewedRes.data.sounds
            : []
        );

        // Compute aggregates
        let plays = 0;
        let views = 0;
        const catMap = new Map<string, CategoryStats>();
        const trafficMap = new Map<string, { plays: number, views: number }>();

        for (const cat of cats) {
          catMap.set(cat._id, {
            _id: cat._id,
            name: cat.name,
            soundCount: 0,
            totalPlays: 0,
            totalViews: 0,
          });
        }

        for (const s of allSounds) {
          plays += s.playCount || 0;
          views += s.viewCount || 0;
          const catId =
            typeof s.category === 'object' && s.category
              ? s.category._id
              : typeof s.category === 'string'
              ? s.category
              : null;
          if (catId && catMap.has(catId)) {
            const stat = catMap.get(catId)!;
            stat.soundCount += 1;
            stat.totalPlays += s.playCount || 0;
            stat.totalViews += s.viewCount || 0;
          }
          
          if (s.sitePlays) {
            for (const [siteId, count] of Object.entries(s.sitePlays)) {
              const current = trafficMap.get(siteId) || { plays: 0, views: 0 };
              current.plays += count as number;
              trafficMap.set(siteId, current);
            }
          }
          
          if (s.siteViews) {
            for (const [siteId, count] of Object.entries(s.siteViews)) {
              const current = trafficMap.get(siteId) || { plays: 0, views: 0 };
              current.views += count as number;
              trafficMap.set(siteId, current);
            }
          }
        }

        const trafficArr = Array.from(trafficMap.entries()).map(([siteId, stats]) => ({
          siteId,
          plays: stats.plays,
          views: stats.views
        })).sort((a, b) => b.plays - a.plays);

        setTotalPlays(plays);
        setTotalViews(views);
        setCategoryStats(Array.from(catMap.values()));
        setSiteTraffic(trafficArr);
      } catch (error) {
        console.error('Failed to load admin overview', error);
      } finally {
        setLoading(false);
      }
    };

    void loadOverview();
  }, [ready]);

  const isDark = mounted && resolvedTheme === 'dark';

  // Sort helpers
  const sortedTopPlayed = [...topPlayed].sort((a, b) =>
    playedOrder === 'desc'
      ? (b.playCount || 0) - (a.playCount || 0)
      : (a.playCount || 0) - (b.playCount || 0)
  );

  const sortedTopViewed = [...topViewed].sort((a, b) =>
    viewedOrder === 'desc'
      ? (b.viewCount || 0) - (a.viewCount || 0)
      : (a.viewCount || 0) - (b.viewCount || 0)
  );

  const sortedCategoryStats = [...categoryStats].sort((a, b) =>
    catSortDir === 'desc'
      ? b[catSortKey] - a[catSortKey]
      : a[catSortKey] - b[catSortKey]
  );

  const handleCatSort = (key: 'soundCount' | 'totalPlays' | 'totalViews') => {
    if (catSortKey === key) {
      setCatSortDir((d) => (d === 'desc' ? 'asc' : 'desc'));
    } else {
      setCatSortKey(key);
      setCatSortDir('desc');
    }
  };

  const SortIcon = ({ active, dir }: { active: boolean; dir: 'asc' | 'desc' }) =>
    active ? (
      dir === 'desc' ? (
        <ChevronDown size={14} className="text-sky-500" />
      ) : (
        <ChevronUp size={14} className="text-sky-500" />
      )
    ) : (
      <ArrowUpDown size={12} className="text-slate-400" />
    );

  if (!ready) {
    return (
      <div
        className={`flex items-center justify-center min-h-[400px] font-bold animate-pulse ${
          isDark ? 'text-zinc-500' : 'text-zinc-400'
        }`}
      >
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Hero Section */}
      <section
        className={`p-8 rounded-3xl border transition-all duration-300 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 ${
          isDark
            ? 'border-zinc-800 bg-zinc-900/40 shadow-none'
            : 'border-zinc-200 bg-white shadow-xl shadow-zinc-200/40'
        }`}
      >
        <div className="max-w-2xl">
          <p className="text-[10px] text-sky-500 font-bold uppercase tracking-widest mb-2">
            Overview
          </p>
          <h2 className="text-3xl md:text-4xl font-black tracking-tight text-foreground mb-3">
            Dashboard
          </h2>
          <p
            className={`leading-relaxed font-medium ${
              isDark ? 'text-zinc-400' : 'text-zinc-500'
            }`}
          >
            Complete analytics overview with category breakdowns, top performing
            sounds, and engagement metrics.
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
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {[
          {
            icon: Music,
            label: 'Total Sounds',
            value: totalSounds,
            color: 'text-sky-500',
            bg: 'bg-sky-500/10',
          },
          {
            icon: FolderOpen,
            label: 'Categories',
            value: totalCategories,
            color: 'text-indigo-500',
            bg: 'bg-indigo-500/10',
          },
          {
            icon: BarChart3,
            label: 'Total Plays',
            value: totalPlays,
            color: 'text-emerald-500',
            bg: 'bg-emerald-500/10',
          },
          {
            icon: Eye,
            label: 'Total Views',
            value: totalViews,
            color: 'text-amber-500',
            bg: 'bg-amber-500/10',
          },
        ].map((metric) => (
          <article
            key={metric.label}
            className={`p-5 md:p-6 rounded-3xl border transition-colors duration-300 flex items-center gap-4 ${
              isDark
                ? 'border-zinc-800 bg-zinc-900/40'
                : 'border-zinc-200 bg-white shadow-sm'
            }`}
          >
            <div
              className={`w-11 h-11 rounded-2xl ${metric.bg} ${metric.color} flex items-center justify-center shrink-0`}
            >
              <metric.icon size={20} />
            </div>
            <div className="min-w-0">
              <p
                className={`text-[10px] font-black uppercase tracking-widest truncate ${
                  isDark ? 'text-zinc-500' : 'text-zinc-400'
                }`}
              >
                {metric.label}
              </p>
              <strong className="text-2xl md:text-3xl font-black tracking-tight text-foreground block mt-0.5">
                {loading ? '...' : metric.value.toLocaleString()}
              </strong>
            </div>
          </article>
        ))}
      </section>

      {/* Site Traffic Metrics */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {siteTraffic.map((site) => (
          <article
            key={site.siteId}
            className={`p-5 md:p-6 rounded-3xl border transition-colors duration-300 flex justify-between items-center ${
              isDark
                ? 'border-zinc-800 bg-zinc-900/40'
                : 'border-zinc-200 bg-white shadow-sm'
            }`}
          >
            <div>
              <p className={`text-[10px] font-black uppercase tracking-widest ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>
                {site.siteId === 'soundbuttons' ? 'SoundButtonsMax.net' : 'SoundboardMax.net'}
              </p>
              <h3 className="text-xl font-black tracking-tight text-foreground mt-1">Traffic</h3>
            </div>
            <div className="flex gap-6">
              <div className="text-right">
                <p className={`text-[10px] font-black uppercase tracking-widest ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>Plays</p>
                <strong className="text-2xl font-black text-emerald-500">{site.plays.toLocaleString()}</strong>
              </div>
              <div className="text-right">
                <p className={`text-[10px] font-black uppercase tracking-widest ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>Views</p>
                <strong className="text-2xl font-black text-amber-500">{site.views.toLocaleString()}</strong>
              </div>
            </div>
          </article>
        ))}
      </section>

      {/* Category-wise Sound Counts */}
      <section
        className={`rounded-3xl border overflow-hidden transition-colors duration-300 ${
          isDark
            ? 'border-zinc-800 bg-zinc-900/40'
            : 'border-zinc-200 bg-white shadow-sm'
        }`}
      >
        <div className="p-6 md:p-8 pb-0">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-[10px] text-indigo-500 font-bold uppercase tracking-widest mb-1">
                Breakdown
              </p>
              <h3 className="text-xl font-black tracking-tight text-foreground">
                Sounds by Category
              </h3>
            </div>
            <Link
              href="/admin/categories"
              className="text-xs font-black uppercase tracking-wider text-sky-500 hover:underline"
            >
              Manage
            </Link>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr
                className={`border-b ${
                  isDark ? 'border-zinc-800 bg-zinc-950/40' : 'border-zinc-100 bg-zinc-50'
                }`}
              >
                <th className="text-left px-6 md:px-8 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Category
                </th>
                <th
                  className="text-right px-6 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400 cursor-pointer select-none hover:text-sky-500 transition-colors"
                  onClick={() => handleCatSort('soundCount')}
                >
                  <span className="inline-flex items-center gap-1">
                    Sounds{' '}
                    <SortIcon
                      active={catSortKey === 'soundCount'}
                      dir={catSortDir}
                    />
                  </span>
                </th>
                <th
                  className="text-right px-6 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400 cursor-pointer select-none hover:text-sky-500 transition-colors"
                  onClick={() => handleCatSort('totalPlays')}
                >
                  <span className="inline-flex items-center gap-1">
                    Plays{' '}
                    <SortIcon
                      active={catSortKey === 'totalPlays'}
                      dir={catSortDir}
                    />
                  </span>
                </th>
                <th
                  className="text-right px-6 md:px-8 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400 cursor-pointer select-none hover:text-sky-500 transition-colors"
                  onClick={() => handleCatSort('totalViews')}
                >
                  <span className="inline-flex items-center gap-1">
                    Views{' '}
                    <SortIcon
                      active={catSortKey === 'totalViews'}
                      dir={catSortDir}
                    />
                  </span>
                </th>
              </tr>
            </thead>
            <tbody
              className={`divide-y ${
                isDark ? 'divide-zinc-800/50' : 'divide-zinc-50'
              }`}
            >
              {loading ? (
                <tr>
                  <td
                    colSpan={4}
                    className="text-center py-12 text-slate-400 font-bold"
                  >
                    Loading...
                  </td>
                </tr>
              ) : sortedCategoryStats.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="text-center py-12 text-slate-400 font-bold"
                  >
                    No categories found
                  </td>
                </tr>
              ) : (
                sortedCategoryStats.map((cat) => (
                  <tr
                    key={cat._id}
                    className={`transition-colors ${
                      isDark ? 'hover:bg-zinc-800/30' : 'hover:bg-zinc-50'
                    }`}
                  >
                    <td className="px-6 md:px-8 py-3.5">
                      <span className="text-sm font-black text-foreground">
                        {cat.name}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 text-right">
                      <span className="text-sm font-black text-foreground">
                        {cat.soundCount.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 text-right">
                      <span className="text-sm font-bold text-slate-500">
                        {cat.totalPlays.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-6 md:px-8 py-3.5 text-right">
                      <span className="text-sm font-bold text-slate-500">
                        {cat.totalViews.toLocaleString()}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Top Sounds Leaderboards */}
      <section className="grid grid-cols-1 lg:grid-cols-4 gap-6 md:gap-8">
        {/* Top Played */}
        <div
          className={`rounded-3xl border overflow-hidden flex flex-col transition-colors duration-300 lg:col-span-2 ${
            isDark
              ? 'border-zinc-800 bg-zinc-900/40'
              : 'border-zinc-200 bg-white shadow-sm'
          }`}
        >
          <div className="p-6 md:p-8 pb-4 flex items-center justify-between">
            <div>
              <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest mb-1">
                Leaderboard
              </p>
              <h3 className="text-xl font-black tracking-tight text-foreground">
                Top Played
              </h3>
            </div>
            <button
              onClick={() =>
                setPlayedOrder((o) => (o === 'desc' ? 'asc' : 'desc'))
              }
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all active:scale-95 ${
                isDark
                  ? 'border-zinc-700 bg-zinc-800 text-zinc-300 hover:border-emerald-500/50'
                  : 'border-zinc-200 bg-zinc-50 text-zinc-600 hover:border-emerald-500/50'
              }`}
            >
              {playedOrder === 'desc' ? (
                <ChevronDown size={12} />
              ) : (
                <ChevronUp size={12} />
              )}
              {playedOrder === 'desc' ? 'Highest' : 'Lowest'}
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-4 md:px-6 pb-6">
            <div className="space-y-2">
              {loading ? (
                <p className="text-center py-8 text-slate-400 font-bold animate-pulse">
                  Loading...
                </p>
              ) : sortedTopPlayed.length === 0 ? (
                <p className="text-center py-8 text-slate-400 font-bold">
                  No data
                </p>
              ) : (
                sortedTopPlayed.map((sound, i) => (
                  <div
                    key={sound._id}
                    className={`flex items-center gap-4 p-3.5 rounded-2xl border transition-all ${
                      isDark
                        ? 'border-zinc-800/50 bg-zinc-950/40 hover:border-emerald-500/20'
                        : 'border-zinc-100 bg-zinc-50/50 hover:border-emerald-500/20'
                    }`}
                  >
                    <span
                      className={`w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-black shrink-0 ${
                        i < 3
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                          : isDark
                          ? 'bg-zinc-800 text-zinc-500'
                          : 'bg-zinc-100 text-zinc-400'
                      }`}
                    >
                      {i + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-black text-foreground truncate">
                        {sound.title}
                      </p>
                      <p
                        className={`text-[11px] font-bold truncate ${
                          isDark ? 'text-zinc-500' : 'text-zinc-400'
                        }`}
                      >
                        {getSoundCategoryName(sound)}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <BarChart3 size={14} className="text-emerald-500" />
                      <span className="text-sm font-black text-foreground">
                        {(sound.playCount || 0).toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Top Viewed */}
        <div
          className={`rounded-3xl border overflow-hidden flex flex-col transition-colors duration-300 lg:col-span-2 ${
            isDark
              ? 'border-zinc-800 bg-zinc-900/40'
              : 'border-zinc-200 bg-white shadow-sm'
          }`}
        >
          <div className="p-6 md:p-8 pb-4 flex items-center justify-between">
            <div>
              <p className="text-[10px] text-amber-500 font-bold uppercase tracking-widest mb-1">
                Leaderboard
              </p>
              <h3 className="text-xl font-black tracking-tight text-foreground">
                Top Viewed
              </h3>
            </div>
            <button
              onClick={() =>
                setViewedOrder((o) => (o === 'desc' ? 'asc' : 'desc'))
              }
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all active:scale-95 ${
                isDark
                  ? 'border-zinc-700 bg-zinc-800 text-zinc-300 hover:border-amber-500/50'
                  : 'border-zinc-200 bg-zinc-50 text-zinc-600 hover:border-amber-500/50'
              }`}
            >
              {viewedOrder === 'desc' ? (
                <ChevronDown size={12} />
              ) : (
                <ChevronUp size={12} />
              )}
              {viewedOrder === 'desc' ? 'Highest' : 'Lowest'}
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-4 md:px-6 pb-6">
            <div className="space-y-2">
              {loading ? (
                <p className="text-center py-8 text-slate-400 font-bold animate-pulse">
                  Loading...
                </p>
              ) : sortedTopViewed.length === 0 ? (
                <p className="text-center py-8 text-slate-400 font-bold">
                  No data
                </p>
              ) : (
                sortedTopViewed.map((sound, i) => (
                  <div
                    key={sound._id}
                    className={`flex items-center gap-4 p-3.5 rounded-2xl border transition-all ${
                      isDark
                        ? 'border-zinc-800/50 bg-zinc-950/40 hover:border-amber-500/20'
                        : 'border-zinc-100 bg-zinc-50/50 hover:border-amber-500/20'
                    }`}
                  >
                    <span
                      className={`w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-black shrink-0 ${
                        i < 3
                          ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                          : isDark
                          ? 'bg-zinc-800 text-zinc-500'
                          : 'bg-zinc-100 text-zinc-400'
                      }`}
                    >
                      {i + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-black text-foreground truncate">
                        {sound.title}
                      </p>
                      <p
                        className={`text-[11px] font-bold truncate ${
                          isDark ? 'text-zinc-500' : 'text-zinc-400'
                        }`}
                      >
                        {getSoundCategoryName(sound)}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <Eye size={14} className="text-amber-500" />
                      <span className="text-sm font-black text-foreground">
                        {(sound.viewCount || 0).toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Recent Activity Leaderboards */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        {/* Recent Played */}
        <div
          className={`rounded-3xl border overflow-hidden flex flex-col transition-colors duration-300 ${
            isDark
              ? 'border-zinc-800 bg-zinc-900/40'
              : 'border-zinc-200 bg-white shadow-sm'
          }`}
        >
          <div className="p-6 md:p-8 pb-4 flex items-center justify-between">
            <div>
              <p className="text-[10px] text-purple-500 font-bold uppercase tracking-widest mb-1">
                Recent Activity
              </p>
              <h3 className="text-xl font-black tracking-tight text-foreground">
                Recently Played
              </h3>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-4 md:px-6 pb-6">
            <div className="space-y-2">
              {loading ? (
                <p className="text-center py-8 text-slate-400 font-bold animate-pulse">
                  Loading...
                </p>
              ) : recentPlayed.length === 0 ? (
                <p className="text-center py-8 text-slate-400 font-bold">
                  No data
                </p>
              ) : (
                recentPlayed.map((sound, i) => (
                  <div
                    key={sound._id}
                    className={`flex items-center gap-4 p-3.5 rounded-2xl border transition-all ${
                      isDark
                        ? 'border-zinc-800/50 bg-zinc-950/40 hover:border-purple-500/20'
                        : 'border-zinc-100 bg-zinc-50/50 hover:border-purple-500/20'
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-black text-foreground truncate">
                        {sound.title}
                      </p>
                      <p
                        className={`text-[11px] font-bold truncate ${
                          isDark ? 'text-zinc-500' : 'text-zinc-400'
                        }`}
                      >
                        {getSoundCategoryName(sound)}
                      </p>
                    </div>
                    <div className="flex flex-col items-end shrink-0">
                      <span className="text-[10px] font-bold text-slate-400">
                        {sound.lastPlayedAt ? new Date(sound.lastPlayedAt).toLocaleTimeString() : '-'}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Recent Viewed */}
        <div
          className={`rounded-3xl border overflow-hidden flex flex-col transition-colors duration-300 ${
            isDark
              ? 'border-zinc-800 bg-zinc-900/40'
              : 'border-zinc-200 bg-white shadow-sm'
          }`}
        >
          <div className="p-6 md:p-8 pb-4 flex items-center justify-between">
            <div>
              <p className="text-[10px] text-pink-500 font-bold uppercase tracking-widest mb-1">
                Recent Activity
              </p>
              <h3 className="text-xl font-black tracking-tight text-foreground">
                Recently Viewed
              </h3>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-4 md:px-6 pb-6">
            <div className="space-y-2">
              {loading ? (
                <p className="text-center py-8 text-slate-400 font-bold animate-pulse">
                  Loading...
                </p>
              ) : recentViewed.length === 0 ? (
                <p className="text-center py-8 text-slate-400 font-bold">
                  No data
                </p>
              ) : (
                recentViewed.map((sound, i) => (
                  <div
                    key={sound._id}
                    className={`flex items-center gap-4 p-3.5 rounded-2xl border transition-all ${
                      isDark
                        ? 'border-zinc-800/50 bg-zinc-950/40 hover:border-pink-500/20'
                        : 'border-zinc-100 bg-zinc-50/50 hover:border-pink-500/20'
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-black text-foreground truncate">
                        {sound.title}
                      </p>
                      <p
                        className={`text-[11px] font-bold truncate ${
                          isDark ? 'text-zinc-500' : 'text-zinc-400'
                        }`}
                      >
                        {getSoundCategoryName(sound)}
                      </p>
                    </div>
                    <div className="flex flex-col items-end shrink-0">
                      <span className="text-[10px] font-bold text-slate-400">
                        {sound.lastViewedAt ? new Date(sound.lastViewedAt).toLocaleTimeString() : '-'}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Recent Sounds + Shortcuts */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        {/* Recent Sounds */}
        <div
          className={`p-8 rounded-3xl border flex flex-col h-full transition-colors duration-300 ${
            isDark
              ? 'border-zinc-800 bg-zinc-900/40'
              : 'border-zinc-200 bg-white shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="text-[10px] text-sky-500 font-bold uppercase tracking-widest mb-1">
                Recent sounds
              </p>
              <h3 className="text-xl font-black tracking-tight text-foreground">
                Latest entries
              </h3>
            </div>
            <Link
              href="/admin/sounds"
              className="text-xs font-black uppercase tracking-wider text-sky-500 hover:underline"
            >
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
                    <strong className="block font-black text-sm text-foreground truncate">
                      {sound.title}
                    </strong>
                    <span
                      className={`text-[11px] font-black uppercase tracking-wider mt-0.5 block ${
                        isDark ? 'text-zinc-500' : 'text-zinc-400'
                      }`}
                    >
                      {getSoundCategoryName(sound)}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-[11px] font-bold text-slate-400">
                      {(sound.playCount || 0).toLocaleString()} plays
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                        sound.isPublished !== false
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                          : 'bg-zinc-500/10 text-zinc-500 border-zinc-500/20'
                      }`}
                    >
                      {sound.isPublished !== false ? 'Live' : 'Draft'}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="py-8 text-center text-slate-500 font-medium italic">
                No sounds yet.
              </p>
            )}
          </div>
        </div>

        {/* Shortcuts */}
        <div
          className={`p-8 rounded-3xl border flex flex-col transition-colors duration-300 ${
            isDark
              ? 'border-zinc-800 bg-zinc-900/40'
              : 'border-zinc-200 bg-white shadow-sm'
          }`}
        >
          <div className="mb-8">
            <p className="text-[10px] text-sky-500 font-bold uppercase tracking-widest mb-1">
              Shortcuts
            </p>
            <h3 className="text-xl font-black tracking-tight text-foreground">
              Open a route
            </h3>
          </div>

          <div className="grid gap-3 flex-1">
            {[
              { href: '/admin/sounds', label: 'Manage sounds' },
              { href: '/admin/sounds/new', label: 'Create a sound' },
              { href: '/admin/categories', label: 'Review categories' },
              { href: '/admin/blogs', label: 'Manage blogs' },
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
                <span className="text-sm font-black text-foreground group-hover:text-sky-500 transition-colors">
                  {shortcut.label}
                </span>
                <ArrowRight
                  size={16}
                  className="text-slate-400 group-hover:text-sky-500 group-hover:translate-x-1 transition-all"
                />
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
