import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

function datesFromIcs(content: string) {
  const events: { start: Date; end: Date; summary: string }[] = [];
  const rows = content.replace(/\r/g, '').split('\n');
  let current: Partial<{ start: Date; end: Date; summary: string }> | null = null;
  for (const row of rows) {
    if (row === 'BEGIN:VEVENT') current = {};
    if (!current) continue;
    const [key, ...parts] = row.split(':');
    const value = parts.join(':');
    if (key.startsWith('DTSTART')) current.start = parseIcsDate(value);
    if (key.startsWith('DTEND')) current.end = parseIcsDate(value);
    if (key === 'SUMMARY') current.summary = value;
    if (row === 'END:VEVENT' && current.start && current.end && current.start < current.end) events.push({ start: current.start, end: current.end, summary: current.summary || 'Calendario sincronizado' });
    if (row === 'END:VEVENT') current = null;
  }
  return events;
}

function parseIcsDate(value: string) {
  const clean = value.trim();
  if (/^\d{8}$/.test(clean)) return new Date(`${clean.slice(0, 4)}-${clean.slice(4, 6)}-${clean.slice(6, 8)}T00:00:00`);
  const match = clean.match(/^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})Z?$/);
  return match ? new Date(Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3]), Number(match[4]), Number(match[5]), Number(match[6]))) : new Date('invalid');
}

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  const { id } = await context.params;
  const vehicle = await prisma.vehicle.findUnique({ where: { id }, select: { ownerId: true } });
  if (!user || user.role !== 'OWNER' || !vehicle || vehicle.ownerId !== user.id) return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
  const form = await request.formData();
  const file = form.get('file');
  if (!(file instanceof File)) return NextResponse.json({ error: 'Selecciona un archivo .ics' }, { status: 400 });
  if (file.size > 2 * 1024 * 1024) return NextResponse.json({ error: 'El calendario no puede superar 2 MB' }, { status: 413 });
  if (!file.name.toLowerCase().endsWith('.ics') && !['text/calendar', 'application/octet-stream'].includes(file.type)) {
    return NextResponse.json({ error: 'El archivo debe ser un calendario .ics' }, { status: 400 });
  }
  const content = await file.text();
  const now = new Date();
  const horizon = new Date(now); horizon.setFullYear(horizon.getFullYear() + 3);
  const events = datesFromIcs(content).filter((event) => event.end > now && event.start < horizon).slice(0, 2_000);
  if (!events.length) return NextResponse.json({ error: 'No encontramos eventos con fechas en ese calendario' }, { status: 422 });
  const imported = await prisma.$transaction(async (tx) => {
    let count = 0;
    for (const event of events) {
      const conflict = await tx.availabilityBlock.findFirst({ where: { vehicleId: id, startDate: { lt: event.end }, endDate: { gt: event.start }, reason: { startsWith: 'BOOKING_' } } });
      if (conflict) continue;
      const exists = await tx.availabilityBlock.findFirst({ where: { vehicleId: id, startDate: event.start, endDate: event.end, reason: { startsWith: 'SYNC_' } } });
      if (!exists) {
        await tx.availabilityBlock.create({ data: { vehicleId: id, startDate: event.start, endDate: event.end, reason: `SYNC_ICS_${event.summary.replace(/[\r\n]/g, ' ').slice(0, 50)}` } });
        count += 1;
      }
    }
    return count;
  });
  return NextResponse.json({ success: true, imported, total: events.length });
}
