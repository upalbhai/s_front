'use client';

import { useState } from 'react';
import SoundCard from '../components/SoundCard';
import { 
  Search, 
  TrendingUp, 
  Sparkles, 
  LayoutGrid, 
  ChevronRight, 
  Zap, 
  Users, 
  ShieldCheck, 
  Volume2, 
  Star, 
  HelpCircle,
  Plus,
  Minus,
  Download,
  Share2,
  Heart
} from 'lucide-react';
import Link from 'next/link';

// Mock FAQ questions for SEO
const FAQ_ITEMS = [
  {
    question: "What are meme sound buttons?",
    answer: "Meme sound buttons are instant-play audio clips from popular internet culture, viral TikTok videos, and gaming. With a single click, you can play sound effects like the Vine Boom, Bruh, or Goofy Ahh instantly on your phone or PC."
  },
  {
    question: "Are all sound buttons free to play and download?",
    answer: "Yes, 100% free! You can play any sound button as many times as you like, and download them as high-quality MP3 files for your video editing, stream overlays, or phone ringtones."
  },
  {
    question: "Is Sound Buttons Max unblocked at school and work?",
    answer: "Yes. Our web app is optimized to load lightning-fast and run flawlessly across restricted networks, making it the perfect unblocked soundboard for school classrooms, discord channels, or office laughs."
  },
  {
    question: "How do I use these sounds on Discord or OBS?",
    answer: "Simple! You can download the high-quality MP3 file from our platform and upload it directly into your Discord Soundboard or OBS Studio media source overlays."
  }
];

// Mock Testimonials
const TESTIMONIALS = [
  {
    name: "Alex Rivera",
    role: "Twitch Streamer",
    quote: "Sound Buttons Max is my go-to overlay companion. The instant unblocked play means I don't suffer from streams lagging while triggering sound effects.",
    rating: 5,
    avatar: "AR"
  },
  {
    name: "Devon Carter",
    role: "Video Editor",
    quote: "Finding high-quality MP3 downloads of current viral TikTok memes used to take ages. This site has everything categorized and organized with one-click downloads.",
    rating: 5,
    avatar: "DC"
  },
  {
    name: "Sophia Martinez",
    role: "Discord Community Admin",
    quote: "Our server relies heavily on customized soundboards. This platform is a goldmine for meme reactions. Easy to browse and fully unblocked.",
    rating: 5,
    avatar: "SM"
  }
];

export default function HomeClient({ trendingSounds = [], newSounds = [], categories = [], searchResults = [], searchQuery }: any) {
  const [localSearch, setLocalSearch] = useState(searchQuery || '');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (localSearch.trim()) {
      window.location.href = `/?q=${encodeURIComponent(localSearch)}`;
    }
  };

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <div className="bg-background text-foreground animate-in fade-in duration-700 min-h-screen">
      
      {/* ── 1. Hero Section ─────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-20 pb-20 md:pt-32 md:pb-28">
        {/* Subtle dynamic background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-gradient-to-b from-primary/10 via-transparent to-transparent blur-3xl -z-10 pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Context & Call to action */}
            <div className="lg:col-span-7 text-left space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-black uppercase tracking-widest">
                <Sparkles size={14} />
                <span>Unblocked Soundboard</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[1.05] text-foreground">
                Unlimited Free Meme <br />
                <span className="bg-gradient-to-r from-primary to-violet-500 bg-clip-text text-transparent">
                  Sound Buttons
                </span>
              </h1>
              
              <p className="text-lg md:text-xl text-slate-500 dark:text-slate-400 font-medium max-w-2xl leading-relaxed">
                World's largest library of viral soundboards, meme sound effects, and reaction buttons. Unblocked for school and free forever. Play instantly!
              </p>

              {/* Advanced Search bar */}
              <form onSubmit={handleSearch} className="p-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl flex flex-col sm:flex-row items-center gap-2 focus-within:ring-4 focus-within:ring-primary/10 transition-all max-w-2xl">
                <div className="flex-1 flex items-center gap-3 px-4 w-full">
                  <Search size={22} className="text-slate-400 shrink-0" />
                  <input 
                    type="text" 
                    placeholder="Search Vine Boom, Bruh, Goofy Ahh..." 
                    value={localSearch}
                    onChange={(e) => setLocalSearch(e.target.value)}
                    className="w-full bg-transparent border-none outline-none py-3 text-base md:text-lg font-bold text-foreground placeholder:text-slate-400 focus:ring-0"
                  />
                </div>
                <button 
                  type="submit" 
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-primary text-white font-black text-base hover:bg-primary-hover hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-primary/25"
                >
                  Search Library
                </button>
              </form>

              {/* Popular Tag cloud */}
              <div className="flex flex-wrap items-center gap-3 text-sm font-bold text-slate-500 dark:text-slate-400">
                <span className="text-xs uppercase tracking-wider text-slate-400">Trending Now:</span>
                {['Vine Boom', 'Bruh', 'Goofy Ahh', 'Scream'].map(tag => (
                  <Link 
                    key={tag}
                    href={`/?q=${encodeURIComponent(tag)}`} 
                    className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-primary hover:text-white transition-all text-xs"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            </div>

            {/* Right Column: Interactive SaaS Console preview */}
            <div className="lg:col-span-5 relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-violet-500/10 rounded-[2.5rem] blur-2xl -z-10" />
              
              <div className="p-8 rounded-[2rem] border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl shadow-2xl relative overflow-hidden space-y-6">
                
                {/* Visual Audio Wave */}
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs font-black uppercase tracking-wider text-slate-500">Live Sound Console</span>
                  </div>
                  <div className="flex items-end gap-1 h-4">
                    <div className="w-1 h-3 bg-primary rounded-full animate-bounce [animation-delay:0.1s]" />
                    <div className="w-1 h-4 bg-violet-500 rounded-full animate-bounce [animation-delay:0.3s]" />
                    <div className="w-1 h-2 bg-primary rounded-full animate-bounce [animation-delay:0.5s]" />
                    <div className="w-1 h-3.5 bg-violet-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                  </div>
                </div>

                {/* Simulated Sounds Board */}
                <div className="space-y-4">
                  {[
                    { name: 'Vine Boom Effect', plays: '12M+ Plays', icon: '💥', color: 'bg-red-500' },
                    { name: 'Bruh Sound', plays: '8M+ Plays', icon: '🗣️', color: 'bg-amber-500' },
                    { name: 'Goofy Ahh Car', plays: '5M+ Plays', icon: '🚗', color: 'bg-indigo-500' },
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 rounded-2xl bg-white/40 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800/80 hover:border-primary/20 transition-all">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{item.icon}</span>
                        <div>
                          <h4 className="text-sm font-black text-foreground">{item.name}</h4>
                          <span className="text-xs text-slate-400 font-bold">{item.plays}</span>
                        </div>
                      </div>
                      <span className={`w-8 h-8 rounded-full ${item.color} flex items-center justify-center text-white text-xs font-black shadow-lg shadow-black/10`}>
                        PLAY
                      </span>
                    </div>
                  ))}
                </div>

                {/* Stats badge */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-primary/5 to-violet-500/5 border border-primary/10 text-center">
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Instant streaming optimized at </span>
                  <span className="text-xs font-black text-primary">12ms response latency</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── 2. Stats / Trust Indicators Section ────────────────────────────── */}
      <section className="border-y border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/20 py-12">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left divide-y md:divide-y-0 md:divide-x divide-slate-200 dark:divide-slate-800">
            
            <div className="flex flex-col md:flex-row items-center gap-4 justify-center md:justify-start py-6 md:py-0 md:px-6">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <Volume2 size={24} />
              </div>
              <div>
                <h3 className="text-2xl md:text-3xl font-black text-foreground">100,000+</h3>
                <p className="text-sm text-slate-500 font-medium">Meme Sound Buttons Available</p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-4 justify-center md:justify-start py-6 md:py-0 md:px-6">
              <div className="w-12 h-12 rounded-2xl bg-violet-500/10 flex items-center justify-center text-violet-500 shrink-0">
                <Users size={24} />
              </div>
              <div>
                <h3 className="text-2xl md:text-3xl font-black text-foreground">5,000,000+</h3>
                <p className="text-sm text-slate-500 font-medium">Monthly Active Sound Seekers</p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-4 justify-center md:justify-start py-6 md:py-0 md:px-6">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 shrink-0">
                <ShieldCheck size={24} />
              </div>
              <div>
                <h3 className="text-2xl md:text-3xl font-black text-foreground">100% Free</h3>
                <p className="text-sm text-slate-500 font-medium">Unblocked & School-Safe Delivery</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── 3. Search Results (Conditional) ─────────────────────────────────── */}
      {searchQuery && (
        <section className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-16 md:py-20 animate-in fade-in slide-in-from-bottom-6 duration-300">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-1.5 h-8 bg-primary rounded-full" />
            <h2 className="text-3xl font-black tracking-tight text-foreground">Search Results for &quot;{searchQuery}&quot;</h2>
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

      {/* ── 4. Trending Section ─────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-16 md:py-24">
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-sky-500/10 flex items-center justify-center text-sky-500">
              <TrendingUp size={24} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-sky-500 mb-1">Viral hits</p>
              <h2 className="text-2xl md:text-3xl font-black tracking-tight text-foreground">Trending Sounds</h2>
            </div>
          </div>
          <Link href="/trending" className="flex items-center gap-1 font-bold text-sm text-slate-500 hover:text-foreground transition-colors group">
            See All <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {trendingSounds.map((sound: any) => (
            <SoundCard key={sound._id} sound={sound} />
          ))}
        </div>
      </section>

      {/* ── 5. Categories Grid Section ───────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-16 md:py-24 border-t border-slate-100 dark:border-slate-900">
        <div className="flex flex-col items-center text-center space-y-4 mb-12">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-500">
            <LayoutGrid size={24} />
          </div>
          <p className="text-[10px] font-black uppercase tracking-widest text-indigo-500">Curated boards</p>
          <h2 className="text-3xl font-black tracking-tight text-foreground">Soundboard Categories</h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium max-w-xl">
            Browse our carefully organized collections spanning anime reactions, gaming loops, and viral trends.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat: any) => (
            <Link 
              href={`/${cat.slug}/${cat._id}`} 
              key={cat._id} 
              className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-primary/50 hover:shadow-xl hover:-translate-y-1 transition-all group"
            >
              <div className="flex items-center gap-4">
                <span className="text-4xl grayscale group-hover:grayscale-0 transition-all duration-300">{cat.icon || '🎵'}</span>
                <div className="min-w-0">
                  <h3 className="text-base font-black text-foreground truncate group-hover:text-primary transition-colors">{cat.name}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-1 mt-1">{cat.description || "Browse meme soundboards."}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── 6. New Sounds Section ───────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-16 md:py-24 border-t border-slate-100 dark:border-slate-900">
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
              <Sparkles size={24} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-emerald-500 mb-1">Fresh sound clips</p>
              <h2 className="text-2xl md:text-3xl font-black tracking-tight text-foreground">New Additions</h2>
            </div>
          </div>
          <Link href="/new" className="flex items-center gap-1 font-bold text-sm text-slate-500 hover:text-foreground transition-colors group">
            See All <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {newSounds.map((sound: any) => (
            <SoundCard key={sound._id} sound={sound} />
          ))}
        </div>
      </section>

      {/* ── 7. Features Grid Section ────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-16 md:py-24 border-t border-slate-100 dark:border-slate-900">
        <div className="flex flex-col items-center text-center space-y-4 mb-16">
          <p className="text-[10px] font-black uppercase tracking-widest text-primary">Uncompromised Design</p>
          <h2 className="text-3xl md:text-4xl font-black tracking-tight text-foreground">Features Designed for Creators</h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium max-w-xl">
            Stream, download, and share viral meme clips at peak performance without any platform limitations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "Lightning Fast Playback",
              desc: "Engineered with modern compression, our unblocked soundboards deliver audio in milliseconds. Zero buffering, peak hilarity.",
              icon: <Zap className="text-primary" size={24} />,
            },
            {
              title: "Free High-Quality MP3s",
              desc: "Every single button contains a high-fidelity download option. Seamless integration into Discord, OBS, or mobile devices.",
              icon: <Download className="text-violet-500" size={24} />,
            },
            {
              title: "Completely Unblocked",
              desc: "Built to run seamlessly across educational, professional, or residential networks with strict local firewall policies.",
              icon: <ShieldCheck className="text-emerald-500" size={24} />,
            }
          ].map((item, idx) => (
            <div key={idx} className="p-8 rounded-3xl border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900/50 hover:shadow-lg transition-all space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center">
                {item.icon}
              </div>
              <h3 className="text-lg font-black text-foreground">{item.title}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── 8. Testimonials Section ────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-16 md:py-24 border-t border-slate-100 dark:border-slate-900">
        <div className="flex flex-col items-center text-center space-y-4 mb-16">
          <p className="text-[10px] font-black uppercase tracking-widest text-primary">Trusted globally</p>
          <h2 className="text-3xl md:text-4xl font-black tracking-tight text-foreground">What Meme Lovers Say</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((t, idx) => (
            <div key={idx} className="p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/30 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                {/* Rating stars */}
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(t.rating)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
                </div>
                <p className="text-slate-600 dark:text-slate-400 font-medium leading-relaxed italic">
                  &quot;{t.quote}&quot;
                </p>
              </div>
              
              <div className="flex items-center gap-3 pt-4 border-t border-slate-100 dark:border-slate-800/80">
                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary font-black flex items-center justify-center text-sm shrink-0">
                  {t.avatar}
                </div>
                <div>
                  <h4 className="text-sm font-black text-foreground leading-none">{t.name}</h4>
                  <span className="text-xs text-slate-400 font-bold mt-1 block">{t.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 9. FAQ Section (SEO-friendly Accordion) ─────────────────────────── */}
      <section className="max-w-4xl mx-auto px-4 md:px-6 py-16 md:py-24 border-t border-slate-100 dark:border-slate-900">
        <div className="flex flex-col items-center text-center space-y-4 mb-12">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
            <HelpCircle size={24} />
          </div>
          <p className="text-[10px] font-black uppercase tracking-widest text-primary">Got questions?</p>
          <h2 className="text-3xl font-black tracking-tight text-foreground">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-4">
          {FAQ_ITEMS.map((item, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div 
                key={idx} 
                className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 overflow-hidden transition-all"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left font-black text-base text-foreground hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <span>{item.question}</span>
                  <span className="text-slate-400">
                    {isOpen ? <Minus size={18} /> : <Plus size={18} />}
                  </span>
                </button>
                
                {isOpen && (
                  <div className="px-6 pb-6 pt-2 text-slate-500 dark:text-slate-400 font-medium text-sm leading-relaxed border-t border-slate-100 dark:border-slate-800 animate-in fade-in slide-in-from-top-1 duration-200">
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ── 10. Editorial SEO Rich Section ──────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-20 pb-28">
        <div className="p-10 md:p-16 rounded-[2.5rem] bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-950 border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-primary/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
          
          <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-8 text-foreground leading-tight">
            Soundboard Unblocked: <br />
            <span className="bg-gradient-to-r from-primary to-violet-500 bg-clip-text text-transparent">
              Play 100,000+ Meme Sounds Instantly
            </span>
          </h2>
          
          <div className="grid md:grid-cols-2 gap-12 text-slate-500 dark:text-slate-400 leading-relaxed font-medium text-sm md:text-base">
            <div className="space-y-6">
              <h3 className="text-lg md:text-xl font-black text-foreground">What Are Sound Buttons?</h3>
              <p>
                Sound buttons are instant-play audio clips that have taken the internet by storm. They provide quick bursts of humor, reactions, or atmosphere with just a single click. From viral memes to classic cartoon sounds, our collection is curated to give you the best experience.
              </p>
            </div>
            <div className="space-y-6">
              <h3 className="text-lg md:text-xl font-black text-foreground">Soundboard Unblocked for School</h3>
              <p>
                Sound Buttons Max is designed to work on all networks, including restricted school or office environments. We use advanced optimization to ensure the site loads quickly and bypasses common filters, so you can enjoy your favorite sounds anywhere, anytime.
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
