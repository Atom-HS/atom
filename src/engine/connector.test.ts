// engine/connector.test.ts — o card deixa de ser cego (ato III · D69)
import { describe, it, expect } from 'vitest';
import { connectorContext, dayWord, originOf, personName } from './connector';
import type { AtomItem } from '@/types/item';

const NOW = new Date('2026-07-29T10:00:00+10:00');

function item(over: Partial<AtomItem> = {}): AtomItem {
  return {
    id: 'i1', user_id: 'u1', title: 'x', type: 'note', module: 'bridge',
    tags: [], status: 'inbox', state: 'inbox', genesis_stage: 1,
    project_id: null, naming_convention: null, notes: null, body: {},
    source: 'atom-engine', created_at: NOW.toISOString(), updated_at: NOW.toISOString(),
    created_by: null, ...over,
  } as AtomItem;
}

describe('originOf', () => {
  it('lê a origem pela tag da lente', () => {
    expect(originOf(item({ tags: ['#connector', '#source:gmail'] }))).toBe('gmail');
    expect(originOf(item({ tags: ['#source:google-calendar'] }))).toBe('calendar');
    expect(originOf(item({ tags: ['#raiz'] }))).toBeNull();
  });
});

describe('personName — quem está do outro lado', () => {
  it('nome antes do email', () => {
    expect(personName('André Tanaka <andre@x.com>')).toBe('André Tanaka');
  });
  it('nome entre aspas (como o Gmail manda)', () => {
    expect(personName('"Willi Vidros" <willi@x.com>')).toBe('Willi Vidros');
  });
  it('sem nome, o local do email serve', () => {
    expect(personName('<contato@empresa.com>')).toBe('contato');
    expect(personName('contato@empresa.com')).toBe('contato');
  });
});

describe('dayWord — o dia como quem fala', () => {
  it('hoje e amanhã têm nome', () => {
    expect(dayWord(new Date('2026-07-29T16:00:00+10:00'), NOW)).toBe('hoje');
    expect(dayWord(new Date('2026-07-30T09:00:00+10:00'), NOW)).toBe('amanhã');
  });
  it('depois disso, dia e mês', () => {
    expect(dayWord(new Date('2026-08-14T09:00:00+10:00'), NOW)).toMatch(/ago/);
  });
});

describe('connectorContext — calendar', () => {
  const cal = (body: Record<string, unknown>) =>
    connectorContext(item({ tags: ['#source:google-calendar'], body }), NOW);

  it('hora marcada vira faixa legível', () => {
    const c = cal({ start: '2026-07-29T16:00:00+10:00', end: '2026-07-29T17:00:00+10:00' });
    expect(c.lines[0]).toBe('hoje, 16:00–17:00');
  });

  it('all-day não ganha hora falsa', () => {
    const c = cal({ start: '2026-07-29', all_day: true });
    expect(c.lines[0]).toBe('hoje, dia todo');
  });

  it('sem fim, só o começo', () => {
    const c = cal({ start: '2026-07-30T09:00:00+10:00' });
    expect(c.lines[0]).toBe('amanhã, 09:00');
  });

  it('recorrência aparece — é ela que decide ritual × task', () => {
    const c = cal({ start: '2026-07-29T16:00:00+10:00', recurring: true });
    expect(c.lines).toContain('se repete');
  });

  it('quem vem junto, sem despejar a lista', () => {
    const um = cal({ attendees: [{ name: 'André Tanaka', email: 'a@x.com' }] });
    expect(um.lines).toContain('com André Tanaka');

    const tres = cal({
      attendees: [
        { name: 'André Tanaka', email: 'a@x.com' },
        { name: 'Bella', email: 'b@x.com' },
        { name: 'Carla', email: 'c@x.com' },
      ],
    });
    expect(tres.lines).toContain('com André Tanaka e mais 2');
  });

  it('sem nome, o email vira gente', () => {
    const c = cal({ attendees: [{ name: null, email: 'willi@vidros.com' }] });
    expect(c.lines).toContain('com willi');
  });

  it('corpo vazio não inventa linha', () => {
    expect(cal({}).lines).toEqual([]);
  });
});

describe('connectorContext — gmail', () => {
  const mail = (body: Record<string, unknown>) =>
    connectorContext(item({ tags: ['#source:gmail'], body }), NOW);

  it('remetente e trecho — o mínimo pra decidir', () => {
    const c = mail({ from: 'Willi <willi@x.com>', snippet: 'segue o orçamento do vidro' });
    expect(c.lines[0]).toBe('de Willi');
    expect(c.lines).toContain('segue o orçamento do vidro');
  });

  it('trecho longo é cortado, nunca despejado', () => {
    const c = mail({ from: 'a@x.com', snippet: 'x'.repeat(300) });
    const trecho = c.lines[c.lines.length - 1];
    expect(trecho.length).toBeLessThanOrEqual(121);
    expect(trecho.endsWith('…')).toBe(true);
  });

  it('item que não é da lente não ganha contexto', () => {
    expect(connectorContext(item({ tags: [] }), NOW).lines).toEqual([]);
  });
});
