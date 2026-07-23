// engine/__test__/meaning.test.ts — a escada de meaning (Fase 4)
import { describe, it, expect } from 'vitest';
import { nextAvailableReview, uncoveredFor, LADDER } from '../meaning';
import type { AtomItem } from '@/types/item';

let seq = 0;
function item(partial: Partial<AtomItem>): AtomItem {
  seq += 1;
  return {
    id: `id-${seq}`,
    user_id: 'u1',
    title: partial.title ?? `item ${seq}`,
    type: null,
    module: null,
    tags: [],
    status: 'completed',
    state: 'committed',
    genesis_stage: 7,
    project_id: null,
    naming_convention: null,
    notes: null,
    body: {},
    source: 'mindroot',
    created_by: null,
    created_at: `2026-07-${String(10 + seq).padStart(2, '0')}T10:00:00Z`,
    updated_at: `2026-07-${String(10 + seq).padStart(2, '0')}T10:00:00Z`,
    ...partial,
  } as AtomItem;
}

const wrap = () => item({ type: 'wrap' });
const review = (cadence: string, reads: string[]) =>
  item({ type: 'review', body: { cadence, reads } });

describe('escada de meaning (§2.4)', () => {
  it('dorme sem material: 6 wraps não acordam a semanal', () => {
    const items = Array.from({ length: 6 }, wrap);
    expect(nextAvailableReview(items)).toBeNull();
  });

  it('7 wraps acordam a review semanal', () => {
    const items = Array.from({ length: 7 }, wrap);
    const next = nextAvailableReview(items);
    expect(next?.rung.key).toBe('week');
    expect(next?.reads).toHaveLength(7);
  });

  it('review perdida não quebra: o ACUMULADO é oferecido (regra 2)', () => {
    const items = Array.from({ length: 12 }, wrap);
    const next = nextAvailableReview(items);
    expect(next?.reads).toHaveLength(12); // tudo, não só 7
  });

  it('wraps já sintetizados não contam de novo', () => {
    const wraps = Array.from({ length: 7 }, wrap);
    const weekly = review('week', wraps.map((w) => w.id));
    const items = [...wraps, weekly, wrap(), wrap()];
    expect(nextAvailableReview(items)).toBeNull(); // só 2 descobertos
    expect(uncoveredFor(items, LADDER[0])).toHaveLength(2);
  });

  it('cada nível lê APENAS o nível abaixo: 4 semanais acordam a mensal', () => {
    const weeklies = Array.from({ length: 4 }, () => review('week', []));
    const next = nextAvailableReview(weeklies);
    expect(next?.rung.key).toBe('month');
    expect(next?.reads).toHaveLength(4);
  });

  it('o degrau mais baixo tem prioridade (um convite por vez)', () => {
    const wraps = Array.from({ length: 7 }, wrap);
    const weeklies = Array.from({ length: 4 }, () => review('week', []));
    const next = nextAvailableReview([...wraps, ...weeklies]);
    expect(next?.rung.key).toBe('week'); // semana antes do mês
  });

  it('a espiral sobe até o ano (2 semestrais)', () => {
    const semesters = Array.from({ length: 2 }, () => review('semester', []));
    const next = nextAvailableReview(semesters);
    expect(next?.rung.key).toBe('year');
  });

  it('mensais lidas não re-acordam o mês', () => {
    const weeklies = Array.from({ length: 4 }, () => review('week', []));
    const monthly = review('month', weeklies.map((w) => w.id));
    expect(nextAvailableReview([...weeklies, monthly])).toBeNull();
  });
});
