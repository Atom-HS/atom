# Obra 8 — a válvula do cofre e o cron da volta

*29 Jul 2026 · a decisão D66 vira código, junto com a cadência da D69:
uma rotina só servindo os dois. Spec primeiro (§8.7). Benchmark: `09`
(Life OS morre quieto) e `10` (sinal sem hábito mata a lente).*

## As leis que regem

- **D66** — validade/ausência ganham UM canal assíncrono raro: digest na
  voz do E. pelo Telegram, **só quando há algo vencendo ou ausente**.
  Estado, nunca alarme (D46).
- **D69 (cadência)** — o cron da volta nasce junto com o digest: a mesma
  rotina sincroniza a lente e olha o cofre.
- **"Pull, nunca push"** (telegram-webhook) — o digest é a ÚNICA exceção,
  sancionada pela D66. O bot continua nunca puxando assunto; a casa fala
  uma vez por dia, no máximo, e só com motivo.
- **Leitura do cofre** — a lei já existe em `engine/vault.ts` (D63):
  lead time por domínio (documents 270d, identity/90, finance/health 60,
  default 30), ausência por evento significativo (`touch`/`checkin`/
  `protocol_run` + criação de item), NUNCA `updated_at`, limiar 90 dias.
  A edge ESPELHA essas regras — o arquivo canônico é o engine; qualquer
  mudança nasce lá e o espelho segue.

## GUARDIÃO — CONSTRAINTS
━━━━━━━━━━━━━━━━━━━━━━
**Schema:** zero tabela nova. Migration só habilita `pg_cron`+`pg_net` e
agenda o job. O segredo do digest vive no **Supabase Vault**
(`digest_secret`) — nunca em migration/repo (§8.4); a edge o lê em
runtime pra validar o header `x-digest-secret`, o cron o lê pra enviá-lo.
**Single-user por lei** (D1 da spec do E.): `resolveUserId` via
`AGENT_USER_EMAIL`, envio via `TELEGRAM_CHAT_ID` — trilhos existentes.
**A volta no cron:** a edge invoca `calendar-sync`/`gmail-sync` (já
deployadas) e ingere server-side com o MESMO contrato do client
(canônico: `connector-service.ingest*` — dedup por `google_id`/`gmail_id`,
inbox estágio 1, tags da lei). Falha da volta NÃO cala o cofre: são
braços independentes.
**O raro é lei:** sem nada vencendo nem ausente → não envia, retorna
`{sent:false}`. Voz do E. na Lei do Tom: você, estado, sem exclamação,
número convida.
**Pisos:** digest sem motivo não sai; header sem segredo não entra (401).

⚠ INCERTEZAS: horário do digest (proposta: 7h15 Brisbane = 21h15 UTC,
depois da aurora) — ajustável por SQL sem re-deploy.

✓ APROVADO PARA: ESTRUTURA (edge `daily-digest` + migration do cron)

## Etapas

1. Edge `daily-digest`: secret via Vault → volta (sync+ingest) → cofre
   (espelho do vault.ts) → composição na voz do E. → Telegram.
2. Migration `enable_digest_cron`: extensões + `cron.schedule` diário
   lendo o segredo do Vault.
3. Segredo semeado no Vault (one-off, fora do repo).
4. Dry-run com dado real (`{dry_run:true}`) antes do primeiro envio.

---

*Status: em execução — decisões todas pré-existentes (D66/D69/D63),
mesa dispensada.*
