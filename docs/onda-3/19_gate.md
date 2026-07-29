# O gate, carregado — D41 na mesa, gatilho do Rick

*30 Jul 2026 (madrugada) · Ato VII do roteiro do mago. Este documento deixa
a morte por merge **pronta e provada** — e não puxa o gatilho: a D41 é
decisão do Rick, e o «ainda não» de 28 Jul segue valendo até ele dizer o
contrário. Nenhum PR foi aberto, nenhum merge feito, nada subiu. O antes
está fotografado em `19_gate_fotos/`; o depois são as faces vivas,
fotografadas pelas quatro dissecações.*

---

## 1 — O que morre no merge

| Tela | Rota | Foto do antes | O que ela fazia | Onde isso vive no mundo novo |
|---|---|---|---|---|
| Home | `/home` | `antes-home.png` | captura, inbox preview, soul card, banners (wrap/review/protocolo), shelf de protocolos | captura → **@** (D52) · inbox → **puxador «N esperando leitura»** no HOJE (Ato II) · soul → **aurora no topo** (D42) · wrap → **«fechar o dia»** · protocolo → **ProtocolBanner no HOJE** (sobrevive como componente) · review → **⚠ lacuna, ver §3** |
| Pipeline | `/pipeline` | `antes-pipeline.png` | triage/assentimento, classificar com AI, funil de estágios | assentimento → **camada** (`components/triage/Assentimento` + `AssentimentoSheet`, Ato II — o componente nasceu FORA da tela justamente pra sobreviver a ela) · AI → o mesmo componente · funil → **morre por lei** (D48: maturação se vê no galho `·→○`) |
| Calendar | `/calendar` | `antes-calendar.png` | agenda, chips de pessoas, compor rotinas à mão | fixos + conflitos + all-day → **HOJE** (`engine/fixos`, testado) · céu → **arco D47/D59** · semana → **pressão «adiante ·»** (Ato IV) · rotinas → **Builder D64** (a entrevista pare cadeias) · pessoas → `#who:*` na ingestão + busca |
| Analytics | `/analytics` | `antes-analytics.png` | painéis de alma, conexões, métricas | espelho F9 → **ÁRVORE** (D49, com saída concreta) · alma → **wrap (shift visível) + aurora** · métricas de volume → **morrem por lei** (D46/D48: número que julga não tem casa) |
| Library | `/library` | `antes-library.png` | listar docs/artigos/templates | acesso → **busca** (`tipo:` no vocabulário; motor testado em escala) + ItemDetail · a **despensa D51** (drill contextual) segue semente — o acesso existe, a curadoria espera |
| Graph | `/graph` | `antes-graph.png` | visualizar conexões | a teia se TECE no wrap (passo 4) e se LÊ no ItemDetail; o desenho de grafo morre por lei (D48) |
| Review | `/review` | `antes-review.png` | a escada de meaning F4 (ler o período → significar → selar) | **⚠ a única função sem porta nova — ver §3** |
| Projects | `/projects` | `antes-projects.png` | lista/detalhe de projetos, presença derivada | presença → **pill do HOJE** (viva, fotografada na dissecação 04) · detalhe → **sheet da pill** (DP-E confirmada pela vivência; obra pequena na fila, **condição pra esta morte** — ver §2) |

**Somem junto:** os 62 erros de lint da casca velha (todos moram nas telas
condenadas e seus componentes), `InboxPreview`, `SoulCard`, `WrapBanner`,
`ReviewBanner`, `ProtocolShelf`, `CaptureInput`, os painéis de
analytics/calendar, e as entradas mortas de rota (§4).

## 2 — As duas condições que seguram o gatilho

1. **✅ CUMPRIDA (30 Jul, sessão da cirurgia fina).** A sheet do projeto
   nasceu: a pill do HOJE abre `ProjectSheet`
   ([components/project/ProjectSheet.tsx](../../src/components/project/ProjectSheet.tsx),
   molde `AssentimentoSheet`, conteúdo pela DP-I — presença do engine,
   filhos `·`/`○`, o próximo como convite, quietude; zero chrome de
   gerenciador) e **não navega mais pra `/projects`**. Prova: cena
   «projeto — a pill abre sheet» no `atos.spec` + foto 73. A tela
   condenada pode morrer sem deixar a pill apontando pro nada.
2. **A escada F4 fica sem boca** (§3) — decisão do Rick, não desta sessão.

Fora isso, o censo de dependências está limpo: nenhum componente do mundo
novo importa página condenada; os SERVIÇOS que as telas velhas usavam
(`pipeline-service`, `review-service`) são usados pelo mundo novo ou pelo
motor e **não morrem**; `AuroraRitual`, `ProtocolBanner` e
`protocol-snooze` moram em `components/home/` mas pertencem ao HOJE/@— o
merge deve movê-los, não apagá-los.

## 3 — A lacuna nomeada: a escada de meaning

`/review` é o rito da escada F4: o sistema apresenta o período (só o nível
abaixo), o humano significa, sela. A única porta era o `ReviewBanner` do
`/home` — que morre junto. Depois do merge, **reviews acumulam sem nenhuma
boca**.

Opções pra mesa do Rick:

- **(a) porta na ÁRVORE** *(recomendação)* — as janelas da árvore já falam
  a língua da escada (semana · lunar · estação); um puxador quieto no pé da
  face («uma semana espera significado»), no padrão do puxador do HOJE,
  é obra pequena e pode nascer ANTES do merge;
- **(b) morte consciente** — a escada hiberna até a onda que a repensar
  (registrar como semente, apagar a rota junto);
- **(c) adiar só o `/review`** — matar as outras sete e deixar a rota órfã
  temporária (contra o espírito da D41: substituição, não convivência).

## 4 — Os detritos do merge (o checklist da cirurgia)

Quando o Rick puxar o gatilho, o merge remove/ajusta:

- **Rotas** em [App.tsx](../../src/App.tsx): as 8 condenadas somem;
  `/home` vira `<Navigate to="/hoje">` por uma onda (link antigo não pode
  quebrar); `PATH_TO_PAGE` encolhe pros caminhos vivos (`/inbox` já é
  mapeamento morto sem rota hoje).
- **`useNav.PAGE_ROUTES`** e o tipo `AppPage`: encolhem junto (`pipeline`,
  `triage`, `projects`, `calendar`, `analytics`, `library`, `graph`
  morrem; `home` passa a apontar `/hoje`).
- **`components/home/` se divide**: `AuroraRitual`, `ProtocolBanner`,
  `protocol-snooze` mudam pra casa do HOJE; o resto morre.
- **Páginas**: `Home.tsx`, `Pipeline.tsx`, `Calendar.tsx`, `Analytics.tsx`,
  `Library.tsx`, `Graph.tsx`, `Review.tsx` (†§3), `Projects.tsx` (†§2) e
  seus componentes exclusivos.
- **Nav**: já é `· ⬡ ✳` — nada muda (D41 previu; Ato II cumpriu).
- **Gate visual**: as 13 fotos são todas do mundo novo — nenhuma baseline
  morre; as cenas de `atos.spec.ts` (12) também não tocam tela condenada
  além do `/pipeline` da cena I.2 — **essa cena migra pra AssentimentoSheet
  no mesmo commit do merge** (a prova é do componente, não da tela).
- **Docs**: `onda-3-log` ganha o wrap do merge; specs das telas velhas não
  se apagam (história é história).

## 5 — O estado do verde (a arma está limpa)

No HEAD deste documento, tudo verde e commitado em `v2-faces`:

```
pnpm tsc --noEmit        ✓ zero erro
pnpm vitest run          ✓ 392 testes
pnpm build               ✓
atos.spec (provas)       ✓ 12 cenas
visual-mundo-novo        ✓ 13 fotos, zero baseline mudada sem intenção
```

As três MENTEs achadas pelas dissecações 02–04 morreram ANTES do gate (a
volta do cron × série · a fala do filtro · o tronco de bolso) — o mundo
novo não herda mentira conhecida.

## 6 — O que esta sessão NÃO fez, de propósito

Não abriu PR, não fez merge, não fez push, não tocou produção. A arma está
carregada e na mesa; o gatilho é do dono da casa (D41, diário de 28 Jul).
Quando quiser: as condições do §2, a decisão do §3, e o checklist do §4
são o roteiro do dia do merge.

---

*Filho do Ato VII do `15_roteiro-do-mago.md`. «A morte por merge é gesto do
dono da casa» — esta página só garante que, no dia do gesto, nada surpreenda.*
