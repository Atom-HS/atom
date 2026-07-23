// _shared/tronco.ts — a porta única do E. pro tronco (spec §2.5 · selo S-03)
// REGRA: o agente escreve SEMPRE por aqui (edge function = dentro do app),
// nunca direto na tabela. Items nascem como o app os criaria: source 'e'.
import { createClient, SupabaseClient } from 'jsr:@supabase/supabase-js@2';

export function serviceClient(): SupabaseClient {
  return createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  );
}

/** Resolve o user do Rick pelo email (single-user por lei — D1 da spec). */
export async function resolveUserId(sb: SupabaseClient): Promise<string> {
  const email = Deno.env.get('AGENT_USER_EMAIL');
  if (!email) throw new Error('AGENT_USER_EMAIL não configurado');
  const { data, error } = await sb.auth.admin.listUsers({ page: 1, perPage: 200 });
  if (error) throw error;
  const user = data.users.find((u) => u.email?.toLowerCase() === email.toLowerCase());
  if (!user) throw new Error(`usuário ${email} não encontrado`);
  return user.id;
}

export async function createCapture(
  sb: SupabaseClient,
  userId: string,
  params: { title: string; notes?: string | null; tags?: string[]; createdBy: string },
) {
  const { data, error } = await sb
    .from('items')
    .insert({
      title: params.title.slice(0, 200),
      user_id: userId,
      type: null,            // ponto (·) — a triage do app classifica
      module: null,
      tags: params.tags ?? [],
      status: 'inbox',
      state: 'inbox',
      genesis_stage: 1,
      notes: params.notes ?? null,
      body: {},
      source: 'e',
      created_by: params.createdBy,
    })
    .select('id,title')
    .single();
  if (error) throw error;
  return data;
}

export async function createSoulCheckin(
  sb: SupabaseClient,
  userId: string,
  params: { emotion: string; note?: string | null; createdBy: string },
) {
  const { data, error } = await sb
    .from('items')
    .insert({
      title: `sinto — ${params.emotion.slice(0, 60)}`,
      user_id: userId,
      type: 'checkpoint',
      module: 'mind',
      tags: ['checkin', 'telegram'],
      status: 'completed',
      state: 'committed',
      genesis_stage: 7,
      notes: params.note ?? null,
      body: {
        soul: {
          energy_level: null,
          emotion_before: params.emotion,
          emotion_after: null,
          needs_checkin: false,
          ritual_slot: null,
        },
      },
      source: 'e',
      created_by: params.createdBy,
    })
    .select('id,title')
    .single();
  if (error) throw error;
  return data;
}

export async function createSessionLog(
  sb: SupabaseClient,
  userId: string,
  params: { title: string; notes: string; eLine?: string | null; tags?: string[] },
) {
  const { data, error } = await sb
    .from('items')
    .insert({
      title: params.title.slice(0, 200),
      user_id: userId,
      type: 'session_log', // DB enum usa underscore (TS diz 'session-log' — drift conhecido, bug pro D4)
      module: 'bridge',
      tags: ['session', 'code', ...(params.tags ?? [])],
      status: 'completed',
      state: 'committed',
      genesis_stage: 7,
      notes: params.notes,
      body: params.eLine ? { e_line: params.eLine } : {},
      source: 'e',
      created_by: 'e-code',
    })
    .select('id,title')
    .single();
  if (error) throw error;
  return data;
}
