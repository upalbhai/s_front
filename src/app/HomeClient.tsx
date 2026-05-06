'use client';

import { useState } from 'react';
import SoundCard from '../components/SoundCard';
import { Search, TrendingUp, Sparkles, LayoutGrid, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function HomeClient({ trendingSounds, newSounds, categories, searchResults, searchQuery }: any) {
  const [localSearch, setLocalSearch] = useState(searchQuery || '');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (localSearch.trim()) {
      window.location.href = `/?q=${encodeURIComponent(localSearch)}`;
    }
  };

  return (
    <div className="homepage animate-in fade-in duration-700">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-24 md:pt-32 md:pb-40 text-center">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-radial from-primary/10 via-transparent to-transparent -z-10 pointer-events-none" />
        
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-7xl font-black tracking-tighter leading-tight mb-6 text-foreground drop-shadow-sm">
            Unlimited Free Meme <br /> <span className="text-primary">Sound Buttons</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto mb-12 font-medium">
            World's largest library of viral sounds, meme clips, and sound effects. Unblocked and free forever.
          </p>
          
          <form onSubmit={handleSearch} className="max-w-3xl mx-auto p-2 rounded-2xl md:rounded-full bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col md:flex-row items-center gap-2 focus-within:ring-4 focus-within:ring-primary/10 transition-all">
            <div className="flex-1 flex items-center gap-3 px-4 w-full">
              <Search size={24} className="text-slate-400 shrink-0" />
              <input 
                type="text" 
                placeholder="Search Vine Boom, Bruh, Goofy Ahh..." 
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                className="w-full bg-transparent border-none outline-none py-3 text-lg font-bold text-foreground placeholder:text-slate-400"
              />
            </div>
            <button 
              type="submit" 
              className="w-full md:w-auto px-10 py-4 rounded-xl md:rounded-full bg-primary text-white font-black text-lg hover:bg-primary-hover hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/20"
            >
              Search
            </button>
          </form>

          <div className="mt-8 flex flex-wrap justify-center gap-4 text-sm font-bold text-slate-500">
            <span className="opacity-50">Popular:</span>
            {['Vine Boom', 'Bruh', 'Goofy Ahh'].map(tag => (
              <Link 
                key={tag}
                href={`/sound/${tag.toLowerCase().replace(' ', '-')}/1`} 
                className="hover:text-primary transition-colors hover:underline"
              >
                {tag}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Search Results */}
      {searchQuery && (
        <section className="container mx-auto px-4 py-16">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-1.5 h-8 bg-primary rounded-full" />
            <h2 className="text-3xl font-black tracking-tight text-foreground">Search Results for "{searchQuery}"</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {searchResults.map((sound: any) => (
              <SoundCard key={sound._id} sound={sound} />
            ))}
          </div>
          {searchResults.length === 0 && (
            <div className="text-center py-20 bg-slate-100 dark:bg-slate-900/50 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800">
              <p className="text-slate-500 font-bold italic text-xl">No sounds found matching your search.</p>
              <button onClick={() => window.location.href = '/'} className="mt-4 text-primary font-bold hover:underline">Clear search</button>
            </div>
          )}
          <div className="mt-16 border-t border-slate-200 dark:border-slate-800" />
        </section>
      )}

      {/* Trending Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-sky-500/10 flex items-center justify-center text-sky-500">
              <TrendingUp size={24} />
            </div>
            <h2 className="text-3xl font-black tracking-tight text-foreground">Trending Sounds</h2>
          </div>
          <Link href="/trending" className="flex items-center gap-1 font-bold text-slate-500 hover:text-foreground transition-colors group">
            See All <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {trendingSounds.map((sound: any) => (
            <SoundCard key={sound._id} sound={sound} />
          ))}
        </div>
      </section>

      {/* Categories Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="flex items-center gap-4 mb-10">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-500">
            <LayoutGrid size={24} />
          </div>
          <h2 className="text-3xl font-black tracking-tight text-foreground">Soundboard Categories</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat: any) => (
            <Link 
              href={`/${cat.slug}/${cat._id}`} 
              key={cat._id} 
              className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-1 transition-all group"
            >
              <div className="flex items-center gap-4">
                <span className="text-4xl grayscale group-hover:grayscale-0 transition-all duration-300">{cat.icon || '🎵'}</span>
                <div className="min-w-0">
                  <h3 className="text-lg font-bold text-foreground truncate">{cat.name}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-1">{cat.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* New Sounds Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
              <Sparkles size={24} />
            </div>
            <h2 className="text-3xl font-black tracking-tight text-foreground">New Sounds</h2>
          </div>
          <Link href="/new" className="flex items-center gap-1 font-bold text-slate-500 hover:text-foreground transition-colors group">
            See All <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {newSounds.map((sound: any) => (
            <SoundCard key={sound._id} sound={sound} />
          ))}
        </div>
      </section>

      {/* SEO Article */}
      <section className="container mx-auto px-4 py-24">
        <div className="p-10 md:p-16 rounded-[3rem] bg-linear-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-950 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
           <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
          
          <h2 className="text-3xl md:text-5xl font-black tracking-tighter mb-10 text-foreground">
            Soundboard Unblocked: <br /> <span className="text-primary">Play 100,000+ Sounds</span>
          </h2>
          
          <div className="grid md:grid-cols-2 gap-12 text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-foreground">What Are Sound Buttons?</h3>
              <p>Sound buttons are instant-play audio clips that have taken the internet by storm. They provide quick bursts of humor, reactions, or atmosphere with just a single click. From viral memes to classic cartoon sounds, our collection is curated to give you the best experience.</p>
            </div>
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-foreground">Soundboard Unblocked for School</h3>
              <p>Sound Buttons Max is designed to work on all networks, including restricted school or office environments. We use advanced optimization to ensure the site loads quickly and bypasses common filters, so you can enjoy your favorite sounds anywhere, anytime.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
