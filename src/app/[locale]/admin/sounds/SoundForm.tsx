'use client';

import { useState, useEffect } from 'react';
import type { AdminCategory, AdminSound } from '../admin-types';
import { getSoundCategoryId } from '../admin-types';
import { useTheme } from 'next-themes';

interface SoundFormValues {
  title: string;
  slug: string;
  category: string;
  fileUrl: string;
  description: string;
  tags: string;
  isPublished: boolean;
  siteIds: string[];
}

interface SoundFormProps {
  categories: AdminCategory[];
  initialSound?: AdminSound | null;
  submitLabel: string;
  onSubmit: (formData: FormData) => Promise<void> | void;
  onCancel?: () => void;
  saving?: boolean;
}

const defaultValues: SoundFormValues = {
  title: '',
  slug: '',
  category: '',
  fileUrl: '',
  description: '',
  tags: '',
  isPublished: true,
  siteIds: [],
};

function toValues(sound?: AdminSound | null): SoundFormValues {
  if (!sound) return defaultValues;
  return {
    title: sound.title ?? '',
    slug: sound.slug ?? '',
    category: getSoundCategoryId(sound),
    fileUrl: sound.fileUrl ?? '',
    description: sound.description ?? '',
    tags: Array.isArray(sound.tags) ? sound.tags.join(', ') : '',
    isPublished: sound.isPublished !== false,
    siteIds: Array.isArray(sound.siteIds) ? sound.siteIds : [],
  };
}

import { useQuery } from '@tanstack/react-query';
import api from '@/services/api';

export default function SoundForm({ categories, initialSound, submitLabel, onSubmit, onCancel, saving }: SoundFormProps) {
  const [values, setValues] = useState<SoundFormValues>(() => toValues(initialSound));
  const [soundFile, setSoundFile] = useState<File | null>(null);
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const { data: sites = [] } = useQuery({
    queryKey: ['admin-sites-list'],
    queryFn: async () => {
      const res = await api.get('/sites/admin');
      return res.data as { id: string; siteName: string }[];
    }
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && resolvedTheme === 'dark';

  const set = (field: keyof SoundFormValues, value: string | boolean) =>
    setValues(prev => ({ ...prev, [field]: value }));

  const handleTitleChange = (title: string) => {
    set('title', title);
    if (!initialSound) {
      set('slug', title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', values.title.trim());
    formData.append('slug', values.slug.trim());
    formData.append('category', values.category);
    formData.append('fileUrl', values.fileUrl.trim());
    formData.append('description', values.description.trim());
    formData.append('tags', values.tags.trim());
    formData.append('isPublished', values.isPublished ? 'true' : 'false');
    formData.append('siteIds', JSON.stringify(values.siteIds));
    if (soundFile) formData.append('soundFile', soundFile);
    await onSubmit(formData);
  };

  const inputClass = `w-full rounded-2xl border px-4 py-3.5 outline-none font-bold text-sm transition-all duration-300 ${
    isDark
      ? 'bg-zinc-950 border-zinc-800 text-white focus-within:ring-2 focus-within:ring-zinc-800 focus-within:border-zinc-700 placeholder:text-zinc-600'
      : 'bg-zinc-50 border-zinc-200 text-zinc-900 focus-within:ring-2 focus-within:ring-zinc-200 focus-within:border-zinc-300 placeholder:text-zinc-400'
  }`;

  const labelClass = `text-[10px] font-black uppercase tracking-widest mb-1.5 block ${
    isDark ? 'text-zinc-500' : 'text-zinc-400'
  }`;

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
      <div className={`p-6 rounded-3xl border transition-colors duration-300 space-y-5 ${
        isDark ? 'border-zinc-800 bg-zinc-900/40 text-white' : 'border-zinc-200 bg-white text-zinc-900 shadow-sm'
      }`}>
        <div>
          <label className={labelClass}>Title <span className="text-red-500">*</span></label>
          <input
            className={inputClass}
            value={values.title}
            onChange={e => handleTitleChange(e.target.value)}
            placeholder="Vine Boom"
            required
          />
        </div>
        <div>
          <label className={labelClass}>Slug</label>
          <input
            className={inputClass}
            value={values.slug}
            onChange={e => set('slug', e.target.value)}
            placeholder="vine-boom"
          />
        </div>
        <div>
          <label className={labelClass}>Category <span className="text-red-500">*</span></label>
          <select
            className={inputClass}
            value={values.category}
            onChange={e => set('category', e.target.value)}
            required
          >
            <option value="">Select a category</option>
            {categories.map(cat => (
              <option key={cat._id} value={cat._id} className={isDark ? 'bg-zinc-900 text-white' : 'bg-white text-zinc-900'}>{cat.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass}>Upload Audio File</label>
          <div className="relative">
            <input
              type="file"
              accept="audio/*"
              onChange={e => setSoundFile(e.target.files?.[0] ?? null)}
              className={`w-full text-xs font-bold ${
                isDark ? 'text-zinc-400' : 'text-zinc-600'
              } file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-black file:uppercase file:tracking-wider ${
                isDark ? 'file:bg-zinc-800 file:text-white hover:file:bg-zinc-700' : 'file:bg-zinc-100 file:text-zinc-900 hover:file:bg-zinc-200'
              } transition-all cursor-pointer`}
            />
          </div>
          {soundFile && (
            <p className="text-xs text-emerald-500 mt-2 font-black">✓ {soundFile.name}</p>
          )}
          {values.fileUrl && !soundFile && (
            <p className="text-xs text-sky-500 mt-2 font-black">Current File: {values.fileUrl.split('/').pop()}</p>
          )}
        </div>
        <div>
          <label className={labelClass}>Tags <span className={isDark ? 'text-zinc-600' : 'text-zinc-400'}>(comma-separated)</span></label>
          <input
            className={inputClass}
            value={values.tags}
            onChange={e => set('tags', e.target.value)}
            placeholder="meme, vine, boom, funny"
          />
        </div>
        <div>
          <label className={labelClass}>Description</label>
          <textarea
            className={`${inputClass} resize-y`}
            value={values.description}
            onChange={e => set('description', e.target.value)}
            placeholder="A short description of this sound."
            rows={3}
          />
        </div>
        <div className={`flex items-center gap-3 p-4 rounded-2xl border transition-colors duration-300 ${
          isDark ? 'border-zinc-800 bg-zinc-950/40' : 'border-zinc-200 bg-zinc-50'
        }`}>
          <input
            type="checkbox"
            id="isPublished"
            checked={values.isPublished}
            onChange={e => set('isPublished', e.target.checked)}
            className="w-4 h-4 rounded border-zinc-300 dark:border-zinc-700 accent-sky-500 cursor-pointer"
          />
          <div>
            <label htmlFor="isPublished" className="font-black text-sm text-foreground cursor-pointer">Published</label>
            <p className={`text-[11px] mt-0.5 ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>Unpublished sounds are hidden from public pages.</p>
          </div>
        </div>
        
        <div className={`p-4 rounded-2xl border transition-colors duration-300 ${
          isDark ? 'border-zinc-800 bg-zinc-950/40' : 'border-zinc-200 bg-zinc-50'
        }`}>
          <label className="font-black text-sm text-foreground block mb-2">Target Sites</label>
          <p className={`text-[11px] mb-4 ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>
            Select which sites this sound should appear on. If none are selected, it will appear on ALL sites.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {sites.map(site => {
              const isChecked = values.siteIds.includes(site.id);
              return (
                <label key={site.id} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={(e) => {
                      if (e.target.checked) {
                        set('siteIds', [...values.siteIds, site.id] as any);
                      } else {
                        set('siteIds', values.siteIds.filter(id => id !== site.id) as any);
                      }
                    }}
                    className="w-4 h-4 rounded border-zinc-300 dark:border-zinc-700 accent-sky-500 cursor-pointer"
                  />
                  <span className={`text-sm ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>{site.siteName}</span>
                </label>
              );
            })}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className={`flex justify-end gap-3 pt-6 border-t ${
        isDark ? 'border-zinc-800' : 'border-zinc-100'
      }`}>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className={`px-6 py-3.5 rounded-xl font-black text-xs uppercase tracking-widest border transition-all active:scale-95 ${
              isDark 
                ? 'border-zinc-800 bg-zinc-900 text-white hover:bg-zinc-800' 
                : 'border-zinc-200 bg-white text-zinc-900 hover:bg-zinc-50'
            }`}
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={saving}
          className={`px-8 py-3.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all active:scale-95 shadow-lg ${
            isDark 
              ? 'bg-white text-zinc-950 hover:bg-zinc-100 shadow-white/5' 
              : 'bg-zinc-950 text-white hover:bg-zinc-900 shadow-zinc-950/10'
          }`}
        >
          {saving ? 'Saving…' : submitLabel}
        </button>
      </div>
    </form>
  );
}
