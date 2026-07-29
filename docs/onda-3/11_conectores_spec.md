# Obra 7 — Conectores: a lente sobre email e calendar

*29 Jul 2026 · primeira obra nascida sob a D67, aberta pelo Rick ("bora
abrir a obra dos conectores — a lente"). Spec primeiro, código depois
(§8.7 do CLAUDE.md). Benchmark em `10_benchmark-conectores.md`.*

## A visão que rege

> "eu posso abrir o gmail e estar bagunçado e abrir o atom e ver o q eu
> preciso de verdade. a gente nao quer fazer o trabalho de todos os apps —
> quer ser a lente em cima, com o proprio filtro" — Rick, 29 Jul
> ([[semente_atom-a-lente]])

Decisões vigentes: **D67** (o Atom é a lente, não o lugar — conector = mão
dupla, ida + volta), **D56** (email = boca, nunca lugar; push = só voz do
E.), **D62** (crivo do topo de mercado — benchmark `10` feito), **D66**
(a válvula: digest raro é o antídoto do "sinal sem hábito"), **D46**
(estado, nunca julgamento), **D52** (uma boca só — o inbox é o gate).
Leis: inbox obrigatório, state machine sequencial, entropy é archive.

## O terreno (o que o código já tem — auditoria de 29 Jul)

| Peça | Estado | Veredito |
|---|---|---|
| `connector-auth` (edge) + `storeTokens` no `useAuth` | vivo, captura refresh token no login Google | **FICA** — com fallback direto que merece teste |
| `gmail-sync` (edge) — `is:starred` últimos 14d, max 20, só headers | vivo, `gmail.readonly` | **FICA** — já é a volta certa (sinal declarado, superfície mínima) |
| `calendar-sync` (edge) — eventos → céu/fixos no HOJE | vivo | **CRESCE** — higiene do sinal (benchmark `10` §2) |
| `connector-service.ingest*` — inbox estágio 1, tags `#who`/`#source`/`#connector`, recorrente→ritual | vivo | **FICA + assentimento visível** — a heurística nunca decide quieta |
| `useConnectors` — sync manual por botão, toasts | vivo | **CRESCE** — depois, cadência (cron) quando a volta for vivida |
| **A ida** (legislar labels/calendários pra fora) | **não existe** | **NASCE** — a parte inédita da obra |
| Testes na cadeia inteira | **zero** | **A OBRA PAGA** — nada novo nasce antes do chão firmar |
| Conector na conta do Rick | desligado | **VIVER** — a lente nunca foi olhada |

## GUARDIÃO — CONSTRAINTS
━━━━━━━━━━━━━━━━━━━━━━
**AtomTypes envolvidos:** note (email), task, ritual (calendar)
**AtomModules:** bridge (itens de conector); a taxonomia projetada na ida
usa os módulos/domínios existentes (`config/raiz.ts`) — não inventar eixo.
**State machine:** todo item da volta nasce estágio 1 (inbox), maturação
por assentimento — a cadeia atual já respeita; a ida NÃO cria AtomItems
(cria estrutura no app externo; o espelho da estrutura é config, não item).
**Tags (lei existente, não inventar):** `#source:gmail` /
`#source:google-calendar` · `#connector` · `#who:slug` ·
`#domain:communication` / `#domain:time`.
**A volta (D67):** só sinal declarado — estrela (Gmail) e hora marcada
(Calendar). NUNCA volume: nada de "importar a caixa", nada de unread count.
**A ida (D67 + benchmark `10` §3):**
- escopos v1: `gmail.labels` + `calendar.app.created` — **zero restricted
  novo**; `gmail.modify` e `gmail.settings.basic` BANIDOS na v1;
- namespace assinado `Atom/…`; preview + assentimento único por estrutura;
- delete no app externo = comando (desativa o braço), nunca recriação
  silenciosa; desligar conector = desfazer completo;
- criar estrutura ≠ mover conteúdo — a v1 nunca move/rotula mensagens;
- reconciliação por diff com log.
**Connections:** `#who:` como tag (atual) + `personService.
syncEventConnections` — connections tipadas item→person seguem o trilho
existente; nada novo de schema.
**Pisos mínimos:** item de conector sem `body.google_id`/`body.gmail_id`
não nasce (é a chave de dedup); estrutura da ida sem preview aceito não
é criada.

⚠ INCERTEZAS (Proporção Invertida) — fechadas na mesa de 29 Jul, exceto a 1:
1. **ABERTA — Regime do projeto GCP** — se está em testing mode, o refresh
   token expira em 7 dias (reconsentimento semanal — mata o viver).
   Resolve-se na etapa 2, vivendo: checar o console GCP com o Rick e
   observar o token. Planejar projeto separado pra produção (cap de 100 é
   vitalício). *(Irmã da pendência das contas Vercel/Supabase duplicadas.)*
2. ✅ **Escopo da ida v1: Gmail + Calendar juntos** (D68). Drive
   explicitamente pra depois.
3. ✅ **Taxonomia projetada: os 9 domínios da vida** (`config/raiz.ts`),
   namespace `Atom/` (D68).
4. ✅ **Cadência: manual agora; cron nasce com o digest D66** — uma
   rotina servindo os dois (registrado na D69).

✓ APROVADO PARA: ESTRUTURA (Root passa batido — zero schema novo; a ida
guarda estado em `user_connectors.metadata`, coluna existente)

## A obra em etapas (proposta)

1. **O chão firma** — testes na cadeia que existe: `extractWhoTag`,
   `ingestCalendarEvents`/`ingestGmailMessages` (dedup, tags, inbox,
   attendees-refresh), contrato dos edge functions (refresh de token,
   erros GMAIL_1xx/2xx). Zero código novo antes disso (D62: base primeiro).
2. **A lente é vivida** — ligar o Calendar na conta do Rick; resolver a
   incerteza 1 (regime GCP) no caminho. Primeira vez que a volta é olhada
   de verdade.
3. **O hoje nunca mente** — higiene do sinal no calendar-sync: filtrar
   recusados/tentative, tratar all-day, timezone, refletir conflito.
   Assentimento mostra a leitura (ritual ⇄ task trocável no chip).
4. **A ida nasce** — `Atom/` no Gmail (`gmail.labels`) + calendário da
   casa (`calendar.app.created`), com preview, assentimento, delete-é-
   sinal, desfazer completo. O Genesis como configurador — o experimento
   do Secretário virando produto.
5. **As fotos** — cenas no guarda do gate: settings/conectores, preview da
   ida, item de conector no inbox com chip de leitura.

Sementes que NÃO entram (registradas): sugestão de estrela por AI (humano
no gate), "aguardando resposta", faturas/vencimentos→cofre, filtros
nativos ensinados, pressão dos próximos dias no HOJE, Drive.

## Decisões ratificadas

- **D68:** a ida é estrutural e reversível — cria taxonomia, nunca move
  conteúdo; zero escopo restricted novo; namespace `Atom/`; delete é
  sinal; desligar = desfazer. Ida v1 = Gmail + Calendar; taxonomia = os
  9 domínios da vida.
- **D69:** a heurística nunca decide quieta — leitura sugerida, visível e
  trocável no assentimento. Cadência manual agora; cron nasce com D66.

---

*Status: **ratificada** (Rick, 29 Jul, mesa uma-de-cada-vez): D67 na
abertura · D68 ida estrutural · D69 leitura visível. Etapa 1 (testes)
**selada** — 12 testes em `connector-service.test.ts`, 257 verdes no
total. Incerteza 1 (regime GCP) fica pra etapa 2, resolvida vivendo.
Próximo: etapa 3 (higiene do sinal) livre; etapa 2 com o Rick presente.*
