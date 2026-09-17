import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Política de privacidad | GTRCars.es',
  description: 'Tratamiento de datos personales, finalidades, derechos y seguridad en GTRCars.',
  alternates: { canonical: '/privacidad' },
};

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
