// engine/vault-espelho.test.ts — uma lei, um lugar (ato V · D63/D66)
//
// A edge `daily-digest` roda em Deno e não alcança o alias @/, então ela
// espelha a lei do cofre À MÃO. A spec 12 já dizia «o arquivo canônico é o
// engine; a edge segue» — mas nada forçava: mudar o lead time do passaporte
// aqui deixaria o digest avisando pelo número velho, calado, todo dia às
// 07:15. Comentário não força. Este teste força.
//
// Se ele quebrar: a correção é copiar o valor do ENGINE pra edge, nunca o
// contrário. O engine é a lei; a edge é o espelho.
import { describe, it, expect } from 'vitest';
import { ABSENCE_THRESHOLD_DAYS, LEAD_DAYS, LEAD_DEFAULT, SIGNIFICANT_EVENTS } from './vault';
import { ABSENCE_STEP_DAYS, EXPIRY_BANDS } from './digest';
import { RAIZ_DOMAINS } from '@/config/raiz';
// a edge entra como TEXTO (?raw): lida, nunca executada — ela é Deno, e o
// alvo aqui é comparar o que está escrito. Sem @types/node no caminho.
import EDGE from '../../supabase/functions/daily-digest/index.ts?raw';

/** Lê `const NOME = <literal>;` da edge como JSON. */
function constanteDaEdge(nome: string): unknown {
  const m = EDGE.match(new RegExp(`const ${nome}(?::[^=]+)?\\s*=\\s*([^;]+);`));
  if (!m) throw new Error(`a edge não declara ${nome} — o espelho sumiu`);
  const literal = m[1]
    .trim()
    .replace(/(\w+)\s*:/g, '"$1":')   // chaves sem aspas → JSON
    .replace(/'/g, '"')
    .replace(/,(\s*[}\]])/g, '$1');   // vírgula final
  return JSON.parse(literal);
}

describe('a lei do cofre vive num lugar só — engine × daily-digest', () => {
  it('antecedência por domínio não diverge', () => {
    expect(constanteDaEdge('LEAD_DAYS')).toEqual(LEAD_DAYS);
  });

  it('antecedência padrão não diverge', () => {
    expect(constanteDaEdge('LEAD_DEFAULT')).toBe(LEAD_DEFAULT);
  });

  it('limiar de ausência não diverge', () => {
    expect(constanteDaEdge('ABSENCE_THRESHOLD_DAYS')).toBe(ABSENCE_THRESHOLD_DAYS);
  });

  it('o que conta como toque de verdade não diverge', () => {
    expect(constanteDaEdge('SIGNIFICANT_EVENTS')).toEqual([...SIGNIFICANT_EVENTS]);
  });

  it('os 9 domínios da vida não divergem (canônico: config/raiz)', () => {
    expect(constanteDaEdge('DOMAINS')).toEqual(RAIZ_DOMAINS.map((d) => d.key));
  });

  it('a edge continua declarando o engine como canônico', () => {
    // se alguém apagar o aviso, o próximo a mexer não vai saber de onde copia
    expect(EDGE).toMatch(/engine\/vault/);
  });
});

describe('a memória do raro vive num lugar só — engine/digest × daily-digest', () => {
  it('os degraus de validade não divergem', () => {
    expect(constanteDaEdge('EXPIRY_BANDS')).toEqual({ ...EXPIRY_BANDS });
  });

  it('o degrau da ausência não diverge', () => {
    expect(constanteDaEdge('ABSENCE_STEP_DAYS')).toBe(ABSENCE_STEP_DAYS);
  });

  it('a edge declara engine/digest como canônico', () => {
    expect(EDGE).toMatch(/engine\/digest/);
  });
});
