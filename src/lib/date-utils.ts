const DATE_ONLY = /^\d{4}-\d{2}-\d{2}$/;

export function parseDateOnly(value: unknown): Date | null {
  if (typeof value !== 'string' || !DATE_ONLY.test(value)) return null;
  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day ? date : null;
}

export function isValidDateRange(start: unknown, end: unknown): start is string {
  const startDate = parseDateOnly(start);
  const endDate = parseDateOnly(end);
  return Boolean(startDate && endDate && startDate < endDate);
}

export function formatDateSafe(value: unknown, locale = 'es-ES'): string | null {
  if (value === null || value === undefined || value === '') return null;
  const date = value instanceof Date ? value : new Date(String(value));
  if (Number.isNaN(date.getTime())) return null;
  return new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Atlantic/Canary' }).format(date);
}
