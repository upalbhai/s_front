'use client';

import Link from 'next/link';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

const Footer = () => {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && resolvedTheme === 'dark';

  return (
    <footer className={`mt-16 border-t pt-20 pb-10 transition-all duration-300 ${
      isDark 
        ? 'bg-zinc-950 border-zinc-800' 
        : 'bg-white border-zinc-200'
    }`}>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Column */}
          <div className="space-y-6">
            <h2 className={`text-2xl font-black tracking-tighter ${isDark ? 'text-white' : 'text-zinc-900'}`}>
              SOUND BUTTONS <span className="text-primary">MAX</span>
            </h2>
            <p className={`font-medium leading-relaxed transition-all duration-300 ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
              World's largest free meme soundboard. Instant playback, no downloads required to play.
            </p>
            <div className={`space-y-2 text-sm font-bold transition-all duration-300 ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
              <p>123 Sound Lane, Meme City</p>
              <p>contact@soundbuttonsmax.com</p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className={`text-lg font-black tracking-tight mb-6 ${isDark ? 'text-white' : 'text-zinc-900'}`}>Quick Links</h3>
            <ul className={`space-y-4 font-bold transition-all duration-300 ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
              {['Home', 'New Sounds', 'Trending', 'Blog', 'About Us', 'Contact Us'].map(link => (
                <li key={link}>
                  <Link href={`/${link.toLowerCase().replace(' ', '-')}`} className="hover:text-primary transition-colors">{link}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className={`text-lg font-black tracking-tight mb-6 ${isDark ? 'text-white' : 'text-zinc-900'}`}>Categories</h3>
            <ul className={`space-y-4 font-bold transition-all duration-300 ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
              {[
                { name: 'Meme', href: '/meme-soundboard/1' },
                { name: 'Games', href: '/games-soundboard/2' },
                { name: 'Movies', href: '/movies-soundboard/3' },
                { name: 'Reaction', href: '/reaction-soundboard/4' },
                { name: 'TikTok', href: '/tiktok-trends-soundboard/8' }
              ].map(cat => (
                <li key={cat.name}>
                  <Link href={cat.href} className="hover:text-primary transition-colors">{cat.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter/Contact */}
          <div className="space-y-6">
            <h3 className={`text-lg font-black tracking-tight mb-6 ${isDark ? 'text-white' : 'text-zinc-900'}`}>Stay Tuned</h3>
            <p className={`text-sm font-medium transition-all duration-300 ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>Get notified about the latest viral sounds.</p>
            <form className="space-y-3">
              <input 
                type="email" 
                placeholder="Your Email" 
                className={`w-full px-4 py-3 rounded-xl border outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold text-sm ${
                  isDark 
                    ? 'bg-zinc-900 border-zinc-800 text-white' 
                    : 'bg-zinc-100 border-zinc-200 text-zinc-900'
                }`} 
              />
              <button 
                type="submit" 
                className="w-full py-3 rounded-xl bg-primary text-background font-black hover:bg-primary-hover transition-all active:scale-95 shadow-lg shadow-primary/20"
              >
                Join Newsletter
              </button>
            </form>
          </div>
        </div>

        <div className={`pt-10 border-t flex flex-col md:flex-row justify-between items-center gap-6 ${isDark ? 'border-zinc-800' : 'border-zinc-200'}`}>
          <p className={`text-sm font-bold transition-all duration-300 ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
            &copy; {new Date().getFullYear()} Sound Buttons Max. All rights reserved.
          </p>
          <div className={`flex flex-wrap justify-center gap-6 text-sm font-bold transition-all duration-300 ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
            {['Privacy Policy', 'Terms & Conditions', 'DMCA', 'Disclaimer'].map(link => (
              <Link 
                key={link}
                href={`/${link.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-')}`} 
                className="hover:text-primary transition-colors"
              >
                {link}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
