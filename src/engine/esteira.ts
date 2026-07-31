// engine/esteira.ts — o modo em bloco da esteira (auditoria 20 § 4 e § 7.1)
// A regra que separa lote de atropelo: só entra no bloco o que JÁ TEM leitura
// visível (D69 — a heurística nunca decide quieta). Item de conector chega
// lido (ritual/task/note); captura crua chega sem type e fica no um-a-um,
// onde a leitura acontece na frente de quem assente.

import type { AtomItem, AtomModule, AtomType } from '@/types/item';

export interface LeituraPronta {
  type: AtomType;
  module: AtomModule;
}

/** A leitura que o card mostraria — pronta pra aceitar em bloco, ou null. */
export function leituraPronta(item: AtomItem): LeituraPronta | null {
  if (!item.type) return null;
  return { type: item.type, module: item.module ?? 'bridge' };
}

/** Quantos da fila têm leitura pronta — o número do gesto «marcar lidos». */
export function comLeitura(items: AtomItem[]): AtomItem[] {
  return items.filter((i) => leituraPronta(i) !== null);
}
