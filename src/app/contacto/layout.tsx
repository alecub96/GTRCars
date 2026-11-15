import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Conserjería VIP 24/7 y Contacto Oficial | Entrega en Aeropuerto, Villa o Hotel',
  description: 'Contacta con el servicio de Conserjería VIP de GTR Cars para reservas personalizadas de superdeportivos, entregas en aeropuerto privado, hoteles 5 estrellas o eventos en Madrid, Marbella, Barcelona y Canarias.',
  alternates: { canonical: 'https://gtrcars.es/contacto' },
  openGraph: {
    title: 'Conserjería VIP 24/7 | GTR Cars',
    description: 'Atención personalizada 24/7 para alquiler y entrega puerta a puerta de superdeportivos.',
    url: 'https://gtrcars.es/contacto',
  },
};

export default function ContactoLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
