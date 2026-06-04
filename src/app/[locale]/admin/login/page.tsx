'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/services/api';
import { ArrowRight, Lock, Mail, ShieldCheck } from 'lucide-react';
import { getStoredAdminUser, isAdminUser } from '../admin-types';
import { useTheme } from 'next-themes';
import { toast } from 'react-hot-toast';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const storedUser = getStoredAdminUser();
    if (isAdminUser(storedUser)) {
      router.replace('/admin');
    }
  }, [router]);

  const isDark = mounted && resolvedTheme === 'dark';

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    try {
      const { data } = await api.post('/users/login', { email, password });
      if (data?.role !== 'admin') {
        toast.error('Admin access required');
        return;
      }

      window.localStorage.setItem('userInfo', JSON.stringify(data));
      window.dispatchEvent(new Event('userInfoChanged'));
      router.push('/admin');
      router.refresh();
    } catch {
      toast.error('Invalid admin credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[880px] mx-auto grid grid-cols-1 md:grid-cols-[1fr_420px] gap-6 items-stretch transition-colors duration-300">
      {/* Copy Panel */}
      <div className={`p-8 rounded-3xl border backdrop-blur-2xl flex flex-col justify-center transition-colors duration-300 ${isDark
          ? 'border-zinc-800 bg-zinc-900/60 text-white'
          : 'border-zinc-200 bg-white/80 text-zinc-900 shadow-xl shadow-zinc-200/40'
        }`}>
        <div className={`inline-flex items-center gap-2 w-fit px-3 py-1.5 rounded-full border text-sm font-black uppercase tracking-wider transition-colors duration-300 ${isDark
            ? 'bg-zinc-800/50 text-zinc-300 border-zinc-700/50'
            : 'bg-zinc-100 text-zinc-800 border-zinc-200'
          }`}>
          <ShieldCheck size={16} />
          <span>Admin access</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-black tracking-tighter leading-[0.95] mt-4 mb-3">
          Sign in to the control center
        </h1>
        <p className={`leading-relaxed max-w-[48ch] font-medium ${isDark ? 'text-zinc-400' : 'text-zinc-500'
          }`}>
          Minimal, direct access for managing sounds and categories.
        </p>
      </div>

      {/* Form Panel */}
      <form
        onSubmit={handleSubmit}
        className={`p-8 rounded-3xl border backdrop-blur-2xl flex flex-col justify-center gap-5 transition-colors duration-300 ${isDark
            ? 'border-zinc-800 bg-zinc-900/60 text-white'
            : 'border-zinc-200 bg-white/80 text-zinc-900 shadow-xl shadow-zinc-200/40'
          }`}
      >
        <div className="space-y-1.5">
          <label className={`text-xs font-black uppercase tracking-widest ${isDark ? 'text-zinc-400' : 'text-zinc-500'
            }`}>Email</label>
          <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all duration-300 ${isDark
              ? 'border-zinc-800 bg-zinc-950 focus-within:ring-2 focus-within:ring-zinc-800 focus-within:border-zinc-700'
              : 'border-zinc-200 bg-zinc-50 focus-within:ring-2 focus-within:ring-zinc-200 focus-within:border-zinc-300'
            }`}>
            <Mail size={16} className={`shrink-0 ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`} />
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="admin@example.com"
              required
              className={`w-full bg-transparent border-none outline-none font-bold text-sm ${isDark ? 'text-white placeholder:text-zinc-600' : 'text-zinc-900 placeholder:text-zinc-400'
                }`}
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className={`text-xs font-black uppercase tracking-widest ${isDark ? 'text-zinc-400' : 'text-zinc-500'
            }`}>Password</label>
          <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all duration-300 ${isDark
              ? 'border-zinc-800 bg-zinc-950 focus-within:ring-2 focus-within:ring-zinc-800 focus-within:border-zinc-700'
              : 'border-zinc-200 bg-zinc-50 focus-within:ring-2 focus-within:ring-zinc-200 focus-within:border-zinc-300'
            }`}>
            <Lock size={16} className={`shrink-0 ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`} />
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className={`w-full bg-transparent border-none outline-none font-bold text-sm ${isDark ? 'text-white placeholder:text-zinc-600' : 'text-zinc-900 placeholder:text-zinc-400'
                }`}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`mt-2 flex items-center justify-center gap-2 w-full px-6 py-4 rounded-xl font-black uppercase tracking-widest text-xs transition-all active:scale-[0.98] disabled:opacity-60 shadow-lg ${isDark
              ? 'bg-white text-zinc-950 hover:bg-zinc-100 shadow-white/5'
              : 'bg-zinc-950 text-white hover:bg-zinc-900 shadow-zinc-950/10'
            }`}
        >
          <span>{loading ? 'Signing in…' : 'Enter admin'}</span>
          {!loading && <ArrowRight size={14} />}
        </button>
      </form>
    </div>
  );
}
