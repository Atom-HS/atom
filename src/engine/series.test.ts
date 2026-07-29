// engine/series.test.ts — assentir uma vez vale pra série (ato III · DP-C)
import { describe, it, expect } from 'vitest';
import { birthOf, isSealed, sealedSeries, seriesIdOf } from './series';
import type { AtomItem } from '@/types/item';

function item(over: Partial<AtomItem> = {}): AtomItem {
  return {
    id: 'i1', user_id: 'u1', title: 'Reunião Operacional', type: 'ritual', module: 'bridge',
    tags: ['#connector', '#source:google-calendar'], status: 'inbox', state: 'inbox',
    genesis_stage: 1, project_id: null, naming_convention: null, notes: null,
    body: { recurring_event_id: 'serie-A' },
    source: 'atom-engine', created_at: '2026-07-20T08:00:00Z', updated_at: '2026-07-20T08:00:00Z',
    created_by: null, ...over,
  } as AtomItem;
}

const PADRAO = { type: 'ritual', module: 'bridge' } as const;

describe('seriesIdOf', () => {
  it('lê a série do corpo; evento único não tem', () => {
    expect(seriesIdOf(item())).toBe('serie-A');
    expect(seriesIdOf(item({ body: {} }))).toBeNull();
    expect(seriesIdOf(item({ body: { recurring_event_id: '' } }))).toBeNull();
  });
});

describe('isSealed — o humano passou por aqui', () => {
  it('sair do inbox é o sinal do selo', () => {
    expect(isSealed(item({ state: 'inbox' }))).toBe(false);
    expect(isSealed(item({ state: 'classified' }))).toBe(true);
    expect(isSealed(item({ state: 'structured' }))).toBe(true);
  });

  it('sem type não há leitura pra herdar', () => {
    expect(isSealed(item({ state: 'classified', type: null }))).toBe(false);
  });
});

describe('sealedSeries — a memória do assentimento', () => {
  it('instância que ainda espera não ensina nada', () => {
    expect(sealedSeries([item()]).size).toBe(0);
  });

  it('série assentida vira selo', () => {
    const selos = sealedSeries([item({ state: 'classified', type: 'task', module: 'work' })]);
    expect(selos.get('serie-A')).toEqual({ type: 'task', module: 'work' });
  });

  it('trocar de ideia manda: o assentimento mais recente vence', () => {
    const velho = item({ id: 'a', state: 'classified', type: 'ritual', module: 'bridge', updated_at: '2026-07-20T08:00:00Z' });
    const novo = item({ id: 'b', state: 'classified', type: 'task', module: 'work', updated_at: '2026-07-27T08:00:00Z' });
    expect(sealedSeries([velho, novo]).get('serie-A')).toEqual({ type: 'task', module: 'work' });
    // ordem de leitura não muda o resultado
    expect(sealedSeries([novo, velho]).get('serie-A')).toEqual({ type: 'task', module: 'work' });
  });

  it('arquivado não ensina — entropy não legisla', () => {
    expect(sealedSeries([item({ state: 'classified', status: 'archived' })]).size).toBe(0);
  });

  it('séries diferentes não se contaminam', () => {
    const a = item({ id: 'a', state: 'classified', type: 'ritual', body: { recurring_event_id: 'serie-A' } });
    const b = item({ id: 'b', state: 'classified', type: 'task', module: 'work', body: { recurring_event_id: 'serie-B' } });
    const selos = sealedSeries([a, b]);
    expect(selos.get('serie-A')?.type).toBe('ritual');
    expect(selos.get('serie-B')?.type).toBe('task');
  });

  it('evento único nunca vira série', () => {
    expect(sealedSeries([item({ state: 'classified', body: {} })]).size).toBe(0);
  });
});

describe('birthOf — como a instância nova nasce', () => {
  it('sem selo, espera o humano no inbox', () => {
    expect(birthOf(undefined, PADRAO)).toEqual({
      type: 'ritual', module: 'bridge', state: 'inbox', genesis_stage: 1,
    });
  });

  it('com selo, herda a leitura e NÃO pede de novo', () => {
    expect(birthOf({ type: 'task', module: 'work' }, PADRAO)).toEqual({
      type: 'task', module: 'work', state: 'classified', genesis_stage: 2,
    });
  });

  it('a herança reproduz o que o assentimento manual produz — estágio 2', () => {
    // (fsm classify: inbox/1 → classified/2; a série não inventa atalho)
    expect(birthOf({ type: 'ritual', module: 'bridge' }, PADRAO).genesis_stage).toBe(2);
  });
});
