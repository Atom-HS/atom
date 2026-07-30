// engine/mirror.ts — o espelho no tempo (Onda 3 · F9)
// Puro: sem Supabase, sem UI. A regra de ouro (parecer §ÁRVORE, D49): o
// espelho nomeia padrões QUE TÊM SAÍDA — "3 manhãs ansiosas → tarde leve
// depois do protocolo" — nunca diagnóstico sem caminho. Nomear acalma;
// rotular sem saída é ruminação, e ruminação é proibida por construção:
// pouco dado → null (a face fica quieta: "ainda ouvindo teus dias").
// Lê o rastro que a casa já deixa: checkins (alma), protocol_run
// (atom_events — escrito pra F9 desde a Fase 7) e wraps (emotion_after).

import type { AtomEvent, AtomItem, Emotion } from '@/types/item';
import { CHALLENGING_EMOTIONS } from '@/types/item';
import { fold } from './people';
import { localDayKey } from './dates';

export interface Mirror {
  text: string;       // o padrão nomeado, já com a saída dentro
  kind: 'protocolo' | 'rito';
}

const MIN_MORNINGS = 3; // menos que isto o espelho não fala — sem chute

function isChallenging(emotion: string | null): boolean {
  if (!emotion) return false;
  const f = fold(emotion);
  return CHALLENGING_EMOTIONS.some((e: Emotion) => fold(e) === f);
}

interface DaySoul {
  day: string;
  morning: string | null;      // emoção do 1º check-in da manhã
  evening: string | null;      // emotion_after do wrap
  protocolRan: boolean;
}

function soulBody(i: AtomItem): { emotion_before?: unknown; emotion_after?: unknown } {
  return ((i.body as Record<string, unknown> | null)?.soul ?? {}) as {
    emotion_before?: unknown; emotion_after?: unknown;
  };
}

/** o diário implícito: por dia, a manhã, a noite e se algum protocolo rodou */
export function readDays(items: AtomItem[], events: AtomEvent[], days: number, now: Date): DaySoul[] {
  const since = new Date(now);
  since.setDate(since.getDate() - days);
  const sinceISO = since.toISOString();

  const byDay = new Map<string, DaySoul>();
  const day = (iso: string) => localDayKey(new Date(iso));
  const get = (k: string): DaySoul => {
    if (!byDay.has(k)) byDay.set(k, { day: k, morning: null, evening: null, protocolRan: false });
    return byDay.get(k)!;
  };

  for (const i of items) {
    if (i.created_at < sinceISO) continue;
    if (i.type === 'checkpoint' && (i.tags?.includes('checkin') || i.tags?.includes('#checkin'))) {
      const hour = new Date(i.created_at).getHours();
      const emotion = soulBody(i).emotion_before;
      if (hour < 12 && typeof emotion === 'string') {
        const d = get(day(i.created_at));
        if (!d.morning) d.morning = emotion; // o 1º da manhã é a chegada
      }
    }
    if (i.type === 'wrap') {
      const after = soulBody(i).emotion_after;
      if (typeof after === 'string') get(day(i.created_at)).evening = after;
    }
  }
  for (const ev of events) {
    if (ev.event_type === 'protocol_run' && ev.created_at >= sinceISO) {
      get(day(ev.created_at)).protocolRan = true;
    }
  }
  return [...byDay.values()].sort((a, b) => a.day.localeCompare(b.day));
}

// "manhãs ansiosas", "manhãs tristes" — emoção livre que não flexiona vai entre «»
function morningWord(emotion: string): string {
  const e = fold(emotion);
  if (/oso$|ado$|ido$/.test(e)) return e.slice(0, -1) + 'as';
  if (/e$/.test(e)) return e + 's';
  return `«${e}»`;
}

/** padrão 1 — o protocolo funciona: manhã difícil + protocolo + noite leve */
function protocolPattern(daysSoul: DaySoul[]): Mirror | null {
  const proved = daysSoul.filter(
    (d) => isChallenging(d.morning) && d.protocolRan && d.evening !== null && !isChallenging(d.evening),
  );
  if (proved.length < 2) return null;
  const n = proved.length;
  return {
    kind: 'protocolo',
    text: `nas últimas ${n} manhãs ${morningWord(proved[proved.length - 1].morning!)}, a tarde ficou leve depois do protocolo. o corpo já sabe o caminho — a aurora só precisa lembrar.`,
  };
}

/** padrão 2 — o rito segurou: wraps selados em sequência */
function ritePattern(daysSoul: DaySoul[]): Mirror | null {
  let streak = 0;
  let best = 0;
  for (const d of daysSoul) {
    streak = d.evening !== null ? streak + 1 : 0;
    best = Math.max(best, streak);
  }
  if (best < 3) return null;
  return {
    kind: 'rito',
    text: `${best} dias selados seguidos — o ○ do wrap segurou a semana. o que fecha, descansa.`,
  };
}

/** o espelho — o primeiro padrão com saída, ou silêncio honesto (null) */
export function mirror(
  items: AtomItem[],
  events: AtomEvent[],
  now: Date = new Date(),
  windowDays = 7,
): Mirror | null {
  const daysSoul = readDays(items, events, windowDays, now);
  const withSoul = daysSoul.filter((d) => d.morning !== null || d.evening !== null);
  if (withSoul.length < MIN_MORNINGS) return null; // ainda ouvindo teus dias

  return protocolPattern(daysSoul) ?? ritePattern(daysSoul);
}
