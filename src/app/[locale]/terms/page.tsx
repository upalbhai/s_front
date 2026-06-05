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

  const title = t('terms.meta.title', { siteName: site.siteName }) !== 'terms.meta.title'
    ? t('terms.meta.title', { siteName: site.siteName })
    : `Terms and Conditions – ${site.siteName}`;

  const description = t('terms.meta.description', { siteName: site.siteName }) !== 'terms.meta.description'
    ? t('terms.meta.description', { siteName: site.siteName })
    : `Read the terms and conditions for using ${site.siteName}.`;

  return buildSeoMetadata({
    site,
    title,
    description,
    canonicalPath: '/terms',
  });
}

export default async function TermsPage({
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
          {t('terms.title')}
        </h1>
        <p className="text-slate-500 dark:text-slate-400 font-bold">
          {t('terms.last_updated')}
        </p>
      </div>

      <div className="p-6 md:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 space-y-8">
        <section className="space-y-3">
          <h2 className="text-xl font-black text-foreground">{t('terms.section1.title')}</h2>
          <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
            {t('terms.section1.text', { siteName: site.siteName })}
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-black text-foreground">{t('terms.section2.title')}</h2>
          
          <div className="space-y-2">
            <h3 className="text-base font-bold text-foreground">{t('terms.section2.1.title')}</h3>
            <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
              {t('terms.section2.1.text', { siteName: site.siteName })}
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-base font-bold text-foreground">{t('terms.section2.2.title')}</h3>
            <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 font-medium leading-relaxed whitespace-pre-line">
              {t('terms.section2.2.text')}
            </p>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-black text-foreground">{t('terms.section3.title')}</h2>
          <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
            {t('terms.section3.text')}
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-black text-foreground">{t('terms.section4.title')}</h2>
          <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 font-medium leading-relaxed whitespace-pre-line">
            {t('terms.section4.text')}
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-black text-foreground">{t('terms.section5.title')}</h2>
          <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
            {t('terms.section5.text', { siteName: site.siteName })}
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-black text-foreground">{t('terms.section6.title')}</h2>
          <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
            {t('terms.section6.text', { email }).split(email)[0]}
            <a href={`mailto:${email}`} className="text-primary font-bold hover:underline">
              {email}
            </a>
            {t('terms.section6.text', { email }).split(email)[1]}
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-black text-foreground">{t('terms.section7.title')}</h2>
          <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
            {t('terms.section7.text')}
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-black text-foreground">{t('terms.section8.title')}</h2>
          <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
            {t('terms.section8.text', { siteName: site.siteName })}
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-black text-foreground">{t('terms.section9.title')}</h2>
          <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
            {t('terms.section9.text', { siteName: site.siteName })}
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-black text-foreground">{t('terms.section10.title')}</h2>
          <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
            {t('terms.section10.text')}
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-black text-foreground">{t('terms.section11.title')}</h2>
          <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
            {t('terms.section11.text')}
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-black text-foreground">{t('terms.section12.title')}</h2>
          <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
            {t('terms.section12.text', { email }).split(email)[0]}
            <a href={`mailto:${email}`} className="text-primary font-bold hover:underline">
              {email}
            </a>
            {t('terms.section12.text', { email }).split(email)[1]}
          </p>
        </section>
      </div>
    </div>
  );
}
