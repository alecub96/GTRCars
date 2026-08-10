import React from 'react';
import Navbar from '@/components/Navbar';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Calendar, MessageSquare, Compass, User, CheckCircle } from 'lucide-react';

export default async function TravelerAccountPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/');
  if (user.role === 'OWNER') redirect('/propietario');
  if (user.role === 'ADMIN') redirect('/admin');

  const bookings = await prisma.booking.findMany({
    where: { travelerId: user.id },
    include: {
      vehicle: { select: { title: true, island: true, photos: { take: 1 } } },
      owner: { select: { firstName: true, phone: true } },
    },
    orderBy: { createdAt: 'desc' },
  });
  const favorites = await prisma.favorite.findMany({ where: { userId: user.id }, include: { vehicle: { include: { photos: { take: 1 } } } }, orderBy: { createdAt: 'desc' } });

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1C2826]">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8 border-b border-[#E6E1DA] pb-6 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#E07A5F]">Panel de Viajero</span>
            <h1 className="font-serif text-3xl sm:text-4xl font-normal mt-1">Hola, {user.firstName}</h1>
          </div>
          <span className="px-4 py-1.5 rounded-full bg-green-100 text-green-800 text-xs font-semibold uppercase tracking-wider">
            Usuario Verificado
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* MIS VIAJES */}
          <div className="lg:col-span-2 space-y-6">
            <h3 className="font-serif text-2xl font-normal border-b border-[#E6E1DA] pb-3">Mis Reservas y Viajes</h3>

            {bookings.length === 0 ? (
              <div className="bg-white rounded-3xl p-8 text-center border border-[#E6E1DA]">
                <p className="text-sm text-[#7A7571] mb-4">Aún no has realizado ninguna reserva de camper.</p>
                <Link
                  href="/buscar"
                  className="px-6 py-2.5 bg-[#1C2826] text-white rounded-full text-xs font-semibold hover:bg-[#2C3E3B]"
                >
                  Explorar Campers en Canarias
                </Link>
              </div>
            ) : (
              bookings.map((b: any) => (
                <div key={b.id} className="bg-white rounded-3xl p-6 border border-[#E6E1DA] shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="flex items-center space-x-4">
                    <img
                      src={b.vehicle.photos[0]?.url || 'https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?w=400'}
                      alt={b.vehicle.title}
                      className="w-24 h-20 rounded-2xl object-cover"
                    />
                    <div>
                      <span className="text-xs font-semibold uppercase text-[#E07A5F]">{b.vehicle.island}</span>
                      <h4 className="font-serif text-lg font-semibold">{b.vehicle.title}</h4>
                      <p className="text-xs text-[#7A7571]">
                        {new Date(b.pickupDate).toLocaleDateString()} - {new Date(b.returnDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800 mb-2">
                      {b.status}
                    </span>
                    <p className="font-serif text-xl font-semibold">{b.totalAmount}€</p>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="lg:col-span-2 space-y-4">
            <h3 className="font-serif text-2xl font-normal border-b border-[#E6E1DA] pb-3">Mis favoritos</h3>
            {favorites.length === 0 ? <p className="text-sm text-[#7A7571]">Aún no has guardado ninguna camper.</p> : <div className="grid sm:grid-cols-2 gap-4">{favorites.map((favorite: any) => <Link key={favorite.id} href={`/camper/${favorite.vehicle.slug}`} className="bg-white rounded-2xl p-3 border border-[#E6E1DA] flex gap-3"><img src={favorite.vehicle.photos[0]?.url} alt={favorite.vehicle.title} className="w-20 h-16 rounded-xl object-cover" /><span className="text-sm font-semibold">{favorite.vehicle.title}</span></Link>)}</div>}
          </div>

          {/* PERFIL Y OPCIONES */}
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-[#E6E1DA]">
              <h3 className="font-serif text-xl font-semibold mb-4">Mi Perfil</h3>
              <div className="space-y-3 text-xs text-[#4A4643]">
                <p><strong className="text-[#1C2826]">Email:</strong> {user.email}</p>
                <p><strong className="text-[#1C2826]">Teléfono:</strong> {user.phone || 'No configurado'}</p>
                <p><strong className="text-[#1C2826]">Rol:</strong> {user.role}</p>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
