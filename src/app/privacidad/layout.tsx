import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Política de privacidad',
  description: 'Información sobre el tratamiento y la protección de datos personales en Vaneando.',
  alternates: { canonical: '/privacidad' },
};

export default function PrivacyLayout({ children }: LayoutProps<'/privacidad'>) { return children; }
