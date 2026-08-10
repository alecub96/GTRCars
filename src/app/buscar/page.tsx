import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { prisma } from '@/lib/prisma';
import { CANARY_ISLANDS } from '@/lib/pricing';
import { Star, MapPin, Filter, SlidersHorizontal, ShieldCheck, ChevronRight } from 'lucide-react';

interface SearchPageProps {
  searchParams: Promise<{
    island?: string;
    minPrice?: string;
    maxPrice?: string;
    passengers?: string;
    sort?: string;
  }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const selectedIsland = params.island || '';
  const passengers = params.passengers ? parseInt(params.passengers) : undefined;
  const minPrice = params.minPrice ? parseFloat(params.minPrice) : undefined;
  const maxPrice = params.maxPrice ? parseFloat(params.maxPrice) : undefined;
  const sort = params.sort || 'recommended';

  const whereClause: any = { status: 'ACTIVE' };
  if (selectedIsland) whereClause.island = { equals: selectedIsland, mode: 'insensitive' };
  if (passengers) whereClause.passengers = { gte: passengers };
  if (minPrice || maxPrice) {
    whereClause.basePricePerDay = {};
    if (minPrice) whereClause.basePricePerDay.gte = minPrice;
    if (maxPrice) whereClause.basePricePerDay.lte = maxPrice;
  }

  let orderBy: any = { createdAt: 'desc' };
  if (sort === 'price_asc') orderBy = { basePricePerDay: 'asc' };
  if (sort === 'price_desc') orderBy = { basePricePerDay: 'desc' };

  const vehicles = await prisma.vehicle.findMany({
    where: whereClause,
    include: {
      photos: { orderBy: { orderIndex: 'asc' } },
      features: true,
      owner: { select: { firstName: true, avatarUrl: true, verification: true } },
      reviews: { select: { rating: true } },
    },
    orderBy,
  });

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1C2826]">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* CABECERA BUSCADOR */}
        <div className="mb-8 border-b border-[#E6E1DA] pb-6 flex flex-col md:flex-row md:items-end justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#E07A5F]">
              {selectedIsland ? selectedIsland : 'Todas las Islas Canarias'}
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-normal mt-1">
              Alquiler de Campers y Autocaravanas ({vehicles.length})
            </h1>
          </div>
        </div>

        {/* CONTENIDOR FILTROS + RESULTADOS */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* PANEL DE FILTROS LATERAL */}
          <aside className="bg-white rounded-3xl p-6 border border-[#E6E1DA] shadow-sm h-fit space-y-6">
            <div className="flex items-center justify-between border-b border-[#E6E1DA] pb-4">
              <h3 className="font-serif text-lg font-semibold flex items-center space-x-2">
                <SlidersHorizontal className="w-4 h-4 text-[#E07A5F]" />
                <span>Filtros de Búsqueda</span>
              </h3>
            </div>

            <form action="/buscar" method="GET" className="space-y-6 text-sm">
              {/* FILTRO ISLA */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#7A7571] mb-2">Isla</label>
                <select
                  name="island"
                  defaultValue={selectedIsland}
                  className="w-full p-3 rounded-xl border border-[#E6E1DA] bg-[#FAF8F5] font-medium"
                >
                  <option value="">Todas las Islas</option>
                  {CANARY_ISLANDS.map((is) => (
                    <option key={is.id} value={is.name}>{is.name}</option>
                  ))}
                </select>
              </div>

              {/* FILTRO VIAJEROS */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#7A7571] mb-2">Nº Mínimo de Viajeros</label>
                <select
                  name="passengers"
                  defaultValue={passengers || ''}
                  className="w-full p-3 rounded-xl border border-[#E6E1DA] bg-[#FAF8F5] font-medium"
                >
                  <option value="">Cualquiera</option>
                  <option value="2">2+ personas</option>
                  <option value="4">4+ personas</option>
                  <option value="6">6+ personas</option>
                </select>
              </div>

              {/* FILTRO PRECIO */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#7A7571] mb-2">Precio por Día (€)</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    name="minPrice"
                    placeholder="Mín"
                    defaultValue={minPrice || ''}
                    className="p-2.5 rounded-xl border border-[#E6E1DA] bg-[#FAF8F5]"
                  />
                  <input
                    type="number"
                    name="maxPrice"
                    placeholder="Máx"
                    defaultValue={maxPrice || ''}
                    className="p-2.5 rounded-xl border border-[#E6E1DA] bg-[#FAF8F5]"
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

          {/* LISTA DE RESULTADOS */}
          <div className="lg:col-span-3 space-y-6">
            {vehicles.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-[#E6E1DA]">
                <h3 className="font-serif text-2xl mb-2">No encontramos campers con esos filtros</h3>
                <p className="text-sm text-[#7A7571]">Prueba a cambiar la isla o reducir las restricciones de precio y viajeros.</p>
              </div>
            ) : (
              vehicles.map((v: any) => {
                const avgRating =
                  v.reviews.length > 0
                    ? v.reviews.reduce((acc: number, r: any) => acc + r.rating, 0) / v.reviews.length
                    : 5.0;

                return (
                  <div
                    key={v.id}
                    className="bg-white rounded-3xl overflow-hidden border border-[#E6E1DA] shadow-sm hover:shadow-xl transition-all duration-300 grid grid-cols-1 md:grid-cols-3"
                  >
                    <div className="relative h-64 md:h-full">
                      <img
                        src={v.photos[0]?.url || 'https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?w=800'}
                        alt={v.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold">
                        {v.island}
                      </div>
                    </div>

                    <div className="md:col-span-2 p-6 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between text-xs text-[#7A7571] mb-2">
                          <span className="flex items-center space-x-1">
                            <MapPin className="w-3.5 h-3.5 text-[#E07A5F]" />
                            <span>{v.municipality}, {v.island}</span>
                          </span>
                          <div className="flex items-center space-x-1 font-semibold text-[#1C2826]">
                            <Star className="w-3.5 h-3.5 fill-[#E07A5F] text-[#E07A5F]" />
                            <span>{avgRating.toFixed(1)} ({v.reviews.length})</span>
                          </div>
                        </div>

                        <h3 className="font-serif text-2xl font-medium text-[#1C2826] mb-2">
                          {v.title}
                        </h3>

                        <p className="text-xs text-[#7A7571] line-clamp-2 mb-4 font-light leading-relaxed">
                          {v.description}
                        </p>

                        <div className="flex flex-wrap gap-2 mb-4">
                          <span className="px-2.5 py-1 rounded-md bg-[#FAF8F5] border border-[#E6E1DA] text-[11px] font-medium text-[#4A4643]">
                            {v.passengers} Viajeros
                          </span>
                          <span className="px-2.5 py-1 rounded-md bg-[#FAF8F5] border border-[#E6E1DA] text-[11px] font-medium text-[#4A4643]">
                            {v.beds} Camas
                          </span>
                          <span className="px-2.5 py-1 rounded-md bg-[#FAF8F5] border border-[#E6E1DA] text-[11px] font-medium text-[#4A4643]">
                            {v.transmission}
                          </span>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-[#E6E1DA] flex items-center justify-between">
                        <div>
                          <span className="text-xs text-[#7A7571]">Desde </span>
                          <span className="font-serif text-2xl font-semibold text-[#1C2826]">{v.basePricePerDay}€</span>
                          <span className="text-xs text-[#7A7571]"> /día</span>
                        </div>

                        <Link
                          href={`/camper/${v.slug}`}
                          className="px-6 py-2.5 rounded-full bg-[#1C2826] text-white text-xs font-semibold hover:bg-[#2C3E3B] transition-colors inline-flex items-center space-x-1"
                        >
                          <span>VER FICHA</span>
                          <ChevronRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

        </div>
      </main>
    </div>
  );
}
