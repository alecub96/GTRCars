/**
 * Utilidades para sincronización bidireccional de calendarios iCal (RFC 5545)
 * Compatible con Airbnb, empresas del sector, Booking.com, Google Calendar, Indie Campers, VRBO y Apple Calendar.
 */

export interface ParsedIcsEvent {
  uid?: string;
  start: Date;
  end: Date;
  summary: string;
  description?: string;
  platform: 'AIRBNB' | 'YESCAPA' | 'BOOKING' | 'GOOGLE' | 'INDIE_CAMPERS' | 'OTHER';
}

/**
 * Detecta la plataforma de origen del calendario analizando el texto del evento o la cabecera
 */
export function detectPlatformFromIcs(content: string, urlOrFilename = ''): 'AIRBNB' | 'YESCAPA' | 'BOOKING' | 'GOOGLE' | 'INDIE_CAMPERS' | 'OTHER' {
  const combined = (content + ' ' + urlOrFilename).toLowerCase();
  if (combined.includes('airbnb') || combined.includes('air-calendar')) return 'AIRBNB';
  if (combined.includes('yescapa')) return 'YESCAPA';
  if (combined.includes('booking.com') || combined.includes('hoteladmin')) return 'BOOKING';
  if (combined.includes('google.com') || combined.includes('google calendar')) return 'GOOGLE';
  if (combined.includes('indiecampers') || combined.includes('indie campers')) return 'INDIE_CAMPERS';
  return 'OTHER';
}

/**
 * Parsea fechas en formatos iCal comunes:
 * - 20260825 (DATE)
 * - 20260825T140000Z (UTC DATETIME)
 * - 20260825T140000 (LOCAL DATETIME)
 */
export function parseIcsDate(value: string): Date {
  const clean = value.trim().replace(/^VALUE=DATE:/i, '');

  // Formato YYYYMMDD (solo fecha)
  if (/^\d{8}$/.test(clean)) {
    const year = Number(clean.slice(0, 4));
    const month = Number(clean.slice(4, 6)) - 1;
    const day = Number(clean.slice(6, 8));
    return new Date(Date.UTC(year, month, day, 0, 0, 0));
  }

  // Formato YYYYMMDDTHHMMSSZ o YYYYMMDDTHHMMSS
  const match = clean.match(/^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})(Z)?$/i);
  if (match) {
    const year = Number(match[1]);
    const month = Number(match[2]) - 1;
    const day = Number(match[3]);
    const hour = Number(match[4]);
    const min = Number(match[5]);
    const sec = Number(match[6]);
    return new Date(Date.UTC(year, month, day, hour, min, sec));
  }

  const parsed = new Date(clean);
  return Number.isNaN(parsed.getTime()) ? new Date('invalid') : parsed;
}

/**
 * Parsea el contenido completo de un archivo .ics y extrae los eventos VEVENT
 */
export function parseIcsEvents(content: string, urlOrFilename = ''): ParsedIcsEvent[] {
  const globalPlatform = detectPlatformFromIcs(content, urlOrFilename);
  const events: ParsedIcsEvent[] = [];

  // Desplegar líneas plegadas de iCalendar (RFC 5545: líneas que empiezan con espacio o tabulador se unen con la anterior)
  const unfolded = content.replace(/\r\n[ \t]/g, '').replace(/\n[ \t]/g, '');
  const rows = unfolded.replace(/\r/g, '').split('\n');

  let current: Partial<ParsedIcsEvent> | null = null;

  for (const rawRow of rows) {
    const row = rawRow.trim();
    if (!row) continue;

    if (row === 'BEGIN:VEVENT') {
      current = {
        platform: globalPlatform,
        summary: 'No disponible (Sincronizado)',
      };
      continue;
    }

    if (row === 'END:VEVENT' && current) {
      if (current.start && !Number.isNaN(current.start.getTime())) {
        // Si no hay fecha de fin o es igual al inicio, asumimos 1 día de duración
        let end = current.end;
        if (!end || Number.isNaN(end.getTime()) || end <= current.start) {
          end = new Date(current.start.getTime() + 24 * 60 * 60 * 1000);
        }

        events.push({
          uid: current.uid,
          start: current.start,
          end,
          summary: current.summary || 'No disponible (Sincronizado)',
          description: current.description,
          platform: current.platform || globalPlatform,
        });
      }
      current = null;
      continue;
    }

    if (!current) continue;

    // Procesar campos clave de VEVENT
    const colonIdx = row.indexOf(':');
    if (colonIdx === -1) continue;

    const key = row.slice(0, colonIdx).toUpperCase();
    const value = row.slice(colonIdx + 1);

    if (key === 'UID') {
      current.uid = value;
    } else if (key.startsWith('DTSTART')) {
      current.start = parseIcsDate(value);
    } else if (key.startsWith('DTEND')) {
      current.end = parseIcsDate(value);
    } else if (key === 'SUMMARY') {
      current.summary = value.replace(/\\n/g, ' ').replace(/\\,/g, ',').replace(/\\;/g, ';');
      if (value.toLowerCase().includes('airbnb')) current.platform = 'AIRBNB';
      if (value.toLowerCase().includes('yescapa')) current.platform = 'YESCAPA';
      if (value.toLowerCase().includes('booking')) current.platform = 'BOOKING';
    } else if (key === 'DESCRIPTION') {
      current.description = value.replace(/\\n/g, '\n').replace(/\\,/g, ',').replace(/\\;/g, ';');
    }
  }

  return events;
}

/**
 * Formatea una fecha para iCalendar en formato YYYYMMDD
 */
function formatIcsDate(date: Date): string {
  const d = new Date(date);
  const year = d.getUTCFullYear();
  const month = String(d.getUTCMonth() + 1).padStart(2, '0');
  const day = String(d.getUTCDate()).padStart(2, '0');
  return `${year}${month}${day}`;
}

/**
 * Formatea una fecha UTC para DTSTAMP en formato YYYYMMDDTHHMMSSZ
 */
function formatIcsDateTimeUtc(date: Date): string {
  const d = new Date(date);
  const year = d.getUTCFullYear();
  const month = String(d.getUTCMonth() + 1).padStart(2, '0');
  const day = String(d.getUTCDate()).padStart(2, '0');
  const hours = String(d.getUTCHours()).padStart(2, '0');
  const mins = String(d.getUTCMinutes()).padStart(2, '0');
  const secs = String(d.getUTCSeconds()).padStart(2, '0');
  return `${year}${month}${day}T${hours}${mins}${secs}Z`;
}

/**
 * Genera un archivo iCalendar (.ics) estándar con las reservas y bloqueos de una camper
 */
export function generateIcsCalendar(params: {
  vehicleTitle: string;
  vehicleSlug: string;
  bookings: Array<{
    id: string;
    code: string;
    startDate: Date;
    endDate: Date;
    status: string;
  }>;
  blocks: Array<{
    id: string;
    startDate: Date;
    endDate: Date;
    reason?: string | null;
  }>;
}): string {
  const nowUtc = formatIcsDateTimeUtc(new Date());

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Vaneando//Alquiler de Campers Canarias//ES',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    `X-WR-CALNAME:Vaneando - ${params.vehicleTitle.replace(/[\r\n]/g, ' ')}`,
    'X-WR-TIMEZONE:Atlantic/Canary',
  ];

  // Exportar reservas confirmadas
  for (const booking of params.bookings) {
    if (['CONFIRMED', 'ACTIVE', 'COMPLETED'].includes(booking.status)) {
      lines.push(
        'BEGIN:VEVENT',
        `UID:vaneando-booking-${booking.code}@vaneando.com`,
        `DTSTAMP:${nowUtc}`,
        `DTSTART;VALUE=DATE:${formatIcsDate(booking.startDate)}`,
        `DTEND;VALUE=DATE:${formatIcsDate(booking.endDate)}`,
        `SUMMARY:Reservado (Vaneando - ${booking.code})`,
        `DESCRIPTION:Reserva confirmada en Vaneando.com para ${params.vehicleTitle.replace(/[\r\n]/g, ' ')}`,
        'STATUS:CONFIRMED',
        'TRANSP:OPAQUE',
        'END:VEVENT'
      );
    }
  }

  // Exportar bloqueos de disponibilidad manuales o sincronizados
  for (const block of params.blocks) {
    const isExternalSync = block.reason?.startsWith('SYNC_');
    const summary = isExternalSync
      ? `No disponible (${block.reason?.replace('SYNC_', '').replace(/_/g, ' ') || 'Sincronizado'})`
      : 'No disponible (Vaneando Bloqueo)';

    lines.push(
      'BEGIN:VEVENT',
      `UID:vaneando-block-${block.id}@vaneando.com`,
      `DTSTAMP:${nowUtc}`,
      `DTSTART;VALUE=DATE:${formatIcsDate(block.startDate)}`,
      `DTEND;VALUE=DATE:${formatIcsDate(block.endDate)}`,
      `SUMMARY:${summary}`,
      'STATUS:CONFIRMED',
      'TRANSP:OPAQUE',
      'END:VEVENT'
    );
  }

  lines.push('END:VCALENDAR');

  return lines.join('\r\n');
}
