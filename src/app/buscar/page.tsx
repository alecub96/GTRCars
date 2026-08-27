import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { prisma } from '@/lib/prisma';
import { CANARY_ISLANDS } from '@/lib/pricing';
import { Star, MapPin, Filter, SlidersHorizontal, ShieldCheck, ChevronRight } from 'lucide-react';
import VehicleViewTracker from '@/components/VehicleViewTracker';
import { getFeaturedAudience, sortVehiclesWithHalfHourFeaturedRotation } from '@/lib/featured';

import type { Metadata } from 'next';
import VehicleTypeSlider from '@/components/VehicleTypeSlider';
import { VEHICLE_TYPES_CONFIG } from '@/lib/vehicle-types';
import SearchMapExplorer from '@/components/SearchMapExplorer';
import { parseDateOnly } from '@/lib/date-utils';

export const dynamic = 'force-dynamic';

interface SearchPageProps {
  searchParams: Promise<{
    island?: string;
    vehicleType?: string;
    minPrice?: string;
    maxPrice?: string;
    passengers?: string;
    sort?: string;
    startDate?: string;
    endDate?: string;
    view?: string;
    utm_source?: string;
    utm_medium?: string;
    utm_campaign?: string;
  }>;
}

export async function generateMetadata({ searchParams }: SearchPageProps): Promise<Metadata> {
  const params = await searchParams;
  const islandName = params.island ? params.island : 'las Islas Canarias';
  const typeObj = VEHICLE_TYPES_CONFIG.find((v) => v.id === params.vehicleType);
  const typeLabel = typeObj ? typeObj.label : 'campers y autocaravanas';

  return {
    title: `Alquiler de ${typeLabel} en ${islandName} | vaneando.`,
    description: `Busca y compara ${typeLabel} publicados en ${islandName}. Revisa precio, disponibilidad y condiciones antes de contactar.`,
    alternates: { canonical: 'https://vaneando.com/buscar' },
    robots: params.island || params.vehicleType || params.minPrice || params.maxPrice || params.passengers || params.startDate || params.endDate || params.sort
      ? { index: false, follow: true }
      : { index: true, follow: true },
    openGraph: {
      title: `Alquiler de ${typeLabel} en ${islandName} | vaneando.`,
      description: `Compara precios y disponibilidad de ${typeLabel} en ${islandName}. Reserva con contratos directos entre particulares e identidades verificadas.`,
      url: `https://vaneando.com/buscar`,
      images: [
        {
          url: 'https://vaneando.com/og-image.png',
          width: 1200,
          height: 630,
          alt: `Alquiler de ${typeLabel} en ${islandName}`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `Alquiler de ${typeLabel} en ${islandName} | vaneando.`,
      description: `Compara precios y disponibilidad de campers en ${islandName}.`,
      images: ['https://vaneando.com/og-image.png'],
    },
  };
}

const ISLAND_HERO_IMAGES: Record<string, string> = {
  'Gran Canaria': '/Islas/gran%20canaria.webp',
  'Tenerife': '/Islas/Tenerife.webp',
  'Lanzarote': '/Islas/lanzarote.webp',
  'Fuerteventura': '/Islas/fuerteventura.webp',
  'La Palma': '/Islas/la%20palma.webp',
  'La Gomera': '/Islas/la%20gomera.webp',
  'El Hierro': '/Islas/el%20hierro.webp',
  'La Graciosa': '/Islas/la%20graciosa.webp',
};

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const selectedIsland = params.island || '';
  const vehicleType = params.vehicleType || '';
  const activeIslandImage = ISLAND_HERO_IMAGES[selectedIsland] || ISLAND_HERO_IMAGES['Gran Canaria'];
  const passengers = params.passengers ? parseInt(params.passengers) : undefined;
  const minPrice = params.minPrice ? parseFloat(params.minPrice) : undefined;
  const maxPrice = params.maxPrice ? parseFloat(params.maxPrice) : undefined;
  const sort = params.sort || 'recommended';
  const startDate = params.startDate;
  const endDate = params.endDate;
  const attribution = {
    utm_source: params.utm_source,
    utm_medium: params.utm_medium,
    utm_campaign: params.utm_campaign,
  };

  const whereClause: any = { status: 'ACTIVE' };
  if (selectedIsland && selectedIsland !== 'todas') {
    const normIsland = selectedIsland.replace(/-/g, ' ');
    whereClause.island = { contains: normIsland };
  }
  if (vehicleType && vehicleType !== 'TODOS') {
    whereClause.vehicleType = vehicleType;
  }
  if (passengers) whereClause.passengers = { gte: passengers };
  if (minPrice || maxPrice) {
    whereClause.basePricePerDay = {};
    if (minPrice) whereClause.basePricePerDay.gte = minPrice;
    if (maxPrice) whereClause.basePricePerDay.lte = maxPrice;
  }
  const parsedStartDate = parseDateOnly(startDate);
  const parsedEndDate = parseDateOnly(endDate);
  if (parsedStartDate && parsedEndDate && parsedStartDate < parsedEndDate) {
    whereClause.availabilityBlocks = { none: { startDate: { lt: parsedEndDate }, endDate: { gt: parsedStartDate } } };
  }

  let orderBy: any = { createdAt: 'desc' };
  if (sort === 'price_asc') orderBy = { basePricePerDay: 'asc' };
  if (sort === 'price_desc') orderBy = { basePricePerDay: 'desc' };

  let vehicles: any[] = [];
  try {
    const { ensureDbSchema } = await import('@/lib/prisma-ensure-schema');
    await ensureDbSchema();

    let databaseVehicles: any[] = [];
    try {
      databaseVehicles = await prisma.vehicle.findMany({
        where: whereClause,
        select: {
          id: true, ownerId: true, slug: true, title: true, island: true, municipality: true, passengers: true, beds: true,
          transmission: true, basePricePerDay: true, description: true, latitude: true, longitude: true, addressApprox: true,
          photos: { orderBy: { orderIndex: 'asc' } },
          reviews: { select: { rating: true } },
        },
        orderBy,
      });
    } catch (queryErr) {
      console.warn('Prisma findMany fallback:', queryErr);
      const rawConditions = ['status = ?'];
      const rawParams: unknown[] = ['ACTIVE'];
      if (selectedIsland && selectedIsland !== 'todas') {
        rawConditions.push('island LIKE ?');
        rawParams.push(`%${selectedIsland.replace(/-/g, ' ')}%`);
      }
      if (vehicleType && vehicleType !== 'TODOS') {
        rawConditions.push('vehicleType = ?');
        rawParams.push(vehicleType);
      }
      if (passengers) {
        rawConditions.push('passengers >= ?');
        rawParams.push(passengers);
      }
      if (minPrice !== undefined) {
        rawConditions.push('basePricePerDay >= ?');
        rawParams.push(minPrice);
      }
      if (maxPrice !== undefined) {
        rawConditions.push('basePricePerDay <= ?');
        rawParams.push(maxPrice);
      }
      const rawOrder = sort === 'price_asc' ? 'basePricePerDay ASC' : sort === 'price_desc' ? 'basePricePerDay DESC' : 'createdAt DESC';
      const rawRows = ((await prisma.$queryRawUnsafe(
        `SELECT id, ownerId, slug, title, island, municipality, passengers, beds, transmission, basePricePerDay, description, latitude, longitude, addressApprox FROM Vehicle WHERE ${rawConditions.join(' AND ')} ORDER BY ${rawOrder}`,
        ...rawParams
      ).catch(() => [])) || []) as any[];

      for (const row of rawRows) {
        const photos = ((await prisma.$queryRawUnsafe(
          `SELECT url FROM VehiclePhoto WHERE vehicleId = ? ORDER BY orderIndex ASC`,
          row.id
        ).catch(() => [])) || []) as any[];
        databaseVehicles.push({
          ...row,
          photos: photos || [],
          reviews: [],
        });
      }
    }

    const featured = await getFeaturedAudience().catch(() => ({ ownerIds: new Set(), vehicleIds: new Set(), subscriptionOwnerIds: new Set() }));
    vehicles = databaseVehicles
      .map((vehicle) => ({
        ...vehicle,
        isFeatured: featured.ownerIds.has(vehicle.ownerId) || featured.vehicleIds.has(vehicle.id) || featured.subscriptionOwnerIds.has(vehicle.ownerId),
      }))
      .sort((a, b) => Number(b.isFeatured) - Number(a.isFeatured));
  } catch (error) {
    console.error('Error fetching database vehicles:', error);
  }

  const allVehiclesMap = new Map<string, any>();
  vehicles.forEach((v) => allVehiclesMap.set(v.slug || v.id, v));

  const finalVehiclesList = Array.from(allVehiclesMap.values());
  vehicles = sortVehiclesWithHalfHourFeaturedRotation(finalVehiclesList);

  const jsonLdSearchResults = {
    '@context': 'https://schema.org',
    '@type': 'SearchResultsPage',
    name: `Alquiler de campers y autocaravanas ${selectedIsland ? `en ${selectedIsland}` : 'en Canarias'}`,
    url: `https://vaneando.com/buscar`,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: vehicles.length,
      itemListElement: vehicles.map((vehicle, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        url: `https://vaneando.com/camper/${vehicle.slug}`,
        name: vehicle.title,
      })),
    },
  };

  const jsonLdBreadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Inicio', item: 'https://vaneando.com' },
      { '@type': 'ListItem', position: 2, name: 'Buscador de Campers', item: 'https://vaneando.com/buscar' },
      ...(selectedIsland ? [{ '@type': 'ListItem', position: 3, name: selectedIsland, item: `https://vaneando.com/buscar?island=${encodeURIComponent(selectedIsland)}` }] : []),
    ],
  };

  return (
    <div className="min-h-screen bg-[#F7F6F2] text-[#1C2826]">
      <Navbar />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSearchResults) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }} />

      {/* CABECERA BUSCADOR CON FONDO DE LA ISLA SELECCIONADA Y SLIDER DE VEHICULOS */}
      <section className="relative z-10 min-h-[340px] flex items-center justify-center overflow-hidden px-4 py-12 border-b border-[#E9E1D2]">
        <div className="absolute inset-0 z-0">
          <img
            key={selectedIsland || 'all'}
            src={activeIslandImage}
            alt={selectedIsland || 'Islas Canarias'}
            className="absolute inset-0 m-auto max-h-[70%] max-w-[70%] scale-[0.70] object-contain object-center brightness-[0.88] transition-all duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#F7F6F2] via-black/30 to-black/60" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto w-full text-center sm:text-left px-4 space-y-4">
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-white tracking-tight drop-shadow-md">
            Alquiler de Campers y Autocaravanas {selectedIsland ? `en ${selectedIsland}` : 'en Canarias'}
          </h1>
          <p className="text-sm sm:text-base text-white/90 font-medium max-w-xl drop-shadow">
            {vehicles.length} vehículos listos para explorar {selectedIsland || 'las Islas Canarias'} sobre ruedas
          </p>

          <VehicleTypeSlider selectedType={vehicleType} />
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* CONTENIDOR FILTROS + RESULTADOS */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* PANEL DE FILTROS LATERAL */}
          <aside className="bg-white rounded-3xl p-6 border border-[#E9E1D2] shadow-sm h-fit space-y-6">
            <div className="flex items-center justify-between border-b border-[#E9E1D2] pb-4">
              <h3 className="font-serif text-lg font-semibold flex items-center space-x-2">
                <SlidersHorizontal className="w-4 h-4 text-[#E07A5F]" />
                <span>Filtros de Búsqueda</span>
              </h3>
            </div>

            <form action="/buscar" method="GET" className="space-y-6 text-sm">
              {Object.entries(attribution).map(([name, value]) => value ? <input key={name} type="hidden" name={name} value={value} /> : null)}
              {/* FILTRO ISLA */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#6B726E] mb-2">Isla</label>
                <select
                  name="island"
                  defaultValue={selectedIsland}
                  className="w-full p-3 rounded-xl border border-[#E9E1D2] bg-[#F7F6F2] font-medium"
                >
                  <option value="">Todas las Islas</option>
                  {CANARY_ISLANDS.map((is) => (
                    <option key={is.id} value={is.name}>{is.name}</option>
                  ))}
                </select>
              </div>

              {/* FILTRO TIPO VEHÍCULO */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#6B726E] mb-2">Tipo de Vehículo</label>
                <select
                  name="vehicleType"
                  defaultValue={vehicleType}
                  className="w-full p-3 rounded-xl border border-[#E9E1D2] bg-[#F7F6F2] font-medium text-[#13322E]"
                >
                  <option value="">Todos los tipos</option>
                  {VEHICLE_TYPES_CONFIG.map((vt) => (
                    <option key={vt.id} value={vt.id}>{vt.label}</option>
                  ))}
                </select>
              </div>

              {/* FILTRO VIAJEROS */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#6B726E] mb-2">Nº Mínimo de Viajeros</label>
                <select
                  name="passengers"
                  defaultValue={passengers || ''}
                  className="w-full p-3 rounded-xl border border-[#E9E1D2] bg-[#F7F6F2] font-medium"
                >
                  <option value="">Cualquiera</option>
                  <option value="2">2+ personas</option>
                  <option value="4">4+ personas</option>
                  <option value="6">6+ personas</option>
                </select>
              </div>

              {/* FILTRO PRECIO */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#6B726E] mb-2">Precio por Día (€)</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    name="minPrice"
                    placeholder="Mín"
                    defaultValue={minPrice || ''}
                    className="p-2.5 rounded-xl border border-[#E9E1D2] bg-[#F7F6F2]"
                  />
                  <input
                    type="number"
                    name="maxPrice"
                    placeholder="Máx"
                    defaultValue={maxPrice || ''}
                    className="p-2.5 rounded-xl border border-[#E9E1D2] bg-[#F7F6F2]"
                  />
                </div>
              </div>

              {/* BOTÓN APLICAR */}
              <button
                type="submit"
                className="w-full py-3 rounded-full bg-[#1C2826] text-white font-semibold text-xs uppercase tracking-wider hover:bg-[#2C3E3B] transition-colors"
              >
                Aplicar Filtros
              </button>
            </form>
          </aside>

          {/* RESULTADOS CON VISTA CUADRÍCULA Y MAPA INTERACTIVO (IDEALISTA) */}
          <div className="lg:col-span-3 space-y-6">
            {vehicles.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-[#E9E1D2]">
                <h3 className="font-serif text-2xl mb-2">No encontramos campers con esos filtros</h3>
                <p className="text-sm text-[#6B726E]">Prueba a cambiar la isla o reducir las restricciones de precio y viajeros.</p>
              </div>
            ) : (
              <SearchMapExplorer
                vehicles={vehicles}
                selectedIsland={selectedIsland}
                initialViewMode={params.view === 'map' ? 'map' : 'grid'}
              />
            )}
          </div>

        </div>

        {/* SECCIÓN SEO ENRIQUECIDA AL PIE DEL BUSCADOR */}
        <section className="mt-20 border-t border-[#E9E1D2] pt-12 space-y-8 text-[#13322E]">
          <div className="max-w-4xl mx-auto text-center space-y-3">
            <span className="text-[11px] font-black uppercase tracking-[0.25em] text-[#16B8AA] bg-[#16B8AA]/10 px-4 py-1.5 rounded-full inline-block">
              Vehículos publicados en Canarias
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold">
              Alquiler de Campers en Gran Canaria, Tenerife y las 8 Islas
            </h2>
            <p className="text-sm text-[#6B726E] font-medium leading-relaxed">
              Vaneando es el marketplace nativo de las Islas Canarias que conecta a viajeros con propietarios particulares verificados para vivir aventuras inolvidables sobre ruedas.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto pt-4 text-xs font-medium text-[#6B726E]">
            <div className="bg-white p-6 rounded-3xl border border-[#E9E1D2] shadow-sm">
              <h3 className="font-serif text-lg font-bold text-[#13322E] mb-2">Compara antes de reservar</h3>
              <p className="leading-relaxed">Al combinar transporte y alojamiento en un solo vehículo y cocinar a bordo, ahorras más de 1.000€ a la semana frente al coste habitual de hotel + coche de alquiler en Canarias.</p>
            </div>
            <div className="bg-white p-6 rounded-3xl border border-[#E9E1D2] shadow-sm">
              <h3 className="font-serif text-lg font-bold text-[#13322E] mb-2">Vehículos Locales Verificados</h3>
              <p className="leading-relaxed">Todas las furgonetas camperizadas, autocaravanas, caravanas y 4x4 cuentan con la póliza del propietario particular, fianza acordada directamente entre las partes y revisión de identidad DNI/NIE de propietarios e inquilinos.</p>
            </div>
            <div className="bg-white p-6 rounded-3xl border border-[#E9E1D2] shadow-sm">
              <h3 className="font-serif text-lg font-bold text-[#13322E] mb-2">Entrega en Aeropuerto LPA y TFN/TFS</h3>
              <p className="leading-relaxed">Recoge tu vehículo directamente al aterrizar en el Aeropuerto de Gran Canaria (LPA), Tenerife Norte (TFN), Tenerife Sur (TFS), Lanzarote (ACE) o Fuerteventura (FUE).</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
