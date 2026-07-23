// engine/routine.test.ts — a cadeia (Fase 6)
import { describe, it, expect } from 'vitest';
import { readRoutineBody, routinesForSlot, chainProgress, listRoutines } from './routine';
import type { AtomItem, AtomStatus, AtomType } from '@/types/item';

let seq = 0;
function item(over: Partial<AtomItem> & { type: AtomType }): AtomItem {
  return {
    id: over.id ?? `i${++seq}`,
    user_id: 'u1',
    title: over.title ?? 'x',
    module: 'body',
    tags: [],
    status: (over.status ?? 'active') as AtomStatus,
    state: over.state ?? 'structured',
    genesis_stage: 3,
    project_id: null,
    naming_convention: null,
    notes: null,
    body: over.body ?? {},
    source: 'mindroot',
    created_at: '2026-07-24T00:00:00Z',
    updated_at: '2026-07-24T00:00:00Z',
    created_by: null,
    ...over,
  } as AtomItem;
}

const agua = item({ id: 'agua', type: 'habit', status: 'completed' });
const treino = item({ id: 'treino', type: 'habit' });
const sol = item({ id: 'sol', type: 'habit' });
const rotina = item({
  id: 'rot', type: 'routine', title: 'pausa do meio-dia',
  body: { chain: ['agua', 'treino', 'sol'], slot: 'zenite' },
});

describe('readRoutineBody', () => {
  it('reads chain and slot, tolerating garbage', () => {
    expect(readRoutineBody(rotina)).toEqual({ chain: ['agua', 'treino', 'sol'], slot: 'zenite' });
    expect(readRoutineBody(item({ type: 'routine', body: { slot: 'invalid' } }))).toEqual({ chain: [], slot: null });
  });
});

describe('routinesForSlot / listRoutines', () => {
  it('filters by type, slot and archive state', () => {
    const archived = item({ type: 'routine', status: 'archived', body: { chain: [], slot: 'zenite' } });
    const all = [rotina, archived, agua];
    expect(listRoutines(all)).toEqual([rotina]);
    expect(routinesForSlot(all, 'zenite')).toEqual([rotina]);
    expect(routinesForSlot(all, 'aurora')).toEqual([]);
  });
});

describe('chainProgress', () => {
  const pool = [rotina, agua, treino, sol];

  it('keeps chain order and finds the next open link', () => {
    const p = chainProgress(rotina, pool);
    expect(p.links.map((l) => l.item.id)).toEqual(['agua', 'treino', 'sol']);
    expect(p.done).toBe(1);
    expect(p.total).toBe(3);
    expect(p.complete).toBe(false);
    expect(p.next?.id).toBe('treino');
  });

  it('is complete when every link is done', () => {
    const allDone = pool.map((i) => (i.type === 'habit' ? { ...i, status: 'completed' as const } : i));
    const p = chainProgress(rotina, allDone);
    expect(p.complete).toBe(true);
    expect(p.next).toBeNull();
  });

  it('ignores deleted/archived links — the chain is what exists today', () => {
    const p = chainProgress(rotina, [rotina, agua, { ...sol, status: 'archived' as const }]);
    expect(p.links.map((l) => l.item.id)).toEqual(['agua']);
    expect(p.complete).toBe(true);
  });

  it('an empty chain is never complete', () => {
    const empty = item({ type: 'routine', body: { chain: [], slot: 'zenite' } });
    expect(chainProgress(empty, pool).complete).toBe(false);
  });

  it('sealed mirrors the routine own status', () => {
    expect(chainProgress({ ...rotina, status: 'completed' as const }, pool).sealed).toBe(true);
  });
});
