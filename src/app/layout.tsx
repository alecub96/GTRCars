import type { Metadata, Viewport } from "next";
import "./globals.css";
import CookieConsent from '@/components/CookieConsent';

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
    'alquiler caravana Gran Canaria',
    'hotel vs camper Gran Canaria',
    'alquiler camper particulares Canarias',
    'pernoctar camper Canarias',
    'vaneando opiniones',
    // ENGLISH
    'campervan hire Gran Canaria',
    'motorhome rental Tenerife',
    'campervan rental Canary Islands',
    'rent a campervan Gran Canaria',
    'cheap campervan rental Tenerife',
    // DEUTSCH
    'camper mieten Gran Canaria',
    'wohnmobil mieten Teneriffa',
    'campervan mieten Kanaren',
    'wohnmobilvermietung Gran Canaria',
    // FRANÇAIS
    'location van Gran Canaria',
    'location camping-car Tenerife',
    'location campervan Canaries',
  ],
  alternates: {
    canonical: 'https://vaneando.com',
    languages: {
      'es-ES': 'https://vaneando.com',
      'en-GB': 'https://vaneando.com?lang=en',
      'de-DE': 'https://vaneando.com?lang=de',
      'fr-FR': 'https://vaneando.com?lang=fr',
      'x-default': 'https://vaneando.com',
    },
  },
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    alternateLocale: ['en_GB', 'de_DE', 'fr_FR'],
    siteName: 'vaneando. — Canarias sobre ruedas',
    title: 'Alquiler de Campers en Canarias | Campervan Hire Gran Canaria & Tenerife',
    description: 'Descubre las 8 Islas Canarias en camper entre particulares. Campervan hire Gran Canaria. Wohnmobil mieten Teneriffa. Location van Canaries.',
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
  icons: {
    icon: '/vaneando-icon.svg',
    apple: '/vaneando-icon.svg',
  },
  other: {
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
    description: 'La plataforma oficial nº 1 para el alquiler de campers, autocaravanas, caravanas y 4x4 entre particulares en las Islas Canarias. Campervan hire Gran Canaria & Tenerife.',
    knowsLanguage: ['es', 'en', 'de', 'fr'],
    areaServed: [
      { '@type': 'Country', name: 'Spain' },
      { '@type': 'Country', name: 'United Kingdom' },
      { '@type': 'Country', name: 'Germany' },
      { '@type': 'Country', name: 'France' },
      { '@type': 'Country', name: 'Ireland' },
      { '@type': 'Country', name: 'Switzerland' },
      { '@type': 'Country', name: 'Austria' },
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
    <html lang="es" className="h-full antialiased">
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdGlobalOrg) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebSite) }} />
      </head>
      <body className="min-h-full flex flex-col font-sans">
        {children}
        <CookieConsent />
      </body>
    </html>
  );
}
