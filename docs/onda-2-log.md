# Onda 2 — diário de bordo

> Log corrente da construção do MindRoot V1 ("de dentro pra fora").
> Plano vivo: `docs/specs/spec_mindroot-v1_de-dentro-pra-fora_v0-4.md` (canônica no hub, d-058).
> Convenção: cada entrada = data · o que shipou · commits · o que ficou.

---

## 2026-07-24 — Fase 5: pessoas no calendário (sessão "vamos continuar")

**Arco da sessão:** "vamos continuar fazendo o mindroot?" → Fase 5 desenhada,
2 decisões do Rick seladas, 4 commits — o calendário agora sabe QUEM.

### Decisões (Rick, nesta sessão)
- **Sugestão curada**: attendee desconhecido NUNCA vira pessoa sozinho — o app
  apresenta cards prontos, o Rick decide em 1 toque (honra D1 + padrão Lumen-sugere).
- **Born-committed**: person nasce ○ (stage 7) — uma pessoa É, não matura pelo
  FSM e não sofre entropia (views de audit só olham inbox/connected: invisível
  por construção).

### Os 4 commits
- **Chão** `6660bc1` — migration 012 (`atom_type` + 'person'), registry
  (floor 7, family, body: emails/aliases/relationship), TS union + PersonBody.
- **Olhos** `3ec3bcc` — calendar-sync traz attendees (sem self/salas, email
  lowercase); ingest grava body.attendees + tags #who (padrão do Gmail);
  eventos existentes têm attendees atualizados quando mudam.
- **Mapa** `a734a8f` — engine/people.ts puro (8 testes): match por email e por
  nome/alias em título (palavra inteira, sem acento — o caminho da família,
  que não é attendee). person-service: createPerson, syncEventConnections
  (event —references→ person, idempotente, roda após cada sync), getSuggestions.
- **Rosto** `b81e490` — PersonChips nos eventos (conhecido = cor do módulo,
  clicável; desconhecido = cinza) + PersonSuggestions (banner discreto →
  cards com família·trabalho·amigo; "×" silencia por aparelho via localStorage).

### Estado e gate
- Código completo, 122 testes verdes, build ok. **Pendências de prod (freio 🔴,
  aguardando o sim):** `git push` (CD deploya) · `supabase db push` (migration
  012) · `supabase functions deploy calendar-sync`.
- Aceitação da fase: Rick abre a agenda, vê gente nos eventos, cria as pessoas
  da família a partir das sugestões (ou via alias no título).
- Próxima da spec: **Fase 6 — Routine builder** (cadeias de hábitos sobre
  Recurrence; o zênite ganha estrutura).

---

## 2026-07-23 — o dia das quatro fases (sessão "segue o flow")

**Arco da sessão:** começou com a spec em draft e "vamos trabalhar em cima do mindroot";
terminou com Fases 1–4 no ar, o E. v0 vivo, o app zerado no escopo certo e a lei acordada.

### Lei e plano
- Spec v0.3 (Chat/claude-project, conta Atlas) revisada pelo Code → **v0.4 APROVADA** ("Bora!").
  4 ajustes: A1 chão de infra · A2 estados reais · A3 aurora imersiva · A4 supersessão explícita.
- **ADR d-058** no hub (atom-engine): Onda 2 aberta, spec canônica, **supersession Genesis §3.3**
  (decay 30d → entropia em espiral 8/21/55/89, Genesis intocado). Slot d-057 reservado
  (ADR da Raiz vive no Chat da conta Atlas, não commitado).
- Planos da arqueologia (Karpathy E3–E7, plano_r1) marcados SUPERSEDED — um roadmap só.

### Fase 1 — F2 close (chão) · commits `c6c757c`, `d9b9a37`
- **Timezone UTC→Brisbane**: `engine/dates.ts` (localDayKey), soul-store, token-parser (@hoje),
  export-service + 3 edge functions (parse-input, triage-classify, send-push) em Australia/Brisbane.
- **Aurora começa às 4h** (RITUAL_PERIODS + getCurrentPeriod) — quem madruga recebe "Bom dia".
- **Auth anti-spam**: TOKEN_REFRESHED não re-seta user nem re-aplica tema (guards por useRef).
- **Agenda com fonte única**: horários dos rituais derivam de RITUAL_PERIODS (labels hardcoded mortos).
- **Pro do Supabase LIGADO** (clique do Rick) — free tier hibernava (2× num dia); keep-alive diário
  segue como cinto de segurança (.github/workflows/keepalive.yml).
- **CD reconectado**: o Vercel `mindroot-v2` perdeu o vínculo na transferência do repo; religado
  via Claude-in-Chrome (conta Vercel antiga) → push no master deploya sozinho em
  **www.mindroot.com.au** / mindroot-v2.vercel.app.
- QA sweep mobile: 6 telas auditadas limpas; 1 bug real achado e morto (labels da agenda).

### Fase 2 — Aurora viva · commit `3f9d184`
- `AuroraRitual.tsx` (247L): **respiração** (círculo dourado, 3 ciclos, pulável) → **check-in**
  (emoção/energia/intenção) → **journaling página inteira** (primeira classe, spec §2.2) →
  **chegada** (estado do dia + seeds do último wrap).
- Journaling → item `reflection` born-committed (`soul.ritual_slot=aurora`, module mind) via
  `soulService.persistJournal`.
- Máquina de abertura: abre 1×/dia quando não há chegada no tronco; fecha só no fim. Nunca força.
- AuroraCheckin (embrião E2) **deletado no mesmo commit** — substituição, não convivência.
- Fix: fundo sólido sob gradiente (dark vazava a página por trás do ritual).

### Fase 3 — Crepúsculo · commit `8fc2006`
- **Wrap hidrata a chegada do TRONCO** (`soulService.getTodayArrival`) — Zustand evaporado não
  perde mais o shift (check-in 5h + wrap 20h funcionava só na sorte).
- SoulStep ganhou: **shift visível** ("ansioso → grato · o dia subiu" — nomeia, não julga) ·
  **"o dia escreveu"** (soul log do dia com casa no crepúsculo: chegada + sinto: do Telegram) ·
  **"fechar escrevendo"** (journaling de fechamento → reflection ritual_slot=crepusculo).
- getLastWrap → maybeSingle (406 fora do console).

### Fase 4 — Escada de meaning · commit `a04f6b7`
- `engine/meaning.ts`: **um mecanismo, 5 degraus** — semana←7 wraps · mês←4 semanais ·
  trimestre←3 · semestre←2 · ano←2. Leis encodadas: cada nível lê APENAS o nível abaixo ·
  review perdida não quebra (o ACUMULADO é oferecido) · um convite por vez, degrau mais baixo
  primeiro. **8 testes** (114 no total do repo).
- `review-service`: review = item `type review` born-committed (body: cadence + reads[] + count;
  notes = o meaning escrito pelo humano).
- `pages/Review` (/review): o sistema APRESENTA (dias com shift, e_line, seeds) → o humano
  SIGNIFICA (página) → sela ○. Sair sempre possível.
- `ReviewBanner` na Home: convite discreto, só quando um degrau acordou.

### E. v0 — o companheiro nasce · commit `9114c16`
- **Porta**: edge function `agent-capture` (selo S-03: escrita SEMPRE pela porta do app, como o
  Rick, `source: 'e'`). Kinds: capture (nasce ponto ·) · soul · session_log.
- **Boca**: edge function `telegram-webhook` — bot **@Atomhsbot**, só o chat do Rick
  (secret_token + allowlist). `sinto: X` → soul check-in · resto → captura. **Pull, nunca push.**
- **Mãos**: Claude Code chama a porta (segredos em `.env.local`, gitignored).
- **Primeira voz**: o wrap desta sessão entrou no tronco assinado com a primeira e_line do E.
- Detalhes operacionais: `ops/e-channel.md`.

### Reset do espelho (Sim do Rick: "entulho óbvio + contas fantasma")
- **Export ANTES**: 293KB (123 items do r@) + 13KB (testes) em
  `c:/repos/_archive/atom-reset-export-2026-07-23/`.
- r@ estava LIMPO — único entulho era o "teste de porta" do próprio Code (removido).
- **8 usuários fantasma deletados** (atom-e0-test, aurora-*, f3-*, dbg-*) — auth.users só com
  gente real agora. Conta harness FIXA criada: `e2e-harness@ramalho.au` (reutilizável, não é lixo).
- Duplicatas ("testa", 5× comprar leite) moram na conta **rr@** — migração rr@→r@ segue pendente.

### Decisão de conta
- **O E. escreve em r@ramalho.au** (decisão do Rick) — a conta canon (era a dos 120 items).

### Achados pro D4 (auditoria "cresceu ou foi colado")
- Drift enum: DB `session_log` × TS `session-log`.
- Label "Genesis v5.0.1" no Sobre (lei vai em v5.0.4).

### Estado ao fechar a sessão
| Fase | Estado |
|---|---|
| 1 · F2 close | ✅ fechada e verificada em produção |
| 2 · Aurora | ✅ shipada · aceitação = primeira manhã real do Rick |
| 3 · Crepúsculo | ✅ shipada · aceitação = primeiro wrap real |
| 4 · Escada | ✅ shipada · desperta sozinha com 7 wraps |
| 5–9 | ⚪ aguardando ("pessoas no calendário" é a próxima) |

**Gate atual: o Rick viver o ciclo (aurora → dia com o bot → wrap). Cada noite constrói a 1ª semanal.**
