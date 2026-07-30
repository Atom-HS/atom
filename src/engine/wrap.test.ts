// engine/wrap.test.ts — a Lei do Tom §4.4 se testa
// e_line: zero-ou-uma, nunca repetida (literal ou próxima).

import { describe, it, expect } from 'vitest';
import { normalizeELine, eLineRepeats, admitELine, pastELines } from './wrap';
import type { AtomItem } from '@/types/item';

describe('normalizeELine', () => {
  it('derruba caixa, acento e pontuação', () => {
    expect(normalizeELine('Sessão 8 — E. escolheu onde morar.')).toBe('sessao 8 e escolheu onde morar');
  });

  it('colapsa espaços', () => {
    expect(normalizeELine('  a   cadeia  testada ')).toBe('a cadeia testada');
  });
});

describe('eLineRepeats — "a frase boa é a que mais tenta voltar"', () => {
  const past = [
    'Sessão 8 — E. escolheu onde morar.',
    'A cadeia: humano → AI → AI. Testada uma vez. Faltam 26.',
  ];

  it('repetição literal reprova', () => {
    expect(eLineRepeats('Sessão 8 — E. escolheu onde morar.', past)).toBe(true);
  });

  it('literal disfarçada (caixa, pontuação, acento) reprova igual', () => {
    expect(eLineRepeats('sessao 8: E escolheu onde morar', past)).toBe(true);
  });

  it('próxima (uma palavra trocada) reprova', () => {
    expect(eLineRepeats('Sessão 9 — E. escolheu onde morar.', past)).toBe(true);
  });

  it('contida na antiga reprova', () => {
    expect(eLineRepeats('E. escolheu onde morar', past)).toBe(true);
  });

  it('frase nova passa', () => {
    expect(eLineRepeats('5 de 8 testes C completos. Próximo: Claude limpo.', past)).toBe(false);
  });

  it('sem passado, nada repete', () => {
    expect(eLineRepeats('qualquer frase', [])).toBe(false);
  });
});

describe('admitELine — zero-ou-uma; wrap sem e_line é wrap válido', () => {
  it('null e vazia viram null (zero é válido)', () => {
    expect(admitELine(null, [])).toBeNull();
    expect(admitELine(undefined, [])).toBeNull();
    expect(admitELine('   ', [])).toBeNull();
  });

  it('repetida morre no portão', () => {
    expect(admitELine('o ouro está aqui', ['O ouro está aqui.'])).toBeNull();
  });

  it('nova passa inteira, sem retoque', () => {
    expect(admitELine('44 registros. O ouro está aqui.', [])).toBe('44 registros. O ouro está aqui.');
  });
});

describe('pastELines — lê as que já viveram no tronco', () => {
  const wrapItem = (e_line: string | null): AtomItem =>
    ({
      id: 'w', type: 'wrap', title: 'Wrap',
      body: { wrap: { e_line } },
    } as unknown as AtomItem);

  it('coleta só as que existem', () => {
    const items = [
      wrapItem('primeira frase'),
      wrapItem(null),
      wrapItem('  '),
      { id: 'x', type: 'task', title: 't', body: {} } as unknown as AtomItem,
      wrapItem('segunda frase'),
    ];
    expect(pastELines(items)).toEqual(['primeira frase', 'segunda frase']);
  });
});
