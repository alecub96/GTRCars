import type { Metadata, Viewport } from "next";
import "./globals.css";
import CookieConsent from '@/components/CookieConsent';
import BackToTopButton from '@/components/BackToTopButton';
import MobileStickyCTA from '@/components/MobileStickyCTA';
import { activeSocialLinks } from '@/lib/social-links';
import AnalyticsProvider from '@/components/AnalyticsProvider';

export const viewport: Viewport = {
  themeColor: '#FFFFFF',
  colorScheme: 'light',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL('https://gtrcars.es'),
  title: {
    default: 'GTR Cars | Alquiler de Superdeportivos en Madrid, Marbella, Barcelona, Baleares y Canarias',
    template: '%s | GTR Cars',
  },
  description: 'Alquila superdeportivos, GT Cars e hypercars directamente de propietarios verificados: Porsche 911 GT3, Ferrari SF90, Lamborghini Revuelto y McLaren en Madrid, Marbella, Barcelona, Mallorca, Ibiza, Gran Canaria y Tenerife con contrato digital y fianza protegida.',
  applicationName: 'GTR Cars',
  authors: [{ name: 'GTR Cars // International Supercar Club', url: 'https://gtrcars.es' }],
  creator: 'GTR Cars',
  publisher: 'GTR Cars',
  category: 'Automotive / Luxury Car Rental',
  keywords: [
    'alquiler superdeportivos',
    'alquiler superdeportivos madrid',
    'alquiler superdeportivos marbella',
    'alquiler superdeportivos barcelona',
    'alquiler superdeportivos mallorca',
    'alquiler superdeportivos ibiza',
    'alquiler superdeportivos tenerife',
    'alquiler deportivos gran canaria',
    'alquiler superdeportivos canarias',
    'alquiler ferrari madrid',
    'alquiler lamborghini marbella',
    'alquiler porsche 911 gt3',
    'alquiler mclaren españa',
    'alquiler coches de lujo españa',
    'gtr cars',
    'gt cars',
    'gt cars premium',
    'supercar rental spain',
    'supercar hire marbella',
    'rentabilizar superdeportivo propietarios',
  ],
  alternates: {
    canonical: 'https://gtrcars.es',
    languages: {
      'es-ES': 'https://gtrcars.es',
      'en-GB': 'https://gtrcars.es',
      'x-default': 'https://gtrcars.es',
    },
  },
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    alternateLocale: ['en_GB'],
    siteName: 'GTR Cars // International Supercar Network',
    title: 'GTR Cars | Alquiler de Superdeportivos en Madrid, Marbella, Barcelona, Baleares y Canarias',
    description: 'Accede a la colección más exclusiva de superdeportivos en España y Europa. Alquila Porsche, Ferrari, Lamborghini y McLaren con entrega VIP y contrato digital eIDAS.',
    url: 'https://gtrcars.es',
    images: [
      {
        url: '/brand/logo-primary.png',
        width: 1200,
        height: 630,
        type: 'image/png',
        alt: 'GTR Cars — Alquiler de Superdeportivos en España y Europa',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GTR Cars | Alquiler de Superdeportivos e Hypercars',
    description: 'Alquiler exclusivo de deportivos, superdeportivos e hypercars en Madrid, Marbella, Barcelona, Mallorca, Gran Canaria y Tenerife.',
    images: ['/brand/logo-primary.png'],
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
      { url: '/gtr-icon.svg?v=gtr3', type: 'image/svg+xml' },
      { url: '/favicon.ico?v=gtr3', sizes: 'any' },
      { url: '/favicon.png?v=gtr3', type: 'image/png' },
      { url: '/favicon-32x32.png?v=gtr3', sizes: '32x32', type: 'image/png' },
      { url: '/icon-192.png?v=gtr3', sizes: '192x192', type: 'image/png' },
      { url: '/brand/app-icon.png?v=gtr3', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png?v=gtr3', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: ['/gtr-icon.svg?v=gtr3'],
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || '',
  },
  manifest: '/site.webmanifest',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const jsonLdGlobalOrg = {
    '@context': 'https://schema.org',
    '@type': ['AutoRental', 'Organization'],
    '@id': 'https://gtrcars.es/#organization',
    name: 'GTR Cars',
    alternateName: ['GT Cars Premium', 'GTRCars.es', 'GTR Cars Supercar Club'],
    url: 'https://gtrcars.es',
    logo: 'https://gtrcars.es/brand/logo-primary.png',
    image: 'https://gtrcars.es/supercars/brands/porsche.png',
    description: 'Plataforma líder de alquiler de superdeportivos, GT Cars e hypercars en Madrid, Marbella, Barcelona, Mallorca, Ibiza, Gran Canaria, Tenerife y Londres.',
    priceRange: '€€€€',
    telephone: '+34 900 100 200',
    email: 'contacto@gtrcars.es',
    knowsLanguage: ['es', 'en'],
    areaServed: [
      { '@type': 'City', name: 'Madrid' },
      { '@type': 'City', name: 'Marbella' },
      { '@type': 'City', name: 'Barcelona' },
      { '@type': 'AdministrativeArea', name: 'Mallorca' },
      { '@type': 'AdministrativeArea', name: 'Ibiza' },
      { '@type': 'AdministrativeArea', name: 'Gran Canaria' },
      { '@type': 'AdministrativeArea', name: 'Tenerife' },
      { '@type': 'City', name: 'London' },
      { '@type': 'Country', name: 'Spain' },
    ],
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.98',
      reviewCount: '142',
      bestRating: '5',
      worstRating: '1',
    },
    sameAs: activeSocialLinks.map(([, url]) => url),
  };

  const jsonLdWebSite = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': 'https://gtrcars.es/#website',
    name: 'GTR Cars // Alquiler de Superdeportivos',
    url: 'https://gtrcars.es',
    publisher: { '@id': 'https://gtrcars.es/#organization' },
    inLanguage: 'es-ES',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://gtrcars.es/buscar?brand={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
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
            })(window, document, "clarity", "script", "${process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID || 'zf9zp8dwdj'}");`,
          }}
        />
        <link rel="icon" href="/favicon.ico?v=gtr3" sizes="any" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png?v=gtr3" />
        <link rel="icon" type="image/png" sizes="192x192" href="/icon-192.png?v=gtr3" />
        <link rel="icon" type="image/svg+xml" href="/gtr-icon.svg?v=gtr3" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png?v=gtr3" />
        <link rel="manifest" href="/site.webmanifest?v=gtr3" />
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
                    var storageKey = 'gtrcars_chunk_reload';
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
