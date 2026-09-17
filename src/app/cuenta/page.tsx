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
    <div className="min-h-screen bg-[#070707] text-white selection:bg-[#D4AF37] selection:text-black font-sans">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        {/* CABECERA PANEL CLIENTE / PILOTO VIP */}
        <header className="mb-10 flex flex-wrap items-end justify-between gap-6 border-b border-white/10 pb-8 font-mono">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#D4AF37]">
                CUENTA PILOTO VIP // TELEMETRÍA DE ALQUILER
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-white font-sans">
              Mis Jornadas & Supercars
            </h1>
            <p className="mt-2 text-sm text-white/60 font-sans max-w-2xl">
              Control de solicitudes, fianzas en custodia, actas de entrega digitales y contratos de pilotaje.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/perfil"
              className="flex items-center gap-2 rounded-xl border border-white/15 bg-white/[0.04] px-4 py-3 text-xs font-bold uppercase tracking-wider text-white hover:border-[#D4AF37]/50 hover:bg-white/[0.08] transition-all"
            >
              <UserCircle className="h-4 w-4 text-[#D4AF37]" />
              Mi Perfil
            </Link>
            <Link
              href="/buscar"
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B38B21] px-5 py-3 text-xs font-black uppercase tracking-wider text-black hover:brightness-110 transition-all shadow-[0_0_20px_rgba(212,175,55,0.25)]"
            >
              <Search className="h-4 w-4" />
              Explorar Supercars
            </Link>
          </div>
        </header>

        {/* MÉTRICAS RÁPIDAS PILOTO VIP */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 font-mono">
          <div className="rounded-2xl border border-white/10 bg-[#0f0f12] p-5">
            <span className="text-[10px] text-white/40 uppercase tracking-widest block mb-1">Estado de Licencia</span>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <strong className="text-lg text-white font-bold font-sans">Piloto Verificado VIP</strong>
            </div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-[#0f0f12] p-5">
            <span className="text-[10px] text-white/40 uppercase tracking-widest block mb-1">Reservas Gestionadas</span>
            <div className="flex items-center gap-2">
              <Gauge className="w-5 h-5 text-[#D4AF37]" />
              <strong className="text-xl text-[#D4AF37] font-black">{bookings.length}</strong>
              <span className="text-xs text-white/50">jornadas</span>
            </div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-[#0f0f12] p-5">
            <span className="text-[10px] text-white/40 uppercase tracking-widest block mb-1">Bóveda Favoritos</span>
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-[#D4AF37]" />
              <strong className="text-xl text-[#D4AF37] font-black">{validFavorites.length}</strong>
              <span className="text-xs text-white/50">guardados</span>
            </div>
          </div>
        </div>

        {/* CONTENIDO PRINCIPAL */}
        <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
          <section className="space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-3 font-mono">
              <h2 className="text-sm font-bold uppercase tracking-widest text-[#D4AF37]">
                Historial de Pilotaje & Solicitudes
              </h2>
              <span className="text-xs text-white/40">{bookings.length} registradas</span>
            </div>

            {bookings.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-white/15 bg-[#0f0f12] p-12 text-center">
                <Search className="mx-auto mb-4 h-10 w-10 text-[#D4AF37]/60" />
                <h2 className="text-2xl font-bold text-white uppercase tracking-tight">Tu Bóveda de Conducción Está Vacía</h2>
                <p className="mt-2 text-sm text-white/60 max-w-md mx-auto">
                  Explora nuestra selección de hypercars, superdeportivos V10/V12 y reserva tu próxima jornada en circuito o carretera.
                </p>
                <Link
                  href="/buscar"
                  className="mt-6 inline-flex rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B38B21] px-6 py-3.5 text-xs font-mono font-black uppercase tracking-wider text-black hover:brightness-110 transition-all shadow-[0_0_20px_rgba(212,175,55,0.25)]"
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
          <aside className="h-fit rounded-3xl border border-white/10 bg-[#0f0f12] p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
              <div className="flex items-center gap-2">
                <Heart className="h-4 w-4 text-[#D4AF37]" />
                <h2 className="font-mono text-sm font-bold uppercase tracking-wider text-white">Bóveda Favoritos</h2>
              </div>
              <span className="text-[10px] font-mono font-bold text-[#D4AF37] px-2 py-0.5 rounded bg-[#D4AF37]/10">
                {validFavorites.length}
              </span>
            </div>

            {validFavorites.length === 0 ? (
              <p className="text-xs font-mono text-white/50">
                Guarda los superdeportivos que más te gusten para consultar su disponibilidad rápida.
              </p>
            ) : (
              <div className="space-y-3">
                {validFavorites.map((favorite) => (
                  <Link
                    key={favorite.id}
                    href={`/camper/${favorite.vehicle?.slug || ''}`}
                    className="group flex items-center gap-3 rounded-2xl border border-white/5 bg-black/40 p-2.5 hover:border-[#D4AF37]/40 hover:bg-white/[0.04] transition-all"
                  >
                    <img
                      src={favorite.vehicle?.photos?.[0]?.url || '/supercars/lambo_revuelto.jpg'}
                      alt={favorite.vehicle?.title || 'Superdeportivo'}
                      className="h-14 w-20 rounded-xl object-cover border border-white/10 group-hover:scale-105 transition-transform"
                    />
                    <div className="min-w-0 flex-1">
                      <span className="text-[9px] font-mono uppercase text-[#D4AF37] block truncate">
                        {favorite.vehicle?.island || 'Canarias'}
                      </span>
                      <strong className="text-xs font-bold text-white group-hover:text-[#D4AF37] transition-colors truncate block">
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
