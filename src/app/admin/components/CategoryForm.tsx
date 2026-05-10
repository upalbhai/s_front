'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { AdminCategory } from '../admin-types';

interface CategoryFormValues {
  name: string;
  slug: string;
  description: string;
  icon: string;
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
  icon: 'music_note',
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
    icon: cat.icon ?? 'music_note',
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
      icon: values.icon.trim(),
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
      {/* Tabs (Shadcn component) */}
      <Tabs value={activeTab} onValueChange={(val) => setActiveTab(val as 'core' | 'seo')} className="w-full">
        <TabsList className="grid grid-cols-2 w-full bg-zinc-100/80 dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800/50 p-1 rounded-xl h-12! items-stretch">
          <TabsTrigger value="core" className="h-full rounded-lg text-sm font-bold transition-all duration-200 data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-900 data-[state=active]:text-zinc-950 dark:data-[state=active]:text-zinc-50 data-[state=active]:shadow-xs border border-transparent data-[state=active]:border-zinc-200/80 dark:data-[state=active]:border-zinc-800/80 cursor-pointer py-0">
            Core Details
          </TabsTrigger>
          <TabsTrigger value="seo" className="h-full rounded-lg text-sm font-bold transition-all duration-200 data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-900 data-[state=active]:text-zinc-950 dark:data-[state=active]:text-zinc-50 data-[state=active]:shadow-xs border border-transparent data-[state=active]:border-zinc-200/80 dark:data-[state=active]:border-zinc-800/80 cursor-pointer py-0">
            SEO & Metadata
          </TabsTrigger>
        </TabsList>
      </Tabs>

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
            <div className="relative flex items-center">
              <input
                className={`${inputClass} pr-24`}
                value={values.slug}
                onChange={e => set('slug', e.target.value)}
                placeholder="meme-sounds"
                required
              />
              <button
                type="button"
                onClick={() => {
                  const generatedSlug = values.name
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, '-')
                    .replace(/^-|-$/g, '');
                  set('slug', generatedSlug);
                }}
                className="absolute right-3 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all active:scale-95"
              >
                Auto-fill
              </button>
            </div>
          </div>
          <div>
            <label className={labelClass}>Category Icon (Google Icon)</label>
            <Select value={values.icon} onValueChange={(val) => set('icon', val)}>
              <SelectTrigger className="w-full flex items-center justify-between text-left cursor-pointer font-bold px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-foreground h-auto outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500/50 transition-all text-sm">
                <div className="flex items-center gap-3">
                  <span className="text-lg">
                    {values.icon === 'music_note' && '♪'}
                    {values.icon === 'sports_esports' && '🎮'}
                    {values.icon === 'movie' && '🎬'}
                    {values.icon === 'pets' && '🐾'}
                    {values.icon === 'celebration' && '🎉'}
                    {values.icon === 'campaign' && '📣'}
                    {values.icon === 'emoji_emotions' && '😂'}
                    {values.icon === 'face' && '👤'}
                    {values.icon === 'tv' && '📺'}
                    {values.icon === 'star' && '⭐'}
                    {values.icon === 'volume_up' && '🔊'}
                    {values.icon === 'notifications' && '🔔'}
                    {values.icon === 'theater_comedy' && '🎭'}
                    {values.icon === 'graphic_eq' && '📊'}
                    {values.icon === 'podcasts' && '🎙️'}
                  </span>
                  <span>
                    {values.icon === 'music_note' && 'Music / Beep'}
                    {values.icon === 'sports_esports' && 'Gaming'}
                    {values.icon === 'movie' && 'Cinema / Movies'}
                    {values.icon === 'pets' && 'Animals / Pets'}
                    {values.icon === 'celebration' && 'Party / FX'}
                    {values.icon === 'campaign' && 'Megaphone / Airhorn'}
                    {values.icon === 'emoji_emotions' && 'Funny / Troll'}
                    {values.icon === 'face' && 'Anime / Voices'}
                    {values.icon === 'tv' && 'TV / Series'}
                    {values.icon === 'star' && 'Celebrity / Star'}
                    {values.icon === 'volume_up' && 'Sound Effect'}
                    {values.icon === 'notifications' && 'Bell / Alert'}
                    {values.icon === 'theater_comedy' && 'Comedy / Humour'}
                    {values.icon === 'graphic_eq' && 'Voice Wave'}
                    {values.icon === 'podcasts' && 'Podcast'}
                  </span>
                </div>
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800/80 rounded-2xl shadow-xl p-1.5 max-h-64 overflow-y-auto">
                {[
                  { value: 'music_note', label: 'Music / Beep', emoji: '♪' },
                  { value: 'sports_esports', label: 'Gaming', emoji: '🎮' },
                  { value: 'movie', label: 'Cinema / Movies', emoji: '🎬' },
                  { value: 'pets', label: 'Animals / Pets', emoji: '🐾' },
                  { value: 'celebration', label: 'Party / FX', emoji: '🎉' },
                  { value: 'campaign', label: 'Megaphone / Airhorn', emoji: '📣' },
                  { value: 'emoji_emotions', label: 'Funny / Troll', emoji: '😂' },
                  { value: 'face', label: 'Anime / Voices', emoji: '👤' },
                  { value: 'tv', label: 'TV / Series', emoji: '📺' },
                  { value: 'star', label: 'Celebrity / Star', emoji: '⭐' },
                  { value: 'volume_up', label: 'Sound Effect', emoji: '🔊' },
                  { value: 'notifications', label: 'Bell / Alert', emoji: '🔔' },
                  { value: 'theater_comedy', label: 'Comedy / Humour', emoji: '🎭' },
                  { value: 'graphic_eq', label: 'Voice Wave', emoji: '📊' },
                  { value: 'podcasts', label: 'Podcast', emoji: '🎙️' },
                ].map((opt) => (
                  <SelectItem
                    key={opt.value}
                    value={opt.value}
                    className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-bold text-left hover:bg-slate-50 dark:hover:bg-zinc-900/60 focus:bg-slate-50 dark:focus:bg-zinc-900/60 cursor-pointer transition-colors"
                  >
                    <span className="flex items-center gap-3 w-full">
                      <span className="text-base">{opt.emoji}</span>
                      <span>{opt.label}</span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
