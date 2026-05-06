'use client';

import { useState } from 'react';
import type { AdminCategory } from '../admin-types';

interface CategoryFormValues {
  name: string;
  slug: string;
  description: string;
  seoTitle: string;
  seoDescription: string;
  ogImage: string;
  seoText: string;
  canonicalUrl: string;
  priority: string;
  isIndexable: boolean;
}

interface CategoryFormProps {
  initialCategory?: AdminCategory | null;
  submitLabel: string;
  onSubmit: (data: Partial<AdminCategory>) => Promise<void> | void;
  onCancel?: () => void;
  saving?: boolean;
}

const defaultValues: CategoryFormValues = {
  name: '',
  slug: '',
  description: '',
  seoTitle: '',
  seoDescription: '',
  ogImage: '',
  seoText: '',
  canonicalUrl: '',
  priority: '0.8',
  isIndexable: true,
};

function toValues(cat?: AdminCategory | null): CategoryFormValues {
  if (!cat) return defaultValues;
  return {
    name: cat.name ?? '',
    slug: cat.slug ?? '',
    description: cat.description ?? '',
    seoTitle: cat.seoTitle ?? '',
    seoDescription: cat.seoDescription ?? '',
    ogImage: cat.ogImage ?? '',
    seoText: cat.seoText ?? '',
    canonicalUrl: cat.canonicalUrl ?? '',
    priority: String(cat.priority ?? 0.8),
    isIndexable: cat.isIndexable !== false,
  };
}

const inputClass = 'w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-foreground placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500/50 transition-all text-sm font-medium';
const labelClass = 'text-[11px] font-black uppercase tracking-widest text-slate-400 mb-1.5 block';

export default function CategoryForm({ initialCategory, submitLabel, onSubmit, onCancel, saving }: CategoryFormProps) {
  const [values, setValues] = useState<CategoryFormValues>(() => toValues(initialCategory));
  const [activeTab, setActiveTab] = useState<'core' | 'seo'>('core');

  const set = (field: keyof CategoryFormValues, value: string | boolean) =>
    setValues(prev => ({ ...prev, [field]: value }));

  // Auto-generate slug from name
  const handleNameChange = (name: string) => {
    set('name', name);
    if (!initialCategory) {
      set('slug', name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({
      name: values.name.trim(),
      slug: values.slug.trim(),
      description: values.description.trim(),
      seoTitle: values.seoTitle.trim(),
      seoDescription: values.seoDescription.trim(),
      ogImage: values.ogImage.trim(),
      seoText: values.seoText.trim(),
      canonicalUrl: values.canonicalUrl.trim(),
      priority: Number(values.priority),
      isIndexable: values.isIndexable,
    });
  };

  const tabs = [
    { key: 'core', label: 'Core Details' },
    { key: 'seo', label: 'SEO & Metadata' },
  ] as const;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-800">
        {tabs.map(tab => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-black transition-all ${
              activeTab === tab.key
                ? 'bg-white dark:bg-slate-700 text-foreground shadow-sm'
                : 'text-slate-500 hover:text-foreground'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Core Tab */}
      {activeTab === 'core' && (
        <div className="space-y-5">
          <div>
            <label className={labelClass}>Name <span className="text-red-400">*</span></label>
            <input
              className={inputClass}
              value={values.name}
              onChange={e => handleNameChange(e.target.value)}
              placeholder="Meme Sounds"
              required
            />
          </div>
          <div>
            <label className={labelClass}>Slug <span className="text-red-400">*</span></label>
            <input
              className={inputClass}
              value={values.slug}
              onChange={e => set('slug', e.target.value)}
              placeholder="meme-sounds"
              required
            />
          </div>
          <div>
            <label className={labelClass}>Description</label>
            <textarea
              className={`${inputClass} resize-none`}
              value={values.description}
              onChange={e => set('description', e.target.value)}
              placeholder="A short description shown on the category page."
              rows={4}
            />
          </div>
          <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
            <input
              type="checkbox"
              id="isIndexable"
              checked={values.isIndexable}
              onChange={e => set('isIndexable', e.target.checked)}
              className="w-4 h-4 accent-sky-500"
            />
            <div>
              <label htmlFor="isIndexable" className="font-black text-sm text-foreground cursor-pointer">Indexable by search engines</label>
              <p className="text-xs text-slate-400 mt-0.5">If off, a noindex tag will be added to this category page.</p>
            </div>
          </div>
        </div>
      )}

      {/* SEO Tab */}
      {activeTab === 'seo' && (
        <div className="space-y-5">
          <div>
            <label className={labelClass}>SEO Title</label>
            <input
              className={inputClass}
              value={values.seoTitle}
              onChange={e => set('seoTitle', e.target.value)}
              placeholder="Meme Sounds – Free Soundboard | SoundButtonsMax"
            />
            <p className="text-[11px] text-slate-400 mt-1.5">Recommended: 50-60 characters</p>
          </div>
          <div>
            <label className={labelClass}>Meta Description</label>
            <textarea
              className={`${inputClass} resize-none`}
              value={values.seoDescription}
              onChange={e => set('seoDescription', e.target.value)}
              placeholder="Browse 1000+ free meme sound buttons. Instant playback, no sign-up required."
              rows={3}
            />
            <p className="text-[11px] text-slate-400 mt-1.5">Recommended: 150-160 characters</p>
          </div>
          <div>
            <label className={labelClass}>OG Image URL</label>
            <input
              className={inputClass}
              value={values.ogImage}
              onChange={e => set('ogImage', e.target.value)}
              placeholder="https://your-cdn.com/og/meme-sounds.jpg"
            />
          </div>
          <div>
            <label className={labelClass}>Canonical URL</label>
            <input
              className={inputClass}
              value={values.canonicalUrl}
              onChange={e => set('canonicalUrl', e.target.value)}
              placeholder="https://soundbuttonsmax.com/meme-soundboard"
            />
          </div>
          <div>
            <label className={labelClass}>Sitemap Priority (0.1 – 1.0)</label>
            <input
              className={inputClass}
              type="number"
              step="0.1"
              min="0.1"
              max="1.0"
              value={values.priority}
              onChange={e => set('priority', e.target.value)}
            />
          </div>
          <div>
            <label className={labelClass}>SEO Article Text</label>
            <textarea
              className={`${inputClass} resize-none`}
              value={values.seoText}
              onChange={e => set('seoText', e.target.value)}
              placeholder="Rich article text that appears below the sound grid for SEO purposes..."
              rows={6}
            />
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-black text-slate-500 hover:text-foreground hover:border-slate-300 dark:hover:border-slate-600 transition-all"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={saving}
          className="px-8 py-3 rounded-xl bg-sky-500 text-white font-black text-sm hover:bg-sky-600 transition-all active:scale-95 shadow-lg shadow-sky-500/20 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {saving ? 'Saving…' : submitLabel}
        </button>
      </div>
    </form>
  );
}
