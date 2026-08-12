import type { Metadata } from 'next';
import type { ReactNode } from 'react';
export const metadata: Metadata = { title: 'Soporte', robots: { index: false, follow: false } };
export default function SupportLayout({ children }: { children: ReactNode }) { return children; }
