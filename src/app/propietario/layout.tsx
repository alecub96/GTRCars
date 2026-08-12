import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Panel de propietario', robots: { index: false, follow: false } };
export default function OwnerLayout({ children }: LayoutProps<'/propietario'>) { return children; }
