// engine/routine.ts — a cadeia de hábitos (Fase 6 · spec v0.4 D2)
// Puro: sem Supabase, sem UI. Rotina = item-contêiner com chain[] ordenada;
// elos = habits. Espera items JÁ com virtual reset aplicado (useItems faz):
// elo feito neste período = status 'completed'.

import type { AtomItem, RitualSlot, RoutineBody } from '@/types/item';

export interface ChainLink {
  item: AtomItem;
  done: boolean;
}

export interface ChainProgress {
  routine: AtomItem;
  links: ChainLink[];
  done: number;
  total: number;
  complete: boolean;      // todos os elos feitos no período — "a cadeia executada"
  sealed: boolean;        // a própria rotina já selou o período
  next: AtomItem | null;  // primeiro elo aberto da ordem
}

export function readRoutineBody(item: AtomItem): RoutineBody {
  const body = (item.body ?? {}) as Record<string, unknown>;
  const slot = body.slot;
  return {
    chain: Array.isArray(body.chain) ? (body.chain as string[]) : [],
    slot: slot === 'aurora' || slot === 'zenite' || slot === 'crepusculo' ? (slot as RitualSlot) : null,
  };
}

export function listRoutines(items: AtomItem[]): AtomItem[] {
  return items.filter((i) => i.type === 'routine' && i.state !== 'archived' && i.status !== 'archived');
}

export function routinesForSlot(items: AtomItem[], slot: RitualSlot): AtomItem[] {
  return listRoutines(items).filter((r) => readRoutineBody(r).slot === slot);
}

export function chainProgress(routine: AtomItem, items: AtomItem[]): ChainProgress {
  const { chain } = readRoutineBody(routine);
  const byId = new Map(items.map((i) => [i.id, i]));
  // Elo apagado/arquivado sai da conta — a cadeia é o que existe hoje
  const links: ChainLink[] = chain
    .map((id) => byId.get(id))
    .filter((i): i is AtomItem => !!i && i.status !== 'archived' && i.state !== 'archived')
    .map((item) => ({ item, done: item.status === 'completed' }));

  const done = links.filter((l) => l.done).length;
  const total = links.length;
  return {
    routine,
    links,
    done,
    total,
    complete: total > 0 && done === total,
    sealed: routine.status === 'completed',
    next: links.find((l) => !l.done)?.item ?? null,
  };
}
