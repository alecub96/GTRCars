import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Seguridad y confianza',
  description: 'Medidas de seguridad, verificación, pagos y protección de reservas en Vaneando.',
  alternates: { canonical: '/seguridad' },
};

export default function SecurityLayout({ children }: LayoutProps<'/seguridad'>) { return children; }
