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
    default: 'Alquiler de Campers en Canarias | Particulares & Autocaravanas | vaneando.',
    template: '%s | vaneando.',
  },
  description: 'La plataforma #1 en las Islas Canarias para alquilar campers, autocaravanas, caravanas y 4x4 entre particulares. Sin comisiones ocultas, identidades verificadas y hasta un 60% de ahorro frente a un hotel.',
  applicationName: 'vaneando.',
  authors: [{ name: 'vaneando. — Canarias sobre ruedas', url: 'https://vaneando.com' }],
  creator: 'vaneando.',
  publisher: 'vaneando.',
  keywords: [
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
  ],
  alternates: {
    canonical: 'https://vaneando.com',
  },
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    siteName: 'vaneando. — Canarias sobre ruedas',
    title: 'Alquiler de Campers en Canarias | Particulares & Autocaravanas',
    description: 'Descubre las 8 Islas Canarias en camper entre particulares. Vehículos verificados, seguro integral y recomendación local.',
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
    title: 'Alquiler de Campers en Canarias | vaneando.',
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
    description: 'La plataforma oficial nº 1 para el alquiler de campers, autocaravanas, caravanas y 4x4 entre particulares en las Islas Canarias.',
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
