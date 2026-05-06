'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/services/api';
import { ArrowRight, Lock, Mail, ShieldCheck } from 'lucide-react';
import { getStoredAdminUser, isAdminUser } from '../admin-types';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedUser = getStoredAdminUser();
    if (isAdminUser(storedUser)) {
      router.replace('/admin');
    }
  }, [router]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    try {
      const { data } = await api.post('/users/login', { email, password });
      if (data?.role !== 'admin') {
        window.alert('Admin access required');
        return;
      }

      window.localStorage.setItem('userInfo', JSON.stringify(data));
      window.dispatchEvent(new Event('userInfoChanged'));
      router.push('/admin');
      router.refresh();
    } catch {
      window.alert('Invalid admin credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[880px] mx-auto grid grid-cols-1 md:grid-cols-[1fr_420px] gap-6 items-stretch">
      {/* Copy Panel */}
      <div className="p-8 rounded-3xl border border-slate-700/30 bg-slate-900/70 backdrop-blur-2xl flex flex-col justify-center">
        <div className="inline-flex items-center gap-2 w-fit px-3 py-1.5 rounded-full bg-sky-500/10 text-sky-300 border border-sky-500/15 text-sm font-bold mb-4">
          <ShieldCheck size={16} />
          <span>Admin access</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-black tracking-tighter leading-[0.95] mb-3 text-white">
          Sign in to the control center
        </h1>
        <p className="text-slate-400 leading-relaxed max-w-[48ch]">
          Minimal, direct access for managing sounds and categories.
        </p>
      </div>

      {/* Form Panel */}
      <form onSubmit={handleSubmit} className="p-6 rounded-3xl border border-slate-700/30 bg-slate-900/70 backdrop-blur-2xl flex flex-col justify-center gap-5">
        <div className="space-y-1.5">
          <label className="text-sm font-bold text-slate-300">Email</label>
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-slate-700/50 bg-white/[0.03] focus-within:ring-2 focus-within:ring-sky-500/20 focus-within:border-sky-500/30 transition-all">
            <Mail size={16} className="text-slate-500 shrink-0" />
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="admin@example.com"
              required
              className="w-full bg-transparent border-none outline-none text-white placeholder:text-slate-500"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-bold text-slate-300">Password</label>
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-slate-700/50 bg-white/[0.03] focus-within:ring-2 focus-within:ring-sky-500/20 focus-within:border-sky-500/30 transition-all">
            <Lock size={16} className="text-slate-500 shrink-0" />
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full bg-transparent border-none outline-none text-white placeholder:text-slate-500"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-2 flex items-center justify-center gap-2 w-full px-6 py-3.5 rounded-xl bg-sky-500 text-white font-black hover:bg-sky-600 transition-all active:scale-[0.98] shadow-lg shadow-sky-500/20 disabled:opacity-60"
        >
          <span>{loading ? 'Signing in…' : 'Enter admin'}</span>
          {!loading && <ArrowRight size={16} />}
        </button>

        <p className="text-xs text-center text-slate-500 mt-1">
          Seeded admin: admin@example.com / adminpassword123
        </p>
      </form>
    </div>
  );
}
