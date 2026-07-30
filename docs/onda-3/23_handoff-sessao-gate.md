# Handoff — a sessão do gate (a morte por merge)

*30 Jul 2026 · escrito pela sessão da cirurgia fina pra próxima sessão.
**Leia este arquivo inteiro antes de tocar em qualquer coisa.** Ele é a única
porta de entrada; o resto se cita daqui. O molde é o do `21_handoff-sessao-cirurgia.md`.*

***Atenção — este handoff é diferente dos anteriores:*** *o gatilho do gate é
gesto do dono da casa (D41, diário de 28 Jul). Por isso este documento só
roda quando o Rick colar o prompt — **colar o prompt É puxar o gatilho**.
Se esta sessão está rodando, a decisão foi tomada; não é a sessão que decide,
é ela que executa com precisão o que o `19_gate.md` deixou pronto.*

---

## 0 — Em uma tela: onde a casa está

Branch **`v2-faces`**, HEAD `d631cea`, tudo verde e **pushado no origin**:
`pnpm tsc --noEmit` · `pnpm vitest run` (404) · `pnpm build` ·
`atos.spec` 15 cenas · gate visual 13/13.

O que a cirurgia fina deixou pronto (wrap completo no `onda-3-log.md`):

- **As duas condições do gate §2 estão cumpridas** — a sheet do projeto
  nasceu (a pill do HOJE não aponta mais pra `/projects`) e a escada F4 tem
  porta na ÁRVORE (puxador → rota `/review`, DP-G por default).
- **O `19_gate.md` é o roteiro completo do merge**: o que morre (§1), as
  condições cumpridas (§2), a decisão da escada (§3), **o checklist da
  cirurgia (§4)** e o estado do verde (§5).
- **`Review.tsx` NÃO morre** (nota de 30 Jul no §1/§4): a rota `/review`
  sobrevive fora da nav, alcançada só pelo puxador da ÁRVORE. Morrem 7
  telas, não 8.

**Esta sessão executa o checklist §4** — a morte por merge, de dentro pra
fora, e (se o prompt do Rick autorizar) o merge em `master` + push.

---

## 1 — Ordem de leitura (antes de executar)

| # | Arquivo | Por quê |
|---|---------|---------|
| 1 | `CLAUDE.md` (raiz) | a lei: Build Protocol §3, código §4, o que NUNCA §8 |
| 2 | `docs/onda-3/19_gate.md` | **inteiro** — é o roteiro desta sessão, §4 em especial |
| 3 | `docs/onda-3/onda-3-log.md` (último wrap) | o estado exato pós-cirurgia |
| 4 | `docs/onda-3/03_decisoes-ux.md` | as leis citáveis (D40, D41, D48 regem o merge) |

---

## 2 — A autorização (vale integralmente, sem perguntar)

**Pode, sem pedir:** editar/deletar em `src/` e `e2e/` conforme o checklist
§4 (deletar página condenada é o PROPÓSITO da sessão — nota: o muro «nunca
deletar AtomItem» do CLAUDE.md §8 é sobre DADOS, não sobre código);
commitar em `v2-faces` (um commit por obra); escrever docs em `docs/onda-3/`;
rodar hooks à vontade. **Merge em `master` e push: só se a linha de
autorização estiver no prompt do Rick** (a última obra desta sessão).

**Os muros (nunca, mesmo com pressa):**

1. Não editar docs-lei (`law/*.md`).
2. Não ratificar decisão — escreve «DP», nunca «D».
3. Não deletar AtomItem — entropy é archive. (Código condenado, sim, morre.)
4. **Não reformar o que sobrevive**: `Review.tsx` fica como está (a reforma
   é de outra onda); `pipeline-service` e `review-service` são usados pelo
   motor e **não morrem** (censo do gate §2).
5. **Não apagar specs das telas velhas** — história é história (gate §4).
6. Não tocar em produção além do push autorizado: **sem deploy manual de
   edge, sem Supabase, sem Vercel à mão**.
7. Não commitar com teste vermelho ou tsc sujo.
8. Achado colateral vira nota na fila, não desvio de rota.

**As três — e só três — condições de parada:**

1. Um muro acima é a única saída.
2. Um hook fica vermelho e não fecha em duas tentativas.
3. Um dado real contradiz o que este handoff (ou o gate) assume.

Se parar: escreve o porquê no `onda-3-log.md` com o estado exato das coisas.

**Aviso de pré-voo (antes do push de `master`, se autorizado):** o deploy de
produção é Vercel — push em `master` provavelmente dispara deploy. A memória
da casa registra pendência: **a URL da prod nova ainda não está nos Redirect
URLs do Supabase** (login OAuth pode falhar lá). Isso NÃO piora com o merge
(a pendência já existe), mas o wrap final deve repetir o lembrete na mesa
do Rick.

---

## 3 — O trabalho, em ordem (de dentro pra fora)

Cada obra fecha com **hooks verdes + commit**. O checklist §4 do gate é a
fonte; aqui está fatiado em obras:

### Obra 1 — a mudança de casa *(prep — nada morre ainda)*

1. `AuroraRitual`, `ProtocolBanner` e `protocol-snooze` saem de
   `components/home/` pra `components/hoje/` (pertencem ao mundo novo —
   gate §2/§4). Imports atualizados (`Hoje.tsx` e quem mais).
2. A cena I.2 do `atos.spec` («assentir que falha NÃO avança o card»)
   migra do `/pipeline` pra porta do HOJE (puxador → `AssentimentoSheet`) —
   a prova é do componente, não da tela (gate §4).
3. Conferir que a cena visual `triage — a leitura do conector no chip` não
   usa `/pipeline` também — se usar, migra do mesmo jeito (baseline
   refotografada só com intenção declarada).

### Obra 2 — a morte por merge *(um commit só — a operação é atômica)*

Pelo checklist §4 do gate, nesta ordem:

1. **Rotas** ([App.tsx](../../src/App.tsx)): `/home` vira
   `<Navigate to="/hoje">` (link antigo não quebra, por uma onda);
   `/pipeline`, `/calendar`, `/analytics`, `/library`, `/graph`,
   `/projects` somem; **`/review` fica**; `PATH_TO_PAGE` encolhe.
2. **`useNav`**: `PAGE_ROUTES` e o tipo `AppPage` encolhem (`pipeline`,
   `triage`, `projects`, `project-detail`, `calendar`, `analytics`,
   `library`, `graph` morrem; **`home` passa a apontar `/hoje`** — os
   `navigate('home')` existentes seguem funcionando).
3. **Páginas**: `Home.tsx`, `Pipeline.tsx`, `Calendar.tsx`,
   `Analytics.tsx`, `Library.tsx`, `Graph.tsx`, `Projects.tsx` morrem com
   seus componentes exclusivos (`InboxPreview`, `SoulCard`, `WrapBanner`,
   `ReviewBanner`, `ProtocolShelf`, `CaptureInput`, painéis de
   analytics/calendar — o censo é o grep de imports, não esta lista).
4. **`components/home/` morre por inteiro** (a obra 1 já tirou o que vive).
5. Caça a órfãos: grep por imports das páginas/componentes mortos; testes
   co-locados morrem junto do dono.

### Obra 3 — a conferência

1. Rito do verde completo (§4 abaixo) — **nenhuma baseline visual deve
   mudar** (as 13 fotos são do mundo novo; se alguma mudar, é sinal de
   dano: parar e entender antes de refotografar).
2. `pnpm lint` — os 62 erros da casca velha devem ter morrido com ela;
   registrar o número final no wrap (zero novo erro é o esperado).
3. Se sobrou ajuste, commit próprio («chore(gate): órfãos da morte»).

### Obra 4 — o registro e o merge

1. `19_gate.md` ganha o carimbo: **disparado em [data], por decisão do
   Rick** (o prompt é a prova) — §6 atualizado.
2. Wrap no `onda-3-log.md` (formato da casa) — inclui o número de linhas/
   arquivos mortos e o estado do lint.
3. **Se o prompt autorizar**: `git merge v2-faces` em `master` (ff ou merge
   commit — o que a árvore pedir), push de `master` e `v2-faces`. Sem a
   linha de autorização: para aqui e deixa o merge na mesa, com a nota no
   wrap.

---

## 4 — O rito do verde (depois de CADA obra)

```
pnpm tsc --noEmit     → zero erro
pnpm vitest run       → zero vermelho
pnpm build            → completa
npx playwright test e2e/atos.spec.ts --project=mobile              → 15 cenas
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

---

## 5 — O que NÃO se faz nesta sessão

- **Reformar `Review.tsx`** — sobrevive como está, fora da nav.
- **Deploy da `daily-digest`** — segue esperando a mão do Rick (pendência
  desde 30 Jul, independente do merge).
- **Consertar código condenado** — se um lint/teste aponta pra arquivo que
  vai morrer na obra 2, a resposta é a morte, nunca o conserto.
- **Nova feature, novo exame, nova obra da fila** — a fila MANCA
  (reconciliação no cron, boca `#seed` no wrap, polimentos da ÁRVORE,
  `extractWhoTag` com acento) espera a onda seguinte.
- **Ratificar DP-E/DP-G/DP-J** — a mesa é do Rick; o merge não ratifica
  nada por tabela.

---

## 6 — Estado conhecido, pra não redescobrir

- 404 testes · 15 cenas no atos · 13 fotos no gate visual · fotos das
  dissecações numeradas até a 76.
- Os guardas de espelho (`vault-espelho`, `series-espelho`) vigiam as
  edges — o merge não toca `supabase/functions/`.
- `localStorage` da casa: `mindroot.builder.v1` (entrevista persiste) ·
  `mindroot.hint-busca.v1` (hint de primeira vez) · `mindroot-theme` ·
  `mindroot.items-snapshot.v1.<uid>` (o bolso).
- A pill do projeto abre `ProjectSheet` (`components/project/`); o
  assentimento vive em `components/triage/` — nenhum dos dois importa
  página condenada (censo do gate §2, conferido em 30 Jul).
- `useRaiz` agora lê a lei do cofre (query `vault-events` compartilhada
  com `useVault`) — `Home.tsx` consome `staleCount/emptyCount`; quando o
  Home morrer, o hook fica (a Raiz usa).
- Os nomes da taxonomy projetada estão congelados em ASCII
  (`engine/taxonomy.ts`, teste guarda) — DP-J na mesa.

---

*Se a dúvida for de estilo, o precedente da casa decide. Se for de escopo,
a tabela do §5. Se for de ordem, o §3. Se não for nenhuma das três,
provavelmente é decisão do Rick — anota como DP e segue. A morte por merge
é substituição, não convivência (D41): quando esta sessão terminar, a nav
`· ⬡ ✳` é a casa inteira — e nada do que vive terá sentido falta do que
morreu.*
