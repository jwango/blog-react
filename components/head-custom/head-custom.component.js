import Head from 'next/head';

export default function HeadCustom({ title, description, keywords, baseUrl, relUrl, author }) {
  // entries to customize
  const url = `${baseUrl}${relUrl}`;
  const defaultAuthor = 'HAL 9000';
  const themeColor = '#666699';
  const siteName = 'blog-react';

  return (
    <Head>
      <meta name='viewport' content='initial-scale=1.0, width=device-width' />
      <meta name='theme-color' content={themeColor} />
      <link rel='manifest' href='/manifest.json' />

      <title>{title}</title>
      <meta name='description' content={description} />
      <meta name='keywords' content={keywords} />
      <meta name='author' content={author || defaultAuthor} />

      <meta property='og:site_name' content={siteName} />
      <meta property='og:title' content={title} />
      <meta property='og:url' content={url} />
      <meta property='og:image' content='/banner.png' />
      <meta property='og:description' content={description} />
      <meta property='og:type' content='website' />

      <meta name='mobile-web-app-capable' content='yes'></meta>
      <link rel='icon' type='image/png' href='/favicon.ico' sizes='16x16' />
      <link rel='icon' type='image/png' href='/favicon.ico' sizes='24x24' />
      <link rel='icon' type='image/png' href='/favicon.ico' sizes='32x32' />
      <link rel='icon' type='image/png' href='/favicon.ico' sizes='64x64' />
      <link rel='apple-touch-icon' href='/app-icon.png' />
      <link rel='mask-icon' href='/mask-icon.svg' color={themeColor}/>
      <link rel='shortcut icon' href='/app-icon.png' />
    </Head>
  );
}