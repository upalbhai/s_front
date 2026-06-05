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

  const title = t('about.meta.title', { siteName: site.siteName }) !== 'about.meta.title'
    ? t('about.meta.title', { siteName: site.siteName })
    : `About ${site.siteName} – Free Meme Soundboards & Sound Buttons`;

  const description = t('about.meta.description', { siteName: site.siteName }) !== 'about.meta.description'
    ? t('about.meta.description', { siteName: site.siteName })
    : `Learn about ${site.siteName}, the free platform for meme soundboards, sound effects, and audio buttons. Discover our mission to make sounds fun for everyone.`;

  return buildSeoMetadata({
    site,
    title,
    description,
    canonicalPath: '/about',
  });
}

export default async function AboutPage({
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
      <div className="text-center mb-12 md:mb-16">
        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-foreground mb-4">
          {t('about.title', { siteName: site.siteName })}
        </h1>
        <p className="text-lg text-slate-500 dark:text-slate-400 font-medium max-w-2xl mx-auto">
          {t('about.meta.description', { siteName: site.siteName })}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div className="p-6 md:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 space-y-3">
          <h2 className="text-2xl font-black text-foreground">
            {t('about.who_we_are.title')}
          </h2>
          <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
            {t('about.who_we_are.text', { siteName: site.siteName })}
          </p>
        </div>

        <div className="p-6 md:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 space-y-3">
          <h2 className="text-2xl font-black text-foreground">
            {t('about.mission.title')}
          </h2>
          <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
            {t('about.mission.text', { siteName: site.siteName })}
          </p>
        </div>
      </div>

      <div className="p-6 md:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 mb-12 space-y-6">
        <h2 className="text-2xl font-black text-foreground text-center md:text-left">
          {t('about.find.title')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4, 5, 6].map((num) => (
            <div key={num} className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/30">
              <span className="flex-shrink-0 text-primary text-lg">✓</span>
              <p className="text-sm text-slate-600 dark:text-slate-400 font-bold leading-relaxed">
                {t(`about.find.item${num}`)}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-6 md:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 space-y-3">
          <h2 className="text-2xl font-black text-foreground">
            {t('about.why.title', { siteName: site.siteName })}
          </h2>
          <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
            {t('about.why.text', { siteName: site.siteName })}
          </p>
        </div>

        <div className="p-6 md:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 space-y-3 flex flex-col justify-between">
          <div className="space-y-3">
            <h2 className="text-2xl font-black text-foreground">
              {t('about.contact.title')}
            </h2>
            <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
              {t('about.contact.text', { email }).split(email)[0]}
              <a href={`mailto:${email}`} className="text-primary font-bold hover:underline">
                {email}
              </a>
              {t('about.contact.text', { email }).split(email)[1]}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
