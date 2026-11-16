import React, { Suspense } from 'react';
import HomeClientSupercars from '@/components/HomeClientSupercars';
import { HOME_SEO_FAQS } from '@/components/HomeSeoSection';

export const revalidate = 60;

export default async function HomePage() {
  const jsonLdFleetItemList = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Catálogo Oficial de Superdeportivos en Alquiler — GTR Cars',
    description:
      'Flota verificada de coches deportivos, superdeportivos e hypercars disponibles para alquiler por días en España (Madrid, Marbella, Barcelona, Mallorca, Ibiza, Gran Canaria, Tenerife) y Londres.',
    itemListOrder: 'https://schema.org/ItemListOrderAscending',
    numberOfItems: 13,
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Ferrari 488 GTB Rosso Corsa — 670 CV (Canarias)',
        url: 'https://gtrcars.es/coche/ferrari-488-gtb-rosso-corsa',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Porsche 911 GT3 RS (992) — 525 CV',
        url: 'https://gtrcars.es/coche/porsche-911-gt3-rs-weissach-992',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Porsche 911 GT3 Touring (992) — 510 CV',
        url: 'https://gtrcars.es/coche/porsche-911-gt3-touring',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: 'Ferrari SF90 Stradale Assetto Fiorano — 1.000 CV',
        url: 'https://gtrcars.es/coche/ferrari-sf90-stradale-assetto-fiorano',
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: 'Ferrari 296 GTB Assetto Fiorano — 830 CV',
        url: 'https://gtrcars.es/coche/ferrari-296-gtb-assetto',
      },
      {
        '@type': 'ListItem',
        position: 5,
        name: 'Lamborghini Revuelto V12 Hybrid — 1.015 CV',
        url: 'https://gtrcars.es/coche/lamborghini-revuelto-v12-hybrid',
      },
      {
        '@type': 'ListItem',
        position: 6,
        name: 'Lamborghini Huracán STO — 640 CV',
        url: 'https://gtrcars.es/coche/lamborghini-huracan-sto-2024',
      },
      {
        '@type': 'ListItem',
        position: 7,
        name: 'McLaren 765LT Spider Carbon — 765 CV',
        url: 'https://gtrcars.es/coche/mclaren-765lt-spider-carbon',
      },
      {
        '@type': 'ListItem',
        position: 8,
        name: 'Aston Martin DBS Superleggera V12 — 725 CV',
        url: 'https://gtrcars.es/coche/aston-martin-dbs-superleggera',
      },
      {
        '@type': 'ListItem',
        position: 9,
        name: 'Mercedes-AMG GT Black Series — 730 CV',
        url: 'https://gtrcars.es/coche/mercedes-amg-gt-black-series',
      },
      {
        '@type': 'ListItem',
        position: 10,
        name: 'Audi R8 V10 Performance Quattro — 620 CV',
        url: 'https://gtrcars.es/coche/audi-r8-v10-performance-quattro',
      },
      {
        '@type': 'ListItem',
        position: 11,
        name: 'BMW M4 Competition xDrive — 510 CV',
        url: 'https://gtrcars.es/coche/bmw-m4-competition-xdrive',
      },
      {
        '@type': 'ListItem',
        position: 12,
        name: 'Bentley Continental GT Speed W12 — 659 CV',
        url: 'https://gtrcars.es/coche/bentley-continental-gt-speed',
      },
    ],
  };

  const jsonLdHomeFaq = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: HOME_SEO_FAQS.map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.a,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFleetItemList) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdHomeFaq) }}
      />
      <Suspense fallback={null}>
        <HomeClientSupercars />
      </Suspense>
    </>
  );
}
