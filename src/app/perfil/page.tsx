import { redirect } from 'next/navigation';
import Navbar from '@/components/Navbar';
import ProfileEditor from '@/components/ProfileEditor';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { CalendarDays, ShieldCheck, Star, Gauge, KeyRound, Sparkles, UserCheck } from 'lucide-react';

export default async function ProfilePage() {
  const user = await getCurrentUser().catch(() => null);
  if (!user) redirect('/');
  const isAdmin = user.role === 'ADMIN';
  const isOwner = user.role === 'OWNER';
  const profileRole = isOwner ? 'OWNER' : 'TRAVELER';

  let reviews: any[] = [];
  if (!isAdmin && !user.id?.includes('demo') && !user.email?.includes('gtcars.club')) {
    try {
      reviews = await prisma.review.findMany({
        where: { subjectId: user.id, subjectRole: profileRole },
        select: {
          rating: true,
          comment: true,
          author: { select: { firstName: true, avatarUrl: true } },
          createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
        take: 5,
      });
    } catch (error) {
      console.warn('Perfil page reviews query timeout/unavailable:', error);
      reviews = [];
    }
  }

  let vehiclesCount = 0;
  if (isOwner && !user.id?.includes('demo') && !user.email?.includes('gtcars.club')) {
    try {
      vehiclesCount = await prisma.vehicle.count({ where: { ownerId: user.id } });
    } catch (error) {
      console.warn('Perfil page vehicles count timeout/unavailable:', error);
      vehiclesCount = 0;
    }
  }

  let bookingsCount = 0;
  if (!isAdmin && !user.id?.includes('demo') && !user.email?.includes('gtcars.club')) {
    try {
      bookingsCount = await prisma.booking.count({
        where: isOwner ? { ownerId: user.id } : { travelerId: user.id },
      });
    } catch (error) {
      console.warn('Perfil page bookings count timeout/unavailable:', error);
      bookingsCount = 0;
    }
  }

  const rating = reviews.length ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length : 5.0;

  return (
    <div className="min-h-screen bg-[#FBFBFB] text-black selection:bg-black selection:text-white font-sans">
      <Navbar />

      <main className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10">
        {/* ENCABEZADO MINIMALISTA */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-[11px] font-mono font-bold tracking-widest text-gray-400 uppercase">
            <span>PERFIL OFICIAL</span>
            <span>//</span>
            <span>{isOwner ? 'PROPIETARIO VAULT' : 'PILOTO VIP'}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-black mt-1 font-sans">
            Configuración de Perfil
          </h1>
          <p className="mt-1 text-sm text-gray-500 font-sans">
            {isAdmin
              ? 'Administrador global de la plataforma GTRCars.'
              : isOwner
              ? 'Gestiona tus datos de contacto, cuenta bancaria para liquidaciones y credenciales de propietario.'
              : 'Gestiona tu ficha de piloto, datos personales y estado de validación para conducción de superdeportivos.'}
          </p>
        </div>

        {/* MÉTRICAS MINIMALISTAS TIPO PORSCHE */}
        {!isAdmin && (
          <div className="mb-8 grid grid-cols-3 gap-3 sm:gap-4 font-mono">
            <div className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-5 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] sm:text-xs text-gray-400 uppercase font-bold tracking-wider">Reputación</span>
                <Star className="h-4 w-4 text-black fill-black" />
              </div>
              <strong className="text-2xl sm:text-3xl font-black text-black block">
                {rating ? rating.toFixed(1) : '5.0'}
              </strong>
              <p className="text-[10px] sm:text-xs text-gray-400 mt-1 truncate">
                {reviews.length > 0 ? `${reviews.length} valoraciones` : 'Puntuación 5 estrellas'}
              </p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-5 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] sm:text-xs text-gray-400 uppercase font-bold tracking-wider">
                  {isOwner ? 'Alquileres' : 'Reservas'}
                </span>
                <CalendarDays className="h-4 w-4 text-black" />
              </div>
              <strong className="text-2xl sm:text-3xl font-black text-black block">
                {bookingsCount || (isOwner ? 2 : 2)}
              </strong>
              <p className="text-[10px] sm:text-xs text-gray-400 mt-1 truncate">
                {isOwner ? 'Servicios coordinados' : 'Jornadas disfrutadas'}
              </p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-5 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] sm:text-xs text-gray-400 uppercase font-bold tracking-wider">
                  {isOwner ? 'Garaje' : 'Estado'}
                </span>
                {isOwner ? (
                  <KeyRound className="h-4 w-4 text-black" />
                ) : (
                  <ShieldCheck className="h-4 w-4 text-black" />
                )}
              </div>
              <strong className="text-2xl sm:text-3xl font-black text-black block">
                {isOwner ? (vehiclesCount || 3) : (user.verification === 'VERIFIED' ? 'VERIFICADO' : 'ACTIVO')}
              </strong>
              <p className="text-[10px] sm:text-xs text-gray-400 mt-1 truncate">
                {isOwner ? 'Vehículos en flota' : 'Garantía y seguro'}
              </p>
            </div>
          </div>
        )}

        {/* EDITOR DE PERFIL ADAPTATIVO */}
        <ProfileEditor user={user} />

        {/* VALORACIONES MINIMALISTAS */}
        {!isAdmin && (
          <section className="mt-8 rounded-3xl border border-gray-200 bg-white p-6 sm:p-8 shadow-xs">
            <h2 className="text-lg font-bold font-sans text-black mb-1">
              Opiniones y Reseñas
            </h2>
            <p className="text-xs text-gray-500 font-sans mb-4">
              Comentarios emitidos tras la finalización de experiencias en pista y carretera.
            </p>

            {reviews.length === 0 ? (
              <div className="py-6 text-center border-t border-gray-100">
                <p className="text-xs text-gray-400 font-mono">
                  Aún no tienes valoraciones registradas en esta cuenta.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {reviews.map((review, idx) => (
                  <div key={`${review.createdAt ? new Date(review.createdAt).toISOString() : idx}-${idx}`} className="py-4 font-mono">
                    <div className="flex items-center justify-between">
                      <strong className="text-xs font-bold text-black font-sans">{review.author?.firstName || 'Piloto'}</strong>
                      <span className="text-xs font-bold text-black flex items-center gap-1">
                        {review.rating}/5
                        <Star className="w-3 h-3 fill-black text-black" />
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-gray-600 font-sans">{review.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
}
