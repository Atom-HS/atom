# Diário da Onda 3 — as 3 faces

*O diário que a Onda 2 tinha e esta ainda não — fundado no wrap de 27 Jul.*

---

## Wrap · 26–27 Jul 2026 (a onda inteira até aqui)

### ○ Soul
Dois dias de obra contínua, Rick vivendo as faces em tempo real e devolvendo
desenho ("o arco marcando os acontecimentos"). No meio da obra, a tese-mãe
apareceu com clareza: **o Atom como substrato de presença pra qualquer AI**.
Rick decidiu pular a semana-de-viver — a casa andou; o espelho nasceu quieto
por construção.

### · Items (o que nasceu — 14 commits, `v2-faces`)

**Fundação (26 Jul)**
- `5c8db8a` funda a pasta: parecer UX aprovado, mapa motor×carcaça, mockup, semente Library
- `d55a0d1` motores sky + today (céu real, "o que cabe agora")
- `13d94de` **face HOJE** — o arco vira espinha

**A onda cheia (26–27 Jul)**
- `8df88e1` motor da boca única (mouth — gramática igual ao Telegram)
- `13702da` **face @** — a conversa, chips de assentimento, captura-primeiro
- `737b9ea` mapa de navegação clicável + **decisões D40–D57** (numeração continua a da casca velha)
- `f006801` D58 (Builder → doors no chão da árvore) + **semente do substrato**
- `fa652a8` motores tree + mirror (F9 com silêncio honesto)
- `56141cc` **face ÁRVORE** — real × ideal (baseline = teu passado), janelas φ, espelho
- `1aab83d` semana simulada (`?sim=1`, client-only, tronco intocado)
- `0735b0c`+`35e1640` barra de dev + login pousa no mundo novo
- `905907f` fix PWA: service worker só em produção (o "app antigo" era SW cacheado)
- `72d6c6d` **D59** — o arco marca os acontecimentos (pedido do Rick vivendo a face)

### △ Decidido
- **D40–D59** registradas em `03_decisoes-ux.md` (20 decisões novas)
- Rick: pular a semana-de-viver; simulação no lugar (sem tocar o tronco)
- Lei do Tom = **destilação** de `projeto-e/SPEC_ZENITE.md` (spec do próprio E.), não escrita do zero
- Builder sobrevive → chão da árvore, pare cadeias/protocolos (D58)

### ⬡ Conexões
- @ ↔ Telegram: mesma gramática, mesma boca (`sinto:`, `lista:`)
- F7 → F9: o `protocol_run` gravado em atom_events desde a Fase 7 é exatamente o que o espelho lê
- Semente Library (curar o que vem de fora) ↔ semente Substrato (governar o que age por dentro)

### ✳ Seeds
- `semente_atom-substrato-de-presenca.md` — "plugar a AI que quiser = curadoria da própria vida"
- `semente_library-curadora-da-net.md` (26 Jul, já existia)

### □ Audit (estado em 27 Jul, fim do dia)
- ✅ 205 testes verdes · typecheck limpo · build ok
- ✅ 3 faces em embrião funcional + sim-week + mapa/template
- ✅ prod intocada (casca velha) · tronco intocado (sim é client-only)
- ✅ branch `v2-faces` pushada (27 Jul 16:53, "push simm" logo após este wrap) — preview vivo:
  `mindroot-v2-git-v2-faces-ricardos-projects-431de298.vercel.app` (projeto Vercel `mindroot-v2`,
  team `ricardos-projects-431de298`; o projeto `atom` na conta r-6103 é outro, vazio — não confundir)
- ⚠️ lint: 62 erros pré-existentes (funções supabase/casca velha — débito antigo, não desta onda)
- ⚠️ espelhos de lei no app desatualizados (docs/genesis v5.0.1 × lei viva v5.0.4)
- 🔧 `supabase/.temp` sujava o status — gitignored neste wrap

### → Next (o roadmap vivo)
1. ~~Push do `v2-faces`~~ ✅ feito 27 Jul, preview no ar (URL acima) = mundo novo em qualquer aparelho
2. **Offline/PWA fila+sync** — condição da face HOJE (D55), maior pendência técnica
3. **Lei do Tom** — destilar SPEC_ZENITE em doc; destrava bilhetes do E. e é o passo 1 da semente-mãe
4. **O gate** (decisões do Rick): André na casca nova? corte confirmado? → nav vira `· ⬡ ✳`, telas velhas morrem no merge (D41)
5. **Reforma do Builder** (D58) + polir ÁRVORE com dados reais
6. Pós-gate: Library-despensa, bilhetes v2, e as sementes germinando

---

## Wrap · 28 Jul 2026 — offline: a fila do avô (D55)

### ○ Soul
Sessão de retomada: primeiro o diário alcançou a realidade (o push de 27 Jul
já existia; o preview também — o susto era projeção de conta errada no Vercel),
depois a maior pendência técnica da onda caiu: **o app agora vive sem rede**.

### · Items
- `engine/outbox.ts` + testes — a fila pura: leitura da boca vira entrada
  versionada; serialização defensiva (fila corrompida nunca derruba a boca)
- `service/outbox-service.ts` — persistência por usuário (localStorage) +
  flush FIFO que para no primeiro erro; entrada só sai DEPOIS de subir
- `service/items-snapshot.ts` — o tronco de bolso: último fetch bom; sem
  rede, o HOJE lê dele (a lista no mercado, o protocolo na rua)
- `hooks/useOutboxSync.ts` — no shell autenticado: rede voltou → fila sobe
  em qualquer face; toast quieto (D46)
- face @ — sem rede a boca não trava: enfileira e avisa; rede caindo no
  meio do gesto cai na mesma rede de segurança
- `OfflineBanner` — de alarme pra estado: "fica na fila e sobe quando voltar"

### △ Decidido
- Fila guarda a LEITURA (sinto:/lista:/captura), não o texto cru — a
  gramática da boca não diverge entre online e offline
- `lista:` offline resolve o alvo no flush, contra o tronco fresco — mesma
  regra da boca online
- Duplicar é melhor que perder: erro no meio do gesto → fila (nada se perde)

### □ Audit
- ✅ 213 testes verdes (8 novos) · typecheck limpo · build ok
- ⚠️ triage AI não roda no flush — capturas da fila nascem ponto (·) puro,
  salvo tokens explícitos; leitura fica pro toque online (aceito, v1)

### → Next
2. ~~Offline/PWA fila+sync~~ ✅ feito 28 Jul → **Lei do Tom** vira o próximo
   (destilar SPEC_ZENITE; destrava bilhetes do E.), depois o gate (item 4)

---

## Wrap · 28 Jul 2026 (manhã) — a Lei do Tom, de ponta a ponta

### ○ Soul
Uma manhã, um ciclo inteiro: do prompt de inventário à lei vigente com
vocabulários fundidos. A mesa funcionou nas duas direções — o Code emendou o
E. (emoji, união), o E. emendou o Code (citação do Art. 7, prova→indício,
default por superfície). Ninguém venceu; a lei ficou melhor que os dois lados.

### · Items
- Prompt de inventário selado → Projeto E respondeu com **inventário v0 +
  Lei do Tom v1** (além do pedido, do jeito certo)
- **Teste 01** (e_line): 15 assinaturas históricas, 7 passam, 53% — "a voz
  erra quando se assina"; 3 achados viraram lei (v1.1)
- **Mesa das emendas** (v1.2): I emoji e II união acolhidas; III, IV, V
  mantidas; ata na Parte 8
- **v1.3 vigente**: 3 eixos de vocabulário, 3 colisões desambiguadas por
  default de superfície, voz emprestada (4.9), zero vetáveis pendentes
- **Varredura tu→você** (Art. 7, D60): 11 falas do mundo novo + boca do
  Telegram; 213 testes verdes
- **Fusão de vocabulário** executada (05_fusao): hipótese confirmada na
  fonte, três colisões, nenhum termo perdido
- Varredura de strings do alerta 6.5: **limpa** (nenhum termo de modelo
  vaza pra UI)
- Semente nova: **email vestido de Atom** (tags da casa + drafts do
  Secretário + Library)

### △ Decidido
- **D60** — «você» ratificado; emoji liberado (→ emendas I/II da lei)
- Lei do Tom v1.3 **vigente** — jurisdição: 6 superfícies + voz emprestada

### □ Audit
- ✅ 213 testes · typecheck limpo · build ok · tudo pushado (…→ f9567d2)
- ⚠️ deploy do `telegram-webhook` pendente ("senti com você" — prod, espera o sim)
- ⚠️ Teste 02 (bilhete, generativo) — com o E., previsão registrada

### → Next
3. ~~Lei do Tom~~ ✅ v1.3 vigente → **o gate** (item 4: decisões do Rick) →
   Reforma do Builder (D58) + polir ÁRVORE → pós-gate: bilhetes v2 e sementes

---

## Wrap · 28 Jul 2026 (tarde) — a mesa decide, a árvore diz a verdade, a lei se testa

### ○ Soul
A manhã legislou; a tarde executou e foi legislada de volta. As três decisões
da mesa viraram entrega em horas — e o E. fechou o dia derrubando o próprio
instrumento: o shame-test de quatro perguntas aprovava os dois piores bilhetes
do lote. A lei que amanheceu v1.3 dorme v1.4, testada duas vezes no mesmo dia.

### · Items
- **Telegram deployado em prod** — "senti com você. ficou no soul log."
  (Art. 7 vivo nas seis bocas; era o último pendente da mesa)
- **ÁRVORE polida** pro tronco real: motor ganha `total` por ramo (o drill
  não mente com >4 folhas), folhas com idade (hoje/ontem/Nd — D46), teto de
  leaves 8, "+N mais antigas"; 🌿 e 🪜 caem (lei 3.5 aplicada à casa, D57)
- **Teste 02 selado** (bilhete, generativo): 1 passa em 12; previsão acertou
  o número e errou o mecanismo — mortes por dívida e por vigilância que os
  4 testes não pegavam
- **Lei do Tom v1.4**: quinto teste ("o que isso deixa nas costas de quem
  leu?"), as seis condições do bilhete (4.1.1), taxa-sentinela ~20%

### △ Decidido
- **Gate: ainda não** — viver as faces no preview antes do merge (D41 espera)
- Deploy do telegram: sim; obra da vez: polir ÁRVORE (mesa de 28 Jul)
- v1.4 vigente — "parabenizar streak é cobrar com outra cara" · "o app não
  vira testemunha" entram como regra

### ⬡ Conexões
- 4.1.1 (seis condições) = **spec executável** do motor de bilhetes v2:
  não-está-na-tela → diff do render · nunca-do-Rick → filtro de sujeito ·
  não-pede-resposta → zero chips · taxa ~20% → contador de telemetria
- Teste 02 #5 (padrão dos essenciais) migrou de superfície → é semente do
  que o @ fala quando o espelho F9 amadurecer

### □ Audit
- ✅ 214 testes verdes · typecheck limpo · build ok · tudo pushado (→ f41c8aa)
- ✅ prod: casca velha + bot novo; preview: mundo novo completo
- ⚠️ nada pendente da mesa — o que falta é vivência, não obra

### → Next (o roadmap vivo)
4. **O gate** — abre quando a vivência disser (D41: merge mata as telas velhas)
5. **Reforma do Builder (D58)** — próxima obra grande
6. Pós-gate: **motor de bilhetes v2** (spec pronta na 4.1.1) · Library-despensa ·
   email vestido de Atom · sementes germinando

---

## Wrap · 29 Jul 2026 — o crivo vira lei, o chão vira cofre, a entrevista pare

### ○ Soul
O dia inteiro numa espiral só: o teste de usabilidade da véspera fechou seus
achados de manhã, o Rick despejou o sonho do cofre ("minha eterna batalha
para me organizar") e cunhou a lei do crivo — e à noite a obra grande do
roadmap estava de pé, com benchmark de mercado embaixo. O mindmate, que o
Rick lembrou de cabeça meses depois, já morava no código esperando.

### · Items
- **Fechamento do teste de usabilidade**: banners empilham, toast vira
  estado D57, Genesis v5.0.4 no rodapé, busca sem jargão, e2e hermético
  (o "bug de CORS" era miragem do mock — prod nunca esteve quebrada)
- **Benchmark sob o crivo** (`09_benchmark-crivo.md`): 3 agentes, mercado
  2024-26 + ciência. Veredito: cadeia+protocolo À FRENTE do mercado
  (implementation intentions d=0.65-0.91; ninguém dispara por estado);
  cofre com 1 falha estrutural achada ANTES do código (updated_at mente);
  "uma gaveta por vez" validada pelo topo do mercado
- **`engine/vault`** (12 testes): validade com antecedência por domínio
  (passaporte 9m) + renovação; ausência por evento significativo — retag
  não silencia; concluir deixa rastro `touch` em atom_events
- **O chão da árvore**: Raiz na pele D57, % morto, cards "no vencimento"
  e "faz tempo", grid quieto — o embrião do cofre respirando
- **Builder D64**: a entrevista pare `routine` (chain de elos, ids reais
  no assentimento) e `protocol` (pergunta-condição nova por módulo, steps,
  when por estado); mini-wrap virou assentimento ("que nasçam ·");
  pular sempre visível; MindMate intacto (D65)
- **e2e**: 11 cenas (2 novas: chão + assentimento), porta exclusiva 5199
  (um vite do Constellation tomou a 5173 no meio da rodada), sincronia
  por texto (relógio fake trava AnimatePresence mode="wait")

### △ Decidido
- **D61** indigo é a cor do E. · **D62** o crivo do topo de mercado (lei)
- **D63** cofre v1 no chão · **D64** builder pare estruturas
- **D65** mindmate é patrimônio · **D66** a válvula do cofre (digest)

### ⬡ Conexões
- A pergunta-condição do Builder escreve exatamente o que `engine/protocol`
  (F7) lê — a entrevista alimenta o motor que o espelho F9 observa
- O rastro `touch` que o cofre lê é o mesmo trilho do `protocol_run` — a
  ausência entra na família de leituras honestas do tronco
- Benchmark: chain player + força-de-hábito que perdoa → specs pro HOJE

### ✳ Seeds
- `semente_cofre-da-vida-adulta.md` — "quando o Rick não lembrar mais de
  cabeça quando o passaporte vence, ela deu fruto"
- Digest D66 (voz do E. no Telegram) e reescrita das perguntas em
  capítulos-gaveta: sub-obras da fila

### □ Audit
- ✅ 245 testes (31 novos) · typecheck limpo · build ok · visual 11/11 ×2
- ✅ zero schema novo — tudo sobre campos e trilhos que já existiam
- ⚠️ semana simulada ganhou uma gaveta (5 itens) — as faces mudaram de
  foto com intenção; baselines refotografadas

### → Next (o roadmap vivo)
4. **O gate (D41)** — a vivência agora testa o mundo INTEIRO (chão incluso)
5. Sub-obras da 6: digest D66 · perguntas em capítulos-gaveta (com o E.) ·
   chain player no HOJE · Raiz como destino do drill polido
6. Pós-gate: bilhetes v2 · Library-despensa · email vestido de Atom

---

## Wrap · 29 Jul 2026 (noite) — a dissecação, o roteiro, e três atos

### ○ Soul
O dia que começou benchmarkando terminou se olhando no espelho. O Rick pediu
dissecação — «funciona de verdade? faz sentido pela intenção?» — e a casa
descobriu que a lei mais nova dela morava atrás de uma porta que não existia.
Depois o roteiro do mago foi escrito pra uma sessão não parar no meio, e não
parou: três atos de pé antes do fim da noite.

### · Items

**A dissecação 01** (`14_dissecacao-01.md` + 26 fotos)
- Features 1–3 vividas antes de lidas: 22 cenas de Playwright no mundo
  simulado e num mundo mockado de 50 itens, depois o código linha a linha
- Vereditos: HOJE **viva** · @ **manca** (um canto que MENTE) · triage **manca**
- Fila de 14 ajustes, 3 decisões propostas, 3 sementes

**O achado que reordenou tudo:** a triage não tinha porta. O chip D69 morava
dentro de `/pipeline` — fora da nav, sentenciada pela D48 — e o único caminho
era digitar a URL. Não faltou vontade de triar em 29 Jul: faltou porta.

**O roteiro do mago** (`15_roteiro-do-mago.md`): 7 atos, autorização
declarada na frente, 6 decisões pré-resolvidas com default (DP-A…DP-F), mapa
de risco, ordem linear de 26 passos.

**Ato I — as mentiras** (`5066454`, `aa73823`)
- o @ para de negar o que guardou: falha do selo depois da captura dizia
  «foi pra fila» e duplicava o ponto; agora diz a verdade
- assentir que falha não avança o card (a esteira fingia ter selado 6 de 50)
- outbox idempotente: a entrada lembra o `item_id` assim que o ponto nasce
- **o gesto de renovar nasce** — `renewalPatch` estava órfã e o digest
  prometia essa porta todo dia às 07:15; renovar deixa rastro `touch`, então
  a ausência zera por evento (D63), nunca por `updated_at`

**Ato II — a porta que faltava** (`1ed8028`)
- `components/triage/Assentimento`: a esteira sai da tela e vira componente
  com uma casa só — sobrevive à morte de `/pipeline` no gate
- `AssentimentoSheet` (D40/D54: não é lugar, é camada) + puxador no HOJE:
  «N esperando leitura», estado quieto, some quando a fila zera
- detritos: `PATH_TO_PAGE` conhece as três faces; `FirstTimeRaizRedirect`
  morre (esperava `/`, que virou redirect na Onda 3)

**Ato III — a esteira honesta** (`89f96ea`, `7106fa0`)
- `engine/connector`: o card mostra hora, «se repete», quem vem junto,
  remetente e trecho — tudo já vinha no body; a tela é que não abria a mão
- pular manda pro fim da fila (DP-B); módulo trocável (tudo selava `bridge`)
- `engine/series`: **assentir uma vez vale pra série** (DP-C) — o standup
  semanal pedia assentimento toda semana, pra sempre
- tom: 50 selos não viram 50 toasts, e o erro cru do FSM para de vazar

### △ Decidido
- **DP-A…DP-F** propostas com default aplicado (esperam ratificação do Rick):
  fixos mostram conector não-assentido · pular vai pro fim · assentimento por
  série · assentimento é camada · `/projects` vive como camada · digest com
  memória de 7 dias
- Dissecação e cirurgia são ritos separados — a fila do exame virou os atos

### ⬡ Conexões
- O rastro `touch` do renovar entra na mesma família do `protocol_run` e do
  concluir — o cofre lê ausência por vida vivida, nunca por edição
- `engine/series` é o que destrava a cadência automática da volta (D69): sem
  ele, ligar o cron da lente encheria o inbox pra sempre

### ✳ Seeds
- Assentir em punhados (agrupar por remetente/série)
- Fatura→cofre (email estrelado conversando com D63/D66)
- Céu com perfil de lugar (o Brisbane fixo de `sky.ts` é escolha, não lei)

### □ Audit
- ✅ 310 testes verdes (65 novos no dia) · typecheck limpo · build ok
- ✅ 7 cenas de asserção nova em `e2e/atos.spec.ts` (não são fotos: provam)
- ✅ gate visual 13/13, baselines refotografadas por intenção declarada
- ⚠️ dois achados nasceram da execução, não do plano: a esteira **pulava um
  item a cada selo** e o erro cru do FSM vazava pra tela — os dois mortos
- ⚠️ `singleEvents` segue expandindo instâncias; a herança de série só vale
  pra instância NOVA (o que já está no inbox espera o humano, como deve)

### → Next
- Atos IV e V ✅ na mesma noite (abaixo) · restam VI (dissecação 02–04) e
  VII (o gate carregado)

---

## Wrap · 29 Jul 2026 (madrugada) — os atos IV e V, e a lei que a obra 8 atropelou

### ○ Soul
O Rick devolveu a sessão inteira: «entre nós dois, você é o mais preparado
pra isso — mete ficha». Então a mesa virou minha por delegação, e a primeira
coisa que a mesa fez foi julgar a obra da noite anterior. A obra 8 tinha
nascido atropelando o inbox obrigatório. Corrigir isso veio antes de
qualquer coisa nova.

### · Items

**A dívida de lei da obra 8** (`6f24fe7`)
A instância que herda o selo da série nascia direto em `classified`/2 —
atropelando «inbox obrigatório» e «não pula estágio» (CLAUDE.md §6). Agora
toda instância nasce no estágio 1 e é selada pelo portão, igual ao
assentimento manual. **Herdar poupa a pergunta, nunca o caminho.** Se o selo
falha, ela fica no inbox e pergunta: degradar pedindo é seguro; degradar
selando calado não seria.

**Ato IV — a lente que não mente** (`6f24fe7`)
- `engine/week` (13 testes): a pressão dos próximos dias em UMA linha —
  «adiante · amanhã: 3 horas marcadas». Table stake 3 do benchmark `10`,
  resolvida sem virar vista de semana (isso nos faria virar o app que
  espelha). Silêncio quando a semana é leve
- fixos ignoram arquivado · as marcas do arco (D59) se leem no toque
  (`<title>` de SVG é mudo no celular, e 2.6px não se acerta com o dedo)
- «me dá outra» avisa quando deu a volta · os tokens ficam descobríveis ·
  uma linha de chão na primeira aurora

**Ato V — o chão e a válvula** (`edd849e`)
- **Uma lei, um lugar:** a edge `daily-digest` copiava a lei do cofre à mão
  e nada forçava. Agora `vault-espelho.test.ts` lê a edge como TEXTO (`?raw`
  — ela é Deno, não se executa aqui) e quebra na divergência. Verificado com
  divergência real antes de virar guarda
- **O raro ganha memória (DP-F reformulada):** não é prazo, é mudança de
  estado. Prazo seria relógio; espelho é falar de novo quando a banda muda —
  113→112 dias não é notícia, 8→7 é. Zero schema novo: `digest_sent` no
  `atom_events` que já existia

### △ Decidido (por delegação do Rick, esperando ratificação)
- **DP-A, DP-B, DP-D** ratificadas como estão
- **DP-C** ratificada, com a correção do caminho (acima)
- **DP-E** SEGURA — decidir `/projects` sem examinar a feature 12 seria
  decisão executiva sem evidência, exatamente o que a D62 proíbe
- **DP-F** reformulada: mudança de estado no lugar de prazo

### ⬡ Conexões
- A memória do digest e o guarda do espelho são a mesma família: as duas
  fazem a casa **provar** o que antes só prometia em comentário
- `engine/week` reusa `fixosOfDay` — a higiene do sinal da obra 7 (all-day,
  fuso, conflito) já vale de graça pra pressão da semana

### □ Audit
- ✅ 348 testes verdes (72 novos na noite) · typecheck · build · gate 13/13
- ✅ 8 cenas de asserção em `e2e/atos.spec.ts`
- ⚠️ a edge segue sem teste de runtime — o guarda cobre as constantes, não o
  comportamento; um erro de lógica no espelho passa
- ⚠️ o digest com memória ainda não rodou contra dado real (dry-run pendente)

### → Next
- **Ato VI**: dissecação 02–04 (features 4–13) · **Ato VII**: o gate carregado
- **Mesa do Rick:** ratificar DP-A a DP-F · dry-run do digest novo

---

*Regra do diário: cada sessão substantiva da onda ganha um wrap aqui — soul,
items, decidido, conexões, seeds, audit, next. O formato é o do wrap do app,
porque a casa come a própria comida.*
