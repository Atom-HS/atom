# Análise crítica de linhagem — MindMate → MindRoot v2 → Atom

**Data:** 2026-06-11 · **Autor:** Claude Code (sessão com Rick) · **Status:** v1 — pra discussão
**Fontes:** docs MindMate beta.2 (EXECUTIVE_SUMMARY, FULL_DOCUMENTATION, ARCHITECTURE, API, CHANGELOG, fornecidos pelo Rick) · git `rsmramalho/atom-core` (clonado read-only em `c:/tmp/mindmate-analise/atom-core`) · `c:/repos/atom-app` (código + docs) · `c:/repos/atom-zero-experiment` · `c:/repos/DeepminD/projeto-e` (CONCEITO.md, WIREFRAME_V2.md) · `c:/repos/ricardo/law/system_spec_atom-identidade_v1-3.md`

> Convenção: **[F]** = fato com evidência · **[I]** = inferência minha · **[O]** = opinião/veredito meu.

---

## F1 — Arqueologia do MindMate (atom-core)

### O que o git diz

**[F]** 743 commits no `rsmramalho/atom-core`, em duas rajadas:

| Período | Commits | O que nasceu |
|---|---|---|
| 2025-01 | 1 | template Vite/React/shadcn (Lovable scaffold) |
| **2025-12** | **459** | alpha.1 → alpha.20: todos os 12 engines core, RC.1 "FORK POINT" (16/Dez), PWA, analytics, landing |
| 2026-01/02 | 0 | **pausa total de ~2,5 meses** |
| **2026-03** | **283** | alpha.21 → beta.2 (04–20/Mar): auditoria, auth refactor, push VAPID, **colaboração multi-user**, AI weekly summary, error tracking, wiki |

**[F]** Sem tags no git. Sem branches além de main. 203 arquivos .ts/.tsx em src, 25 arquivos de teste, 33 migrations Supabase.

**[F]** O CHANGELOG do RC.1 (2025-12-16) declara textualmente: *"🎯 FORK POINT: … a equipe faz fork desta versão para desenvolvimento do aplicativo de produção"*.

### O que o MindMate É (catálogo de features, beta.2)

**[F]** Conforme EXECUTIVE_SUMMARY + FULL_DOCUMENTATION:

1. **12 engines:** Parsing (`@hoje`, `#tags`, `#mod_*`), Inbox, MacroPicker, Dashboard (Focus/Today/Ritual), Calendar (mensal/semanal + DnD), Ritual (Aurora/Zênite/Crepúsculo + check-in), Reflection (prompts guiados + busca full-text + export MD/JSON/PDF), List (Keep-style, 18 cores), Recurrence (RRULE + projeção virtual), Smart Suggestions (6 regras heurísticas), Error Dashboard, Wiki.
2. **Colaboração multi-user completa:** roles owner/editor/viewer, convites com código/expiração/limite, activity feed realtime, RLS por role com security-definer functions, testes E2E cross-user.
3. **PWA de verdade:** instalável, offline-first com fila IndexedDB + auto-sync, cache localStorage, service worker com NetworkFirst/CacheFirst, splash screens iOS, push notifications VAPID via Edge Functions + pg_cron.
4. **Qualidade industrial:** 150+ testes (Vitest + Playwright E2E + regressão visual), CI GitHub Actions 3 jobs, Zero Any Policy (50/50), error tracking em produção, Zod em todos os formulários, a11y WCAG (beta.1).
5. **Integrity Guards (B.3):** Reflection Lock (reflexão nunca completa), Milestone Isolation, MacroPicker atômico — regras semânticas na camada de dados.
6. **Modelo:** single table `items` com `type` (7 valores), `module` (work/body/mind/family/geral), `completed` boolean, milestones como task+`#milestone`+`weight`, state machine só pra projetos (draft/active/paused/completed/archived), progress híbrido (auto/milestone/manual).
7. **IA:** weekly summary via **Gemini Flash** (não Claude) + sugestões heurísticas sem IA.
8. **Posicionamento (landing):** "Mindful control", 3 Pilares da Soberania, *"Gratuito para todos. Open source. Doe se puder."*

### Prometido vs comitado

**[F]** O que a doc lista como "Próximas Etapas" (nunca feito): CSP headers, widgets nativos, API pública, temas customizáveis. Todo o resto listado foi comitado — **a doc é honesta com o código** [I: amostragem por estrutura de arquivos do checkout; não auditei arquivo a arquivo].

---

## F2 — Linhagem: o que sobreviveu, mutou, morreu, ou se perdeu

### A correção histórica (o achado nº 1)

**[F]** O doc oficial de ponte, `atom-app/docs/history/mindmate-tag-v1-ux.md`, afirma:

> *"Implementation platform: Lovable (planejado, não iniciado)"* (linha 91)
> *"Stack planejada (não chegou a ser implementada como MindMate)"* (linha 88)
> *"Lovable como platform … Descartado em 02/03/2026 (D-003 rebuild) — atom-core Lovable arquivado, rebuild do zero"* (linha 117)

**[F]** Isso é **falso nos dois sentidos**: o atom-core foi sim implementado (743 commits, beta.2 completo), e **continuou recebendo 283 commits entre 04 e 20/Mar/2026 — DEPOIS da suposta decisão de descarte em 02/Mar**. Colaboração, push, AI summary e error tracking nasceram todos *depois* da data registrada do "descarte".

**[I]** Existiram **duas encarnações distintas** chamadas "MindMate":
1. **MindMate Tag V1** (Out 2025, Project no Claude.ai): Universal Card, tags 3 eixos, integration score, pastel por módulo — *conceito*, nunca buildado. É só isso que o doc histórico captura.
2. **MindMate — Atom Engine 4.0** (atom-core, Dez 2025–Mar 2026): o app Lovable completo. **Este nunca foi consolidado na história do ecossistema.** O doc histórico do atom-app o reduz a uma linha ("arquivado").

**[F]** Há ainda **dois D-003 conflitantes**: o "D-003 rebuild" de 02/03/2026 (citado no doc histórico, arquivo não localizado nos repos) e o `d-003_mindroot-branch-canonico_2026-05-05.md` no repo `atom`. Numeração duplicada entre gerações de repos.

**[F]** Open loop antigo confirmado: o whitepaper v4.4.1 segue não localizado (linha 123 do doc histórico).

### Timeline consolidada da linhagem

```
Out 2025      MindMate Tag V1 (Claude.ai project) — conceito Universal Card
Dez 2025      atom-core no Lovable: 459 commits → RC.1 "FORK POINT" (16/Dez)
Jan–Fev 2026  pausa
02/Mar 2026   suposta decisão de rebuild (D-003 rebuild — doc não localizado)
04–20/Mar     atom-core: +283 commits → beta.2 (colab, push, AI, errors, wiki)
01/Abr 2026   atom-app (MindRoot v2) nasce do zero: "fase 1 (sementes)"
Abr 2026      deriva de repos (mindroot × mindroot-v2 × 3 Vercel)
05/Mai 2026   d-003 branch canônico: master do mindroot-v2 vence
22/Mai 2026   último commit do atom-app (refactor captura manual-first)
23/Mai 2026   último commit do atom-zero-experiment (secretário E. 5/5, Gmail)
11/Jun 2026   hoje — projeto-e define Home B+C, Atom = ERP de presença
```

### Tabela de linhagem feature a feature

Legenda: ✅ sobreviveu · 🔄 mutou · ⚰️ morreu por decisão · 🕳️ **perdeu-se sem decisão registrada** (o ouro).

| Feature | atom-core (MindMate 4.0) | atom-app (Atom hoje) | atom-zero (Experience) | Transição |
|---|---|---|---|---|
| Single table `items` | ✅ 7 types, boolean completed | ✅ 22 types, FSM 7 estágios, body JSONB | 7 estágios glíficos | 🔄 mutou — **schema v2 é superior** |
| Parsing de tokens | ✅ maduro | ✅ + manual-first híbrido (22/Mai) | captura única | ✅ sobreviveu |
| Inbox/captura | ✅ | ✅ pipeline 7 estágios | UMA boca (@) | 🔄 mutou — vira a face @ |
| Triage | heurística (MacroPicker) | **IA real** (edge function, 3 bandas de confiança) | — | 🔄 mutou pra melhor |
| Dashboard | Focus/Today/Ritual | HomePage (SoulCard, wrap banner) | arco HOJE | 🔄 em mutação → Home B+C |
| Ritual 3 períodos + check-in | ✅ imersivo, perguntas por período | ✅ slots + wrap | ✅✅ **vivido** (respiração, emoção) | ✅ sobreviveu e aprofundou |
| Wrap (fechamento) | ❌ não existia | ✅ 7 steps | crepúsculo | nasceu no v2 |
| Journal: prompts guiados (20+, 6 categorias) | ✅ | ❌ | journal simples | 🕳️ **perdido sem decisão** |
| Journal: export MD/JSON/PDF | ✅ | ❌ | — | 🕳️ perdido |
| Busca full-text com highlight | ✅ | ✅ engine/search.ts | — | ✅ |
| Habit streaks + heatmap | ✅ | ❌ | — | 🕳️ perdido — **[I]** possivelmente implícito (streak = mecânica de cobrança, conflita com sem-shame; mas não há decisão escrita) |
| Recurrence RRULE + projeção virtual | ✅ | ⚠️ só `body.recurrence` ext, sem motor visível | **cadência φ** (outra filosofia) | 🕳️ perdido / 🔄 disputando com φ |
| Calendar mensal+semanal+DnD | ✅ | ⚠️ week strip + day view | fixos do dia | 🕳️ parcialmente perdido (mensal, DnD) |
| Google Calendar/Gmail/Drive connectors | ❌ | ✅ `user_connectors` (migration 008) | Gmail draft (E.) | nasceu no v2 — **peça do ERP de presença** |
| Listas Keep-style | ✅ 18 cores | type existe, UI incerta | — | 🕳️ semi-perdido |
| Projects: progress híbrido (auto/milestone/manual, pesos) | ✅ | ⚠️ progress simples | — | 🕳️ o motor rico se perdeu |
| Projects: state machine | ✅ 5 estados | ✅ `atom_status` 8 estados | — | ✅ mutou |
| **Colaboração multi-user** (roles/convites/feed/RLS) | ✅ **completa e testada** | ❌ nada | — | 🕳️ **a maior perda sem decisão** |
| **PWA offline** (IndexedDB queue + sync) | ✅ completa | ⚠️ só OfflineBanner | local-first (IndexedDB) | 🕳️ **perda crítica** |
| **Push notifications VAPID** | ✅ + pg_cron | ❌ | — | 🕳️ perdido |
| Smart suggestions | ✅ 6 regras | sprint5 "AI companion" **revertido** (`fix(stabilize): revert 8 sprints`) | bilhetes do E. | 🔄/🕳️ — virou conceito E., implementação caiu no revert |
| AI summary | ✅ Gemini Flash | — | — | ⚰️ **[I]** substituído conceitualmente pelo wrap (e Gemini conflita com stack Claude) |
| Onboarding (welcome/tour/checklist gamificado) | ✅ + analytics | Raiz welcome overlay | — | 🔄 mutou (doors da Raiz) — checklist gamificado 🕳️ |
| Command palette ⌘K + keyboard-first | ✅ | não localizado | — | 🕳️ perdido |
| Analytics de produtividade | ✅ gráficos, comparativos | ✅ 3 tabs | **Árvore φ** (espelho, não cobrança) | 🔄 em mutação → deve virar ÁRVORE |
| Error tracking + admin dashboard | ✅ | ❌ | — | 🕳️ perdido |
| Testes/CI | **150+ testes, 3 jobs CI, zero-any** | 15 arquivos, ~630L | — | 🕳️ **o padrão de qualidade regrediu ~90%** |
| Integrity guards na camada de dados | ✅ 3 guardas + 21 testes | ✅ 4 portões (estágio □) | — | ✅ mutou pra melhor (portões > guardas) |
| Raiz (gênese pessoal, 9 domínios, doors) | ❌ | ✅ completa | 9 domínios (conjunto DIFERENTE) | nasceu no v2 |
| Soul/emoção | tags `#mood:*` | ✅ soul extension (before/after, energy) | ✅ emoção aurora/crepúsculo | ✅ aprofundou |
| Connections tipadas | ❌ | ✅ 8 relações | constelação | nasceu no v2 |
| Árvore φ (8 ramos real×ideal) | ❌ | ❌ | ✅ | só existe no experimento |
| E. companheiro ND | ❌ | ⚠️ (AI companion revertido) | ✅ secretário 5/5 | só existe no experimento + spec projeto-e |
| Landing/posicionamento | "open source, doe se puder" | redesign sprint7 | — | 🔄 — copy precisa passar pela identidade v1.3 |

**[F]** Detalhe não-trivial: os **9 domínios da Raiz divergem entre atom-app e atom-zero**. atom-app (`config/raiz.ts`): identidade, documentos, saúde, finanças, arquivos, memórias, tempo, comunicação, projetos. atom-zero (`atomStore.ts`): corpo, mente, alma, amor, família, trabalho, criação, mundo, casa. São duas ontologias diferentes com o mesmo nome. Memória do ecossistema já flagava "buraco lei×app" nos 9 domínios.

---

## F3 — Estado atual das três peças

### atom-app (a base do release) — beta.1 real

**[F]** 188 commits (01/Abr–22/Mai), ~12.850 linhas, 99 arquivos, 14 rotas todas renderizáveis. Schema v2: `items` (FSM 8 estados, 22 types, 8 módulos, body JSONB) + `item_connections` (8 relações) + `user_connectors` (Google). Triage IA com 3 bandas. Wrap 7 steps. Raiz completa. 15 arquivos de teste.

**[F]** O commit `fix(stabilize): revert 8 sprints + domain tags EN + search nav` reverteu trabalho dos sprints (incluindo AI companion do sprint5; analytics raiz do sprint6; landing do sprint7 — extensão exata do revert **a confirmar com o Rick**).

**[F]** Easter egg vivo: `src/features/raiz/mindmate.ts` — digitar "mindmate" em qualquer input dispara quotes por módulo. O precursor virou fantasma carinhoso dentro do sucessor.

**[O]** Maturidade: esqueleto conceitual excelente, end-to-end funcional, mas com regressão de qualidade industrial vs atom-core e três meses de pó (último commit 22/Mai).

### atom-zero-experiment (a "Atom Experience") — o laboratório de UX

**[F]** Vite + React 19 + Zustand + IndexedDB local (sem backend). Aurora/zênite/crepúsculo com respiração, 7 glyphs (· — △ □ ⬠ ⬡ ○), árvore/constelação, Norte, fenestras, pessoas, cadência φ, e o **secretário E. (5/5, integração Gmail draft, 23/Mai)**. MORNING.md documenta o ritual matinal vivido.

**[I]** É isto que o Rick chama de "Atom Experience": a experiência de presença testada em código antes de virar produto. Nenhum arquivo/doc usa o termo literal — **confirmar com o Rick**.

### projeto-e (a âncora de produto)

**[F]** CONCEITO.md: *"O Atom é o ERP de presença: a pessoa vive, o @ opera, o negócio conecta."* 4 mudas que transplantam: E. companheiro (a mais valiosa), Árvore φ, Tom (lei da palavra: shame·oráculo·chegada), agendamento por momento. Home B+C (decisão 11/Jun): *"o dia recebe; a árvore mora na Home respirando; no crepúsculo, a árvore assume."* WIREFRAME_V2: 3 faces — **HOJE / ÁRVORE / @** + norte + ajustes. Regra: *código não migra, reescreve* (a forma transplanta, não os arquivos).

---

## F4 — Análise crítica e veredito por feature

### As três gerações em uma frase cada **[O]**

- **atom-core (MindMate 4.0)** = **o corpo operacional**: engenharia madura, app-shell completo, PWA real, colaboração — mas alma de *app de produtividade com verniz zen*. O "integration score" e os streaks são GTD vestido de mindfulness.
- **atom-app (Atom/MindRoot v2)** = **o esqueleto da lei**: Genesis encarnada, geometria de 7 estágios, raiz, wrap, connections, triage IA — profundo, mas operacionalmente mais pobre que o avô (sem offline, sem push, sem colaboração, 10% dos testes).
- **atom-zero (Experience)** = **a alma**: presença vivida, ritual que respira, árvore φ, E. — mas é um protótipo local sem backend.

**[O] A crítica central:** o rebuild de Abril ganhou profundidade conceitual ao custo de uma **regressão operacional silenciosa**. Nenhum doc decide "vamos abrir mão de offline, push, colaboração e 150 testes" — isso simplesmente evaporou no "rebuild do zero". O release não precisa re-decidir a filosofia (ela está decidida e é melhor); precisa **resgatar cirurgicamente a engenharia que o avô já tinha pago**.

**[O] A crítica inversa, igualmente importante:** nem tudo que o atom-core tinha merece voltar. Streaks/heatmap, checklist gamificado, "integration score", AI summary de produtividade — tudo isso falha no teste do Tom (shame·oráculo·chegada) e na âncora *presença sobre produtividade*. A perda foi correta; só faltou ser **decidida por escrito**.

### Matriz de veredito

Âncora dos vereditos: ERP de presença · Home B+C · 3 faces · sem-shame · lei v1.3. Esforço: P (dias), M (1–2 semanas), G (3+ semanas).

| # | Feature | Origem | Veredito | Esforço | Justificativa |
|---|---|---|---|---|---|
| 1 | Schema v2 (FSM 7 estágios + body JSONB + connections) | atom-app | **CORE** | — | já existe; é o contrato Genesis |
| 2 | Captura manual-first + parsing | atom-app | **CORE** | — | já existe (22/Mai) |
| 3 | Triage IA 3 bandas | atom-app | **CORE** | — | já existe |
| 4 | Wrap 7 steps | atom-app | **CORE** | P (ajustes) | vira o crepúsculo da face HOJE |
| 5 | Raiz 9 domínios + doors | atom-app | **CORE** | P | **resolver divergência das duas ontologias** (q. agenda) |
| 6 | Home B+C / 3 faces (HOJE·ÁRVORE·@) | projeto-e + atom-zero | **CORE — construir** | **G** | é O trabalho do release; reescreve, não migra |
| 7 | Árvore φ (8 ramos real×ideal, síntese) | atom-zero | **CORE — transplantar** | M/G | a muda nº 2; substitui Analytics como espelho |
| 8 | E. companheiro + protocolos | atom-zero + projeto-e | **CORE — transplantar** | G | a muda nº 1; absorve smart-suggestions como "bilhetes" |
| 9 | PWA offline (fila IndexedDB + sync) | atom-core | **RESGATAR** | M | presença exige funcionar na rua; padrão já provado no avô |
| 10 | Push notifications VAPID + pg_cron | atom-core | **RESGATAR** | P/M | protocolos do E. precisam de lembrete com app fechado |
| 11 | Prompts de reflexão guiados (20+, categorias) | atom-core | **RESGATAR** | P | conteúdo pronto; entra no check-in/journal com o Tom revisado |
| 12 | Padrão de testes + CI (Vitest/Playwright/Actions) | atom-core | **RESGATAR** | M | o padrão, não os testes em si; condição de release |
| 13 | Error tracking produção + admin | atom-core | **RESGATAR** | P | ops mínima de release |
| 14 | Command palette / keyboard-first | atom-core | RESGATAR | P | desktop power-use barato |
| 15 | Export journal (MD/JSON/PDF) | atom-core | RESGATAR | P | soberania de dados — coerente com a lei |
| 16 | Progress híbrido com pesos | atom-core | FUNDIR | P | enriquece projects do v2 onde fizer sentido |
| 17 | Calendar mensal + DnD | atom-core | FUNDIR/ADIAR | M | week-strip basta pro v1? (q. agenda) |
| 18 | Recurrence RRULE | atom-core | **DISCUTIR** | M | RRULE (mecânica) × cadência φ (forma) — decisão de produto, não técnica |
| 19 | Onboarding welcome/tour | atom-core | FUNDIR | P | padrão visual sim; conteúdo = doors da Raiz |
| 20 | Listas Keep-style | atom-core | **RESGATAR — puxada pro v1 pelo Rick (11 Jun)** | P | "um lugar pra cobrir o simples — compra leite"; UI mínima na face @, padrão do List Engine do avô |
| 21 | **Colaboração multi-user** | atom-core | **ADIAR p/ v2 — decidir por escrito** | G | a peça mais valiosa do avô; "família" é módulo do Atom → colaboração é o futuro natural, mas não o release |
| 22 | Streaks + heatmap | atom-core | **MATAR (com selo)** | — | mecânica de cobrança; falha shame-test; a árvore φ é a resposta |
| 23 | Checklist gamificado onboarding | atom-core | **MATAR** | — | gamificação ≠ presença |
| 24 | AI weekly summary (Gemini) | atom-core | **MATAR** | — | o wrap já é isso, melhor e com assentimento; stack IA = Claude |
| 25 | Smart suggestions heurísticas | atom-core | MATAR (conceito já absorvido) | — | renasce como bilhetes do E., com Tom |
| 26 | Wiki super manual in-app | atom-core | MATAR | — | docs morarão no site |
| 27 | Error Dashboard com CSV/gráficos | atom-core | MATAR (ficar só tracking) | — | overkill pra v1 |
| 28 | Analytics de produtividade | ambos | MATAR → vira ÁRVORE | — | "síntese sem cobrança" substitui métrica |

### Adendo (11 Jun, tarde) — autópsia do `revert 8 sprints` **[F]**

Commit `e276735` (06/Abr/2026), body explícito: rollback pro `8c4ff4d` + *"Sprint code remains in git history for future cherry-pick"*. O que cada sprint era e o estado REAL no HEAD de hoje:

| Sprint | O que era | Estado no HEAD hoje |
|---|---|---|
| 1 | shell desktop responsivo (`SidebarNav.tsx` 205L + `useBreakpoint.ts`) | **morto** — cherry-pick candidato pro R1 (as 3 faces precisam de shell responsivo) |
| 2 | soul patterns — insights em linguagem natural (`SoulPanel.tsx`) | **VIVO** (referenciado em `Analytics.tsx`) |
| 3 | raiz visual — gradient ring + stage bars | **VIVO** (gradient presente em `Raiz.tsx`) |
| 4 | connectors E2E — auto-sync | vivo (mudanças pequenas em `useConnectors`/`useAuth`) |
| 5 | **AI companion** — `CompanionSheet.tsx` (196L) + `engine/companion.ts` (104L) + store wiring | **morto — É O PROTO-E.** 300 linhas prontas pra cherry-pick no R2 |
| 6 | analytics raiz tab — domain health | **morto** (zero menção a raiz em `Analytics.tsx`) — irrelevante: Analytics vira ÁRVORE |
| 7 | landing redesign — "sells value, not architecture" | estado incerto (houve fix posterior `5f85cb7`; conferir no R4) |
| 8 | testes (companion/search/soul, 255L) + CLAUDE.md beta.1 | **testes mortos** — cherry-pick junto com os sprints 1 e 5 |

**[O]** Implicação pro roadmap: **R2 (o E. encarna) tem 300 linhas de vantagem** no commit `5022aae` — a UI de sheet, o slot de engine e o wiring de store são reaproveitáveis; o *conteúdo* (sugestões contextuais de produtividade) é o que se reescreve com o Tom do E. E o R1 herda o shell responsivo do sprint 1. O revert também migrou as keys dos 9 domínios da Raiz PT→EN (`raiz.ts`) — labels seguem PT.

### Buracos que nenhuma geração resolve **[O]**

1. **Xero/ERP connector** — o terço "o negócio conecta" do ERP de presença não existe em nenhum repo. O padrão foi provado no Constellation (entrada Lumen + Xero real). É roadmap, não resgate.
2. **@ que escreve no tronco** — wireframe V2 prevê o @ escrevendo items via skill/agente; hoje a tabela `items` é read-only de fora por lei. Precisa de um contrato (ver roadmap F6).
3. **História oficial** — o ecossistema não tem um doc que conte a linhagem verdadeira (este doc é o rascunho disso).
