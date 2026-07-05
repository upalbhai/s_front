'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Edit3, FolderOpen, Plus, Trash2 } from 'lucide-react';
import api from '@/services/api';
import { AdminCategory } from '../admin-types';
import { useAdminSession } from '../useAdminSession';
import Drawer from '../components/Drawer';
import CategoryForm from '../components/CategoryForm';
import { toast } from 'react-hot-toast';
import { DataTable, ColumnDef } from '@/components/DataTable';

const COOLDOWN_SECONDS = 15;

async function fetchCategories(q: string, page: number, limit: number) {
  const params = new URLSearchParams({ limit: limit.toString(), page: page.toString(), admin: 'true' });
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
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [saving, setSaving] = useState(false);

  // Drawer state
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<AdminCategory | null>(null);
  const [formKey, setFormKey] = useState(0);

  // ── TanStack Query ────────────────────────────────────────────────────────
  const { data: catsData, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ['admin-categories', query, page, limit],
    queryFn: () => fetchCategories(query, page, limit),
    enabled: ready,
  });

  const categories = catsData?.categories ?? [];
  const total = catsData?.total ?? 0;

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

  const columns: ColumnDef<AdminCategory>[] = [
    {
      header: 'Name',
      id: 'name',
      render: (cat) => (
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-sky-500/10 flex items-center justify-center text-sky-500 shrink-0">
            <span className="material-icons text-sm">{cat.icon || 'music_note'}</span>
          </div>
          <div className="min-w-0">
            <p className="text-sm font-black text-foreground group-hover:text-sky-500 transition-colors truncate">{cat.name}</p>
            <p className="text-[11px] text-slate-400 font-medium truncate max-w-[220px]">{cat.description || 'No description'}</p>
          </div>
        </div>
      )
    },
    {
      header: 'Slug',
      id: 'slug',
      render: (cat) => (
        <span className="text-sm font-medium text-slate-500 dark:text-slate-400 font-mono">
          {cat.slug || '—'}
        </span>
      )
    },
    {
      header: 'State',
      id: 'state',
      render: (cat) => (
        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${cat.isIndexable !== false
          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
          : 'bg-slate-200/80 dark:bg-slate-700/50 text-slate-500 border-slate-300 dark:border-slate-700'
          }`}>
          {cat.isIndexable !== false ? 'Indexed' : 'Hidden'}
        </span>
      )
    },
    {
      header: 'Actions',
      id: 'actions',
      render: (cat) => (
        <div className="flex gap-2">
          <button
            onClick={(e) => { e.stopPropagation(); openEdit(cat); }}
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-foreground transition-all duration-200"
            title="Edit"
          >
            <Edit3 size={14} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); handleDelete(cat._id); }}
            disabled={deleteMutation.isPending && deleteMutation.variables === cat._id}
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-red-500 hover:border-red-500/30 transition-all duration-200 disabled:opacity-50"
            title="Delete"
          >
            <Trash2 size={14} />
          </button>
        </div>
      )
    }
  ];

  const newCategoryButton = (
    <button
      onClick={openCreate}
      className="flex items-center gap-2 px-5 py-2 rounded-full bg-sky-500 text-white font-black text-sm hover:bg-sky-600 transition-all active:scale-95 shadow-lg shadow-sky-500/20 whitespace-nowrap h-9"
    >
      <Plus size={16} />
      <span>New category</span>
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
          <p className="text-[10px] font-black uppercase tracking-widest text-sky-500 mb-1">Categories</p>
          <h2 className="text-2xl font-black tracking-tight text-foreground">
            Manage Categories
          </h2>
        </div>

        <DataTable
          columns={columns}
          data={categories}
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
          placeholderText="Search categories..."
          emptyStateText={query ? `No categories found for "${query}"` : "No categories found"}
          emptyStateIcon={<FolderOpen size={40} className="text-slate-200 dark:text-slate-700" />}
          filters={newCategoryButton}
          onClearFilters={() => setQuery('')}
          hasActiveFilters={!!query}
        />
      </div>

      <Drawer
        open={drawerOpen}
        onClose={closeDrawer}
        title={editingCategory ? 'Edit Category' : 'New Category'}
        subtitle={editingCategory ? editingCategory.name : 'Create a new soundboard category.'}
        width="max-w-2xl"
      >
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
