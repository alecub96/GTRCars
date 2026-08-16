import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Panel de Propietario | vaneando.', robots: { index: false, follow: false } };

export default function OwnerLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
