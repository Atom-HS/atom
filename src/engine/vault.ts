// engine/vault.ts — o cofre da vida adulta (obra 6 · D63)
// Puro: sem Supabase, sem UI. As duas leituras que o mercado não unifica:
// VALIDADE — deadline com antecedência por tipo de domínio (benchmark 09:
// deadline cru avisa tarde; passaporte pede 9 meses, cartão 2).
// AUSÊNCIA — derivada de evento significativo (criação, conclusão, toque),
// NUNCA de updated_at, que mente a cada retag (falha apontada no benchmark).

import type { AtomEvent, AtomItem } from '@/types/item';

// ─── domínio ─────────────────────────────────────────────

export function domainOf(item: AtomItem): string | null {
  const tag = item.tags?.find((t) => t.startsWith('#domain:'));
  return tag ? tag.slice('#domain:'.length) : null;
}

// ─── validade ────────────────────────────────────────────

// Antecedência por domínio (dias). Regra de domínio, não preferência:
// passaporte avisa ~9 meses antes porque países exigem 6 meses de validade
// na entrada; cartão/CNH ~2 meses (padrão 1Password/GetReminded).
// Exportados porque a edge `daily-digest` espelha esta lei à mão (Deno não
// alcança o alias @/): o teste `vault-espelho.test.ts` compara os dois e
// quebra se divergirem. Comentário não força nada; teste força.
export const LEAD_DAYS: Record<string, number> = {
  documents: 270,
  identity: 90,
  finance: 60,
  health: 60,
};
export const LEAD_DEFAULT = 30;
export const ABSENCE_THRESHOLD_DAYS = 90;

export function leadDays(item: AtomItem): number {
  const d = domainOf(item);
  return (d && LEAD_DAYS[d]) || LEAD_DEFAULT;
}

function readDeadline(item: AtomItem): Date | null {
  const ops = item.body?.operations;
  const raw = ops?.deadline ?? ops?.due_date;
  if (!raw) return null;
  // data-só vale até o FIM do dia — "vence hoje" nunca vira "venceu ontem"
  const date = /^\d{4}-\d{2}-\d{2}$/.test(raw) ? new Date(`${raw}T23:59:59`) : new Date(raw);
  return Number.isNaN(date.getTime()) ? null : date;
}

export interface VaultExpiry {
  item: AtomItem;
  domain: string | null;
  daysLeft: number; // negativo = já venceu
}

const MS_DAY = 86_400_000;

/** O que está na janela de aviso — vencidos primeiro, depois por proximidade.
 *  Só gaveta (#domain:) entra: prazo de tarefa comum é assunto do HOJE, não do cofre. */
export function expiries(items: AtomItem[], now: Date): VaultExpiry[] {
  const out: VaultExpiry[] = [];
  for (const item of items) {
    if (item.status === 'archived' || item.state === 'archived' || item.status === 'completed') continue;
    const domain = domainOf(item);
    if (!domain) continue;
    const deadline = readDeadline(item);
    if (!deadline) continue;
    const daysLeft = Math.floor((deadline.getTime() - now.getTime()) / MS_DAY);
    if (daysLeft <= leadDays(item)) out.push({ item, domain, daysLeft });
  }
  return out.sort((a, b) => a.daysLeft - b.daysLeft);
}

/** Renovar = rolar o deadline pra nova data. Devolve o patch do body. */
export function renewalPatch(item: AtomItem, newDeadlineISO: string): Record<string, unknown> {
  return {
    ...(item.body ?? {}),
    operations: { ...(item.body?.operations ?? {}), deadline: newDeadlineISO },
  };
}

// ─── ausência ────────────────────────────────────────────

// Eventos que contam como toque de verdade na vida (não edição de cadastro)
export const SIGNIFICANT_EVENTS = ['touch', 'checkin', 'protocol_run'] as const;

export interface VaultAbsence {
  domain: string;
  daysSince: number | null; // null = nunca houve toque
}

/**
 * Último toque significativo por domínio: o mais recente entre
 * a criação de um item (registro real, imutável) e um evento significativo
 * cujo item-fonte mora no domínio. updated_at fica de fora por lei.
 */
export function absences(
  domainKeys: string[],
  items: AtomItem[],
  events: AtomEvent[],
  now: Date,
): VaultAbsence[] {
  const itemDomain = new Map<string, string>();
  const lastTouch = new Map<string, number>();

  for (const item of items) {
    if (item.status === 'archived' || item.state === 'archived') continue;
    const domain = domainOf(item);
    if (!domain) continue;
    itemDomain.set(item.id, domain);
    const created = new Date(item.created_at).getTime();
    if (created > (lastTouch.get(domain) ?? 0)) lastTouch.set(domain, created);
  }

  for (const event of events) {
    if (!SIGNIFICANT_EVENTS.includes(event.event_type as (typeof SIGNIFICANT_EVENTS)[number])) continue;
    const domain = itemDomain.get(event.source_id);
    if (!domain) continue;
    const at = new Date(event.created_at).getTime();
    if (at > (lastTouch.get(domain) ?? 0)) lastTouch.set(domain, at);
  }

  return domainKeys.map((domain) => {
    const touch = lastTouch.get(domain);
    return {
      domain,
      daysSince: touch ? Math.floor((now.getTime() - touch) / MS_DAY) : null,
    };
  });
}

/** As ausências que merecem voz — velhas demais (ou nunca), mais antigas primeiro. */
export function quietAbsences(all: VaultAbsence[], thresholdDays = ABSENCE_THRESHOLD_DAYS): VaultAbsence[] {
  return all
    .filter((a) => a.daysSince === null || a.daysSince > thresholdDays)
    .sort((a, b) => (b.daysSince ?? Infinity) - (a.daysSince ?? Infinity));
}
