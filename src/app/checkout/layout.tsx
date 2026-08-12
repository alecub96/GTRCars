import type { Metadata } from 'next';
import type { ReactNode } from 'react';
export const metadata: Metadata = { title: 'Devolución del vehículo', robots: { index: false, follow: false } };
export default function CheckoutLayout({ children }: { children: ReactNode }) { return children; }
