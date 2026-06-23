'use client';

import { useState } from 'react';
import api from '@/services/api';
import { Mail, ShieldCheck, Clock, Send, AlertTriangle } from 'lucide-react';
import { useTranslation } from '@/i18n';

interface ContactClientProps {
  siteName: string;
  email: string;
}

export default function ContactClient({ siteName, email }: ContactClientProps) {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus('');
    try {
      await api.post('/contact', formData);
      setStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      console.error(err);
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  const helpTopics = [
    t('contact.help_with.item1'),
    t('contact.help_with.item2'),
    t('contact.help_with.item3'),
    t('contact.help_with.item4'),
    t('contact.help_with.item5'),
    t('contact.help_with.item6'),
  ].filter(Boolean);

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 py-12 md:py-20 animate-in fade-in slide-in-from-bottom-5 duration-700">
      {/* Title */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-foreground mb-4">
          <span className="text-gradient">{t('contact.title')}</span>
        </h1>
        <p className="text-lg text-slate-500 dark:text-slate-400 max-w-xl mx-auto font-medium">
          {t('contact.get_in_touch.desc', { siteName })}
        </p>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Contact Info & Help Topics */}
        <div className="lg:col-span-5 space-y-6">
          {/* Email Card */}
          <div className="glass-card flex gap-4 p-6 items-start relative overflow-hidden group">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-300">
              <Mail size={22} />
            </div>
            <div>
              <h3 className="text-lg font-black text-foreground mb-1">
                {t('contact.email_us.title')}
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">
                {t('contact.email_us.desc')}
              </p>
              <a
                href={`mailto:${email}`}
                className="text-sm font-black text-primary hover:underline break-all"
              >
                {email}
              </a>
            </div>
          </div>

          {/* Response Time Card */}
          <div className="glass-card flex gap-4 p-6 items-start relative overflow-hidden group">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-300">
              <Clock size={22} />
            </div>
            <div>
              <h3 className="text-lg font-black text-foreground mb-1">
                {t('contact.response_time.title')}
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                {t('contact.response_time.desc')}
              </p>
            </div>
          </div>

          {/* DMCA Card */}
          <div className="glass-card flex gap-4 p-6 items-start relative overflow-hidden group">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-300">
              <ShieldCheck size={22} />
            </div>
            <div>
              <h3 className="text-lg font-black text-foreground mb-1">
                {t('contact.dmca.title')}
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                {t('contact.dmca.desc', { email })}
              </p>
            </div>
          </div>
        </div>

        {/* Form Panel */}
        <div className="lg:col-span-7">
          <div className="glass-card p-8 md:p-10">
            {status === 'success' ? (
              <div className="text-center py-12 animate-in zoom-in duration-300">
                <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-450 flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-2xl font-black text-foreground mb-3">
                  {t('contact.form.success_title')}
                </h2>
                <p className="text-slate-500 dark:text-slate-400 font-medium mb-8">
                  {t('contact.form.success_desc')}
                </p>
                <button
                  onClick={() => setStatus('')}
                  className="px-6 py-2.5 bg-primary hover:bg-primary-hover text-primary-foreground font-black text-xs uppercase tracking-wider rounded-xl transition-all active:scale-95 cursor-pointer shadow-md"
                >
                  {t('contact.form.send_another')}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <h2 className="text-2xl font-black text-foreground mb-2">
                  {t('contact.form.title')}
                </h2>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      {t('contact.form.name')}
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Your name"
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-xl text-sm font-semibold focus:outline-hidden focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-foreground"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      {t('contact.form.email')}
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="name@example.com"
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-xl text-sm font-semibold focus:outline-hidden focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-foreground"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    {t('contact.form.subject')}
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="How can we help you?"
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-xl text-sm font-semibold focus:outline-hidden focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-foreground"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    {t('contact.form.message')}
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Enter your message here..."
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-xl text-sm font-semibold focus:outline-hidden focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all min-h-[120px] text-foreground"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 px-8 py-3.5 bg-primary hover:bg-primary-hover text-primary-foreground font-black text-sm uppercase tracking-widest rounded-xl shadow-lg transition-all active:scale-95 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  ) : (
                    <>
                      <Send size={16} />
                      {t('contact.form.send')}
                    </>
                  )}
                </button>

                {status === 'error' && (
                  <div className="flex items-center gap-2 text-rose-500 text-sm font-semibold mt-4">
                    <AlertTriangle size={16} />
                    <span>{t('contact.form.error')}</span>
                  </div>
                )}
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
