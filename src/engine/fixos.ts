// engine/fixos.ts — o hoje nunca mente (obra 7, etapa 3 · D67/D69)
// Puro. Lê os fixos do dia (hora marcada = céu) sem distorcer:
// all-day não ganha hora falsa, date-only não desliza de dia por timezone,
// e conflito é refletido como estado (D46) — nunca alarme.
import type { AtomItem } from '@/types/item';

export interface Fixo {
  item: AtomItem;
  start: string;
  allDay: boolean;
  /** títulos dos fixos com hora que cruzam este — estado, nunca julgamento */
  conflictsWith: string[];
}

function bodyOf(i: AtomItem): Record<string, unknown> | null {
  return (i.body ?? null) as Record<string, unknown> | null;
}

function isDateOnly(s: string): boolean {
  return !s.includes('T');
}

/** chave do dia no fuso LOCAL — 'YYYY-MM-DD' */
export function localDayKey(d: Date): string {
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${m}-${day}`;
}

// Um fixo pertence ao dia se: com hora → mesmo dia local; all-day
// (date-only, fim exclusivo como o Google manda) → start ≤ dia < end.
function belongsToDay(start: string, end: string | null, dayKey: string): boolean {
  if (isDateOnly(start)) {
    if (end && isDateOnly(end)) return start <= dayKey && dayKey < end;
    return start === dayKey;
  }
  return localDayKey(new Date(start)) === dayKey;
}

/** Os fixos de um dia: all-day primeiro, depois por hora. */
export function fixosOfDay(items: AtomItem[], now: Date): Fixo[] {
  const dayKey = localDayKey(now);

  const doDia = items.filter((i) => {
    const b = bodyOf(i);
    const start = b?.start;
    if (typeof start !== 'string' || start === '') return false;
    const end = typeof b?.end === 'string' ? (b.end as string) : null;
    return belongsToDay(start, end, dayKey);
  });

  const fixos: Fixo[] = doDia.map((item) => {
    const b = bodyOf(item);
    const start = String(b?.start);
    const allDay = b?.all_day === true || isDateOnly(start);
    return { item, start, allDay, conflictsWith: [] };
  });

  // conflito: só entre fixos com hora; encostado (10–11 / 11–12) não cruza
  const timed = fixos.filter((f) => !f.allDay);
  for (const f of timed) {
    const fStart = new Date(f.start).getTime();
    const fEndRaw = bodyOf(f.item)?.end;
    const fEnd = typeof fEndRaw === 'string' && !isDateOnly(fEndRaw)
      ? new Date(fEndRaw).getTime()
      : fStart;
    for (const g of timed) {
      if (g === f) continue;
      const gStart = new Date(g.start).getTime();
      const gEndRaw = bodyOf(g.item)?.end;
      const gEnd = typeof gEndRaw === 'string' && !isDateOnly(gEndRaw)
        ? new Date(gEndRaw).getTime()
        : gStart;
      const cruza = fEnd > fStart || gEnd > gStart
        ? fStart < gEnd && gStart < fEnd
        : fStart === gStart; // dois sem duração só cruzam no mesmo instante
      if (cruza) f.conflictsWith.push(g.item.title);
    }
  }

  return fixos.sort((a, b) => {
    if (a.allDay !== b.allDay) return a.allDay ? -1 : 1;
    return a.start.localeCompare(b.start);
  });
}
