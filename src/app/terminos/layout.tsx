import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Términos y condiciones | vaneando.',
  description: 'Condiciones de uso de la plataforma, reservas, fianzas, seguros y responsabilidades.',
  alternates: { canonical: '/terminos' },
  robots: { index: false, follow: true },
};

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
