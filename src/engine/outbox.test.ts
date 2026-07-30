// engine/outbox.test.ts — a fila do avô (Onda 3 · D55)
import { describe, it, expect } from 'vitest';
import {
  bornItemId,
  entryFromReading,
  parseQueue,
  rememberItem,
  serializeQueue,
  type OutboxEntry,
} from './outbox';
import { readMouth } from './mouth';

const AT = '2026-07-28T09:00:00.000Z';

describe('entryFromReading', () => {
  it('sinto: vira entrada soul', () => {
    const e = entryFromReading(readMouth('sinto: cansado, mas leve'), 'o1', AT);
    expect(e).toMatchObject({ kind: 'soul', emotion: 'cansado', id: 'o1', at: AT });
  });

  it('lista: vira entrada list com nome e entries', () => {
    const e = entryFromReading(readMouth('lista mercado: leite, pão'), 'o2', AT);
    expect(e).toMatchObject({ kind: 'list', name: 'mercado', entries: ['leite', 'pão'] });
  });

  it('captura preserva tokens explícitos', () => {
    const e = entryFromReading(readMouth('pagar seguro #work @task'), 'o3', AT);
    expect(e).toMatchObject({ kind: 'capture', module: 'work', type: 'task', hasTokens: true });
  });

  it('captura simples nasce sem tokens', () => {
    const e = entryFromReading(readMouth('comprar leite'), 'o4', AT);
    expect(e).toMatchObject({ kind: 'capture', title: 'comprar leite', hasTokens: false });
  });
});

describe('parseQueue / serializeQueue', () => {
  const soul = entryFromReading(readMouth('sinto: grato'), 'a', AT);
  const cap = entryFromReading(readMouth('trocar pneu'), 'b', AT);

  it('roundtrip preserva a fila', () => {
    expect(parseQueue(serializeQueue([soul, cap]))).toEqual([soul, cap]);
  });

  it('null e JSON quebrado viram fila vazia', () => {
    expect(parseQueue(null)).toEqual([]);
    expect(parseQueue('{nope')).toEqual([]);
    expect(parseQueue('"string"')).toEqual([]);
  });

  it('entrada inválida cai fora, o resto vive', () => {
    const sujo = JSON.stringify([soul, { kind: 'capture' }, 42, cap]);
    expect(parseQueue(sujo)).toEqual([soul, cap]);
  });

  it('versão desconhecida cai fora', () => {
    const v2 = { ...cap, v: 2 } as unknown as OutboxEntry;
    expect(parseQueue(serializeQueue([v2, soul]))).toEqual([soul]);
  });
});

// A mentira que a dissecação 01 achou: a fila que existe pra NÃO perder
// passava a duplicar quando o selo falhava depois da captura.
describe('memória do que já nasceu — a retomada sela, não recaptura', () => {
  const cap = entryFromReading(readMouth('pagar contador #work @task'), 'b', AT);
  const lista = entryFromReading(readMouth('lista feira: manga'), 'c', AT);
  const soul = entryFromReading(readMouth('sinto: leve'), 'a', AT);

  it('entrada nova ainda não nasceu', () => {
    expect(bornItemId(cap)).toBeNull();
    expect(bornItemId(lista)).toBeNull();
  });

  it('lembrar o ponto preserva o resto da entrada', () => {
    const lembrada = rememberItem(cap, 'item-42');
    expect(bornItemId(lembrada)).toBe('item-42');
    expect(lembrada).toMatchObject({ title: 'pagar contador', type: 'task', module: 'work', hasTokens: true });
  });

  it('lista também lembra (o caminho que criava lista dobrada)', () => {
    expect(bornItemId(rememberItem(lista, 'item-7'))).toBe('item-7');
  });

  it('alma não cria ponto — passa reto e nunca finge id', () => {
    expect(rememberItem(soul, 'item-9')).toEqual(soul);
    expect(bornItemId(soul)).toBeNull();
  });

  it('a memória sobrevive ao roundtrip (é ela que atravessa a janela de rede)', () => {
    const lembrada = rememberItem(cap, 'item-42');
    expect(parseQueue(serializeQueue([lembrada]))).toEqual([lembrada]);
  });

  it('memória corrompida derruba a entrada — selar o item errado é pior que recapturar', () => {
    const sujo = JSON.stringify([{ ...cap, itemId: 42 }, soul]);
    expect(parseQueue(sujo)).toEqual([soul]);
  });
});
