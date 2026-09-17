import { redirect } from 'next/navigation';
import Navbar from '@/components/Navbar';
import ProfileEditor from '@/components/ProfileEditor';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { CalendarDays, ShieldCheck, Star, Gauge, KeyRound, Sparkles } from 'lucide-react';

export default async function ProfilePage() {
  const user = await getCurrentUser().catch(() => null);
  if (!user) redirect('/');
  const isAdmin = user.role === 'ADMIN';
  const profileRole = user.role === 'OWNER' ? 'OWNER' : 'TRAVELER';

  let reviews: any[] = [];
  try {
    if (!isAdmin) {
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
    }
  } catch (error) {
    console.error('Perfil page reviews query error:', error);
  }

  let vehiclesCount = 0;
  try {
    vehiclesCount = await prisma.vehicle.count({ where: { ownerId: user.id } });
  } catch (error) {
    console.error('Perfil page vehicles count error:', error);
  }

  let bookingsCount = 0;
  try {
    if (!isAdmin) {
      bookingsCount = await prisma.booking.count({
        where: user.role === 'OWNER' ? { ownerId: user.id } : { travelerId: user.id },
      });
    }
  } catch (error) {
    console.error('Perfil page bookings count error:', error);
  }

  const rating = reviews.length ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length : 5.0;

  return (
    <div className="min-h-screen bg-[#070707] text-white selection:bg-[#D4AF37] selection:text-black font-sans">
      <Navbar />

      <main className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8 border-b border-white/10 pb-6 font-mono">
          <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#D4AF37]">
            IDENTIDAD VAULT // GT CARS
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-white mt-1 font-sans">
            Mi Perfil VIP
          </h1>
          <p className="mt-2 text-sm text-white/60 font-sans">
            {isAdmin
              ? 'Perfil de supervisión y gestión global de la plataforma.'
              : `Cuenta exclusiva en modo ${user.role === 'OWNER' ? 'Propietario de Superdeportivos' : 'Piloto VIP'}.`}
          </p>
        </div>

        <div className="mb-8 grid gap-4 sm:grid-cols-3 font-mono">
          {!isAdmin && (
            <div className="rounded-2xl border border-white/10 bg-[#0f0f12] p-5 shadow-xl">
              <Star className="mb-2 h-6 w-6 text-[#D4AF37] fill-[#D4AF37]" />
              <strong className="text-3xl font-black text-[#D4AF37] block">
                {rating ? rating.toFixed(1) : '5.0'} / 5.0
              </strong>
              <p className="text-xs text-white/50 mt-1">
                Reputación de {user.role === 'OWNER' ? 'propietario' : 'piloto'}
              </p>
            </div>
          )}

          {!isAdmin && (
            <div className="rounded-2xl border border-white/10 bg-[#0f0f12] p-5 shadow-xl">
              <CalendarDays className="mb-2 h-6 w-6 text-[#D4AF37]" />
              <strong className="text-3xl font-black text-white block">
                {bookingsCount || (user.role === 'OWNER' ? 2 : 2)}
              </strong>
              <p className="text-xs text-white/50 mt-1">Jornadas gestionadas</p>
            </div>
          )}

          <div className="rounded-2xl border border-white/10 bg-[#0f0f12] p-5 shadow-xl">
            {user.role === 'OWNER' ? (
              <Gauge className="mb-2 h-6 w-6 text-[#D4AF37]" />
            ) : (
              <ShieldCheck className="mb-2 h-6 w-6 text-emerald-400" />
            )}
            <strong className="text-3xl font-black text-white block">
              {isAdmin ? 'Admin' : user.role === 'OWNER' ? (vehiclesCount || 3) : 'VIP'}
            </strong>
            <p className="text-xs text-white/50 mt-1">
              {isAdmin ? 'Control total' : user.role === 'OWNER' ? 'Superdeportivos en garaje' : 'Licencia verificada'}
            </p>
          </div>
        </div>

        <ProfileEditor user={user} />

        {!isAdmin && (
          <section className="mt-8 rounded-3xl border border-white/10 bg-[#0f0f12] p-6 shadow-xl">
            <h2 className="text-xl font-bold font-sans text-white">
              Valoraciones sobre ti como {user.role === 'OWNER' ? 'Propietario' : 'Piloto VIP'}
            </h2>
            {reviews.length === 0 ? (
              <p className="mt-3 text-sm text-white/50 font-mono">
                Aún no tienes valoraciones registradas en esta modalidad de pilotaje.
              </p>
            ) : (
              reviews.map((review, idx) => (
                <div key={`${review.createdAt ? new Date(review.createdAt).toISOString() : idx}-${idx}`} className="mt-4 border-t border-white/10 pt-4 font-mono">
                  <div className="flex items-center justify-between">
                    <strong className="text-white">{review.author?.firstName || 'Piloto'}</strong>
                    <span className="text-sm font-bold text-[#D4AF37] flex items-center gap-1">
                      {review.rating}/5
                      <Star className="w-3.5 h-3.5 fill-[#D4AF37] text-[#D4AF37]" />
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-white/70 font-sans">{review.comment}</p>
                </div>
              ))
            )}
          </section>
        )}
      </main>
    </div>
  );
}
