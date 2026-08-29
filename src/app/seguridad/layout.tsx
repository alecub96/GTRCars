import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Seguridad y confianza | vaneando.',
  description: 'Medidas de seguridad, verificación, pagos y protección de reservas en Vaneando.',
  alternates: { canonical: '/seguridad' },
  robots: { index: false, follow: true },
};

export default function SecurityLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
