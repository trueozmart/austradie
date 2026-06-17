import { Helmet } from 'react-helmet-async';

const SITE_URL = 'https://www.austradie.com.au';
const SITE_NAME = 'AusTradie';
const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.jpg`;

interface SeoProps {
  title: string;
  description: string;
  path: string;
  ogImage?: string;
  jsonLd?: object;
}

export default function Seo({ title, description, path, ogImage, jsonLd }: SeoProps) {
  const url = `${SITE_URL}${path}`;
  // Don't double-append brand if title already contains a pipe separator
  const fullTitle = title.includes('|') ? title : `${title} | ${SITE_NAME}`;
  const image = ogImage ?? DEFAULT_OG_IMAGE;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="robots" content="index,follow" />
      <link rel="canonical" href={url} />

      <meta property="og:type" content="website" />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {jsonLd && (
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      )}
    </Helmet>
  );
}

export { SITE_URL, SITE_NAME };
