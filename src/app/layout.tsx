import type { Metadata, Viewport } from "next";
import "./globals.css";
import CookieConsent from '@/components/CookieConsent';
import BackToTopButton from '@/components/BackToTopButton';
import MobileStickyCTA from '@/components/MobileStickyCTA';
import { activeSocialLinks } from '@/lib/social-links';
import AnalyticsProvider from '@/components/AnalyticsProvider';

export const viewport: Viewport = {
  themeColor: '#050505',
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL('https://gtrcars.vip'),
  title: {
    default: 'GTR Cars | Alquiler de Deportivos y Superdeportivos en Gran Canaria y Tenerife',
    template: '%s | GTR Cars',
  },
  description: 'Alquiler exclusivo de deportivos, superdeportivos y hypercars en Gran Canaria y Tenerife directamente entre particulares con telemetría en vivo, contrato digital y depósito en custodia.',
  applicationName: 'GTR Cars',
  authors: [{ name: 'GTR Cars // Hypercar Vault', url: 'https://gtrcars.vip' }],
  creator: 'GTR Cars',
  publisher: 'GTR Cars',
  keywords: [
    'alquiler deportivos gran canaria',
    'alquiler superdeportivos tenerife',
    'alquiler ferrari gran canaria',
    'alquiler lamborghini tenerife',
    'alquiler porsche 911 gt3 rs canarias',
    'alquiler coches lujo gran canaria',
    'supercar rental canary islands',
    'sports car hire tenerife',
    'alquiler hypercar espana',
    'gtr cars vault',
  ],
  alternates: { canonical: 'https://gtrcars.vip' },
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    siteName: 'GTR Cars // P2P Hypercar Vault',
    title: 'GTR Cars | Alquiler de Superdeportivos en Gran Canaria y Tenerife',
    description: 'Accede al Vault más exclusivo de superdeportivos en Canarias. Alquila Ferrari, Lamborghini, Porsche y McLaren directamente de propietarios verificados.',
    url: 'https://gtrcars.vip',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        type: 'image/png',
        alt: 'GTR Cars — Alquiler de Deportivos en Gran Canaria y Tenerife',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GTR Cars | Supercar & Hypercar Vault Canarias',
    description: 'Alquiler exclusivo de deportivos, superdeportivos y hypercars en Gran Canaria y Tenerife.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.png', sizes: 'any' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/gtcars-logo.svg', type: 'image/svg+xml' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: ['/favicon.png'],
  },
  manifest: '/site.webmanifest',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const jsonLdGlobalOrg = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'GTR Cars',
    url: 'https://gtrcars.vip',
    logo: 'https://gtrcars.vip/favicon.png',
    description: 'Plataforma exclusiva de alquiler de superdeportivos e hypercars en Gran Canaria y Tenerife directamente entre particulares.',
    knowsLanguage: ['es', 'en'],
    areaServed: [
      { '@type': 'AdministrativeArea', name: 'Gran Canaria' },
      { '@type': 'AdministrativeArea', name: 'Tenerife' },
      { '@type': 'AdministrativeArea', name: 'Canarias' },
      { '@type': 'Country', name: 'Spain' },
    ],
    address: {
      '@type': 'PostalAddress',
      addressRegion: 'Canarias',
      addressCountry: 'ES',
    },
    sameAs: activeSocialLinks.map(([, url]) => url),
  };

  const jsonLdWebSite = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'GTR Cars // P2P Supercar & Hypercar Vault',
    url: 'https://gtrcars.vip',
  };

  return (
    <html lang="es" className="h-full antialiased overflow-x-hidden w-full max-w-full">
      <head>
        {/* Google tag (gtag.js) */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-G519FGB88C" />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('consent', 'default', { analytics_storage: 'denied', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied', wait_for_update: 500 });
gtag('js', new Date());
gtag('config', 'G-G519FGB88C');`,
          }}
        />
        {/* End Google tag (gtag.js) */}
        {/* Google Tag Manager */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-N3W2ZJ2M');`,
          }}
        />
        {/* End Google Tag Manager */}
        <script
          type="text/javascript"
          dangerouslySetInnerHTML={{
            __html: `(function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "ybr6qavm58");`,
          }}
        />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" type="image/png" sizes="192x192" href="/icon-192.png" />
        <link rel="icon" type="image/svg+xml" href="/vaneando-icon.svg" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" />
        <link rel="preconnect" href="https://images.unsplash.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                function handleChunkError(msg) {
                  var text = (msg || '').toLowerCase();
                  if (text.indexOf('loading chunk') !== -1 || text.indexOf('chunkloaderror') !== -1 || text.indexOf('loading css chunk') !== -1 || text.indexOf('failed to fetch dynamically imported module') !== -1 || text.indexOf('dynamically imported') !== -1) {
                    var storageKey = 'vaneando_chunk_reload';
                    var lastReload = sessionStorage.getItem(storageKey);
                    var now = Date.now();
                    if (!lastReload || (now - parseInt(lastReload, 10)) > 4000) {
                      sessionStorage.setItem(storageKey, now.toString());
                      var search = window.location.search;
                      var sep = search ? '&' : '?';
                      window.location.replace(window.location.pathname + search + sep + '_v=' + now);
                    }
                  }
                }
                window.addEventListener('error', function(e) {
                  if (e && (e.message || (e.target && e.target.src) || (e.target && e.target.href))) {
                    handleChunkError(e.message || e.filename || (e.target && (e.target.src || e.target.href)) || '');
                  }
                }, true);
                window.addEventListener('unhandledrejection', function(e) {
                  if (e && e.reason) {
                    handleChunkError(e.reason.message || e.reason.name || String(e.reason));
                  }
                });
              })();
            `,
          }}
        />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdGlobalOrg) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebSite) }} />
      </head>
      <body className="min-h-full flex flex-col font-sans overflow-x-hidden w-full max-w-full">
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-N3W2ZJ2M"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        {/* End Google Tag Manager (noscript) */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2.5 focus:rounded-full focus:bg-[#13322E] focus:text-white focus:font-bold focus:text-xs focus:shadow-xl focus:outline-none"
        >
          Saltar al contenido principal
        </a>
        <div id="main-content" className="flex-1 flex flex-col">
          {children}
        </div>
        <CookieConsent />
        <AnalyticsProvider />
        <BackToTopButton />
        <MobileStickyCTA />
      </body>
    </html>
  );
}
