// engine/meaning.ts — a escada de meaning (spec v0.4 §2.4 · Fase 4)
// O wrap é fractal: a semana faz wrap dos dias, o mês das semanas, e assim
// até o ano. UM mecanismo, parametrizado por cadência. Regras da lei:
//   1. cada nível lê APENAS o nível imediatamente abaixo
//   2. review perdida não quebra — o acumulado é oferecido no próximo
//   3. o sistema apresenta, o humano significa (este engine só apresenta)
import type { AtomItem } from '@/types/item';

export type Cadence = 'week' | 'month' | 'quarter' | 'semester' | 'year';

export interface Rung {
  key: Cadence;
  /** o que este degrau lê: 'wrap' (dias) ou a cadência imediatamente abaixo */
  reads: 'wrap' | Cadence;
  /** quantas leituras acumuladas acordam o degrau */
  need: number;
  label: string;
  invite: string;
}

export const LADDER: Rung[] = [
  { key: 'week',     reads: 'wrap',     need: 7, label: 'a semana',   invite: 'a semana quer fechar' },
  { key: 'month',    reads: 'week',     need: 4, label: 'o mês',      invite: 'o mês quer direção' },
  { key: 'quarter',  reads: 'month',    need: 3, label: 'o trimestre', invite: 'o trimestre pede rumo' },
  { key: 'semester', reads: 'quarter',  need: 2, label: 'o semestre',  invite: 'o ciclo quer se ver' },
  { key: 'year',     reads: 'semester', need: 2, label: 'o ano',      invite: 'a espiral completa, vista de cima' },
];

function reviewCadence(i: AtomItem): Cadence | null {
  if (i.type !== 'review') return null;
  const c = (i.body as Record<string, unknown> | null)?.cadence;
  return typeof c === 'string' ? (c as Cadence) : null;
}

/** ids já lidos por alguma review desta cadência */
function coveredIds(items: AtomItem[], cadence: Cadence): Set<string> {
  const out = new Set<string>();
  for (const i of items) {
    if (reviewCadence(i) !== cadence) continue;
    const reads = (i.body as Record<string, unknown> | null)?.reads;
    if (Array.isArray(reads)) for (const id of reads) out.add(String(id));
  }
  return out;
}

/** o material ainda não sintetizado de um degrau, mais antigo primeiro */
export function uncoveredFor(items: AtomItem[], rung: Rung): AtomItem[] {
  const sources = items.filter((i) =>
    rung.reads === 'wrap' ? i.type === 'wrap' : reviewCadence(i) === rung.reads,
  );
  const covered = coveredIds(items, rung.key);
  return sources
    .filter((i) => !covered.has(i.id))
    .sort((a, b) => a.created_at.localeCompare(b.created_at));
}

export interface AvailableReview {
  rung: Rung;
  /** TODO o acumulado (regra 2) — não só o mínimo */
  reads: AtomItem[];
}

/** o degrau mais baixo com material suficiente — um convite por vez */
export function nextAvailableReview(items: AtomItem[]): AvailableReview | null {
  for (const rung of LADDER) {
    const reads = uncoveredFor(items, rung);
    if (reads.length >= rung.need) return { rung, reads };
  }
  return null;
}
