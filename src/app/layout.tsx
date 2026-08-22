import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from 'next/font/google';
import "./globals.css";
import CookieConsent from '@/components/CookieConsent';
import BackToTopButton from '@/components/BackToTopButton';
import MobileStickyCTA from '@/components/MobileStickyCTA';

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
});

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
  description: 'La plataforma #1 en las Islas Canarias para alquilar campers, autocaravanas, caravanas y 4x4 entre particulares. Campervan hire Gran Canaria & Tenerife. Wohnmobil mieten. Location van Canaries.',
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
  alternates: {
    canonical: 'https://vaneando.com',
    languages: {
      'es-ES': 'https://vaneando.com',
      'en-GB': 'https://vaneando.com?lang=en',
      'de-DE': 'https://vaneando.com?lang=de',
      'fr-FR': 'https://vaneando.com?lang=fr',
      'it-IT': 'https://vaneando.com?lang=it',
      'no-NO': 'https://vaneando.com?lang=no',
      'ro-RO': 'https://vaneando.com?lang=ro',
      'nl-NL': 'https://vaneando.com?lang=nl',
      'sv-SE': 'https://vaneando.com?lang=sv',
      'pl-PL': 'https://vaneando.com?lang=pl',
      'x-default': 'https://vaneando.com',
    },
  },
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    alternateLocale: ['en_GB', 'de_DE', 'fr_FR', 'it_IT', 'no_NO', 'ro_RO', 'nl_NL', 'sv_SE', 'pl_PL'],
    siteName: 'vaneando. — Canarias sobre ruedas',
    title: 'Alquiler de Campers en Canarias | Campervan Hire Canary Islands',
    description: 'La plataforma para alquilar campers, autocaravanas y 4x4 entre particulares en las Islas Canarias. Campervan hire Gran Canaria & Tenerife. Wohnmobil mieten Kanaren. Location van Canaries. Noleggio camper.',
    url: 'https://vaneando.com',
    images: [
      {
        url: '/vaneando-lockup.svg',
        width: 1200,
        height: 630,
        alt: 'vaneando. — Alquiler de campers en las Islas Canarias',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Alquiler de Campers en Canarias | Campervan Hire | vaneando.',
    description: 'Alquila furgonetas camperizadas, autocaravanas y 4x4 directamente a propietarios locales verificados.',
    images: ['/vaneando-lockup.svg'],
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
    description: 'La plataforma oficial nº 1 para el alquiler de campers, autocaravanas, caravanas y 4x4 entre particulares en las Islas Canarias. Campervan hire Gran Canaria & Tenerife. Wohnmobil mieten Kanaren.',
    knowsLanguage: ['es', 'en', 'de', 'fr', 'it', 'ro', 'no', 'nl', 'sv', 'pl', 'da', 'fi'],
    areaServed: [
      { '@type': 'Country', name: 'Spain' },
      { '@type': 'Country', name: 'United Kingdom' },
      { '@type': 'Country', name: 'Germany' },
      { '@type': 'Country', name: 'France' },
      { '@type': 'Country', name: 'Italy' },
      { '@type': 'Country', name: 'Norway' },
      { '@type': 'Country', name: 'Romania' },
      { '@type': 'Country', name: 'Netherlands' },
      { '@type': 'Country', name: 'Sweden' },
      { '@type': 'Country', name: 'Poland' },
      { '@type': 'Country', name: 'Belgium' },
      { '@type': 'Country', name: 'Ireland' },
      { '@type': 'Country', name: 'Switzerland' },
      { '@type': 'Country', name: 'Austria' },
      { '@type': 'Country', name: 'Denmark' },
      { '@type': 'Country', name: 'Finland' },
    ],
    address: {
      '@type': 'PostalAddress',
      addressRegion: 'Canarias',
      addressCountry: 'ES',
    },
    sameAs: [
      'https://www.facebook.com/vaneando',
      'https://www.instagram.com/vaneando_canarias',
    ],
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
      <body className={`min-h-full flex flex-col ${plusJakarta.className} overflow-x-hidden w-full max-w-full`}>
        {children}
        <CookieConsent />
        <BackToTopButton />
        <MobileStickyCTA />
      </body>
    </html>
  );
}
