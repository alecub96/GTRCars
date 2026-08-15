import Navbar from '@/components/Navbar';
import TravelerBookingCard from '@/components/TravelerBookingCard';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Heart, Search, UserCircle, FileCheck2 } from 'lucide-react';
import UserContractsPanel from '@/components/UserContractsPanel';

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
        owner: { select: { firstName: true, phone: true } },
        conversations: { select: { id: true }, take: 1 },
      },
      orderBy: { createdAt: 'desc' },
    });
  } catch (error) {
    console.error('Cuenta page bookings query error:', error);
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

  const validFavorites = favorites.filter((f) => Boolean(f && f.vehicle));

  return (
    <div className="min-h-screen bg-[#F7F6F2] text-[#13322E]">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-10">
        <header className="mb-8 flex flex-wrap items-end justify-between gap-4 border-b border-[#E9E1D2] pb-6">
          <div>
            <span className="text-[11px] font-black uppercase tracking-[.25em] text-[#16B8AA]">Modo viajero</span>
            <h1 className="font-serif text-4xl font-bold">Mis reservas y viajes</h1>
            <p className="mt-2 text-sm text-[#6B726E]">Solicitudes, pagos, viajes activos y experiencias anteriores.</p>
          </div>
          <div className="flex gap-2">
            <Link href="/perfil" className="flex items-center gap-2 rounded-full border border-[#E9E1D2] bg-white px-4 py-3 text-xs font-bold">
              <UserCircle className="h-4 w-4" />Mi perfil
            </Link>
            <Link href="/buscar" className="flex items-center gap-2 rounded-full bg-[#16B8AA] px-4 py-3 text-xs font-bold text-white">
              <Search className="h-4 w-4" />Buscar camper
            </Link>
          </div>
        </header>
        <div className="grid gap-8 lg:grid-cols-[1fr_300px]">
          <section className="space-y-5">
            {bookings.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-[#E9E1D2] bg-white p-10 text-center">
                <Search className="mx-auto mb-3 h-8 w-8 text-[#16B8AA]" />
                <h2 className="font-serif text-2xl font-bold">Tu próxima aventura empieza aquí</h2>
                <p className="mt-2 text-sm text-[#6B726E]">Todavía no tienes solicitudes ni reservas.</p>
                <Link href="/buscar" className="mt-5 inline-flex rounded-full bg-[#13322E] px-5 py-3 text-xs font-bold text-white">
                  Explorar campers
                </Link>
              </div>
            ) : (
              bookings.map((booking) => <TravelerBookingCard key={booking.id} booking={booking} />)
            )}

            {/* SECCIÓN MIS CONTRATOS */}
            <UserContractsPanel bookings={bookings} viewerRole="TRAVELER" />
          </section>
          <aside className="h-fit rounded-3xl border border-[#E9E1D2] bg-white p-5">
            <div className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-[#16B8AA]" />
              <h2 className="font-serif text-xl font-bold">Favoritos</h2>
            </div>
            {validFavorites.length === 0 ? (
              <p className="mt-4 text-sm text-[#6B726E]">Guarda campers para compararlas después.</p>
            ) : (
              <div className="mt-4 space-y-3">
                {validFavorites.map((favorite) => (
                  <Link
                    key={favorite.id}
                    href={`/camper/${favorite.vehicle?.slug || ''}`}
                    className="flex items-center gap-3 rounded-2xl p-2 hover:bg-[#F7F6F2]"
                  >
                    <img
                      src={favorite.vehicle?.photos?.[0]?.url || 'https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?w=300'}
                      alt={favorite.vehicle?.title || 'Camper'}
                      className="h-14 w-16 rounded-xl object-cover"
                    />
                    <span className="text-sm font-bold">{favorite.vehicle?.title || 'Camper'}</span>
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
