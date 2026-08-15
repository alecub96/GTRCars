import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin';
import { databaseUnavailableResponse, isDatabaseUnavailable } from '@/lib/api-error';

export async function GET(request: Request) {
  try {
    if (!await requireAdmin()) return NextResponse.json({ error: 'No autorizado como administrador' }, { status: 403 });

    const { searchParams } = new URL(request.url);
    const statusFilter = searchParams.get('status');

    const whereClause: any = {};
    if (statusFilter && ['PENDING_REVIEW', 'ACTIVE', 'REJECTED'].includes(statusFilter)) {
      whereClause.status = statusFilter;
    } else {
      whereClause.status = { in: ['PENDING_REVIEW', 'REJECTED', 'ACTIVE'] };
    }

    const vehicles = await prisma.vehicle.findMany({
      where: whereClause,
      include: {
        owner: { select: { id: true, firstName: true, lastName: true, email: true } },
        photos: { take: 2, orderBy: { orderIndex: 'asc' } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, vehicles });
  } catch (error: any) {
    console.error('API Admin Vehicles Error:', error);
    if (isDatabaseUnavailable(error)) return databaseUnavailableResponse();
    return NextResponse.json({ error: 'No se pudo cargar la lista de anuncios' }, { status: 500 });
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
