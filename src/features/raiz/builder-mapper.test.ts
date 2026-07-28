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
