// agent-capture — a porta do E. (spec §2.5 · selo S-03 · E. v0)
// O agente (Claude Code, e futuras mãos) escreve no tronco POR AQUI,
// autenticado por segredo, sempre como o usuário do Rick.
// Deploy: supabase functions deploy agent-capture --no-verify-jwt
import { serviceClient, resolveUserId, createCapture, createSoulCheckin, createSessionLog } from '../_shared/tronco.ts';

Deno.serve(async (req) => {
  if (req.method !== 'POST') return new Response('método não suportado', { status: 405 });

  let payload: Record<string, unknown>;
  try {
    payload = await req.json();
  } catch {
    return new Response('json inválido', { status: 400 });
  }

  const secret = Deno.env.get('AGENT_SECRET');
  if (!secret || payload.secret !== secret) {
    return new Response('não autorizado', { status: 401 });
  }

  try {
    const sb = serviceClient();
    const userId = await resolveUserId(sb);
    const kind = String(payload.kind ?? 'capture');

    if (kind === 'soul') {
      const item = await createSoulCheckin(sb, userId, {
        emotion: String(payload.emotion ?? '').trim() || 'sem palavra',
        note: (payload.note as string) ?? null,
        createdBy: 'e-code',
      });
      return Response.json({ ok: true, item });
    }

    if (kind === 'session_log') {
      const item = await createSessionLog(sb, userId, {
        title: String(payload.title ?? 'sessão'),
        notes: String(payload.notes ?? ''),
        eLine: (payload.e_line as string) ?? null,
        tags: (payload.tags as string[]) ?? [],
      });
      return Response.json({ ok: true, item });
    }

    // default: capture — nasce ponto, a triage cuida
    const item = await createCapture(sb, userId, {
      title: String(payload.title ?? '').trim(),
      notes: (payload.notes as string) ?? null,
      tags: (payload.tags as string[]) ?? [],
      createdBy: 'e-code',
    });
    return Response.json({ ok: true, item });
  } catch (e) {
    const err = e as { message?: string; details?: string; code?: string };
    const msg = err?.message ?? JSON.stringify(e).slice(0, 300);
    return Response.json(
      { ok: false, error: msg, details: err?.details ?? null, code: err?.code ?? null },
      { status: 500 },
    );
  }
});
