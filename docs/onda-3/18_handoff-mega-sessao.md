# Handoff — a sessão que roda enquanto a casa dorme

*29 Jul 2026, fim da noite. Este documento existe pra uma sessão NOVA
assumir o trabalho sem o Rick por perto e sem o contexto da conversa
anterior. **Leia este arquivo inteiro antes de tocar em qualquer coisa.**
Ele é a única porta de entrada; os outros documentos são citados daqui.*

---

## 0 — Em uma tela: onde a casa está

Branch **`v2-faces`**, HEAD limpo, tudo verde:
`pnpm tsc --noEmit` · `pnpm vitest run` (374 testes) · `pnpm build` ·
gate visual 13/13 · cenas de prova 9/9.

Hoje aconteceram, nesta ordem:

1. **Dissecação 01** (`14_dissecacao-01.md`) — features 1–3 examinadas
   vivendo o app antes de ler o código. Achou telas que **mentiam**.
2. **O roteiro do mago** (`15_roteiro-do-mago.md`) — 7 atos, autorização
   declarada, decisões pré-resolvidas. **É o plano mestre.**
3. **Atos I a V executados** — as mentiras mortas, a porta que faltava
   aberta, a esteira honesta, a pressão da semana, o cofre com uma lei só.
4. **Benchmark 16** (`16_benchmark-faces.md`) — o crivo D62 aplicado a
   panorama, fechamento, busca e projetos. Uma frente reprovou (busca) e
   foi consertada na mesma sessão.

**Restam os Atos VI e VII.** É isso que esta sessão vai fazer.

---

## 1 — Ordem de leitura (antes de executar)

| # | Arquivo | Por quê |
|---|---------|---------|
| 1 | `CLAUDE.md` (raiz) | a lei operacional: Build Protocol, regras de código, o que NUNCA fazer |
| 2 | `docs/onda-3/15_roteiro-do-mago.md` | o plano mestre — **§0 é a autorização, §3 são os atos, o apêndice tem o checklist** |
| 3 | `docs/onda-3/13_prompt-dissecacao.md` | o RITO do exame — o Ato VI é executar isto três vezes |
| 4 | `docs/onda-3/14_dissecacao-01.md` | o modelo do relatório que se espera |
| 5 | `docs/onda-3/16_benchmark-faces.md` | a régua de mercado; a seção final «o que muda nas obras» é fila real |
| 6 | `docs/onda-3/03_decisoes-ux.md` | as decisões D40–D69 citáveis |
| 7 | `docs/onda-3/onda-3-log.md` | o diário; o último wrap conta a noite de hoje |

Não precisa ler os outros pra começar.

---

## 2 — A autorização (vale integralmente, sem perguntar)

O §0 do roteiro é a lei desta sessão. Resumo operacional:

**Pode, sem pedir:** editar qualquer camada em `src/`, `e2e/`,
`supabase/functions/`; criar testes e cenas; rodar os hooks quantas vezes
quiser; **commitar em `v2-faces`** (um commit por obra); escrever docs
novos em `docs/onda-3/`; refotografar baselines quando a mudança for
intencional (e dizer o porquê no commit).

**Nunca, mesmo com pressa:**
1. Não editar docs-lei (`law/*.md`).
2. Não ratificar decisão — escreve «DP», nunca «D».
3. Não deletar AtomItem — entropy é archive.
4. **Não fazer merge no `master` nem puxar o gatilho do gate (D41).**
5. **Não fazer deploy, não tocar em produção, não rodar edge function
   contra o Supabase real, não `git push`.** Esta sessão é local. O Rick
   decide o que sobe quando acordar.
6. Não usar `gmail.modify` nem aplicar label em mensagem (D68).
7. Não commitar com teste vermelho ou tsc sujo.
8. **Não corrigir durante a dissecação** — exame e cirurgia são ritos
   separados. Achou no exame: anota, termina o passo, conserta depois.

**As três — e só três — condições de parada:**
1. Um muro acima é a única saída.
2. Um hook fica vermelho e não fecha em duas tentativas.
3. Um dado real contradiz o que o plano assume.

Se parar, **escreva o porquê em `docs/onda-3/onda-3-log.md`** antes de
encerrar, com o estado exato em que as coisas ficaram.

---

## 3 — O trabalho, em ordem

Cada item fecha com **hooks verdes + commit**. Commite a cada obra, nunca
acumule: se o contexto acabar no meio, o que foi commitado sobrevive.

### Fase A — o exame (o grosso da noite)

Executar o rito do `13_prompt-dissecacao.md` três vezes. Cada rodada gera
seu próprio documento, no molde do `14_dissecacao-01.md`: tabela de
vereditos · fila priorizada (MENTE > MANCA > polimento, cada um com tamanho
e lei) · decisões propostas · sementes · fotos das cenas que provam.

| Rodada | Doc a criar | Features |
|---|---|---|
| A1 | `docs/onda-3/14_dissecacao-02.md` | 4 ÁRVORE+drill · 5 Raiz/cofre · 6 Builder |
| A2 | `docs/onda-3/14_dissecacao-03.md` | 7 a casa/conectores · 8 a ida · 9 digest |
| A3 | `docs/onda-3/14_dissecacao-04.md` | 10 Wrap · 11 busca · 12 projetos · 13 offline/PWA |

**Regras do exame que valem ouro:**
- **Viver antes de ler.** Playwright dirigindo o app de verdade
  (`e2e/atos.spec.ts` e `e2e/dissecacao-01.spec.ts` são os modelos), mundo
  simulado com `?sim=1`, e mundos mockados quando precisar de escala.
- «Deve funcionar» não existe: ou viveu e viu, ou entra como **NÃO
  VERIFICADO** no relatório.
- Fotos vão em `docs/onda-3/14_dissecacao-01_fotos/` (a pasta já existe e
  é a de todas as rodadas), numeradas a partir de **32**.
- Já há régua de mercado pronta pra 4, 10, 11 e 12 no `16_benchmark-faces`
  e pra 5 e 6 no `09_benchmark-crivo` — **use, não repita a pesquisa.**
  Para 7, 8 e 9 a régua é o `10_benchmark-conectores`.

Depois de **cada** rodada, aplicar dela **só o que for MENTE** (com teste
que prova a mentira morta), commitar, e seguir pra próxima rodada. O resto
da fila fica pro Rick priorizar.

### Fase B — as obras que o benchmark já justificou

Estas não precisam de exame: a evidência está no `16_benchmark-faces.md`.

1. **WRAP em um passo por tela** — conversão de formulário despenca de 23%
   (3 campos) para 11% (7), e o rito tem 7 passos; o mitigante medido é um
   passo por tela, **todos puláveis**, e o selo válido com 6 dos 7 vazios.
   Não cortar passos — mudar a forma. *(obra com mesa)*
2. **ÁRVORE com cold start declarado e confiança por ramo** — «sem dado, e
   tudo bem» tem que ser distinguível de «caiu». Nenhum produto do mercado
   trata cobertura por área; é encaixe direto pros 8 ramos. *(obra pequena)*

### Fase C — o gate, carregado e não disparado

Preparar tudo e **parar antes do gatilho** (D41 é decisão do Rick):
- a lista do que morre no merge: `/home`, `/pipeline`, `/calendar`,
  `/analytics`, `/library`, `/graph`, `/review`;
- a confirmação, tela a tela, de que o mundo novo cobre o que a velha
  fazia — o Pipeline só pode morrer porque o assentimento já virou camada
  (Ato II); verificar que nada mais depende das telas condenadas;
- `/projects` conforme a DP-E (vive como camada, morre como tela) — mas
  **só se a dissecação 04 confirmar**; se contradisser, manda o exame;
- escrever o resumo do gate em `docs/onda-3/19_gate.md`, com antes/depois
  em fotos. **Não abrir PR, não fazer merge.**

### Fecho

Wrap no `onda-3-log.md` no formato da casa (soul · items · decidido ·
conexões · seeds · audit · next) e, no fim dele, **uma lista curta do que
espera decisão do Rick**.

---

## 4 — Como verificar (o rito do verde)

Depois de **cada obra**, não de cada fase:

```
pnpm tsc --noEmit     → zero erro
pnpm vitest run       → zero vermelho
pnpm build            → completa
```

E os gates de cena, quando mexer em tela:

```
npx playwright test e2e/atos.spec.ts --project=mobile              → 9 cenas
npx playwright test e2e/visual-mundo-novo.spec.ts --project=mobile → 13 fotos
```

Baseline visual só se refotografa com **intenção declarada no commit**.
Baseline que muda sem intenção é bug disfarçado de foto.

**Duas armadilhas já pagas nesta casa, não caia de novo:**
- O PowerShell 5.1 corrompe acentos com `Get-Content`/`Set-Content`. Para
  editar arquivo com acento por script, use
  `[System.IO.File]::ReadAllText/WriteAllLines` com
  `[System.Text.UTF8Encoding]::new($false)`. Melhor ainda: use a ferramenta
  de edição, não script.
- Here-string do PowerShell quebra com aspas duplas dentro. Nas mensagens
  de commit use «» ou nada.

---

## 5 — O que NÃO fazer nesta sessão (escopo é o que se recusa)

- Bilhetes do E. v2 (obra de voz, precisa do E. na mesa).
- Library-despensa, email vestido de Atom (sementes).
- Cofre completo — D63 diz que v1 é leitura-só.
- Chain player (obra grande, onda seguinte).
- Os 62 erros de lint da casca velha — morrem no gate junto com as telas;
  consertar código sentenciado é trabalho que o merge apaga.
- Qualquer coisa que exija a mão do Rick: deploy, push, merge, dry-run do
  digest contra dado real, redirect URL do Supabase.

---

## 6 — Estado conhecido, pra não redescobrir

- **`/pipeline` está órfã de propósito** — o assentimento virou camada
  (`components/triage/Assentimento` + `AssentimentoSheet`, chamados do
  puxador do HOJE). A tela velha só espera o gate.
- **A herança de série** (`engine/series`) só vale pra instância NOVA; o
  que já está no inbox espera o humano, como deve.
- **A edge `daily-digest` espelha a lei do cofre à mão** (Deno não alcança
  o alias `@/`). `engine/vault-espelho.test.ts` compara os dois e quebra na
  divergência — se mexer no `engine/vault` ou no `engine/digest`, o espelho
  na edge tem que seguir.
- **A memória do digest** (`digest_sent` no `atom_events`) nunca rodou
  contra dado real. É pendência do Rick, não desta sessão.
- **Nenhuma edge tem teste de runtime** — o guarda cobre constantes, não
  comportamento. Vale como achado da dissecação 03.
- **Seis decisões propostas** (DP-A a DP-F, no `15_roteiro-do-mago.md` §0.3)
  rodaram com default aplicado e esperam a palavra do Rick. **Não as
  ratifique.** A DP-E está deliberadamente em suspenso até a dissecação 04.

---

*Se em algum momento a dúvida for de estilo, o precedente da casa decide.
Se for de escopo, a tabela do §5. Se for de ordem, o §3. Se não for
nenhuma das três, provavelmente é decisão do Rick — anota como DP e segue.*
