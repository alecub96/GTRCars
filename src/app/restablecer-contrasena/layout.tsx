import type { Metadata } from 'next';
import type { ReactNode } from 'react';
export const metadata: Metadata = { title: 'Restablecer contraseña', robots: { index: false, follow: false } };
export default function PasswordResetLayout({ children }: { children: ReactNode }) { return children; }
