// service/connector-service.test.ts — obra 7, etapa 1 (spec 11): o chão firma.
// A volta ingere sinal (estrela, hora marcada), nasce no inbox estágio 1,
// nunca duplica, e carrega as tags da lei (#source, #connector, #who).
import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  connectorService,
  type CalendarEvent,
  type GmailMessage,
} from '@/service/connector-service';
import { itemService } from '@/service/item-service';
import { supabase } from '@/service/supabase';

vi.mock('@/service/supabase', () => ({
  supabase: { from: vi.fn() },
}));
vi.mock('@/service/item-service', () => ({
  itemService: { create: vi.fn(), update: vi.fn() },
}));

const USER = 'u1';

type ExistingRow = { id: string; body: Record<string, unknown> };

function mockExistingItems(rows: ExistingRow[]): void {
  vi.mocked(supabase.from).mockReturnValue({
    select: () => ({
      eq: () => ({
        not: () => Promise.resolve({ data: rows }),
      }),
    }),
  } as unknown as ReturnType<typeof supabase.from>);
}

function gmailMsg(overrides: Partial<GmailMessage> = {}): GmailMessage {
  return {
    id: 'm1',
    thread_id: 't1',
    subject: 'Fatura julho',
    from: 'John Doe <john@x.com>',
    date: 'Tue, 29 Jul 2026 10:00:00 +1000',
    snippet: 'segue a fatura',
    labels: ['STARRED'],
    ...overrides,
  };
}

function calEvent(overrides: Partial<CalendarEvent> = {}): CalendarEvent {
  return {
    google_id: 'g1',
    title: 'Consulta',
    start: '2026-07-30T10:00:00+10:00',
    end: '2026-07-30T11:00:00+10:00',
    calendar: 'primary',
    recurring: false,
    ...overrides,
  };
}

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(itemService.create).mockResolvedValue({} as never);
  vi.mocked(itemService.update).mockResolvedValue({} as never);
});

describe('ingestGmailMessages — a volta do email (só o sinal)', () => {
  it('email com estrela nasce note no inbox estágio 1, module bridge, com as tags da lei', async () => {
    mockExistingItems([]);

    const created = await connectorService.ingestGmailMessages([gmailMsg()], USER);

    expect(created).toBe(1);
    expect(itemService.create).toHaveBeenCalledTimes(1);
    const arg = vi.mocked(itemService.create).mock.calls[0][0];
    expect(arg).toMatchObject({
      title: 'Fatura julho',
      user_id: USER,
      type: 'note',
      module: 'bridge',
      status: 'inbox',
      state: 'inbox',
      genesis_stage: 1,
    });
    expect(arg.tags).toEqual(
      expect.arrayContaining(['#domain:communication', '#source:gmail', '#connector']),
    );
    // piso mínimo: sem a chave de dedup o item não serve
    expect((arg.body as Record<string, unknown>).gmail_id).toBe('m1');
  });

  it('remetente com nome vira #who:slug do nome', async () => {
    mockExistingItems([]);

    await connectorService.ingestGmailMessages(
      [gmailMsg({ from: 'Maria Silva <maria@x.com>' })],
      USER,
    );

    const arg = vi.mocked(itemService.create).mock.calls[0][0];
    expect(arg.tags).toContain('#who:maria-silva');
  });

  it('remetente sem nome cai pro prefixo do email', async () => {
    mockExistingItems([]);

    await connectorService.ingestGmailMessages(
      [gmailMsg({ from: '<john@x.com>' })],
      USER,
    );

    const arg = vi.mocked(itemService.create).mock.calls[0][0];
    expect(arg.tags).toContain('#who:john');
  });

  it('remetente ilegível não gera tag #who (e não quebra)', async () => {
    mockExistingItems([]);

    await connectorService.ingestGmailMessages([gmailMsg({ from: '???' })], USER);

    const arg = vi.mocked(itemService.create).mock.calls[0][0];
    expect((arg.tags ?? []).some((t: string) => t.startsWith('#who:'))).toBe(false);
  });

  it('assunto vazio ganha "(sem assunto)"', async () => {
    mockExistingItems([]);

    await connectorService.ingestGmailMessages([gmailMsg({ subject: '' })], USER);

    const arg = vi.mocked(itemService.create).mock.calls[0][0];
    expect(arg.title).toBe('(sem assunto)');
  });

  it('gmail_id já ingerido não duplica — UUID é eterno, sinal também', async () => {
    mockExistingItems([{ id: 'i1', body: { gmail_id: 'm1' } }]);

    const created = await connectorService.ingestGmailMessages(
      [gmailMsg({ id: 'm1' }), gmailMsg({ id: 'm2', subject: 'Outro' })],
      USER,
    );

    expect(created).toBe(1);
    expect(itemService.create).toHaveBeenCalledTimes(1);
    const arg = vi.mocked(itemService.create).mock.calls[0][0];
    expect((arg.body as Record<string, unknown>).gmail_id).toBe('m2');
  });
});

describe('disconnect — desligar desfaz primeiro, token morre por último (D68)', () => {
  function mockConnectorsTable(metadata: Record<string, unknown>, ordem: string[]) {
    vi.mocked(supabase.from).mockImplementation(((table: string) => {
      if (table !== 'user_connectors') throw new Error(`tabela inesperada: ${table}`);
      return {
        select: () =>
          Promise.resolve({
            data: [{ provider: 'google', status: 'connected', last_sync_at: null, metadata }],
            error: null,
          }),
        update: () => {
          ordem.push('token-morre');
          return { eq: () => Promise.resolve({ error: null }) };
        },
      };
    }) as unknown as typeof supabase.from);
  }

  it('com ida viva: remove roda ANTES de queimar o token', async () => {
    const ordem: string[] = [];
    mockConnectorsTable({ taxonomy: { version: 1, gmail: { health: 'L1' }, calendar: null, disabled: [], applied_at: 'x' } }, ordem);
    const remove = vi
      .spyOn(connectorService, 'taxonomySync')
      .mockImplementation(async (action) => {
        ordem.push(`taxonomy-${action}`);
        return { action } as never;
      });

    const { desfezIda } = await connectorService.disconnect('google');

    expect(desfezIda).toBe(true);
    expect(ordem).toEqual(['taxonomy-remove', 'token-morre']);
    remove.mockRestore();
  });

  it('desfazer que falha RECUSA o desligar — o token sobrevive pro desfazer de amanhã', async () => {
    const ordem: string[] = [];
    mockConnectorsTable({ taxonomy: { version: 1, gmail: { health: 'L1' }, calendar: null, disabled: [], applied_at: 'x' } }, ordem);
    const remove = vi
      .spyOn(connectorService, 'taxonomySync')
      .mockRejectedValue(new Error('lá fora não respondeu'));

    await expect(connectorService.disconnect('google')).rejects.toThrow();
    expect(ordem).toEqual([]); // o update do token NUNCA rodou
    remove.mockRestore();
  });

  it('sem ida viva: desliga direto, sem chamar o remove', async () => {
    const ordem: string[] = [];
    mockConnectorsTable({}, ordem);
    const remove = vi.spyOn(connectorService, 'taxonomySync');

    const { desfezIda } = await connectorService.disconnect('google');

    expect(desfezIda).toBe(false);
    expect(remove).not.toHaveBeenCalled();
    expect(ordem).toEqual(['token-morre']);
    remove.mockRestore();
  });
});

describe('ingestCalendarEvents — a volta do calendar (hora marcada é céu)', () => {
  it('evento único nasce task no inbox estágio 1 com as tags da lei', async () => {
    mockExistingItems([]);

    const created = await connectorService.ingestCalendarEvents(
      [calEvent({ recurring: false })],
      USER,
    );

    expect(created).toBe(1);
    const arg = vi.mocked(itemService.create).mock.calls[0][0];
    expect(arg).toMatchObject({
      type: 'task',
      module: 'bridge',
      status: 'inbox',
      state: 'inbox',
      genesis_stage: 1,
    });
    expect(arg.tags).toEqual(
      expect.arrayContaining(['#domain:time', '#source:google-calendar', '#connector']),
    );
    expect((arg.body as Record<string, unknown>).google_id).toBe('g1');
  });

  it('all_day atravessa até o body (o hoje nunca mente — sem hora falsa)', async () => {
    mockExistingItems([]);

    await connectorService.ingestCalendarEvents(
      [calEvent({ start: '2026-07-30', end: '2026-07-31', all_day: true })],
      USER,
    );

    const arg = vi.mocked(itemService.create).mock.calls[0][0];
    expect((arg.body as Record<string, unknown>).all_day).toBe(true);
  });

  it('evento recorrente nasce ritual (leitura sugerida — o assentimento é o gate)', async () => {
    mockExistingItems([]);

    await connectorService.ingestCalendarEvents([calEvent({ recurring: true })], USER);

    const arg = vi.mocked(itemService.create).mock.calls[0][0];
    expect(arg.type).toBe('ritual');
  });

  it('participantes viram #who e vão pro body', async () => {
    mockExistingItems([]);

    await connectorService.ingestCalendarEvents(
      [calEvent({
        attendees: [
          { email: 'ana@x.com', name: 'Ana Lima', response: 'accepted' },
          { email: 'bob@x.com', name: null, response: null },
        ],
      })],
      USER,
    );

    const arg = vi.mocked(itemService.create).mock.calls[0][0];
    expect(arg.tags).toEqual(expect.arrayContaining(['#who:ana-lima', '#who:bob']));
    expect((arg.body as Record<string, unknown>).attendees).toHaveLength(2);
  });

  it('google_id já ingerido não duplica', async () => {
    mockExistingItems([{ id: 'i1', body: { google_id: 'g1' } }]);

    const created = await connectorService.ingestCalendarEvents(
      [calEvent({ google_id: 'g1' }), calEvent({ google_id: 'g2', title: 'Outro' })],
      USER,
    );

    expect(created).toBe(1);
    expect(itemService.create).toHaveBeenCalledTimes(1);
  });

  it('participantes mudaram → o tronco atualiza (update com body merged)', async () => {
    const attendees = [{ email: 'ana@x.com', name: 'Ana Lima', response: 'accepted' }];
    mockExistingItems([
      { id: 'i1', body: { google_id: 'g1', start: '2026-07-30T10:00:00+10:00', attendees: [] } },
    ]);

    const created = await connectorService.ingestCalendarEvents(
      [calEvent({ google_id: 'g1', attendees })],
      USER,
    );

    expect(created).toBe(0);
    expect(itemService.create).not.toHaveBeenCalled();
    expect(itemService.update).toHaveBeenCalledTimes(1);
    const [id, patch] = vi.mocked(itemService.update).mock.calls[0];
    expect(id).toBe('i1');
    // o merge preserva o corpo existente — nunca sobrescreve o tronco
    expect(patch.body).toMatchObject({
      google_id: 'g1',
      start: '2026-07-30T10:00:00+10:00',
      attendees,
    });
  });

  it('participantes iguais → não toca no item (sem update fantasma)', async () => {
    const attendees = [{ email: 'ana@x.com', name: 'Ana Lima', response: 'accepted' }];
    mockExistingItems([{ id: 'i1', body: { google_id: 'g1', attendees } }]);

    const created = await connectorService.ingestCalendarEvents(
      [calEvent({ google_id: 'g1', attendees })],
      USER,
    );

    expect(created).toBe(0);
    expect(itemService.update).not.toHaveBeenCalled();
  });
});
