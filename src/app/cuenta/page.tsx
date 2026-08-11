import React from 'react';
import Navbar from '@/components/Navbar';
import TravelerBookingCard from '@/components/TravelerBookingCard';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function TravelerAccountPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/');
  if (user.role === 'OWNER') redirect('/propietario');
  if (user.role === 'ADMIN') redirect('/admin');
  const bookings = await prisma.booking.findMany({ where: { travelerId: user.id }, include: { vehicle: { select: { title: true, island: true, photos: { take: 1 } } }, owner: { select: { firstName: true, phone: true } } }, orderBy: { createdAt: 'desc' } });
  const favorites = await prisma.favorite.findMany({ where: { userId: user.id }, include: { vehicle: { include: { photos: { take: 1 } } } }, orderBy: { createdAt: 'desc' } });
  return <div className="min-h-screen bg-[#F7F6F2] text-[#1C2826]"><Navbar /><main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10"><div className="mb-8 border-b border-[#E9E1D2] pb-6"><span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#E07A5F]">Panel de Viajero</span><h1 className="font-serif text-3xl sm:text-4xl font-normal mt-1">Hola, {user.firstName}</h1></div><div className="grid grid-cols-1 lg:grid-cols-3 gap-8"><section className="lg:col-span-2 space-y-6"><h2 className="font-serif text-2xl border-b border-[#E9E1D2] pb-3">Mis Reservas y Viajes</h2>{bookings.length === 0 ? <div className="bg-white rounded-3xl p-8 text-center border border-[#E9E1D2]"><p className="text-sm text-[#6B726E] mb-4">Aún no has realizado ninguna reserva.</p><Link href="/buscar" className="px-6 py-2.5 bg-[#1C2826] text-white rounded-full text-xs font-semibold">Explorar Campers</Link></div> : bookings.map((booking: any) => <TravelerBookingCard key={booking.id} booking={booking} />)}</section><aside className="space-y-6"><div className="bg-white rounded-3xl p-6 border border-[#E9E1D2]"><h2 className="font-serif text-xl font-semibold mb-4">Mis favoritos</h2>{favorites.length === 0 ? <p className="text-sm text-[#6B726E]">Aún no has guardado campers.</p> : <div className="space-y-3">{favorites.map((favorite: any) => <Link key={favorite.id} href={`/camper/${favorite.vehicle.slug}`} className="flex gap-3 items-center"><img src={favorite.vehicle.photos[0]?.url} alt={favorite.vehicle.title} className="w-16 h-12 rounded-xl object-cover" /><span className="text-sm font-semibold">{favorite.vehicle.title}</span></Link>)}</div>}</div><div className="bg-white rounded-3xl p-6 border border-[#E9E1D2]"><h2 className="font-serif text-xl font-semibold mb-4">Mi Perfil</h2><div className="space-y-2 text-xs text-[#4A4643]"><p><strong>Email:</strong> {user.email}</p><p><strong>Teléfono:</strong> {user.phone || 'No configurado'}</p><p><strong>Rol:</strong> Viajero</p></div></div></aside></div></main></div>;
}
