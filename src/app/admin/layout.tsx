import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Administración | GTR Cars', robots: { index: false, follow: false } };

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
