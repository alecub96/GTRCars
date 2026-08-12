import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Términos y condiciones',
  description: 'Condiciones de uso, reserva, contratación y convivencia de la plataforma Vaneando.',
  alternates: { canonical: '/terminos' },
};

export default function TermsLayout({ children }: LayoutProps<'/terminos'>) { return children; }
