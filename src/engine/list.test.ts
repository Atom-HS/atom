// engine/list.test.ts — a lista Keep-style (Fase 8)
import { describe, it, expect } from 'vitest';
import { readListBody, listLists, listSummary, toggleEntry, addEntry, removeEntry } from './list';
import type { AtomItem, AtomStatus, AtomType } from '@/types/item';

let seq = 0;
function item(over: Partial<AtomItem> & { type: AtomType }): AtomItem {
  return {
    id: over.id ?? `i${++seq}`,
    user_id: 'u1',
    title: over.title ?? 'x',
    module: 'mind',
    tags: [],
    status: (over.status ?? 'active') as AtomStatus,
    state: over.state ?? 'classified',
    genesis_stage: 2,
    project_id: null,
    naming_convention: null,
    notes: null,
    body: over.body ?? {},
    source: 'mindroot',
    created_at: '2026-07-25T00:00:00Z',
    updated_at: '2026-07-25T00:00:00Z',
    created_by: null,
    ...over,
  } as AtomItem;
}

const compra = item({
  id: 'l1', type: 'list', title: 'compra da semana',
  body: { entries: [{ text: 'leite', done: true }, { text: 'pão', done: false }, { text: 'café', done: false }] },
});

describe('readListBody', () => {
  it('reads entries, tolerating garbage', () => {
    expect(readListBody(compra).entries).toHaveLength(3);
    const suja = item({ type: 'list', body: { entries: ['leite', { done: true }, { text: 'ok' }, null] } });
    expect(readListBody(suja).entries).toEqual([{ text: 'ok', done: false }]);
    expect(readListBody(item({ type: 'list' })).entries).toEqual([]);
  });
});

describe('listLists / listSummary', () => {
  it('filters by type and archive state', () => {
    const dead = item({ type: 'list', status: 'archived' });
    expect(listLists([compra, dead, item({ type: 'task' })])).toEqual([compra]);
  });

  it('summarizes open state, ✓ when all done, null when empty', () => {
    expect(listSummary(compra)).toBe('2 de 3');
    const feita = item({ type: 'list', body: { entries: [{ text: 'leite', done: true }] } });
    expect(listSummary(feita)).toBe('1 ✓');
    expect(listSummary(item({ type: 'list' }))).toBeNull();
  });
});

describe('mutações puras', () => {
  it('toggleEntry flips one entry without touching the rest', () => {
    const next = toggleEntry(compra, 1);
    expect(next.entries.map((e) => e.done)).toEqual([true, true, false]);
    expect(readListBody(compra).entries[1].done).toBe(false); // original intocado
  });

  it('addEntry trims and ignores empty text', () => {
    expect(addEntry(compra, '  ovos  ').entries).toHaveLength(4);
    expect(addEntry(compra, '   ').entries).toHaveLength(3);
  });

  it('removeEntry drops by index', () => {
    expect(removeEntry(compra, 0).entries.map((e) => e.text)).toEqual(['pão', 'café']);
  });
});
