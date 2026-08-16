import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { parseIcsEvents, generateIcsCalendar, detectPlatformFromIcs } from '@/lib/ical';
import { databaseUnavailableResponse, isDatabaseUnavailable } from '@/lib/api-error';
import { ensureDbSchema } from '@/lib/prisma-ensure-schema';

/**
 * GET: Exporta el calendario oficial de Vaneando en formato iCal (.ics)
 * o devuelve la lista de feeds vinculados si se consulta desde la app.
 */
export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    await ensureDbSchema();
    const { id } = await context.params;
    const url = new URL(request.url);
    const isExport =
      url.searchParams.get('export') === 'true' ||
      url.searchParams.get('format') === 'ics' ||
      request.headers.get('accept')?.includes('text/calendar');

    const vehicle = await prisma.vehicle.findUnique({
      where: { id },
      select: {
        id: true,
        slug: true,
        title: true,
        ownerId: true,
        status: true,
        bookings: {
          where: { status: { in: ['CONFIRMED', 'ACTIVE', 'COMPLETED'] } },
          select: { id: true, code: true, startDate: true, endDate: true, status: true },
        },
        availabilityBlocks: {
          select: { id: true, startDate: true, endDate: true, reason: true },
        },
      },
    });

    if (!vehicle) {
      return NextResponse.json({ error: 'Vehículo no encontrado' }, { status: 404 });
    }

    // MODO EXPORTACIÓN ICAL (.ics) PARA AIRBNB, YESCAPA, GOOGLE, ETC.
    if (isExport) {
      const icsString = generateIcsCalendar({
        vehicleTitle: vehicle.title,
        vehicleSlug: vehicle.slug,
        bookings: vehicle.bookings,
        blocks: vehicle.availabilityBlocks,
      });

      return new Response(icsString, {
        status: 200,
        headers: {
          'Content-Type': 'text/calendar; charset=utf-8',
          'Content-Disposition': `attachment; filename="${vehicle.slug}-vaneando.ics"`,
          'Cache-Control': 'no-cache, no-store, max-age=0, must-revalidate',
        },
      });
    }

    // MODO JSON: INFORMACIÓN PARA EL PANEL DEL PROPIETARIO
    const user = await getCurrentUser();
    if (!user || (vehicle.ownerId !== user.id && user.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
    }

    let feeds: any[] = [];
    try {
      feeds = ((await prisma.$queryRawUnsafe(
        `SELECT id, name, url, platform, lastSyncAt, lastEventCount, createdAt FROM ExternalCalendarFeed WHERE vehicleId = ? ORDER BY createdAt DESC`,
        id
      ).catch(() => [])) || []) as any[];
    } catch {}

    const origin = url.origin || 'https://vaneando.com';
    const exportUrl = `${origin}/api/vehicles/${vehicle.id}/calendar?export=true`;

    return NextResponse.json({
      success: true,
      exportUrl,
      feeds,
      totalBlocks: vehicle.availabilityBlocks.length,
      syncedBlocks: vehicle.availabilityBlocks.filter((b) => b.reason?.startsWith('SYNC_')).length,
    });
  } catch (error) {
    console.error('Calendar GET error:', error);
    if (isDatabaseUnavailable(error)) return databaseUnavailableResponse();
    return NextResponse.json({ error: 'No se pudo obtener el calendario' }, { status: 500 });
  }
}

/**
 * POST: Importa un calendario externo mediante archivo .ics o URL de sincronización (Airbnb, Yescapa, Booking, etc.)
 */
export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    await ensureDbSchema();
    const user = await getCurrentUser();
    const { id } = await context.params;

    const vehicle = await prisma.vehicle.findUnique({
      where: { id },
      select: { id: true, ownerId: true, title: true },
    });

    if (!user || !vehicle || (vehicle.ownerId !== user.id && user.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
    }

    const contentType = request.headers.get('content-type') || '';
    let icsContent = '';
    let sourcePlatform: string = 'OTHER';
    let feedName = 'Calendario importado';
    let feedUrl: string | null = null;

    // CASO 1: IMPORTACIÓN MEDIANTE SUBIDA DE ARCHIVO .ICS
    if (contentType.includes('multipart/form-data')) {
      const form = await request.formData();
      const file = form.get('file');
      if (!(file instanceof File)) {
        return NextResponse.json({ error: 'Selecciona un archivo .ics' }, { status: 400 });
      }
      if (file.size > 5 * 1024 * 1024) {
        return NextResponse.json({ error: 'El archivo de calendario no puede superar 5 MB' }, { status: 413 });
      }

      icsContent = await file.text();
      sourcePlatform = detectPlatformFromIcs(icsContent, file.name);
      feedName = `Archivo ${file.name.replace(/\.ics$/i, '')}`;
    }
    // CASO 2: IMPORTACIÓN MEDIANTE URL AUTOMÁTICA (AIRBNB, YESCAPA, BOOKING, GOOGLE)
    else {
      const body = await request.json().catch(() => ({}));
      let targetUrl = String(body.url || '').trim();

      if (!targetUrl) {
        return NextResponse.json({ error: 'Debes proporcionar una URL de calendario iCal válida' }, { status: 400 });
      }

      // Convertir enlaces webcal:// en https://
      if (targetUrl.startsWith('webcal://')) {
        targetUrl = 'https://' + targetUrl.slice('webcal://'.length);
      } else if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
        targetUrl = 'https://' + targetUrl;
      }

      feedUrl = targetUrl;
      feedName = String(body.name || '').trim() || 'Calendario externo';

      try {
        const fetchRes = await fetch(targetUrl, {
          headers: {
            'User-Agent': 'VaneandoCalendarSync/1.0 (+https://vaneando.com)',
            Accept: 'text/calendar, application/octet-stream, text/plain, */*',
          },
          signal: AbortSignal.timeout(12000),
        });

        if (!fetchRes.ok) {
          return NextResponse.json(
            { error: `No se pudo descargar el calendario (código HTTP ${fetchRes.status})` },
            { status: 422 }
          );
        }

        icsContent = await fetchRes.text();
        sourcePlatform = detectPlatformFromIcs(icsContent, targetUrl);
      } catch (fetchErr: any) {
        return NextResponse.json(
          { error: `Error conectando con la URL del calendario: ${fetchErr.message || 'Tiempo de espera agotado'}` },
          { status: 422 }
        );
      }
    }

    // PARSEAR EVENTOS ICAL
    const now = new Date();
    const horizon = new Date(now);
    horizon.setFullYear(horizon.getFullYear() + 3);

    const parsedEvents = parseIcsEvents(icsContent, feedUrl || feedName);
    const validEvents = parsedEvents
      .filter((event) => event.end > now && event.start < horizon)
      .slice(0, 3_000);

    if (validEvents.length === 0) {
      return NextResponse.json(
        { error: 'No se encontraron eventos o fechas bloqueadas en el archivo/URL proporcionado.' },
        { status: 422 }
      );
    }

    // GUARDAR EN BASE DE DATOS DENTRO DE TRANSACCIÓN
    const importedCount = await prisma.$transaction(async (tx) => {
      let count = 0;
      const prefix = `SYNC_${sourcePlatform}_`;

      // Si es una sincronización de URL ya vinculada, limpiar los eventos anteriores de esa fuente para actualizar
      if (feedUrl) {
        await tx.availabilityBlock.deleteMany({
          where: {
            vehicleId: id,
            reason: { startsWith: prefix },
          },
        });
      }

      for (const event of validEvents) {
        // No pisar reservas directas de Vaneando
        const conflictBooking = await tx.availabilityBlock.findFirst({
          where: {
            vehicleId: id,
            startDate: { lt: event.end },
            endDate: { gt: event.start },
            reason: { startsWith: 'BOOKING_' },
          },
        });
        if (conflictBooking) continue;

        // Comprobar si ya existe el bloqueo
        const exists = await tx.availabilityBlock.findFirst({
          where: {
            vehicleId: id,
            startDate: event.start,
            endDate: event.end,
          },
        });

        if (!exists) {
          const reasonSummary = event.summary.replace(/[\r\n]/g, ' ').slice(0, 40);
          await tx.availabilityBlock.create({
            data: {
              vehicleId: id,
              startDate: event.start,
              endDate: event.end,
              reason: `${prefix}${reasonSummary}`,
            },
          });
          count++;
        }
      }

      // Si se sincronizó por URL, registrar o actualizar el feed en ExternalCalendarFeed
      if (feedUrl) {
        const feedId = `cal_feed_${id.slice(0, 8)}_${Math.random().toString(36).slice(2, 8)}`;
        try {
          const existingFeeds = ((await tx.$queryRawUnsafe(
            `SELECT id FROM ExternalCalendarFeed WHERE vehicleId = ? AND url = ? LIMIT 1`,
            id,
            feedUrl
          ).catch(() => [])) || []) as any[];

          if (existingFeeds.length > 0) {
            await tx.$executeRawUnsafe(
              `UPDATE ExternalCalendarFeed SET name = ?, platform = ?, lastSyncAt = CURRENT_TIMESTAMP(3), lastEventCount = ? WHERE id = ?`,
              feedName,
              sourcePlatform,
              count,
              existingFeeds[0].id
            );
          } else {
            await tx.$executeRawUnsafe(
              `INSERT INTO ExternalCalendarFeed (id, vehicleId, name, url, platform, lastSyncAt, lastEventCount, createdAt) VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP(3), ?, CURRENT_TIMESTAMP(3))`,
              feedId,
              id,
              feedName,
              feedUrl,
              sourcePlatform,
              count
            );
          }
        } catch (feedDbErr) {
          console.warn('ExternalCalendarFeed record save error (suppressed):', feedDbErr);
        }
      }

      return count;
    });

    return NextResponse.json({
      success: true,
      imported: importedCount,
      total: validEvents.length,
      platform: sourcePlatform,
      message: `Se han sincronizado correctamente ${importedCount} periodos no disponibles de ${sourcePlatform}.`,
    });
  } catch (error: any) {
    console.error('Calendar import error:', error);
    if (isDatabaseUnavailable(error)) return databaseUnavailableResponse();
    return NextResponse.json({ error: error.message || 'No se pudo procesar el calendario' }, { status: 500 });
  }
}

/**
 * DELETE: Elimina un feed vinculado y sus bloqueos sincronizados asociados
 */
export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    await ensureDbSchema();
    const user = await getCurrentUser();
    const { id } = await context.params;

    const vehicle = await prisma.vehicle.findUnique({
      where: { id },
      select: { ownerId: true },
    });

    if (!user || !vehicle || (vehicle.ownerId !== user.id && user.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
    }

    const body = await request.json().catch(() => ({}));
    const feedId = String(body.feedId || '');
    const platform = String(body.platform || '');

    if (feedId) {
      try {
        await prisma.$executeRawUnsafe(`DELETE FROM ExternalCalendarFeed WHERE id = ? AND vehicleId = ?`, feedId, id);
      } catch {}
    }

    if (platform && platform !== 'ALL') {
      await prisma.availabilityBlock.deleteMany({
        where: {
          vehicleId: id,
          reason: { startsWith: `SYNC_${platform}_` },
        },
      });
    } else if (body.clearAllSynced) {
      await prisma.availabilityBlock.deleteMany({
        where: {
          vehicleId: id,
          reason: { startsWith: 'SYNC_' },
        },
      });
    }

    return NextResponse.json({ success: true, message: 'Sincronización eliminada correctamente' });
  } catch (error) {
    console.error('Calendar DELETE error:', error);
    if (isDatabaseUnavailable(error)) return databaseUnavailableResponse();
    return NextResponse.json({ error: 'No se pudo eliminar la sincronización' }, { status: 500 });
  }
}
