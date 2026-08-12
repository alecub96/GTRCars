import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { databaseUnavailableResponse, isDatabaseUnavailable } from '@/lib/api-error';

const updateSchema = z.object({
  incidentId: z.string().min(1),
  status: z.enum(['UNDER_REVIEW', 'AWAITING_TRAVELER', 'AWAITING_OWNER', 'RESOLVED', 'REJECTED']),
  resolution: z.string().trim().max(5000).optional(),
});

async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
  if (user.role !== 'ADMIN') return NextResponse.json({ error: 'Acceso restringido' }, { status: 403 });
  return null;
}

export async function GET() {
  try {
    const authError = await requireAdmin();
    if (authError) return authError;
    const incidents = await prisma.incident.findMany({
      include: {
        booking: {
          select: {
            id: true,
            code: true,
            totalAmount: true,
            vehicle: { select: { title: true } },
            traveler: { select: { firstName: true, lastName: true } },
            owner: { select: { firstName: true, lastName: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ success: true, incidents });
  } catch (error) {
    if (isDatabaseUnavailable(error)) return databaseUnavailableResponse();
    console.error('Admin incident list error:', error);
    return NextResponse.json({ error: 'No se pudieron cargar las incidencias' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const authError = await requireAdmin();
    if (authError) return authError;
    const parsed = updateSchema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: 'Revisa el estado y la resolución' }, { status: 400 });
    if (['RESOLVED', 'REJECTED'].includes(parsed.data.status) && !parsed.data.resolution) {
      return NextResponse.json({ error: 'Escribe una resolución antes de cerrar la incidencia' }, { status: 400 });
    }
    const incident = await prisma.incident.update({
      where: { id: parsed.data.incidentId },
      data: { status: parsed.data.status, resolution: parsed.data.resolution || null },
    });
    return NextResponse.json({ success: true, incident });
  } catch (error) {
    if (isDatabaseUnavailable(error)) return databaseUnavailableResponse();
    console.error('Admin incident update error:', error);
    return NextResponse.json({ error: 'No se pudo actualizar la incidencia' }, { status: 500 });
  }
}
