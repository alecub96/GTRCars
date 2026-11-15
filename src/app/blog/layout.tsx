import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog y Guías de Superdeportivos y Rutas VIP en España y Canarias',
  description: 'Guías definitivas sobre alquiler de superdeportivos en Madrid, Marbella, Barcelona, Mallorca, Gran Canaria y Tenerife: rutas de montaña, fianzas, seguros y consejos de conducción en Ferrari, Lamborghini y Porsche.',
  alternates: { canonical: 'https://gtrcars.es/blog' },
  openGraph: {
    title: 'Blog y Guías de Superdeportivos | GTR Cars',
    description: 'Descubre las mejores rutas de conducción, guías de alquiler de superdeportivos y análisis de modelos Ferrari, Porsche y Lamborghini.',
    url: 'https://gtrcars.es/blog',
    type: 'website',
  },
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
