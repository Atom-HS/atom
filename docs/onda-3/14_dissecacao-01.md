# Dissecação 01 — HOJE · @ · Triage

*29 Jul 2026 · primeira sessão do exame do `13_prompt-dissecacao.md`.
Features 1–3, vividas antes de lidas: 22 cenas fotografadas com Playwright
(mundo simulado + mundo mockado de 50 itens), depois o código, depois o
crivo D62 contra os benchmarks `09` e `10`. Instrumento do exame:
`e2e/dissecacao-01.spec.ts` (reutilizável — roda sob demanda, não é gate).
Fotos em `14_dissecacao-01_fotos/`. Hooks verdes na sessão: tsc · 276
testes · build.*

---

## Vereditos

| # | Feature | Veredito | Em uma linha |
|---|---------|----------|--------------|
| 1 | **HOJE** | **VIVA** | O arco, os fixos e a sugestão única funcionam e dizem a verdade; as dívidas (pressão da semana, primeira chegada) estão nomeadas abaixo |
| 2 | **@ / captura** | **MANCA** | O caminho feliz é dos melhores ritos da casa — mas o canto da falha pós-captura MENTE: nega o que guardou e planta duplicata na fila |
| 3 | **Triage / assentimento** | **MANCA** | O chip D69 é real e bonito; mas assentir-que-falha avança o card, o card é cego, e a recorrência por instância transforma a fila em esteira perpétua |

---

## 1 · HOJE — viva

**Vivido** (`01-hoje-cheio.png`, `02-sugestao-*.png`, `03-fixos.png`,
`04-hoje-vazio.png`): o dia cheio abre com o céu no horário real (sol às
15:21 entre ☀ 6:32 e ☽ 17:17, fase da lua verdadeira), a chegada
("cheguei focado"), a cadeia do período (1 de 2 · *sela sozinha*), os
fixos com "dia todo" sem hora falsa e o conflito refletido **nos dois
lados** ("cruza com «dentista Sofia» — duas horas no mesmo lugar"), a
sugestão única com porquê, as pills. "Me dá outra" caminha o rank e os
motivos mudam com honestidade: *"é pra hoje — e ainda dá, com calma"* →
*"aberto há 118 dias — um gesto já muda"* → *"o mais antigo da fila — só
este por agora"*. Nenhum número cobra.

**Intenção:** serve as leis 1 (céu = lente sobre o calendar, nunca grade),
2 (uma coisa por vez), 3 (conflito como estado, sugestão como convite) e
D59 (acontecimentos pousam no arco). Decisões citáveis existem para tudo
que se vê — com UMA exceção, que virou decisão proposta (DP-A abaixo):
**o item de conector ainda não-assentido aparece nos fixos** (a Reunião
Operacional Atlas, 16:00, estado inbox, está na foto `01`). Defensável —
o compromisso existe no céu independente da triage — mas nenhuma decisão
ratifica isso.

**Profundidade:** [fixos.ts](../../src/engine/fixos.ts) é o melhor tipo de
motor da casa — date-only comparado como string (nunca desliza de fuso),
fim exclusivo como o Google manda, conflito só entre fixos com hora,
encostados não cruzam — e cada canto tem teste
([fixos.test.ts](../../src/engine/fixos.test.ts): 11 casos).
[today.ts](../../src/engine/today.ts) idem (vencido → pra-hoje → mais
antigo; vazio devolve null, "nunca inventa urgência" — testado). O filtro
de recusados/tentative vive na edge
([calendar-sync/index.ts:69-72](../../supabase/functions/calendar-sync/index.ts))
— "o hoje nunca mente" honrado na ingestão. Cantos achados: `fixosOfDay`
não filtra `status` — um fixo **arquivado** voltaria a aparecer; as marcas
do arco (D59) usam `<title>` SVG — **mudas no touch**; o céu tem lat/lon
**fixos em Brisbane** ([sky.ts:20-22](../../src/engine/sky.ts)) — escolha
registrada em comentário, ainda sem decisão.

**Crivo (D62, benchmark `10`):** o céu-como-lente está do lado certo do
cemitério (confirmado); higiene do sinal ✓; conflito ✓. A **pressão dos
próximos dias** (table stake 3) segue ausente — e vivendo o app sente-se:
o dia parece administrável isoladamente, como o benchmark previu. É
dívida, não escolha.

**Primeira vez** (`04-hoje-vazio.png`): quem chega vê o círculo da aurora
("inspira…" + pular) **sem uma palavra de chão**. Bonito pra quem já é da
casa; mudo pra quem acabou de entrar.

## 2 · @ / captura — manca (por um canto que mente)

**Vivido** (`05`–`14`): o caminho feliz é rito maduro. Captura lisa →
"li assim:" com chips `△ task · #body · 92%` e **confirma/ajusta**
(banda *suggest*); confiança baixa → *"não li com clareza — guardei como
ponto (·). decide com calma quando quiser"*; leitura que cai → *"guardei
como ponto (·) — a leitura falhou agora, mas nada se perdeu"*. `sinto:`
anota a chegada E acorda a sentinela (*"o ◈ «ansiedade bateu» tá de pé"*
com chips — foto `08`). `lista:` pousa na lista aberta certa (*"+2 na
«compra da semana» · 4 abertos"*). Offline (D55) é o ponto alto: duas
entradas na fila com voz certa, e na volta da rede o toast quieto —
*"a fila subiu — 2 pontos no tronco"* (`12`).

**O canto que mente** (foto `07`, reproduzido também em `10`): quando a
estruturação falha DEPOIS da captura (tokens explícitos ou lista nova), o
catch externo de [At.tsx:169-173](../../src/pages/At.tsx) trata como se
nada tivesse sido guardado: diz **"não consegui guardar agora — foi pra
fila"** e enfileira a leitura INTEIRA. Só que o ponto já nasceu no tronco
(captura-primeiro fez o trabalho). Resultado: a mensagem nega o que
aconteceu, e quando a fila sobe, **nasce duplicata**. O mesmo desenho
existe dentro do próprio outbox
([outbox-service.ts:99-106](../../src/service/outbox-service.ts)): se o
selo falha após o capture do replay, a entrada fica na fila e a próxima
janela captura de novo. Compare com o chip *confirma*, que trata a mesma
falha com a verdade: *"não consegui selar — o ponto segue no inbox"*
(foto `06`) — a frase certa já existe na casa.

**Intenção:** D52 vivida por inteiro no caminho feliz (uma boca, ponto
antes da leitura, assentimento por chips). A banda de confiança é
conservadora do jeito certo (auto só ≥95 pra acionáveis — alinhado ao
dado Morgen do benchmark `10`). O canto viola a lei 3 (espelho que nega o
que fez não é estado) e suja a D55 ("nada se perde" virou "nasce dobrado").

**Profundidade:** engine puro com cobertura exemplar
([mouth.test.ts](../../src/engine/__test__/../mouth.test.ts),
[token-parser.test.ts](../../src/engine/token-parser.test.ts),
[outbox.test.ts](../../src/engine/outbox.test.ts) — fila corrompida cai
fora sem derrubar a boca, `@hoje` às 4h não vira ontem-UTC). O que não
tem teste é exatamente onde a mentira mora: os fluxos de erro de
`handleSend` (página sem teste co-locado — padrão da casa é gate visual,
mas este canto é lógica, não pixel).

**Descobribilidade:** os tokens (`#work @task @amanha`) não aparecem em
lugar nenhum da interface — placeholder é só "fala, cola, despeja…". Hoje
são gramática privada do Rick. (E a tabela do próprio prompt `13` cita a
gramática errada — "`△`" é chip de LEITURA, o token de digitação é
`@type`. Até a casa se confunde.)

## 3 · Triage / assentimento — manca

**Vivido** (`15`–`22`): o chip D69 existe e é limpo: *"li assim pelo
calendar — troca se não for isso"*, `● ritual / ○ task`, assentir num
toque (`15`, `16`). A leitura da AI para item manual mostra barra de
confiança, banda e reasoning (`22`). Mas a esteira de 50 itens (`18`–`20`)
expôs três fraturas:

1. **Assentir que falha avança o card.**
   [usePipeline.classify](../../src/hooks/usePipeline.ts) engole o erro
   (toast + `null`) e
   [Pipeline.tsx](../../src/pages/Pipeline.tsx) chama `next()`
   incondicionalmente. Na foto `20`: três toasts "Item nao esta no inbox"
   empilhados E o card na posição 7 — o usuário acha que assentiu 6; os
   itens continuam no inbox e voltam na próxima volta. No mundo real
   (rede ruim no meio de 50 assentimentos), é selo de mentira.
2. **O card é cego.** Pra assentir a leitura de um evento, a tela não
   mostra hora, dia nem quem vem; pra um email, não mostra remetente nem
   snippet — só o assunto. O corpo (`body.start`, `attendees`,
   `snippet`, `from`) já está no item; a tela não abre a mão.
3. **A recorrência multiplica pedidos de assentimento.** A edge usa
   `singleEvents: "true"` e o dedup é por id de INSTÂNCIA
   ([connector-service.ts:142-180](../../src/service/connector-service.ts))
   — cada ocorrência do ritual semanal é um item novo no inbox a cada
   janela de sync. O standup de segunda pede assentimento **toda
   semana, pra sempre**. A leitura recorrente→ritual está certa (D69);
   a granularidade está errada: assentimento devia ser **por série**
   (`recurringEventId`), um gesto selando todas as instâncias.

Mais dois achados menores vividos: **pular não adia** — só gira a fila
(com 1 item, volta pra ele mesmo; com 50, o pulado reaparece na mesma
sessão); e **o módulo não se troca no chip** — todo item de conector
nasce `bridge` e sela `bridge` (o chip só troca o type), então a árvore
recebe tudo num galho só até alguém abrir item por item.

**Tom:** os toasts do pipeline são de outra era da casa — "Item
classificado" (a cada assentir; 50 numa esteira), "Item nao esta no
inbox" (sem acento, empilha) — pré-Lei do Tom.

**Crivo (D62, benchmark `10`):** sugerir-e-aprovar ✓ (o dado Morgen
honrado no desenho); leitura visível e trocável ✓. O que o topo faz e
falta: contexto no card de decisão (qualquer triage de email mostra
remetente/preview) e gesto de série pra recorrência (Reclaim/Morgen não
re-perguntam a mesma reunião semanal).

---

## A fila de ajustes

Prioridade: MENTE > MANCA > polimento. Tamanho: gesto · obra pequena ·
obra com mesa.

| P | Ajuste | Onde | Tamanho | Lei que justifica |
|---|--------|------|---------|-------------------|
| **MENTE 1** | Falha pós-captura no @: separar os catches — se o ponto nasceu, dizer a verdade ("guardei como ponto — não consegui selar") e NÃO re-enfileirar a leitura inteira | [At.tsx](../../src/pages/At.tsx) `handleSend` | gesto | 3 (estado) · 5 (captura-primeiro) · D55 |
| **MENTE 2** | Assentir que falha não avança: `next()` só quando `classify` devolve item | [Pipeline.tsx](../../src/pages/Pipeline.tsx) `handleAcceptLeitura`/`handleAccept` | gesto | 4 (o selo é do humano — selo falso é traição) |
| **MENTE 3** | Outbox idempotente: guardar o `item_id` na entrada após o capture do replay, pra retomada não recapturar | [outbox-service.ts](../../src/service/outbox-service.ts) + [outbox.ts](../../src/engine/outbox.ts) | obra pequena | D55 (nada se perde ≠ nada se duplica) |
| **MANCA 4** | Assentimento por série: dedup/assentir por `recurringEventId`, instâncias herdam a leitura selada | edge calendar-sync + [connector-service.ts](../../src/service/connector-service.ts) + chip | obra com mesa | D69 · benchmark `10` |
| **MANCA 5** | Card com contexto: hora/dia/quem no evento, remetente/snippet no email (dados já estão no body) | [Pipeline.tsx](../../src/pages/Pipeline.tsx) TriageView | obra pequena | 4 (assentir informado) |
| **MANCA 6** | Semântica do pular (ver DP-B) e, decidida, implementar | Pipeline.tsx | gesto (após decisão) | 2 |
| **MANCA 7** | Módulo trocável no chip do conector (ou ao menos os 2–3 prováveis) | Pipeline.tsx | obra pequena | D69 |
| **MANCA 8** | Pressão dos próximos dias — o sussurro da semana, sem virar grade | HOJE + engine novo | obra com mesa | 1 · 2 · benchmark `10` |
| **MANCA 9** | Tokens descobríveis: hint rotativo no placeholder ou o E. ensinar UMA vez no primeiro uso | At.tsx | gesto | 2 |
| **MANCA 10** | Toasts do pipeline na Lei do Tom (voz, acento, sem empilhar; sem "sucesso" a cada assentir) | [usePipeline.ts](../../src/hooks/usePipeline.ts) | gesto | 6 |
| pol. 11 | `fixosOfDay` filtrar `status: archived` | [fixos.ts](../../src/engine/fixos.ts) | gesto | "o hoje nunca mente" |
| pol. 12 | Uma linha de chão na primeira aurora (quem chegou agora não sabe onde está) | AuroraRitual | gesto | 2 · 7 |
| pol. 13 | Marcas do arco com toque (tooltip real, `<title>` é mudo no celular) | Hoje.tsx SkyArc | gesto | D59 |
| pol. 14 | "me dá outra" avisar quando deu a volta completa | today.ts/Hoje.tsx | gesto | D46 |

*Nota test-only (não é fila de produto): o mock do gate
([e2e/fixtures/auth.ts](../../e2e/fixtures/auth.ts)) devolve confiança 92
pra `task` — banda **suggest**, não auto. Se a intenção das fotos do tour
era o fluxo auto, usar ≥95. E no mundo mockado o `quickClassify` sempre
falha (o GET single devolve array) — as fotos do gate escondem esse braço.*

## Decisões propostas (pra mesa do Rick)

- **DP-A (sugerido D70):** *o céu mostra o compromisso; o assentimento
  decide o galho, não o dia* — item de conector não-assentido APARECE nos
  fixos do HOJE (é o que o código já faz; foto `01`). Ratificar como lei
  ou filtrar por estado. Recomendação: ratificar — o evento existe no
  calendar independente da triage; escondê-lo faria o hoje mentir.
- **DP-B (sugerido D71):** *pular adia pra onde* — hoje pular só gira a
  fila (o item volta na mesma volta). Opções: fim da fila · amanhã ·
  quieto até o próximo sync. Recomendação: fim da fila dentro da sessão,
  sem snooze de calendário (snooze é cobrança adiada).
- **DP-C (sugerido D72):** *assentimento por série* — um gesto sela a
  série recorrente inteira; instância nova herda o selo. É a decisão que
  destrava o MANCA 4.

## Sementes registradas

- **Assentir em punhados** — agrupar a esteira por remetente/série
  ("8 da mesma newsletter — sela todos?"), humano sempre no gate.
- **Fatura→cofre** — email de fatura estrelado conversando com D63/D66
  (benchmark `10`, sinal 5).
- **Céu com perfil de lugar** — lat/lon do usuário no lugar do Brisbane
  fixo de [sky.ts](../../src/engine/sky.ts) (a escolha atual é deliberada
  e comentada; a semente é o perfil).

## Não verificado nesta sessão

Produção real (atom-zeta-snowy) e o tronco vivo — o exame rodou no mundo
simulado (`?sim=1`) e no mundo mockado hermético; os caminhos de erro
apontados são código real lido linha a linha, mas a FREQUÊNCIA com que
disparam contra o Supabase de verdade não foi medida. Features 4–13
seguem na fila do exame.

---

*Filha do `13_prompt-dissecacao.md` e do crivo D62. Dissecação e cirurgia
são ritos separados: nada foi corrigido nesta sessão — a fila acima é o
produto. Próxima sessão sugerida: features 7+8 (a casa/conectores + a ida
vivida), que conversam direto com os MANCA 4–7 daqui.*
