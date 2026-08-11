import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL('https://vaneando.com'),
  title: { default: 'Alquiler de campers en Canarias | vaneando.', template: '%s | vaneando.' },
  description: 'Alquila campers entre particulares en Canarias. Vehículos locales, pagos protegidos y rutas para descubrir las ocho islas sobre ruedas.',
  applicationName: 'vaneando.',
  keywords: ['alquiler camper Canarias', 'autocaravana Canarias', 'camper Gran Canaria', 'camper Tenerife', 'turismo local Canarias'],
  alternates: { canonical: '/' },
  openGraph: { type: 'website', locale: 'es_ES', siteName: 'vaneando.', title: 'Alquiler de campers en Canarias | vaneando.', description: 'Una plataforma canaria para descubrir las islas sobre ruedas.', url: 'https://vaneando.com', images: [{ url: '/vaneando-icon.svg', width: 512, height: 512, alt: 'vaneando.' }] },
  twitter: { card: 'summary_large_image', title: 'Alquiler de campers en Canarias | vaneando.', description: 'Una plataforma canaria para descubrir las islas sobre ruedas.', images: ['/vaneando-icon.svg'] },
  robots: { index: true, follow: true },
  icons: { icon: '/vaneando-icon.svg', apple: '/vaneando-icon.svg' },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className="h-full antialiased"
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
