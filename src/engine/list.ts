// engine/list.ts — a lista Keep-style (Fase 8 · linhagem #20)
// Puro: sem Supabase, sem UI. "Um lugar pra cobrir o simples — compra
// leite" (Rick, 11 Jun). Entradas moram no body como {text, done}: leves,
// checáveis no lugar, sem virar micro-items no tronco. Floor 2 honrado —
// a diferença pra projeto (floor 5) é exatamente o compromisso relacional.

import type { AtomItem, ListBody, ListEntry } from '@/types/item';

export function readListBody(item: AtomItem): ListBody {
  const body = (item.body ?? {}) as Record<string, unknown>;
  const raw = Array.isArray(body.entries) ? body.entries : [];
  const entries: ListEntry[] = raw
    .filter((e): e is Record<string, unknown> => !!e && typeof e === 'object')
    .filter((e) => typeof e.text === 'string')
    .map((e) => ({ text: e.text as string, done: e.done === true }));
  return { entries };
}

export function listLists(items: AtomItem[]): AtomItem[] {
  return items.filter((i) => i.type === 'list' && i.state !== 'archived' && i.status !== 'archived');
}

// "2 de 5" — estado da lista pra chips/cards; null se vazia.
export function listSummary(item: AtomItem): string | null {
  const { entries } = readListBody(item);
  if (entries.length === 0) return null;
  const open = entries.filter((e) => !e.done).length;
  return open === 0 ? `${entries.length} ✓` : `${open} de ${entries.length}`;
}

// Mutações puras — devolvem o body novo, quem persiste é o chamador.
export function toggleEntry(item: AtomItem, index: number): ListBody {
  const { entries } = readListBody(item);
  return {
    entries: entries.map((e, i) => (i === index ? { ...e, done: !e.done } : e)),
  };
}

export function addEntry(item: AtomItem, text: string): ListBody {
  const { entries } = readListBody(item);
  const clean = text.trim();
  return clean ? { entries: [...entries, { text: clean, done: false }] } : { entries };
}

export function removeEntry(item: AtomItem, index: number): ListBody {
  const { entries } = readListBody(item);
  return { entries: entries.filter((_, i) => i !== index) };
}
