# Handoff — a sessão da cirurgia fina

*30 Jul 2026 · escrito pela sessão da noite pra próxima sessão desacompanhada.
**Leia este arquivo inteiro antes de tocar em qualquer coisa.** Ele é a única
porta de entrada; o resto se cita daqui. O molde é o do `18_handoff-mega-sessao.md`
— autorização na frente, ordem de marcha, muros, três condições de parada.
O princípio que rege tudo: **de dentro pra fora, geometria perfeita sempre** —
motor antes de face, lei antes de pele, nenhuma camada assume o que a de baixo
não definiu.*

---

## 0 — Em uma tela: onde a casa está

Branch **`v2-faces`**, HEAD limpo (13 commits da noite de 30 Jul), tudo verde:
`pnpm tsc --noEmit` · `pnpm vitest run` (392) · `pnpm build` ·
gate visual 13/13 · `atos.spec` 12 cenas.

O que a noite deixou pronto:

- **O exame das 13 features terminou** (`14_dissecacao-01..04`) — três
  MENTEs achadas ao vivo e mortas com teste; a fila MANCA está numerada
  dentro de cada doc.
- **O gate está carregado** (`19_gate.md`) — não disparado. **Duas condições
  seguram o gatilho**, e UMA delas é obra desta sessão (a sheet do projeto).
- **O resumo executivo** é o `20_resumo-da-noite.md` (há par em HTML).

**Esta sessão faz a cirurgia fina da fila** — as obras que o exame justificou
e que não precisam da mão do Rick. Nada de exame novo: o diagnóstico está
feito; agora é bisturi.

---

## 1 — Ordem de leitura (antes de executar)

| # | Arquivo | Por quê |
|---|---------|---------|
| 1 | `CLAUDE.md` (raiz) | a lei: Build Protocol §3, regras de código §4, o que NUNCA §8 |
| 2 | `docs/onda-3/20_resumo-da-noite.md` | o mapa do estado — 5 minutos |
| 3 | `docs/onda-3/14_dissecacao-02.md` §6 + fila | o diagnóstico do builder (obra 1) |
| 4 | `docs/onda-3/14_dissecacao-04.md` §12 + fila | a DP-E e a sheet do projeto (obra 2) |
| 5 | `docs/onda-3/19_gate.md` §2–§3 | as condições do gate que esta sessão destrava |
| 6 | `docs/onda-3/03_decisoes-ux.md` | as leis citáveis (D40–D69) |

Não precisa ler mais nada pra começar. As dissecações 01 e 03 se consultam
sob demanda (a fila de cada uma cita arquivo e linha).

---

## 2 — A autorização (vale integralmente, sem perguntar)

**Pode, sem pedir:** editar qualquer camada em `src/`, `e2e/`,
`supabase/functions/`; criar testes e cenas; rodar hooks à vontade;
**commitar em `v2-faces`** (um commit por obra, convenção da casa); escrever
docs novos em `docs/onda-3/`; refotografar baseline visual **só com intenção
declarada no commit**.

**Os muros (nunca, mesmo com pressa):**

1. Não editar docs-lei (`law/*.md`).
2. Não ratificar decisão — escreve «DP», nunca «D».
3. Não deletar AtomItem — entropy é archive.
4. **Não fazer merge no `master` nem puxar o gatilho do gate (D41).**
5. **Não fazer deploy, não tocar em produção, não rodar edge contra o
   Supabase real, não `git push`.** Sessão local; o Rick decide o que sobe.
6. Não usar `gmail.modify` (D68).
7. Não commitar com teste vermelho ou tsc sujo.
8. Cirurgia é cirurgia: **não abrir exame novo no meio da obra** — achado
   colateral vira nota na fila, não desvio de rota.

**As três — e só três — condições de parada:**

1. Um muro acima é a única saída.
2. Um hook fica vermelho e não fecha em duas tentativas.
3. Um dado real contradiz o que este handoff assume.

Se parar: escreve o porquê no `onda-3-log.md` com o estado exato das coisas.

**Decisões pré-resolvidas desta sessão (defaults declarados):**

| DP | Pergunta | Default |
|---|---|---|
| **DP-G** | A escada F4 ganha porta na ÁRVORE sem o Rick ter escolhido a opção do gate §3? | **Sim, faz** — é a recomendação registrada, é obra pequena e 100% reversível (se o Rick escolher a morte consciente, apaga-se um puxador). Registrar como DP, não ratificar. |
| **DP-H** | O tipo do parto do builder, consertado, contraria algum selo já dado? | **Não re-tipa nada retroativo** — o conserto vale pro parto novo; item já nascido espera o humano na triage, como sempre. |
| **DP-I** | A sheet do projeto mostra o quê na v1? | **Só o que a página provou que importa**: presença (linha do engine), filhos com estado `·`/`○`, o próximo como convite, «quieto há Nd». Criar projeto, filtros e agrupamento NÃO entram — eram chrome de gerenciador (benchmark 16). |

---

## 3 — O trabalho, em ordem (de dentro pra fora)

Cada obra fecha com **hooks verdes + commit**. Nunca acumule duas obras num
commit. A ordem não é gosto: motor → camada → gesto → pele, e a obra que
destrava o gate vem cedo.

### Obra 1 — o parto honesto do builder *(obra com mesa · MANCA 1–4 da dissecação 02)*

O diagnóstico, provado por foto (45) e código: `inferType` em
[builder-mapper.ts:115](../../src/features/raiz/builder-mapper.ts) testa
`includes('habito'|'meta'|'aprender')` contra IDs `finance-3` — **nunca
bate**; sobra `endsWith('-3'|'-5') → habit` e os braços task/ritual mortos.
A meta financeira nasce «Habito». E: resposta-contexto vira item
(`family-2`), reload apaga a entrevista, o card do mini-wrap mostra o tipo
sem deixar trocar.

**As quatro camadas do bisturi (nesta ordem — Build Protocol na escala):**

1. **ESTRUTURA (mapper)** — mapa explícito `questionId → papel`:
   o que é *coisa* (nasce item, com tipo dito por extenso: `finance-3 →
   task`, `mind-6 → task`, `family-3 → ritual`…), o que é *contexto* (não
   nasce nada: `family-2`, `finance-2`, `work-1`…), o que é *elo* (freetext
   + frequency, como já é). Matar os braços mortos. Teste co-locado por
   módulo: o parto de finanças inteiro, o de família inteiro — entrada →
   itens esperados, tipo a tipo.
2. **ESTRUTURA (store)** — `persist` no builder-store (localStorage):
   reload retoma onde parou. A reescrita em capítulos-gaveta segue sendo
   obra de voz com o E. (D64) — aqui é só não perder o que foi dito.
3. **INTERFACE (mini-wrap)** — o card ganha o chip de troca de tipo
   (mesma gramática do chip da triage, D69: a heurística nunca decide
   quieta). Trocar no chip muda o que nasce.
4. **A prova** — cena e2e: entrevista de finanças completa → mini-wrap
   mostra a meta como task → troca no chip → «que nasçam» (o mundo mockado
   já engole o POST). Foto nova pra pasta das dissecações (numeração segue
   da 70).

### Obra 2 — a sheet do projeto *(obra pequena · DP-E/DP-I · condição do gate §2)*

A pill do HOJE ([Hoje.tsx:346](../../src/pages/Hoje.tsx)) para de navegar
pra `/projects` e passa a abrir uma **sheet** — molde:
`components/triage/AssentimentoSheet` (backdrop, `role="dialog"`, fecha por
fora). Conteúdo pela DP-I. O engine já dá tudo
([engine/project.ts](../../src/engine/project.ts), testado) — a sheet é só
INTERFACE, zero motor novo. `/projects` fica intocada (morre no gate, não
antes). Prova: cena e2e pill → sheet → toca o próximo → ItemDetail; foto.
**Ao fechar esta obra, atualizar o `19_gate.md` §2: condição 1 cumprida.**

### Obra 3 — a porta da escada na ÁRVORE *(obra pequena · DP-G · gate §3a)*

Um puxador quieto no pé da face ÁRVORE, no padrão exato do puxador do HOJE
(«N esperando leitura»): quando `nextAvailableReview(items)` devolve algo,
uma linha — *«uma semana espera significado»* (ou lunar/estação) — que leva
ao rito de `/review` **como camada ou como rota, o que for mais barato sem
reformar o Review** (a reforma da tela é de outra onda; aqui é só a porta).
Estado, nunca cobrança (D46): sem número, sem badge. Some quando não há.
Prova: cena e2e com mundo mockado que tem review disponível; foto.
**Atualizar o `19_gate.md` §3: a lacuna da escada tem porta; `/review` sai
da lista de condições e entra na lista §4 com a nota da nova porta.**

### Obra 4 — as portas invisíveis ganham corpo *(gestos · dissecações 03/04)*

Mesma família, mesma sessão:

1. **O puxador da casa** — a barra de 36×4px (foto 47) ganha rótulo mono
   quieto (padrão: `a casa` em 10px `text-faint` sob a barra, ou a barra
   um fio mais larga + `aria` que já existe). Sem virar aba (D54 de pé).
2. **O pull-down da busca** — affordance de primeira vez: um hint discreto
   que aparece UMA vez (localStorage) e morre pra sempre — «puxa pra baixo
   pra buscar». Sem tutorial, sem tooltip perpétuo.

Baselines do gate visual VÃO mudar (HOJE e a nav aparecem em várias fotos)
— refotografar com a intenção declarada no commit: *«o puxador ganhou
rótulo; baselines refotografadas por isso»*.

### Obra 5 — miúdos de lei *(gestos · um commit só, «chore(leis): …»)*

Cada um é pequeno; juntos fecham pontas soltas do exame:

1. `disconnect()` com ida viva **desfaz primeiro** (ou recusa com fala
   clara), token morre por último (D68 — dissecação 03 MANCA 3).
2. Grid da raiz lê quietude pela lei do cofre (`absences`), não
   `updated_at`; `healthPct` morto sai (D63 — dissecação 02 MANCA 5 + pol. 13).
3. `who:` entra no `prefixVocabulary()` com os valores `#who:*` que
   existem no tronco (dissecação 04 pol. 7).
4. Toasts do conector na Lei do Tom («não consegui desligar agora — o
   conector segue como estava») e o «Item capturado» silencia durante o
   selo do wrap (D60 — pol. 6/8).
5. Varredura de tom na Raiz/Builder/Aurora: «você» sempre (o «alem de ti»
   da aurora é forma-tu), acentos nos textos de UI (`config/raiz.ts`,
   welcome, doors, perguntas do builder) (D60 — pol. 10/12).

### Fecho

Wrap no `onda-3-log.md` no formato da casa (soul · items · decidido ·
conexões · seeds · audit · next), DPs novas juntadas pra mesa do Rick, e a
fila do que sobrou. Se tudo fechou: **o gate fica com gatilho livre** — as
duas condições do §2 cumpridas — e isso é a última linha do wrap.

---

## 4 — O rito do verde (depois de CADA obra)

```
pnpm tsc --noEmit     → zero erro
pnpm vitest run       → zero vermelho
pnpm build            → completa
```

E quando mexer em tela:

```
npx playwright test e2e/atos.spec.ts --project=mobile              → 12+ cenas
npx playwright test e2e/visual-mundo-novo.spec.ts --project=mobile → 13 fotos
```

Baseline só se refotografa com intenção declarada no commit.

**As armadilhas já pagas nesta casa (não caia de novo):**

- PowerShell 5.1 corrompe acentos com `Get-Content`/`Set-Content` — use a
  ferramenta de edição, nunca script, pra arquivo com acento.
- Here-string do PowerShell quebra com aspas duplas — nas mensagens de
  commit, use «» ou nada.
- **Cena que afirma «hoje» nunca usa data fixa** — a cena do ato III
  quebrou à meia-noite por isso (paga em 30 Jul).
- A porta do e2e é a **5199** (a 5173 é disputada); o mundo simulado é
  `?sim=1`; a aurora cobre o dia em mundo sem chegada — os specs têm
  `passarAurora`/loop de «pular» prontos pra copiar.
- O mock de `user_connectors` e das functions vive em
  `e2e/dissecacao-03.spec.ts` (`mockCasa`) — reusar, não reinventar.

---

## 5 — O que NÃO se faz nesta sessão (escopo é o que se recusa)

- **Deploy da `daily-digest`** (a MENTE do cron corrigida espera o Rick).
- **O gatilho do gate** — esta sessão o destrava, nunca o puxa.
- **Reformar `/review` ou `/projects`** — as telas morrem no merge;
  consertar código sentenciado é trabalho que o merge apaga. Só as PORTAS
  novas (sheet, puxador) nascem.
- **Reescrita das perguntas do builder em capítulos-gaveta** — obra de voz,
  com o E. na mesa (D64).
- **Os 62 erros de lint da casca velha** — morrem no gate.
- **Cofre completo, Library-despensa, bilhetes v2, chain player** — sementes
  e ondas seguintes, como sempre.
- **Exame novo** — o diagnóstico está feito; achado colateral vira nota.

---

## 6 — Estado conhecido, pra não redescobrir

- Os guardas de espelho são dois e são padrão: `vault-espelho.test.ts` e
  `series-espelho.test.ts` — se mexer em `engine/vault`, `engine/digest`,
  `engine/series` ou no contrato de ingestão, o espelho na edge segue
  junto ou o teste quebra (de propósito).
- O `comPrazo` (6s) em `useItems` é o que torna o bolso alcançável — não
  remover «pra simplificar»; o porquê está em
  `items-snapshot.ts` e na dissecação 04.
- O selo do wrap NÃO exige mais campo nenhum (obra 24a) — qualquer obra
  no wrap preserva isso (a cena «dia vazio também se sela» vigia).
- A pill do projeto usa `projectPresence`/`presenceLine` — a sheet da
  obra 2 consome os MESMOS; se sentir falta de dado no engine, a resposta
  é teste novo no engine, nunca cálculo na UI.
- `AuroraRitual`, `ProtocolBanner` e `protocol-snooze` moram em
  `components/home/` mas pertencem ao mundo novo — não confundir com a
  casca velha na hora de mexer em tom.
- As DP-A…DP-F rodam com default aplicado; a DP-E está confirmada pela
  vivência e **espera ratificação** — nada disso se ratifica aqui.

---

*Se a dúvida for de estilo, o precedente da casa decide. Se for de escopo,
a tabela do §5. Se for de ordem, o §3. Se não for nenhuma das três,
provavelmente é decisão do Rick — anota como DP e segue. De dentro pra
fora, geometria perfeita sempre: o motor não conhece a face, a face não
inventa o que o motor não deu, e nenhuma obra nasce em cima de dúvida
não resolvida.*
