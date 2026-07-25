// engine/protocol.test.ts — o procedimento condicional (Fase 7)
import { describe, it, expect } from 'vitest';
import {
  readProtocolBody,
  listProtocols,
  matchesWhen,
  readTodaySoul,
  evaluateProtocols,
  type MomentContext,
} from './protocol';
import type { AtomItem, AtomStatus, AtomType, EnergyLevel, ProtocolWhen } from '@/types/item';

let seq = 0;
function item(over: Partial<AtomItem> & { type: AtomType }): AtomItem {
  return {
    id: over.id ?? `i${++seq}`,
    user_id: 'u1',
    title: over.title ?? 'x',
    module: 'mind',
    tags: [],
    status: (over.status ?? 'active') as AtomStatus,
    state: over.state ?? 'structured',
    genesis_stage: 3,
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

function when(over: Partial<ProtocolWhen> = {}): ProtocolWhen {
  return { emotion: null, challenging: false, energy: null, period: null, ...over };
}

const ctx = (over: Partial<MomentContext> = {}): MomentContext => ({
  emotion: null,
  energy: null,
  period: 'zenite',
  ...over,
});

describe('readProtocolBody', () => {
  it('reads steps and when, tolerating garbage', () => {
    const p = item({
      type: 'protocol',
      body: { steps: ['respirar', 42, 'nomear'], when: { emotion: 'ansioso', energy: 'turbo', period: 'zenite' } },
    });
    expect(readProtocolBody(p)).toEqual({
      steps: ['respirar', 'nomear'],
      when: { emotion: 'ansioso', challenging: false, energy: null, period: 'zenite' },
    });
    expect(readProtocolBody(item({ type: 'protocol', body: { when: 'nope' } }))).toEqual({ steps: [], when: null });
  });
});

describe('listProtocols', () => {
  it('filters by type and archive state', () => {
    const vivo = item({ type: 'protocol' });
    const morto = item({ type: 'protocol', status: 'archived' });
    expect(listProtocols([vivo, morto, item({ type: 'task' })])).toEqual([vivo]);
  });
});

describe('matchesWhen', () => {
  it('manual-only (when null) never auto-fires', () => {
    expect(matchesWhen(null, ctx({ emotion: 'ansioso' }))).toBe(false);
  });

  it('period alone never wakes — a scheduled protocol would be a routine (D2)', () => {
    expect(matchesWhen(when({ period: 'zenite' }), ctx())).toBe(false);
  });

  it('matches emotion fold-compared (accents, case)', () => {
    expect(matchesWhen(when({ emotion: 'Ansioso' }), ctx({ emotion: 'ansioso' }))).toBe(true);
    expect(matchesWhen(when({ emotion: 'ansioso' }), ctx({ emotion: 'calmo' }))).toBe(false);
    expect(matchesWhen(when({ emotion: 'ansioso' }), ctx({ emotion: null }))).toBe(false);
  });

  it('challenging matches the known challenging vocabulary only', () => {
    expect(matchesWhen(when({ challenging: true }), ctx({ emotion: 'frustrado' }))).toBe(true);
    expect(matchesWhen(when({ challenging: true }), ctx({ emotion: 'grato' }))).toBe(false);
    expect(matchesWhen(when({ challenging: true }), ctx({ emotion: 'meio bosta' }))).toBe(false);
  });

  it('energy and period refine with AND semantics', () => {
    const w = when({ energy: 'low', period: 'zenite' });
    expect(matchesWhen(w, ctx({ energy: 'low', period: 'zenite' }))).toBe(true);
    expect(matchesWhen(w, ctx({ energy: 'low', period: 'aurora' }))).toBe(false);
    expect(matchesWhen(w, ctx({ energy: 'high', period: 'zenite' }))).toBe(false);
  });
});

describe('readTodaySoul', () => {
  const now = new Date('2026-07-25T12:00:00');
  const checkin = (id: string, created: string, emotion: string, energy: EnergyLevel | null = 'low') =>
    item({
      id,
      type: 'checkpoint',
      tags: ['checkin', 'aurora'],
      created_at: created,
      body: {
        soul: {
          emotion_before: emotion,
          emotion_after: null,
          energy_level: energy,
          needs_checkin: false,
          ritual_slot: 'aurora',
        },
      },
    });

  it('reads the latest check-in of the local day', () => {
    const aurora = checkin('a', '2026-07-25T05:00:00', 'ansioso');
    const telegram = checkin('t', '2026-07-25T11:00:00', 'meio bosta', null);
    expect(readTodaySoul([aurora, telegram], now)).toEqual({ emotion: 'meio bosta', energy: null });
  });

  it('ignores other days and non-checkin items', () => {
    const ontem = checkin('o', '2026-07-24T05:00:00', 'grato');
    expect(readTodaySoul([ontem, item({ type: 'task' })], now)).toEqual({ emotion: null, energy: null });
  });
});

describe('evaluateProtocols', () => {
  const ansiedade = item({
    id: 'p1', type: 'protocol', title: 'ansiedade bateu',
    body: { steps: ['respirar'], when: { emotion: 'ansioso' } },
  });
  const manual = item({
    id: 'p2', type: 'protocol', title: 'travado',
    body: { steps: ['timer'], when: null },
  });

  it('returns awakened protocols, never the manual-only ones', () => {
    expect(evaluateProtocols([ansiedade, manual], ctx({ emotion: 'ansioso' }))).toEqual([ansiedade]);
    expect(evaluateProtocols([ansiedade, manual], ctx({ emotion: 'calmo' }))).toEqual([]);
  });

  it('respects snoozed ids', () => {
    expect(evaluateProtocols([ansiedade], ctx({ emotion: 'ansioso' }), ['p1'])).toEqual([]);
  });
});
