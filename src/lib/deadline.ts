export function parseDeadline(d: string): number {
  if (!d) return Infinity;
  const MONTHS: Record<string, number> = { jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5, jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11 };

  const monthMatch = d.match(/(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/i);
  if (!monthMatch) return Infinity;

  const month = MONTHS[monthMatch[1].toLowerCase().slice(0, 3)];

  const yearMatch = d.match(/\b(20\d{2})\b/);
  const year = yearMatch ? parseInt(yearMatch[1], 10) : new Date().getFullYear();

  const dayMatch = d.match(/\b([1-9]|[12]\d|3[01])\b/);
  const day = dayMatch ? parseInt(dayMatch[1], 10) : 1;

  return new Date(year, month, day).getTime();
}

export function daysUntil(ms: number): number {
  if (!Number.isFinite(ms)) return Infinity;
  return Math.round((ms - Date.now()) / 86_400_000);
}