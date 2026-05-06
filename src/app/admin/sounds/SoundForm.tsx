'use client';

import { useState } from 'react';
import type { AdminCategory, AdminSound } from '../admin-types';
import { getSoundCategoryId } from '../admin-types';

interface SoundFormValues {
  title: string;
  slug: string;
  category: string;
  fileUrl: string;
  description: string;
  seoTitle: string;
  seoDescription: string;
  ogImage: string;
  howToUse: string;
  downloadInfo: string;
  transcript: string;
  audioDuration: string;
  tags: string;
  isPublished: boolean;
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
  seoTitle: '',
  seoDescription: '',
  ogImage: '',
  howToUse: '',
  downloadInfo: '',
  transcript: '',
  audioDuration: '',
  tags: '',
  isPublished: true,
};

function toValues(sound?: AdminSound | null): SoundFormValues {
  if (!sound) return defaultValues;
  return {
    title: sound.title ?? '',
    slug: sound.slug ?? '',
    category: getSoundCategoryId(sound),
    fileUrl: sound.fileUrl ?? '',
    description: sound.description ?? '',
    seoTitle: sound.seoTitle ?? '',
    seoDescription: sound.seoDescription ?? '',
    ogImage: sound.ogImage ?? '',
    howToUse: sound.howToUse ?? '',
    downloadInfo: sound.downloadInfo ?? '',
    transcript: sound.transcript ?? '',
    audioDuration: sound.audioDuration ?? '',
    tags: Array.isArray(sound.tags) ? sound.tags.join(', ') : '',
    isPublished: sound.isPublished !== false,
  };
}

const inputClass = 'w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-foreground placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500/50 transition-all text-sm font-medium';
const labelClass = 'text-[11px] font-black uppercase tracking-widest text-slate-400 mb-1.5 block';

export default function SoundForm({ categories, initialSound, submitLabel, onSubmit, onCancel, saving }: SoundFormProps) {
  const [values, setValues] = useState<SoundFormValues>(() => toValues(initialSound));
  const [soundFile, setSoundFile] = useState<File | null>(null);
  const [activeTab, setActiveTab] = useState<'core' | 'media' | 'seo'>('core');

  const set = (field: keyof SoundFormValues, value: string | boolean) =>
    setValues(prev => ({ ...prev, [field]: value }));

  // Auto-generate slug from title
  const handleTitleChange = (title: string) => {
    set('title', title);
    if (!initialSound) {
      set('slug', title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''));
      set('seoTitle', title);
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
    formData.append('seoTitle', values.seoTitle.trim());
    formData.append('seoDescription', values.seoDescription.trim());
    formData.append('ogImage', values.ogImage.trim());
    formData.append('howToUse', values.howToUse.trim());
    formData.append('downloadInfo', values.downloadInfo.trim());
    formData.append('transcript', values.transcript.trim());
    formData.append('audioDuration', values.audioDuration.trim());
    formData.append('tags', values.tags.trim());
    formData.append('isPublished', values.isPublished ? 'true' : 'false');
    if (soundFile) formData.append('soundFile', soundFile);
    await onSubmit(formData);
  };

  const tabs = [
    { key: 'core', label: 'Core' },
    { key: 'media', label: 'Media' },
    { key: 'seo', label: 'SEO' },
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
            className={`flex-1 py-2 px-3 rounded-lg text-sm font-black transition-all ${
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
            <label className={labelClass}>Title <span className="text-red-400">*</span></label>
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
            <label className={labelClass}>Category <span className="text-red-400">*</span></label>
            <select
              className={inputClass}
              value={values.category}
              onChange={e => set('category', e.target.value)}
              required
            >
              <option value="">Select a category</option>
              {categories.map(cat => (
                <option key={cat._id} value={cat._id}>{cat.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>Tags <span className="text-slate-300">(comma-separated)</span></label>
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
              className={`${inputClass} resize-none`}
              value={values.description}
              onChange={e => set('description', e.target.value)}
              placeholder="A short description of this sound."
              rows={3}
            />
          </div>
          <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
            <input
              type="checkbox"
              id="isPublished"
              checked={values.isPublished}
              onChange={e => set('isPublished', e.target.checked)}
              className="w-4 h-4 accent-sky-500"
            />
            <div>
              <label htmlFor="isPublished" className="font-black text-sm text-foreground cursor-pointer">Published</label>
              <p className="text-xs text-slate-400 mt-0.5">Unpublished sounds are hidden from public pages.</p>
            </div>
          </div>
        </div>
      )}

      {/* Media Tab */}
      {activeTab === 'media' && (
        <div className="space-y-5">
          <div>
            <label className={labelClass}>Upload Audio File</label>
            <div className="relative">
              <input
                type="file"
                accept="audio/*"
                onChange={e => setSoundFile(e.target.files?.[0] ?? null)}
                className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-black file:bg-sky-500/10 file:text-sky-500 hover:file:bg-sky-500/20 transition-all cursor-pointer"
              />
            </div>
            {soundFile && (
              <p className="text-xs text-emerald-500 mt-2 font-bold">✓ {soundFile.name}</p>
            )}
          </div>
          <div>
            <label className={labelClass}>Or External File URL</label>
            <input
              className={inputClass}
              value={values.fileUrl}
              onChange={e => set('fileUrl', e.target.value)}
              placeholder="https://cdn.example.com/vine-boom.mp3"
            />
            <p className="text-[11px] text-slate-400 mt-1.5">Leave blank if uploading a file above.</p>
          </div>
          <div>
            <label className={labelClass}>Audio Duration</label>
            <input
              className={inputClass}
              value={values.audioDuration}
              onChange={e => set('audioDuration', e.target.value)}
              placeholder="PT0H0M1S or 00:01"
            />
            <p className="text-[11px] text-slate-400 mt-1.5">ISO 8601 format preferred for structured data.</p>
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
              placeholder="Vine Boom Sound Button – Play Free Online"
            />
            <p className="text-[11px] text-slate-400 mt-1.5">Recommended: 50-60 characters</p>
          </div>
          <div>
            <label className={labelClass}>Meta Description</label>
            <textarea
              className={`${inputClass} resize-none`}
              value={values.seoDescription}
              onChange={e => set('seoDescription', e.target.value)}
              placeholder="Play the viral Vine Boom sound for free. Instant playback, no sign-up needed."
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
              placeholder="https://your-cdn.com/og/vine-boom.jpg"
            />
          </div>
          <div>
            <label className={labelClass}>How To Use</label>
            <textarea
              className={`${inputClass} resize-none`}
              value={values.howToUse}
              onChange={e => set('howToUse', e.target.value)}
              placeholder="Click the button to play. Right-click to download."
              rows={3}
            />
          </div>
          <div>
            <label className={labelClass}>Download Info</label>
            <textarea
              className={`${inputClass} resize-none`}
              value={values.downloadInfo}
              onChange={e => set('downloadInfo', e.target.value)}
              placeholder="Free to download as MP3. No attribution required."
              rows={3}
            />
          </div>
          <div>
            <label className={labelClass}>Transcript / Lyrics</label>
            <textarea
              className={`${inputClass} resize-none`}
              value={values.transcript}
              onChange={e => set('transcript', e.target.value)}
              placeholder="[BOOM]"
              rows={4}
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
            className="px-6 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-black text-slate-500 hover:text-foreground transition-all"
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
