import { Metadata } from 'next';
import { getRequestSite } from '@/lib/site';
import { buildSeoMetadata } from '@/lib/seo';
import { getTranslations } from '@/i18n/server';
import type { Locale } from '@/i18n';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const site = await getRequestSite();
  const t = await getTranslations(site.id, locale as Locale);

  const title = t('privacy.meta.title', { siteName: site.siteName }) !== 'privacy.meta.title'
    ? t('privacy.meta.title', { siteName: site.siteName })
    : `Privacy Policy – ${site.siteName}`;

  const description = t('privacy.meta.description', { siteName: site.siteName }) !== 'privacy.meta.description'
    ? t('privacy.meta.description', { siteName: site.siteName })
    : `Read the ${site.siteName} privacy policy.`;

  return buildSeoMetadata({
    site,
    title,
    description,
    canonicalPath: '/privacy',
  });
}

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const site = await getRequestSite();
  const t = await getTranslations(site.id, locale as Locale);

  const email = site.id === 'soundboard'
    ? 'soundboardmax.net@gmail.com'
    : (site.contactEmail || 'contact@soundbuttonsmax.com');

  return (
    <div className="container mx-auto px-4 py-12 md:py-20 max-w-4xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-foreground mb-4">
          {t('privacy.title')}
        </h1>
        <p className="text-slate-500 dark:text-slate-400 font-bold">
          {t('privacy.last_updated')}
        </p>
      </div>

      <div className="p-6 md:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 space-y-8">
        <section className="space-y-3">
          <h2 className="text-xl font-black text-foreground">{t('privacy.intro.title')}</h2>
          <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
            {t('privacy.intro.text', { siteName: site.siteName, siteUrl: site.siteUrl })}
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-black text-foreground">{t('privacy.collect.title')}</h2>
          
          <div className="space-y-2">
            <h3 className="text-base font-bold text-foreground">{t('privacy.collect.provide.title')}</h3>
            <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 font-medium leading-relaxed whitespace-pre-line">
              {t('privacy.collect.provide.text')}
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-base font-bold text-foreground">{t('privacy.collect.auto.title')}</h3>
            <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 font-medium leading-relaxed whitespace-pre-line">
              {t('privacy.collect.auto.text')}
            </p>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-black text-foreground">{t('privacy.use.title')}</h2>
          <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 font-medium leading-relaxed whitespace-pre-line">
            {t('privacy.use.text')}
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-black text-foreground">{t('privacy.cookies.title')}</h2>
          <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
            {t('privacy.cookies.text')}
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-black text-foreground">{t('privacy.advertising.title')}</h2>
          <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
            {t('privacy.advertising.text')}
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-black text-foreground">{t('privacy.sharing.title')}</h2>
          <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 font-medium leading-relaxed whitespace-pre-line">
            {t('privacy.sharing.text')}
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-black text-foreground">{t('privacy.security.title')}</h2>
          <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
            {t('privacy.security.text')}
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-black text-foreground">{t('privacy.rights.title')}</h2>
          <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
            {t('privacy.rights.text')}
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-black text-foreground">{t('privacy.children.title')}</h2>
          <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
            {t('privacy.children.text')}
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-black text-foreground">{t('privacy.changes.title')}</h2>
          <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
            {t('privacy.changes.text')}
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-black text-foreground">{t('privacy.contact.title')}</h2>
          <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
            {t('privacy.contact.text', { email }).split(email)[0]}
            <a href={`mailto:${email}`} className="text-primary font-bold hover:underline">
              {email}
            </a>
            {t('privacy.contact.text', { email }).split(email)[1]}
          </p>
        </section>
      </div>
    </div>
  );
}
