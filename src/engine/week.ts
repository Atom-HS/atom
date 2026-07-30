// engine/week.ts — a pressão dos próximos dias (ato IV · benchmark 10)
// Puro. A vista só-hoje esconde sobrecarga cumulativa: "cada dia parece
// administrável isoladamente". O remédio do mercado é a vista de semana —
// que nos faria virar o app que espelha (lei 1). Aqui é só um sussurro: UMA
// linha dizendo qual dia adiante já está cheio, em estado, nunca em juízo
// (D46). Sem barra, sem cor, sem "você está sobrecarregado".

import { fixosOfDay, localDayKey } from './fixos';
import type { AtomItem } from '@/types/item';

export interface DayLoad {
  dayKey: string;
  date: Date;
  /** horas marcadas (bloco duro com hora — all-day não ocupa a agenda) */
  marcadas: number;
  /** o que vence naquele dia */
  entregas: number;
  total: number;
}

const ACIONAVEL = new Set(['task', 'habit']);

function dueKeyOf(i: AtomItem): string | null {
  const ops = (i.body as Record<string, unknown> | null)?.operations as
    | { due_date?: string | null }
    | undefined;
  const raw = ops?.due_date;
  return typeof raw === 'string' && raw ? raw.slice(0, 10) : null;
}

/** A carga de cada dia da janela — começa AMANHÃ (hoje é a página inteira). */
export function weekAhead(items: AtomItem[], now: Date, days = 7): DayLoad[] {
  const out: DayLoad[] = [];
  for (let n = 1; n <= days; n++) {
    const date = new Date(now);
    date.setDate(date.getDate() + n);
    const dayKey = localDayKey(date);
    const marcadas = fixosOfDay(items, date).filter((f) => !f.allDay).length;
    const entregas = items.filter(
      (i) =>
        i.type != null &&
        ACIONAVEL.has(i.type) &&
        i.status === 'active' &&
        dueKeyOf(i) === dayKey,
    ).length;
    out.push({ dayKey, date, marcadas, entregas, total: marcadas + entregas });
  }
  return out;
}

// Abaixo disto o dia é dia; não se sussurra o normal. O número veio do
// desenho e se move vivendo — não é lei.
export const PESO_MINIMO = 3;

/** "amanhã" · "quinta" — o dia como quem fala. */
export function dayName(date: Date, now: Date): string {
  const amanha = new Date(now);
  amanha.setDate(amanha.getDate() + 1);
  if (localDayKey(date) === localDayKey(amanha)) return 'amanhã';
  return date.toLocaleDateString('pt-BR', { weekday: 'long' }).replace(/-feira$/, '');
}

/**
 * O sussurro: o dia mais cheio da janela, se houver o que dizer. Silêncio
 * quando a semana está leve — dizer "nada pesado adiante" seria falar por
 * falar, e a raridade é o que faz o aviso valer.
 */
export function pressureLine(loads: DayLoad[], now: Date): string | null {
  const pico = [...loads].sort((a, b) => b.total - a.total || a.dayKey.localeCompare(b.dayKey))[0];
  if (!pico || pico.total < PESO_MINIMO) return null;

  const nome = dayName(pico.date, now);
  const partes: string[] = [];
  if (pico.marcadas > 0) {
    partes.push(pico.marcadas === 1 ? '1 hora marcada' : `${pico.marcadas} horas marcadas`);
  }
  if (pico.entregas > 0) {
    partes.push(pico.entregas === 1 ? '1 pra entregar' : `${pico.entregas} pra entregar`);
  }
  return `${nome}: ${partes.join(' e ')}`;
}
