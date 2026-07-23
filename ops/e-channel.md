# E. — canal do agente (operação)

> O E. escreve no tronco SEMPRE pela porta do app (selo S-03) — nunca direto na tabela.
> Uma porta, várias bocas. Tudo como o usuário canon (`AGENT_USER_EMAIL`).

## Peças

| Peça | Onde | O quê |
|---|---|---|
| Porta | edge fn `agent-capture` | POST autenticado por `AGENT_SECRET`; kinds: `capture` (nasce ponto ·, triage cuida) · `soul` (checkpoint com body.soul) · `session_log` (wrap de sessão do Code, com `e_line`) |
| Boca Telegram | edge fn `telegram-webhook` | bot **@Atomhsbot** · só o chat do Rick (secret_token do Telegram + allowlist `TELEGRAM_CHAT_ID`) · `sinto: X` → soul · resto → captura · responde curto (`· capturado`) · **pull, nunca push** |
| Helper | `supabase/functions/_shared/tronco.ts` | criação de items padronizada (`source: 'e'`, `created_by: e-code / e-telegram`) |
| Mãos Code | esta máquina | segredos locais em `atom-app/.env.local` (gitignored) |

## Segredos (nomes; valores nunca em repo)

- **Supabase (edge runtime)** — `supabase secrets list`: `AGENT_SECRET`, `AGENT_USER_EMAIL`
  (= r@ramalho.au), `TELEGRAM_BOT_TOKEN`, `TELEGRAM_WEBHOOK_SECRET`, `TELEGRAM_CHAT_ID`.
- **Local (mãos do Code)** — `atom-app/.env.local`: `AGENT_SECRET`, `TELEGRAM_BOT_TOKEN`,
  `TELEGRAM_WEBHOOK_SECRET`.
- ⚠️ O token do bot foi colado uma vez em chat (criação, 23 Jul). Se quiser higiene máxima:
  BotFather → `/revoke` → atualizar `TELEGRAM_BOT_TOKEN` (secret + .env.local) → re-registrar
  webhook (passo abaixo).

## Usar a porta (exemplo, das mãos do Code)

```bash
curl -s -X POST "$VITE_SUPABASE_URL/functions/v1/agent-capture" \
  -H "Content-Type: application/json" \
  -d '{"secret":"$AGENT_SECRET","kind":"capture","title":"ligar pro contador"}'
# kinds: capture {title, notes?, tags?} · soul {emotion, note?} ·
#        session_log {title, notes, e_line?, tags?}
```

## Re-registrar o webhook (se trocar token/segredo)

```bash
curl -X POST "https://api.telegram.org/bot<TOKEN>/setWebhook" \
  -d "url=$VITE_SUPABASE_URL/functions/v1/telegram-webhook" \
  -d "secret_token=<TELEGRAM_WEBHOOK_SECRET>"
```

## Deploy das functions

```bash
supabase functions deploy agent-capture --no-verify-jwt
supabase functions deploy telegram-webhook --no-verify-jwt
```

## Conta harness de teste

`e2e-harness@ramalho.au` — conta FIXA para E2E (não é fantasma; não deletar em limpezas).
Contém dados fake (wraps semeados, reviews). Senha: nos scripts de E2E da sessão (não em repo).

## Regras de alma (não são opcionais)

1. O bot **nunca** puxa assunto — só responde. (Lei: nunca forçar.)
2. Captura nasce ponto (·) sem classificação — a triage do app cuida. O agente organiza, não inunda.
3. `e_line` do wrap de sessão: observação, nunca cobrança. Passa o shame-test ou não sai.
