// engine/mouth.ts — a boca única (Onda 3 · face @)
// Puro: sem Supabase, sem UI. Lê o que chegou e diz O QUE É — quem age é a
// face. A gramática é a MESMA do Telegram (telegram-webhook): "sinto:" abre
// a alma, "lista:" abre a despensa, o resto é captura. Uma boca, dois
// aparelhos — a fricção de decidir "onde põe" morre aqui (parecer-ux §@).

import { parseCapture } from './token-parser';
import { fold } from './people';
import type { AtomItem, AtomModule, AtomType } from '@/types/item';
import type { TriageResult } from '@/service/triage-service';

export type MouthReading =
  | { kind: 'soul'; emotion: string; note: string }
  | { kind: 'list'; name: string | null; entries: string[] }
  | {
      kind: 'capture';
      title: string;
      notes: string | null;      // texto inteiro quando veio despejo longo/colado
      module: AtomModule | null; // tokens explícitos (#work @task @sexta)
      type: AtomType | null;
      dueDate: string | null;
      hasTokens: boolean;        // module+type dados → assentimento já veio no gesto
    };

// Mesma regex do telegram-webhook — a gramática da boca não pode divergir.
const SOUL_RE = /^sinto[:\s]+(.+)$/is;
// "lista: leite, pão" ou "lista mercado: leite, pão" — nome opcional antes do ':'
const LIST_RE = /^lista(?:\s+([^:\n]+))?:\s*(.+)$/is;

const LONGFORM_CHARS = 140;

export function readMouth(input: string, today: Date = new Date()): MouthReading {
  const text = input.trim();

  const soul = text.match(SOUL_RE);
  if (soul) {
    return {
      kind: 'soul',
      emotion: soul[1].split(/[.,\n]/)[0].trim(),
      note: soul[1].trim(),
    };
  }

  const list = text.match(LIST_RE);
  if (list) {
    const entries = list[2]
      .split(/[,\n]/)
      .map((e) => e.trim())
      .filter(Boolean);
    if (entries.length > 0) {
      return { kind: 'list', name: list[1]?.trim() || null, entries };
    }
  }

  const parsed = parseCapture(text, today);
  const longform = text.includes('\n') || text.length > LONGFORM_CHARS;
  // parseCapture colapsa \n — a 1ª linha do despejo vem do original (tokens tirados)
  const firstLine = parseCapture(text.split('\n')[0], today).title;
  return {
    kind: 'capture',
    title: longform ? firstLine.slice(0, 120) : parsed.title,
    notes: longform ? text : null,
    module: parsed.module,
    type: parsed.type,
    dueDate: parsed.dueDate,
    hasTokens: !!(parsed.module && parsed.type),
  };
}

// ─── listas: onde a entrada pousa ────────────────────────

/** Nome dado → lista aberta que casa; sem nome → a única aberta; senão null (nasce nova). */
export function resolveListTarget(openLists: AtomItem[], name: string | null): AtomItem | null {
  if (name) {
    const f = fold(name);
    return openLists.find((l) => fold(l.title) === f || fold(l.title).includes(f)) ?? null;
  }
  return openLists.length === 1 ? openLists[0] : null;
}

// ─── triage → estrutura ──────────────────────────────────
// O que o quickClassify precisa pra aplicar uma leitura da AI. body segue o
// contrato do tronco: due mora em body.operations.due_date (OperationsExtension).
export function structureFromTriage(result: TriageResult): {
  type: AtomType;
  module: AtomModule;
  body: Record<string, unknown>;
} {
  return {
    type: result.type as AtomType,
    module: result.module as AtomModule,
    body: result.due_date ? { operations: { due_date: result.due_date } } : {},
  };
}

// ─── os chips da leitura ─────────────────────────────────
// "li assim: △ task · #trabalho · @sexta · 92%" — estado, nunca julgamento.
export function readingChips(result: TriageResult): string[] {
  const chips = [`△ ${result.type}`, `#${result.module}`];
  if (result.due_date) chips.push(`@${result.due_date.slice(5)}`);
  chips.push(`${Math.round(result.confidence)}%`);
  return chips;
}
