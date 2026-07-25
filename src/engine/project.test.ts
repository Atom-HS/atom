// engine/project.test.ts — o contêiner relacional (Fase 8)
import { describe, it, expect } from 'vitest';
import { listProjects, projectChildren, projectPresence, presenceLine } from './project';
import type { AtomItem, AtomStatus, AtomType, ItemConnection } from '@/types/item';

let seq = 0;
function item(over: Partial<AtomItem> & { type: AtomType }): AtomItem {
  return {
    id: over.id ?? `i${++seq}`,
    user_id: 'u1',
    title: over.title ?? 'x',
    module: 'work',
    tags: [],
    status: (over.status ?? 'active') as AtomStatus,
    state: over.state ?? 'structured',
    genesis_stage: 3,
    project_id: null,
    naming_convention: null,
    notes: null,
    body: over.body ?? {},
    source: 'mindroot',
    created_at: over.created_at ?? '2026-07-20T00:00:00Z',
    updated_at: over.updated_at ?? '2026-07-20T00:00:00Z',
    created_by: null,
    ...over,
  } as AtomItem;
}

let cseq = 0;
function belongsTo(sourceId: string, targetId: string): ItemConnection {
  return {
    id: `c${++cseq}`,
    user_id: 'u1',
    source_id: sourceId,
    target_id: targetId,
    relation: 'belongs_to',
    note: null,
    created_at: '2026-07-20T00:00:00Z',
  };
}

const now = new Date('2026-07-25T12:00:00Z');
const proj = item({ id: 'p1', type: 'project', title: 'obra', updated_at: '2026-07-24T00:00:00Z' });
const a = item({ id: 'a', type: 'task', created_at: '2026-07-01T00:00:00Z', updated_at: '2026-07-24T10:00:00Z' });
const b = item({ id: 'b', type: 'task', created_at: '2026-07-10T00:00:00Z' });
const c = item({ id: 'c', type: 'task', status: 'completed' });
const pool = [proj, a, b, c];
const conns = [belongsTo('a', 'p1'), belongsTo('b', 'p1'), belongsTo('c', 'p1')];

describe('listProjects', () => {
  it('filters by type and archive state', () => {
    const dead = item({ type: 'project', status: 'archived' });
    expect(listProjects([proj, dead, a])).toEqual([proj]);
  });
});

describe('projectChildren', () => {
  it('resolves children via belongs_to only — project_id is never read', () => {
    const viaFk = item({ id: 'fk', type: 'task', project_id: 'p1' });
    expect(projectChildren(proj, [...pool, viaFk], conns).map((i) => i.id)).toEqual(['a', 'b', 'c']);
  });

  it('ignores archived children and other relations', () => {
    const dead = item({ id: 'd', type: 'task', status: 'archived' });
    const ref: ItemConnection = { ...belongsTo('a', 'p1'), id: 'cx', relation: 'references' };
    expect(projectChildren(proj, [...pool, dead], [...conns, belongsTo('d', 'p1'), ref]).map((i) => i.id))
      .toEqual(['a', 'b', 'c']);
  });
});

describe('projectPresence', () => {
  it('derives open/done and the oldest open child as next', () => {
    const p = projectPresence(proj, pool, conns, now);
    expect(p.total).toBe(3);
    expect(p.done).toBe(1);
    expect(p.open.map((i) => i.id)).toEqual(['a', 'b']);
    expect(p.next?.id).toBe('a');
  });

  it('tracks the last touch across project and children', () => {
    const p = projectPresence(proj, pool, conns, now);
    expect(p.lastTouch).toBe('2026-07-24T10:00:00Z');
    expect(p.quietDays).toBe(1);
  });
});

describe('presenceLine', () => {
  it('speaks state, not metric', () => {
    expect(presenceLine(projectPresence(proj, pool, conns, now))).toBe('2 de 3 abertos');
  });

  it('empty project names the law', () => {
    const empty = item({ id: 'p2', type: 'project', updated_at: '2026-07-25T00:00:00Z' });
    expect(presenceLine(projectPresence(empty, [empty], [], now))).toContain('vazio');
  });

  it('all sealed shows the circle', () => {
    const sealed = pool.map((i) => (i.type === 'task' ? { ...i, status: 'completed' as const } : i));
    expect(presenceLine(projectPresence(proj, sealed, conns, now))).toBe('3 items selados ○');
  });

  it('quietude appears from the 8th day (first φ step), gently', () => {
    const later = new Date('2026-08-05T12:00:00Z'); // 12 dias após o último toque
    expect(presenceLine(projectPresence(proj, pool, conns, later))).toBe('2 de 3 abertos · quieto há 12 dias');
    expect(presenceLine(projectPresence(proj, pool, conns, now))).not.toContain('quieto');
  });
});
