// engine/dates.ts — datas no fuso LOCAL do usuário (F2 close · spec v0.4 Fase 1)
// NUNCA usar new Date().toISOString().slice(0,10) pra "hoje": é o dia UTC.
// Em Brisbane (UTC+10), das 00:00 às 10:00 o dia UTC ainda é ONTEM —
// aurora resetava errado, @hoje parseava ontem, due de hoje sumia.

/** YYYY-MM-DD no fuso local da máquina do usuário. */
export function localDayKey(d: Date = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}
