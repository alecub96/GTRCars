import type { Metadata, Viewport } from "next";
import "./globals.css";
import CookieConsent from '@/components/CookieConsent';
import BackToTopButton from '@/components/BackToTopButton';
import MobileStickyCTA from '@/components/MobileStickyCTA';
import { activeSocialLinks } from '@/lib/social-links';

export const viewport: Viewport = {
  themeColor: '#13322E',
  colorScheme: 'light',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL('https://vaneando.com'),
  title: {
    default: 'Alquiler de Campers en Canarias | Gran Canaria & Tenerife | vaneando.',
    template: '%s | vaneando.',
  },
  description: 'Busca y compara campers, autocaravanas, caravanas y vehículos recreativos disponibles en las Islas Canarias.',
  applicationName: 'vaneando.',
  authors: [{ name: 'vaneando. — Canarias sobre ruedas', url: 'https://vaneando.com' }],
  creator: 'vaneando.',
  publisher: 'vaneando.',
  keywords: [
    // ESPAÑOL
    'alquiler camper Canarias',
    'alquiler camper Gran Canaria barato',
    'alquiler autocaravana Tenerife',
    'alquiler furgoneta camperizada Canarias',
    'alquiler 4x4 camperizado Canarias',
    'alquiler camper particulares Canarias',
    'alquiler autocaravanas Fuerteventura',
    'alquiler camper Lanzarote',
    // DEUTSCH (Alemania - Mercado #1 en pernocta y días de estancia)
    'camper mieten Gran Canaria',
    'wohnmobil mieten Teneriffa',
    'campervan mieten Kanaren',
    'wohnmobilvermietung Kanarische Inseln',
    'kastenwagen mieten Fuerteventura',
    'camper mieten Lanzarote privat',
    // ENGLISH (Reino Unido / Irlanda - Mercado #1 en volumen)
    'campervan hire Gran Canaria',
    'motorhome rental Tenerife',
    'campervan rental Canary Islands',
    'rent a campervan Canary Islands',
    'cheap campervan rental Tenerife',
    'peer to peer campervan rental Canary Islands',
    // FRANÇAIS (Francia / Bélgica / Suiza - Comunidad camper líder)
    'location van Gran Canaria',
    'location camping-car Tenerife',
    'location campervan Canaries',
    'location fourgon aménagé Fuerteventura',
    'louer un van entre particuliers Canaries',
    // ITALIANO (Italia - Alto crecimiento camper)
    'noleggio camper Canarie',
    'noleggio camper Gran Canaria',
    'noleggio van Tenerife',
    'noleggio camper tra privati Canarie',
    'affitto camper Fuerteventura',
    // NORSK (Noruega - Turismo nórdico invernal)
    'bobil leie Kanariøyene',
    'leie campervan Gran Canaria',
    'bobilutleie Tenerife',
    'leie bobil Fuerteventura privat',
    // ROMÂNĂ (Rumanía)
    'inchiriere autorulota Insulele Canare',
    'inchiriere camper Gran Canaria',
    'inchiriere autorulote Tenerife',
    'autorulota de inchiriat Canare',
    // NEDERLANDS (Países Bajos / Flandes - Gran cultura camper)
    'camper huren Canarische Eilanden',
    'camper huren Gran Canaria',
    'campervan huren Tenerife',
    'buscamper huren Fuerteventura',
    // SVENSKA & POLSKI (Suecia y Polonia - Mercados clave en auge)
    'hyra husbil Kanarieöarna',
    'hyra campervan Gran Canaria',
    'wynajem kampera Wyspy Kanaryjskie',
    'wynajem kamperow Teneryfa',
  ],
  alternates: { canonical: 'https://vaneando.com' },
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    alternateLocale: ['en_GB', 'de_DE', 'fr_FR', 'it_IT', 'no_NO', 'ro_RO', 'nl_NL', 'sv_SE', 'pl_PL'],
    siteName: 'vaneando. — Canarias sobre ruedas',
    title: 'Alquiler de Campers y Autocaravanas en Canarias | vaneando.',
    description: 'Campers y autocaravanas disponibles en Canarias, con información clara del anuncio y contacto con propietarios.',
    url: 'https://vaneando.com',
    images: [
      {
        url: 'https://vaneando.com/og-image.png',
        width: 1200,
        height: 630,
        type: 'image/png',
        alt: 'vaneando. — Alquiler de campers y autocaravanas en las Islas Canarias',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Alquiler de Campers en Canarias entre Particulares | vaneando.',
    description: 'Alquila furgonetas camperizadas, autocaravanas y 4x4 directamente a propietarios locales verificados en Canarias.',
    images: ['https://vaneando.com/og-image.png'],
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
  verification: {
    google: 'b_aBYmH5fbwoMGeDcDbEHlOhekFHl1pZoVNhw2dfufE',
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/vaneando-icon.svg', type: 'image/svg+xml' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: ['/favicon.ico'],
  },
  manifest: '/site.webmanifest',
  other: {
    'google-site-verification': 'b_aBYmH5fbwoMGeDcDbEHlOhekFHl1pZoVNhw2dfufE',
    'geo.region': 'ES-CN',
    'geo.placename': 'Canary Islands, Spain',
    'geo.position': '28.291564;-16.629130',
    'ICBM': '28.291564, -16.629130',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const jsonLdGlobalOrg = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'vaneando.',
    url: 'https://vaneando.com',
    logo: 'https://vaneando.com/vaneando-lockup.svg',
    description: 'Marketplace de vehículos recreativos publicados para alquiler en las Islas Canarias.',
    knowsLanguage: ['es'],
    areaServed: [
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
    name: 'vaneando.',
    url: 'https://vaneando.com',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://vaneando.com/buscar?island={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <html lang="es" className="h-full antialiased overflow-x-hidden w-full max-w-full">
      <head>
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
        <BackToTopButton />
        <MobileStickyCTA />
      </body>
    </html>
  );
}
