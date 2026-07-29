// engine/series.ts — assentir uma vez vale pra série (ato III · DP-C)
// Puro. O calendar chega expandido em instâncias (singleEvents), e o dedup
// era por id de instância: o ritual semanal pedia assentimento TODA SEMANA,
// pra sempre. A leitura recorrente→ritual (D69) está certa; a granularidade
// é que estava errada. Aqui a série lembra o selo, e a instância nova herda.

import type { AtomItem, AtomModule, AtomType } from '@/types/item';

/** O que a instância nova herda de uma série já assentida. */
export interface SeriesSeal {
  type: AtomType;
  module: AtomModule;
}

/** O id da série a que um item pertence (null = evento único). */
export function seriesIdOf(item: AtomItem): string | null {
  const raw = (item.body as Record<string, unknown> | null)?.recurring_event_id;
  return typeof raw === 'string' && raw !== '' ? raw : null;
}

/** Um item conta como assentido quando saiu do inbox — o humano passou por ele. */
export function isSealed(item: AtomItem): boolean {
  return item.state !== 'inbox' && item.type !== null;
}

/**
 * Os selos por série, lidos do tronco. Só entra série que JÁ foi assentida —
 * instância que ainda espera leitura não ensina nada a ninguém.
 * Em desacordo dentro da mesma série, o assentimento mais recente manda:
 * trocar de ideia é direito do humano (D69).
 */
export function sealedSeries(items: AtomItem[]): Map<string, SeriesSeal> {
  const out = new Map<string, SeriesSeal>();
  const quando = new Map<string, number>();

  for (const item of items) {
    if (item.status === 'archived' || item.state === 'archived') continue;
    const sid = seriesIdOf(item);
    if (!sid || !isSealed(item)) continue;
    const at = new Date(item.updated_at ?? item.created_at).getTime();
    if (at >= (quando.get(sid) ?? -Infinity)) {
      quando.set(sid, at);
      out.set(sid, { type: item.type as AtomType, module: (item.module ?? 'bridge') as AtomModule });
    }
  }
  return out;
}

export interface Birth {
  type: AtomType;
  module: AtomModule;
  /**
   * Herdou o selo da série. NÃO significa nascer selada: **inbox é
   * obrigatório** e a máquina de estados é sequencial (CLAUDE.md §6) — a
   * instância nasce no estágio 1 como todo mundo e é selada em seguida,
   * passando pelo portão. Herdar poupa a pergunta, nunca o caminho.
   */
  herdou: boolean;
}

/**
 * Como uma instância nasce: herdando a leitura já assentida da série (sem
 * perguntar de novo) ou no inbox esperando o humano.
 */
export function birthOf(
  selo: SeriesSeal | undefined,
  leituraPadrao: { type: AtomType; module: AtomModule },
): Birth {
  if (selo) return { type: selo.type, module: selo.module, herdou: true };
  return { ...leituraPadrao, herdou: false };
}
