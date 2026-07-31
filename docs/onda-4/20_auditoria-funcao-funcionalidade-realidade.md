# Auditoria 20 (Onda 4) — função × funcionalidade × realidade

**Data:** 1 Ago 2026 · **Pedido do Rick, verbatim:** «pessoas com TDAH veem
simples, mas enxergam profundo […] a parte profunda do app, a taxometria, os
labels, tipo só tem task e ritual […] onde ajusta alguma coisa vê como
funciona, os itens tem que fazer um por um — acho que vale uma auditoria
completa de função, funcionalidade e realidade».
**Método:** três colunas — **função** (o que o código tem; varredura completa
de engine/service/hooks/pages com arquivo:linha) · **funcionalidade** (o que a
UI deixa alcançar) · **realidade** (o banco de produção, consultado hoje via
Management API: 388 itens, 22 conexões, 1 evento).
**Parentesco:** esta auditoria é a versão funda da «lista do invisível» da
spec 19 — lá, o que existe e não tem porta visível; aqui, o que existe e não
tem **boca nenhuma**, e o que a boca promete e não cumpre.

---

## 0 · Resumo executivo — o funil de boca larga e meio fechado

O Rick está certo nas três queixas, e a produção confirma cada uma em número:

1. **«Só tem task e ritual»** — é literal. Dos 388 itens: ritual 112 + task
   72 = **47%**; mais **76 sem tipo nenhum (20%)**. Os outros 23 tipos do
   schema somam 33% — e 6 tipos (`person`, `routine`, `protocol`, `podcast`,
   `article`, `resource`) **nunca nasceram** em produção.
2. **«Onde ajusta alguma coisa vê como funciona»** — não existe. O app tem
   **zero ajustes de comportamento**. Toda regra viva (bandas de confiança da
   AI, dias de aviso do cofre, horários de aurora/zênite/crepúsculo, até a
   latitude de Brisbane do arco do sol) é constante hard-coded sem porta.
3. **«Os itens tem que fazer um por um»** — verdade sem exceção. Zero
   multi-select, zero ação em massa. E a realidade mostra o preço: **178
   itens (46%) parados no estágio 1**, esperando uma esteira que só anda um
   card por vez.

E o achado que as três queixas não pediram mas a auditoria deve: **a escada
Genesis está quebrada no meio.** Estágios 3–5 somam **14 itens**; o estágio 6
tem **zero — e é inalcançável por código** (o botão que promete «⬠ → ⬡ abrir
pro mundo» pula direto pro 7). O sistema é um haltere: nasce no 1, morre no
7, e quase nada amadurece no meio.

---

## 1 · A taxonomia — 26 tipos na lei, 4 nas bocas, 2 na vida

### Função (o que existe)
26 AtomTypes (`src/types/item.ts:19-24`), registry com pisos e naming
(`src/config/type-schemas.json`), morph com fóssil pra mudança tardia
(RPC `morph_item`).

### Funcionalidade (o que as bocas oferecem)

| Boca | Tipos oferecidos |
|---|---|
| Dropdown do ItemDetail (`ItemDetail.tsx:404`) | **26/26** — a única porta completa |
| Chips do Assentimento (`Assentimento.tsx:62-65`) | 2–3 (`note`/`task`, ou `ritual`/`task` se calendar) |
| Builder da Raiz (`BuilderMiniWrap.tsx:16`) | 4 (`task`,`habit`,`ritual`,`note`) |
| Tokens do @ (`token-parser.ts:12-16`) | 23 (faltam `person`,`routine`,`protocol`) |
| Triage AI (`triage-classify/index.ts:18-21`) | 23 |
| Busca `tipo:` (`search.ts:109-126`) | **16** — 10 tipos não são buscáveis e travam a busca |

A boca do dia-a-dia (esteira + builder) oferece **2 a 4 tipos**. Os 26 só
existem num dropdown dentro do detalhe de cada item. **13 tipos** dependem de
dropdown ou sorte da AI pra existir.

### Realidade (produção, hoje)
ritual 112 · **NULO 76** · task 72 · wrap 30 · project 28 · habit 14 ·
checkpoint 14 · note 14 · reflection 6 · spec 6 · log 3 · +7 tipos com ≤2 ·
**6 tipos jamais nasceram**. Os 100 itens `#source:google-calendar` explicam
o reinado do ritual: o conector do calendar batiza quase tudo de ritual.

### O drift — QUATRO vocabulários de tipos coexistem
1. O enum TS (26, `session-log` com hífen) — `types/item.ts:22`
2. O token-parser (23) — `token-parser.ts:12-16`
3. A triage edge (23, grava `session_log` com underscore) —
   `triage-classify/index.ts:21`; **há 2 itens `session_log` em produção**,
   inválidos pro enum TS
4. `engine/parsing.ts` (22, vocabulário `#mod_`/`#type_`) — **fóssil sem
   importador**, mas 6 itens em produção ainda carregam a tag `#mod_mind`

---

## 2 · A escada Genesis — quebrada no meio, confirmada pelo banco

| Estágio | Gesto na UI | Produção |
|---|---|---|
| 1 · Ponto | qualquer captura | **178** |
| 2 · Linha | chips/assentimento | 36 |
| 3 · Triângulo | convite «dar corpo» | 6 |
| 4 · Quadrado | convite «dar forma final» | 1 |
| 5 · Pentágono | primeira conexão | 7 |
| 6 · Hexágono | **NENHUM — inalcançável** | **0** |
| 7 · Círculo | convite «selar» | 36 committed + 124 archived |

Os três defeitos, confirmados no código:

- **Estágio 6 não tem porta** (`ItemDetail.tsx:134-143`): `handleMature` com
  `stage >= 5 && < 7` chama `pipelineCommit` — pula o 6. A RPC
  `propagate_effect` existe no banco (`migrations/007:480-507`) e **nenhum
  cliente a chama**. O convite `INVITES[5]` diz «⬠ → ⬡ abrir pro mundo» —
  **o rótulo mente sobre o destino**.
- **O gate do engine é decorativo**: `engine/fsm.ts:51-56` exige maturação
  mínima (≥60s) pra validar; `fsm-service.ts:81-89` só checa o número do
  estágio e grava. `canAdvance`/`advance` existem e **nenhum caller real os
  usa**.
- **Entropia com semente não tem porta**: `usePipeline.decay` + RPC
  `decay_item` existem; nenhum componente chama. Arquivar é o único fim.

---

## 3 · «Ajusta e vê como funciona» — a categoria não existe

A única preferência que o usuário persiste no app inteiro: a janela da
árvore (`localStorage`, `Arvore.tsx:127`). Todo o resto é constante sem
porta — a lista completa (com arquivo:linha) está no inventário; os que mais
mordem:

| Regra viva | Onde mora | Por que morde |
|---|---|---|
| Bandas de confiança da AI (95/90/60) | `triage-service.ts:15-22` | decide quando a AI classifica sozinha — o coração da esteira |
| Dias de aviso do cofre (`LEAD_DAYS`, default 30) | `engine/vault.ts:25-31` | quando a Raiz avisa vencimento |
| Horários de aurora/zênite/crepúsculo | `types/ui.ts` + `protocol.ts:20` | o «período do dia» que governa rituais e protocolos |
| **Lat/lon de Brisbane hard-coded** | `engine/sky.ts:20-22` | o arco do sol do HOJE quebra em qualquer viagem |
| Timezone da triage | `triage-classify/index.ts:78` | o «hoje» da AI |
| Gavetas da Raiz (9, fixas) | `config/raiz.ts:19` | não se cria/renomeia gaveta |
| Cadência da escada de review | `engine/meaning.ts:21` | os 5 degraus |
| Tema | `app-store.ts:74-77` | a função existe, o botão morreu (`SettingsSheet.tsx:3-4`) |

O SettingsSheet real ajusta: conectores, a ida da taxonomia, export, sair.
Nada de comportamento.

---

## 4 · O um-por-um — zero lote, e a fila que não encolhe

**Não existe** multi-select, ação em massa, «aceitar todos», «arquivar
todos» — em nenhuma tela. A única operação em lote do app é o «que nasçam ·»
do Builder. Onde dói, por ordem de dor real:

1. **A esteira do Assentimento** (`Assentimento.tsx:42-141`): 178 itens no
   inbox de produção; cada um pede toque(s) individuais; **pular manda pro
   fim — a fila nunca encolhe**. Um sync de Gmail despeja N de uma vez.
2. **Corrigir classificação em massa**: módulo `bridge` tem 183 itens (47%)
   — o default engolindo o acervo; consertar = abrir 183 detalhes.
3. **Tags**: 252 tags distintas em 388 itens, sem listagem global, sem
   renomear, sem merge, sem filtro fora da busca.
4. **Arquivar**: um por vez, só de dentro do item.
5. Os alicerces de lote até existem — `useItems.filtered/inboxItems`,
   `app-store.setFilter` — **sem nenhum consumidor na UI**.

---

## 5 · Órgãos sem boca e promessas sem porta

### SEM SUPERFÍCIE (código vivo, zero consumidor) — seleção
- **`AuditPanel` (309 linhas) e `HealthBar`** — o app TEM um painel de
  auditoria de saúde completo, órfão. *A ironia da sessão: a auditoria que o
  Rick pediu existe como componente morto.*
- `engine/digest.ts` (espelhado à mão na edge — dois cérebros do digest),
  `engine/parsing.ts` (fóssil), `useRoutine` inteiro (toggleLink, selar,
  reabrir — a rotina criada pelo Builder **não é operável depois**),
  `useItemMutations.{create,complete,uncomplete,delete}`,
  `usePipeline.{decay,getHealth}`, `useProtocol.createProtocol`,
  `EmptyState`, `ErrorBanner`, `ItemCard`, `Skeleton`, `FAB` e os atoms.

### SEM PORTA (o schema promete, o usuário não alcança) — seleção
- `body.operations` **inteiro**: priority (6 itens têm, via AI; nada edita),
  deadline (0), due_date (1 — só o token `@amanhã` escreve; sem date picker),
  progress (0). **Um app de organização pessoal sem como dar prazo a um
  item.**
- `body.recurrence`: `RECURRENCE_OPTIONS` sem UI; streak calculado e nunca
  exibido; 4 itens com regra (só Builder).
- `PersonBody`/`RoutineBody`/`ProtocolBody`: criados por serviço, **nenhuma
  tela lê ou edita** (pessoas são invisíveis; cadeia de rotina não ganha nem
  perde elo; passos de protocolo são imutáveis).
- `status`: 5 de 8 no seletor; `draft` nunca é escrito por nada.
- Nota de conexão: o payload aceita, nenhum picker oferece.
- Histórico do item: `atom_events` existe e **a produção tem 1 evento** —
  porque o `touch` que alimentaria a tabela vive numa mutation morta. O
  cofre lê ausências dessa tabela vazia: **a leitura de «faz tempo» da Raiz
  depende de um evento que não nasce** (`engine/vault.ts:83` espera
  `checkin`; ninguém escreve `checkin`).
- Rotas: `/review` e `/raiz` sem entrada na nav — só puxadores condicionais
  na Árvore.

### Realidade das conexões
22 conexões no total — num sistema cuja escada **exige** conexão pra chegar
ao estágio 5. `blocks` nunca foi usada; a teia não tem vista (sem grafo, sem
lista global).

---

## 6 · O veredito em uma frase por coluna

- **Função:** o motor é muito maior que o app — engines, RPCs, extensões e
  painéis inteiros esperando boca.
- **Funcionalidade:** as portas do dia-a-dia afunilam 26 tipos em 4, 8
  status em 5, 7 estágios em 6 alcançáveis, e todo gesto é unitário.
- **Realidade:** metade do acervo parada no ponto de partida, um quinto sem
  nome, o meio da escada deserto, a tabela de eventos vazia — **o banco é o
  retrato fiel das portas que faltam, não do motor que existe.**

---

## 7 · A mesa — consertos candidatos, por alavancagem (decisão é do Rick)

*A auditoria constata; não decide. Pela D62, conserto que cria superfície
nova pede spec (e o que tocar voz do E., relay). Ordenado por
dor÷custo:*

1. **Lote na esteira** — «aceitar sugestão da AI em bloco» + «arquivar
   selecionados» no Assentimento. Ataca os 178 do inbox e o um-por-um na
   veia. (Os alicerces `inboxItems`/`setFilter` já existem.)
2. **Consertar o rótulo do convite do estágio 5→7** (mentira barata de
   consertar) **e decidir o destino do estágio 6**: ligar `propagate_effect`
   ou declarar o 6 fora da v-atual — qualquer um é melhor que o convite
   falso.
3. **Due date editável + priority no ItemDetail** — os dois campos que um
   cérebro TDAH mais usa, já existem no schema, falta um picker.
4. **Sanear o drift dos vocabulários** — um vocabulário só (o registry):
   token-parser, triage (`session_log`→`session-log` + migração dos 2
   itens), busca (16→26), aposentar `parsing.ts`.
5. **Uma porta de ajustes mínima** — começar pelos 3 que mordem: horários
   dos períodos, lead do cofre, lugar (lat/lon/timezone). «Ajusta e vê» pede
   preview do efeito (o precedente é a ida da taxonomia, que já faz
   preview→aplicar→desfazer).
6. **Ressuscitar ou enterrar os órfãos** — decisão item a item: AuditPanel
   (ressuscitar como painel do Wrap?), useRoutine (a rotina precisa ser
   operável), digest.ts duplicado (um cérebro só), parsing.ts (enterrar).
7. **Eventos de verdade** — escrever `touch`/`checkin` onde a vida acontece,
   ou desligar a leitura de ausências que finge ler. Meia-verdade é pior que
   nenhuma.
8. **Tags: listagem global + merge/rename** — 252 tags sem gestão só
   crescem.

---

*Auditoria 20 — 1 Ago 2026 · varredura de código via agente (arquivo:linha),
banco de produção consultado no dia. O motor é maior que o app; a queixa do
dono era um diagnóstico.*
