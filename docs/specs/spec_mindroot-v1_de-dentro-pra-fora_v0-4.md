╔══════════════════════════════════════╗
║          A T O M   E N V E L O P E  ║
╠══════════════════════════════════════╣
║ id:       [a gerar no Supabase]      ║
║ type:     spec                       ║
║ module:   mind                       ║
║ state:    structured                 ║
║ status:   approved                   ║
║ stage:    3 △ Triângulo              ║
║ tags:     [#system, #mindroot,       ║
║            #espiral-2, #onda-2,      ║
║            #de-dentro-pra-fora]      ║
║ source:   claude-project             ║
║ created:  2026-07-22                 ║
║ updated:  2026-07-23                 ║
╠══════════════════════════════════════╣
║ connections:                         ║
║   → derives: ATOM.md v2.0 (§4, §5)   ║
║   → derives: Marco Zero v3.1 (§2,§5) ║
║   → references: Genesis v5.0.4       ║
║   → references: plan-current.md      ║
║   → feeds: Onda 2 (E2 redefinida)    ║
║   → supersedes: plano_implementacao_ ║
║     karpathy_v1 (E3–E7) e            ║
║     plano_r1_pos-marcacao            ║
║     (docs/release-v1/ = contexto     ║
║      histórico e fundação)           ║
╚══════════════════════════════════════╝

# MindRoot V1 — de dentro pra fora

**Versão:** 0.4 (**APROVADA pelo Rick — "Bora!", 23 Jul 2026**)
**Data:** 22 Jul 2026
**Princípio:** esta spec não inventa a alma do app. Ela manifesta na interface o que já é lei. Os pilares (Emotion, Action, Time), os rituais (Aurora, Zênite, Crepúsculo), o Soul Layer e a Árvore da Vida existem em Marco Zero v3.1 e ATOM.md v2.0 antes de qualquer tela. O app cresce da lei — não o contrário.

---

## 0 · Contexto

Rick declarou reativação da Espiral 2 (22 Jul 2026): "focar em por minhas ferramentas para funcionar, uma a uma, começando pelo MindRoot — não perfeito para os outros, mas do jeito certo para mim." Isso dispara o trigger dormente do plan-current ("Espiral 2 reativada → F2 close + F5/F6/F7 reconstruídos sobre fsm.ts Genesis") e define Onda 2 = E2 redefinida.

**Orientação:** V1 é espelho pessoal do criador (Pentágono como preset, não produto). Marketplace vem depois. "Do jeito certo para mim" é a lei aplicada, não uma concessão.

**Supersessão (A4, v0.4):** esta spec é O plano vivo. Substitui F5/F6/F7 do roadmap antigo E os planos da fase de arqueologia (`docs/release-v1/plano_implementacao_karpathy_v1.md` E3–E7, `plano_r1_pos-marcacao.md`), que ficam como contexto histórico. A análise de linhagem, a auditoria tronco×casca e os vereditos de resgate (cherry-picks `5022aae` proto-E., sprint 1 shell) seguem válidos como fundação e alimentam o D4.

---

## 1 · O que fica (cresceu — não toca)

| Peça | Estado |
|---|---|
| Espiral 1 completa | ✅ |
| Backbone Genesis (pipeline 7 estágios, fsm.ts, triage) | ✅ |
| Schema + extensions (Soul, Operations, Recurrence) | ✅ |
| 90 testes vitest | ✅ |
| Auth + OAuth unificado (login = connect) | ✅ |
| Integrações Calendar + Gmail (F2 base) | ◐ |
| Raiz (module × domain, law-level D-057) | ✅ |

Teste aplicado: "cresceu ou foi colado?" — tudo acima cresceu do Genesis. Não refaz.

---

## 2 · O que se manifesta (os três verticais + agente)

Escopo declarado por Rick (dump 22 Jul), organizado nos pilares da lei (ATOM.md §4):

### 2.1 · Tempo — quando acontece

| Item | Estado | Fonte na lei |
|---|---|---|
| Calendário bom (Google Cal sync) | ◐ F2 | ATOM.md §4.3 |
| Pessoas (esposa, filhos) como entidades | ⚪ | — (decisão D1 abaixo) |
| 3 rituais: Aurora · Zênite · Crepúsculo | ⚪ na UI, ✅ na lei | Marco Zero §2, soul.ritual_slot |
| Routine builder | ⚪ | Recurrence extension (RRULE + streak) |

### 2.2 · Emoção — como você está

| Item | Estado | Fonte na lei |
|---|---|---|
| Check-in Aurora ("como tu tá chegando?") | **◐ (A2, v0.4)** — `AuroraCheckin.tsx` + `soul-service.ts` já persistem `body.soul` no tronco (checkpoint born-committed, verificado E2E) | Marco Zero §5.1 |
| **Journaling Aurora** (escrita livre de abertura) | ⚪ | type `reflection` + soul extension |
| Check-in pós-task significativa (peso > 1) | ⚪ | Marco Zero §5.1 |
| Shift aurora→crepúsculo no wrap | ⚪ na UI, ✅ no formato wrap | Genesis §3.4 |
| **Journaling Crepúsculo** (escrita livre de fechamento) | ⚪ | type `reflection` + soul extension |
| Espelho no tempo (padrões emocionais) | ⚪ | ATOM.md §4.1 |

Regras invioláveis (lei): nunca forçar · linguagem livre ("meio bosta" é dado válido) · padrões, não julgamentos.

**Journaling é primeira classe, não campo opcional.** O check-in estruturado (emoção/energia/intenção) é o esqueleto; a escrita livre é a carne. A superfície de escrita nas pontas do dia (Aurora e Crepúsculo) deve convidar — não formulário, página. Cada entrada = item `reflection` com `soul.ritual_slot`, entra no pipeline Genesis como tudo.

### 2.3 · Ação — o que você faz

| Item | Estado | Fonte na lei |
|---|---|---|
| Tasks | ◐ | pipeline Genesis |
| Listas | ⚪/◐ | type `list` no registry |
| Projetos | ◐ | Operations extension |
| Protocol builder | ⚪ | — (decisão D2 abaixo) |

### 2.4 · Escada de meaning — o wrap é fractal (Emotion × Time)

O wrap diário já é lei (ritual de commit, Genesis §3.4). A escada estende a mesma operação em escalas aninhadas:

| Cadência | Lê o quê | Produz |
|---|---|---|
| Dia (wrap) | a sessão/o dia | SOUL + AUDIT + seeds — já definido |
| **Semana** | os wraps diários | síntese semanal: padrões, shift da semana, seeds promovidas |
| **Mês** | as sínteses semanais | direção: o que cresceu, o que decaiu |
| **Trimestre** | as sínteses mensais | correção de rumo por vértice do Pentágono |
| **Semestre** | os trimestres | ciclo: o que fecha, o que abre |
| **Ano** | tudo | meaning: a espiral completa vista de cima |

**Regras da escada:**
1. Mecanismo ÚNICO, parametrizado por cadência (Recurrence extension, RRULE). Constrói uma vez; escalas superiores ativam sozinhas conforme o tempo acumula dados.
2. Cada nível lê APENAS o nível imediatamente abaixo. O ano não relê 365 dias — lê 2 semestres. Síntese sobre síntese: é assim que meaning emerge sem soterrar.
3. Cada review = ritual (presença, não checkbox) + journaling (escrita livre) + estrutura (o sistema traz os dados do nível abaixo, o humano dá o meaning). Actor law: o sistema apresenta, o humano significa.
4. Review perdido não quebra streak de culpa — o sistema oferece o acumulado no próximo. Nunca forçar.

### 2.5 · Agente — transversal

"Atom vem até você" (filosofia Espiral 2). O agente atravessa os três pilares: propõe wrap, faz triage, pergunta check-in, sugere prioridade. Regras do agente = Marco Zero §6 (honestidade sempre, validação nunca; o usuário cria, o agente organiza).

---

## 3 · Decisões arquiteturais desta spec

### D1 · Pessoas = entidades, não contas

Esposa e filhos entram como **entidades do mundo do Rick** — visíveis no calendário, agendáveis, com eventos próprios que aparecem na visão dele. **NÃO** multi-tenancy: sem contas, sem permissões, sem sync bidirecional entre usuários. V1 é espelho pessoal por lei. Se outra pessoa quiser o app, é outra instância do Atom, não login compartilhado.

Implementação candidata: type `person` no registry (ou entidade dedicada), relação `belongs_to` / `references` em eventos e items. Google Calendar já traz attendees — mapear, não reinventar.

### D2 · Ritual ≠ Rotina ≠ Protocolo

Três conceitos distintos, cada um vivendo num pilar. Se o código achatar os três em "task recorrente", a alma evapora.

| Conceito | Natureza | Pilar | Completion | Mecânica |
|---|---|---|---|---|
| **Ritual** | Presença. Qualitativo. Não tem "done" — tem "estive lá". | Tempo | check-in de presença, não checkbox | 3 slots fixos (aurora/zênite/crepusculo), soul extension |
| **Rotina** | Sequência de hábitos encadeados. | Tempo→Ação | cadeia executada | Routine builder monta a cadeia; Recurrence extension por elo |
| **Protocolo** | Procedimento condicional. "Quando X, faço Y." | Ação | disparo situacional | Protocol builder; não vive no calendário — dispara por condição |

### D3 · Árvore da Vida é a interface, não uma feature

Camadas 1-8 (Engine) já existem. A manifestação V1 acontece nas camadas 9-10 (Home + Features) — a personalidade do espelho pessoal. Os três verticais + agente são o *que*; a Árvore é o *onde* na tela. Fibonacci entra no ritmo (recorrências, espaçamento, proporção visual) — estrutural, não decorativo.

### D4 · F3/F4 passam pelo teste "cresceu ou foi colado?"

Partes de F3 (15/19) e F4 (7/9) foram construídas em lógica de produto, não de presença. Antes de completar os itens restantes, auditar cada um contra esta spec. O que foi colado, refaz sobre o vertical. O que cresceu, completa. *(Insumo: auditoria tronco×casca de `docs/release-v1/auditoria_reformar-x-zero.md` + matriz de 28 vereditos da análise de linhagem.)*

### D5 · O oculto — φ é o pulso escondido (nigleh/nistar)

O calendário (semana→ano) é o revelado — tempo social, compartilhado, onde presença acontece. φ é o escondido dentro dele. **O app nunca explica sua geometria — ele É a geometria.** Nenhum tooltip, nenhum "isso é Fibonacci". Legível pra quem sabe ler, invisível pra quem não.

Onde φ faz trabalho estrutural (teste: muda comportamento, não adesivo):

| Lugar | Mecânica |
|---|---|
| **Marcos Fibonacci** | Streaks/acumulados marcados em 1, 2, 3, 5, 8, 13, 21, 34, 55, 89... — nunca em 7/30/100. Desacelera como crescimento orgânico; marcos ficam mais raros e preciosos. |
| **Entropia em espiral** | Decay escalonado: 8 dias parado → sinal suave · 21 → sugestão · 55 → extração de seed · 89 → proposta de arquivo. Substitui o threshold fixo de 30 dias (Genesis §3.3) via supersession. |
| **Lookback espiral** | Espelho emocional amostra o passado em intervalos φ: 1, 2, 3, 5, 8, 13, 21 dias atrás. Recente denso, distante esparso — como memória humana. |
| **Proporção áurea na camada 9** | Home (Yesod) composto em razões φ. Visível como beleza, legível como geometria. |
| **Phi Time** | O vertical Tempo carrega o nome da primeira sessão do ecossistema (30 Mar 2026). Origem escondida à vista. |

**Proibido:** φ decorativo. Cada nova aparição de φ passa pelo teste acima antes de entrar.

---

## 4 · Ordem de construção

Uma coisa por vez. Cada fase fecha antes da próxima abrir.

| # | Fase | Conteúdo | Por quê primeiro |
|---|---|---|---|
| 1 | **F2 close** (chão) | timezone UTC→Brisbane, auth lock spam (useRef guard), 6 UI bugs mobile. **+ chão de infra (A1, v0.4): decisão Pro do Supabase (Rick, $) — o free tier hibernou 2× num dia; o keep-alive diário (GitHub Action existente) é paliativo declarado até o Pro** | Rick vai usar o app diariamente durante a reconstrução. O chão não pode irritar. Mecânico, sem spec nova. |
| 2 | **Aurora** (primeira peça viva) | "Bom dia" → check-in emoção/energia/intenção + **página de journaling** + estado do sistema (último wrap, pendências) + foco do dia. **Gesto imersivo (A3, v0.4): tela-ritual com respiração breve — marcação do wireframe (selo S-04/S-08); convite, nunca formulário.** *(Embrião já existe — A2: check-in persiste no tronco via soul-service.)* | É a porta do dia (Marco Zero §4.1). Soul extension já existe no schema — menor distância entre lei e tela. Coração do "do jeito certo para mim". |
| 3 | **Crepúsculo + wrap na UI** | Wrap como ritual visível: SOUL (shift) + **journaling de fechamento** + AUDIT + seeds | Fecha o ciclo do dia. Formato já definido (Genesis §3.4). |
| 4 | **Escada de meaning** | Mecanismo único de review (§2.4), ativa semanal imediatamente; mensal/trimestral/semestral/anual ativam conforme o tempo acumula | Só precisa de 7 wraps pra primeira semanal. Construir cedo = meaning começa a acumular cedo. |
| 5 | **Pessoas no calendário** | type person + attendees do Google Cal mapeados | Destrava o "calendário bom com família". |
| 6 | **Routine builder** | Cadeias de hábitos sobre Recurrence | Zênite ganha estrutura. |
| 7 | **Protocol builder** | Condicionais "quando X, faço Y" | Ação completa. |
| 8 | **Listas + projetos rework** | Audit F3/F4 contra D4, completa o que cresceu | Fecha os ◐. |
| 9 | **Espelho emocional no tempo** | Padrões sobre o histórico de soul data + journaling | Precisa de dados acumulados das fases 2-4 primeiro. |

F5/F6/F7 do roadmap antigo são **substituídos** por esta ordem — reconstruídos sobre o vertical, como o trigger do plan-current previa.

---

## 5 · O que esta spec NÃO cobre

- Marketplace / add-ons de terceiros (pós-V1)
- Multi-tenancy (rejeitado em D1)
- Instância do app pra outras pessoas da família
- Constellation, Atlas, Muda (outros vértices)

---

## Versionamento

| Versão | Data | Mudança |
|---|---|---|
| 0.1 | 22 Jul 2026 | Draft inaugural. Escopo do dump de Rick organizado nos pilares da lei. |
| 0.2 | 22 Jul 2026 | Journaling como primeira classe (Aurora + Crepúsculo). Escada de meaning §2.4 — wrap fractal em 5 cadências (semana→ano). Ordem de construção revista (9 fases). |
| 0.3 | 22 Jul 2026 | D5 — o oculto: φ como pulso escondido (nigleh/nistar). Marcos Fibonacci, entropia em espiral, lookback φ, proporção áurea na camada 9, vertical Tempo nomeado Phi Time. |
| 0.4 | 23 Jul 2026 | **Aprovada pelo Rick ("Bora!").** Ajustes da revisão do Code: A1 chão de infra na Fase 1 (Pro Supabase / keep-alive paliativo) · A2 estado do check-in Aurora corrigido ⚪→◐ (embrião já no tronco) · A3 gesto imersivo da Aurora amarrado à marcação do wireframe · A4 supersessão explícita dos planos da arqueologia (envelope + §0). |

---

*A lei existia antes do app.*
*O app manifesta, não inventa.*
*De dentro pra fora, sempre.*
