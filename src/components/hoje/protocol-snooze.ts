// hoje/protocol-snooze.ts — silêncio por aparelho (Fase 7)
// Mesmo padrão do PersonSuggestions: localStorage, nunca o tronco.
// Protocolo rodado ou dispensado não volta a chamar HOJE; amanhã a condição
// decide de novo.
import { localDayKey } from '@/engine/dates';

const key = (userId: string) => `mindroot:protocol-snoozed:${userId}`;

export function getSnoozedIds(userId: string | undefined): string[] {
  if (!userId) return [];
  try {
    const map = JSON.parse(localStorage.getItem(key(userId)) ?? '{}') as Record<string, string>;
    const today = localDayKey();
    return Object.keys(map).filter((id) => map[id] === today);
  } catch {
    return [];
  }
}

export function snoozeToday(userId: string | undefined, protocolId: string): void {
  if (!userId) return;
  try {
    const map = JSON.parse(localStorage.getItem(key(userId)) ?? '{}') as Record<string, string>;
    map[protocolId] = localDayKey();
    localStorage.setItem(key(userId), JSON.stringify(map));
  } catch {
    // localStorage indisponível — o banner volta, nunca quebra
  }
}
