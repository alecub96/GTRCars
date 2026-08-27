import React from 'react';
import Navbar from '@/components/Navbar';
import RealCanaryMapExplorer from '@/components/RealCanaryMapExplorer';
import { prisma } from '@/lib/prisma';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Filter } from 'lucide-react';
import { ensureDbSchema } from '@/lib/prisma-ensure-schema';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Buscador de Campers en el Mapa de Canarias | vaneando.',
  description: 'Explora campers y autocaravanas directamente sobre el mapa de las Islas Canarias con ubicaciones aproximadas y precios por día.',
};

interface MapPageProps {
  searchParams: Promise<{
    island?: string;
  }>;
}

export default async function MapaPage({ searchParams }: MapPageProps) {
  const params = await searchParams;
  const selectedIsland = params.island || '';

  let dbVehicles: any[] = [];
  try {
    await ensureDbSchema();
    const query: any = { status: 'ACTIVE' };
    if (selectedIsland) query.island = selectedIsland;

    dbVehicles = await prisma.vehicle.findMany({
      where: query,
      select: {
        id: true,
        slug: true,
        title: true,
        island: true,
        municipality: true,
        basePricePerDay: true,
        passengers: true,
        beds: true,
        latitude: true,
        longitude: true,
        addressApprox: true,
        photos: { orderBy: { orderIndex: 'asc' }, take: 1 },
        reviews: { select: { rating: true } },
      },
    });
  } catch (err) {
    console.error('Map vehicle query failed:', err);
    try {
      const islandFilter = selectedIsland && selectedIsland !== 'Canarias' ? ' AND island LIKE ?' : '';
      const params = selectedIsland && selectedIsland !== 'Canarias' ? [`%${selectedIsland.replace(/-/g, ' ')}%`] : [];
      const rows = await prisma.$queryRawUnsafe(
        `SELECT id, slug, title, island, municipality, basePricePerDay, passengers, beds, latitude, longitude, addressApprox FROM Vehicle WHERE status = 'ACTIVE'${islandFilter} ORDER BY createdAt DESC`,
        ...params,
      ) as any[];
      dbVehicles = await Promise.all(rows.map(async (row) => ({
        ...row,
        photos: await prisma.$queryRawUnsafe('SELECT url FROM VehiclePhoto WHERE vehicleId = ? ORDER BY orderIndex ASC LIMIT 1', row.id).catch(() => []),
        reviews: [],
      })));
    } catch (fallbackError) {
      console.error('Map vehicle fallback failed:', fallbackError);
    }
  }

  const vehicles = dbVehicles;

  return (
    <div className="min-h-screen bg-[#F7F6F2] text-[#13322E] flex flex-col">
      <Navbar />

      <main className="flex-1 flex flex-col max-w-7xl w-full mx-auto px-3 sm:px-6 py-4 sm:py-6 space-y-4">
        {/* BARRA SUPERIOR DE NAVEGACIÓN Y CONTROL */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-[#E9E1D2] shadow-sm">
          <div className="flex items-center space-x-3">
            <Link
              href="/buscar"
              className="p-2 rounded-xl border border-[#E9E1D2] text-[#13322E] hover:bg-[#FAF7F0] transition-colors"
              title="Volver al buscador en lista"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <h1 className="font-serif text-xl sm:text-2xl font-bold text-[#13322E] flex items-center gap-2">
                <span>Mapa de Campers en Canarias</span>
                <span className="text-xs font-bold text-[#16B8AA] bg-[#16B8AA]/10 px-2.5 py-0.5 rounded-full">
                  {vehicles.length} disponibles
                </span>
              </h1>
              <p className="text-xs text-[#6B726E] font-medium">
                Haz zoom o desplázate por las islas para ver las furgonetas geolocalizadas.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Link
              href={selectedIsland ? `/buscar?island=${encodeURIComponent(selectedIsland)}` : '/buscar'}
              className="px-4 py-2 rounded-xl bg-[#FAF7F0] border border-[#E9E1D2] text-xs font-bold text-[#13322E] hover:bg-white transition-all flex items-center gap-1.5"
            >
              <Filter className="w-3.5 h-3.5" />
              <span>Ver en Lista con Filtros</span>
            </Link>
          </div>
        </div>

        {/* CONTENEDOR DEL MAPA REAL INTERACTIVO */}
        <div className="flex-1 w-full">
          <RealCanaryMapExplorer
            vehicles={vehicles}
            selectedIsland={selectedIsland}
            heightClass="h-[75vh] min-h-[500px]"
          />
        </div>
      </main>
    </div>
  );
}
