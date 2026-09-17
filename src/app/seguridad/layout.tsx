import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Garantías y Protección | GTRCars.es',
  description: 'Medidas de seguridad, verificación de identidad y garantías de reserva en GTRCars.',
  alternates: { canonical: '/seguridad' },
  robots: { index: false, follow: true },
};

export default function SecurityLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
