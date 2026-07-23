// engine/people.ts — matching pessoa↔attendee/texto (Fase 5 · spec v0.4 D1)
// Puro: sem Supabase, sem UI. Person = item type 'person', born-committed.
// Match por email (attendees do Google Cal) e por nome/alias em texto (títulos).

import type { AtomItem, PersonBody } from '@/types/item';

export interface AttendeeLike {
  email: string;
  name: string | null;
}

export interface PersonSuggestion {
  email: string;
  name: string;
  eventCount: number;
  eventTitles: string[];
}

// Normaliza pra comparação: lowercase + sem acentos
function fold(s: string): string {
  return s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
}

export function slugify(name: string): string {
  return fold(name).replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

export function readPersonBody(item: AtomItem): PersonBody {
  const body = (item.body ?? {}) as Record<string, unknown>;
  return {
    emails: Array.isArray(body.emails) ? (body.emails as string[]).map((e) => e.toLowerCase()) : [],
    aliases: Array.isArray(body.aliases) ? (body.aliases as string[]) : [],
    relationship: typeof body.relationship === 'string' ? body.relationship : null,
  };
}

export function matchByEmail(persons: AtomItem[], email: string): AtomItem | null {
  const target = email.toLowerCase();
  return persons.find((p) => readPersonBody(p).emails.includes(target)) ?? null;
}

// Nome ou alias presente no texto como palavra inteira ("Ana" não casa "banana")
export function matchInText(persons: AtomItem[], text: string): AtomItem[] {
  const folded = fold(text);
  return persons.filter((p) => {
    const names = [p.title, ...readPersonBody(p).aliases].filter(Boolean);
    return names.some((n) => {
      const name = fold(n);
      if (!name) return false;
      const i = folded.indexOf(name);
      if (i < 0) return false;
      const before = i === 0 ? '' : folded[i - 1];
      const after = folded[i + name.length] ?? '';
      return !/[a-z0-9]/.test(before) && !/[a-z0-9]/.test(after);
    });
  });
}

// "joao.silva" → "Joao Silva"
function humanizeEmailPrefix(email: string): string {
  const prefix = email.split('@')[0] ?? '';
  return prefix
    .split(/[._-]+/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

// Attendees sem person correspondente, agregados por email → cards de sugestão curada.
// O sistema apresenta, o humano decide (D1: entidade nasce por curadoria, nunca sozinha).
export function collectUnknownAttendees(
  events: { title: string; attendees: AttendeeLike[] }[],
  persons: AtomItem[],
): PersonSuggestion[] {
  const byEmail = new Map<string, PersonSuggestion>();
  for (const event of events) {
    for (const a of event.attendees) {
      const email = a.email.toLowerCase();
      if (matchByEmail(persons, email)) continue;
      const existing = byEmail.get(email);
      if (existing) {
        existing.eventCount++;
        if (!existing.name && a.name) existing.name = a.name;
        if (existing.eventTitles.length < 3 && !existing.eventTitles.includes(event.title)) {
          existing.eventTitles.push(event.title);
        }
      } else {
        byEmail.set(email, {
          email,
          name: a.name ?? '',
          eventCount: 1,
          eventTitles: [event.title],
        });
      }
    }
  }
  return [...byEmail.values()]
    .map((s) => ({ ...s, name: s.name || humanizeEmailPrefix(s.email) }))
    .sort((a, b) => b.eventCount - a.eventCount);
}
