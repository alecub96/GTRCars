import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contrato Digital de Alquiler de Superdeportivos (Validez eIDAS)',
  description: 'Generador oficial de contrato digital para alquiler de vehículos deportivos y superdeportivos entre particulares con firma electrónica eIDAS, acta fotográfica de entrega y descarga en PDF.',
  keywords: [
    'contrato alquiler coche entre particulares pdf',
    'contrato digital alquiler superdeportivo',
    'contrato arrendamiento vehiculo sin conductor',
    'firma electronica alquiler coche gtr cars',
  ],
  alternates: { canonical: 'https://gtrcars.es/contrato' },
  openGraph: {
    title: 'Contrato Digital de Alquiler de Superdeportivos | GTR Cars',
    description: 'Formaliza el alquiler de cualquier deportivo con nuestro generador de contrato digital y acta de inspección en PDF.',
    url: 'https://gtrcars.es/contrato',
  },
};

export default function ContratoLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
