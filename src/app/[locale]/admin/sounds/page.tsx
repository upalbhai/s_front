'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Edit3, Plus, Trash2, Volume2, Play, Pause } from 'lucide-react';
import api from '@/services/api';
import { AdminCategory, AdminSound, getSoundCategoryName } from '../admin-types';
import { useAdminSession } from '../useAdminSession';
import Drawer from '../components/Drawer';
import SoundForm from './SoundForm';
import { useTheme } from 'next-themes';
import { toast } from 'react-hot-toast';
import useAudio from '@/hooks/useAudio';
import { DataTable, ColumnDef } from '@/components/DataTable';

const COOLDOWN_SECONDS = 15;

async function fetchSounds(q: string, page: number, limit: number) {
  const params = new URLSearchParams({ limit: limit.toString(), page: page.toString(), admin: 'true' });
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
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [saving, setSaving] = useState(false);

  const { currentSound, isPlaying: globalIsPlaying, playSound } = useAudio();

  const isSoundPlaying = (soundId: string) => currentSound?._id === soundId && globalIsPlaying;

  const handlePlayClick = (sound: AdminSound) => {
    playSound({
      _id: sound._id,
      title: sound.title,
      slug: sound.slug || '',
      fileUrl: sound.fileUrl || '',
      category: typeof sound.category === 'object' && sound.category ? {
        _id: sound.category._id,
        name: sound.category.name,
        slug: sound.category.slug || '',
      } : undefined,
    });
  };

  // Drawer state
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingSound, setEditingSound] = useState<AdminSound | null>(null);
  const [formKey, setFormKey] = useState(0);

  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && resolvedTheme === 'dark';

  // ── TanStack Query ────────────────────────────────────────────────────────
  const { data: soundsData, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ['admin-sounds', query, page, limit],
    queryFn: () => fetchSounds(query, page, limit),
    enabled: ready,
  });

  const { data: categories = [] } = useQuery({
    queryKey: ['admin-categories-list'],
    queryFn: fetchCategories,
    enabled: ready,
  });

  const sounds = soundsData?.sounds ?? [];
  const total = soundsData?.total ?? 0;

  // ── Delete mutation ───────────────────────────────────────────────────────
  const deleteMutation = useMutation({
    mutationFn: (soundId: string) => api.delete(`/sounds/${soundId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-sounds'] });
      toast.success('Sound deleted successfully');
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message ?? 'Failed to delete sound.');
    }
  });

  const handleDelete = async (soundId: string) => {
    if (!window.confirm('Delete this sound? This cannot be undone.')) return;
    deleteMutation.mutate(soundId);
  };

  // ── Drawer CRUD ───────────────────────────────────────────────────────────
  const openCreate = () => { setEditingSound(null); setDrawerOpen(true); };
  const openEdit = (sound: AdminSound) => { setEditingSound(sound); setDrawerOpen(true); };
  const closeDrawer = () => {
    setDrawerOpen(false);
    setEditingSound(null);
    setFormKey(prev => prev + 1);
  };

  const handleSubmit = async (formData: FormData) => {
    setSaving(true);
    try {
      if (editingSound) {
        await api.put(`/sounds/${editingSound._id}`, formData);
      } else {
        await api.post('/sounds', formData);
      }
      closeDrawer();
      queryClient.invalidateQueries({ queryKey: ['admin-sounds'] });
      toast.success(editingSound ? 'Sound updated successfully' : 'Sound created successfully');
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? 'Failed to save sound.');
    } finally {
      setSaving(false);
    }
  };

  const columns: ColumnDef<AdminSound>[] = [
    {
      id: 'play',
      header: '',
      render: (sound) => (
        <button
          onClick={(e) => { e.stopPropagation(); handlePlayClick(sound); }}
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
            isSoundPlaying(sound._id)
              ? 'bg-sky-500 text-white shadow-md shadow-sky-500/30'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-500 group-hover:bg-sky-500 group-hover:text-white group-hover:shadow-md'
          }`}
        >
          {isSoundPlaying(sound._id) ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" className="ml-0.5" />}
        </button>
      )
    },
    {
      id: 'name',
      header: 'Sound & Slug',
      render: (sound) => (
        <div className="min-w-0 pr-4">
          <p className="text-sm font-black text-foreground group-hover:text-sky-500 transition-colors truncate">
            {sound.title}
          </p>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-[11px] font-mono text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
              {sound.slug || '—'}
            </span>
          </div>
        </div>
      )
    },
    {
      id: 'category',
      header: 'Category',
      render: (sound) => (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
          {getSoundCategoryName(sound)}
        </span>
      )
    },
    {
      id: 'state',
      header: 'State',
      render: (sound) => (
        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${
          sound.isPublished !== false
            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
            : 'bg-slate-200/80 dark:bg-slate-700/50 text-slate-500 border-slate-300 dark:border-slate-700'
        }`}>
          {sound.isPublished !== false ? 'Published' : 'Hidden'}
        </span>
      )
    },
    {
      id: 'actions',
      header: 'Actions',
      render: (sound) => (
        <div className="flex justify-end gap-2 pr-4">
          <button
            onClick={(e) => { e.stopPropagation(); openEdit(sound); }}
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-foreground transition-all duration-200"
            title="Edit"
          >
            <Edit3 size={14} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); handleDelete(sound._id); }}
            disabled={deleteMutation.isPending && deleteMutation.variables === sound._id}
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-red-500 hover:border-red-500/30 transition-all duration-200 disabled:opacity-50"
            title="Delete"
          >
            <Trash2 size={14} />
          </button>
        </div>
      )
    }
  ];

  const newSoundButton = (
    <button
      onClick={openCreate}
      className="flex items-center gap-2 px-5 py-2 rounded-full bg-sky-500 text-white font-black text-sm hover:bg-sky-600 transition-all active:scale-95 shadow-lg shadow-sky-500/20 whitespace-nowrap h-9"
    >
      <Plus size={16} />
      <span>New sound</span>
    </button>
  );

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
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-sky-500 mb-1">Sounds Library</p>
          <h2 className="text-2xl font-black tracking-tight text-foreground">
            Manage Sounds
          </h2>
        </div>

        <DataTable
          columns={columns}
          data={sounds}
          isLoading={isLoading || isRefetching}
          totalItems={total}
          page={page}
          limit={limit}
          onPageChange={setPage}
          onLimitChange={setLimit}
          searchQuery={query}
          onSearchChange={setQuery}
          onRefetch={refetch}
          refetchIntervalSeconds={COOLDOWN_SECONDS}
          placeholderText="Search sounds by title, slug or tags..."
          emptyStateText={query ? `No sounds found for "${query}"` : "No sounds found"}
          emptyStateIcon={<Volume2 size={40} className="text-slate-200 dark:text-slate-700" />}
          filters={newSoundButton}
          onClearFilters={() => setQuery('')}
          hasActiveFilters={!!query}
        />
      </div>

      <Drawer
        open={drawerOpen}
        onClose={closeDrawer}
        title={editingSound ? 'Edit Sound' : 'New Sound'}
        subtitle={editingSound ? editingSound.title : 'Upload a new audio clip to the soundboard.'}
        width="max-w-2xl"
      >
        <SoundForm
          key={editingSound?._id ? `${editingSound._id}-${formKey}` : `new-${formKey}`}
          initialSound={editingSound}
          categories={categories}
          submitLabel={editingSound ? 'Save changes' : 'Upload sound'}
          onSubmit={handleSubmit}
          onCancel={closeDrawer}
          saving={saving}
        />
      </Drawer>
    </>
  );
}
