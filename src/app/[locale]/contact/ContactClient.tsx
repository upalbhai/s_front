'use client';

import { useState } from 'react';
import api from '@/services/api';
import { Mail, Send, HelpCircle, AlertCircle, Clock, FileText } from 'lucide-react';
import { useSite } from '@/context/SiteProvider';
import { useTranslation } from '@/i18n';

export default function ContactClient() {
  const { config, siteId } = useSite();
  const { t } = useTranslation();
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState('');

  const email = siteId === 'soundboard'
    ? 'soundboardmax.net@gmail.com'
    : (config.contactEmail || 'contact@soundbuttonsmax.com');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/contact', formData);
      setStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch {
      setStatus('error');
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 md:py-20 max-w-6xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-foreground mb-4">
          {t('contact.title')}
        </h1>
        <p className="text-lg text-slate-500 dark:text-slate-400 font-medium max-w-2xl mx-auto">
          {t('contact.intro', { siteName: config.siteName })}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">
        {/* Info Column */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 md:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
              <Mail size={24} />
            </div>
            <h2 className="text-2xl font-black text-foreground">{t('contact.email.title')}</h2>
            <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
              {t('contact.email.text', { email }).split(email)[0]}
              <a href={`mailto:${email}`} className="text-primary font-bold hover:underline">
                {email}
              </a>
              {t('contact.email.text', { email }).split(email)[1]}
            </p>
          </div>

          <div className="p-6 md:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
              <HelpCircle size={24} />
            </div>
            <h2 className="text-2xl font-black text-foreground">{t('contact.help.title')}</h2>
            <div className="grid grid-cols-1 gap-3">
              {[1, 2, 3, 4, 5, 6].map((num) => (
                <div key={num} className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/30">
                  <span className="flex-shrink-0 text-primary">✓</span>
                  <p className="text-sm text-slate-600 dark:text-slate-400 font-bold">
                    {t(`contact.help.item${num}`)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 md:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
              <Clock size={24} />
            </div>
            <h2 className="text-2xl font-black text-foreground">{t('contact.response.title')}</h2>
            <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
              {t('contact.response.text')}
            </p>
          </div>

          <div className="p-6 md:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
              <FileText size={24} />
            </div>
            <h2 className="text-2xl font-black text-foreground">{t('contact.dmca.title')}</h2>
            <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
              {t('contact.dmca.text', { email }).split(email)[0]}
              <a href={`mailto:${email}?subject=DMCA`} className="text-primary font-bold hover:underline">
                {email}
              </a>
              {t('contact.dmca.text', { email }).split(email)[1]}
            </p>
          </div>
        </div>

        {/* Form Column */}
        <div className="lg:col-span-7">
          <div className="p-6 md:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 h-full">
            <h2 className="text-2xl md:text-3xl font-black tracking-tight text-foreground mb-6">
              {t('contact.form.title')}
            </h2>

            {status === 'success' ? (
              <div className="text-center py-12 space-y-6">
                <div className="w-16 h-16 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto">
                  <Send size={32} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-black text-foreground">{t('contact.form.success_title')}</h3>
                  <p className="text-slate-500 dark:text-slate-400 font-medium">{t('contact.form.success_desc')}</p>
                </div>
                <button
                  onClick={() => setStatus('')}
                  className="px-6 py-3 bg-primary hover:bg-primary-hover text-white font-bold rounded-2xl transition-colors"
                >
                  {t('contact.form.send_another')}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">
                    {t('contact.form.name')}
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 text-foreground font-medium transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">
                    {t('contact.form.email')}
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 text-foreground font-medium transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">
                    {t('contact.form.subject')}
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-3.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 text-foreground font-medium transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">
                    {t('contact.form.message')}
                  </label>
                  <textarea
                    required
                    rows={6}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 text-foreground font-medium transition-all resize-none"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-primary hover:bg-primary-hover text-white font-bold rounded-2xl transition-colors flex items-center justify-center gap-2"
                >
                  <Send size={18} />
                  {t('contact.form.send')}
                </button>

                {status === 'error' && (
                  <div className="flex items-center gap-2 text-rose-500 font-medium text-sm p-4 bg-rose-500/10 rounded-2xl">
                    <AlertCircle size={18} />
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
