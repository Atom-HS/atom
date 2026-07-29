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

export interface BirthState {
  type: AtomType;
  module: AtomModule;
  state: 'inbox' | 'classified';
  genesis_stage: 1 | 2;
}

/**
 * Como uma instância nasce: herdando o selo da série (sem pedir de novo) ou
 * no inbox esperando o humano. A herança reproduz EXATAMENTE o que o
 * assentimento manual produz — nada de estado que só existe por atalho.
 */
export function birthOf(
  selo: SeriesSeal | undefined,
  leituraPadrao: { type: AtomType; module: AtomModule },
): BirthState {
  if (selo) return { type: selo.type, module: selo.module, state: 'classified', genesis_stage: 2 };
  return { ...leituraPadrao, state: 'inbox', genesis_stage: 1 };
}
