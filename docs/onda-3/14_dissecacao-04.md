# Dissecação 04 — Wrap · busca · projetos · offline/PWA

*30 Jul 2026 (madrugada) · quarta e última sessão do exame do
`13_prompt-dissecacao.md`. Features 10–13, vividas com Playwright: o rito do
wrap inteiro até o selo, a busca reformada em quatro bocas, o mundo com
projeto (pill → página → detalhe), e a prova de fogo do tronco de bolso —
que reprovou. Instrumento: `e2e/dissecacao-04.spec.ts`. Fotos 55–70 em
`14_dissecacao-01_fotos/`. Régua de mercado: benchmark `16` (Wrap, busca,
projetos) e a D55 (offline). **A DP-E estava suspensa esperando esta
rodada — a resposta dela está na feature 12.***

---

## Vereditos

| # | Feature | Veredito | Em uma linha |
|---|---------|----------|--------------|
| 10 | **Wrap** | **VIVA** (com um passo oco e um selo que cobra) | O rito já É um passo por tela e fecha com cerimônia — mas o passo 5 é um cartão-promessa, e o selo EXIGE «o que fica pra amanhã»: dia vazio não sela |
| 11 | **Busca + gestos** | **VIVA — com uma fala que MENTE** | A reforma do `16` está de pé (recentes, 7 prefixos, valores, recência); mas a mensagem do filtro inválido diz «foi ignorado» quando na verdade ele trava a busca — fala e comportamento se contradizem |
| 12 | **Projetos / presença** | **MANCA** | A presença derivada é o melhor do mercado (benchmark `16`) e a pill comunica — mas ela deságua na página da casca velha (inglês, indigo fora da lei D61, chrome de gerenciador). **DP-E confirmada: vive como camada, morre como tela** |
| 13 | **Offline / PWA** | **MENTE** | A fila do avô (D55) já provou subir — mas a LEITURA offline não existe na prática: com o snapshot gravado e presente, a falha de rede pendura a query pra sempre e o HOJE fica em «…». O bolso é código morto no caminho real |

---

## 10 · Wrap — viva, com um passo oco e um selo que cobra

**Vivido** (`55`–`62`): o rito abre no crepúsculo com as geometrias
caminhando no topo (estado, não barra — D44/D46), eco da aurora, chips de
emoção, journaling opcional. Cada passo é UMA tela com «seguir → geo» — **o
"um passo por tela" que o benchmark pede já é a forma do rito**; a obra 24a
é menor do que a fila supunha. O dia se mostra (nasceu/moveu), a teia tece
com busca+relação, o audit lê a casa de verdade, e o selo tem confirmação
digna (*"depois de selado, não se edita"*) e fecho bonito (*"o dia está
selado · boa noite ○"*, `62`).

**Os dois achados que pesam:**

1. **O selo exige «o que fica pra amanhã»** (`61`): com tudo vazio, selar
   devolve *"falta o que fica pra amanhã — um passo basta"* — e o dia não
   fecha. É exatamente a armadilha que o benchmark `16` nomeou: *rito longo
   em dia vazio = campo em branco = culpa*. O passo do plano é o mais
   valioso (Masicampo: plano específico elimina pensamento intrusivo) — por
   isso ele deve ser **convidado com honra, nunca cobrado**: selo válido
   com 6 dos 7 vazios. É a obra 24b/24a da fila, autorizada.
2. **O passo 5 (sementes) é um cartão oco** (`58`): *"o que dorme será
   encontrado na Fase 5"*. Um dos 7 passos do rito diário é uma promessa de
   roadmap. Ou o passo captura semente de verdade (uma boca de texto que
   nasce `#seed` no inbox — barato), ou sai da contagem até a Fase 5
   chegar. Rito não tem passo decorativo.

**Menores:** o toast *"Item capturado"* estoura DURANTE a cerimônia do selo
(pré-Lei do Tom, `62`); os passos são puláveis por «seguir», mas nada diz
isso a quem trava no primeiro campo (o «opcional» só existe no passo 5).

**Crivo (D62, benchmark `16`):** selo imutável ✓ · fechar sem número ✓ ·
conectar como passo ✓ · audit da base ✓ — o que ninguém faz, a casa faz. O
que falta é só a forma medida: nenhum campo obrigatório.

## 11 · Busca + gestos — viva, com uma fala que mente

**Vivido** (`63`–`66`): a camada vazia ensina (recentes + os 7 prefixos
inteiros em chips, `63`); «vidro» acha os dois do mundo sim (`64`); `who:`
digitado acha a Reunião Atlas pelo texto do tag (`65`); `mod:xyz vidro`
avisa o filtro errado e devolve nada com explicação (`66`). O desempate por
recência e o teto de escala têm teste desde a reforma.

**O canto que MENTE** (`66`): a mensagem diz *"«xyz» não é um valor de
`mod:` — **o filtro foi ignorado**"*. Mas o motor, **por desenho e por
teste**, faz o oposto de ignorar: filtro desconhecido trava a busca inteira
([search.ts:232](../../src/engine/search.ts) — *"filtro que não existe
NUNCA alarga o resultado"*, a lei certa da reforma). O usuário lê "foi
ignorado", espera os resultados de «vidro», e vê nada. Fala e comportamento
se contradizem na mesma tela. O comportamento está certo; a fala mente.
Cirurgia de uma linha, após o exame.

**Descobribilidade (a pergunta afiada):** o pull-down segue **sem nenhuma
affordance** — nem hint, nem animação de primeira vez; é o problema
Spotlight que o benchmark nomeou, e a mesma família do puxador da casa
(dissecação 03, MANCA 2). Quem não sabe, não puxa. E `who:` funciona por
acaso (texto do tag), mas não é prefixo ensinado — pessoas são gramática
escondida; um `who:` de verdade no vocabulário (com os valores que existem)
é encaixe direto.

## 12 · Projetos / presença — manca (e a DP-E se confirma)

**Vivido** (`67`–`69`): a pill no HOJE comunica presença de verdade —
*"⛓ Atlas Detailer · 3 de 5 abertos"* — e a sugestão única puxa o filho
aberto mais antigo (*"medir a van do Ricardo"*), provando que o projeto já
vive como CAMADA no mundo novo. O toque na pill, porém, deságua em
`/projects` (`68`): título "projects" em inglês, botão flutuante **indigo**
(que a D61 reservou pra voz do E.), badge verde "vivo", filtros
todos/vivos/selados, agrupamento "MOD-WORK" — a pele inteira da casca
velha, fora da nav desde a D40, gritando num mundo que fala baixo.

**O conteúdo do card, note-se, está certo**: presença derivada
([engine/project.ts](../../src/engine/project.ts), testado), sem barra de
%, "quieto há Nd" a partir de 8 dias, próximo como convite. O benchmark
`16` validou exatamente isso — o sinal MEDIDO contra o auto-reportado de
Linear/Asana/Basecamp, e Things/OmniFocus sem dashboard nenhum.

**Resposta à DP-E (o que esta dissecação devia responder):**
**confirmada — vive como camada, morre como tela.** A evidência vivida:
(a) tudo que a pill precisa dizer, ela já diz no HOJE; (b) o que o detalhe
precisa mostrar (filhos, próximo, quietude) cabe numa sheet no padrão da
casa (AssentimentoSheet é o molde); (c) o que a página tem além disso —
criar projeto, filtros, agrupamento por módulo — é chrome de gerenciador
que a D48/D40 já condenaram e o topo do mercado pessoal nem tem. Nada na
vivência pediu a tela. **No gate: a pill abre sheet; `/projects` morre.**
Segundo sinal do OmniFocus (projeto sem próxima ação) fica como semente da
sheet.

## 13 · Offline / PWA — MENTE

**O que já estava provado:** a fila do avô (captura offline → sobe com a
volta da rede) foi vivida na dissecação 01 (fotos `11`–`12`) e segue de pé.
O SW é prod-only por decisão documentada (achado de 27 Jul: em dev servia
bundle velho sobre o HMR) — instalação e shell offline em produção seguem
**NÃO VERIFICADOS** (exigem o domínio real; o preview roda em localhost,
onde o SW se desregistra de propósito).

**A prova de fogo que reprovou** (`70`): o "tronco de bolso"
([items-snapshot.ts](../../src/service/items-snapshot.ts)) promete — em
comentário e em código — *"sem rede, o HOJE lê daqui — a lista no mercado,
o protocolo na rua"*. A cena: mundo carregado com rede (snapshot gravado,
**1703 bytes confirmados no localStorage**), rede morta, reload. Resultado:
**o HOJE fica em «…» pra sempre.** Instrumentando o caminho: a queryFn roda
uma vez e o `await itemService.list()` **nunca resolve** — nem com
`abort` (rede morta de verdade) nem com HTTP 503. O `catch` que leria o
snapshot é código **inalcançável**: a promessa pendura antes dele (indício:
o caminho fetch→auth do supabase-js não repassa a falha; o diagnóstico fino
fica registrado, mas a cirurgia não precisa dele). Parece funcionar — tem
código, tem comentário, tem lei — e engana: **MENTE**, prioridade máxima.

**A cirurgia** (após o exame): corrida com timeout na queryFn — se a lista
não respondeu em N segundos, o bolso assume; a rede que voltar atualiza
depois. Pequena, testável, e não depende de resolver o mistério do
supabase-js. A cena de prova entra em `e2e/atos.spec.ts` (cena 10).

---

## A fila de ajustes

| P | Ajuste | Onde | Tamanho | Lei que justifica |
|---|--------|------|---------|-------------------|
| **MENTE 1** | O tronco de bolso funciona de verdade: corrida com timeout na queryFn; sem resposta → snapshot; cena de prova no atos.spec | [useItems.ts](../../src/hooks/useItems.ts) + items-snapshot | obra pequena | D55 |
| **MENTE 2** | A fala do filtro inválido diz a verdade: «corrige ou tira o filtro pra busca andar» (o motor está certo; a copy mente) | [SearchLayer.tsx](../../src/components/shell/SearchLayer.tsx) | gesto | 3 (estado) |
| **MANCA 3** | Selo válido com 6 dos 7 vazios — «o que fica pra amanhã» vira convite de honra, nunca trava (obra 24a, autorizada) | Wrap.tsx | obra pequena | benchmark `16` · D46 |
| **MANCA 4** | Passo 5 (sementes) vira passo de verdade: boca de texto → `#seed` no inbox; ou sai da contagem | Wrap.tsx SeedsStep | obra pequena | 2 (rito sem passo decorativo) |
| **MANCA 5** | A pill do projeto abre sheet (molde AssentimentoSheet) com a presença + filhos + próximo; `/projects` fica pronta pra morrer no gate (DP-E) | Hoje.tsx + componente novo | obra pequena | DP-E · D40 · D48 |
| **MANCA 6** | Affordance do pull-down da busca (hint de primeira vez, ou a barrinha respirar no primeiro open) — junto com o puxador da casa (dissecação 03 MANCA 2) | AppShell | gesto | benchmark `16` |
| pol. 7 | `who:` entra no vocabulário de prefixos com valores reais (os `#who:*` que existem) | engine/search prefixVocabulary | gesto | benchmark `16` |
| pol. 8 | Toast «Item capturado» não estoura durante o selo (capturas do wrap em silêncio) | Wrap.tsx handleCommit | gesto | D60 |
| pol. 9 | «pular» da aurora que não pula (leva ao check-in; o pular de verdade está DENTRO do check-in) — um pular só, que pula | AuroraRitual | gesto | 2 |
| pol. 10 | Tom da aurora: «ninguem le alem de ti» é forma-tu (D60 ratificou «você») + acentos | AuroraRitual | gesto | D60 |

## Decisões propostas (pra mesa do Rick)

- **DP-E → pronta pra ratificar como D74**: */projects vive como camada
  (sheet da pill no HOJE), morre como tela no gate.* A dissecação 04
  confirmou com vivência e o benchmark `16` já tinha validado com mercado
  e evidência. A sheet nasce na fila (MANCA 5); a morte é no gate.

## Sementes registradas

- **Sinal "sem próxima ação"** (OmniFocus) ao lado do "quieto há Nd" na
  sheet do projeto.
- **Wrap de dia vazio em um respiro** — dia sem item, sem decisão e sem
  semente podia oferecer selo direto ("um dia quieto — selar assim?").
- **`who:` como boca de pessoas** — conversa com people.ts e a semente de
  "assentir em punhados" da dissecação 01.

## Não verificado nesta sessão

Instalação PWA e shell offline em produção (SW é prod-only por desenho;
exige o domínio real — pendência que só o Rick pode viver no celular);
o e_line no selo com mundo real (o mock não tem e_line; o portão
`admitELine` tem teste unitário); push/`send-push` (fora das perguntas
desta rodada).

---

*Filha do `13_prompt-dissecacao.md` e do crivo D62. Fecha o ciclo das
quatro dissecações: 13 features examinadas, 3 MENTEs achadas ao vivo (a
volta do cron, a fala do filtro, o bolso furado) — as três mortas na mesma
noite, com teste. As MENTEs 1–2 desta rodada entram em cirurgia agora; a
fila MANCA espera o Rick.*
