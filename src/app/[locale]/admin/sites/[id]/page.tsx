'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Save } from 'lucide-react';
import api from '@/services/api';
import { useAdminSession } from '../../useAdminSession';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import { SiteConfig } from '@/config/sites';

export default function AdminSiteEditorPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;
  const isNew = id === 'new';

  const { ready } = useAdminSession();
  const router = useRouter();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState<Partial<SiteConfig>>({
    id: undefined,
    domains: [],
    siteName: '',
    wordmark: { line1: '', accent: '' },
    siteUrl: '',
    logo: '',
    ogImage: '',
    themeColor: '#000000',
    primaryColor: '#000000',
    primaryHoverColor: '#000000',
    contactEmail: '',
    dmcaEmail: '',
    twitterHandle: '',
    meta: {
      home: { title: '', description: '', keywords: '', h1: '' },
      trending: { title: '', description: '', h1: '', shortDescription: '', keywords: '' },
      new: { title: '', description: '', h1: '', shortDescription: '', keywords: '' },
      categories: { title: '', description: '' },
      categoryDetail: { titleTemplate: '', descriptionTemplate: '', h1Template: '', keywordsTemplate: '' },
      soundDetail: { h1Template: '', descriptionTemplate: '', keywordsTemplate: '' },
      search: { titleTemplate: '', descriptionTemplate: '', h1Template: '' },
    }
  });

  const { data: site, isLoading: isFetching } = useQuery({
    queryKey: ['admin-site', id],
    queryFn: async () => {
      if (isNew) return null;
      const res = await api.get(`/sites/${id}`);
      return res.data;
    },
    enabled: ready && !isNew,
  });

  useEffect(() => {
    if (site) {
      setFormData(site);
    }
  }, [site]);

  const saveMutation = useMutation({
    mutationFn: async (data: Partial<SiteConfig>) => {
      if (isNew) {
        return api.post('/sites', data);
      } else {
        // Assume API takes _id in path
        return api.put(`/sites/${(site as any)?._id}`, data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-sites'] });
      toast.success(`Site ${isNew ? 'created' : 'updated'} successfully`);
      router.push('/admin/sites');
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Failed to save site.');
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveMutation.mutate(formData);
  };

  const handleJsonChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    try {
      const parsed = JSON.parse(e.target.value);
      setFormData(parsed);
    } catch (err) {
      // Don't update state if JSON is invalid while typing
    }
  };

  if (!ready || isFetching) {
    return (
      <div className="flex items-center justify-center min-h-[400px] text-slate-500 font-bold animate-pulse">
        Loading...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20 animate-in fade-in duration-500">
      <div className="flex items-center justify-between gap-4 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 shadow-sm">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/sites"
            className="w-10 h-10 rounded-full flex items-center justify-center border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-slate-500 dark:text-slate-400 hover:text-foreground"
          >
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h2 className="text-xl font-black tracking-tight">{isNew ? 'Create New Site' : `Edit Site: ${formData.siteName || formData.id}`}</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Define domains, languages, colors, and meta schemas.</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 shadow-sm space-y-6">
          <h3 className="text-lg font-black tracking-tight">Configuration (JSON JSON)</h3>
          <p className="text-sm text-slate-500 mb-4">
            For advanced configuration, please edit the JSON directly. Make sure the structure matches `SiteConfig` exactly.
          </p>
          <textarea
            className="w-full h-[600px] font-mono text-xs p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-slate-300 outline-none focus:ring-2 focus:ring-sky-500/20"
            defaultValue={JSON.stringify(formData, null, 2)}
            onChange={handleJsonChange}
          />
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
          <Link
            href="/admin/sites"
            className="px-6 py-3 rounded-xl font-black text-sm uppercase tracking-widest border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saveMutation.isPending}
            className="flex items-center gap-2 px-8 py-3 rounded-xl font-black text-sm uppercase tracking-widest bg-sky-500 text-white hover:bg-sky-600 transition-colors active:scale-95 disabled:opacity-50 disabled:active:scale-100 shadow-lg shadow-sky-500/20"
          >
            <Save size={16} />
            {saveMutation.isPending ? 'Saving...' : 'Save Site'}
          </button>
        </div>
      </form>
    </div>
  );
}
