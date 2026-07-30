// engine/digest.ts — o raro tem memória (ato V · D66, DP-F)
// Puro. A válvula só se justifica pela raridade: cinco ausências «nunca teve
// registro» repetidas todo dia às 07:15 viram ruído, e ruído mata a raridade
// que faz o aviso valer. Mas silenciar por prazo ("não repete em 7 dias")
// seria relógio, não espelho — o passaporte que passa de 30 pra 7 dias
// MUDOU, e merece voz.
//
// A regra: **o dito só volta quando o estado muda.** Estado aqui é a banda,
// não o número — de 113 pra 112 dias nada aconteceu; de 8 pra 7 sim.
//
// A edge `daily-digest` espelha estas bandas à mão (Deno não alcança @/);
// `vault-espelho.test.ts` compara as constantes e quebra se divergirem.

/** Bandas de validade: os degraus em que uma validade vira notícia de novo. */
export const EXPIRY_BANDS = { hoje: 0, semana: 7, mes: 30 } as const;

export function expiryBand(daysLeft: number): string {
  if (daysLeft < 0) return 'vencido';
  if (daysLeft <= EXPIRY_BANDS.hoje) return 'hoje';
  if (daysLeft <= EXPIRY_BANDS.semana) return 'semana';
  if (daysLeft <= EXPIRY_BANDS.mes) return 'mes';
  return 'janela';
}

/** A ausência vira notícia a cada degrau; «nunca teve registro» é dito UMA vez. */
export const ABSENCE_STEP_DAYS = 90;

export function absenceStep(daysSince: number | null): string {
  if (daysSince === null) return 'nunca';
  return String(Math.floor(daysSince / ABSENCE_STEP_DAYS));
}

export interface DigestSubject {
  expiries: Array<{ id: string; daysLeft: number }>;
  absences: Array<{ domain: string; daysSince: number | null }>;
}

/**
 * A impressão do que há pra dizer hoje. Igual à de ontem = nada mudou.
 * Ordenada, pra que a mesma matéria nunca gere impressões diferentes.
 */
export function digestFingerprint(subject: DigestSubject): string {
  const partes = [
    ...subject.expiries.map((e) => `v:${e.id}:${expiryBand(e.daysLeft)}`),
    ...subject.absences.map((a) => `a:${a.domain}:${absenceStep(a.daysSince)}`),
  ];
  return partes.sort().join('|');
}

/**
 * Fala? Só se há matéria E ela mudou desde a última vez. Sem matéria, o
 * silêncio já era lei (D66); com matéria repetida, passa a ser.
 */
export function shouldSpeak(atual: string, ultimo: string | null): boolean {
  if (atual === '') return false;
  return atual !== ultimo;
}
