// engine/outbox.ts — a fila do avô (Onda 3 · D55)
// Puro: sem Supabase, sem UI, sem window. Sem rede, o que a boca leu vira
// entrada de fila; quem persiste (localStorage) e quem sobe é o
// outbox-service. Padrão do avô: guarda simples, sobe quando dá, nada se
// perde. A leitura acontece ANTES de enfileirar — a gramática da boca
// (sinto:/lista:/captura) não diverge entre online e offline.

import type { MouthReading } from './mouth';
import type { AtomModule, AtomType } from '@/types/item';

// itemId = o ponto desta entrada JÁ nasceu no tronco numa janela anterior.
// Sem essa memória, a retomada recaptura e a fila que existe pra não perder
// passa a duplicar (achado da dissecação 01).
export type OutboxEntry =
  | { v: 1; id: string; at: string; kind: 'soul'; emotion: string; note: string }
  | { v: 1; id: string; at: string; kind: 'list'; name: string | null; entries: string[]; itemId?: string }
  | {
      v: 1; id: string; at: string; kind: 'capture';
      title: string;
      notes: string | null;
      module: AtomModule | null;
      type: AtomType | null;
      dueDate: string | null;
      hasTokens: boolean;
      itemId?: string;
    };

export function entryFromReading(reading: MouthReading, id: string, at: string): OutboxEntry {
  if (reading.kind === 'soul') {
    return { v: 1, id, at, kind: 'soul', emotion: reading.emotion, note: reading.note };
  }
  if (reading.kind === 'list') {
    return { v: 1, id, at, kind: 'list', name: reading.name, entries: reading.entries };
  }
  return {
    v: 1, id, at, kind: 'capture',
    title: reading.title,
    notes: reading.notes,
    module: reading.module,
    type: reading.type,
    dueDate: reading.dueDate,
    hasTokens: reading.hasTokens,
  };
}

// ─── memória do que já nasceu ────────────────────────────
// Captura-primeiro tem consequência na retomada: o ponto pode ter nascido
// antes do erro. A fila lembra o id ANTES de tentar selar — assim a próxima
// janela sela o que falta em vez de criar um segundo ponto igual.

/** O id do ponto que esta entrada já criou no tronco (null = ainda não nasceu). */
export function bornItemId(entry: OutboxEntry): string | null {
  return entry.kind === 'soul' ? null : entry.itemId ?? null;
}

/** Marca o ponto como nascido. Entrada de alma não cria ponto — passa reto. */
export function rememberItem(entry: OutboxEntry, itemId: string): OutboxEntry {
  if (entry.kind === 'soul') return entry;
  return { ...entry, itemId };
}

// ─── serialização defensiva ──────────────────────────────
// Fila corrompida nunca derruba a boca: entrada inválida cai fora, o resto vive.

export function parseQueue(raw: string | null): OutboxEntry[] {
  if (!raw) return [];
  try {
    const q: unknown = JSON.parse(raw);
    if (!Array.isArray(q)) return [];
    return q.filter(isEntry);
  } catch {
    return [];
  }
}

export function serializeQueue(queue: OutboxEntry[]): string {
  return JSON.stringify(queue);
}

function isEntry(e: unknown): e is OutboxEntry {
  if (typeof e !== 'object' || e === null) return false;
  const o = e as Record<string, unknown>;
  if (o.v !== 1 || typeof o.id !== 'string' || typeof o.at !== 'string') return false;
  if (o.kind === 'soul') return typeof o.emotion === 'string' && typeof o.note === 'string';
  // itemId é opcional, mas se veio tem que ser id — memória corrompida
  // recapturaria (pior) ou selaria o item errado (muito pior)
  if (o.itemId !== undefined && typeof o.itemId !== 'string') return false;
  if (o.kind === 'list') {
    return Array.isArray(o.entries) && o.entries.every((x) => typeof x === 'string');
  }
  if (o.kind === 'capture') return typeof o.title === 'string' && typeof o.hasTokens === 'boolean';
  return false;
}
