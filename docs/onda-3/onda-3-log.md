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

## Wrap · 30 Jul 2026 (a noite inteira) — o exame completo, as três mentiras, e o gate na mesa

### ○ Soul
A sessão que rodou enquanto a casa dormia. O handoff dizia «leia tudo antes
de tocar em qualquer coisa» — li, e depois o exame não parou: dez features
vividas antes de lidas, três mentiras achadas AO VIVO e mortas na mesma
noite, duas obras do benchmark fechadas, e o gate carregado sem disparar.
A tese do prompt da dissecação se confirmou pela terceira vez: o que MENTE
só aparece vivendo — a maior delas dormia no caminho que produz 100% dos
itens reais, e a casa tinha certeza de que estava consertada.

### · Items

**Ato VI — as três dissecações que faltavam** (3 docs, fotos 32–70)
- **02 (ÁRVORE · Raiz · Builder)**: árvore VIVA (teto do drill honesto,
  síntese que muda com a janela) · raiz VIVA (lead certo, renovar inline)
  · builder MANCA — o `inferType` testa strings que nunca batem (meta
  financeira nasce «Habito», braços task/ritual são código morto),
  finanças/família não parem estrutura, reload apaga a entrevista. Zero
  MENTE; fila de 6 MANCA + 7 polimentos.
- **03 (casa · ida · digest)**: a sheet digna e o fluxo da ida inteiro em
  mock (plano → assentir → lei viva → desfazer → reconexão) · o puxador
  invisível confirmado por foto · `disconnect()` queima o token que o
  desfazer precisaria (contra a D68) · a ida REAL segue não verificada
  (espera o assentimento do Rick). **MENTE: a volta do cron ingeria série
  sem `recurring_event_id` nem herança de selo** — a DP-C estava morta em
  produção; item nascido pelo cron nem ENSINAVA selo.
- **04 (Wrap · busca · projetos · offline)**: o rito já é um passo por
  tela, mas o selo exigia «o que fica pra amanhã» e o passo 5 é um cartão
  oco · a busca reformada vive, mas a fala do filtro inválido dizia «foi
  ignorado» quando o motor trava a busca · a pill do projeto comunica e
  deságua na casca velha — **DP-E confirmada pela vivência** · **MENTE: o
  tronco de bolso era código inalcançável** — sem rede o fetch pendura sem
  rejeitar, o catch nunca rodava, o HOJE ficava em «…» com o snapshot
  gravado do lado.

**As cirurgias (só o que MENTE — a regra do rito)**
- a volta do cron conhece a série: espelho do contrato do client na edge,
  instância herdada nasce no 1 e passa pelo portão; guarda novo
  `series-espelho.test.ts` lê a edge como texto e quebra na divergência
- o bolso funciona: `comPrazo()` corre o fetch contra 6s; sem resposta, o
  snapshot assume — cena 10 do atos.spec prova com rede morta de verdade
- a fala do filtro diz o que o motor faz («corrige ou tira o filtro»)

**As obras do benchmark 16 (autorizadas na fila)**
- **24a**: o selo do wrap vale com o dia vazio — o plano de amanhã segue
  no lugar de honra, mas convite não trava rito (cena de prova nova)
- **24b**: cold start declarado («a árvore nasce vazia… sem dado, e tudo
  bem») + confiança por ramo (firme · rala · sem-dado) — motor puro, 6
  testes, foto 37 refotografada com intenção

**Ato VII — o gate carregado** (`19_gate.md` + 8 fotos do antes)
- cobertura verificada tela a tela; censo de dependências limpo
- **duas condições seguram o gatilho**: a sheet do projeto (DP-E) ainda
  não nasceu (a pill viraria porta pro nada), e a escada F4 ficaria sem
  boca — a única função do mundo velho sem porta nova, com 3 opções na
  mesa (recomendada: puxador quieto na ÁRVORE, obra pequena pré-merge)
- nenhum PR, nenhum merge, nenhum push — a arma na mesa, o gesto é do Rick

### △ Decidido (nada ratificado — tudo DP ou fila)
- **DP-E pronta pra virar D74**: /projects vive como camada, morre como
  tela — confirmada por vivência (dissecação 04) e mercado (benchmark 16)
- Nenhuma DP nova precisou nascer: todos os achados são aplicação de leis
  já ratificadas (D46, D54, D55, D60, D63, D64, D68, D69, DP-C)

### ⬡ Conexões
- O guarda `series-espelho` é irmão do `vault-espelho` — a casa agora
  força os DOIS contratos que a edge espelha à mão; a família de guardas
  de espelho virou padrão (terceiro espelho que nascer já tem molde
- O `comPrazo` do bolso e o «não consegui selar» do @ são a mesma lei
  vista de lados opostos: erro que não chega é pior que erro que chega
- A confiança por ramo (24b) responde a mesma pergunta do card cego do
  conector (Ato III): não se assente — nem se lê — o que não se vê

### ✳ Seeds
- «O que mudou desde que você olhou» — recap ancorado no último open
  (benchmark 16, a resposta mais barata ao problema de retenção)
- Pergunta-condição pra finanças/família no builder (protocolo nascer nos
  5 módulos) — obra de voz, com o E. na mesa
- Sinal «sem próxima ação» (OmniFocus) na futura sheet do projeto
- Status da lente no HOJE («a lente trouxe 3 esta manhã») — pra fila de
  leitura não depender de abrir a casa

### □ Audit
- ✅ 392 testes verdes (18 novos na noite) · tsc limpo · build ok
- ✅ atos.spec 12 cenas · gate visual 13/13 (zero baseline sem intenção;
  única refotografada: 37, com o porquê no commit)
- ✅ 10 commits, um por obra, nenhum com hook vermelho
- ⚠ a cena do ato III quebrava à meia-noite (data fixa «hoje» virou
  «ontem») — consertada com data dinâmica; armadilha nova da casa: cena
  que afirma «hoje» nunca usa data fixa
- ⚠ o diagnóstico fino do porquê do fetch pendurar (supabase-js × rede
  morta) ficou registrado mas não resolvido — o `comPrazo` torna a
  resposta irrelevante pro usuário, mas a curiosidade fica
- ⚠ deploy da edge `daily-digest` corrigida é gesto do Rick — até lá o
  cron de produção segue com a volta cega de série

### → Next — a mesa do Rick (em ordem de peso)
1. **Deploy da `daily-digest`** — a correção da MENTE do cron só vale em
   produção depois do deploy (e o dry-run do digest segue pendente)
2. **Ratificar**: DP-E (D74?) · e as DP-A…DP-F que já rodam com default
3. **Decidir a escada** (gate §3): porta na ÁRVORE (recomendada) · morte
   consciente · adiar /review
4. **A sheet do projeto** (obra pequena, condição do gate §2)
5. **O gatilho do gate** (D41) — quando as duas condições fecharem
6. Fila MANCA das dissecações 02–04 (o parto honesto do builder é o maior
   pacote; puxador da casa com corpo; desligar-desfaz D68; grid da raiz
   na lei do cofre; reconciliação no cron)
7. Pendências antigas que seguem: redirect URL do Supabase na prod nova ·
   viver a ida real no Gmail · instalar o PWA no celular (SW é prod-only)

---

## Wrap · 30 Jul 2026 (dia) — a cirurgia fina: cinco obras, o gate destravado

### ○ Soul
A sessão que o handoff `21_` pediu: nada de exame novo — o diagnóstico
estava feito, faltava bisturi. Cinco obras, de dentro pra fora, cada uma
fechada com hooks verdes e um commit. As duas condições que seguravam o
gatilho do gate caíram nesta sessão: a sheet do projeto nasceu e a escada
ganhou porta na ÁRVORE. Nenhuma das três condições de parada disparou;
a sessão inteira coube na autorização.

### · Items

**Obra 1 — o parto honesto do builder** (`cfb918a` · MANCA 1–4 da diss. 02)
- `QUESTION_ROLES` explícito no mapper (coisa/contexto/elo) — o `inferType`
  de substring morreu com os braços inalcançáveis; a meta financeira nasce
  **task**, nunca mais «Habito»; `family-2`/`work-1`/`work-6`/`finance-2`
  são contexto e não viram item
- `persist` no builder-store (`mindroot.builder.v1`) — reload retoma onde
  parou; a reescrita em capítulos-gaveta segue obra de voz (D64)
- o card do mini-wrap ganhou chip de troca de tipo (gramática da triage,
  D69) — trocar no chip muda o que nasce, provado pelo POST na cena
- cena nova no atos.spec + fotos 71–72; 5 testes novos módulo a módulo

**Obra 2 — a sheet do projeto** (`f343777` · DP-E/DP-I · condição 1 do gate)
- `ProjectSheet` (molde AssentimentoSheet): presença pela MESMA linha do
  engine, filhos `·`/`○`, o próximo como convite, quietude — zero chrome
- a pill do HOJE abre a sheet; `/projects` intocada (morre no gate)
- cena pill → sheet → próximo → ItemDetail + foto 73 · **gate §2 atualizado**

**Obra 3 — a porta da escada na ÁRVORE** (`f6d2852` · DP-G · gate §3a)
- `nextAvailableReview` no pé da face: «uma semana espera significado» ·
  significar → rota `/review`; sem número, some quando não há (D46)
- aplicada como default declarado (DP-G segue na mesa, reversível)
- cena + foto 74 · **gate §3 atualizado: `/review` saiu das condições,
  a rota sobrevive ao merge fora da nav (checklist §4 anotado)**

**Obra 4 — as portas invisíveis** (`3e688a5` · diss. 03 M2 + diss. 04 M6)
- o puxador da casa tem nome: «a casa» mono 10px sob a barra (D54 de pé)
- o pull-down se ensina UMA vez: hint no primeiro open, localStorage mata
  pra sempre — no fluxo do main, nunca por cima de banner
- cena + foto 75 · 13 baselines refotografadas com intenção declarada

**Obra 5 — miúdos de lei** (`c82153c` · um commit, cinco leis)
- `disconnect()` na ordem da D68: ida viva desfaz PRIMEIRO, token morre
  por último; desfazer que falha recusa o desligar (3 testes de ordem)
- grid da Raiz lê quietude por `absences` (D63) — `updated_at` banido do
  badge; `healthPct` morto saiu do hook
- `who:` prefixo de primeira classe: filtra pelos `#who:*`, ensina com os
  valores do tronco, aceita `quem:` (4 testes)
- toasts do conector na Lei do Tom; «Item capturado» silencia no selo
- varredura de tom Raiz/Builder/Aurora («você» sempre, acentos) — e os
  nomes da taxonomy projetada CONGELADOS em ASCII num mapa próprio: o tom
  da UI nunca renomeia label no Gmail (teste guarda)

### △ Decidido (nada ratificado — defaults declarados do handoff)
- **DP-G aplicada por default**: a escada ganhou a porta recomendada
  (opção a do gate §3), 100% reversível — a ratificação segue na mesa
- **DP-H honrada**: nenhum item já nascido foi re-tipado; o conserto do
  mapper vale pro parto novo
- **DP-I aplicada**: a sheet mostra só o que a página provou que importa
- **DP nova pra mesa — DP-J**: os nomes da taxonomy lá fora ficaram
  congelados sem acento (`Atom/saude`); se o Rick quiser a língua com
  acento no Gmail (`Atom/saúde`), é decisão de contrato externo (D68),
  não de tom — um rename lá fora, não um sync novo

### ⬡ Conexões
- O chip do mini-wrap e o chip da triage são a MESMA gramática (D69) vista
  em dois ritos — a heurística nunca decide quieta em nenhum dos dois
- O puxador da escada na ÁRVORE é o irmão do puxador do HOJE («N esperando
  leitura») — a casa agora tem um padrão de porta quieta, usado 2×
- O mapa congelado da taxonomy é o mesmo princípio do guarda de espelho:
  contrato externo não muda por efeito colateral de obra interna

### ✳ Seeds
- Segundo sinal do OmniFocus («sem próxima ação») na sheet do projeto —
  registrada desde a dissecação 04, a sheet agora existe pra recebê-lo
- `extractWhoTag` ainda come acentos (André → `#who:andr-tanaka`) — pol. 7
  da dissecação 03, fora do escopo desta sessão (mexe no espelho da edge)
- O hint de primeira vez (localStorage) virou padrão — candidato pra
  legenda `·`/`○` do drill (pol. 11 da dissecação 02)

### □ Audit
- ✅ 404 testes verdes (12 novos: 5 mapper + 3 disconnect + 4 who:) ·
  tsc limpo · build ok
- ✅ atos.spec **15 cenas** (3 novas: builder, projeto, escada + portas) ·
  gate visual 13/13
- ✅ 6 commits (5 obras + fotos), um por obra, nenhum com hook vermelho
- ✅ baselines refotografadas SEMPRE com intenção declarada no commit
  (builder-assentimento · face-arvore ×2 · as 13 do rodapé · as 5 do tom)
- ⚠ o gate visual engole diffs < 1% (maxDiffPixelRatio 0.01): o rótulo do
  puxador passou por baixo da tolerância — refotografei com
  `--update-snapshots=all` pra baseline não mentir; fica o registro
- ⚠ nada subiu: sem deploy, sem push, sem merge — o `disconnect` novo e a
  edge do cron corrigida ontem só valem em produção depois do Rick

### → Next — a mesa do Rick (em ordem de peso)
1. **Deploy da `daily-digest`** — a MENTE do cron corrigida espera deploy
2. **Ratificar**: DP-E (D74?) · DP-G (a porta da escada, aplicada por
   default) · DP-A…DP-F que rodam com default · DP-J (acento na taxonomy?)
3. **O gatilho do gate (D41)** — ver a última linha deste wrap
4. Fila que sobrou das dissecações: reconciliação no cron (diss. 03 M5) ·
   sheet diz que o cron existe (diss. 03 M4) · passo 5 do wrap vira boca
   `#seed` (diss. 04 M4) · polimentos da ÁRVORE (janela persiste, rótulos
   colidindo, «+N» vira porta, legenda `·`/`○`) · `extractWhoTag` com acento
5. Pendências antigas: redirect URL do Supabase na prod nova · viver a ida
   real no Gmail · instalar o PWA no celular

**A última linha: as duas condições do gate §2 estão cumpridas — a sheet
nasceu, a escada tem porta. O gate está com o gatilho livre. Puxar é teu.**

---

## Wrap · 30 Jul 2026 — a sessão do gate: a morte por merge (D41 disparada)

### ○ Soul
O Rick colou o prompt — e colar o prompt ERA puxar o gatilho. Esta sessão
não decidiu nada: executou com precisão o que o `19_gate.md` deixou pronto
e o `23_handoff` fatiou em quatro obras. Sete telas morreram num commit
atômico, nada do que vive sentiu falta do que morreu (28 provas e2e
passaram sem retoque), e a nav `· ⬡ ✳` virou a casa inteira. A morte por
merge é substituição, não convivência — e hoje ela deixou de ser tese.

### · Items

**Obra 1 — a mudança de casa** (`502c688` · prep, nada morre)
- `AuroraRitual`, `ProtocolBanner`, `protocol-snooze` saem de
  `components/home/` pra `components/hoje/` — e o **`ProtocolRunner` foi
  junto**: dependência dura do banner que vive (o censo é o grep, não a
  lista do gate)
- cena I.2 do atos.spec migra do `/pipeline` pra porta do HOJE (puxador →
  `AssentimentoSheet`) — e **a cena do ato III também**: o gate só
  registrava a I.2, o grep achou as duas (mesma cirurgia, mesma razão —
  a prova é do componente, não da tela)
- a cena visual do chip (D69) migra do mesmo jeito; a foto virou da FOLHA
  (precedente `casa-plano-ida`) — sem relógio fixo o arco vivo andaria
  atrás; baseline refotografada com intenção declarada

**Obra 2 — a morte por merge** (`3ab0365` · o commit atômico)
- **morrem 21 arquivos, −3046 linhas**: `Home`, `Pipeline`, `Calendar`,
  `Analytics`, `Library`, `Graph`, `Projects` + `components/home/`
  inteiro + `components/analytics/` + `components/calendar/` (exclusivos
  confirmados por grep)
- rotas: `/home` → redirect pro `/hoje` (por uma onda); as outras seis
  somem; **`/review` fica fora da nav** (porta: puxador da ÁRVORE, DP-G);
  `PATH_TO_PAGE` encolhe pros 6 caminhos vivos
- `useNav`/`AppPage` encolhem pra 5 páginas; `home` aponta `/hoje` (os
  `navigate('home')` de Raiz e Wrap seguem); `inbox` aponta `/at`
- o bundle principal caiu 442→399 kB; o chunk do d3 (65 kB) sumiu
- `pipeline-service`, `review-service`, `usePipeline`, `Skeleton.tsx` —
  usados pelo mundo vivo, não morreram (muro 4 do handoff honrado)

**Obra 3 — a conferência** (sem commit — nada sobrou pra ajustar)
- rito do verde completo no fecho da obra 2, zero baseline mudada
- **lint: 49 problemas (46 erros + 3 avisos) — os 62 da casca velha
  morreram com ela, zero erro novo**; os que restam moram em services/
  edges/shell e são herdados (App.tsx e AuroraRitual acusam padrão
  setState-em-effect que já existia, só mudou de linha/casa)

**Obra 4 — o registro e o merge**
- carimbo no `19_gate.md` §6: disparado em 30 Jul 2026, por decisão do
  Rick — o prompt é a prova
- merge `v2-faces` → `master` com commit de merge (precedente da casa:
  `merge: …`), push de ambos

### △ Decidido (nada ratificado)
- Nenhuma DP nova. DP-G segue na mesa (a porta da escada é default
  reversível); DP-E/DP-J idem. O merge não ratificou nada por tabela.

### ⬡ Conexões
- O `ProtocolRunner` indo junto e a cena do ato III migrando são o mesmo
  princípio: **o censo é o grep, não a lista** — o gate previu o molde,
  a sessão obedeceu a evidência
- A foto da FOLHA (chip D69) reusa o precedente do `casa-plano-ida`: toda
  cena visual sobre o HOJE sem relógio fixo fotografa a camada, não a página

### ✳ Seeds (achados colaterais — fila, não desvio)
- `d3` ficou órfão no `package.json` (só o Graph usava) — remover na
  próxima faxina de deps
- `Skeleton.tsx` tem exports órfãos (`SoulCardSkeleton`, `ChartSkeleton`,
  `RingSkeleton`) — shared vivo, mas ninguém mais os importa
- os specs históricos de e2e (`dissecacao-01`, `tour`, `gate-fotos`)
  apontam pra rotas mortas — são história (fora do rito do verde), mas
  quem os rodar à mão vai ver vermelho; decidir se ganham nota de museu

### □ Audit
- ✅ rito do verde nas obras 1 e 2: tsc limpo · 404 testes · build ·
  atos.spec 15 cenas · gate visual 13/13
- ✅ única baseline refotografada: `triage-leitura-conector.png`, com
  intenção declarada no commit da obra 1
- ✅ 2 commits de obra + docs; nenhum com hook vermelho; nenhuma das três
  condições de parada disparou
- ⚠ o push de `master` provavelmente dispara deploy na Vercel — e **a URL
  da prod nova segue fora dos Redirect URLs do Supabase** (pendência
  antiga, não piora com o merge, mas o login OAuth pode falhar lá)

### → Next — a mesa do Rick
1. **Redirect URL do Supabase na prod nova** — agora que o merge subiu,
   é a pendência que morde primeiro
2. **Deploy da `daily-digest`** — a MENTE do cron corrigida segue
   esperando a mão do Rick
3. **Ratificar**: DP-E (D74?) · DP-G · DP-A…DP-F · DP-J
4. Fila MANCA: reconciliação no cron · boca `#seed` no wrap · polimentos
   da ÁRVORE · `extractWhoTag` com acento · faxina do d3 e dos skeletons
   órfãos · nota de museu nos specs históricos
5. Viver a ida real no Gmail · instalar o PWA no celular

**A última linha: a nav `· ⬡ ✳` é a casa inteira. O que morreu não faz
falta — o que vive já fazia o trabalho.**

---

## Wrap · 30 Jul 2026 — a sessão da faxina e da fila (o rescaldo do gate)

### ○ Soul
A sessão comum que o handoff pediu: nada de gatilho, nada de morte. Varrer
o chão depois da obra e fechar a fila MANCA que as dissecações deixaram
nomeada. As cinco obras fecharam INTEIRAS, cada uma com rito verde e um
commit — de dentro pra fora, como a ordem mandava. O mundo novo ficou
inteiro por dentro: a lente que sabe de si, o wrap sem passo oco, a árvore
polida, o chão sem entulho.

### · Items

**Obra 1 — a faxina pós-gate** (`a7ad79a`)
- `d3` + `@types/d3` fora do package.json e lockfile (grep confirmou: só o
  Graph morto usava) — 570 linhas de lockfile a menos
- `SoulCardSkeleton`, `ChartSkeleton`, `RingSkeleton` morreram (órfãos);
  `CardSkeleton`/`ListSkeleton` ficam — o `AuditPanel` vivo usa
- nota de museu em `dissecacao-01`, `tour`, `gate-fotos` (fotografam o
  mundo de antes do gate; vermelho à mão é a verdade) e nota PARCIAL na
  `dissecacao-04` (só a cena do `/projects` é história — wrap, busca e
  offline seguem dirigíveis)

**Obra 2 — a lente sabe de si** (`81177ea` · diss. 03 M4+M5)
- a sheet diz que o cron existe: «a casa olha sozinha todo dia às 07:15 ·
  última volta há Nh» lendo `user_connectors.last_sync_at` — estado, nunca
  promessa (D46); só aparece com Google ligado
- `taxonomy-sync` ganhou a ação `reconcile`: deletou lá fora → braço
  desliga, e NUNCA cria (criar exige assentimento, D68); só 404/410
  explícito desliga o calendário — erro transitório do Google não vira
  comando; sem ida viva, sai antes de acordar o Google
- `daily-digest` chama a reconciliação na volta (braço 1.5) — «deletou lá
  fora → braço desliga» deixou de depender de alguém abrir o preview à mão;
  falha não cala o cofre
- **o terceiro espelho nasceu com guarda**: `taxonomy-espelho.test.ts`
  (8 testes) vigia o contrato da ida (TaxonomyRecord, namespace,
  CALENDAR_KEY) e o contrato de chamada cron→reconcile

**Obra 3 — o `extractWhoTag` com acento** (`8ce4b42` · diss. 03 pol. 7)
- André Tanaka → `#who:andre-tanaka` (antes: `andr-tanaka`) — NFD separa a
  letra do acento antes do slug, NOS DOIS lados (connector-service e
  espelho da daily-digest)
- guarda novo no `series-espelho`: transliteração e montagem do slug
  quebram o teste se divergirem; 2 testes de comportamento (acento,
  cedilha+til)
- muro 5 honrado: vale pro parto novo; item já nascido fica (DP-H). O
  `who:` da busca ensina com os valores do tronco verbatim — os
  transliterados aparecem certos por construção

**Obra 4 — o passo 5 do wrap vira boca** (`736b05b` · diss. 04 M4)
- o cartão-promessa («o que dorme será encontrado na Fase 5») morreu: boca
  de texto que planta de verdade — captura-primeiro (D52), a semente nasce
  `#seed` no inbox estágio 1, em silêncio (pol. 8), o rito segue
- `capture` do pipeline aceita tags (compatível, default `[]`)
- cena 16 no atos.spec: a boca existe, a semente aparece plantada, o POST
  prova tag + estágio; o selo com dia vazio segue valendo (cena 15 intacta
  — obra 24a não regrediu)

**Obra 5 — os polimentos da ÁRVORE** (`7c58c07` · diss. 02 pol. 7–11)
- a janela persiste (`mindroot.arvore-janela.v1`) — a lente escolhida é
  preferência, não estado de página; cena 17 no atos.spec prova
- «família» e «propósito» se leem separados (limiar do anchor 0.25→0.15)
- «+N mais antigas» virou porta: expande o drill até o total honesto
  (`allLeaves` no engine, com teste — o teto de 8 é do primeiro olhar,
  nunca do caminho) + recolher
- pol. 10 rendeu: o tracejado do ideal legível (opacity .5, dash 3-4)
- legenda quieta de `·`/`○` no PRIMEIRO drill (`mindroot.hint-drill.v1`,
  molde do hint-busca) — depois nunca mais

### △ Decidido (nada ratificado)
- Nenhuma DP nova. Tudo aplicação de leis já ratificadas (D46, D52, D68,
  DP-C/DP-H por precedente) ou polimento sem mesa.

### ⬡ Conexões
- O terceiro espelho (`taxonomy-espelho`) fecha o padrão da casa: TODO
  contrato espelhado à mão entre client/engine e edge tem guarda que
  quebra na divergência — vault, series, taxonomy
- A legenda do drill e a janela persistida reusam dois moldes que a onda
  já tinha parido: o hint-de-primeira-vez e o `mindroot.*` — a casa cresce
  copiando a si mesma

### ✳ Seeds
- A reconciliação rica (label RENOMEADO vira «sumiu»; o Gmail mantém o id,
  dava pra seguir o rename) — registrada desde a diss. 03, o `reconcile`
  novo é o lugar natural quando ela vier
- A porta do «+N» podia um dia abrir a busca já filtrada pelo ramo (a
  semente «drill como porta de busca») — hoje expande no lugar, que é o
  gesto mais barato; a busca semeada precisa de canal que o AppShell ainda
  não tem

### □ Audit
- ✅ rito do verde nas 5 obras: tsc limpo · 417 testes (13 novos: 8
  taxonomy-espelho + 2 who-espelho + 2 who acento + 1 allLeaves) · build ·
  atos.spec **17 cenas** (2 novas: semente `#seed`, janela persiste) ·
  gate visual 13/13
- ✅ 5 commits, um por obra, nenhum com hook vermelho; nenhuma das três
  condições de parada disparou
- ✅ baselines refotografadas SÓ na obra 5, com intenção declarada:
  `face-arvore.png` (anchors + tracejado — diff <1%, refoto pra baseline
  não mentir, precedente do rótulo do puxador) e `face-arvore-drill.png`
  (a legenda nova)
- ⚠ as fotos de prova das dissecações (23–31, 72–76) são regeneradas
  pelo próprio atos.spec a cada rodada do rito — diffs binários mínimos
  de re-render foram junto nos commits das obras; são fotos de cena, não
  baselines
- ⚠ lint segue 46 erros + 3 avisos herdados (services/edges/shell) — zero
  erro novo; a reforma é de outra onda
- ⚠ nada subiu de edge: o `reconcile` e o `extractWhoTag` espelhado SÓ
  valem em produção depois do deploy — mão do Rick

### → Next — a mesa do Rick
1. **Deploy das edges — agora com TRÊS razões**: `daily-digest` (a MENTE
   do cron corrigida em 30 Jul + o braço da reconciliação + o
   `extractWhoTag` com acento) e `taxonomy-sync` (a ação `reconcile`)
2. **Redirect URL do Supabase na prod nova** — segue mordendo o login
   OAuth
3. **Ratificar**: DP-E (D74?) · DP-G · DP-A…DP-F · DP-J
4. Fila que sobrou: obra de voz do builder (com o E., D64) · reforma do
   `Review.tsx` · lint herdado · reconciliação rica (rename)
5. Viver a ida real no Gmail · dry-run do digest · instalar o PWA

**A última linha: a fila MANCA das dissecações está vazia. O que resta na
mesa é deploy, ratificação e vida vivida — nada disso é obra de sessão.**

---

## Wrap · 30 Jul 2026 (tarde) — o rescaldo do rescaldo: deploy e ratificação

### ○ Soul
A mesa esvaziou no mesmo dia. O Rick voltou com quatro gestos curtos —
«deploy», «domínio próprio?», «descreve as DPs», «qual a próxima onda» —
e fechou com «pode ratificar». Nenhuma obra de código: a tarde foi de
subir o que estava pronto e transformar defaults vividos em lei numerada.

### · Items
- **Deploy feito, pela mão do Rick via chat** (a autorização explícita que
  o muro 4 esperava): `taxonomy-sync` **v2** e `daily-digest` **v2** no ar
  (projeto `avvwjkzkzklloyfugzer`, `verify_jwt=false` mantido como estava).
  Sobem juntas: a MENTE do cron corrigida, o braço da reconciliação, o
  `extractWhoTag` com acento.
- **Ratificação em bloco**: DP-A→**D70** · DP-B→**D71** · DP-C→**D72** ·
  DP-D→**D73** · DP-E→**D74** · DP-F→**D75** · DP-H→**D76** · DP-I→**D77**
  · DP-J→**D78** (taxonomy fica ASCII — rename lá fora leria «sumiu» e
  desligaria braços). Registro no `03_decisoes-ux.md`, raiz declarada.
- **DP-G ficou na mesa de propósito**: a porta da escada em observação
  vivida por uma semana — se servir no uso real, vira D79 (~6 Ago).
- **O resumo em HTML nasceu**: `25_resumo-da-faxina.html`, no molde dos
  irmãos (20, 22), commitado e mergeado antes desta tarde.

### △ Decidido
- D70–D78 ratificadas (acima). Nenhuma decisão nova além das que já
  rodavam como default declarado.

### ⬡ Conexões
- O deploy pelo chat é o mesmo precedente do gatilho do gate: **colar o
  prompt É o gesto** — a autorização explícita no prompt do Rick é a «mão
  do Rick» que os muros pedem.

### ✳ Seeds
- **Domínio próprio pro app** — recomendado `atom.ramalho.au` (mata o
  Redirect URL de vez, dá origem estável pro PWA/D55). Aguarda o Rick
  escolher o hostname; a divisão: Vercel+Supabase via sessão, CNAME no
  Cloudflare é dele.
- **Onda 4 proposta: a onda do E.** (retorno e voz) — (1) «o que mudou
  desde que você olhou»; (2) as sementes `#seed` voltam (a Fase 5 que o
  cartão morto prometia); (3) voz do builder com o E. (D64); (4) bilhetes
  do E. (D53 v2). Proposta registrada, não decisão — abre com benchmark
  do «retorno», como manda a D62.
- **A visualização padrão de calendário como opção quieta, talvez um
  dia** — plantada pelo Rick: a lente é o nosso jeito (D67), mas a
  ausência da grade familiar pode gerar ansiedade em quem precisa dela;
  «esse é o nosso jeito, mas se você quiser, está aqui». Nota sem ação:
  `semente_calendario-visualizacao-padrao.md`.

### □ Audit
- ✅ deploy verificado pelo retorno da API (v2 ativa nas duas edges)
- ⚠ a prova de fogo é o cron de **31 Jul 07:15** — ler os logs da edge na
  próxima sessão (ou dry-run antes, gesto do Rick)
- ✅ zero código tocado nesta tarde; hooks da manhã seguem valendo

### → Next — a mesa do Rick (curta pela primeira vez)
1. Conferir o digest de amanhã 07:15 (a v2 rodando de verdade)
2. Escolher o hostname do domínio próprio (sugestão: `atom.ramalho.au`)
3. Viver a semana da DP-G · assentir a ida real no Gmail · PWA no celular
4. Quando quiser abrir a Onda 4: o primeiro gesto é o benchmark do retorno

**A última linha: a mesa que era de sete itens virou quatro — e três deles
são vida, não obra.**

---

*Regra do diário: cada sessão substantiva da onda ganha um wrap aqui — soul,
items, decidido, conexões, seeds, audit, next. O formato é o do wrap do app,
porque a casa come a própria comida.*
