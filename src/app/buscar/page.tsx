import React, { Suspense } from 'react';
import BuscarClient from '@/components/BuscarClient';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

interface BuscarPageProps {
  searchParams: Promise<{
    brand?: string;
    city?: string;
    island?: string;
    vehicleType?: string;
  }>;
}

export async function generateMetadata({ searchParams }: BuscarPageProps): Promise<Metadata> {
  const params = await searchParams;
  const brand = params?.brand?.trim();
  const location = (params?.city || params?.island || '').trim();

  let title = 'Catálogo y Buscador de Superdeportivos en Alquiler | GTR Cars';
  let description =
    'Explora y reserva superdeportivos, GT Cars e hypercars en Madrid, Marbella, Barcelona, Mallorca, Ibiza, Gran Canaria, Tenerife y Londres: Porsche, Ferrari, Lamborghini, McLaren y más.';

  if (brand && location) {
    title = `Alquiler de ${brand} en ${location} — Disponibilidad y Tarifas | GTR Cars`;
    description = `Reserva unidades verificadas de ${brand} en ${location} con entrega VIP Concierge, seguro a todo riesgo y contrato digital eIDAS en GTR Cars.`;
  } else if (brand) {
    title = `Alquiler de ${brand} en España — Catálogo Oficial | GTR Cars`;
    description = `Consulta precios por día y disponibilidad para alquilar un ${brand} en Madrid, Marbella, Barcelona, Mallorca, Ibiza y Canarias con GTR Cars.`;
  } else if (location) {
    title = `Alquiler de Superdeportivos en ${location} — Flota Verificada | GTR Cars`;
    description = `Alquila Ferrari, Lamborghini, Porsche 911 GT3 RS y McLaren en ${location} con entrega en aeropuerto, hotel 5* o domicilio y contrato digital eIDAS.`;
  }

  return {
    title,
    description,
    alternates: {
      canonical: 'https://gtrcars.es/buscar',
    },
    openGraph: {
      title,
      description,
      url: 'https://gtrcars.es/buscar',
      siteName: 'GTR Cars',
      type: 'website',
      images: [
        {
          url: 'https://gtrcars.es/supercars/brands/porsche.png',
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
  };
}

export default async function BuscarPage() {
  const jsonLdCatalog = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Buscador y Catálogo Oficial de Superdeportivos — GTR Cars',
    url: 'https://gtrcars.es/buscar',
    description:
      'Catálogo interactivo de coches deportivos, superdeportivos e hypercars en alquiler por días en España y Europa.',
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdCatalog) }}
      />
      <Suspense fallback={null}>
        <BuscarClient />
      </Suspense>
    </>
  );
}
