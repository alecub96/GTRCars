import Navbar from '@/components/Navbar';
import TravelerBookingCard from '@/components/TravelerBookingCard';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Heart, Search, UserCircle, ShieldCheck, Gauge, KeyRound, Sparkles } from 'lucide-react';
import UserContractsPanel from '@/components/UserContractsPanel';

const DEMO_CLIENT_BOOKINGS = [
  {
    id: 'demo-booking-001',
    code: 'GT-296-7890',
    status: 'CONFIRMED',
    pickupDate: new Date(Date.now() + 86400000 * 2).toISOString(),
    returnDate: new Date(Date.now() + 86400000 * 5).toISOString(),
    totalAmount: 4350,
    vehicle: {
      title: 'Ferrari 296 GTB Assetto Fiorano',
      island: 'Tenerife / Las Palmas',
      photos: [{ url: '/supercars/ferrari_296.jpg' }],
    },
    owner: { firstName: 'Carlos M.' },
    conversations: [{ id: 'demo-conv-001' }],
  },
  {
    id: 'demo-booking-002',
    code: 'GT-765-1102',
    status: 'REQUESTED',
    pickupDate: new Date(Date.now() + 86400000 * 10).toISOString(),
    returnDate: new Date(Date.now() + 86400000 * 12).toISOString(),
    totalAmount: 3800,
    vehicle: {
      title: 'McLaren 765LT Spider',
      island: 'Gran Canaria',
      photos: [{ url: '/supercars/mclaren_765lt.jpg' }],
    },
    owner: { firstName: 'Enrique S.' },
    conversations: [{ id: 'demo-conv-002' }],
  },
];

const DEMO_CLIENT_FAVORITES = [
  {
    id: 'fav-1',
    vehicle: {
      slug: 'lamborghini-revuelto-2024',
      title: 'Lamborghini Revuelto V12 Híbrido',
      island: 'Tenerife',
      photos: [{ url: '/supercars/lambo_revuelto.jpg' }],
    },
  },
  {
    id: 'fav-2',
    vehicle: {
      slug: 'porsche-911-gt3-rs-weissach',
      title: 'Porsche 911 GT3 RS Weissach',
      island: 'Gran Canaria',
      photos: [{ url: '/supercars/porsche_gt3rs.jpg' }],
    },
  },
  {
    id: 'fav-3',
    vehicle: {
      slug: 'aston-martin-dbs-superleggera',
      title: 'Aston Martin DBS Superleggera V12',
      island: 'Lanzarote',
      photos: [{ url: '/supercars/aston_dbs.jpg' }],
    },
  },
];

export default async function TravelerAccountPage() {
  const user = await getCurrentUser().catch(() => null);
  if (!user) redirect('/');
  if (user.role === 'OWNER') redirect('/propietario');
  if (user.role === 'ADMIN') redirect('/admin');

  let bookings: any[] = [];
  try {
    bookings = await prisma.booking.findMany({
      where: { travelerId: user.id },
      include: {
        vehicle: { select: { title: true, island: true, photos: { take: 1 } } },
        owner: { select: { firstName: true } },
        conversations: { select: { id: true }, take: 1 },
      },
      orderBy: { createdAt: 'desc' },
    });
  } catch (error) {
    console.error('Cuenta page bookings query error:', error);
  }

  // Fallback para usuario demo o BD vacía
  if (bookings.length === 0 && (user.id.includes('demo') || user.email.includes('cliente'))) {
    bookings = DEMO_CLIENT_BOOKINGS;
  }

  let favorites: any[] = [];
  try {
    favorites = await prisma.favorite.findMany({
      where: { userId: user.id },
      include: { vehicle: { include: { photos: { take: 1 } } } },
      orderBy: { createdAt: 'desc' },
    });
  } catch (error) {
    console.error('Cuenta page favorites query error:', error);
  }

  let validFavorites = favorites.filter((f) => Boolean(f && f.vehicle));
  if (validFavorites.length === 0 && (user.id.includes('demo') || user.email.includes('cliente'))) {
    validFavorites = DEMO_CLIENT_FAVORITES;
  }

  return (
    <div className="min-h-screen bg-white text-black selection:bg-black selection:text-white font-sans">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        {/* CABECERA PANEL CLIENTE / PILOTO VIP */}
        <header className="mb-10 flex flex-wrap items-end justify-between gap-6 border-b border-gray-100 pb-8 font-mono">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-gray-500">
                CUENTA PILOTO VIP // TELEMETRÍA DE ALQUILER
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-black font-sans">
              Mis Jornadas & Supercars
            </h1>
            <p className="mt-2 text-sm text-gray-600 font-sans max-w-2xl">
              Control de solicitudes, actas de entrega digitales y contratos de pilotaje.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/perfil"
              className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-5 py-3 text-xs font-bold uppercase tracking-wider text-black hover:bg-gray-100 transition-all shadow-xs"
            >
              <UserCircle className="h-4 w-4 text-black" />
              Mi Perfil
            </Link>
            <Link
              href="/buscar"
              className="flex items-center gap-2 rounded-full bg-black px-6 py-3 text-xs font-black uppercase tracking-wider text-white hover:bg-gray-800 transition-all shadow-md"
            >
              <Search className="h-4 w-4" />
              Explorar Supercars
            </Link>
          </div>
        </header>

        {/* MÉTRICAS RÁPIDAS PILOTO VIP */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 font-mono">
          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5 shadow-xs">
            <span className="text-[10px] text-gray-500 uppercase tracking-widest block mb-1">Estado de Licencia</span>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <strong className="text-lg text-black font-bold font-sans">Piloto Verificado VIP</strong>
            </div>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5 shadow-xs">
            <span className="text-[10px] text-gray-500 uppercase tracking-widest block mb-1">Reservas Gestionadas</span>
            <div className="flex items-center gap-2">
              <Gauge className="w-5 h-5 text-black" />
              <strong className="text-xl text-black font-black">{bookings.length}</strong>
              <span className="text-xs text-gray-500">jornadas</span>
            </div>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5 shadow-xs">
            <span className="text-[10px] text-gray-500 uppercase tracking-widest block mb-1">Favoritos Guardados</span>
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-black" />
              <strong className="text-xl text-black font-black">{validFavorites.length}</strong>
              <span className="text-xs text-gray-500">guardados</span>
            </div>
          </div>
        </div>

        {/* CONTENIDO PRINCIPAL */}
        <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
          <section className="space-y-6">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3 font-mono">
              <h2 className="text-sm font-bold uppercase tracking-widest text-black">
                Historial de Pilotaje & Solicitudes
              </h2>
              <span className="text-xs text-gray-500">{bookings.length} registradas</span>
            </div>

            {bookings.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-gray-200 bg-gray-50 p-12 text-center">
                <Search className="mx-auto mb-4 h-10 w-10 text-gray-400" />
                <h2 className="text-2xl font-bold text-black uppercase tracking-tight font-sans">Tu Garaje de Conducción Está Vacío</h2>
                <p className="mt-2 text-sm text-gray-600 max-w-md mx-auto">
                  Explora nuestra selección de hypercars, superdeportivos V10/V12 y reserva tu próxima jornada en circuito o carretera.
                </p>
                <Link
                  href="/buscar"
                  className="mt-6 inline-flex rounded-full bg-black px-6 py-3.5 text-xs font-mono font-black uppercase tracking-wider text-white hover:bg-gray-800 transition-all shadow-md"
                >
                  Explorar Superdeportivos
                </Link>
              </div>
            ) : (
              bookings.map((booking) => <TravelerBookingCard key={booking.id} booking={booking} />)
            )}

            {/* SECCIÓN MIS CONTRATOS */}
            <div className="pt-6">
              <UserContractsPanel bookings={bookings} viewerRole="TRAVELER" />
            </div>
          </section>

          {/* ASIDE FAVORITOS */}
          <aside className="h-fit rounded-3xl border border-gray-200 bg-gray-50 p-6 shadow-md">
            <div className="flex items-center justify-between border-b border-gray-200 pb-4 mb-4">
              <div className="flex items-center gap-2">
                <Heart className="h-4 w-4 text-black" />
                <h2 className="font-mono text-sm font-bold uppercase tracking-wider text-black">Favoritos</h2>
              </div>
              <span className="text-[10px] font-mono font-bold text-black px-2 py-0.5 rounded-full bg-gray-200">
                {validFavorites.length}
              </span>
            </div>

            {validFavorites.length === 0 ? (
              <p className="text-xs font-mono text-gray-500">
                Guarda los superdeportivos que más te gusten para consultar su disponibilidad rápida.
              </p>
            ) : (
              <div className="space-y-3">
                {validFavorites.map((favorite) => (
                  <Link
                    key={favorite.id}
                    href={`/coche/${favorite.vehicle?.slug || ''}`}
                    className="group flex items-center gap-3 rounded-2xl border border-gray-200 bg-white p-2.5 hover:border-black transition-all shadow-xs"
                  >
                    <img
                      src={favorite.vehicle?.photos?.[0]?.url || '/supercars/lambo-revuelto.jpg'}
                      alt={favorite.vehicle?.title || 'Superdeportivo'}
                      className="h-14 w-20 rounded-xl object-cover border border-gray-100 group-hover:scale-105 transition-transform"
                    />
                    <div className="min-w-0 flex-1">
                      <span className="text-[9px] font-mono uppercase text-gray-500 block truncate">
                        {favorite.vehicle?.island || 'Canarias'}
                      </span>
                      <strong className="text-xs font-bold text-black group-hover:underline truncate block">
                        {favorite.vehicle?.title || 'Superdeportivo'}
                      </strong>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </aside>
        </div>
      </main>
    </div>
  );
}
