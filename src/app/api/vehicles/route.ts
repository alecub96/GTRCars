import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { getFeaturedAudience } from '@/lib/featured';
import { databaseUnavailableResponse, isDatabaseUnavailable } from '@/lib/api-error';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const island = searchParams.get('island');
    const minPassengers = searchParams.get('passengers');

    const whereClause: any = {};
    const currentUser = await getCurrentUser();
    if (currentUser?.role === 'OWNER') whereClause.ownerId = currentUser.id;
    else whereClause.status = 'ACTIVE';
    if (island) whereClause.island = island;
    if (minPassengers) whereClause.passengers = { gte: Number(minPassengers) };

    const vehicles = await prisma.vehicle.findMany({
      where: whereClause,
      include: {
        photos: { orderBy: { orderIndex: 'asc' } },
        reviews: { select: { rating: true } },
        owner: { select: { firstName: true, avatarUrl: true } },
      },
    });

    const featured = await getFeaturedAudience();
    const featuredVehicles = vehicles.map((vehicle) => ({
      ...vehicle,
      isFeatured: featured.ownerIds.has(vehicle.ownerId) || featured.vehicleIds.has(vehicle.id) || featured.subscriptionOwnerIds.has(vehicle.ownerId),
    }));

    // Usuario destacado: mérito (20 reseñas de 5 estrellas) o suscripción activa.
    const now = new Date();
    const activeFeaturedVehicles = featuredVehicles.filter((vehicle) => vehicle.isFeatured);
    const standardVehicles = featuredVehicles.filter((vehicle) => !vehicle.isFeatured);

    // 2. Rotación diaria justa entre anuncios destacados.
    // Utilizamos el día actual del año (1-365) como semilla de rotación
    const dayOfYear = Math.floor(
      (now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24)
    );

    const rotatedFeaturedVehicles = [...activeFeaturedVehicles].sort((a, b) => {
      // Determinación pseudo-aleatoria rotativa diaria por ID de vehículo y día del año
      const hashA = (a.id.charCodeAt(0) + dayOfYear) % 100;
      const hashB = (b.id.charCodeAt(0) + dayOfYear) % 100;
      return hashB - hashA;
    });

    // 3. ORDENAR ANUNCIOS ESTÁNDAR POR VALORACIÓN Y CERCANÍA (estrellas y fecha)
    const sortedStandardVehicles = [...standardVehicles].sort((a, b) => {
      const avgA = a.reviews.length > 0 ? a.reviews.reduce((s, r) => s + r.rating, 0) / a.reviews.length : 5.0;
      const avgB = b.reviews.length > 0 ? b.reviews.reduce((s, r) => s + r.rating, 0) / b.reviews.length : 5.0;
      return avgB - avgA;
    });

    // 4. COMBINAR: los destacados aparecen primero, seguidos del resto por valoración.
    const finalSortedVehicles = [...rotatedFeaturedVehicles, ...sortedStandardVehicles];

    return NextResponse.json({ success: true, vehicles: finalSortedVehicles });
  } catch (error) {
    console.error('API Vehicles Search Error:', error);
    if (isDatabaseUnavailable(error)) return databaseUnavailableResponse();
    return NextResponse.json({ error: 'Error al buscar vehículos' }, { status: 500 });
  }
}
