// engine/today.test.ts — o que cabe agora (Onda 3)
import { describe, it, expect } from 'vitest';
import { candidatesNow, rankNow, suggestNow } from './today';
import type { AtomItem, AtomStatus, AtomType } from '@/types/item';

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

const TODAY = '2026-07-26T09:00:00Z';

function ops(due_date: string) {
  return {
    operations: {
      priority: null, deadline: null, due_date,
      project_status: null, progress_mode: null, progress: null,
    },
  };
}

describe('candidatesNow', () => {
  it('só task/habit ativos, nunca fixos de calendário', () => {
    const task = item({ id: 't', type: 'task' });
    const done = item({ type: 'task', status: 'completed' });
    const note = item({ type: 'note' });
    const fixo = item({ type: 'task', body: { start: '2026-07-26T09:00:00Z' } });
    expect(candidatesNow([task, done, note, fixo]).map((i) => i.id)).toEqual(['t']);
  });
});

describe('rankNow', () => {
  it('vencido → pra hoje → mais antigo', () => {
    const antigo = item({ id: 'antigo', type: 'task', created_at: '2026-07-01T00:00:00Z' });
    const novo = item({ id: 'novo', type: 'task', created_at: '2026-07-25T00:00:00Z' });
    const hoje = item({ id: 'hoje', type: 'task', body: ops('2026-07-26') });
    const vencido = item({ id: 'vencido', type: 'task', body: ops('2026-07-24') });
    expect(rankNow([novo, hoje, antigo, vencido], TODAY).map((i) => i.id))
      .toEqual(['vencido', 'hoje', 'antigo', 'novo']);
  });
});

describe('suggestNow', () => {
  it('devolve UMA sugestão com porquê', () => {
    const hoje = item({ id: 'h', type: 'task', title: 'responder willi', body: ops('2026-07-26') });
    const s = suggestNow([hoje], TODAY);
    expect(s?.item.id).toBe('h');
    expect(s?.reason).toContain('hoje');
    expect(s?.reason).toContain('ainda dá'); // sem-shame por construção
  });

  it('"me dá outra" caminha o rank, circular', () => {
    const a = item({ id: 'a', type: 'task', created_at: '2026-07-01T00:00:00Z' });
    const b = item({ id: 'b', type: 'task', created_at: '2026-07-10T00:00:00Z' });
    expect(suggestNow([a, b], TODAY, 0)?.item.id).toBe('a');
    expect(suggestNow([a, b], TODAY, 1)?.item.id).toBe('b');
    expect(suggestNow([a, b], TODAY, 2)?.item.id).toBe('a');
  });

  it('quieto há 8+ dias fala a idade sem cobrar', () => {
    const velho = item({ type: 'task', created_at: '2026-07-10T00:00:00Z' });
    expect(suggestNow([velho], TODAY)?.reason).toContain('16 dias');
    expect(suggestNow([velho], TODAY)?.reason).not.toMatch(/atrasad|deveria|falhou/);
  });

  it('vazio devolve null (nunca inventa urgência)', () => {
    expect(suggestNow([item({ type: 'note' })], TODAY)).toBeNull();
  });
});
