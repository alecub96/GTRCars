import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Garantías, Custodia de Fianza y Seguridad en el Alquiler de Superdeportivos',
  description: 'Conoce el protocolo de seguridad de GTR Cars: verificación biométrica KYC de conductores, contrato digital legal, check-in fotográfico 4K y custodia bancaria.',
  alternates: { canonical: 'https://gtrcars.es/seguridad' },
  openGraph: {
    title: 'Garantías y Protocolo de Seguridad | GTR Cars',
    description: 'Máxima protección para propietarios y conductores de superdeportivos en España y Europa.',
    url: 'https://gtrcars.es/seguridad',
  },
};

export default function SeguridadLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
