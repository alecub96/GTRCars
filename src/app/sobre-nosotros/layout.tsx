import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sobre Nosotros | El Club Internacional de Superdeportivos e Hypercars',
  description: 'Descubre la historia y filosofía de GTR Cars: la red privada que conecta a propietarios de superdeportivos con conductores verificados en Madrid, Marbella, Barcelona, Baleares y Canarias.',
  alternates: { canonical: 'https://gtrcars.es/sobre-nosotros' },
  openGraph: {
    title: 'Sobre GTR Cars | International Supercar Network',
    description: 'Pasión por la ingeniería, el rendimiento y la custodia de superdeportivos en España y Europa.',
    url: 'https://gtrcars.es/sobre-nosotros',
  },
};

export default function SobreNosotrosLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
