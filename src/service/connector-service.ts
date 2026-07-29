// service/connector-service.ts — Connector management
// Auth flow, token storage, sync triggers, status queries.
// Pattern: hooks → service → supabase (never import supabase in hooks)

import { supabase } from './supabase';
import { itemService } from './item-service';
import { desiredLabels, ATOM_CALENDAR_SUMMARY } from '@/engine/taxonomy';
import { fsmService } from './fsm-service';
import { birthOf, sealedSeries } from '@/engine/series';
import type { AtomItem } from '@/types/item';

export interface ConnectorStatus {
  provider: string;
  status: 'connected' | 'disconnected' | 'error';
  lastSyncAt: string | null;
  metadata: Record<string, unknown>;
}

export interface EventAttendee {
  email: string;
  name: string | null;
  response: string | null;
}

export interface CalendarEvent {
  google_id: string;
  title: string;
  start: string;
  end: string;
  calendar: string;
  recurring: boolean;
  /** a série a que a instância pertence — o que deixa assentir uma vez só (DP-C) */
  recurring_event_id?: string | null;
  all_day?: boolean;
  attendees?: EventAttendee[];
}

export type TaxonomyAction = 'preview' | 'apply' | 'remove';

export interface TaxonomyBranchReport {
  key: string;
  name: string;
  action: 'create' | 'created' | 'exists' | 'disabled' | 'off';
}

export interface TaxonomyReport {
  action: TaxonomyAction;
  labels?: TaxonomyBranchReport[];
  calendar?: TaxonomyBranchReport;
  removed?: string[];
}

/** Erro-sinal: o token não tem os escopos da ida — pede reconexão Google. */
export const RECONNECT_SCOPES = 'RECONNECT_SCOPES';

export interface GmailMessage {
  id: string;
  thread_id: string;
  subject: string;
  from: string;
  date: string;
  snippet: string;
  labels: string[];
}

export const connectorService = {
  async getConnectors(): Promise<ConnectorStatus[]> {
    const { data, error } = await supabase
      .from('user_connectors')
      .select('provider, status, last_sync_at, metadata');

    if (error) {
      console.warn('[connector] getConnectors error:', error.message);
      throw error;
    }

    return (data ?? []).map((row) => ({
      provider: row.provider,
      status: row.status as ConnectorStatus['status'],
      lastSyncAt: row.last_sync_at,
      metadata: (row.metadata ?? {}) as Record<string, unknown>,
    }));
  },

  async storeTokens(
    providerRefreshToken: string,
    provider: string,
    metadata?: Record<string, unknown>,
  ): Promise<void> {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error('Not authenticated');

    const resp = await supabase.functions.invoke('connector-auth', {
      body: {
        user_id: session.user.id,
        provider_refresh_token: providerRefreshToken,
        provider,
        scopes: [
          'https://www.googleapis.com/auth/calendar.readonly',
          'https://www.googleapis.com/auth/gmail.readonly',
          'https://www.googleapis.com/auth/gmail.labels',
          'https://www.googleapis.com/auth/calendar.app.created',
        ],
        metadata: metadata ?? {},
      },
    });

    if (resp.error) {
      console.warn('[connector] edge function failed, using fallback:', resp.error.message);
      const { error } = await supabase.from('user_connectors').upsert(
        {
          user_id: session.user.id,
          provider,
          status: 'connected',
          provider_refresh_token: providerRefreshToken,
          scopes: ['calendar.readonly', 'gmail.readonly'],
          metadata: metadata ?? {},
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_id,provider' },
      );
      if (error) throw new Error(`Direct insert failed: ${error.message}`);
    }
  },

  async syncCalendar(): Promise<CalendarEvent[]> {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error('Not authenticated');
    const resp = await supabase.functions.invoke('calendar-sync', {
      body: { user_id: session.user.id },
    });
    if (resp.error) throw new Error(resp.error.message);
    const body = resp.data as { events: CalendarEvent[]; timezone: string; synced_at: string };
    return body.events;
  },

  async syncGmail(): Promise<GmailMessage[]> {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error('Not authenticated');
    const resp = await supabase.functions.invoke('gmail-sync', {
      body: { user_id: session.user.id },
    });
    if (resp.error) throw new Error(resp.error.message);
    return (resp.data as { messages: GmailMessage[] }).messages;
  },

  async ingestCalendarEvents(events: CalendarEvent[], userId: string): Promise<number> {
    const { data: existingItems } = await supabase
      .from('items').select('id, body, type, module, state, status, created_at, updated_at')
      .eq('user_id', userId).not('body', 'is', null);
    const existing = (existingItems ?? []) as unknown as AtomItem[];
    const existingByGoogleId = new Map(
      existing
        .filter((i) => (i.body as Record<string, unknown>)?.google_id)
        .map((i) => [(i.body as Record<string, unknown>).google_id as string, i]),
    );
    // DP-C: quem já assentiu a série não é perguntado de novo — a instância
    // nova herda o selo em vez de encher o inbox toda semana, pra sempre
    const selos = sealedSeries(existing);

    let created = 0;
    for (const event of events) {
      const attendees = event.attendees ?? [];
      const jaExiste = existingByGoogleId.get(event.google_id);

      if (jaExiste) {
        // Attendees change (people respond, get added) — keep the tronco fresh
        const body = jaExiste.body as Record<string, unknown>;
        if (attendees.length > 0 && JSON.stringify(body.attendees ?? []) !== JSON.stringify(attendees)) {
          await itemService.update(jaExiste.id, { body: { ...body, attendees } });
        }
        continue;
      }

      const serie = event.recurring_event_id ?? null;
      const nascimento = birthOf(serie ? selos.get(serie) : undefined, {
        type: event.recurring ? 'ritual' : 'task',
        module: 'bridge',
      });

      const tags = ['#domain:time', '#source:google-calendar', '#connector'];
      for (const a of attendees) {
        const whoTag = extractWhoTag(a.name ? `${a.name} <${a.email}>` : `<${a.email}>`);
        if (whoTag && !tags.includes(whoTag)) tags.push(whoTag);
      }
      // inbox obrigatório (CLAUDE.md §6): TODO item nasce no estágio 1, mesmo
      // o que herda leitura de série. Herdar poupa a pergunta, nunca o caminho.
      const criado = await itemService.create({
        title: event.title, user_id: userId,
        type: nascimento.type, module: nascimento.module,
        tags,
        status: 'inbox', state: 'inbox', genesis_stage: 1,
        source: 'atom-engine',
        body: {
          google_id: event.google_id, start: event.start, end: event.end,
          calendar: event.calendar, recurring: event.recurring,
          recurring_event_id: serie,
          all_day: event.all_day ?? false, attendees,
        },
      });
      if (nascimento.herdou) {
        // o selo da série passa pelo portão 1→2, igual ao assentimento manual.
        // Se falhar, a instância fica no inbox e pergunta — degradar pedindo
        // é seguro; degradar selando calado não seria.
        await fsmService
          .classify(criado.id, nascimento.type, nascimento.module)
          .catch(() => {});
      }
      created++;
    }
    return created;
  },

  async ingestGmailMessages(messages: GmailMessage[], userId: string): Promise<number> {
    const { data: existingItems } = await supabase
      .from('items').select('body').eq('user_id', userId).not('body', 'is', null);
    const existingIds = new Set(
      (existingItems ?? []).map((i) => (i.body as any)?.gmail_id).filter(Boolean),
    );

    let created = 0;
    for (const msg of messages) {
      if (existingIds.has(msg.id)) continue;

      // Extract #who:* tag from sender (e.g. "John Doe <john@x.com>" → "#who:john-doe")
      const tags = ['#domain:communication', '#source:gmail', '#connector'];
      const whoTag = extractWhoTag(msg.from);
      if (whoTag) tags.push(whoTag);

      await itemService.create({
        title: msg.subject || '(sem assunto)', user_id: userId, type: 'note', module: 'bridge',
        tags,
        status: 'inbox', state: 'inbox', genesis_stage: 1, source: 'atom-engine',
        body: { gmail_id: msg.id, from: msg.from, date: msg.date, snippet: msg.snippet, labels: msg.labels },
      });
      created++;
    }
    return created;
  },

  // A ida (D68): projeta a lei da casa lá fora, via edge taxonomy-sync.
  // preview = só olha · apply = cria o delta · remove = desfaz o que a casa criou
  async taxonomySync(action: TaxonomyAction): Promise<TaxonomyReport> {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error('Not authenticated');

    const resp = await supabase.functions.invoke('taxonomy-sync', {
      body: {
        user_id: session.user.id,
        action,
        labels: desiredLabels(),
        calendar_summary: ATOM_CALENDAR_SUMMARY,
      },
    });

    if (resp.error) {
      const ctx = (resp.error as { context?: Response }).context;
      if (ctx && typeof ctx.json === 'function') {
        const body = (await ctx.json().catch(() => null)) as { code?: string } | null;
        if (body?.code === 'TAX_401') throw new Error(RECONNECT_SCOPES);
        if (body?.code === 'TAX_101') throw new Error(RECONNECT_SCOPES);
      }
      throw new Error(resp.error.message);
    }
    return resp.data as TaxonomyReport;
  },

  async disconnect(provider: string): Promise<void> {
    const { error } = await supabase
      .from('user_connectors')
      .update({ status: 'disconnected', provider_refresh_token: null, updated_at: new Date().toISOString() })
      .eq('provider', provider);
    if (error) throw error;
  },
};

// Extract sender name as #who:slug tag
// "John Doe <john@x.com>" → "#who:john-doe"
// "<john@x.com>" → "#who:john" (from email prefix)
function extractWhoTag(from: string): string | null {
  // Try name part: "Name <email>"
  const nameMatch = from.match(/^([^<]+)</);
  if (nameMatch) {
    const name = nameMatch[1].trim().replace(/["']/g, '');
    if (name) {
      const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      if (slug) return `#who:${slug}`;
    }
  }
  // Fallback: email prefix
  const emailMatch = from.match(/<?\s*([^@]+)@/);
  if (emailMatch) {
    const prefix = emailMatch[1].trim().toLowerCase().replace(/[^a-z0-9-]/g, '');
    if (prefix) return `#who:${prefix}`;
  }
  return null;
}
