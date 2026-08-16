import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Política de cookies | vaneando.',
  description: 'Información sobre el uso de cookies y almacenamiento local en Vaneando.',
  alternates: { canonical: '/cookies' },
};

export default function CookiesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
