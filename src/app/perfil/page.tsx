import { redirect } from 'next/navigation';
import Navbar from '@/components/Navbar';
import ProfileEditor from '@/components/ProfileEditor';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { CalendarDays, ShieldCheck, Star, Truck } from 'lucide-react';

export default async function ProfilePage() {
  const user = await getCurrentUser(); if (!user) redirect('/');
  const profileRole = user.role === 'OWNER' ? 'OWNER' : 'TRAVELER';
  const [reviews, vehicles, bookings] = await Promise.all([
    prisma.review.findMany({ where: { subjectId: user.id, subjectRole: profileRole }, select: { rating: true, comment: true, author: { select: { firstName: true, avatarUrl: true } }, createdAt: true }, orderBy: { createdAt: 'desc' }, take: 5 }),
    prisma.vehicle.count({ where: { ownerId: user.id } }),
    prisma.booking.count({ where: user.role === 'OWNER' ? { ownerId: user.id } : { travelerId: user.id } }),
  ]);
  const rating = reviews.length ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length : 0;
  return <div className="min-h-screen bg-[#F7F6F2] text-[#13322E]"><Navbar /><main className="mx-auto max-w-6xl px-4 py-10"><div className="mb-8"><span className="text-[11px] font-black uppercase tracking-[.25em] text-[#16B8AA]">Tu identidad en vaneando.</span><h1 className="font-serif text-4xl font-bold">Mi perfil</h1><p className="mt-2 text-sm text-[#6B726E]">Tu identidad, valoración y experiencia de {user.role === 'OWNER' ? 'propietario' : 'viajero'} se gestionan por separado.</p></div><div className="mb-6 grid gap-4 sm:grid-cols-3"><div className="rounded-3xl bg-[#13322E] p-5 text-white"><Star className="mb-3 h-6 w-6 text-[#16B8AA]" /><strong className="font-serif text-3xl">{rating ? rating.toFixed(1) : '—'}</strong><p className="text-xs text-white/70">Valoración como {user.role === 'OWNER' ? 'propietario' : 'viajero'} · {reviews.length} opiniones</p></div><div className="rounded-3xl border border-[#E9E1D2] bg-white p-5"><CalendarDays className="mb-3 h-6 w-6 text-[#16B8AA]" /><strong className="font-serif text-3xl">{bookings}</strong><p className="text-xs text-[#6B726E]">Reservas gestionadas</p></div><div className="rounded-3xl border border-[#E9E1D2] bg-white p-5">{user.role === 'OWNER' ? <Truck className="mb-3 h-6 w-6 text-[#16B8AA]" /> : <ShieldCheck className="mb-3 h-6 w-6 text-[#16B8AA]" />}<strong className="font-serif text-3xl">{user.role === 'OWNER' ? vehicles : user.verification === 'VERIFIED' ? 'Sí' : 'Pendiente'}</strong><p className="text-xs text-[#6B726E]">{user.role === 'OWNER' ? 'Campers publicadas' : 'Identidad verificada'}</p></div></div><ProfileEditor user={user} /><section className="mt-8 rounded-3xl border border-[#E9E1D2] bg-white p-6"><h2 className="font-serif text-2xl font-bold">Opiniones sobre ti como {user.role === 'OWNER' ? 'propietario' : 'viajero'}</h2>{reviews.length === 0 ? <p className="mt-3 text-sm text-[#6B726E]">Todavía no tienes valoraciones en este modo.</p> : reviews.map((review, idx) => <div key={`${review.createdAt.toISOString()}-${idx}`} className="mt-4 border-t border-[#E9E1D2] pt-4"><div className="flex items-center justify-between"><strong>{review.author.firstName}</strong><span className="text-sm font-bold text-amber-600">★ {review.rating}/5</span></div><p className="mt-1 text-sm text-[#6B726E]">{review.comment}</p></div>)}</section></main></div>;
}
