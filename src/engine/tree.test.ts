// engine/tree.test.ts — a árvore da vida (face ÁRVORE)
import { describe, it, expect } from 'vitest';
import { treeShape, synthesis, presence, isColdStart, CONFIDENCE_FLOOR, TREE_WINDOWS } from './tree';
import type { AtomItem, AtomModule } from '@/types/item';

const NOW = new Date('2026-07-27T12:00:00Z');

function daysAgo(n: number): string {
  const d = new Date(NOW);
  d.setDate(d.getDate() - n);
  return d.toISOString();
}

let seq = 0;
function item(module: AtomModule, agedDays: number, over: Partial<AtomItem> = {}): AtomItem {
  return {
    id: `i${++seq}`,
    title: `${module}-${agedDays}`,
    module,
    type: 'task',
    state: 'structured',
    status: 'active',
    created_at: daysAgo(agedDays),
    updated_at: daysAgo(agedDays),
    tags: [],
    body: {},
    ...over,
  } as AtomItem;
}

describe('presence — presença por módulo na janela', () => {
  it('conta só o que foi tocado dentro da janela', () => {
    const items = [item('work', 2), item('work', 5), item('work', 40), item('body', 3)];
    const p = presence(items, 7, NOW);
    expect(p.work).toBe(2);
    expect(p.body).toBe(1);
    expect(p.mind).toBe(0);
  });

  it('arquivado não é presença', () => {
    const p = presence([item('work', 1, { state: 'archived' })], 7, NOW);
    expect(p.work).toBe(0);
  });

  it('updated_at recente ressuscita item velho (toque vale)', () => {
    const velho = item('mind', 200, { updated_at: daysAgo(1) });
    expect(presence([velho], 7, NOW).mind).toBe(1);
  });
});

describe('treeShape — real × ideal (o baseline é o teu passado)', () => {
  it('ramo mais cheio na semana mas vazio na estação fica saturado (anel)', () => {
    const items = [
      // semana: work explodiu; estação: family era o vivo
      item('work', 1), item('work', 2), item('work', 3),
      item('family', 30), item('family', 35), item('family', 40), item('family', 45),
    ];
    const shape = treeShape(items, 'semana', NOW);
    const work = shape.find((b) => b.module === 'work')!;
    const family = shape.find((b) => b.module === 'family')!;
    expect(work.real).toBe(1);
    expect(work.saturated).toBe(true);
    expect(family.thirsty).toBe(true); // era o maior no baseline, sumiu na semana
  });

  it('folhas: mais nova primeiro, teto 8 — e total diz a verdade', () => {
    const items = Array.from({ length: 10 }, (_, n) => item('body', (n % 6) + 1));
    const body = treeShape(items, 'semana', NOW).find((b) => b.module === 'body')!;
    expect(body.leaves).toHaveLength(8);
    expect(body.total).toBe(10);
    expect(body.leaves[0].item.title).toBe('body-1');
  });

  it('total conta só a janela — o que ficou fora não entra', () => {
    const items = [item('work', 2), item('work', 40)];
    const work = treeShape(items, 'semana', NOW).find((b) => b.module === 'work')!;
    expect(work.total).toBe(1);
    expect(work.leaves).toHaveLength(1);
  });

  it('janela ano se compara consigo — árvore em repouso, sem anel nem sede', () => {
    const items = [item('work', 10), item('body', 100)];
    for (const b of treeShape(items, 'ano', NOW)) {
      expect(b.saturated).toBe(false);
      expect(b.thirsty).toBe(false);
    }
  });

  it('árvore vazia: tudo zero, nada acusado', () => {
    for (const b of treeShape([], 'semana', NOW)) {
      expect(b.real).toBe(0);
      expect(b.saturated).toBe(false);
      expect(b.thirsty).toBe(false);
    }
  });
});

describe('synthesis — estado, nunca julgamento', () => {
  it('nomeia cheio · sede · folha nova em pt', () => {
    const items = [
      item('work', 1), item('work', 1), item('work', 2),
      item('family', 30), item('family', 35), item('family', 40), item('family', 45),
      item('body', 0),
    ];
    const line = synthesis(treeShape(items, 'semana', NOW))!;
    expect(line).toContain('a árvore pende');
    expect(line).toContain('trabalho cheio');
    expect(line).toContain('família pedindo água');
    expect(line).toContain('corpo em folha nova');
    // vocabulário proibido — shame não passa
    expect(line).not.toMatch(/atrasad|falt|deveria|%/i);
  });

  it('árvore quieta → null (a face silencia)', () => {
    expect(synthesis(treeShape([], 'semana', NOW))).toBeNull();
  });
});

describe('TREE_WINDOWS', () => {
  it('as 4 janelas φ: 7 · 21 · 55 · 365', () => {
    expect(TREE_WINDOWS.map((w) => w.days)).toEqual([7, 21, 55, 365]);
  });
});

describe('cold start e confiança por ramo (benchmark 16)', () => {
  it('árvore que nunca viveu declara cold start', () => {
    expect(isColdStart(treeShape([], 'semana', NOW))).toBe(true);
  });

  it('uma folha só já tira a árvore do cold start', () => {
    const shape = treeShape([item('work', 2)], 'semana', NOW);
    expect(isColdStart(shape)).toBe(false);
  });

  it('ramo sem folha em janela nenhuma → sem-dado', () => {
    const shape = treeShape([item('work', 2)], 'semana', NOW);
    expect(shape.find((b) => b.module === 'family')?.confidence).toBe('sem-dado');
  });

  it('baseline com pouca folha → leitura rala', () => {
    // 2 toques na estação (< CONFIDENCE_FLOOR): o ideal se apoia em quase nada
    const shape = treeShape([item('mind', 30), item('mind', 40)], 'semana', NOW);
    expect(CONFIDENCE_FLOOR).toBeGreaterThan(2);
    expect(shape.find((b) => b.module === 'mind')?.confidence).toBe('rala');
  });

  it('baseline no piso ou acima → leitura firme', () => {
    const shape = treeShape(
      [item('body', 5), item('body', 20), item('body', 44)],
      'semana',
      NOW,
    );
    expect(shape.find((b) => b.module === 'body')?.confidence).toBe('firme');
  });

  it('a confiança é do dado, nunca julga: sem-dado não vira sede nem cheio', () => {
    const shape = treeShape([item('work', 2)], 'semana', NOW);
    const family = shape.find((b) => b.module === 'family')!;
    expect(family.thirsty).toBe(false);
    expect(family.saturated).toBe(false);
  });
});
