import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Términos y condiciones | GTRCars.es',
  description: 'Condiciones de uso de la plataforma, reservas y responsabilidades en GTRCars.',
  alternates: { canonical: '/terminos' },
  robots: { index: false, follow: true },
};

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
