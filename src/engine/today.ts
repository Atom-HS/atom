// engine/today.ts — o que cabe agora (Onda 3 · face HOJE)
// Puro. UMA sugestão, não lista — parecer-ux: "ansiedade odeia escolha".
// Motor simples de propósito (regra burra com bom tom > algoritmo ausente):
// vencido/pra-hoje primeiro, depois o aberto mais antigo. O porquê sempre
// vem junto — o número convida, nunca cobra.

import type { AtomItem } from '@/types/item';

export interface Suggestion {
  item: AtomItem;
  reason: string;
  /** "me dá outra" já passou por todas — daqui em diante elas se repetem */
  deuAVolta: boolean;
}

const ACTIONABLE = new Set(['task', 'habit']);

function dueOf(i: AtomItem): string | null {
  const ops = (i.body as Record<string, unknown> | null)?.operations as
    | { due_date?: string | null }
    | undefined;
  return ops?.due_date ?? null;
}

function isCalendarBlock(i: AtomItem): boolean {
  const body = i.body as Record<string, unknown> | null;
  return typeof body?.start === 'string'; // fixo do Google — não se sugere
}

export function candidatesNow(items: AtomItem[]): AtomItem[] {
  return items.filter(
    (i) =>
      i.type != null &&
      ACTIONABLE.has(i.type) &&
      i.status === 'active' &&
      !isCalendarBlock(i),
  );
}

// Ordena por convite: vencido → pra hoje → mais antigo aberto.
export function rankNow(items: AtomItem[], todayISO: string): AtomItem[] {
  const today = todayISO.slice(0, 10);
  return [...candidatesNow(items)].sort((a, b) => {
    const da = dueOf(a), db = dueOf(b);
    const ka = da && da <= today ? 0 : 1;
    const kb = db && db <= today ? 0 : 1;
    if (ka !== kb) return ka - kb;
    if (ka === 0 && da !== db) return String(da).localeCompare(String(db));
    return a.created_at.localeCompare(b.created_at);
  });
}

// A sugestão n-ésima ("me dá outra" caminha o rank, circular).
export function suggestNow(
  items: AtomItem[],
  todayISO: string,
  skip: number = 0,
): Suggestion | null {
  const ranked = rankNow(items, todayISO);
  if (ranked.length === 0) return null;
  const item = ranked[skip % ranked.length];
  const due = dueOf(item);
  const today = todayISO.slice(0, 10);

  let reason: string;
  if (due && due < today) reason = 'esperando desde antes — tirar do peito alivia';
  else if (due === today) reason = 'é pra hoje — e ainda dá, com calma';
  else {
    const ageDays = Math.floor(
      (new Date(todayISO).getTime() - new Date(item.created_at).getTime()) / 86_400_000,
    );
    reason = ageDays >= 8 ? `aberto há ${ageDays} dias — um gesto já muda` : 'o mais antigo da fila — só este por agora';
  }
  return { item, reason, deuAVolta: skip >= ranked.length };
}
