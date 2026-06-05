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

  const title = t('dmca.meta.title', { siteName: site.siteName }) !== 'dmca.meta.title'
    ? t('dmca.meta.title', { siteName: site.siteName })
    : `DMCA Copyright Policy – ${site.siteName}`;

  const description = t('dmca.meta.description', { siteName: site.siteName }) !== 'dmca.meta.description'
    ? t('dmca.meta.description', { siteName: site.siteName })
    : `${site.siteName} DMCA copyright policy.`;

  return buildSeoMetadata({
    site,
    title,
    description,
    canonicalPath: '/dmca',
  });
}

export default async function DMCAPage({
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
          {t('dmca.title')}
        </h1>
        <p className="text-slate-500 dark:text-slate-400 font-bold">
          {t('dmca.last_updated')}
        </p>
      </div>

      <div className="p-6 md:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 space-y-8">
        <section className="space-y-3">
          <h2 className="text-xl font-black text-foreground">{t('dmca.section1.title')}</h2>
          <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
            {t('dmca.section1.text', { siteName: site.siteName })}
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-black text-foreground">{t('dmca.section2.title')}</h2>
          <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 font-medium leading-relaxed whitespace-pre-line">
            {t('dmca.section2.text')}
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-black text-foreground">{t('dmca.section3.title')}</h2>
          <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
            {t('dmca.section3.text', { email }).split(email)[0]}
            <a href={`mailto:${email}?subject=DMCA%20Copyright%20Infringement%20Notice`} className="text-primary font-bold hover:underline">
              {email}
            </a>
            {t('dmca.section3.text', { email }).split(email)[1]}
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-black text-foreground">{t('dmca.section4.title')}</h2>
          <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 font-medium leading-relaxed whitespace-pre-line">
            {t('dmca.section4.text')}
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-black text-foreground">{t('dmca.section5.title')}</h2>
          <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 font-medium leading-relaxed whitespace-pre-line">
            {t('dmca.section5.text')}
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-black text-foreground">{t('dmca.section6.title')}</h2>
          <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
            {t('dmca.section6.text')}
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-black text-foreground">{t('dmca.section7.title')}</h2>
          <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
            {t('dmca.section7.text')}
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-black text-foreground">{t('dmca.section8.title')}</h2>
          <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
            {t('dmca.section8.text')}
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-black text-foreground">{t('dmca.section9.title')}</h2>
          <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
            {t('dmca.section9.text', { email }).split(email)[0]}
            <a href={`mailto:${email}`} className="text-primary font-bold hover:underline">
              {email}
            </a>
            {t('dmca.section9.text', { email }).split(email)[1]}
          </p>
        </section>
      </div>
    </div>
  );
}
