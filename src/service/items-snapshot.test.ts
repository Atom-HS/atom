// service/items-snapshot.test.ts — o tronco de bolso prova que segura (D55)
// A dissecação 04 achou a MENTE: o snapshot existia, mas o caminho que o
// leria era inalcançável — o fetch sem rede pendura sem rejeitar. Estes
// testes seguram as duas pontas: o bolso guarda/lê de verdade, e o prazo
// materializa a falha que a rede esconde.
import { describe, it, expect, beforeEach } from 'vitest';
import { saveItemsSnapshot, loadItemsSnapshot, comPrazo } from './items-snapshot';
import type { AtomItem } from '@/types/item';

const item = (id: string): AtomItem =>
  ({
    id, title: `item ${id}`, user_id: 'u1', type: 'task', module: 'work',
    tags: [], status: 'active', state: 'structured', genesis_stage: 3,
    project_id: null, naming_convention: null, notes: null, body: {},
    source: 'mindroot', created_by: 'u1',
    created_at: '2026-07-30T10:00:00Z', updated_at: '2026-07-30T10:00:00Z',
  }) as AtomItem;

beforeEach(() => localStorage.clear());

describe('o bolso guarda e devolve', () => {
  it('roundtrip: o que se salva é o que se lê, por usuário', () => {
    saveItemsSnapshot('u1', [item('a'), item('b')]);
    saveItemsSnapshot('u2', [item('c')]);
    expect(loadItemsSnapshot('u1')?.map((i) => i.id)).toEqual(['a', 'b']);
    expect(loadItemsSnapshot('u2')?.map((i) => i.id)).toEqual(['c']);
  });

  it('bolso vazio devolve null, nunca lista fantasma', () => {
    expect(loadItemsSnapshot('ninguem')).toBeNull();
  });

  it('bolso corrompido devolve null sem derrubar a boca', () => {
    localStorage.setItem('mindroot.items-snapshot.v1.u1', '{nem-json');
    expect(loadItemsSnapshot('u1')).toBeNull();
    localStorage.setItem('mindroot.items-snapshot.v1.u1', '{"nao":"array"}');
    expect(loadItemsSnapshot('u1')).toBeNull();
  });
});

describe('comPrazo — a promessa que não responde perde pro bolso', () => {
  it('resposta rápida passa inteira', async () => {
    await expect(comPrazo(Promise.resolve(42), 50)).resolves.toBe(42);
  });

  it('erro real passa como erro (o bolso decide depois)', async () => {
    await expect(comPrazo(Promise.reject(new Error('caiu')), 50)).rejects.toThrow('caiu');
  });

  it('promessa eterna vira erro no prazo — a MENTE da dissecação 04 morta', async () => {
    const eterna = new Promise<never>(() => {});
    await expect(comPrazo(eterna, 30)).rejects.toThrow('a rede não respondeu');
  });
});
