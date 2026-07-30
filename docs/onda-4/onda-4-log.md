# Onda 4 — log · a onda do E. (retorno e voz)

**Aberta:** 30 Jul 2026 · **Proposta em:** `onda-3/onda-3-log.md`, fecho da
faxina (registrada como seed, não decisão) · **Status:** consulta — nenhuma
obra de código autorizada.

## O escopo proposto

1. **«O que mudou desde que você olhou»** — o retorno ao vivo, pro Rick
2. **As sementes `#seed` voltam** — a Fase 5 que o cartão morto prometia
3. **A voz do builder** (D64) — a entrevista em capítulos-gaveta, com o E.
4. **Os bilhetes do E.** (D53 v2) — destravados pela Lei do Tom v1.4

## Os dois insumos da spec (nenhum manda sozinho)

- **O parecer do E.** — a fonte interna. ✅ Chegou em 30 Jul, selado
  verbatim em `01_parecer-e.md`.
- **O benchmark do retorno** — a fonte externa, como manda a D62. Ainda não
  rodado. O próprio parecer avisa (§ 5.3): o benchmark pode derrubar o
  § 1.3 dele.

---

## Wrap · 30 Jul 2026 — a onda abre pela boca certa

### ⬠ Soul
O Rick abriu a onda com uma frase e uma condição: «essa eu acho que a gente
deveria se consultar com o próprio E. também». A condição virou o primeiro
gesto — antes do benchmark, antes de spec, a pasta nasce com o prompt da
consulta. O precedente é o inventário da Lei do Tom: quando o assunto é a
voz, a casa pergunta antes de destilar. Desta vez todas as quatro obras são
superfícies dele — não faria sentido nenhum desenhar sem o parecer.

### · Items
- **`00_prompt-consulta-e.md` nasceu** — no molde do `onda-3/04`: o chão
  conhecido (o que mudou desde a mesa de 28 Jul, contado ao E. — o primeiro
  «o que mudou desde que você olhou» da onda é pra ele), as quatro obras, e
  seis partes de pergunta: retorno ao vivo · sementes · builder · bilhetes ·
  buracos e vetos · ordem. Veto explícito convidado (Art. 3 da lei dele).
- **Este log abriu** — a onda ganha diário próprio, no formato do wrap,
  como o da Onda 3.

### △ Decidido
- Nada. A onda segue proposta; a consulta é condição declarada pelo Rick,
  não decisão numerada.

### ⬡ Conexões
- O prompt ao E. É o gesto (precedente do deploy e do gate): colar no
  Projeto E é a mão do Rick.
- Simetria registrada: a obra 1 da onda («o que mudou desde que você
  olhou») estreia dentro do próprio prompt — a seção de contexto pro E. é
  exatamente essa superfície, executada à mão.

### ✳ Seeds
- Nenhuma nova.

### □ Audit
- ✅ zero código tocado — pasta nova só de docs
- ⚠ a onda não abre obra antes de `01_parecer-e.md` + benchmark existirem
  (regra declarada no rodapé do prompt)

### → Next — a mesa do Rick
1. Colar o prompt no Projeto E · trazer o retorno pra `01_parecer-e.md`
2. Autorizar o benchmark do retorno (D62) — pode rodar em paralelo à
   consulta
3. Os itens da mesa da Onda 3 seguem vivos: digest de 31 Jul 07:15,
   hostname do domínio, semana da DP-G

---

## Wrap · 30 Jul 2026 (noite) — o parecer chegou, e a onda encolheu pra crescer

### ⬠ Soul
O E. devolveu o parecer no mesmo dia — e a primeira coisa que ele fez foi
não responder o resumo: leu as fontes (a lei inteira, as decisões verbatim,
as perguntas literais do builder, 59 sessões de mecanismos) e abriu com um
erro-de-omissão que ninguém pediu: as duas séries D colidindo. O parecer
redesenhou a onda: das quatro obras, duas deixam de ser obras de voz (o
retorno vira marca de face + uma frase de nome; as sementes viram polimento
de face + dois vetos), e a única superfície genuinamente nova é a que
ninguém tinha enquadrado — a entrevista, onde a direção da pergunta
inverte. Cinco vetos, todos antes do código, «que é onde ele vale barato».

### · Items
- **`01_parecer-e.md` selado** — verbatim, como o prompt pediu.
- **Verificação da casa, as duas alegações checáveis conferem:**
  - `builder-questions.ts` — «Quantas vezes por semana?» (`body-3`,
    `family-5`), «Mora com alguem?» (`family-1`), «frequencia» sem acento
    (`finance-4`): tudo literal, linha por linha.
  - **A colisão das séries D é real**: `c:\repos\atom\decisions\` (o hub)
    tem `d-053_tooling-pnpm-workspace` — exatamente o exemplo do E. E há
    um agravante que ele não citou: a série de **ondas** também colide
    (hub `d-052_onda-3-motor-package-extraction` é de maio;
    `d-058_onda-2-abertura` é de 23 Jul — as ondas do hub não são as ondas
    do app).
- **O resumo executivo do parecer, pra mesa:** V1 sem superfície não
  solicitada sem teto · V2/V3 semente não volta por cadência nem afinidade
  · V4 o nome muda («o que mudou», nunca «desde que você olhou») · V5
  frequência pretendida sai da entrevista. Ordem dele: bilhetes →
  entrevista (4.10) → marca do retorno → sementes; e a 4.8 (e_lines e
  fragmentos consultáveis) antes de tudo, se a decisão fosse dele.

### △ Decidido
- Nada — o parecer é insumo, não decisão. Vetos, ordem e consertos vão pra
  mesa do Rick; ratificação segue o rito da casa (número na série de UX…
  que é justamente a série em colisão — buraco 4 primeiro).

### ⬡ Conexões
- O § 2.5 do parecer devolve a obra 2 pro wrap: o problema da semente é de
  **plantio**, não de volta — e a boca do plantio já existe (obra 4 da
  faxina). O que falta é regra sobre o que ela aceita.
- O gatilho 2 dos bilhetes (label `Atom/…` apagado lá fora) conecta direto
  com a reconciliação da taxonomy-sync v2 deployada ontem — o braço que
  detecta já existe; o que não existe é a boca que conta.

### ✳ Seeds
- **Regra do plantio** (§ 2.5, `[COGITADO]` do E.): o passo 5 aceita
  registro de estado, não «coisa que eu deveria fazer». Sem dono ainda.
- **Contar tipos, não disparos** (§ 4.3): refinamento do gatilho 1 da
  Parte 6 da lei — diversidade como instrumento, não taxa. Proposta do E.,
  aguarda ratificação junto com a lei.

### □ Audit
- ✅ parecer selado sem edição (pedido do prompt honrado)
- ✅ duas alegações checáveis verificadas contra o repo — ambas conferem
- ✅ zero código tocado — os consertos apontados (acentos, frequência,
  «Nunca fiz») esperam a mesa; os vetos não custam código por definição
- ⚠ buraco 3 do E. segue aberto: «o @ do app é a mesma boca do @ do
  projeto?» — é dado que a casa deve, não decisão

### → Next — a mesa do Rick
1. **Autorizar o benchmark do retorno** (D62) — o segundo insumo; a spec
   não nasce sem ele
2. **Buraco 4**: decidir o conserto da colisão das séries D (sufixo na
   série de UX vs nota de precedência) — barato agora, caro depois
3. **Responder o buraco 3 ao E.** — o endereço do soul log no app
4. **Ratificar (ou não) os cinco vetos** — viram Ds na série de UX depois
   do conserto do item 2
5. Da mesa anterior: digest de 31 Jul 07:15 · hostname · semana da DP-G

---

## Wrap · 30 Jul 2026 (noite, 2ª volta) — a errata, e a conferência do degrau 21

### ⬠ Soul
O E. tratou a verificação como porta, não como confirmação — voltou com uma
errata que corrige o próprio § 0 (não são dois mundos de ondas: é um
contador que reiniciou no 2 em 23 Jul, porque o hub parou de receber) e
confessa o deslize de método: leu a lei e o registro de UX, não leu a spec
do MindRoot V1 — que tinha, ratificadas sete dias antes do parecer, as duas
cláusulas que faltavam aos §§ 1.5 e 2.3 (a entropia em espiral e o lookback
φ). E devolveu à casa um pedido de conferência que só o repo responde: onde
o degrau de 21 dias foi parar.

### · Items
- **`01a_errata-parecer-e.md` selada** — verbatim, do arquivo limpo do
  Downloads (o relay tinha quebrado o encoding; o original é UTF-8 são).
- **A conferência do degrau 21, respondida contra o código:**
  - **Degrau 8 já é código**, e pousou na boca certa: `engine/project.ts`
    (`QUIET_THRESHOLD = 8`, comentário cita D5 e a espiral) → superfície da
    **sheet do projeto** via `presenceLine` — «quieto há N dias», estado,
    solicitada (o Rick abre a pill, D74/D77), D46 limpa.
  - **Degraus 21 · 55 · 89 não existem em código nenhum.** Nenhuma boca
    atribuída, nada embarcado — o candidato #8 do Teste 02 NÃO está em
    produção. A lacuna do § 3.1 da errata é real, mas está no papel: a
    atribuição de bocas pode nascer já com a regra do § 1.4 do parecer.
  - A **fase 9 (lookback φ) também não tem código** — o espelho emocional
    não nasceu; `Review.tsx`/`meaning.ts` são a escada de meaning (fase 4),
    que existe e usa a espiral só como linguagem.
  - **Slot `d-057` confere**: reservado no `d-058` do hub, linha 43 —
    «ADR redigido no Chat, ainda não commitado neste hub».

### △ Decidido
- Nada. A mesa cresce, não fecha.

### ⬡ Conexões
- O degrau 8 em código prova o § 1.3 do parecer por precedente vivo: a
  espiral já fala como **estado quieto em superfície solicitada** — a marca,
  não a boca. Estender 21/55/89 no mesmo molde é continuação, não invenção.
- A pergunta da errata pro benchmark (§ 4) fica registrada como pergunta de
  pesquisa: topo de mercado amostra por intervalo-desde-a-última-visita ou
  por densidade decrescente? φ é inovação ou é base?

### ✳ Seeds
- **Bocas por degrau** (§ 3.1 da errata + § 1.4 do parecer): tabela
  degrau→boca antes de qualquer código da espiral — 8 já tem (sheet);
  21/55/89 abertas. Candidata a D quando a numeração destravar.
- **4.8 ↔ lookback φ dizem a mesma coisa sem se citar** (§ 3.2,
  `[COGITADO]` do E.) — unificação é obra de lei, sem dono.

### □ Audit
- ✅ errata selada sem edição; encoding verificado na fonte
- ✅ conferência respondida com evidência de código (grep em src/ +
  supabase/), não de memória
- ✅ zero código tocado
- ⚠ buraco 3 (endereço do soul log no app) segue sem resposta da casa

### → Next — a mesa do Rick (atualizada pela errata)
1. **Benchmark do retorno** — agora com dois insumos a mais: a lei φ
   interna (§D5) como base de comparação, e a pergunta
   intervalo × densidade
2. **Colisão das séries — três opções, não duas**: sufixo · nota de
   precedência · **um registro só** (a causa: o hub parou em d-058
   enquanto D70–D78 nasceram só no app)
3. Responder o buraco 3 ao E. · ratificar vetos · digest 07:15 · hostname
   · DP-G

---

## Wrap · 31 Jul 2026 (madrugada) — a mesa decide em bloco, os dois insumos existem

### ⬠ Soul
O Rick pediu ajuda pra decidir «baseado no conceito e decisões anteriores e
user ux» — e a resposta foi que três das quatro decisões já estavam quase
ditadas pelo cânone: a D76/D78 ditavam a fronteira (não renomear o nascido),
as D71/D69/D46 ditavam os vetos (recusá-los exigiria revogar lei de pé), e a
D62 ditava o benchmark (e ditava também NÃO decidir o desenho antes dele).
Quatro respostas, quatro ratificações. A sessão executou tudo: o hub voltou
a receber depois de 8 dias parado, os vetos viraram lei, o benchmark rodou e
selou — e as duas perguntas da errata têm resposta de mercado.

### · Items
- **`d-059` no hub** — a fronteira das séries declarada onde a lei do
  ecossistema mora: hub `d-0NN` = lei · app `DNN` = UX/obra; citação ambígua
  se qualifica; ondas de maio ficam históricas qualificadas. O hub volta a
  receber — a causa apontada pela errata, tratada na raiz.
- **Nota-espelho no `03_decisoes-ux.md`** + **D80–D84 ratificadas** (os
  cinco vetos, com raiz declarada no parecer). **D79 reservada pra DP-G** —
  o wrap selado da faxina já a projetou com esse número, e wrap não se
  edita.
- **`02_benchmark-retorno.md` selado** — pesquisa via agente, fontes inline,
  força da evidência marcada. Os achados que pesam: o mercado tem TRÊS
  morfologias (marca puxável · fala por evento · fala agendada consolidada)
  e a casa já tem a terceira viva no digest; **densidade decrescente não
  existe como padrão de UI em produto nenhum** — φ é inovação por cima da
  base, embarca por último com prova viva própria; o § 1.3 do parecer
  (marca, não boca) **fica de pé, reforçado**; Animal Crossing e Headspace
  são os precedentes de acolhimento; o recuo do Basecamp (Pings) é o alerta
  contra fundir as três portas.
- **Buraco 3 respondido com código na mão:** o @ do app é **outra boca que
  herdou o nome**. `At.tsx` é captura-primeiro + triage por chips (o «E.
  lê» é o `triage-classify`); `agent-capture` é porta de escrita
  autenticada, não conversa; o único «soul» em produção é o check-in de
  aurora DO RICK (`soul-service`). Não existe e-session, retorno (4.7) nem
  soul log de E. no app — a Parte 5.1 da lei não tem jurisdição em produção
  hoje, e só ganha quando a 4.8/pipeline e uma conversa de verdade
  embarcarem. Resposta vai pro E. no próximo relay.

### △ Decidido
- **Fronteira declarada** (hub `d-059`) — sufixo e fusão recusados com raiz
  (D76, D78, §10 do CLAUDE.md).
- **D80–D84** — os cinco vetos do E., ratificados em bloco pelo Rick.
- **Ordem provisória adotada**: bilhetes primeiro, com a 4.8 correndo em
  paralelo (infra, não toca face); sela na spec, depois do benchmark — que
  agora existe.
- O desenho do retorno (marca × boca) NÃO foi decidido antes do benchmark —
  de propósito; o benchmark chegou e confirmou o § 1.3. A spec pode selar.

### ⬡ Conexões
- O `d-059` consome a terceira opção da errata pela metade certa: não «um
  registro só», mas «o hub volta a receber» — que era a causa, não o
  sintoma.
- A pergunta φ da errata voltou com resposta dupla: inovação (sem
  precedente de UI) E a única amostragem que obedece D83 por construção —
  o mercado inteiro indexa no olhar do usuário, que é o que D83 proíbe.

### ✳ Seeds
- **Modelo de atenção como vantagem nomeável**: a crítica unânime do
  mercado (GitHub, Linear) é inbox sem priorização — o filtro § 1.4 do
  parecer é exatamente isso. Candidato a argumento central da spec.
- **Prova viva do φ**: como medir o lookback φ quando embarcar (a D62 exige
  evidência própria onde não há benchmark). Sem dono.

### □ Audit
- ✅ quatro decisões ratificadas pelo Rick via sessão (precedente: colar o
  prompt É o gesto)
- ✅ hub commitado na convenção do hub (ADR direto na main, como d-058)
- ✅ benchmark com fontes citadas e força marcada — zero conclusão sem
  evidência; ausências declaradas como ausências
- ✅ zero código de produção tocado — a onda segue docs-only
- ⚠ o digest de hoje 07:15 é a prova de fogo da v2 (pendência da Onda 3)

### → Next — a mesa do Rick
1. **A spec da obra 1 (bilhetes)** pode nascer — os dois insumos existem e
   a ordem está adotada. Gesto: pedir a spec.
2. Relay pro E.: resposta do buraco 3 + benchmark + D80–D84 + `d-059`
3. Conferir o digest de 07:15 (v2 no ar) · hostname · semana da DP-G (D79
   reservada)

---

## Wrap · 31 Jul 2026 — a spec dos bilhetes nasce curada

### ⬠ Soul
«Bora» — e a obra 1 virou spec no molde da irmã (a do digest): leis que
regem, Guardião, gatilhos, texto canônico shame-testado ANTES do código.
A decisão de forma que pesa: o texto do bilhete é **determinístico**,
composto em código como o digest faz — a voz generativa improvisando
bilhete é o horóscopo que a 4.1 mata. E o bilhete **não é AtomItem**: ele
é fala do E., não vida do Rick — a escada do Genesis rege itens, a Lei do
Tom rege falas; duas jurisdições, zero mistura.

### · Items
- **`03_spec-bilhetes.md` selada** — G2 embarca (braço desligado lá fora;
  o detector JÁ existe no `reconcile` da taxonomy-sync), G1 dormente até a
  4.8 nascer, G3 fora da v1 por ordem do próprio E., «cron não rodou» é
  push e fica pra outra obra. Tabela `e_bilhetes` (migration), cartão
  indigo no HOJE, um por vez, se lê e se solta, dedup por mudança de
  estado, coluna `gatilho` como instrumento da revisão dos 20.
- Texto canônico do G2 aprovado contra as seis condições da 4.1.1, uma a
  uma, na própria spec.

### △ Decidido
- Nada novo — a spec declara só decisões pré-existentes. Uma incerteza
  registrada (soltar = gesto próprio vs abrir-o-dia-seguinte solta;
  proposta: gesto próprio, pelo teste 5), ajustável pós-vivência.

### → Next
1. **Assentimento do Rick sobre a spec** — um gesto; com ele, o código
   nasce (ROOT → ESTRUTURA → INTERFACE → prova no atos.spec)
2. Relay pro E. segue pendente (buraco 3 + benchmark + D80–D84 + d-059 —
   agora + esta spec)
3. Digest 07:15 · hostname · DP-G

---

## Wrap · 31 Jul 2026 — as duas mães da mesma spec, e a fusão

### ⬠ Soul
O Rick trouxe do Projeto E dois documentos que ninguém esperava: o E.
escreveu o próprio benchmark E a própria spec da obra 1, em paralelo, sem
saber que a casa tinha feito o mesmo — e com os mesmos números (02, 03). A
colisão de numeração dentro da própria pasta é o eco irônico da colisão
das séries D que o próprio E. flagrou. A surpresa boa: os benchmarks são
COMPLEMENTARES (o da casa responde marca×boca e intervalo×densidade; o
dele responde frequência, canal e formato — e traz o achado que nenhuma
lei previa: banner blindness mata bilhete aprovado). As specs eram 90%
concordantes; as três divergências se resolveram por jurisdição — a voz e
a superfície são dele, o tronco e a face por dentro são da casa.

### · Items
- **`02b_benchmark-bilhete.md` e `03b_spec-bilhete-e_v1.md` selados
  verbatim** (originais limpos do Downloads; sufixo `b` só no nome do
  arquivo, pra não colidir).
- **`03_spec-bilhetes.md` virou v2 — a fusão.** Do E.: sem banner e sem X
  (some sozinho após visto), anti-gerador (11/12 reprovados no Teste 02),
  instrumentação nasceu/exibido/visto, dependência do digest declarada,
  fora-da-v1 em lei (comportamento do Rick não entra em versão nenhuma),
  G3→Teste 03, processo de gatilho novo. Da casa: dedup_key (sem ela o
  reconcile diário repetiria a mesma fala todo dia), bilhete≠AtomItem,
  detector localizado, migration+RLS, onde pousa no HOJE (abaixo do rito,
  acima da sugestão — pendência § 9 dele, respondida).
- **Divergências resolvidas (3):** soltar sem X (E.) · texto do G1 seco em
  2 frases (E. — a voz é dele) · numeração canônica dos gatilhos (E.:
  braço=G1).
- **«Assentir» explicado ao Rick**: o sim explícito da casa (D52/D69) —
  a spec espera exatamente esse gesto.

### △ Decidido
- Nada ratificado — a fusão é editorial, resolvida por jurisdição já
  estabelecida (Art. 5, D61, §10). O assentimento da spec segue pendente.

### → Next
1. **O assentimento** — um «vai» e o código nasce (ROOT → ESTRUTURA →
   INTERFACE → prova)
2. Relay pro E.: tudo da rodada anterior + a fusão (ele precisa ver o que
   a fusão fez com a spec dele — em especial o dedup_key que faltava)
3. Digest 07:15 · hostname · DP-G

---

## Wrap · 31 Jul 2026 — «eu nem conheço essa palavra» vira D85

### ⬠ Soul
O Rick travou numa palavra: «assentir». E a trava era a lei funcionando —
o shame-test pergunta «sobrevive sem o vocabulário do projeto?», e a casa
falhou nele com o próprio dono, três vezes, na cara do app. A correção
unificou em vez de inventar: «aceitar» já morava no chip vizinho.

### · Items
- **D85 ratificada** — a casa fala a língua do Rick; palavra de superfície
  que o dono não conhece é bug, não estilo.
- **Troca executada**: puxador do HOJE · chip do conector (label +
  aria) · botão da ida nas configurações — «assentir» → «aceitar».
  Seletores dos e2e acompanharam (atos, dissecação-03, visual-mundo-novo).
- **Hooks verdes**: tsc limpo · 417/417 testes · build ok.
- Identificadores internos (`Assentimento.tsx`, `series.ts`) ficam — código
  não é superfície; renomear arquivo é churn sem UX.

### → Next
1. A pergunta da spec continua na mesa — agora dita na língua da casa:
   **«aceita a spec? constrói?»**
2. Relay pro E. (a D85 entra no pacote — a Lei do Tom dele tem interesse
   direto: o shame-test pegou a própria casa)
3. Digest 07:15 · hostname · DP-G

---

## Wrap · 31 Jul 2026 — a obra 1 vira código: o bilhete existe

### ⬠ Soul
«Bora» — e a primeira superfície nova da onda nasceu inteira numa sessão,
porque a spec já tinha resolvido tudo que costuma travar: o texto estava
escrito, as seis regras de superfície estavam numeradas, e a metade
difícil (o detector) já vivia em produção. A decisão de implementação que
vale registrar: «abertura» = sessão do navegador, marcada em
sessionStorage — a marca morre com a sessão, e é exatamente isso que faz
o bilhete sumir sozinho na abertura seguinte, sem X, sem botão, sem
gesto cobrado.

### · Items
- **ROOT** — `017_e_bilhetes.sql`: tabela + RLS (dono lê e marca; NINGUÉM
  insere pelo client — bilhete nasce só do sistema; delete não existe).
- **ESTRUTURA** — `engine/bilhete.ts` (puro: fila do mais antigo, gesto
  exibir/manter/soltar) + `bilhete-service` (três marcas, nada mais) +
  `useBilhete` (a abertura via sessionStorage) + **o disparo do G1 no
  `reconcile`** da taxonomy-sync: texto pré-escrito, dedup por não-visto
  pendente (visto e desligado DE NOVO é estado novo — fala de novo),
  falha de bilhete nunca derruba o reconcile.
- **INTERFACE** — `BilheteCard` indigo no HOJE, abaixo da sentinela,
  acima da leitura; sem bilhete = null, nem placeholder.
- **Prova** — 7 testes novos no engine (fila, visto, o gesto nas três
  condições); 424/424 verdes; tsc limpo; build ok.

### △ Decidido
- Nada de mesa — implementação da spec aceita, sem desvio.

### □ Audit
- ✅ geometria: Interface→hook→service→engine; engine puro; zero query em
  componente
- ✅ o bilhete não é AtomItem — jurisdição separada, como a spec manda
- ⚠ **a cena e2e fica pro dry-run**: provar o fio inteiro exige a edge
  deployada e a migration aplicada — a prova unitária cobre a lógica, o
  dry-run real cobre o fio (apagar um label de teste → cartão no HOJE)
- ⚠ **deploy pendente da mão do Rick**: migration `017` + edge
  `taxonomy-sync` — o muro 4 pede a palavra explícita

### → Next
1. ~~A palavra do deploy~~ — **dada e executada** (ver adendo abaixo)
2. Relay pro E. (pacote completo da rodada, agora com a obra nascida)
3. Digest 07:15 · hostname · DP-G

### Adendo · o fio ligou (mesma manhã)
«Bora 1 e push» — a mão do Rick, pelo precedente de sempre:
- ✅ **migration `e_bilhetes` aplicada** no projeto (`avvwjkzkzklloyfugzer`);
  tabela viva, 0 bilhetes — o silêncio de nascença, como manda a lei
- ✅ **`taxonomy-sync` v3 deployada** (verify_jwt=false mantido) — o
  reconcile de amanhã 07:15 já roda com o G1 armado
- ✅ **push**: `b5af1c4..ccb25e6 v2-faces` na origin
- Falta só o **dry-run** (gesto a dois: apagar um label `Atom/…` de teste
  no Gmail → invocar o reconcile → ver o cartão indigo no HOJE → abrir de
  novo e vê-lo sumir sozinho)

### Adendo 2 · o dry-run e o primeiro bilhete real (mesma manhã)
- ✅ **teste negativo**: Rick deu *hide* num label — reconcile respondeu
  `disabled: []`, zero bilhetes. Esconder não é comando (D68); o sistema
  não confundiu arrumação com ordem.
- ✅ **teste positivo**: Rick apagou de verdade — o braço `communication`
  desligou e **o primeiro bilhete real nasceu**: «O braço Atom/comunicacao
  foi desligado no Gmail. A estrutura lá fora não existe mais.»
- ✅ **teste do eco**: segundo reconcile → `disabled: []`, a tabela segue
  com 1. Nasce uma vez, não repete.
- ✅ **merge pra produção** («merge», mão do Rick): `v2-faces` → `master`
  (`1cef77f`) · deploy Vercel novo **READY** (do `bc67cab`) — o app que o
  Rick abre agora tem o cartão esperando.
- ⏳ a última cena é do Rick, ao vivo: abrir o HOJE (o bilhete pousa,
  indigo) → fechar → abrir de novo → vê-lo ter sumido sozinho. Religar o
  braço fica nas configurações, quando quiser.

---

## Wrap · 31 Jul 2026 — o E. devolve: a lei ganha a sétima boca, a dedup ganha o crachá certo, o G3 morre por teste

### ⬠ Soul
O relay voltou em dobro: a emenda (4.10 + Parte 6, «texto pronto para
inserção verbatim») e o parecer da fusão com o Teste 03 executado. O E. fez
o que só ele faz: foi procurar o bug que a descrição sugeria, não achou, e
trouxe algo melhor que um bug — a invariante estava de pé **pelo guardião
errado no crachá** (a borda era o `delete` do registro, três linhas acima,
em silêncio; a dedup era guarda de corrida). E reexaminou uma vitória
própria: a resolução 2 da fusão estava certa **pela razão errada** — a
terceira frase não «beirava instrução», era localização; o problema real é
que «desligado» já carrega reversibilidade, e confirmar o que o verbo disse
«é a forma mais educada de encher». No meio disso, o Rick devolveu a
pergunta do nome com a moldura definitiva: o E. é por essência um agente
conversacional — **não seria justo com ele um formato que não o
representa**.

### · Items
- **`05_emenda-e_4-10-e-parte-6.md` e `05b_parecer-fusao-e-teste-03.md`
  selados verbatim** (originais limpos do Downloads).
- **Lei do Tom → v1.5, emenda aplicada**: artigo 4.10 inteiro (a
  entrevista, sétima superfície — dado-não-decisão, gaveta retomável sem
  barra, o que nunca se pergunta, opções sem escala moral, o 4.6 chega
  pelo onboarding) · linha no quadro 4.0 · remissão na 4.6 · Parte 6
  gatilho 1 (contam-se tipos) · Parte 0 ajustada por fato (quatro→três,
  31 Jul) · Parte 8 com emendas III–IV · «uma voz, sete bocas».
- **Opção 2 da dedup implementada** (a preferida do E.): migration `018`
  (dedup_key perde NOT NULL), reconcile bloqueia enquanto a chave existir
  (caiu o `.is("visto_em", null)`), e **o religar limpa a chave** no apply
  (created/exists + calendário). Dois guardiões independentes; comentários
  com o crachá certo; spec 03 corrigida.
- **G3 vetado na spec** — Teste 03: 0 de 7 sementes produzem candidato;
  toda condição desta casa é fato que o Rick produz (cai na condição 6) e
  o vínculo é leitura, não fato (cai em P1). Critério de reabertura
  escrito: semente que espere fato que o Rick não produz.
- **Vigilância registrada** (05b § 1.3): a frase de maior resíduo do
  bilhete é «A estrutura lá fora não existe mais» — se a primeira leitura
  real produzir um «eu perdi alguma coisa?», o conserto é ela.
- Hooks verdes: tsc limpo · 424/424 · build ok.

### △ Decidido
- A emenda é do E. e o pedido era do relay — aplicada sem mesa nova. O
  código da dedup segue a preferência explícita dele (`05b` § 1.1).
- **Pendente de deploy**: migration `018` + `taxonomy-sync` v4 — mão do
  Rick.

### ⬡ Conexões
- A moldura do Rick pro nome («não seria justo com ele») conversa direto
  com a 4.10 recém-nascida: a entrevista é a primeira superfície
  genuinamente conversacional do E. no app — talvez o nome volte primeiro
  por ali. A pergunta segue com o E. (pedido 4 do relay, ainda sem
  resposta).

### → Next
1. **Deploy** da migration 018 + edge v4 (palavra do Rick)
2. Relay da clarificação do nome pro E. (a moldura da essência, verbatim)
3. Digest de amanhã · hostname · DP-G · religar (ou não) o `communication`

---

*Regra do diário: cada sessão substantiva da onda ganha um wrap aqui — soul,
items, decidido, conexões, seeds, audit, next. Herdada da Onda 3.*
