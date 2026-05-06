'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Edit3, Plus, RefreshCw, Search, Trash2, Volume2 } from 'lucide-react';
import api from '@/services/api';
import { AdminCategory, AdminSound, getSoundCategoryName } from '../admin-types';
import { useAdminSession } from '../useAdminSession';
import Drawer from '../components/Drawer';
import SoundForm from './SoundForm';

const COOLDOWN_SECONDS = 15;

async function fetchSounds(q: string) {
  const params = new URLSearchParams({ limit: '200', admin: 'true' });
  if (q.trim()) params.set('q', q.trim());
  const res = await api.get(`/sounds?${params}`);
  return {
    sounds: Array.isArray(res.data.sounds) ? res.data.sounds as AdminSound[] : [],
    total: res.data.total ?? 0,
  };
}

async function fetchCategories() {
  const res = await api.get('/categories?limit=200&admin=true');
  return Array.isArray(res.data.categories) ? res.data.categories as AdminCategory[] : [];
}

export default function AdminSoundsPage() {
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
  const [editingSound, setEditingSound] = useState<AdminSound | null>(null);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── TanStack Query ────────────────────────────────────────────────────────
  const { data: soundsData, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ['admin-sounds', debouncedQuery],
    queryFn: () => fetchSounds(debouncedQuery),
    enabled: ready,
    // Automatic refetch removed per user request
  });

  const { data: categories = [] } = useQuery({
    queryKey: ['admin-categories-list'],
    queryFn: fetchCategories,
    enabled: ready,
  });

  const sounds = soundsData?.sounds ?? [];
  const total = soundsData?.total ?? 0;

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
    mutationFn: (soundId: string) => api.delete(`/sounds/${soundId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-sounds'] });
    },
  });

  const handleDelete = async (soundId: string) => {
    if (!window.confirm('Delete this sound? This cannot be undone.')) return;
    deleteMutation.mutate(soundId);
  };

  // ── Drawer CRUD ───────────────────────────────────────────────────────────
  const openCreate = () => { setEditingSound(null); setDrawerOpen(true); };
  const openEdit = (sound: AdminSound) => { setEditingSound(sound); setDrawerOpen(true); };
  const closeDrawer = () => { setDrawerOpen(false); setEditingSound(null); };

  const handleSubmit = async (formData: FormData) => {
    setSaving(true);
    try {
      if (editingSound) {
        await api.put(`/sounds/${editingSound._id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        await api.post('/sounds', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }
      closeDrawer();
      queryClient.invalidateQueries({ queryKey: ['admin-sounds'] });
    } catch (err: any) {
      alert(err?.response?.data?.message ?? 'Failed to save sound.');
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
        {/* ── Toolbar ───────────────────────────────────────────────────────── */}
        <section className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 shadow-sm">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-sky-500 mb-1">Sound library</p>
              <h2 className="text-2xl font-black tracking-tight text-foreground">
                {isLoading ? '…' : total} sounds
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manual refetch with {COOLDOWN_SECONDS}s cooldown.</p>
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              {/* Search */}
              <div className="flex-1 md:w-72 flex items-center gap-2 px-4 py-2.5 rounded-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 focus-within:ring-2 focus-within:ring-sky-500/20 transition-all">
                <Search size={16} className="text-slate-400 shrink-0" />
                <input
                  value={query}
                  onChange={e => handleQueryChange(e.target.value)}
                  placeholder="Search sounds, tags…"
                  className="bg-transparent border-none outline-none text-sm w-full text-foreground placeholder:text-slate-400"
                />
              </div>

              {/* New */}
              <button
                onClick={openCreate}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-sky-500 text-white font-black text-sm hover:bg-sky-600 transition-all active:scale-95 shadow-lg shadow-sky-500/20"
              >
                <Plus size={16} />
                <span>New sound</span>
              </button>

              {/* Refresh with cooldown */}
              <button
                onClick={handleManualRefresh}
                disabled={cooldown > 0 || isRefetching}
                className={`relative w-11 h-11 flex flex-col items-center justify-center rounded-full border transition-all group ${
                  cooldown > 0 
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
                {/* Visual ring */}
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

        {/* ── Table ─────────────────────────────────────────────────────────── */}
        <section className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/20">
                  <th className="text-left px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100 dark:border-slate-800 w-1/2">Title</th>
                  <th className="text-left px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100 dark:border-slate-800">Category</th>
                  <th className="text-left px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100 dark:border-slate-800">Status</th>
                  <th className="text-right px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100 dark:border-slate-800">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                {isLoading ? (
                  [...Array(5)].map((_, i) => (
                    <tr key={i}>
                      <td className="px-6 py-4"><div className="h-4 rounded bg-slate-100 dark:bg-slate-800 animate-pulse w-3/4" /></td>
                      <td className="px-6 py-4"><div className="h-4 rounded bg-slate-100 dark:bg-slate-800 animate-pulse w-1/2" /></td>
                      <td className="px-6 py-4"><div className="h-6 w-12 rounded-full bg-slate-100 dark:bg-slate-800 animate-pulse" /></td>
                      <td className="px-6 py-4"><div className="h-8 w-16 rounded-lg bg-slate-100 dark:bg-slate-800 animate-pulse ml-auto" /></td>
                    </tr>
                  ))
                ) : sounds.length > 0 ? (
                  sounds.map(sound => (
                    <tr key={sound._id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-8 h-8 rounded-lg bg-sky-500/10 flex items-center justify-center text-sky-500 shrink-0">
                            <Volume2 size={14} />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-black text-foreground group-hover:text-sky-500 transition-colors truncate">{sound.title}</p>
                            <p className="text-[11px] text-slate-400 font-medium truncate">{sound.slug}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-slate-600 dark:text-slate-400">
                        {getSoundCategoryName(sound)}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                          sound.isPublished !== false
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                            : 'bg-slate-200/80 dark:bg-slate-700/50 text-slate-500 border-slate-300 dark:border-slate-700'
                        }`}>
                          {sound.isPublished !== false ? 'Live' : 'Draft'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => openEdit(sound)}
                            className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-400 hover:text-sky-500 hover:border-sky-500/50 transition-all"
                            title="Edit"
                          >
                            <Edit3 size={14} />
                          </button>
                          <button
                            onClick={() => handleDelete(sound._id)}
                            disabled={deleteMutation.isPending && deleteMutation.variables === sound._id}
                            className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-400 hover:text-red-500 hover:border-red-500/50 transition-all disabled:opacity-50"
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
                      <Volume2 size={40} className="text-slate-200 dark:text-slate-700 mx-auto mb-4" />
                      <p className="text-slate-400 font-bold">No sounds found{query ? ` for "${query}"` : ''}.</p>
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

      {/* ── Drawer ─────────────────────────────────────────────────────────── */}
      <Drawer
        open={drawerOpen}
        onClose={closeDrawer}
        title={editingSound ? 'Edit Sound' : 'New Sound'}
        subtitle={editingSound ? editingSound.title : 'Fill in the details to add a new sound.'}
        width="max-w-2xl"
      >
        {/* key forces React to remount the form when editing a different sound */}
        <SoundForm
          key={editingSound?._id ?? 'new'}
          categories={categories}
          initialSound={editingSound}
          submitLabel={editingSound ? 'Save changes' : 'Create sound'}
          onSubmit={handleSubmit}
          onCancel={closeDrawer}
          saving={saving}
        />
      </Drawer>
    </>
  );
}
