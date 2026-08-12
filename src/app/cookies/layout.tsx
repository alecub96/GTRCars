import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Política de cookies',
  description: 'Información sobre las cookies necesarias y opcionales utilizadas por Vaneando.',
  alternates: { canonical: '/cookies' },
};

export default function CookiesLayout({ children }: LayoutProps<'/cookies'>) { return children; }
