import { describe, expect, it } from 'vitest';
import { comLeitura, leituraPronta } from './esteira';
import type { AtomItem } from '@/types/item';

function item(partial: Partial<AtomItem>): AtomItem {
  return {
    id: 'x',
    user_id: 'u',
    title: 't',
    type: null,
    module: null,
    tags: [],
    status: 'inbox',
    state: 'inbox',
    genesis_stage: 1,
    project_id: null,
    naming_convention: null,
    notes: null,
    body: {},
    source: null,
    created_at: '2026-08-01T00:00:00Z',
    updated_at: '2026-08-01T00:00:00Z',
    created_by: null,
    ...partial,
  };
}

describe('esteira — leituraPronta (D69: nada decide quieto)', () => {
  it('captura crua (sem type) não tem leitura — fica no um-a-um', () => {
    expect(leituraPronta(item({ type: null }))).toBeNull();
  });

  it('item de conector chega lido: type + module', () => {
    expect(leituraPronta(item({ type: 'ritual', module: 'purpose' }))).toEqual({
      type: 'ritual',
      module: 'purpose',
    });
  });

  it('leitura sem galho cai em bridge — o mesmo default do card', () => {
    expect(leituraPronta(item({ type: 'note' }))).toEqual({ type: 'note', module: 'bridge' });
  });

  it('comLeitura separa o bloco do um-a-um', () => {
    const fila = [item({ id: 'a', type: 'task' }), item({ id: 'b' }), item({ id: 'c', type: 'note' })];
    expect(comLeitura(fila).map((i) => i.id)).toEqual(['a', 'c']);
  });
});
