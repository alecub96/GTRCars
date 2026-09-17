import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Política de cookies | GTRCars.es',
  description: 'Información sobre el uso de cookies y almacenamiento local en GTRCars.',
  alternates: { canonical: '/cookies' },
};

export default function CookiesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
