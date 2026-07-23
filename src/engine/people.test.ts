// engine/people.test.ts — matching pessoa↔attendee/texto (Fase 5)
import { describe, it, expect } from 'vitest';
import {
  slugify, readPersonBody, matchByEmail, matchInText, collectUnknownAttendees,
} from './people';
import type { AtomItem } from '@/types/item';

function person(title: string, body: Record<string, unknown> = {}): AtomItem {
  return {
    id: `id-${slugify(title)}`,
    user_id: 'u1',
    title,
    type: 'person',
    module: 'family',
    tags: [],
    status: 'active',
    state: 'committed',
    genesis_stage: 7,
    project_id: null,
    naming_convention: null,
    notes: null,
    body,
    source: 'mindroot',
    created_at: '2026-07-24T00:00:00Z',
    updated_at: '2026-07-24T00:00:00Z',
    created_by: null,
  };
}

describe('slugify', () => {
  it('folds accents and spaces', () => {
    expect(slugify('João Áquila')).toBe('joao-aquila');
  });
});

describe('readPersonBody', () => {
  it('normalizes emails to lowercase and tolerates missing fields', () => {
    const p = person('Ana', { emails: ['Ana@X.COM'] });
    expect(readPersonBody(p)).toEqual({ emails: ['ana@x.com'], aliases: [], relationship: null });
  });
});

describe('matchByEmail', () => {
  const ana = person('Ana', { emails: ['ana@x.com', 'ana.work@y.com'] });
  it('matches case-insensitive against any registered email', () => {
    expect(matchByEmail([ana], 'ANA.WORK@Y.com')).toBe(ana);
  });
  it('returns null when nobody owns the email', () => {
    expect(matchByEmail([ana], 'bob@x.com')).toBeNull();
  });
});

describe('matchInText', () => {
  const bia = person('Beatriz', { aliases: ['Bia'] });
  it('matches title and alias as whole words, accent-insensitive', () => {
    expect(matchInText([bia], 'Aniversário da Bia')).toEqual([bia]);
    expect(matchInText([bia], 'Consulta — BEATRIZ')).toEqual([bia]);
  });
  it('does not match inside other words', () => {
    const ana = person('Ana');
    expect(matchInText([ana], 'Comprar banana')).toEqual([]);
  });
});

describe('collectUnknownAttendees', () => {
  const ana = person('Ana', { emails: ['ana@x.com'] });
  it('aggregates unknown attendees by email, sorted by presence', () => {
    const events = [
      { title: 'Reunião 1', attendees: [{ email: 'bob@x.com', name: 'Bob Silva' }, { email: 'ana@x.com', name: 'Ana' }] },
      { title: 'Reunião 2', attendees: [{ email: 'bob@x.com', name: null }] },
      { title: 'Almoço', attendees: [{ email: 'carol.souza@y.com', name: null }] },
    ];
    const suggestions = collectUnknownAttendees(events, [ana]);
    expect(suggestions.map((s) => s.email)).toEqual(['bob@x.com', 'carol.souza@y.com']);
    expect(suggestions[0]).toMatchObject({ name: 'Bob Silva', eventCount: 2, eventTitles: ['Reunião 1', 'Reunião 2'] });
  });
  it('humanizes the email prefix when Google gives no display name', () => {
    const [carol] = collectUnknownAttendees(
      [{ title: 'Almoço', attendees: [{ email: 'carol.souza@y.com', name: null }] }], [],
    );
    expect(carol.name).toBe('Carol Souza');
  });
});
