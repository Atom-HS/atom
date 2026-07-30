// engine/series-espelho.test.ts — a volta do cron conhece a série (DP-C)
//
// A dissecação 03 achou a MENTE: o `ingestVolta` da edge `daily-digest` se
// declarava «espelho do contrato canônico em connector-service.ingest*» — e
// o espelho divergiu no dia em que o Ato III nasceu. O cron ingeria série
// SEM `recurring_event_id` no body e SEM herança de selo: o standup pedia
// assentimento toda semana, pra sempre, e item nascido pelo cron nem
// ENSINAVA selo (sem série no body, assentir não forma memória).
//
// Como o vault-espelho: a edge é Deno, entra como TEXTO (?raw), lida e
// nunca executada. O canônico é engine/series.ts + connector-service.ts;
// a edge segue. Se este teste quebrar: copia-se do canônico pra edge,
// nunca o contrário.
import { describe, it, expect } from 'vitest';
import EDGE from '../../supabase/functions/daily-digest/index.ts?raw';
import CLIENT from '../service/connector-service.ts?raw';

describe('a volta do cron conhece a série — engine/series × daily-digest', () => {
  it('a edge declara engine/series como canônico', () => {
    expect(EDGE).toMatch(/engine\/series/);
  });

  it('o contrato da instância carrega a série nos DOIS lados (client e cron)', () => {
    // sem isto, assentir um item nascido pelo cron não ensina selo nenhum
    expect(CLIENT).toMatch(/recurring_event_id: serie/);
    expect(EDGE).toMatch(/recurring_event_id: serie/);
  });

  it('a interface CalEvent da edge conhece o campo que a calendar-sync devolve', () => {
    expect(EDGE).toMatch(/recurring_event_id\?: string \| null/);
  });

  it('a edge espelha sealedSeries — e com as mesmas exclusões do engine', () => {
    expect(EDGE).toMatch(/function sealedSeries/);
    // item no inbox não ensina selo (engine/series.isSealed)
    expect(EDGE).toMatch(/state === "inbox"/);
    // arquivado não ensina selo
    expect(EDGE).toMatch(/status === "archived" \|\| r\.state === "archived"/);
  });

  it('herdar poupa a pergunta, nunca o caminho — inbox obrigatório no cron', () => {
    // a instância nasce no estágio 1…
    expect(EDGE).toMatch(/status: "inbox", state: "inbox", genesis_stage: 1/);
    // …e o selo herdado passa pelo portão 1→2, condicionado a ainda estar no inbox
    expect(EDGE).toMatch(/state: "classified", genesis_stage: 2/);
    expect(EDGE).toMatch(/\.eq\("state", "inbox"\)/);
  });

  it('a leitura padrão (sem selo) não divergiu: recorrente→ritual, único→task', () => {
    expect(EDGE).toMatch(/event\.recurring \? "ritual" : "task"/);
    expect(CLIENT).toMatch(/event\.recurring \? 'ritual' : 'task'/);
  });
});

describe('o tag de pessoa não diverge — extractWhoTag no client e no cron', () => {
  it('a transliteração existe nos DOIS lados (André → andre, nunca andr)', () => {
    // pol. 7 da dissecação 03: o acento cai por NFD antes do slug — se um
    // lado transliterar e o outro não, a mesma pessoa vira duas tags
    const NFD = /normalize\(.NFD.\)\.replace\(\/\[\\u0300-\\u036f\]\/g/;
    expect(CLIENT).toMatch(NFD);
    expect(EDGE).toMatch(NFD);
  });

  it('o slug se monta igual nos dois lados', () => {
    const SLUG = /toLowerCase\(\)\.replace\(\/\\s\+\/g, .-.\)\.replace\(\/\[\^a-z0-9-\]\/g/;
    expect(CLIENT).toMatch(SLUG);
    expect(EDGE).toMatch(SLUG);
  });
});
