# Handoff — a sessão da faxina e da fila (o rescaldo do gate)

*30 Jul 2026 · escrito pela sessão do gate pra próxima sessão.
**Leia este arquivo inteiro antes de tocar em qualquer coisa.** Ele é a única
porta de entrada; o resto se cita daqui. O molde é o do
`23_handoff-sessao-gate.md` — mas esta sessão é comum: nada de gatilho,
nada de morte. É varrer o chão depois da obra e fechar a fila MANCA que as
dissecações deixaram nomeada.*

---

## 0 — Em uma tela: onde a casa está

**O gate disparou em 30 Jul 2026** (carimbo no `19_gate.md` §6). Sete telas
morreram, `/review` vive fora da nav, a nav `· ⬡ ✳` é a casa inteira.
`v2-faces` foi mergeada em `master` (`7c05363`, merge commit no precedente
da casa) e **ambas estão pushadas no origin**. Tudo verde no HEAD:
`pnpm tsc --noEmit` · `pnpm vitest run` (404) · `pnpm build` ·
`atos.spec` 15 cenas · gate visual 13/13 ·
lint com 46 erros + 3 avisos (todos herdados, fora das telas mortas).

O wrap da sessão do gate está no `onda-3-log.md` (30 Jul, «a sessão do
gate») — os achados colaterais de lá são as obras 1 desta sessão.

**Esta sessão trabalha em `v2-faces`** (a branch viva da onda, sincronizada
com master). Cada obra fecha com hooks verdes + um commit.

---

## 1 — Ordem de leitura (antes de executar)

| # | Arquivo | Por quê |
|---|---------|---------|
| 1 | `CLAUDE.md` (raiz) | a lei: Build Protocol §3, código §4, o que NUNCA §8 |
| 2 | `docs/onda-3/onda-3-log.md` (último wrap) | o estado exato pós-gate |
| 3 | `docs/onda-3/14_dissecacao-02.md` (fila) · `14_dissecacao-03.md` (fila) · `14_dissecacao-04.md` (fila) | a letra das MANCAs — as obras 2–5 nascem delas |
| 4 | `docs/onda-3/03_decisoes-ux.md` | as leis citáveis (D46, D52, D54, D60, D68, D69 regem esta fila) |

---

## 2 — A autorização (vale integralmente, sem perguntar)

**Pode, sem pedir:** editar em `src/`, `e2e/`, `supabase/functions/` (só o
CÓDIGO — deploy nunca) e `package.json` conforme as obras abaixo; commitar
em `v2-faces` (um commit por obra); escrever docs em `docs/onda-3/`; rodar
hooks à vontade. **Merge em `master` e push: só se a linha de autorização
estiver no prompt do Rick.**

**Os muros (nunca, mesmo com pressa):**

1. Não editar docs-lei (`law/*.md`).
2. Não ratificar decisão — escreve «DP», nunca «D».
3. Não deletar AtomItem — entropy é archive. (Código órfão, sim, morre.)
4. **Não tocar produção**: sem deploy de edge, sem Supabase, sem Vercel à
   mão. A edge corrigida nesta sessão (obra 2) só vale depois da mão do
   Rick — igual à `daily-digest` que já espera.
5. **Não re-taggear itens já nascidos** (precedente DP-H): o conserto do
   `extractWhoTag` (obra 3) vale pro parto novo; o que nasceu com
   `#who:andr-tanaka` fica — se a busca precisar aceitar os dois, anota DP.
6. Não apagar specs nem fotos históricas — história é história. A nota de
   museu (obra 1) é cabeçalho, nunca delete.
7. Não commitar com teste vermelho ou tsc sujo.
8. Achado colateral vira nota na fila, não desvio de rota.

**As três — e só três — condições de parada:**

1. Um muro acima é a única saída.
2. Um hook fica vermelho e não fecha em duas tentativas.
3. Um dado real contradiz o que este handoff (ou uma dissecação) assume.

Se parar: escreve o porquê no `onda-3-log.md` com o estado exato das coisas.

**As obras são independentes** — se o dia não render pra todas, fechar
menos obras INTEIRAS vale mais que todas pela metade. A ordem abaixo é a
recomendada (de dentro pra fora), não uma corrente.

---

## 3 — O trabalho, em ordem (de dentro pra fora)

### Obra 1 — a faxina pós-gate *(o chão limpo antes de obra nova)*

1. `d3` e `@types/d3` saem do `package.json` (+ lockfile via
   `pnpm remove`) — só o Graph morto usava; conferir com grep antes.
2. Os exports órfãos do `Skeleton.tsx` morrem (`SoulCardSkeleton`,
   `ChartSkeleton`, `RingSkeleton`) — `CardSkeleton`/`ListSkeleton` ficam
   (o `AuditPanel` vivo usa). Conferir com grep antes de matar.
3. Nota de museu nos specs históricos de e2e que apontam pra rotas mortas
   (`dissecacao-01.spec.ts`, `tour.spec.ts`, `gate-fotos.spec.ts` — e
   conferir os demais por grep): cabeçalho declarando que fotografam o
   mundo de antes do gate e não rodam no rito do verde. Sem apagar, sem
   consertar, sem skip que esconda — só a verdade no topo do arquivo.

### Obra 2 — a lente sabe de si *(diss. 03 · MANCA 4 + MANCA 5)*

1. **A sheet diz que o cron existe** (MANCA 4): na SettingsSheet, o estado
   quieto — «a casa olha sozinha todo dia às 07:15 · última volta há Nh»
   — lendo `user_connectors.last_sync_at`. Estado, nunca promessa (D46).
2. **Reconciliação na volta diária** (MANCA 5): a `daily-digest` chama o
   diff da taxonomy na volta — «deletou lá fora → braço desliga» deixa de
   depender de alguém abrir o preview à mão (D68). Espelho de contrato à
   mão na edge? O molde dos guardas (`vault-espelho`, `series-espelho`)
   já é padrão da casa — o terceiro espelho nasce com guarda.
3. Lembrete no wrap: o deploy da edge (esta + a `daily-digest` corrigida
   em 30 Jul) segue esperando a mão do Rick — agora com duas razões.

### Obra 3 — o `extractWhoTag` com acento *(diss. 03 · pol. 7)*

1. Translitera antes de slugificar: André Tanaka → `#who:andre-tanaka`
   (hoje come o acento: `#who:andr-tanaka`). Vive no `connector-service`
   **e no espelho da edge** — os dois lados mudam juntos, e o guarda de
   espelho quebra se divergirem (é pra isso que ele existe).
2. O `who:` da busca (obra 5 da cirurgia) ensina com os valores do tronco
   — conferir que os valores novos transliterados aparecem certos.
3. Muro 5 vale: item já nascido não se re-taggeia.

### Obra 4 — o passo 5 do wrap vira boca *(diss. 04 · MANCA 4)*

1. O passo das sementes deixa de ser cartão oco: boca de texto →
   nasce `#seed` no inbox (captura-primeiro, D52; o wrap já captura em
   silêncio — pol. 8 da cirurgia). Alternativa registrada: sair da
   contagem — mas a recomendação das dissecações é a boca.
2. Cena de prova no `atos.spec` (o rito continua 1 passo por tela; selo
   com dia vazio segue valendo — obra 24a não regride).

### Obra 5 — polimentos da ÁRVORE *(diss. 02 · pol. 7–11, os do wrap)*

1. **Janela persiste** (pol. 7): a lente escolhida (semana/lunar/estação/
   ano) sobrevive à navegação — localStorage no padrão da casa
   (`mindroot.*`, ver §6).
2. **Rótulos sem colisão** (pol. 8): «família» e «propósito» se leem
   separados no topo do leque (ângulo ou anchor).
3. **«+N mais antigas» vira porta** (pol. 9): expande o drill ou abre a
   busca já filtrada pelo ramo (a semente «drill como porta de busca»
   conversa com a busca do `16`).
4. **Legenda quieta de `·`/`○` no primeiro drill** (pol. 11): o padrão
   hint-de-primeira-vez já existe (`mindroot.hint-busca.v1`) — reusar o
   molde, não inventar outro.
5. (pol. 10, o tracejado do ideal, se o dia render — senão fica na fila
   com o registro de que ficou.)
6. Baselines da ÁRVORE vão mudar — refotografar SÓ com intenção declarada
   no commit, cena a cena.

---

## 4 — O rito do verde (depois de CADA obra)

```
pnpm tsc --noEmit     → zero erro
pnpm vitest run       → zero vermelho
pnpm build            → completa
npx playwright test e2e/atos.spec.ts --project=mobile              → 15+ cenas
npx playwright test e2e/visual-mundo-novo.spec.ts --project=mobile → 13 fotos
```

**As armadilhas já pagas (não caia de novo):**

- PowerShell 5.1 corrompe acentos — arquivo com acento se edita com a
  ferramenta de edição, nunca script shell.
- Here-string do PowerShell quebra com aspas duplas — mensagens de commit
  usam «» ou nada.
- Cena que afirma «hoje» nunca usa data fixa.
- A porta do e2e é a **5199**; mundo simulado é `?sim=1`; os specs têm
  `passarAurora` pronto pra copiar.
- O gate visual engole diff < 1% (`maxDiffPixelRatio 0.01`) — «passou» não
  quer dizer «igual»; na dúvida sobre uma tela tocada, olhe a foto.
- Cena visual sobre o HOJE sem relógio fixo fotografa a CAMADA (dialog),
  nunca a página — o arco vivo anda por trás (precedentes `casa-plano-ida`
  e `triage-leitura-conector`).

---

## 5 — O que NÃO se faz nesta sessão

- **Deploy de qualquer edge** — a `daily-digest` corrigida E a
  reconciliação da obra 2 esperam a mão do Rick, juntas.
- **Mexer nos Redirect URLs do Supabase** — pendência do Rick, não da
  sessão (a prod nova segue fora da lista; o login OAuth pode falhar lá).
- **Reformar `Review.tsx`** — segue como está, fora da nav.
- **Ratificar DP-E/DP-G/DP-J ou as DP-A…F** — a mesa é do Rick.
- **Obra de voz do builder** (capítulos-gaveta, perguntas-condição) —
  espera o E. na mesa (D64).
- **A ida real no Gmail** — viver a ida é gesto do Rick, não teste da
  sessão.

---

## 6 — Estado conhecido, pra não redescobrir

- 404 testes · 15 cenas no atos · 13 fotos no gate visual · fotos das
  dissecações numeradas até a 76.
- HEAD de `v2-faces` e `master` sincronizados no gate (merge `7c05363`).
- Os guardas de espelho (`vault-espelho`, `series-espelho`) vigiam as
  edges — todo contrato espelhado à mão ganha guarda (padrão da casa).
- `localStorage` da casa: `mindroot.builder.v1` (entrevista persiste) ·
  `mindroot.hint-busca.v1` (hint de primeira vez) · `mindroot-theme` ·
  `mindroot.items-snapshot.v1.<uid>` (o bolso) ·
  `mindroot:protocol-snoozed:<uid>` (o silêncio do protocolo).
- Os nomes da taxonomy projetada estão congelados em ASCII
  (`engine/taxonomy.ts`, teste guarda) — DP-J na mesa. **A obra 3 NÃO
  toca nesses nomes**: `extractWhoTag` é tag de pessoa, não label da ida.
- `components/hoje/` é a casa nova de `AuroraRitual`, `ProtocolBanner`,
  `ProtocolRunner`, `protocol-snooze`. `components/home/` não existe mais.
- Lint: 46 erros + 3 avisos herdados (services/edges/shell) — não são
  desta fila; a reforma deles é de outra onda.

---

*Se a dúvida for de estilo, o precedente da casa decide. Se for de escopo,
a tabela do §5. Se for de ordem, o §3. Se não for nenhuma das três,
provavelmente é decisão do Rick — anota como DP e segue. A casca velha
morreu; esta sessão faz o mundo novo ficar inteiro por dentro: a lente que
sabe de si, o wrap sem passo oco, a árvore polida, o chão sem entulho.*
