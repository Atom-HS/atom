# Dissecação 02 — ÁRVORE · Raiz/cofre · Builder

*30 Jul 2026 (madrugada) · segunda sessão do exame do `13_prompt-dissecacao.md`.
Features 4–6, vividas antes de lidas: 15 cenas dirigidas com Playwright
(mundo simulado `?sim=1`, mundo mockado de 22 folhas num ramo, mundo vazio,
primeira chegada), depois o código, depois o crivo D62 contra os benchmarks
`09` e `16`. Instrumento do exame: `e2e/dissecacao-02.spec.ts` (reutilizável
— roda sob demanda, não é gate). Fotos 32–46 em `14_dissecacao-01_fotos/`
(a pasta é de todas as rodadas).*

---

## Vereditos

| # | Feature | Veredito | Em uma linha |
|---|---------|----------|--------------|
| 4 | **ÁRVORE + drill** | **VIVA** | A copa, a síntese e o drill dizem a verdade e o teto de 8 é declarado; as dívidas (cold start mudo, janela que não persiste, rótulos colidindo) estão nomeadas abaixo |
| 5 | **Raiz / cofre** | **VIVA** | A leitura avisa com lead certo e o gesto de renovar (Ato I) fecha o ciclo inline; mas a mesma tela tem DUAS leis de quietude — o card lê evento significativo, o grid lê `updated_at` (que a D63 baniu) |
| 6 | **Builder** | **MANCA** | A entrevista é limpa e o parto nasce no inbox como manda a lei — mas o tipo inferido está quebrado no código (meta vira «Habito»), finanças/família nunca parem estrutura, e a entrevista não sobrevive a um reload |

---

## 4 · ÁRVORE + drill — viva

**Vivido** (`32`–`37`): a copa abre com os 8 ramos em leque, folhas na cor
do módulo, e a síntese fala a língua da casa: *"a árvore pende: família
pedindo água · corpo em folha nova"* — estado, nunca cobrança. Trocar pra
estação 55 muda a leitura com honestidade (*"corpo em folha nova"* — família
volta a ter presença no baseline longo). O toque no ramo abre o drill
(`34`): 7 folhas com idade quieta (*hoje · ontem · 2d*) e o glifo de
maturação (`·`/`○`) no fim da linha. Na escala (`36`, 22 folhas mockadas), o
teto de 8 aparece com o total dito: *"trabalho · 22 folhas na janela"* +
*"+14 mais antigas na janela"* — **o drill não mente**. O espelho F9 acorda
com a semana simulada e silencia honesto no mundo raso (*"ainda ouvindo seus
dias"*).

**Intenção:** serve a lei 1 (a árvore é lente sobre o que foi tocado, nunca
gerenciador), a 3 (nenhum número julga; o "ideal" é o teu próprio passado —
comparação temporal, exatamente o que a evidência do benchmark `16` valida
contra a comparação social) e a D48 (maturação se vê no galho). Decisão
citável pra tudo que se vê.

**Profundidade:** [tree.ts](../../src/engine/tree.ts) é motor puro com 12
testes ([tree.test.ts](../../src/engine/tree.test.ts)): janela, arquivado,
teto-8-com-total-honesto, ano em repouso, árvore vazia quieta. A página tem
gate visual (3 cenas em `visual-mundo-novo`) e zero teste de lógica — o que
há de lógica na página é pouco (o motor faz o trabalho), está certo assim.

**Cantos achados vivendo:**

1. **Cold start mudo** (`37`): o mundo vazio desenha 8 tocos idênticos e
   **nenhuma palavra**. "Sem dado, e tudo bem" é indistinguível de "caiu".
   O benchmark `16` nomeia isso table stake (Whoop declara o cinza; Fitbit
   esconde o score raso) — é a obra 24b da fila, já autorizada.
2. **A janela escolhida não sobrevive à navegação** (`35`): estação 55
   escolhida, ida ao HOJE, volta — semana 7 de novo. `useState` local.
   A lente que o olho escolheu é preferência, não estado de página.
3. **Os rótulos «família» e «propósito» colidem** no topo do leque
   (`32`–`34`: lê-se "famíliapropósito") — os dois caem no anchor `middle`
   quase no mesmo x.
4. **"+14 mais antigas na janela" é beco** — a linha declara e morre; não
   expande, não leva a lugar nenhum.
5. **O tracejado do ideal é sutil demais** (opacity .35, dash 4-5 sobre
   fundo escuro): nas fotos mal se vê. "Real×ideal comunica sem
   explicação?" — o real comunica; o ideal é quase subliminar. A confiança
   por ramo (obra 24b) é o lugar certo de resolver isso junto.
6. **`·`/`○` no drill não têm legenda** — quem é da casa lê maturação; quem
   chegou ontem vê pontuação. Uma dica de primeira vez (padrão da linha de
   chão da aurora) resolve sem virar manual.

**Crivo (D62, benchmark `16`):** do lado certo das quatro condicionais de
dano (concretude, sem globalidade, baseline própria, sem streak) ✓. O risco
nomeado é retenção — "a roda entrega tudo na sessão 1" — e a resposta mais
barata do relatório ("o que mudou desde que VOCÊ olhou") segue sem dona.
Registrada como semente de primeira classe.

## 5 · Raiz / cofre — viva

**Vivido** (`38`–`41`): o panorama abre com o cofre lendo de verdade:
*"no vencimento"* com **tax return FY26 vence em 16d** (lead finance 60d) e
**passaporte AU vence em 113d** (lead documents 270d — a janela de 9 meses
avisando com meses de sobra, como a D63 mandou); *"faz tempo"* com saúde e
arquivos *"1a sem toque"*. O gesto de renovar (nascido no Ato I) abre inline
(`39`): data + *"vale até aí"* + *"agora não"* — quieto, no lugar, sem
modal. O toque na ausência leva direto ao inventário da gaveta (`40`) com
chips-exemplo e captura pro inbox. A primeira chegada (`41`) é digna:
*"vamos organizar sua vida, uma gaveta por vez"* + *"depois, talvez"* (que
cai no HOJE, verificado no router).

**Intenção:** D63 vivida — leitura-só virou leitura-com-um-gesto e o gesto
deixa rastro `touch` (a ausência zera por vida vivida, nunca por edição).
D46 no tom dos números (*"2 gavetas vivas · 4 quietas · 3 vazias"* — estado
puro).

**Profundidade:** [vault.ts](../../src/engine/vault.ts) coberto
([vault.test.ts](../../src/engine/vault.test.ts)): lead por domínio,
data-só até fim do dia ("vence hoje" nunca vira "venceu ontem"), ausência
por evento com retag não silenciando, `renewalPatch` puro. O espelho da
edge é guardado por `vault-espelho.test.ts` (Ato V).

**O achado que pesa — duas leis de quietude na mesma tela:**
[useRaiz.ts:31](../../src/hooks/useRaiz.ts) deriva o "quieta" do grid (e o
"Nd" pequeno dos cards) de **`updated_at`** — exatamente o que a D63 baniu
do cofre porque *"mente a cada retag"*. Resultado: o card *"faz tempo"* diz
ausência por evento significativo e, dez pixels abaixo, o badge do grid diz
quietude por edição de cadastro. Um retag em massa silenciaria o grid
inteiro sem um toque de vida. Obra pequena: o grid passa a ler a mesma
fonte do cofre (`absences`), uma lei só.

**Menores:**
- `healthPct` morto em [useRaiz.ts:46](../../src/hooks/useRaiz.ts) (com `/9`
  hardcoded) — o % morreu na D50, o código ficou.
- **Tom pré-lei** nos textos da Raiz: *"voce"*, *"fisicas"*, *"comeca"*,
  *"saude"*, *"financas"*, *"comunicacao"* — o welcome, os doors e os labels
  de `config/raiz.ts` são de antes da Lei do Tom (D60 ratificou «você», mas
  os acentos ficaram pra trás). Varredura de voz, gesto.
- O chip-exemplo captura no primeiro toque (um toque = item no inbox, sem
  confirmação). Defensável (captura-primeiro, nasce no estágio 1), mas vale
  registrar: é o único lugar da casa onde UM toque em texto pronto vira item.

**Crivo (D62, benchmark `09`):** "uma gaveta por vez" validada pelo topo ✓;
ausência por evento significativo é vantagem real sobre `updated_at` do
mercado ✓. O que falta é o que a D63 já declarou semente (cadastro guiado,
extração de data). Nada novo a puxar pra v1.

## 6 · Builder — manca

**Vivido** (`42`–`46`): a entrevista é o melhor formato da casa — uma
pergunta por vez, progresso quieto, *"pular essa"* sempre visível, voltar
que desfaz. O mini-wrap chama as coisas pelo nome (*"o que a conversa
pariu"* · *"que nasçam ·"*) e o parto cai no inbox estágio 1, como a lei
manda desde a correção da obra 8.

**As três fraturas:**

1. **O tipo inferido está quebrado no código.**
   [builder-mapper.ts:115-120](../../src/features/raiz/builder-mapper.ts)
   testa `questionId.includes('habito')`, `('meta')`, `('aprender')` — mas
   os IDs são `finance-3`, `mind-6`: **essas condições nunca são
   verdadeiras**. Sobra `endsWith('-3'|'-5') → habit`; os braços `task` e
   `ritual` são código morto. Vivido na foto `45`: a entrevista de finanças
   inteira pariu 1 item — a meta financeira do ano rotulada **«Habito»** — e
   o card do assentimento mostra o rótulo errado **sem chip pra trocar**. A
   D69 diz que leitura de heurística é sugestão visível e trocável; aqui ela
   é visível, errada e selada. (O item cai no inbox, então o portão da
   triage ainda deixa consertar depois — por isso MANCA, não MENTE.)
2. **Finanças e família não parem estrutura nenhuma.** Só corpo/mente/
   trabalho têm pergunta-condição (`PROTOCOL_TITLES`), e finanças
   dificilmente junta 2 elos — então o payoff prometido pela D64 ("pare
   cadeias e protocolos") simplesmente não existe pra 2 dos 5 módulos:
   4 perguntas → 1 item mal-tipado. E as respostas-contexto viram itens:
   *"com quem você mora?"* pare uma note com o nome das pessoas (lido no
   código, não vivido — `family-2` é freetext não seguido de frequency).
3. **A entrevista não sobrevive a um reload** (`44`): 1 pergunta
   respondida, reload, builder reaberto — módulos zerados, sem nenhum traço.
   O store não persiste. A reescrita em capítulos-gaveta retomáveis é obra
   de voz adiada por decisão (D64) — mas **não perder o que foi respondido**
   é infra, não voz: `persist` no store resolve hoje, a reescrita continua
   sendo do E.

**5 dos 8 módulos** têm entrevista (social, propósito, ponte fora) — dívida
conhecida do mapa. MindMate (D65) não foi exercitado nesta rodada — **NÃO
VERIFICADO**, fica pro exame que tocar na voz do builder.

**Crivo (D62, benchmark `09`):** o formato entrevista-que-pare está à
frente (implementation intentions, d=0.65–0.91, e ninguém no mercado
transforma resposta em estrutura viva) — mas só onde o parto funciona.
Payoff nulo em 2/5 módulos é exatamente "inovação com base ruim" que a D62
proíbe.

---

## A fila de ajustes

Prioridade: MENTE > MANCA > polimento. Tamanho: gesto · obra pequena ·
obra com mesa. **Nenhum achado MENTE nesta rodada** — nada foi corrigido
durante o exame (regra do `13_`), e a fila abaixo espera priorização.

| P | Ajuste | Onde | Tamanho | Lei que justifica |
|---|--------|------|---------|-------------------|
| **MANCA 1** | `inferType` consertado de verdade: mapa explícito questionId→type (meta→task, aprender→task, ritual família→ritual), matar os braços mortos | [builder-mapper.ts](../../src/features/raiz/builder-mapper.ts) | obra pequena | D64 · D69 |
| **MANCA 2** | O card do mini-wrap deixa trocar o tipo num toque (chip, como o da triage) | BuilderMiniWrap | obra pequena | D69 (a heurística nunca decide quieta) |
| **MANCA 3** | Builder-store persiste (localStorage) — reload não apaga entrevista; a reescrita retomável segue sendo obra de voz | [builder-store.ts](../../src/features/raiz/builder-store.ts) | obra pequena | D64 · D55 (nada se perde) |
| **MANCA 4** | Resposta-contexto não vira item (`family-2`, e revisar quais freetexts são contexto vs coisa) | builder-mapper + builder-questions | obra pequena | 2 (ruído no inbox é custo) |
| **MANCA 5** | Grid da raiz lê quietude pela lei do cofre (evento significativo), nunca `updated_at`; um "quieta" só | [useRaiz.ts](../../src/hooks/useRaiz.ts) | obra pequena | D63 |
| **MANCA 6** | Cold start da ÁRVORE declarado + confiança por ramo (obra 24b da fila, já autorizada pelo benchmark `16`) | Arvore.tsx + tree.ts | obra pequena | D62 · benchmark `16` |
| pol. 7 | Janela da árvore persiste (localStorage/store) | Arvore.tsx | gesto | 2 |
| pol. 8 | Rótulos «família/propósito» sem colisão (ajustar ângulo do leque ou anchor) | Arvore.tsx TreeCrown | gesto | legibilidade |
| pol. 9 | "+N mais antigas" vira porta (expande o drill ou abre a busca do ramo) | Arvore.tsx | gesto | 2 |
| pol. 10 | Tracejado do ideal mais legível (ou legenda de primeira vez) | TreeCrown | gesto | D46 (estado que não se lê não é estado) |
| pol. 11 | Legenda quieta de `·`/`○` no primeiro drill | Arvore.tsx | gesto | 2 |
| pol. 12 | Varredura de tom na Raiz/Builder: acentos + «você» (welcome, doors, config/raiz, perguntas do builder) | config/raiz.ts + features/raiz | gesto | D60 |
| pol. 13 | `healthPct` morto sai do hook | useRaiz.ts | gesto | higiene |

## Decisões propostas (pra mesa do Rick)

- Nenhuma DP nova nesta rodada. Os achados 1–5 são aplicação de leis já
  ratificadas (D63, D64, D69, D60); o cold start (6) já tem autorização
  na fila do roteiro (obra 24b). A única quase-decisão — "entrevista com
  condição pra finanças/família" (pra protocolo nascer lá também) — é
  obra de voz com o E., e a D64 já a nomeou; registrada como semente.

## Sementes registradas

- **"O que mudou desde que você olhou"** — recap ancorado no último open,
  não em fronteira de calendário (benchmark `16`, espaço vazio nº 4 — a
  resposta mais barata ao problema de retenção da categoria).
- **Pergunta-condição pra finanças e família** — "quando aperta o
  dinheiro, o que ajuda?" / "quando a casa pesa?" — pra protocolo nascer
  nos 5 módulos (obra de voz, com o E. na mesa).
- **Drill como porta de busca** — o "+N mais antigas" abrindo a busca já
  filtrada pelo ramo e janela (conversa com a busca reformada do `16`).

## Não verificado nesta sessão

MindMate (D65) e a voz do builder em mindmate-mode; o Builder nos módulos
corpo/mente/trabalho de ponta a ponta (o parto com cadeia + protocolo real
— o gate visual `builder — a entrevista pare cadeia e protocolo` cobre o
caminho feliz, mas esta rodada só viveu finanças); produção real contra o
Supabase vivo (mesma ressalva da dissecação 01).

---

*Filha do `13_prompt-dissecacao.md` e do crivo D62. Dissecação e cirurgia
são ritos separados: nada foi corrigido nesta sessão — a fila acima é o
produto. As MANCA 1–4 formam um pacote só (o parto honesto do builder) e
valem uma sessão de cirurgia própria; a MANCA 6 já está autorizada como
obra 24b desta noite.*
