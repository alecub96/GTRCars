import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Publicar y Rentabilizar mi Superdeportivo | GTR Cars Partners Vault',
  description: 'Rentabiliza tu Porsche, Ferrari, Lamborghini, McLaren o Aston Martin en GTR Cars con total seguridad: conductores verificados KYC, contrato digital eIDAS y fianza protegida.',
  keywords: [
    'rentabilizar superdeportivo',
    'alquilar mi coche de lujo',
    'alquilar mi porsche',
    'alquilar mi ferrari',
    'cesión de superdeportivos propietarios',
    'gtr cars propietarios',
  ],
  alternates: { canonical: 'https://gtrcars.es/publicar-coche' },
  openGraph: {
    title: 'Publicar y Rentabilizar mi Superdeportivo | GTR Cars',
    description: 'Únete al Club de Propietarios GTR Cars y genera ingresos con tu deportivo de alta gama bajo protocolo de custodia y verificación.',
    url: 'https://gtrcars.es/publicar-coche',
  },
};

export default function PublicarCocheLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
