'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Edit3, FolderOpen, Plus, RefreshCw, Search, Trash2 } from 'lucide-react';
import api from '@/services/api';
import { AdminCategory } from '../admin-types';
import { useAdminSession } from '../useAdminSession';
import Drawer from '../components/Drawer';
import CategoryForm from '../components/CategoryForm';
import { toast } from 'react-hot-toast';

const COOLDOWN_SECONDS = 15;

async function fetchCategories(q: string) {
  const params = new URLSearchParams({ limit: '200', admin: 'true' });
  if (q.trim()) params.set('q', q.trim());
  const res = await api.get(`/categories?${params}`);
  return {
    categories: Array.isArray(res.data.categories) ? res.data.categories as AdminCategory[] : [],
    total: res.data.total ?? 0,
  };
}

export default function AdminCategoriesPage() {
  const { ready } = useAdminSession();
  const queryClient = useQueryClient();
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [saving, setSaving] = useState(false);

  // Cooldown logic
  const [cooldown, setCooldown] = useState(0);
  const cooldownTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Drawer state
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<AdminCategory | null>(null);
  const [formKey, setFormKey] = useState(0);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── TanStack Query ────────────────────────────────────────────────────────
  const { data: catsData, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ['admin-categories', debouncedQuery],
    queryFn: () => fetchCategories(debouncedQuery),
    enabled: ready,
    // Automatic refetch removed per user request
  });

  const categories = catsData?.categories ?? [];
  const total = catsData?.total ?? 0;

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

  // ── Debounced search ──────────────────────────────────────────────────────
  const handleQueryChange = (value: string) => {
    setQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setDebouncedQuery(value);
    }, 400);
  };

  const handleManualRefresh = () => {
    if (cooldown > 0 || isRefetching) return;
    refetch();
    startCooldown();
  };

  // ── Delete mutation ───────────────────────────────────────────────────────
  const deleteMutation = useMutation({
    mutationFn: (catId: string) => api.delete(`/categories/${catId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
      toast.success('Category deleted successfully');
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message ?? 'Failed to delete category.');
    }
  });

  const handleDelete = async (catId: string) => {
    if (!window.confirm('Delete this category? This cannot be undone.')) return;
    deleteMutation.mutate(catId);
  };

  // ── Drawer CRUD ───────────────────────────────────────────────────────────
  const openCreate = () => { setEditingCategory(null); setDrawerOpen(true); };
  const openEdit = (cat: AdminCategory) => { setEditingCategory(cat); setDrawerOpen(true); };
  const closeDrawer = () => {
    setDrawerOpen(false);
    setEditingCategory(null);
    setFormKey(prev => prev + 1);
  };

  const handleSubmit = async (data: Partial<AdminCategory>) => {
    setSaving(true);
    try {
      if (editingCategory) {
        await api.put(`/categories/${editingCategory._id}`, data);
      } else {
        await api.post('/categories', data);
      }
      closeDrawer();
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
      toast.success(editingCategory ? 'Category updated successfully' : 'Category created successfully');
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? 'Failed to save category.');
    } finally {
      setSaving(false);
    }
  };

  if (!ready) {
    return (
      <div className="flex items-center justify-center min-h-[400px] text-slate-500 font-bold animate-pulse">
        Checking session…
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6 animate-in fade-in duration-500">
        {/* ── Toolbar ─────────────────────────────────────────────────────── */}
        <section className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 shadow-sm">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-sky-500 mb-1">Categories</p>
              <h2 className="text-2xl font-black tracking-tight text-foreground">
                {isLoading ? '…' : total} categories
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manual refetch with {COOLDOWN_SECONDS}s cooldown.</p>
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              {/* Search */}
              <div className="flex-1 md:w-64 flex items-center gap-2 px-4 py-2.5 rounded-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 focus-within:ring-2 focus-within:ring-sky-500/20 transition-all">
                <Search size={16} className="text-slate-400 shrink-0" />
                <input
                  value={query}
                  onChange={e => handleQueryChange(e.target.value)}
                  placeholder="Search categories…"
                  className="bg-transparent border-none outline-none text-sm w-full text-foreground placeholder:text-slate-400"
                />
              </div>

              {/* New */}
              <button
                onClick={openCreate}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-sky-500 text-white font-black text-sm hover:bg-sky-600 transition-all active:scale-95 shadow-lg shadow-sky-500/20"
              >
                <Plus size={16} />
                <span>New category</span>
              </button>

              {/* Refresh with cooldown ring */}
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
                <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none" viewBox="0 0 44 44">
                  <circle cx="22" cy="22" r="19" fill="none" stroke="currentColor" strokeWidth="2" strokeOpacity="0.05" className="text-sky-500" />
                  {cooldown > 0 && (
                    <circle
                      cx="22" cy="22" r="19" fill="none" stroke="currentColor" strokeWidth="2"
                      strokeDasharray={`${2 * Math.PI * 19}`}
                      strokeDashoffset={`${2 * Math.PI * 19 * (cooldown / COOLDOWN_SECONDS)}`}
                      className="text-sky-500 transition-all duration-1000 ease-linear"
                    />
                  )}
                </svg>
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
                  <th className="text-left px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100 dark:border-slate-800 w-1/2">Name</th>
                  <th className="text-left px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100 dark:border-slate-800">Slug</th>
                  <th className="text-left px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100 dark:border-slate-800">State</th>
                  <th className="text-right px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100 dark:border-slate-800">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                {isLoading ? (
                  [...Array(4)].map((_, i) => (
                    <tr key={i}>
                      <td className="px-6 py-4"><div className="h-4 rounded bg-slate-100 dark:bg-slate-800 animate-pulse w-2/3" /></td>
                      <td className="px-6 py-4"><div className="h-4 rounded bg-slate-100 dark:bg-slate-800 animate-pulse w-1/2" /></td>
                      <td className="px-6 py-4"><div className="h-6 w-16 rounded-full bg-slate-100 dark:bg-slate-800 animate-pulse" /></td>
                      <td className="px-6 py-4"><div className="h-8 w-16 rounded-lg bg-slate-100 dark:bg-slate-800 animate-pulse ml-auto" /></td>
                    </tr>
                  ))
                ) : categories.length > 0 ? (
                  categories.map(cat => (
                    <tr key={cat._id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-8 h-8 rounded-lg bg-sky-500/10 flex items-center justify-center text-sky-500 shrink-0">
                            <span className="material-icons text-sm">{cat.icon || 'music_note'}</span>
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-black text-foreground group-hover:text-sky-500 transition-colors truncate">{cat.name}</p>
                            <p className="text-[11px] text-slate-400 font-medium truncate max-w-[220px]">{cat.description || 'No description'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-slate-500 dark:text-slate-400 font-mono">
                        {cat.slug || '—'}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${cat.isIndexable !== false
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                          : 'bg-slate-200/80 dark:bg-slate-700/50 text-slate-500 border-slate-300 dark:border-slate-700'
                          }`}>
                          {cat.isIndexable !== false ? 'Indexed' : 'Hidden'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => openEdit(cat)}
                            className="w-8 h-8 flex items-center justify-center rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-200"
                            title="Edit"
                          >
                            <Edit3 size={14} />
                          </button>
                          <button
                            onClick={() => handleDelete(cat._id)}
                            disabled={deleteMutation.isPending && deleteMutation.variables === cat._id}
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
                      <FolderOpen size={40} className="text-slate-200 dark:text-slate-700 mx-auto mb-4" />
                      <p className="text-slate-400 font-bold">No categories found{query ? ` for "${query}"` : ''}.</p>
                      {query && (
                        <button onClick={() => { setQuery(''); setDebouncedQuery(''); }} className="mt-3 text-sky-500 font-black text-sm hover:underline">
                          Clear search
                        </button>
                      )}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {/* ── Drawer ────────────────────────────────────────────────────────── */}
      <Drawer
        open={drawerOpen}
        onClose={closeDrawer}
        title={editingCategory ? 'Edit Category' : 'New Category'}
        subtitle={editingCategory ? editingCategory.name : 'Create a new soundboard category.'}
        width="max-w-2xl"
      >
        {/* key forces remount so form pre-fills correctly when switching between items */}
        <CategoryForm
          key={editingCategory?._id ? `${editingCategory._id}-${formKey}` : `new-${formKey}`}
          initialCategory={editingCategory}
          submitLabel={editingCategory ? 'Save changes' : 'Create category'}
          onSubmit={handleSubmit}
          onCancel={closeDrawer}
          saving={saving}
        />
      </Drawer>
    </>
  );
}
