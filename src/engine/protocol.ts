// engine/protocol.ts — o procedimento condicional (Fase 7 · spec v0.4 D2)
// Puro: sem Supabase, sem UI. Protocolo = "quando X, faço Y": dorme até a
// situação chamar. Sem recorrência, sem calendário — a condição é o gatilho;
// o que só o humano percebe dispara pela mão ("tô nessa").
// A condição lê a alma do dia no TRONCO (checkpoints 'checkin': aurora +
// Telegram "sinto:"), nunca o Zustand — o volátil evapora, o tronco fica.

import type { AtomItem, EnergyLevel, ProtocolBody, ProtocolWhen, RitualSlot } from '@/types/item';
import { CHALLENGING_EMOTIONS } from '@/types/item';
import { fold } from '@/engine/people';
import { localDayKey } from '@/engine/dates';

export interface MomentContext {
  emotion: string | null;      // último check-in de hoje (texto livre é dado válido)
  energy: EnergyLevel | null;
  period: RitualSlot;
}

const ENERGY_LEVELS: EnergyLevel[] = ['high', 'medium', 'low'];
const RITUAL_SLOTS: RitualSlot[] = ['aurora', 'zenite', 'crepusculo'];

export function readProtocolBody(item: AtomItem): ProtocolBody {
  const body = (item.body ?? {}) as Record<string, unknown>;
  const raw = body.when;
  let when: ProtocolWhen | null = null;
  if (raw && typeof raw === 'object') {
    const w = raw as Record<string, unknown>;
    when = {
      emotion: typeof w.emotion === 'string' && w.emotion.trim() ? w.emotion : null,
      challenging: w.challenging === true,
      energy: ENERGY_LEVELS.includes(w.energy as EnergyLevel) ? (w.energy as EnergyLevel) : null,
      period: RITUAL_SLOTS.includes(w.period as RitualSlot) ? (w.period as RitualSlot) : null,
    };
  }
  return {
    steps: Array.isArray(body.steps) ? (body.steps as unknown[]).filter((s): s is string => typeof s === 'string') : [],
    when,
  };
}

export function listProtocols(items: AtomItem[]): AtomItem[] {
  return items.filter((i) => i.type === 'protocol' && i.state !== 'archived' && i.status !== 'archived');
}

// A condição acordou? Campos definidos são AND; período sozinho não acorda
// nada (protocolo por horário seria rotina disfarçada — D2 proíbe).
export function matchesWhen(when: ProtocolWhen | null, ctx: MomentContext): boolean {
  if (!when) return false; // só manual — o app nunca decide por ele
  const hasSoulCondition = !!when.emotion || when.challenging || !!when.energy;
  if (!hasSoulCondition) return false;

  if (when.period && when.period !== ctx.period) return false;
  if (when.energy && when.energy !== ctx.energy) return false;
  if (when.emotion && (!ctx.emotion || fold(when.emotion) !== fold(ctx.emotion))) return false;
  if (when.challenging) {
    if (!ctx.emotion) return false;
    const folded = fold(ctx.emotion);
    if (!CHALLENGING_EMOTIONS.some((e) => fold(e) === folded)) return false;
  }
  return true;
}

// A alma de hoje, lida do tronco: último checkpoint 'checkin' do dia local
// (aurora ou Telegram "sinto:"). Texto livre entra como veio.
export function readTodaySoul(
  items: AtomItem[],
  now: Date = new Date(),
): { emotion: string | null; energy: EnergyLevel | null } {
  const today = localDayKey(now);
  const checkins = items
    .filter(
      (i) =>
        i.type === 'checkpoint' &&
        (i.tags?.includes('checkin') || i.tags?.includes('#checkin')) &&
        localDayKey(new Date(i.created_at)) === today,
    )
    .sort((a, b) => a.created_at.localeCompare(b.created_at));
  const last = checkins[checkins.length - 1];
  if (!last) return { emotion: null, energy: null };
  const soul = (last.body?.soul ?? {}) as { emotion_before?: unknown; energy_level?: unknown };
  return {
    emotion: typeof soul.emotion_before === 'string' ? soul.emotion_before : null,
    energy: ENERGY_LEVELS.includes(soul.energy_level as EnergyLevel) ? (soul.energy_level as EnergyLevel) : null,
  };
}

// Os protocolos que a situação atual acorda (menos os já silenciados hoje).
export function evaluateProtocols(
  items: AtomItem[],
  ctx: MomentContext,
  snoozedIds: string[] = [],
): AtomItem[] {
  const snoozed = new Set(snoozedIds);
  return listProtocols(items).filter(
    (p) => !snoozed.has(p.id) && matchesWhen(readProtocolBody(p).when, ctx),
  );
}
