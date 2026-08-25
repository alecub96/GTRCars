import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin';
import { databaseUnavailableResponse, isDatabaseUnavailable } from '@/lib/api-error';
import { ensureDbSchema } from '@/lib/prisma-ensure-schema';

export async function GET(request: Request) {
  try {
    if (!await requireAdmin()) return NextResponse.json({ error: 'No autorizado como administrador' }, { status: 403 });

    await ensureDbSchema().catch(() => {});

    const { searchParams } = new URL(request.url);
    const statusFilter = searchParams.get('status');

    const whereClause: any = {};
    if (statusFilter && statusFilter !== 'ALL') {
      whereClause.status = statusFilter;
    }

    let vehicles: any[] = [];
    try {
      vehicles = await prisma.vehicle.findMany({
        where: whereClause,
        include: {
          owner: { select: { id: true, firstName: true, lastName: true, email: true, phone: true } },
          photos: { take: 4, orderBy: { orderIndex: 'asc' } },
        },
        orderBy: { createdAt: 'desc' },
      });
    } catch (relError) {
      console.warn('Admin findMany with relations warning, trying safe fallback:', relError);
      try {
        vehicles = await prisma.vehicle.findMany({
          where: whereClause,
          include: {
            photos: true,
          },
          orderBy: { createdAt: 'desc' },
        });

        // Intentar enriquecer propietarios manualmente de forma segura
        const ownerIds = Array.from(new Set(vehicles.map((v) => v.ownerId).filter(Boolean)));
        if (ownerIds.length > 0) {
          const owners = await prisma.user.findMany({
            where: { id: { in: ownerIds } },
            select: { id: true, firstName: true, lastName: true, email: true, phone: true },
          }).catch(() => []);
          const ownerMap = new Map(owners.map((o) => [o.id, o]));
          vehicles = vehicles.map((v) => ({
            ...v,
            owner: ownerMap.get(v.ownerId) || null,
          }));
        }
      } catch (fallbackError) {
        console.error('Admin findMany raw fallback error:', fallbackError);
        vehicles = await prisma.vehicle.findMany({
          where: whereClause,
          orderBy: { createdAt: 'desc' },
        });
      }
    }

    return NextResponse.json({ success: true, vehicles });
  } catch (error: any) {
    console.error('API Admin Vehicles Error:', error);
    if (isDatabaseUnavailable(error)) return databaseUnavailableResponse();
    return NextResponse.json({ error: error?.message || 'No se pudo cargar la lista de anuncios' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    if (!await requireAdmin()) return NextResponse.json({ error: 'No autorizado como administrador' }, { status: 403 });

    const body = await request.json();
    const { vehicleId, action } = body;

    if (!vehicleId || !['approve', 'reject'].includes(action)) {
      return NextResponse.json({ error: 'Acción o vehículo no válido' }, { status: 400 });
    }

    const newStatus = action === 'approve' ? 'ACTIVE' : 'REJECTED';

    const vehicle = await prisma.vehicle.update({
      where: { id: vehicleId },
      data: { status: newStatus },
      include: {
        owner: { select: { firstName: true, lastName: true, email: true } },
      },
    });

    return NextResponse.json({
      success: true,
      vehicle,
      message: action === 'approve'
        ? `El anuncio «${vehicle.title}» ha sido APROBADO y ya está activo públicamente.`
        : `El anuncio «${vehicle.title}» ha sido RECHAZADO.`,
    });
  } catch (error: any) {
    console.error('API Admin Vehicles Patch Error:', error);
    if (isDatabaseUnavailable(error)) return databaseUnavailableResponse();
    return NextResponse.json({ error: error?.message || 'No se pudo actualizar el estado del anuncio' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    if (!await requireAdmin()) return NextResponse.json({ error: 'No autorizado como administrador' }, { status: 403 });

    const { searchParams } = new URL(request.url);
    const vehicleId = searchParams.get('id');

    if (!vehicleId) {
      return NextResponse.json({ error: 'ID de vehículo no especificado' }, { status: 400 });
    }

    await prisma.vehicle.delete({
      where: { id: vehicleId },
    });

    return NextResponse.json({
      success: true,
      message: 'Anuncio eliminado de la base de datos con éxito.',
    });
  } catch (error: any) {
    console.error('API Admin Vehicles Delete Error:', error);
    if (isDatabaseUnavailable(error)) return databaseUnavailableResponse();
    return NextResponse.json({ error: error?.message || 'No se pudo eliminar el anuncio' }, { status: 500 });
  }
}
