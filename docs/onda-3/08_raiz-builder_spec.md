# Obra 6 — Raiz + Builder: o chão da árvore e a entrevista que pare cadeias

*29 Jul 2026 · a obra grande do roadmap (D50 + D58), aberta pelo Rick com a
visão do cofre ([[semente_cofre-da-vida-adulta]]). Spec primeiro, código
depois (§8.7 do CLAUDE.md).*

## A visão que rege

> "raiz eh um coracao do app [...] minha eterna batalha para me organizar,
> ter um lugar unico com tudo, seguro, com lembretes de exp, ou ausencia,
> tudo batendo com as necessidades de um adulto" — Rick, 29 Jul

Decisões vigentes: **D50** (raiz = chão da árvore, % vira estado quieto,
nunca meta), **D58** (Builder = entrevista das doors, pare cadeias e
protocolos, não hábitos soltos), **D57** (mundo escuro, dourado raro),
**D46** (número = estado, nunca julgamento), **D61** (indigo = E.),
**D62** (o crivo do topo de mercado — esta obra abre com benchmark;
relatórios em `09_benchmark-crivo.md` quando os agentes selarem).
Leis: inbox obrigatório (nada nasce structured), state machine sequencial,
entropy é archive.

## O terreno (o que o código já tem)

| Peça | Estado | Veredito |
|---|---|---|
| `config/raiz.ts` — 9 domínios da vida + 3 portas | vivo, zero schema, tags `#domain:*` | **FICA** — é o mapa do cofre |
| `hooks/useRaiz.ts` — count/idade/staleness por domínio | vivo | **CRESCE** — vira a leitura do chão (ausência + validade) |
| `pages/Raiz.tsx` (459 l) — welcome/panorama/doors/inventory | casca velha, light-first | **REFORMA** — pele D57, panorama vira o chão |
| `features/raiz/builder-*` — entrevista por módulo, 5 inputs | pré-F6: gera habits/rituals SOLTOS | **REFORMA D58** — respostas parem `routine` (chain) e `protocol` (when/steps) |
| `features/raiz/mindmate.ts` + badge | easter egg vivo (digite "mindmate") | **SAGRADO** — sobrevive à reforma; o coração que o Rick lembrou |
| `engine/routine.ts` · `engine/protocol.ts` | motores puros, testados (F6/F7) | **CONSUMIR** — o Builder novo escreve o que eles já leem |

## GUARDIÃO — CONSTRAINTS
━━━━━━━━━━━━━━━━━━━━━━
**AtomTypes envolvidos:** routine, protocol, habit, ritual, task, note
**AtomModules:** os 8 (domínio→módulo já mapeado em `config/raiz.ts`)
**State machine:** todo item do Builder nasce estágio 1 (inbox). Maturação
por assentimento, sequencial (1→2→3…), via funções do `usePipeline` — nunca
nasce structured, nunca pula.
**Body shapes (lei do motor, não inventar):**
- routine: `body.chain: string[]` (ids dos elos) + `body.slot`
- protocol: `body.steps: string[]` + `body.when {emotion|challenging|energy|period}`
  — período sozinho NÃO acorda protocolo (seria rotina disfarçada)
- validade: `body.operations.deadline` (campo existente; zero migration)
  + `lead_time` por tipo/tag com default de domínio (passaporte 9m, cartão
  2m — benchmark `09`, table stake 1) + gesto de renovação (rola o deadline)
**Ausência:** derivada de **evento significativo** (toque real em
`atom_events`, trilho que `checkin`/`protocol_run` já usam) — NUNCA de
`updated_at`, que mente a cada retag (falha estrutural apontada pelo
benchmark `09`).
**Connections:** chain é `body.chain`, NÃO connections tipadas — seguir o
motor. (Connections `references` opcionais item→routine ficam pra depois.)
**Pisos mínimos:** routine sem elos não nasce; protocol sem steps não nasce.

⚠ INCERTEZAS (Proporção Invertida) — **decisões do Rick, não minhas:**
1. **Escopo do cofre nesta onda** — a leitura de validade+ausência no chão
   entra agora (v1 pequena: ler `deadline` e `updated_at`, mostrar quieto)
   ou germina pós-gate com a semente inteira?
2. **As perguntas da entrevista** — a reforma D58 troca o *motor* (o que
   as respostas parem). O *conteúdo* das perguntas (hoje por módulo,
   5 tipos de input) continua o mesmo, ou a entrevista vira pelos 9
   domínios da vida? Reescrever perguntas é obra de voz — passa pela Lei
   do Tom e talvez pelo E.
3. **Aviso de validade pelas bocas** — D56 diz push = só voz do E. em
   protocolo que acordou. Validade vencendo pode falar no Telegram, ou
   v1 fica só no chão (e no wrap)? Proposta conservadora: v1 só no chão.

✓ APROVADO PARA: ESTRUTURA (Root passa batido — zero schema novo)

## A obra em etapas (proposta)

1. **O chão** — Raiz reskin D57: panorama vira "o chão da árvore" (estado
   quieto por domínio, sem %), destino do drill que a ÁRVORE já aponta.
   Welcome/doors ficam (D50), na pele nova.
2. **A leitura do cofre (v1)** — `useRaiz` cresce: validades próximas
   (`deadline` com lead time por tipo) + ausências (por evento
   significativo). Tom D46: estado, nunca cobrança — mas o benchmark é
   claro: leitura quieta como canal único mata o cofre (Life OS de Notion
   morre em ~1 mês); a válvula assíncrona (digest raro) entra na decisão 3.
   *Depende da incerteza 1.*
3. **O Builder D58** — a entrevista pare: respostas de frequência viram
   `habit`-elos + uma `routine` com a chain; respostas de condição ("quando
   ansioso…") viram `protocol` com when/steps. Tudo nasce inbox, o
   mini-wrap final vira o muro de assentimento. MindMate intacto.
4. **As fotos** — `visual-mundo-novo.spec.ts` ganha as cenas: chão,
   entrevista, assentimento. O guarda do gate cobre a obra.

## Decisões propostas (ganham número quando o Rick ratificar)

*(D62 já nasceu: virou a lei do crivo. As propostas abaixo correm a fila.)*

- **D63 (proposta):** o chão fala validade e ausência — cofre v1 nesta
  onda, leitura-só, zero schema.
- **D64 (proposta):** Builder pare cadeias e protocolos nascendo no inbox;
  o assentimento do mini-wrap executa a maturação sequencial.
- **D65 (proposta):** MindMate é patrimônio do chão — o gatilho continua;
  a reforma não o toca. (Ampliação — quote do dia no chão? — só se o Rick
  quiser.)

---

*Status: **ratificada** (Rick, 29 Jul — "sim sim sim"): D63 cofre v1 ·
D64 builder motor · D65 mindmate · D66 válvula digest. Incertezas
fechadas; obra em execução pelas etapas 1→4. O digest (D66) e a reescrita
das perguntas correm como sub-obras após o motor.*
