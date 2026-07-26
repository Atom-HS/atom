// engine/mouth.test.ts — a gramática da boca única (face @)
import { describe, it, expect } from 'vitest';
import { readMouth, resolveListTarget, structureFromTriage, readingChips } from './mouth';
import type { AtomItem } from '@/types/item';
import type { TriageResult } from '@/service/triage-service';

const TODAY = new Date('2026-07-26T10:00:00'); // domingo

function listItem(title: string): AtomItem {
  return { id: title, title, type: 'list', state: 'structured', status: 'active' } as unknown as AtomItem;
}

describe('readMouth — sinto: abre a alma (mesma gramática do Telegram)', () => {
  it('sinto: com dois-pontos', () => {
    const r = readMouth('sinto: apertado no peito antes da call');
    expect(r).toEqual({ kind: 'soul', emotion: 'apertado no peito antes da call', note: 'apertado no peito antes da call' });
  });

  it('sinto sem dois-pontos, emoção = primeiro segmento', () => {
    const r = readMouth('sinto cansado, mas o dia foi bom');
    expect(r.kind).toBe('soul');
    if (r.kind === 'soul') {
      expect(r.emotion).toBe('cansado');
      expect(r.note).toBe('cansado, mas o dia foi bom');
    }
  });

  it('"sinto" no meio da frase NÃO é soul', () => {
    expect(readMouth('hoje eu sinto que vai dar certo').kind).toBe('capture');
  });
});

describe('readMouth — lista: abre a despensa', () => {
  it('lista sem nome, separada por vírgula', () => {
    const r = readMouth('lista: leite, pão, café');
    expect(r).toEqual({ kind: 'list', name: null, entries: ['leite', 'pão', 'café'] });
  });

  it('lista com nome antes do dois-pontos', () => {
    const r = readMouth('lista mercado: leite, ovos');
    expect(r).toEqual({ kind: 'list', name: 'mercado', entries: ['leite', 'ovos'] });
  });

  it('entradas por quebra de linha também valem', () => {
    const r = readMouth('lista: leite\npão\ncafé');
    expect(r.kind).toBe('list');
    if (r.kind === 'list') expect(r.entries).toEqual(['leite', 'pão', 'café']);
  });

  it('lista: vazia não vira lista — cai pra captura', () => {
    expect(readMouth('lista:  ').kind).toBe('capture');
  });
});

describe('readMouth — o resto é captura', () => {
  it('texto curto: título limpo, sem notes', () => {
    const r = readMouth('responder Willi sobre o vidro');
    expect(r.kind).toBe('capture');
    if (r.kind === 'capture') {
      expect(r.title).toBe('responder Willi sobre o vidro');
      expect(r.notes).toBeNull();
      expect(r.hasTokens).toBe(false);
    }
  });

  it('tokens #module @type @date são lidos e hasTokens acende com os dois', () => {
    const r = readMouth('orçamento do vidro #work @task @sex', TODAY);
    expect(r.kind).toBe('capture');
    if (r.kind === 'capture') {
      expect(r.module).toBe('work');
      expect(r.type).toBe('task');
      expect(r.dueDate).toBe('2026-07-31'); // sexta seguinte ao domingo 26
      expect(r.hasTokens).toBe(true);
      expect(r.title).toBe('orçamento do vidro');
    }
  });

  it('só module, sem type → hasTokens false (a AI ainda lê)', () => {
    const r = readMouth('ligar pro contador #finance', TODAY);
    if (r.kind === 'capture') expect(r.hasTokens).toBe(false);
  });

  it('despejo colado (multi-linha): título = 1ª linha, notes = inteiro', () => {
    const dump = 'Segue o orçamento revisado do vidro\nprecisamos fechar até sexta\nabraço';
    const r = readMouth(dump);
    expect(r.kind).toBe('capture');
    if (r.kind === 'capture') {
      expect(r.title).toBe('Segue o orçamento revisado do vidro');
      expect(r.notes).toBe(dump);
    }
  });

  it('linha única longa (>140) também é despejo', () => {
    const long = 'a'.repeat(150);
    const r = readMouth(long);
    if (r.kind === 'capture') expect(r.notes).toBe(long);
  });
});

describe('resolveListTarget — onde a entrada pousa', () => {
  const mercado = listItem('Mercado da semana');
  const obra = listItem('obra do estúdio');

  it('nome dado casa por fold (acento/caixa não importam)', () => {
    expect(resolveListTarget([mercado, obra], 'ESTÚDIO')).toBe(obra);
  });

  it('sem nome + uma única lista aberta → ela', () => {
    expect(resolveListTarget([mercado], null)).toBe(mercado);
  });

  it('sem nome + várias abertas → null (nasce nova, sem adivinhar)', () => {
    expect(resolveListTarget([mercado, obra], null)).toBeNull();
  });

  it('nome que não casa → null', () => {
    expect(resolveListTarget([mercado], 'farmácia')).toBeNull();
  });
});

describe('structureFromTriage + readingChips', () => {
  const result: TriageResult = {
    title: 'orçamento do vidro',
    type: 'task',
    module: 'work',
    confidence: 92,
    reasoning: '',
    tags: [],
    due_date: '2026-07-31',
    emotion: null,
  };

  it('due_date vai pra body.operations.due_date (contrato do tronco)', () => {
    expect(structureFromTriage(result)).toEqual({
      type: 'task',
      module: 'work',
      body: { operations: { due_date: '2026-07-31' } },
    });
  });

  it('sem due_date → body vazio', () => {
    expect(structureFromTriage({ ...result, due_date: null }).body).toEqual({});
  });

  it('chips: estado, nunca julgamento', () => {
    expect(readingChips(result)).toEqual(['△ task', '#work', '@07-31', '92%']);
  });
});
