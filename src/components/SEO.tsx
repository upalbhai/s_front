import Head from 'next/head';

interface SEOProps {
  title: string;
  description: string;
  canonical?: string;
  ogImage?: string;
  ogType?: 'website' | 'article' | 'music.song';
  schema?: any;
  noindex?: boolean;
}

const SEO = ({ 
  title, 
  description, 
  canonical, 
  ogImage = 'https://soundbuttonsmax.com/images/og-home.jpg',
  ogType = 'website',
  schema,
  noindex = false
}: SEOProps) => {
  const siteUrl = 'https://soundbuttonsmax.com';
  const fullUrl = canonical ? `${siteUrl}${canonical}` : siteUrl;

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={fullUrl} />
      {noindex && <meta name="robots" content="noindex, follow" />}
      
      {/* Open Graph */}
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content="Sound Buttons Max" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {/* JSON-LD Schema */}
      {schema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      )}
    </>
  );
};

export default SEO;
