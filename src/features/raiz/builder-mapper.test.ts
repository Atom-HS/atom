// features/raiz/builder-mapper.test.ts — a entrevista pare estruturas (D64)
import { describe, expect, it } from 'vitest';
import { generateStructures, protocolToPayload, routineToPayload } from './builder-mapper';
import type { BuilderAnswer } from './builder-types';

describe('generateStructures — cadeia', () => {
  it('2+ elos recorrentes parem UMA cadeia com os elos na chain', () => {
    const answers: BuilderAnswer[] = [
      { questionId: 'body-2', value: 'caminhada' },
      { questionId: 'body-3', value: '3' },          // habit: caminhada 3x/semana
      { questionId: 'body-4', value: '06:30 acordar — 22:30 dormir' }, // 2 rituais
    ];
    const { routine, items } = generateStructures(answers, 'body');
    expect(routine).not.toBeNull();
    expect(routine!.title).toBe('cadeia de corpo');
    expect(routine!.eloTempIds.length).toBeGreaterThanOrEqual(2);
    expect(routine!.eloTempIds.every((t) => items.some((i) => i.tempId === t))).toBe(true);
  });

  it('1 elo só NÃO pare cadeia — hábito solto é hábito (piso mínimo)', () => {
    const answers: BuilderAnswer[] = [
      { questionId: 'body-2', value: 'yoga' },
      { questionId: 'body-3', value: '2' },
    ];
    const { routine } = generateStructures(answers, 'body');
    expect(routine).toBeNull();
  });
});

describe('generateStructures — protocolo', () => {
  it('a pergunta-condição pare protocolo com passos separados', () => {
    const answers: BuilderAnswer[] = [
      { questionId: 'mind-7', value: '3 respirações, caminhar 5 min e escrever o que pesa' },
    ];
    const { protocol, items } = generateStructures(answers, 'mind');
    expect(protocol).not.toBeNull();
    expect(protocol!.title).toBe('quando a cabeça acelera');
    expect(protocol!.steps).toEqual(['3 respirações', 'caminhar 5 min', 'escrever o que pesa']);
    // a resposta-condição NÃO vira item solto
    expect(items.some((i) => i.title.includes('respirações'))).toBe(false);
  });

  it('resposta vazia não pare protocolo (piso mínimo)', () => {
    const { protocol } = generateStructures([{ questionId: 'work-7', value: '   ' }], 'work');
    expect(protocol).toBeNull();
  });
});

// O mapa do parto (cirurgia da dissecação 02): cada módulo inteiro,
// entrada → itens esperados, tipo a tipo. O inferType antigo testava
// substrings que nunca batiam — a meta financeira nascia «Habito».
describe('o mapa do parto — módulo a módulo', () => {
  it('finanças: a meta do ano nasce TASK e o resto é contexto — nada mais nasce', () => {
    const answers: BuilderAnswer[] = [
      { questionId: 'finance-1', value: true },
      { questionId: 'finance-2', value: 'app' },
      { questionId: 'finance-3', value: 'guardar 20 mil este ano' },
      { questionId: 'finance-4', value: 'monthly' },
    ];
    const { items, routine, protocol } = generateStructures(answers, 'finance');
    expect(items.map((i) => [i.title, i.type])).toEqual([
      ['guardar 20 mil este ano', 'task'],
    ]);
    expect(routine).toBeNull();
    expect(protocol).toBeNull();
  });

  it('família: ritual nasce ritual, com-quem-mora é contexto, elo+frequência pare o habit', () => {
    const answers: BuilderAnswer[] = [
      { questionId: 'family-1', value: true },
      { questionId: 'family-2', value: 'Ana e os meninos' },
      { questionId: 'family-3', value: 'jantar junto' },
      { questionId: 'family-4', value: 'minha mãe' },
      { questionId: 'family-5', value: '2' },
    ];
    const { items } = generateStructures(answers, 'family');
    expect(items.map((i) => [i.title, i.type])).toEqual([
      ['jantar junto', 'ritual'],
      ['minha mãe', 'habit'],
    ]);
    // a resposta-contexto NÃO vira item (MANCA 4)
    expect(items.some((i) => i.title.includes('Ana'))).toBe(false);
  });

  it('trabalho: bloco de foco e reuniões nascem ritual; projeto e despejo são contexto', () => {
    const answers: BuilderAnswer[] = [
      { questionId: 'work-1', value: 'atlas frames' },
      { questionId: 'work-2', value: true },
      { questionId: 'work-3', value: 'zenite' },
      { questionId: 'work-4', value: true },
      { questionId: 'work-5', value: 'standup diária' },
      { questionId: 'work-6', value: 'muita coisa ao mesmo tempo' },
      { questionId: 'work-7', value: 'levantar, beber água' },
    ];
    const { items, protocol } = generateStructures(answers, 'work');
    expect(items.map((i) => [i.title, i.type])).toEqual([
      ['Bloco de foco (zenite)', 'ritual'],
      ['standup diária', 'ritual'],
    ]);
    expect(protocol).not.toBeNull();
  });

  it('mente: leitura vira note, aprendizado vira habit, reflexão vira ritual, meta de aprender vira task', () => {
    const answers: BuilderAnswer[] = [
      { questionId: 'mind-1', value: true },
      { questionId: 'mind-2', value: 'O nome do vento' },
      { questionId: 'mind-3', value: 'podcast de história' },
      { questionId: 'mind-4', value: true },
      { questionId: 'mind-5', value: 'aurora' },
      { questionId: 'mind-6', value: 'aprender japonês' },
    ];
    const { items } = generateStructures(answers, 'mind');
    expect(items.map((i) => [i.title, i.type])).toEqual([
      ['O nome do vento', 'note'],
      ['podcast de história', 'habit'],
      ['Reflexão (aurora)', 'ritual'],
      ['aprender japonês', 'task'],
    ]);
  });

  it('elo pulado não vira título vazio — o habit nasce com nome honesto', () => {
    const answers: BuilderAnswer[] = [
      { questionId: 'family-4', value: '' },  // «pular essa»
      { questionId: 'family-5', value: '3' },
    ];
    const { items } = generateStructures(answers, 'family');
    expect(items).toHaveLength(1);
    expect(items[0].title).toBe('família 3x/semana');
    expect(items[0].type).toBe('habit');
  });
});

describe('payloads — tudo nasce no inbox (estágio 1)', () => {
  it('cadeia nasce inbox com chain de ids reais e slot', () => {
    const p = routineToPayload(
      { tempId: 't', title: 'cadeia de corpo', module: 'body', slot: 'aurora', eloTempIds: ['a', 'b'] },
      ['id-1', 'id-2'],
      'u1',
    );
    expect(p.type).toBe('routine');
    expect(p.genesis_stage).toBe(1);
    expect(p.state).toBe('inbox');
    expect(p.body.chain).toEqual(['id-1', 'id-2']);
    expect(p.body.slot).toBe('aurora');
  });

  it('protocolo nasce inbox, dorme por estado desafiador — nunca só horário', () => {
    const p = protocolToPayload(
      { tempId: 't', title: 'quando travar no trabalho', module: 'work', steps: ['levantar', 'água'] },
      'u1',
    );
    expect(p.type).toBe('protocol');
    expect(p.genesis_stage).toBe(1);
    expect(p.body.steps).toEqual(['levantar', 'água']);
    expect(p.body.when).toEqual({ emotion: null, challenging: true, energy: null, period: null });
  });
});
