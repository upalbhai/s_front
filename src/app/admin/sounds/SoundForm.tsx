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

export default function SoundForm({ categories, initialSound, submitLabel, onSubmit, onCancel, saving }: SoundFormProps) {
  const [values, setValues] = useState<SoundFormValues>(() => toValues(initialSound));
  const [soundFile, setSoundFile] = useState<File | null>(null);
  const [activeTab, setActiveTab] = useState<'core' | 'media' | 'seo'>('core');
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

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
    { key: 'core', label: 'Core Details' },
    { key: 'media', label: 'Media & File' },
    { key: 'seo', label: 'SEO Settings' },
  ] as const;

  const inputClass = `w-full rounded-2xl border px-4 py-3.5 outline-none font-bold text-sm transition-all duration-300 ${
    isDark
      ? 'bg-zinc-950 border-zinc-800 text-white focus-within:ring-2 focus-within:ring-zinc-800 focus-within:border-zinc-700 placeholder:text-zinc-600'
      : 'bg-zinc-50 border-zinc-200 text-zinc-900 focus-within:ring-2 focus-within:ring-zinc-200 focus-within:border-zinc-300 placeholder:text-zinc-400'
  }`;

  const labelClass = `text-[10px] font-black uppercase tracking-widest mb-1.5 block ${
    isDark ? 'text-zinc-500' : 'text-zinc-400'
  }`;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Tabs */}
      <div className={`flex gap-1 p-1 rounded-2xl border transition-colors duration-300 ${
        isDark ? 'bg-zinc-950 border-zinc-800/80' : 'bg-zinc-100/80 border-zinc-200'
      }`}>
        {tabs.map(tab => {
          const isActive = activeTab === tab.key;
          const activeStyle = isDark
            ? 'bg-zinc-900 text-white shadow-sm font-black'
            : 'bg-white text-zinc-900 shadow-sm font-black';
          const inactiveStyle = isDark
            ? 'text-zinc-500 hover:text-zinc-300 font-bold'
            : 'text-zinc-500 hover:text-zinc-800 font-bold';

          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 py-2.5 px-3 rounded-xl text-xs uppercase tracking-wider transition-all ${
                isActive ? activeStyle : inactiveStyle
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Core Tab */}
      {activeTab === 'core' && (
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
        </div>
      )}

      {/* Media Tab */}
      {activeTab === 'media' && (
        <div className={`p-6 rounded-3xl border transition-colors duration-300 space-y-5 ${
          isDark ? 'border-zinc-800 bg-zinc-900/40 text-white' : 'border-zinc-200 bg-white text-zinc-900 shadow-sm'
        }`}>
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
          </div>
          <div>
            <label className={labelClass}>Or External File URL</label>
            <input
              className={inputClass}
              value={values.fileUrl}
              onChange={e => set('fileUrl', e.target.value)}
              placeholder="https://cdn.example.com/vine-boom.mp3"
            />
            <p className={`text-[10px] uppercase font-black mt-1.5 tracking-wider ${isDark ? 'text-zinc-600' : 'text-zinc-400'}`}>Leave blank if uploading a file above.</p>
          </div>
          <div>
            <label className={labelClass}>Audio Duration</label>
            <input
              className={inputClass}
              value={values.audioDuration}
              onChange={e => set('audioDuration', e.target.value)}
              placeholder="PT0H0M1S or 00:01"
            />
            <p className={`text-[10px] uppercase font-black mt-1.5 tracking-wider ${isDark ? 'text-zinc-600' : 'text-zinc-400'}`}>ISO 8601 format preferred for structured data.</p>
          </div>
        </div>
      )}

      {/* SEO Tab */}
      {activeTab === 'seo' && (
        <div className={`p-6 rounded-3xl border transition-colors duration-300 space-y-5 ${
          isDark ? 'border-zinc-800 bg-zinc-900/40 text-white' : 'border-zinc-200 bg-white text-zinc-900 shadow-sm'
        }`}>
          <div>
            <label className={labelClass}>SEO Title</label>
            <input
              className={inputClass}
              value={values.seoTitle}
              onChange={e => set('seoTitle', e.target.value)}
              placeholder="Vine Boom Sound Button – Play Free Online"
            />
            <p className={`text-[10px] uppercase font-black mt-1.5 tracking-wider ${isDark ? 'text-zinc-600' : 'text-zinc-400'}`}>Recommended: 50-60 characters</p>
          </div>
          <div>
            <label className={labelClass}>Meta Description</label>
            <textarea
              className={`${inputClass} resize-y`}
              value={values.seoDescription}
              onChange={e => set('seoDescription', e.target.value)}
              placeholder="Play the viral Vine Boom sound for free. Instant playback, no sign-up needed."
              rows={3}
            />
            <p className={`text-[10px] uppercase font-black mt-1.5 tracking-wider ${isDark ? 'text-zinc-600' : 'text-zinc-400'}`}>Recommended: 150-160 characters</p>
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
              className={`${inputClass} resize-y`}
              value={values.howToUse}
              onChange={e => set('howToUse', e.target.value)}
              placeholder="Click the button to play. Right-click to download."
              rows={3}
            />
          </div>
          <div>
            <label className={labelClass}>Download Info</label>
            <textarea
              className={`${inputClass} resize-y`}
              value={values.downloadInfo}
              onChange={e => set('downloadInfo', e.target.value)}
              placeholder="Free to download as MP3. No attribution required."
              rows={3}
            />
          </div>
          <div>
            <label className={labelClass}>Transcript / Lyrics</label>
            <textarea
              className={`${inputClass} resize-y`}
              value={values.transcript}
              onChange={e => set('transcript', e.target.value)}
              placeholder="[BOOM]"
              rows={4}
            />
          </div>
        </div>
      )}

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
