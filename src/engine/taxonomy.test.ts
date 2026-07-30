// engine/taxonomy.test.ts — a ida legisla, o teste guarda a lei (D68)
import { describe, it, expect } from 'vitest';
import {
  desiredLabels,
  emptyTaxonomy,
  readTaxonomy,
  isApplied,
  taxonomySummary,
  ATOM_NAMESPACE,
  CALENDAR_KEY,
} from './taxonomy';
import { RAIZ_DOMAINS } from '@/config/raiz';

describe('desiredLabels — a lei da casa no namespace assinado', () => {
  it('projeta os 9 domínios da vida, um label por domínio', () => {
    const labels = desiredLabels();
    expect(labels).toHaveLength(RAIZ_DOMAINS.length);
    expect(labels).toHaveLength(9);
  });

  it('todo label vive no namespace Atom/ — nunca colide com o que é do usuário', () => {
    for (const l of desiredLabels()) {
      expect(l.name.startsWith(`${ATOM_NAMESPACE}/`)).toBe(true);
    }
  });

  it('os nomes projetados são CONGELADOS em ASCII — o tom da UI não renomeia label no Gmail', () => {
    const names = desiredLabels().map((l) => l.name);
    expect(names).toContain('Atom/saude');
    expect(names).toContain('Atom/financas');
    expect(names).toContain('Atom/identidade');
    // acento na UI (D60) nunca vaza pro contrato lá fora (D68)
    for (const n of names) expect(n).toBe(n.normalize('NFD').replace(/[̀-ͯ]/g, ''));
  });
});

describe('readTaxonomy — o registro não confia no shape', () => {
  it('metadata vazio ou torto vira registro vazio', () => {
    expect(readTaxonomy(null)).toEqual(emptyTaxonomy());
    expect(readTaxonomy({})).toEqual(emptyTaxonomy());
    expect(readTaxonomy({ taxonomy: 'lixo' })).toEqual(emptyTaxonomy());
    expect(readTaxonomy({ taxonomy: { disabled: 'nao-e-array' } }).disabled).toEqual([]);
  });

  it('registro válido atravessa inteiro', () => {
    const rec = readTaxonomy({
      taxonomy: {
        gmail: { health: { id: 'L1', name: 'Atom/saude' } },
        calendar: { id: 'C1', summary: 'Atom' },
        disabled: ['memories'],
        applied_at: '2026-07-29T12:00:00Z',
      },
    });
    expect(rec.gmail.health.id).toBe('L1');
    expect(rec.calendar?.id).toBe('C1');
    expect(rec.disabled).toEqual(['memories']);
  });
});

describe('isApplied + taxonomySummary — estado quieto, nunca meta', () => {
  it('vazio não está aplicado e não fala nada', () => {
    expect(isApplied(emptyTaxonomy())).toBe(false);
    expect(taxonomySummary(emptyTaxonomy())).toBe('');
  });

  it('resume o que vive lá fora, contando o que o usuário desligou', () => {
    const rec = readTaxonomy({
      taxonomy: {
        gmail: {
          health: { id: 'L1', name: 'Atom/saude' },
          finance: { id: 'L2', name: 'Atom/financas' },
        },
        calendar: { id: 'C1', summary: 'Atom' },
        disabled: ['memories'],
        applied_at: '2026-07-29T12:00:00Z',
      },
    });
    expect(isApplied(rec)).toBe(true);
    const s = taxonomySummary(rec);
    expect(s).toContain('2 labels no Gmail');
    expect(s).toContain('calendário no GCal');
    expect(s).toContain('1 desligado por você');
  });

  it('calendário deletado lá fora conta como desligado', () => {
    const rec = readTaxonomy({
      taxonomy: {
        gmail: { health: { id: 'L1', name: 'Atom/saude' } },
        calendar: null,
        disabled: [CALENDAR_KEY],
        applied_at: '2026-07-29T12:00:00Z',
      },
    });
    expect(taxonomySummary(rec)).toContain('1 desligado por você');
  });
});
