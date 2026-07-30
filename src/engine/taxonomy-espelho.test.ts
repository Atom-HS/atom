// engine/taxonomy-espelho.test.ts — o contrato da ida vive num lugar só (D68)
//
// O terceiro espelho da casa. A edge `taxonomy-sync` roda em Deno e não
// alcança o alias @/, então espelha À MÃO o contrato de engine/taxonomy.ts
// (TaxonomyRecord, namespace assinado, CALENDAR_KEY) — e a `daily-digest`
// pede a reconciliação na volta diária por um contrato de chamada que
// também é à mão. Todo contrato espelhado à mão ganha guarda (padrão da
// casa: vault-espelho, series-espelho).
//
// Como os irmãos: as edges entram como TEXTO (?raw), lidas e nunca
// executadas. O canônico é engine/taxonomy.ts; as edges seguem. Se este
// teste quebrar: copia-se do canônico pra edge, nunca o contrário.
import { describe, it, expect } from 'vitest';
import { ATOM_NAMESPACE, CALENDAR_KEY } from './taxonomy';
import EDGE_TAX from '../../supabase/functions/taxonomy-sync/index.ts?raw';
import EDGE_DIGEST from '../../supabase/functions/daily-digest/index.ts?raw';

describe('o contrato da ida vive num lugar só — engine/taxonomy × taxonomy-sync', () => {
  it('a edge declara engine/taxonomy como canônico', () => {
    expect(EDGE_TAX).toMatch(/engine\/taxonomy/);
  });

  it('a chave reservada do braço do calendário não diverge', () => {
    const m = EDGE_TAX.match(/const CALENDAR_KEY = "([^"]+)"/);
    expect(m?.[1]).toBe(CALENDAR_KEY);
  });

  it('o namespace assinado não diverge', () => {
    expect(EDGE_TAX).toContain(`startsWith("${ATOM_NAMESPACE}/")`);
  });

  it('o registro (TaxonomyRecord) tem o mesmo shape nos dois lados', () => {
    for (const campo of [
      'gmail: Record<string, { id: string; name: string }>',
      'calendar: { id: string; summary: string } | null',
      'disabled: string[]',
      'applied_at: string | null',
    ]) {
      expect(EDGE_TAX).toContain(campo);
    }
  });
});

describe('a reconciliação na volta diária — daily-digest × taxonomy-sync (D68)', () => {
  it('o cron pede a reconciliação na volta', () => {
    // «deletou lá fora → braço desliga» sem depender do preview à mão
    expect(EDGE_DIGEST).toMatch(/callEdge\("taxonomy-sync", userId, \{ action: "reconcile" \}\)/);
  });

  it('a taxonomy-sync conhece a ação que o cron pede', () => {
    expect(EDGE_TAX).toContain('if (action === "reconcile") {');
  });

  it('reconciliar NUNCA cria — criar exige assentimento (D68)', () => {
    const inicio = EDGE_TAX.indexOf('if (action === "reconcile") {');
    const fim = EDGE_TAX.indexOf('return json({ action: "reconcile", disabled: disabledNow });', inicio);
    expect(inicio).toBeGreaterThan(-1);
    expect(fim).toBeGreaterThan(inicio);
    const bloco = EDGE_TAX.slice(inicio, fim);
    // no bloco do reconcile não existe nenhum gesto de escrita no Google:
    // o único caminho que cria labels/calendário é o apply, pós-assentimento
    expect(bloco).not.toMatch(/"POST"|"DELETE"|"PATCH"|"PUT"/);
  });

  it('só o comando explícito desliga o calendário — erro transitório não', () => {
    // 404/410 é comando do usuário; 5xx do Google não pode virar braço morto
    expect(EDGE_TAX).toMatch(/cr\.status === 404 \|\| cr\.status === 410\) calendarGone = true/);
  });
});
