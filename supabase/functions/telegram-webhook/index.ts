// telegram-webhook — a boca de bolso do E. (@Atomhsbot · E. v0)
// "Atom vem até você": captura de qualquer lugar. Só o chat do Rick entra.
// Pull, nunca push: o bot NUNCA puxa assunto — só responde ao que chega.
// Deploy: supabase functions deploy telegram-webhook --no-verify-jwt
import { serviceClient, resolveUserId, createCapture, createSoulCheckin } from '../_shared/tronco.ts';

const BOT = () => Deno.env.get('TELEGRAM_BOT_TOKEN');

async function reply(chatId: number, text: string) {
  await fetch(`https://api.telegram.org/bot${BOT()}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text }),
  }).catch(() => {});
}

Deno.serve(async (req) => {
  // Telegram manda este header quando o webhook é registrado com secret_token
  const secret = Deno.env.get('TELEGRAM_WEBHOOK_SECRET');
  if (!secret || req.headers.get('x-telegram-bot-api-secret-token') !== secret) {
    return new Response('não autorizado', { status: 401 });
  }

  let update: Record<string, unknown>;
  try {
    update = await req.json();
  } catch {
    return new Response('ok'); // Telegram só precisa de 200
  }

  const msg = update.message as
    | { chat?: { id: number }; text?: string; from?: { id: number } }
    | undefined;
  const chatId = msg?.chat?.id;
  const text = (msg?.text ?? '').trim();
  if (!chatId || !text) return new Response('ok');

  // Allowlist: só o Rick (single-user por lei — D1)
  const allowed = Deno.env.get('TELEGRAM_CHAT_ID');
  if (!allowed || String(chatId) !== allowed) {
    await reply(chatId, 'não te conheço. este é um espelho pessoal.');
    return new Response('ok');
  }

  if (text === '/start' || text.toLowerCase() === 'oi') {
    await reply(chatId, 'aqui. manda o que chegou — vira ponto no tronco.\n"sinto: cansado" registra emoção.');
    return new Response('ok');
  }

  try {
    const sb = serviceClient();
    const userId = await resolveUserId(sb);

    // "sinto: cansado" (ou "sinto cansado") → check-in de soul
    const soulMatch = text.match(/^sinto[:\s]+(.+)$/i);
    if (soulMatch) {
      await createSoulCheckin(sb, userId, {
        emotion: soulMatch[1].split(/[.,\n]/)[0].trim(),
        note: soulMatch[1].trim(),
        createdBy: 'e-telegram',
      });
      await reply(chatId, 'senti contigo. ficou no soul log.');
      return new Response('ok');
    }

    // default: captura — nasce ponto (·), a triage do app cuida
    await createCapture(sb, userId, {
      title: text.split('\n')[0],
      notes: text.includes('\n') ? text : null,
      tags: ['telegram'],
      createdBy: 'e-telegram',
    });
    await reply(chatId, '· capturado');
  } catch (e) {
    await reply(chatId, 'não consegui guardar agora — tenta de novo? (' + String(e).slice(0, 60) + ')');
  }
  return new Response('ok');
});
