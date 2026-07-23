// service/person-service.ts — pessoas como entidades do mundo (Fase 5 · spec v0.4 D1)
// Person = item born-committed (○): uma pessoa É, não matura pelo FSM.
// Nasce por curadoria (sugestão aceita ou criação direta), nunca sozinha.
// Pattern: hooks → service → supabase

import { supabase } from './supabase';
import { itemService, connectionService } from './item-service';
import type { AtomItem, AtomModule } from '@/types/item';
import {
  matchByEmail, matchInText, collectUnknownAttendees, slugify,
  type AttendeeLike, type PersonSuggestion,
} from '@/engine/people';

export interface CreatePersonPayload {
  userId: string;
  name: string;
  emails?: string[];
  aliases?: string[];
  relationship?: string | null;
  module?: AtomModule;
}

interface CalendarEventRow {
  id: string;
  title: string;
  tags: string[];
  body: Record<string, unknown>;
}

function eventAttendees(body: Record<string, unknown>): AttendeeLike[] {
  return Array.isArray(body.attendees) ? (body.attendees as AttendeeLike[]) : [];
}

async function listCalendarEvents(userId: string): Promise<CalendarEventRow[]> {
  const { data, error } = await supabase
    .from('items')
    .select('id, title, tags, body')
    .eq('user_id', userId)
    .contains('tags', ['#source:google-calendar'])
    .neq('state', 'archived');
  if (error) throw error;
  return (data ?? []) as CalendarEventRow[];
}

export const personService = {
  async listPersons(userId: string): Promise<AtomItem[]> {
    const persons = await itemService.list(userId, { type: 'person' });
    return persons.filter((p) => p.state !== 'archived');
  },

  async createPerson(payload: CreatePersonPayload): Promise<AtomItem> {
    const { userId, name, emails, aliases, relationship, module } = payload;
    return itemService.create({
      title: name,
      user_id: userId,
      type: 'person',
      module: module ?? 'family',
      state: 'committed',
      genesis_stage: 7,
      status: 'active',
      source: 'mindroot',
      tags: [`#who:${slugify(name)}`],
      naming_convention: `person_${slugify(name)}`,
      body: {
        emails: (emails ?? []).map((e) => e.toLowerCase()),
        aliases: aliases ?? [],
        relationship: relationship ?? null,
      },
    });
  },

  // Casa eventos do calendário com pessoas: attendee por email, título por nome/alias.
  // Connection event —references→ person, idempotente. Retorna quantas nasceram.
  async syncEventConnections(userId: string): Promise<number> {
    const [persons, events, connections] = await Promise.all([
      personService.listPersons(userId),
      listCalendarEvents(userId),
      connectionService.list(),
    ]);
    if (persons.length === 0 || events.length === 0) return 0;

    const linked = new Set(
      connections
        .filter((c) => c.relation === 'references')
        .map((c) => `${c.source_id}→${c.target_id}`),
    );

    let created = 0;
    for (const event of events) {
      const matches = new Map<string, AtomItem>();
      for (const a of eventAttendees(event.body)) {
        const person = matchByEmail(persons, a.email);
        if (person) matches.set(person.id, person);
      }
      for (const person of matchInText(persons, event.title)) {
        matches.set(person.id, person);
      }
      for (const person of matches.values()) {
        if (linked.has(`${event.id}→${person.id}`)) continue;
        await connectionService.create({
          user_id: userId,
          source_id: event.id,
          target_id: person.id,
          relation: 'references',
          note: 'calendar',
        });
        linked.add(`${event.id}→${person.id}`);
        created++;
      }
    }
    return created;
  },

  // Attendees que ainda não são pessoas → cards prontos pra 1 clique (seleção pronta)
  async getSuggestions(userId: string): Promise<PersonSuggestion[]> {
    const [persons, events] = await Promise.all([
      personService.listPersons(userId),
      listCalendarEvents(userId),
    ]);
    return collectUnknownAttendees(
      events.map((e) => ({ title: e.title, attendees: eventAttendees(e.body) })),
      persons,
    );
  },
};
