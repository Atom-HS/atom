// engine/fixos.test.ts — o hoje nunca mente (obra 7, etapa 3)
import { describe, it, expect } from 'vitest';
import { fixosOfDay, localDayKey } from './fixos';
import type { AtomItem } from '@/types/item';

// meio-dia local: date-only e datetime caem no mesmo dia em qualquer fuso
const NOW = new Date(2026, 6, 30, 12, 0, 0);
const DAY = localDayKey(NOW); // '2026-07-30'

function fixo(id: string, body: Record<string, unknown>, title = id): AtomItem {
  return {
    id, user_id: 'u1', title, type: 'task', module: 'bridge',
    tags: ['#connector'], status: 'inbox', state: 'inbox', genesis_stage: 1,
    project_id: null, naming_convention: null, notes: null, body,
    source: 'atom-engine', created_at: '2026-07-29T08:00:00+10:00',
    updated_at: '2026-07-29T08:00:00+10:00', created_by: null,
  };
}

function at(hour: number, min = 0): string {
  return new Date(2026, 6, 30, hour, min).toISOString();
}

describe('fixosOfDay — o que pertence ao dia', () => {
  it('evento com hora de hoje entra; de outro dia não', () => {
    const hoje = fixo('a', { start: at(10), end: at(11) });
    const amanha = fixo('b', { start: new Date(2026, 6, 31, 10).toISOString() });
    const result = fixosOfDay([hoje, amanha], NOW);
    expect(result.map((f) => f.item.id)).toEqual(['a']);
  });

  it('all-day date-only não desliza de dia (comparação de string, nunca Date)', () => {
    const allDay = fixo('a', { start: DAY, end: '2026-07-31', all_day: true });
    const result = fixosOfDay([allDay], NOW);
    expect(result).toHaveLength(1);
    expect(result[0].allDay).toBe(true);
  });

  it('all-day multi-dia cobre o meio (fim exclusivo, como o Google manda)', () => {
    const viagem = fixo('a', { start: '2026-07-29', end: '2026-08-01', all_day: true });
    expect(fixosOfDay([viagem], NOW)).toHaveLength(1);
    // fim exclusivo: evento que termina hoje não é de hoje
    const acabou = fixo('b', { start: '2026-07-28', end: DAY, all_day: true });
    expect(fixosOfDay([acabou], NOW)).toHaveLength(0);
  });

  it('item sem body.start não é fixo', () => {
    const solto = fixo('a', {});
    expect(fixosOfDay([solto], NOW)).toHaveLength(0);
  });
});

describe('fixosOfDay — ordem e leitura', () => {
  it('all-day vem primeiro, depois por hora', () => {
    const tarde = fixo('tarde', { start: at(15), end: at(16) });
    const manha = fixo('manha', { start: at(9), end: at(10) });
    const diaTodo = fixo('dia', { start: DAY, all_day: true });
    const result = fixosOfDay([tarde, manha, diaTodo], NOW);
    expect(result.map((f) => f.item.id)).toEqual(['dia', 'manha', 'tarde']);
  });

  it('all_day true no body marca allDay mesmo com datetime no start', () => {
    const f = fixo('a', { start: at(0), end: at(23, 59), all_day: true });
    expect(fixosOfDay([f], NOW)[0].allDay).toBe(true);
  });
});

describe('fixosOfDay — conflito é estado, nunca alarme', () => {
  it('dois com hora cruzando se apontam pelo título', () => {
    const a = fixo('a', { start: at(10), end: at(11, 30) }, 'Consulta');
    const b = fixo('b', { start: at(11), end: at(12) }, 'Standup');
    const result = fixosOfDay([a, b], NOW);
    expect(result[0].conflictsWith).toEqual(['Standup']);
    expect(result[1].conflictsWith).toEqual(['Consulta']);
  });

  it('encostados (10–11 / 11–12) não cruzam', () => {
    const a = fixo('a', { start: at(10), end: at(11) });
    const b = fixo('b', { start: at(11), end: at(12) });
    const result = fixosOfDay([a, b], NOW);
    expect(result[0].conflictsWith).toEqual([]);
    expect(result[1].conflictsWith).toEqual([]);
  });

  it('all-day nunca conflita (não é bloco duro)', () => {
    const dia = fixo('dia', { start: DAY, all_day: true });
    const hora = fixo('hora', { start: at(10), end: at(11) });
    const result = fixosOfDay([dia, hora], NOW);
    expect(result.every((f) => f.conflictsWith.length === 0)).toBe(true);
  });

  it('sem end (duração zero) só cruza no mesmo instante', () => {
    const a = fixo('a', { start: at(10) });
    const b = fixo('b', { start: at(10) }, 'Gemeo');
    const c = fixo('c', { start: at(10, 30) });
    const result = fixosOfDay([a, b, c], NOW);
    const byId = Object.fromEntries(result.map((f) => [f.item.id, f]));
    expect(byId['a'].conflictsWith).toEqual(['Gemeo']);
    expect(byId['c'].conflictsWith).toEqual([]);
  });
});
