'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Edit3, Globe, Plus, RefreshCw, Trash2 } from 'lucide-react';
import api from '@/services/api';
import { useAdminSession } from '../useAdminSession';
import { toast } from 'react-hot-toast';
import { SiteConfig } from '@/config/sites';
import Link from 'next/link';

const COOLDOWN_SECONDS = 15;

async function fetchSites() {
  const res = await api.get('/sites/admin');
  return res.data as (SiteConfig & { _id: string })[];
}

export default function AdminSitesPage() {
  const { ready } = useAdminSession();
  const queryClient = useQueryClient();

  // Cooldown logic
  const [cooldown, setCooldown] = useState(0);
  const cooldownTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ── TanStack Query ────────────────────────────────────────────────────────
  const { data: sites = [], isLoading, refetch, isRefetching } = useQuery({
    queryKey: ['admin-sites'],
    queryFn: fetchSites,
    enabled: ready,
  });

  // ── Cooldown Timer Logic ──────────────────────────────────────────────────
  const startCooldown = useCallback(() => {
    setCooldown(COOLDOWN_SECONDS);
    if (cooldownTimerRef.current) clearInterval(cooldownTimerRef.current);

    cooldownTimerRef.current = setInterval(() => {
      setCooldown(prev => {
        if (prev <= 1) {
          if (cooldownTimerRef.current) clearInterval(cooldownTimerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  useEffect(() => {
    return () => { if (cooldownTimerRef.current) clearInterval(cooldownTimerRef.current); };
  }, []);

  const handleManualRefresh = () => {
    if (cooldown > 0 || isRefetching) return;
    refetch();
    startCooldown();
  };

  // ── Delete mutation ───────────────────────────────────────────────────────
  const deleteMutation = useMutation({
    mutationFn: (siteId: string) => api.delete(`/sites/${siteId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-sites'] });
      toast.success('Site deleted successfully');
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message ?? 'Failed to delete site.');
    }
  });

  const handleDelete = async (siteId: string) => {
    if (!window.confirm('Delete this site? This cannot be undone.')) return;
    deleteMutation.mutate(siteId);
  };

  if (!ready) {
    return (
      <div className="flex items-center justify-center min-h-[400px] text-slate-500 font-bold animate-pulse">
        Checking session…
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* ── Toolbar ─────────────────────────────────────────────────────── */}
      <section className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-sky-500 mb-1">Sites</p>
            <h2 className="text-2xl font-black tracking-tight text-foreground">
              {isLoading ? '…' : sites.length} sites
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage dynamic domains and languages.</p>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {/* New */}
            <Link
              href="/admin/sites/new"
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-sky-500 text-white font-black text-sm hover:bg-sky-600 transition-all active:scale-95 shadow-lg shadow-sky-500/20"
            >
              <Plus size={16} />
              <span>New Site</span>
            </Link>

            {/* Refresh */}
            <button
              onClick={handleManualRefresh}
              disabled={cooldown > 0 || isRefetching}
              className={`relative w-11 h-11 flex flex-col items-center justify-center rounded-full border transition-all group ${cooldown > 0
                ? 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-400 cursor-not-allowed'
                : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-500 hover:text-sky-500 hover:border-sky-500/50'
                }`}
              title={cooldown > 0 ? `Wait ${cooldown}s` : 'Refresh data'}
            >
              <RefreshCw size={15} className={isRefetching ? 'animate-spin' : ''} />
              {cooldown > 0 && (
                <span className="absolute -bottom-5 text-[10px] font-black text-sky-500 whitespace-nowrap">
                  {cooldown}s
                </span>
              )}
            </button>
          </div>
        </div>
      </section>

      {/* ── Table ───────────────────────────────────────────────────────── */}
      <section className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/20">
                <th className="text-left px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100 dark:border-slate-800 w-1/3">Name</th>
                <th className="text-left px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100 dark:border-slate-800">Domains</th>
                <th className="text-left px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100 dark:border-slate-800">Languages</th>
                <th className="text-right px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100 dark:border-slate-800">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
              {isLoading ? (
                [...Array(3)].map((_, i) => (
                  <tr key={i}>
                    <td className="px-6 py-4"><div className="h-4 rounded bg-slate-100 dark:bg-slate-800 animate-pulse w-2/3" /></td>
                    <td className="px-6 py-4"><div className="h-4 rounded bg-slate-100 dark:bg-slate-800 animate-pulse w-1/2" /></td>
                    <td className="px-6 py-4"><div className="h-6 w-16 rounded-full bg-slate-100 dark:bg-slate-800 animate-pulse" /></td>
                    <td className="px-6 py-4"><div className="h-8 w-16 rounded-lg bg-slate-100 dark:bg-slate-800 animate-pulse ml-auto" /></td>
                  </tr>
                ))
              ) : sites.length > 0 ? (
                sites.map(site => (
                  <tr key={site._id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-sky-500/10 flex items-center justify-center text-sky-500 shrink-0">
                          <Globe size={14} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-black text-foreground group-hover:text-sky-500 transition-colors truncate">{site.siteName}</p>
                          <p className="text-[11px] text-slate-400 font-medium truncate max-w-[220px]">ID: {site.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-slate-500 dark:text-slate-400 font-mono">
                      {site.domains?.join(', ') || '—'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-1 flex-wrap">
                        {(site as any).supportedLocales?.map((l: string) => (
                          <span key={l} className="px-2 py-1 rounded-md text-[10px] font-black uppercase bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                            {l} {l === (site as any).defaultLocale && '(Def)'}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <Link
                          href={`/admin/sites/${site._id}`}
                          className="w-8 h-8 flex items-center justify-center rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-200"
                          title="Edit"
                        >
                          <Edit3 size={14} />
                        </Link>
                        <button
                          onClick={() => handleDelete(site._id)}
                          disabled={deleteMutation.isPending && deleteMutation.variables === site._id}
                          className="w-8 h-8 flex items-center justify-center rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:text-red-500 hover:border-red-500/30 transition-all duration-200 disabled:opacity-50"
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-24 text-center">
                    <Globe size={40} className="text-slate-200 dark:text-slate-700 mx-auto mb-4" />
                    <p className="text-slate-400 font-bold">No sites found.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
