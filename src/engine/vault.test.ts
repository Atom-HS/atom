// engine/vault.test.ts — o cofre lê validade e ausência sem mentir
import { describe, expect, it } from 'vitest';
import type { AtomEvent, AtomItem } from '@/types/item';
import { absences, domainOf, expiries, leadDays, quietAbsences, renewalPatch } from './vault';

const NOW = new Date('2026-07-29T12:00:00Z');

function item(over: Partial<AtomItem>): AtomItem {
  return {
    id: over.id ?? 'i1',
    user_id: 'u1',
    title: 'x',
    type: 'note',
    module: 'bridge',
    tags: [],
    status: 'active',
    state: 'classified',
    genesis_stage: 2,
    source: 'mindroot',
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
    body: {},
    ...over,
  } as AtomItem;
}

function event(over: Partial<AtomEvent>): AtomEvent {
  return {
    id: over.id ?? 'e1',
    user_id: 'u1',
    source_id: 'i1',
    target_id: null,
    event_type: 'touch',
    payload: {},
    created_at: '2026-06-01T00:00:00Z',
    ...over,
  } as AtomEvent;
}

const days = (n: number) => new Date(NOW.getTime() + n * 86_400_000).toISOString();

describe('domainOf', () => {
  it('lê a tag #domain:', () => {
    expect(domainOf(item({ tags: ['#raiz', '#domain:health'] }))).toBe('health');
    expect(domainOf(item({ tags: ['#raiz'] }))).toBeNull();
  });
});

describe('validade — antecedência por domínio', () => {
  it('documents avisa com 9 meses; default é 30 dias', () => {
    expect(leadDays(item({ tags: ['#domain:documents'] }))).toBe(270);
    expect(leadDays(item({ tags: ['#domain:finance'] }))).toBe(60);
    expect(leadDays(item({ tags: [] }))).toBe(30);
  });

  it('passaporte a 200 dias JÁ está na janela; finanças a 200 dias não', () => {
    const passaporte = item({ id: 'p', tags: ['#domain:documents'], body: { operations: { deadline: days(200) } as never } });
    const seguro = item({ id: 'n', tags: ['#domain:finance'], body: { operations: { deadline: days(200) } as never } });
    const out = expiries([passaporte, seguro], NOW);
    expect(out.map((e) => e.item.id)).toEqual(['p']);
    expect(out[0].daysLeft).toBe(200);
  });

  it('item sem gaveta (#domain:) não entra no cofre — prazo de tarefa é assunto do HOJE', () => {
    const tarefa = item({ id: 't', body: { operations: { deadline: days(1) } as never } });
    expect(expiries([tarefa], NOW)).toEqual([]);
  });

  it('vencidos vêm primeiro, depois por proximidade', () => {
    const a = item({ id: 'a', tags: ['#domain:health'], body: { operations: { deadline: days(10) } as never } });
    const b = item({ id: 'b', tags: ['#domain:health'], body: { operations: { deadline: days(-5) } as never } });
    const out = expiries([a, b], NOW);
    expect(out.map((e) => e.item.id)).toEqual(['b', 'a']);
    expect(out[0].daysLeft).toBeLessThan(0);
  });

  it('arquivado e concluído não vencem; sem deadline não entra; data inválida não derruba', () => {
    const arch = item({ id: 'x', status: 'archived', tags: ['#domain:finance'], body: { operations: { deadline: days(1) } as never } });
    const done = item({ id: 'y', status: 'completed', tags: ['#domain:finance'], body: { operations: { deadline: days(1) } as never } });
    const semData = item({ id: 'z', tags: ['#domain:finance'] });
    const invalida = item({ id: 'w', tags: ['#domain:finance'], body: { operations: { deadline: 'não é data' } as never } });
    expect(expiries([arch, done, semData, invalida], NOW)).toEqual([]);
  });

  it('due_date serve quando deadline falta — e data-só de hoje diz "hoje", nunca "ontem"', () => {
    const i = item({ id: 'd', tags: ['#domain:finance'], body: { operations: { due_date: days(5).slice(0, 10) } as never } });
    expect(expiries([i], NOW)).toHaveLength(1);
    const hoje = item({ id: 'h', tags: ['#domain:finance'], body: { operations: { due_date: '2026-07-29' } as never } });
    const [e] = expiries([hoje], NOW);
    expect(e.daysLeft).toBe(0);
  });

  it('renovar rola o deadline preservando o resto do body', () => {
    const i = item({ body: { operations: { deadline: days(-1), priority: 'high' } as never, soul: { ritual_slot: 'aurora' } as never } });
    const patch = renewalPatch(i, days(365));
    expect((patch.operations as Record<string, unknown>).deadline).toBe(days(365));
    expect((patch.operations as Record<string, unknown>).priority).toBe('high');
    expect(patch.soul).toEqual(i.body!.soul);
  });
});

describe('ausência — evento significativo, nunca updated_at', () => {
  it('updated_at recente NÃO silencia a ausência', () => {
    const velho = item({
      id: 'h',
      tags: ['#domain:health'],
      created_at: '2024-07-01T00:00:00Z',
      updated_at: days(-1), // retag ontem — não conta
    });
    const [saude] = absences(['health'], [velho], [], NOW);
    expect(saude.daysSince).toBeGreaterThan(700);
  });

  it('evento significativo no item do domínio zera o relógio', () => {
    const velho = item({ id: 'h', tags: ['#domain:health'], created_at: '2024-07-01T00:00:00Z' });
    const toque = event({ source_id: 'h', event_type: 'touch', created_at: days(-3) });
    const [saude] = absences(['health'], [velho], [toque], NOW);
    expect(saude.daysSince).toBe(3);
  });

  it('evento de tipo não-significativo não conta', () => {
    const velho = item({ id: 'h', tags: ['#domain:health'], created_at: '2024-07-01T00:00:00Z' });
    const ruido = event({ source_id: 'h', event_type: 'retag', created_at: days(-1) });
    const [saude] = absences(['health'], [velho], [ruido], NOW);
    expect(saude.daysSince).toBeGreaterThan(700);
  });

  it('domínio sem nada = nunca (null)', () => {
    const [docs] = absences(['documents'], [], [], NOW);
    expect(docs.daysSince).toBeNull();
  });

  it('quietAbsences filtra pelo limiar e põe as mais antigas (e o nunca) primeiro', () => {
    const all = [
      { domain: 'a', daysSince: 10 },
      { domain: 'b', daysSince: 400 },
      { domain: 'c', daysSince: null },
      { domain: 'd', daysSince: 91 },
    ];
    expect(quietAbsences(all, 90).map((x) => x.domain)).toEqual(['c', 'b', 'd']);
  });
});
